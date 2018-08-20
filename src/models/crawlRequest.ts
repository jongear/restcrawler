export default class CrawlRequest {
  public $route: string
  public $routeIdentifiers: ICrawlRouteIdentifiers
  public $model: any

  constructor(
    route?: string,
    routeIdentifiers?: ICrawlRouteIdentifiers,
    model?: any
  ) {
    this.$route = route
    this.$routeIdentifiers = routeIdentifiers
    this.$model = model
  }
}

export interface ICrawlRouteIdentifiers {
  [key: string]: string
}
