import { Types } from "@/types.ts";
import { DI, Errors, QueryHandler } from "@danielfroz/sloth";
import { Cqrs } from "commons";

export class GetFiltersHandler implements QueryHandler<Cqrs.Patient.GetFilters, Cqrs.Patient.GetFiltersResult> {
  constructor(
    private readonly rp = DI.inject(Types.Repos.Patient),
    private readonly log = DI.inject(Types.Log)
  ) {}

  async handle(query: Cqrs.Patient.GetFilters): Promise<Cqrs.Patient.GetFiltersResult> {
    if(!query)
      throw new Errors.ArgumentError('query')

    const { id, sid, tid } = query

    const log = this.log.child({ mod: 'patient.get.filters', sid })

    const filters = await this.rp.getFilters({ tid })
    if(!filters) {
      log.info({ msg: 'building filters' })
      await this.rp.buildFilters({ tid })
    }

    return {
      id,
      sid,
      filters
    }
  }
}