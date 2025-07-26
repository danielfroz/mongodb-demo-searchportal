import { Query, QueryResult } from '@danielfroz/sloth';
import { Dtos } from "../../mod.ts";

export interface Search extends Query {
  tid: string
  name?: string
  experience?: 'attributes'|'atlassearch'
  filter?: {
    /** device.id */
    devices?: string[]
    /** AccountStatus */
    status?: Dtos.AccountStatus[]
    /** tags */
    tags?: string[]
  }
  pagination?: {
    pos: number,
    max: number
  }
}

export interface SearchResult extends QueryResult {
  elapsed: number
  patients?: Dtos.Patient[]
  total: number
}