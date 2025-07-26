'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { useAlert, useApi } from "@/hooks"
import * as r from '@/lib/redux'
import { ArrowDown, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { v4 } from "uuid"

const Filters = () => {
  const api = useApi()
  const alert = useAlert()
  const dispatch = useDispatch()
  const [ visible, setVisible ] = useState(false)
  const [ loading, setLoading ] = useState(false)
  const tenant = useSelector(state => state.tenant.tenant)

  useEffect(() => {
    dispatch(r.patientFilters(undefined))
    if(visible) {
      load()
    }
  }, [ visible ])

  function load() {
    setLoading(true)
    const id = v4()
    const query = {
      id,
      sid: id,
      tid: tenant.id
    }
    api.post('/api/patient/get/filters', query)
      .then(res => {
        setLoading(false)
        dispatch(r.patientFilters(res.filters))
      })
      .catch(error => {
        setLoading(false)
        alert.error({ id, error })
      })
  }

  return (
    <section className='my-2 p-2 border rounded'>
      <div className='flex flex-row gap-2 items-center cursor-pointer select-none text-sm'
        onClick={() => setVisible(!visible)}>
        Filters {!visible ? <ArrowRight className='size-4'/>: <ArrowDown className='size-4'/>}
      </div>
      {loading && <div>Loading...</div>}
      {visible &&
        <List/>
      }
    </section>
  )
}

export default Filters

const List = () => {
  const dispatch = useDispatch()
  const filters = useSelector(state => state.patient.filters)
  const [ statuses, setStatuses ] = useState([])
  const [ tags, setTags ] = useState([])
  const [ devices, setDevices ] = useState([])

  useEffect(() => {
    const searchFilter = {
      devices: devices,
      status: statuses,
      tags: tags,
    }
    dispatch(r.patientSearchFilter(searchFilter))
  }, [ statuses, tags, devices ])

  if(!filters) {
    return null
  }

  // console.log('filters: ', filters)
  // console.log('statuses: ', statuses)

  return (
    <div>
      {filters.status && 
        <ul>
          <li className='text-xs font-bold'>Status</li>
          {filters.status.map((s, idx) =>
            <li key={idx}>
              <label className='grid grid-cols-[2rem_1fr] items-center cursor-pointer'>
                <Checkbox checked={statuses.find(x => x === s) != null} onCheckedChange={e => {
                  const set = new Set(statuses)
                  if(e) {
                    set.add(s)
                  }
                  else {
                    set.delete(s)
                  }
                  setStatuses(Array.from(set.values()))
                }}/>
                <div>{s}</div>
              </label>
            </li>
          )}
        </ul>
      }
      {filters.devices &&
        <ul className='my-1'>
          <li className='text-xs font-bold'>Devices</li>
          {filters.devices.map((device, idx) =>
            <li key={idx}>
              <label className='grid grid-cols-[2rem_1fr] items-center cursor-pointer'>
                <Checkbox checked={devices.find(x => x === device.id) != null}
                  onCheckedChange={e => {
                    const set = new Set(devices)
                    e ? set.add(device.id): set.delete(device.id)
                    setDevices(Array.from(set.values()))
                  }}/>
                {device.name} - {device.model}
              </label>
            </li>
          )}
        </ul>
      }
      {filters && filters.tags &&
        <ul className='my-1'>
          <li className='text-xs font-bold'>Tags</li>
          {filters.tags.map((tag, idx) =>
            <li key={idx}>
              <label className='grid grid-cols-[2rem_1fr] items-center cursor-pointer'>
                <Checkbox checked={tags.find(x => x === tag) != null} onCheckedChange={e => {
                  const set = new Set(tags)
                  e ? set.add(tag): set.delete(tag)
                  setTags(Array.from(set.values()))
                }}/>
                {tag}
              </label>
            </li>
          )}
        </ul>
      }
    </div>
  )
}
