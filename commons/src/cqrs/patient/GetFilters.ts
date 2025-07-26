import { Query, QueryResult } from "@danielfroz/sloth";
import { Dtos } from "../../mod.ts";

export interface GetFilters extends Query {
  tid: string
}
export interface GetFiltersResult extends QueryResult {
  filters?: Dtos.Patient.Filters
}