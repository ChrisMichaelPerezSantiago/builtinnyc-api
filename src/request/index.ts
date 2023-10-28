import type { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios'
import axios from 'axios'
import config from '../config'

class RequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RequestError'
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

const Http = axios.create({
  baseURL: config.baseUrl,
})

export default function request<T>(
  method: Method = 'GET',
  slug: string,
  data?: any,
  config?: AxiosRequestConfig,
  signal?: AbortSignal,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let cancelToken: CancelTokenSource | undefined

    if (signal) {
      cancelToken = axios.CancelToken.source()
      signal.addEventListener('abort', () => {
        cancelToken?.cancel('Request aborted')
      })
    }

    Http({
      method,
      url: `/${slug}`,
      data,
      ...config,
      cancelToken: cancelToken?.token,
    })
      .then((response: AxiosResponse<T>) => resolve(response.data))
      .catch((error: unknown) => {
        if (axios.isCancel(error)) {
          reject(new Error('Request was aborted'))
        }
        else {
          const axiosError = error as AxiosError
          if (axiosError.response)
            reject(new RequestError(`Request failed with status ${axiosError.response.status}`))

          else if (axiosError.request)
            reject(new RequestError('No response received from the server'))

          else
            reject(new RequestError('Error setting up the request'))
        }
      })
  })
}
