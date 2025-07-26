import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'patient',
  initialState: {
    filters: undefined,
    patients: undefined,
    search: {
      filter: undefined,
      pagination: {
        pos: undefined,
        max: undefined,
      },
      query: undefined,
      reload: undefined,
      result: {
        elapsed: undefined,
        total: undefined,
      }
    }
  },
  reducers: {
    patientFilters(state, action) {
      return {
        ...state,
        filters: action.payload,
      }
    },
    patientPatients(state, action) {
      return {
        ...state,
        patients: action.payload,
      }
    },
    patientSearchFilter(state, action) {
      return {
        ...state,
        search: {
          ...state.search,
          filter: action.payload
        }
      }
    },
    patientSearchPagination(state, action) {
      return {
        ...state,
        search: {
          ...state.search,
          pagination: action.payload
        }
      }
    },
    patientSearchQuery(state, action) {
      return {
        ...state,
        search: {
          ...state.search,
          query: action.payload,
        }
      }
    },
    patientSearchReload(state, action) {
      return {
        ...state,
        search: {
          ...state.search,
          reload: action.payload
        }
      }
    },
    patientSearchResult(state, action) {
      return {
        ...state,
        search: {
          ...state.search,
          result: action.payload
        }
      }
    }
  }
})

export const {
  patientFilters,
  patientPatients,
  patientSearchFilter,
  patientSearchPagination,
  patientSearchQuery,
  patientSearchReload,
  patientSearchResult,
} = slice.actions

export const patient = slice.reducer