'use client'

import { useAlert, useApi } from "@/hooks"
import * as r from '@/lib/redux'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { v4 } from "uuid"

const TenantSelector = () => {
  const api = useApi()
  const alert = useAlert()
  const dispatch = useDispatch()
  const tenant = useSelector(state => state.tenant.tenant)
  const tenants = useSelector(state => state.tenant.tenants)
  const [ loading, setLoading ] = useState(false)

  useEffect(() => {
    if(!tenant) {
      load()
    }
  }, [ tenant ])

  function load() {
    setLoading(true)
    const id = v4()
    const query = {
      id,
      sid: id
    }
    api.post('/api/tenant/list', query)
      .then(res => {
        setLoading(false)
        console.log('res: ', res)
        dispatch(r.tenantTenants(res.tenants))
      })
      .catch(error => {
        setLoading(false)
        alert.error({ id, error })
      })
  }

  function select(tenant) {
    dispatch(r.tenantTenant(tenant))
  }

  if(tenant) {
    return null
  }

  return (
    <section className='p-2 border rounded'>
      {loading && <div>Loading...</div>}
      <div className='p-2 text-xs'>Select the Company / Tenant that you want to work with ...</div>
      <ul>
        {tenants && tenants.map((t, idx) =>
          <li key={idx} className='p-2 cursor-pointer hover:bg-accent rounded' onClick={() => select(t)}>
            <div>{t.name}</div>
          </li>
        )}
      </ul>
    </section>
  )
}

export default TenantSelector