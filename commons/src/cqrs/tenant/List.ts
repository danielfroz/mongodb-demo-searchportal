import { Query, QueryResult } from "@danielfroz/sloth";
import { Dtos } from "../../mod.ts";

export interface List extends Query {}
export interface ListResult extends QueryResult {
  tenants?: Dtos.Tenant[]
}