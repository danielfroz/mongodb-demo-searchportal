import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'tenant',
  initialState: {
    tenant: undefined,
    tenants: undefined
  },
  reducers: {
    tenantTenant(state, action) {
      return {
        ...state,
        tenant: action.payload,
      }
    },
    tenantTenants(state, action) {
      return {
        ...state,
        tenants: action.payload,
      }
    },
  }
})

export const {
  tenantTenant,
  tenantTenants,
} = slice.actions

export const tenant = slice.reducer