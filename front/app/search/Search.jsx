'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useAlert, useApi } from "@/hooks"
import * as r from '@/lib/redux'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { v4 } from "uuid"
import Details from "./Details"
import ExperienceSelector from './ExperienceSelector'
import Filters from './Filters'

const Search = () => {
  const api = useApi()
  const alert = useAlert()
  const dispatch = useDispatch()
  const tenant = useSelector(state => state.tenant.tenant)
  const searchFilter = useSelector(state => state.patient.search?.filter)
  const pagination = useSelector(state => state.patient.search?.pagination)
  const reload = useSelector(state => state.patient.search?.reload) ?? 0
  const result = useSelector(state => state.patient.search?.result) || {}
  const [ experience, setExperience ] = useState('')
  const [ name, setName ] = useState('')
  const [ loading, setLoading ] = useState(false)

  useEffect(() => {
    search()
  }, [ reload ])

  function search() {
    setLoading(true)
    const id = v4()
    const query = {
      id,
      sid: id,
      tid: tenant.id,
      name: name !== '' ? name: undefined,
      experience: experience && (experience === 'atlassearch' || experience === 'attributes') ?
        experience :
        undefined,
      filter: searchFilter,
      pagination
    }
    api.post('/api/patient/search', query)
      .then(res => {
        setLoading(false)
        dispatch(r.patientSearchQuery(query))
        dispatch(r.patientPatients(res.patients))
        dispatch(r.patientSearchResult({
          total: res.total,
          elapsed: res.elapsed
        }))
      })
      .catch(error => {
        setLoading(false)
        alert.error({ id, error })
      })
  }

  return (
    <form onSubmit={e => {
      e.preventDefault()
      search()
    }}>
      <div>
        <div className='flex flex-row gap-2 w-full px-2'>
          <Select>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Name'/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='name'>Name</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input value={name} onChange={(e) => setName(e.target.value)}/>
          <ExperienceSelector setExperience={setExperience}/>
          <Button disabled={loading}>Search</Button>
        </div>
        <div className='px-2'>
          <Filters/>
        </div>

        <Details/>

        {result &&
          <div className='m-2 p-2 border rounded text-xs'>
            <div className='font-bold'>Performance</div>
            <div>
              Elapsed time: {result.elapsed}ms
            </div>
            <div>
              Total records: {result.total}
            </div>
          </div>
        }
      </div>
    </form>
  )
}

export default Search