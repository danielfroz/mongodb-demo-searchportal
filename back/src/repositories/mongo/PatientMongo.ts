import { DI, Errors } from "@danielfroz/sloth";
import { Dtos } from "commons";
import { Collection, ObjectId } from "mongodb";
import { Types } from "../../types.ts";
import { PatientRepository } from "../index.ts";

const COLLECTION = 'patients'
const SEARCH_IDX = 'patients'

/**
 * Default listing projection
 */
const projectionDefault = {
  _id: 1,
  tenant: 1,
  name: 1,
  since: 1,
  updated: 1,
  status: 1, 
  sync: 1,
  tags: 1
}

/**
 * Facets expected output
 */
interface FacetBucketResponse {
  _id: string
  count: number
}
interface FacetResponse {
  facet: {
    devices?: {
      buckets: FacetBucketResponse[]
    },
    tags?: {
      buckets: FacetBucketResponse[]
    }
  }
}

/**
 * This is the Mongo implementation using the Pre-computed pattern:
 * Values are pre-computed and saved under specialized collections, guaranteeing
 * the performance and scalability of the application
 */
export class PatientMongo implements PatientRepository {
  private readonly coll: Collection<Dtos.Patient>
  private readonly collFilters: Collection<Dtos.Patient.Filters>

  constructor(
    db = DI.inject(Types.Database),
    private readonly log = DI.inject(Types.Log),
  ) {
    this.coll = db.collection<Dtos.Patient>(COLLECTION)
    this.collFilters = db.collection<Dtos.Patient.Filters>(COLLECTION+'Filters')
  }

  /**
   * Responsible to pre-compute the filters based on Patient dao (profile).
   * Store the info to support fast lookups.
   */
  async buildFilters(args: PatientRepository.BuildFilters): Promise<void> {
    if(!args)
      throw new Errors.ArgumentError('args')
    if(!args.tid)
      throw new Errors.ArgumentError('args.tid')

    const { tid, since, experience } = args

    const log = this.log.child({ mod: 'buildfilters', tid })

    // compute values based on filters info...
    // computation is done in memory as we're just calculating the delta...
    const tagsSet = new Set<string>()
    const devicesMap = new Map<string, Dtos.Device>()

    // compute existing tags...
    const filters = await this.collFilters.findOne({ tid }) || {
      tid,
      // no need to compute statuses as they are static...
      status: [ 'Activated', 'Invite pending', 'Not invited' ],
    } as Dtos.Patient.Filters

    // pre-populate with existing values;
    // eliminates the duplicated...
    if(filters.tags) {
      filters.tags.forEach(x => tagsSet.add(x))
    }
    if(filters.devices) {
      filters.devices.forEach(x => devicesMap.set(x.id, x))
    }

    if(experience && experience === 'atlassearch') {
      // Building Filters using Atlas Search FACETS
      // 
      // Full build as FACETS are more performatic...
      // 
      tagsSet.clear()
      devicesMap.clear()

      const cur = this.coll.aggregate([
        {
          $searchMeta: {
            index: SEARCH_IDX,
            facet: {
              operator: {
                equals: {
                  path: 'tid',
                  value: tid,
                }
              },
              facets: {
                devices: {
                  type: 'string',
                  path: 'sync.device.id'
                },
                tags: {
                  type: 'string',
                  path: 'tags'
                }
              }
            },
            count: {
              type: 'total'
            }
          }
        }
      ])
      try {
        const facets = await cur.toArray() as FacetResponse[]
        log.info({ msg: 'facets', facets })
        if(facets && facets[0] && facets[0].facet) {
          const facet = facets[0].facet
          // console.log('facets: ', JSON.stringify(facet, null, 2))
          if(facet.devices?.buckets) {
            for(const r of facet.devices.buckets) {
              const id = r._id
              // usually we have devices into another collection, but we're keeping this code simple and just have one collection for patients
              // so we collect data from patient...
              const patient = await this.coll.findOne({ 'sync.device.id': id })
              if(patient) {
                const device = {
                  id,
                  name: patient.sync?.device.name ?? 'unknown',
                  model: patient.sync?.device.model ?? 'unknown'
                }
                devicesMap.set(device.id, device)
              }
            }
          }
          if(facet.tags?.buckets) {
            for(const r of facet.tags.buckets) {
              const tag = r._id
              tagsSet.add(tag)
            }
          }
        }
      }
      finally {
        await cur.close()
      }
    }
    else {
      // 
      // Building Filters using standard Mongo
      // Note that in order to be efficient we're computing patients which are updated from the last day
      // 
      const filter = { tid } as any
      if(since != null) {
        filter.updated = { $gte: since }
      }
      const cur = this.coll.find(filter)
      try {
        while(await cur.hasNext()) {
          const patient = await cur.next()
          if(!patient)
            continue
          if(patient.tags) {
            for(const tag of patient.tags)
              tagsSet.add(tag)
          }
          if(patient.sync?.device?.name) {
            devicesMap.set(patient.sync.device.id, patient.sync.device)
          }
        }
      }
      finally {
        await cur.close()
      }
    }

    // keep the information sorted
    const devices = Array.from(devicesMap.values()).sort((a, b) => {
      if(a.name > b.name)
        return 1
      if(a.name < b.name)
        return -1
      return 0
    })
    const tags = Array.from(tagsSet).sort((a, b) => {
      if(a > b)
        return 1
      if(a < b)
        return -1
      return 0
    })

    // updating existing values
    filters.devices = devices
    filters.tags = tags

    log.info({ msg: 'updating filters', filters })

    // now persisting the new filters.
    await this.collFilters.replaceOne({ tid }, filters, { upsert: true })
  }

  async get(args: PatientRepository.Get): Promise<Dtos.Patient | undefined> {
    if(!args)
      throw new Errors.ArgumentError('args')
    const { tid, id } = args
    const query = {
      tid,
      _id: new ObjectId(id)
    }
    const doc = await this.coll.findOne(query)
    if(!doc)
      return undefined
    return {
      ...doc,
      id: doc._id.toString(),
    }
  }

  async getFilters(args: PatientRepository.GetFilters): Promise<Dtos.Patient.Filters | undefined> {
    if(!args)
      throw new Errors.ArgumentError('args')
    if(!args.tid)
      throw new Errors.ArgumentError('args.tid')
    const { tid } = args
    return await this.collFilters.findOne({ tid }) || undefined
  }

  async saveFilters(args: PatientRepository.SaveFilters): Promise<void> {
    if(!args)
      throw new Errors.ArgumentError('args')
    if(!args.filters)
      throw new Errors.ArgumentError('args.filters')
    const { filters } = args
    await this.collFilters.replaceOne({ tid: filters.tid }, filters, { upsert: true })
  }

  async search(args: PatientRepository.Search): Promise<PatientRepository.SearchResult> {
    if(!args)
      throw new Errors.ArgumentError('args')
    if(!args.tid)
      throw new Errors.ArgumentError('args.tid')

    const { experience } = args

    if(experience != null && experience === 'attributes') {
      return await this._searchAttrs(args)
    }
    else if(experience != null && experience === 'atlassearch') {
      return await this._searchSearch(args)
    }
    else {
      return await this._searchDefault(args) 
    }
  }

  async _searchAttrs(args: PatientRepository.Search): Promise<PatientRepository.SearchResult> {
    if(!args)
      throw new Errors.ArgumentError('args')
    if(!args.tid)
      throw new Errors.ArgumentError('args.tid')

    const { tid, pagination, filter, name } = args

    const log = this.log.child({ mod: 'repos.patient.search.attrs' })

    const limits = {
      skip: pagination?.pos ?? 0,
      limit: pagination?.max ?? 50
    }
    const query = { tid } as any
    if(name != null) {
      query.name = { $regex: name, $options: 'i' }
    }
    if(filter) {
      if(filter.devices && filter.devices.length > 0) {
        if(query['$and'] == null) {
          query['$and'] = []
        }
        query['$and'].push({ 
          attrs: {
            $elemMatch: { k: 'device_id', v: { $in: filter.devices }}
          }
        })
      }
      if(filter.status && filter.status.length > 0) {
        if(query['$and'] == null) {
          query['$and'] = []
        }
        query['$and'].push({
          attrs: {
            $elemMatch: { k: 'status', v: { $in: filter.status }}
          }
        })
      }
      if(filter.tags && filter.tags.length > 0) {
        if(query['$and'] == null) {
          query['$and'] = []
        }
        query['$and'].push({
          attrs: {
            $elemMatch: { k: 'tag', v: { $in: filter.tags }}
          }
        })
      }
    }

    log.info({ msg: 'searching using query', query, limits, projection: projectionDefault })

    const total = await this.coll.countDocuments(query)
    if(!total) {
      return {
        total: 0
      }
    }

    const cur = this.coll.find(query, { projection: projectionDefault })
      .sort({ name: 1 })
      .skip(limits.skip)
      .limit(limits.limit)
    try {
      const list = await cur.toArray()
      const patients = list.map(x => ({
        ...x,
        id: x._id.toString(),
      }))
      return {
        patients,
        total
      }
    }
    finally {
      await cur.close()
    }
  }

  async _searchDefault(args: PatientRepository.Search): Promise<PatientRepository.SearchResult> {
    if(!args)
      throw new Errors.ArgumentError('args')
    if(!args.tid)
      throw new Errors.ArgumentError('args.tid')

    const { tid, pagination, filter, name } = args

    const log = this.log.child({ mod: 'repos.patient.search.default' })

    const limits = {
      skip: pagination?.pos ?? 0,
      limit: pagination?.max ?? 50
    }
    const query = { tid } as any
    if(name != null) {
      query.name = { $regex: name, $options: 'i' }
    }
    if(filter) {
      if(filter.devices && filter.devices.length > 0) {
        query['sync.device.id'] = { $in: filter.devices }
      }
      if(filter.status && filter.status.length > 0) {
        query['status'] = { $in: filter.status }
      }
      if(filter.tags && filter.tags.length > 0) {
        query['tags'] = { $in: filter.tags }
      }
    }

    log.info({ msg: 'searching using query', query, limits, projection: projectionDefault })

    const total = await this.coll.countDocuments(query)
    if(!total) {
      return {
        total: 0
      }
    }

    const cur = this.coll.find(query, { projection: projectionDefault })
      .sort({ name: 1 })
      .skip(limits.skip)
      .limit(limits.limit)
    try {
      const list = await cur.toArray()
      const patients = list.map(x => ({
        ...x,
        id: x._id.toString(),
      }))
      return {
        patients,
        total
      }
    }
    finally {
      await cur.close()
    }
  }

  async _searchSearch(args: PatientRepository.Search): Promise<PatientRepository.SearchResult> {
    if(!args)
      throw new Errors.ArgumentError('args')
    if(!args.tid)
      throw new Errors.ArgumentError('args.tid')

    const { tid, name, filter, pagination } = args

    const log = this.log.child({ mod: 'repos.patient.searchSearch', tid })

    const limits = {
      skip: pagination?.pos ?? 0,
      limit: pagination?.max ?? 50
    }

    const must = [
      {
        equals: {
          path: 'tid',
          value: tid
        }
      }
    ] as any

    if(name != null) {
      must.push({
        autocomplete: {
          path: 'name',
          query: name
        }
      })
    }
    if(filter != null) {
      if(filter.devices && filter.devices.length > 0) {
        must.push({
          in: {
            path: 'sync.device.id',
            value: filter.devices,
          }
        })
      }
      if(filter.status && filter.status.length > 0) {
        must.push({
          in: {
            path: 'status',
            value: filter.status,
          }
        })
      }
      if(filter.tags && filter.tags.length > 0) {
        // we could use in operator, but using compound nested here as example...
        // Should give us more flexibility. Setting minimumShouldMatch to 1, give us the same result as $in: []
        must.push({
          compound: {
            should: filter.tags.map(x => ({
              equals: {
                path: 'tags',
                value: x,
              },
            })),
            minimumShouldMatch: 1
          }
        })
      }
    }

    // calculating total
    let total = 0
    const curTotal = this.coll.aggregate([
      {
        $searchMeta: {
          index: SEARCH_IDX,
          compound: { must },
          count: {
            type: 'total',
          }
        }
      }
    ]) 
    try {
      const [ res ] = await curTotal.toArray()
      total = res?.count?.total || 0
    }
    finally {
      await curTotal.close()
    }

    const pipeline = [
      {
        $search: {
          index: SEARCH_IDX,
          compound: { must },
          sort: {
            name: 1,
          }
        }
      },
      { $skip: limits.skip },
      { $limit: limits.limit },
      { $project: projectionDefault }
    ]

    log.info({ msg: 'searching using query', query: pipeline })
    log.info({ msg: 'total', total })

    const cur = this.coll.aggregate<Dtos.Patient & { _id: ObjectId }>(pipeline)
    try {
      const result = await cur.toArray()
      // console.log(r)
      const patients = result?.map(x=> ({
        ...x,
        id: x._id.toString(),
      }))
      return {
        patients,
        total
      }
    }
    finally {
      await cur.close()
    }
  }

  async updateAttrs(args: PatientRepository.UpdateAttrs): Promise<void> {
    if(!args)
      throw new Errors.ArgumentError('args')
    const { tid, id, attrs } = args
    await this.coll.updateOne({ tid, _id: new ObjectId(id) }, {
      $set: {
        attrs
      }
    })
  }

  async updateStatus(args: PatientRepository.UpdateStatus): Promise<void> {
    if(!args)
      throw new Errors.ArgumentError('args')
    const { tid, id, status } = args
    await this.coll.updateOne({ tid, _id: new ObjectId(id) }, {
      $set: {
        updated: new Date(),
        status
      }
    })
  }

  async updateTags(args: PatientRepository.UpdateTags): Promise<void> {
    if(!args)
      throw new Errors.ArgumentError('args')
    const { tid, id, tags } = args
    await this.coll.updateOne({ tid, _id: new ObjectId(id) }, {
      $set: {
        updated: new Date(),
        tags
      }
    })
  }
}