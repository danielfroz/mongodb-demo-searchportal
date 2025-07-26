import { AccountStatus, Device } from "./index.ts"

export interface Patient {
  tid: string
  id: string
  tenant: {
    id: string
    name: string
  }
  name: string
  since: Date
  updated?: Date
  status: AccountStatus
  sync?: {
    date: Date
    device: Device
    home: boolean
  }
  tags?: string[]
  attrs?: {
    k: Patient.AttributeKey,
    v: string
  }[]
}

export namespace Patient {
  export const AttributeKeys = [
    'status',
    'device_id',
    'tag'
  ] as const

  export type AttributeKey = typeof AttributeKeys[number]

  /**
   * Pre-computed Filters. Shall be utilized at the front end
   */
  export interface Filters {
    tid: string
    research?: {
      deactivated: boolean
    },
    status?: AccountStatus[]
    devices?: Device[]
    tags?: string[]
  }
}