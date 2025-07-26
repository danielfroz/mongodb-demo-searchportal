/**
 * Generates the indexes to support the Search
 */
import { Utils } from 'commons'
import { MongoClient } from 'mongodb'

const config = await Utils.ConfigUtils.load()
const client = new MongoClient(config.mongo.uri)
await client.connect()

const db = client.db(config.mongo.db)
const collPatients = db.collection('patients')

console.log('creating indexes...')
/**
 * Creating index to support DEFAULT Search:
 * { tid: 'tid', name: $regex...,  status?: { $in: [ 'status1' ]}, tags: { $in: ['tag1', 'tag2']}, sync.device.id: { $in: ['deviceid1'] } } 
 */
await collPatients.createIndex({ tid: 1, name: 1, 'sync.device.id': 1, tags: 1, status: 1, updated: 1 })
/**
 * Creating index to support Attribute Pattern search
 * { tid: tid, name: 1, 'attrs.k', 1, 'attrs.v': 1 }
 */
await collPatients.createIndex({ tid: 1, name: 1, 'attrs.k': 1, 'attrs.v': 1, updated: 1 })

console.log('creating Patients search index')
const PATIENTS_SEARCH_INDEX = 'patients'

const patientsIndexDefinition = {
  mappings: {
    dynamic: false,
    fields: {
      tid: { type: 'token' },
      name: [
        { type: 'token' },
        { type: 'autocomplete' },
      ],
      updated: { type: 'date' },
      status: { type: 'token' },
      tags: { type: 'token' },
      sync: {
        type: 'document',
        fields: {
          device: {
            type: 'document',
            fields: {
              name: { type: 'token' },
              id: { type: 'token' }
            }
          }
        }
      }
    }
  },
  storedSource: {
    include: [
      '_id',
      'name'
    ]
  }
}
const searchIndexesCursor = collPatients.listSearchIndexes()
const searchIndexes = await searchIndexesCursor.toArray()
searchIndexesCursor.close()
const exists = searchIndexes.find(x => x.name === PATIENTS_SEARCH_INDEX) != null
if(exists) {
  // updating existing
  console.log('updating existing Search index...')
  await collPatients.updateSearchIndex(PATIENTS_SEARCH_INDEX, patientsIndexDefinition)
}
else {
  console.log('creating new Search Index...')
  await collPatients.createSearchIndex({
    name: PATIENTS_SEARCH_INDEX,
    definition: patientsIndexDefinition
  })
}

console.log('indexes created')

await client.close()
Deno.exit(0)
