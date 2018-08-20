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
      console.info(`- class crawlRequest - CALLING ${uri}`)

      return axios(options)
        .then(res => {
          try {
            if (res.status > 299) {
              return reject({
                message:
                  uri +
                  ' (' +
                  res.status +
                  ') - ' +
                  JSON.parse(res.data).message,
                ...JSON.parse(res.data).error,
              })
            }
            resolve(res.data)
          } catch (err) {
            reject(err)
          }
        })
        .catch(error => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error(error.response.data)
            console.error(error.response.status)
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.error(error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error(error.message)
          }
          reject(error)
        })
    })
  }
}
