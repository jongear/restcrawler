import axios, { AxiosRequestConfig } from 'axios'

export default class HttpClient {
  public static async get(uri, headers?) {
    return HttpClient.query('GET', uri, headers)
  }

  public static async post(uri, body, headers?) {
    return HttpClient.query('POST', uri, headers, body)
  }

  public static async put(uri, body, headers?) {
    return HttpClient.query('PUT', uri, headers, body)
  }

  public static async delete(uri, headers?) {
    return HttpClient.query('DELETE', uri, headers)
  }

  public static async query(method, uri, headers?, body?: any) {
    let baseHeaders = {
      'Content-type': 'application/json',
    }

    if (headers) {
      baseHeaders = {
        ...baseHeaders,
        ...headers,
      }
    }

    const options: AxiosRequestConfig = {
      method: method,
      url: uri,
      headers: baseHeaders,
      data: body,
    }

    return new Promise<any>((resolve, reject) => {
      return axios(options).then(res => {
        try {
          if (res.status > 299) {
            return reject({
              message:
                uri + ' (' + res.status + ') - ' + JSON.parse(res.data).message,
              ...JSON.parse(res.data).error,
            })
          }
          resolve(res.data)
        } catch (err) {
          reject(err)
        }
      })
    })
  }
}
