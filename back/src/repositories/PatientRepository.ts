import { Dtos } from 'commons'

export interface PatientRepository {
  buildFilters(args: PatientRepository.BuildFilters): Promise<void>
  get(args: PatientRepository.Get): Promise<Dtos.Patient | undefined>
  getFilters(args: PatientRepository.GetFilters): Promise<Dtos.Patient.Filters | undefined>
  // save(args: PatientRepository.Save): Promise<void>
  search(args: PatientRepository.Search): Promise<PatientRepository.SearchResult>
  updateAttrs(args: PatientRepository.UpdateAttrs): Promise<void>
  updateStatus(args: PatientRepository.UpdateStatus): Promise<void>
  updateTags(args: PatientRepository.UpdateTags): Promise<void>
}

export namespace PatientRepository {
  export interface BuildFilters {
    tid: string
    since?: Date
    experience?: 'atlassearch'|'mongo'
  }

  export interface Get {
    tid: string
    id: string
  }

  export interface GetFilters {
    tid: string
  }

  export interface SaveFilters {
    filters: Dtos.Patient.Filters
  }

  export interface Search {
    tid: string
    // if none is passed, then use the default...
    experience?: 'attributes'|'atlassearch'
    name?: string
    filter?: {
      devices?: string[]
      status?: Dtos.AccountStatus[]
      tags?: string[]
    }
    pagination?: {
      pos: number
      max: number
    }
  }

  export interface SearchResult {
    patients?: Dtos.Patient[]
    total: number
  }

  export interface UpdateAttrs {
    tid: string
    id: string
    attrs?: {
      k: Dtos.Patient.AttributeKey,
      v: string
    } []
  }

  export interface UpdateStatus {
    tid: string
    id: string
    status: Dtos.AccountStatus
  }

  export interface UpdateTags {
    tid: string
    id: string
    tags?: string[]
  }
}