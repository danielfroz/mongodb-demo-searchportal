'use client'

import { useState } from "react"
import { useSelector } from "react-redux"

const Details = () => {
  const filter = useSelector(state => state.patient.search?.filter)
  const query = useSelector(state => state.patient.search?.query)
  const [ extended, setExtended ] = useState(false)

  return (
    <div className='p-2 m-2 border rounded text-xs cursor-pointer' onClick={() => setExtended(!extended)}>
      <div>filter: {JSON.stringify(filter)}</div>
      {extended && query &&
        <div>
          query: {JSON.stringify(query)}
        </div>
      }
    </div>
  )
}

export default Details