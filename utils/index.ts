import type { $Fetch, FetchOptions } from 'ofetch'

export const getLanguage = (): string => {
  let language = ''
  if (typeof window !== 'undefined') {
    language = window.navigator.language.toLowerCase()
  }
  return language
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
