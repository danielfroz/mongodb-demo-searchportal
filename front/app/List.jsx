'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useAlert, useApi } from "@/hooks"
import * as r from '@/lib/redux'
import { format } from 'date-fns'
import { Plus } from "lucide-react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { v4 } from "uuid"

const List = () => {
  const patients = useSelector(state => state.patient.patients)

  return (
    <ul className='p-2 border rounded'>
      <li className='grid grid-cols-4 gap-2 text-xs'>
        <div>Patient</div>
        <div>Last Sync</div>
        <div>Time in range</div>
        <div>Tags</div>
      </li>
      {patients && patients.map((p, idx) => 
        <Row key={idx} patient={p}/>
      )}
    </ul>
  )
}

export default List

const Row = ({ patient }) => {
  return (
    <li className='grid grid-cols-4 gap-2 hover:bg-accent/50 rounded p-2'>
      <div>
        <div>{patient.name}</div>
        <div className='flex flex-row gap-2 flex-wrap text-xs'>
          <div>{format(patient.since, 'dd/MM/yyyy')}</div>
          <div><Separator orientation="vertical"/></div>
          <div>{patient.status}</div>
        </div>
      </div>
      <div>
        {patient.sync &&
          <div>
            {patient.sync.device &&
              <div className='text-sm'>
                <div>{patient.sync.device.name}</div>
                {patient.sync.device.model}
              </div>
            }
          </div>
        }
      </div>
      <div></div>
      <Tags patient={patient}/>
    </li>
  )
}

const Tags = ({ patient }) => {
  const [ showAddTags, setShowAddTags ] = useState(false)

  return (
    <div>
      <div className='flex flex-row gap-2 items-center'>
        {!showAddTags && <div 
            className='cursor-pointer' 
            onClick={() => setShowAddTags(!showAddTags)}>
            <Plus size={14}/>
          </div>
        }
        <div className='flex flex-row flex-wrap gap-2 text-xs'>
          {patient.tags && patient.tags.map((tag, idx) =>
            <div key={idx} className='bg-primary/10 p-2 rounded-lg'>
              {tag}
            </div>
          )}
        </div>
      </div>
      {showAddTags && <AddTag patient={patient} dismiss={() => setShowAddTags(false)}/>}
    </div>
  )
}

const AddTag = ({ patient, dismiss }) => {
  const api = useApi()
  const alert = useAlert()
  const dispatch = useDispatch()
  const tenant = useSelector(state => state.tenant.tenant)
  const [ tag, setTag ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const [ error, setError ] = useState('')

  function save() {
    setError(undefined)
    if(tag === '') {
      setError('Tag required')
      return
    }

    const tags = patient.tags != null && patient.tags.length > 0 ?
      [ ...patient.tags, tag ]:
      [ tag ]
    setLoading(true)
    const id = v4()
    const cmd = {
      id,
      sid: id,
      tid: tenant.id,
      patient: patient._id,
      tags
    }
    api.post('/api/patient/update/tags', cmd)
      .then(_res => {
        setLoading(false)
        alert.info('Patient updated')
        dispatch(r.patientSearchReload(Date.now()))
        dismiss()
      })
      .catch(error => {
        setLoading(false)
        alert.error({ id, error })
      })
  }

  return (
    <form onSubmit={e => {
      e.preventDefault()
      save()
    }}>
      <label className='text-xs'>Tag</label>
      <Input className='bg-white' value={tag} onChange={e => setTag(e.target.value)}/>
      <Button size={'sm'} type='submit' disabled={loading}>Add</Button>
      <Button size={'sm'} type='button' onClick={() => dismiss()}>Cancel</Button>
      {error && <div className='text-xs text-red-600'>{error}</div>}
    </form>
  )
}