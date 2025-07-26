import { Types } from "@/types.ts";
import { DI } from "@danielfroz/sloth";
import { Dtos } from "commons";
import { Collection } from "mongodb";
import { TenantRepository } from "../index.ts";

const COLLECTION = 'tenants'

export class TenantMongo implements TenantRepository {
  private coll: Collection<Dtos.Tenant>

  constructor(
    db = DI.inject(Types.Database),
  ) {
    this.coll = db.collection<Dtos.Tenant>(COLLECTION)
  }

  async list(): Promise<Dtos.Tenant[] | undefined> {
    const cur = this.coll.find().sort({ name: 1 })
    try {
      return await cur.toArray() || undefined
    }
    finally {
      await cur.close()
    }
  }
}