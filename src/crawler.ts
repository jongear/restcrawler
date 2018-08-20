import HttpClient from './httpClient'
import CrawlRequest from './models/crawlRequest'
import ModelTransforms from './models/modelTransforms'

export default class Crawler {
  private headers: any

  constructor(headers?: any) {
    this.headers = this.setHeaders(headers)
  }

  public async crawl(request: CrawlRequest) {
    return this.process({}, request)
  }

  private async process(parentModel: any, request: CrawlRequest | any) {
    if (!request || Object.keys(request).length === 0) {
      return parentModel
    }

    let requestModel = {}
    let model = {}

    if (request.$route) {
      requestModel = await this.processRequest(request)

      if (requestModel === null) {
        requestModel = {}
      }
    }

    if (request.$model) {
      if (Object.keys(requestModel).length === 0) {
        requestModel = parentModel
        parentModel = {}
      }

      if (requestModel instanceof Array) {
        if (
          parentModel instanceof Object &&
          Object.keys(parentModel).length === 0
        ) {
          parentModel = []
        }
        const newArrayModel = []
        for (const reqMod of requestModel) {
          const itemModel = {}
          for (const key of Object.keys(request.$model)) {
            if (key in ModelTransforms) {
              continue
            }

            const prop = request.$model[key]

            if (typeof prop === 'string') {
              // tslint:disable-next-line:prefer-conditional-expression
              if (reqMod instanceof Array) {
                itemModel[prop] = reqMod
              } else {
                itemModel[prop] = reqMod[key] || null
              }
            } else if (prop instanceof Array) {
              itemModel[key] = prop
            } else if (prop instanceof Object) {
              const val = await this.process(reqMod[key], prop)
              itemModel[key] = val
            }
          }

          newArrayModel.push(itemModel)
        }
        model = newArrayModel
      } else {
        for (const key of Object.keys(request.$model)) {
          if (key in ModelTransforms) {
            continue
          }
          const prop = request.$model[key]

          if (typeof prop === 'string') {
            // tslint:disable-next-line:prefer-conditional-expression
            if (requestModel instanceof Array) {
              model[prop] = requestModel
            } else {
              model[prop] = requestModel[key] || null
            }
          } else if (prop instanceof Array) {
            model[key] = prop
          } else if (prop instanceof Object) {
            console.log(JSON.stringify(prop))
            const val = await this.process(requestModel[key], prop)
            model[key] = val
          }
        }
      }
    }

    parentModel = this.mutate(parentModel, model, request)

    return parentModel
  }

  private async processRequest(request: CrawlRequest): Promise<any> {
    if (!request.$route) {
      return null
    }

    console.info(
      `GETTING URI: ${request.$route} with ${request.$routeIdentifiers}`
    )

    let path = request.$route
    if (request.$routeIdentifiers) {
      Object.keys(request.$routeIdentifiers).forEach(key => {
        path = path.replace(key, request.$routeIdentifiers[key])
      })
    }

    return HttpClient.get(path, this.headers)
  }

  private async mutate(parentModel, model, request) {
    if (request.$flatten && model instanceof Array && model.length < 2) {
      parentModel = {
        ...parentModel,
        ...model[0],
      }
    } else {
      if (parentModel instanceof Array || model instanceof Array) {
        parentModel = parentModel.concat(model)
      } else {
        parentModel = {
          ...parentModel,
          ...model,
        }
      }
    }

    return parentModel
  }

  private setHeaders(reqHeaders) {
    reqHeaders = reqHeaders || {}
    const localOptions = {
      'Content-type': reqHeaders['Content-type'] || 'application/json',
    }

    Object.keys(reqHeaders).forEach(key => {
      localOptions[key] = reqHeaders[key]
    })

    return localOptions
  }
}
