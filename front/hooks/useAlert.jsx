'use client'

import { AlertTriangleIcon, InfoIcon } from "lucide-react"
import { toast } from "sonner"

const DURATION = 4 * 1000

export const useAlert = () => {
  return {
    info: (message) => {
      if(typeof(message) === 'object') {
        toast(`${JSON.stringify(message)}`, {
          duration: DURATION,
          icon: <InfoIcon/>
        })
      }
      else {
        toast(message)
      }
    },
    error: (error) => {
      if(typeof(error) === 'object') {
        console.log('alert.error: ', error)

        if(error.error?.code) {
          const e = (
            <div className='flex flex-col gap-2'>
              <div className='font-semibold'>Error caught while processing your request!</div>
              <div>{error.error.status}: {error.error.code}</div>
              {error.error.message && <div>{error.error.message}</div>}
              {error.error.url && <div>{error.error.url}</div>}
            </div>
          )
          toast(e, {
            duration: DURATION,
            icon: <AlertTriangleIcon/>
          })
        }
        else if(error.message) {
          toast.error(error.message)
        }
        else {
          toast.error(`${JSON.stringify(error)}`)
        }
      }
      else {
        toast.error(error)
      }
    }
  }
}