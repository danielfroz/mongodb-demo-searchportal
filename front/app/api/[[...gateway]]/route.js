import { glog } from '@/app/api/log'

export async function POST(req) {
  const body = await req.json()
  const log = glog.child({ mod: 'api.forum' })

  const path = new URL(req.url).pathname.substring('/api'.length)
  const url = `${process.env.BACK_SERVICE}${path}`

  log.info({ msg: `performing request`, url })

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    if(!res.ok) {
      log.error({ msg: `received error`, url, data })
      return Response.json(data, { status: 500 })
    }
    log.info({ msg: `received data`, url })
    return Response.json(data, { status: 200 })
  }
  catch(error) {
    if(error.cause && error.cause.code === 'ECONNREFUSED')  {
      log.error({ msg: `service is down; connection refused`, url })
      return Response.json({
          error: {
            code: 'network',
            message: 'service is down; connection refused',
            status: 503,
            url,
          }
        }, { status: 503 })
    }
    return Response.json({
        error: {
          code: 'service',
          message: error.message,
          status: 500,
          url
        }
      }, { status: 500 })
  }
}