/**
 * Author: Daniel Froz <daniel.froz@mongodb.com>
 * Helps with the fetch api... In real application handles JWT refresh token
 */

export const useApi = () => {
  const api = {
    post: async (url, data, options) => {
      if(!url)
        throw new Error('api.url.required')
      if(!data)
        throw new Error('api.data.required')
      try {
        const r = await fetch(url, {
            method: 'POST',
            // headers: options && options.headers ? options.headers: undefined,
            body: data instanceof FormData ? data: JSON.stringify(data)
          })
        const json = await r.json()
        if(!r.ok) {
          throw { status: json.status, error: json.error }
        }
        return json
      }
      catch(error) {
        if(error.error) {
          throw error
        }
        throw { status: 500, error: { code: 'fetch', message: error?.message }}
      }
    }
  }
  return api
}