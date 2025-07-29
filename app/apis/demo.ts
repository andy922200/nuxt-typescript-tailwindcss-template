import { HTTPMethod } from '~/types'
import type { createHttpClient } from '~/utils'

interface getADemoRes {
  id: number
  userId: number
  title: string
  body: string
}

export type DemoAPI = ReturnType<typeof createDemoAPI>
export const createDemoAPI = (fetcher: ReturnType<typeof createHttpClient>) => {
  const getADemo = async ({ id }: { id: string }) => {
    try {
      const res = await fetcher<getADemoRes>({
        method: HTTPMethod.GET,
        url: '/',
        params: { id },
      })

      return [res, null]
    } catch (err) {
      return [null, err]
    }
  }

  const postDemo = async ({ data }: { data: Record<string, any> }) => {
    try {
      const res = await fetcher({
        method: HTTPMethod.POST,
        url: '/',
        data,
      })

      return [res, null]
    } catch (err) {
      return [null, err]
    }
  }

  return {
    getADemo,
    postDemo,
  }
}
