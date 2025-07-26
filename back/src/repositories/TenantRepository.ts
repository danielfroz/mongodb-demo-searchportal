import { Dtos } from "commons";

export interface TenantRepository {
  list(): Promise<Dtos.Tenant[]|undefined>
}