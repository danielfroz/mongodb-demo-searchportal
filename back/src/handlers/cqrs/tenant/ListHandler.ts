import { Types } from "@/types.ts";
import { DI, QueryHandler } from "@danielfroz/sloth";
import { Cqrs } from "commons";

export class ListHandler implements QueryHandler<Cqrs.Tenant.List, Cqrs.Tenant.ListResult> {
  constructor(
    private readonly rt = DI.inject(Types.Repos.Tenant)
  ) {}

  async handle(query: Cqrs.Tenant.List): Promise<Cqrs.Tenant.ListResult> {
    const { id, sid } = query

    const tenants = await this.rt.list()

    return {
      id,
      sid,
      tenants
    }
  }
}