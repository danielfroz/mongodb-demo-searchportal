import { Types } from "@/types.ts";
import { DI, Errors, QueryHandler } from "@danielfroz/sloth";
import { Cqrs } from 'commons';

export class SearchHandler implements QueryHandler<Cqrs.Patient.Search, Cqrs.Patient.SearchResult> {
  constructor(
    private readonly rp = DI.inject(Types.Repos.Patient),
    private readonly log = DI.inject(Types.Log)
  ) {}

  async handle(query: Cqrs.Patient.Search): Promise<Cqrs.Patient.SearchResult> {
    if(!query)
      throw new Errors.ArgumentError('query')
    if(!query.id)
      throw new Errors.ArgumentError('query.id')
    if(!query.sid)
      throw new Errors.ArgumentError('query.sid')
    if(!query.tid)
      throw new Errors.ArgumentError('query.tid')

    const { id, sid, tid, name, experience, filter, pagination } = query

    const log = this.log.child({ mod: 'patient.search', sid })

    let elapsed = 0

    const start = Date.now()
    const res = await this.rp.search({ tid, name, filter, experience, pagination })
    const end = Date.now()

    elapsed = end - start

    log.info({ msg: `patient search result`, records: res.total, elapsed })

    return {
      id,
      sid,
      elapsed,
      patients: res.patients,
      total: res.total,
    }
  }
}