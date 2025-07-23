import type { $Fetch, FetchOptions } from 'ofetch'
import type { useRoute } from 'vue-router'

export const getLanguage = (): string => {
  let language = ''
  if (typeof window !== 'undefined') {
    language = window.navigator.language.toLowerCase()
  }
  return language
}

export const addDotBeforeUrl = ({ str, addDot = false }: { str: string; addDot: boolean }) =>
  addDot ? `.${str}` : str

export const getImgUrl = ({
  domain,
  clientKey,
  path,
}: {
  domain: string
  clientKey: string
  path: string
}) => {
  const prefix = domain === '/' ? '' : domain.replace(/\/$/, '') // 去掉結尾斜線
  return `${prefix}/${clientKey}/${path}`
}

export const updateRouteMeta = ({
  router,
  data,
}: {
  router: ReturnType<typeof useRoute>
  data: { key: string; value: Record<string, any> }[]
}) => {
  if (!router) return

  data.forEach((item) => {
    router.meta[item.key] = item.value
  })
}

export const scrollTo = (hashPath: string = '') => {
  const el = document.querySelector(hashPath)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

/**
 * Creates an HTTP request function using the provided fetcher.
 * @param fetcher An instance of $Fetch
 * @returns A function to make API requests.
 */
export const createHttpClient = <T>(fetcher: $Fetch) => {
  return async function call({
    method,
    url,
    data,
    params,
    fetchOptions,
  }: {
    method: string
    url: string
    data?: object
    params?: object
    fetchOptions?: FetchOptions<'json'>
  }): Promise<T> {
    return fetcher<T>(url, {
      method,
      body: data ? JSON.stringify(data) : undefined,
      params: params || undefined,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      onRequest: () => {
        // console.log('config on Req', req)
      },
      onRequestError: () => {
        // console.log('config on Req Error', req)
      },
      onResponse: () => {
        // console.log('config on Res', res)
      },
      onResponseError: () => {
        // console.log('config on Res Error', res)
      },
      ...fetchOptions,
    })
  }
}
