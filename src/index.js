import { Proxy } from './proxy'

export default async (structure, headers) => {
  const proxy = new Proxy(structure, headers)
  return proxy.generate()
}
