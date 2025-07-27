import { Types } from "@/types.ts";
import { DI, QueryHandler } from "@danielfroz/sloth";
import { Cqrs } from "commons";

export class ListHandler implements QueryHandler<Cqrs.Tenant.List, Cqrs.Tenant.ListResult> {
  constructor(
    private readonly rt = DI.inject(Types.Repos.Tenant),
    private readonly log = DI.inject(Types.Log)
  ) {}

  async handle(query: Cqrs.Tenant.List): Promise<Cqrs.Tenant.ListResult> {
    const { id, sid } = query

    const log = this.log.child({ mod: 'tenant.list' })

    const tenants = await this.rt.list()

    log.info({ msg: `returning ${tenants?.length ?? 0} tenants` })

    return {
      id,
      sid,
      tenants
    }
  }
}