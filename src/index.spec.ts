import Crawler from '.'
import HttpClient from './httpClient'
import CrawlRequest from './models/crawlRequest'
const mockGet = jest.fn()
jest.unmock('./httpClient')
HttpClient.get = mockGet

beforeEach(() => {
  mockGet.mockClear()
})

describe('given no inputs', () => {
  test('retun null', async () => {
    const crawler = new Crawler()
    const result = await crawler.crawl(null)

    expect(result).toEqual({})
  })
})

describe('given an empty object', () => {
  test('retun an empty object', async () => {
    const crawler = new Crawler()
    const result = await crawler.crawl(new CrawlRequest())

    expect(result).toEqual({})
  })
})

describe('given flat object response', () => {
  const returnObj = {
    lastUpdatedOn: '2018-06-28T23:11:00.000Z',
    firstName: 'fname',
    lastName: 'lname',
  }

  beforeEach(() => {
    mockGet.mockImplementationOnce(() => returnObj)
  })

  test('only want one property', async () => {
    const expected = {
      firstName: 'fname',
    }
    const crawler = new Crawler()
    const request = new CrawlRequest('https://api.myservice.com', null, {
      firstName: 'firstName',
    })

    const actual = await crawler.crawl(request)

    expect(actual).toEqual(expected)
  })

  test('want all properties', async () => {
    const crawler = new Crawler()
    const request = new CrawlRequest('https://api.myservice.com', null, {
      lastUpdatedOn: 'lastUpdatedOn',
      firstName: 'firstName',
      lastName: 'lastName',
    })

    const actual = await crawler.crawl(request)

    expect(actual).toEqual(returnObj)
  })

  test('rename one property', async () => {
    const expected = {
      sirName: 'lname',
    }
    const crawler = new Crawler()
    const request = new CrawlRequest('https://api.myservice.com', null, {
      lastName: 'sirName',
    })

    const actual = await crawler.crawl(request)

    expect(actual).toEqual(expected)
  })

  test(`requesting a property that doesn't exist returns null`, async () => {
    const expected = {
      bingo: null,
    }
    const crawler = new Crawler()
    const request = new CrawlRequest('https://api.myservice.com', null, {
      bingo: 'bingo',
    })

    const actual = await crawler.crawl(request)

    expect(actual).toEqual(expected)
  })
})

describe('given an array', () => {
  const returnObj = [
    {
      lastUpdatedOn: '2018-06-28T23:11:00.000Z',
      firstName: 'fname1',
      lastName: 'lname1',
    },
    {
      lastUpdatedOn: '2018-06-29T23:11:00.000Z',
      firstName: 'fname2',
      lastName: 'lname2',
    },
  ]

  beforeEach(() => {
    mockGet.mockImplementationOnce(() => returnObj)
  })

  test('only want one property', async () => {
    const expected = [
      {
        firstName: 'fname1',
      },
      {
        firstName: 'fname2',
      },
    ]
    const crawler = new Crawler()
    const request = new CrawlRequest('https://api.myservice.com', null, {
      firstName: 'firstName',
    })

    const actual = await crawler.crawl(request)

    expect(actual).toEqual(expected)
  })

  test('want all properties', async () => {
    const crawler = new Crawler()
    const request = new CrawlRequest('https://api.myservice.com', null, {
      lastUpdatedOn: 'lastUpdatedOn',
      firstName: 'firstName',
      lastName: 'lastName',
    })

    const actual = await crawler.crawl(request)

    expect(actual).toEqual(returnObj)
  })

  test('rename one property', async () => {
    const expected = [
      {
        sirName: 'lname1',
      },
      {
        sirName: 'lname2',
      },
    ]

    const crawler = new Crawler()
    const request = new CrawlRequest('https://api.myservice.com', null, {
      lastName: 'sirName',
    })

    const actual = await crawler.crawl(request)

    expect(actual).toEqual(expected)
  })

  test(`requesting a property that doesn't exist returns null`, async () => {
    const expected = [
      {
        bingo: null,
      },
      {
        bingo: null,
      },
    ]
    const crawler = new Crawler()
    const request = new CrawlRequest('https://api.myservice.com', null, {
      bingo: 'bingo',
    })

    const actual = await crawler.crawl(request)

    expect(actual).toEqual(expected)
  })
})

describe('given a single item array', () => {
  const returnObj = [
    {
      lastUpdatedOn: '2018-06-28T23:11:00.000Z',
      firstName: 'fname',
      lastName: 'lname',
    },
  ]

  beforeEach(() => {
    mockGet.mockImplementationOnce(() => returnObj)
  })

  test(`flattening causes array to become an object`, async () => {
    const expected = {
      lastUpdatedOn: '2018-06-28T23:11:00.000Z',
      firstName: 'fname',
      lastName: 'lname',
    }
    const crawler = new Crawler()
    const request = {
      $route: 'https://api.myservice.com',
      $routeIdentifiers: {},
      $model: {
        lastUpdatedOn: 'lastUpdatedOn',
        firstName: 'firstName',
        lastName: 'lastName',
      },
      $flatten: true,
    } as CrawlRequest

    const actual = await crawler.crawl(request)

    expect(actual).toEqual(expected)
  })
})

describe('given null server response', () => {
  beforeEach(() => {
    mockGet.mockImplementationOnce(() => null)
  })

  test('only want one property', async () => {
    const expected = {
      firstName: null,
    }
    const crawler = new Crawler()
    const request = new CrawlRequest('https://api.myservice.com', null, {
      firstName: 'firstName',
    })

    const actual = await crawler.crawl(request)

    expect(actual).toEqual(expected)
  })

  test('want all properties', async () => {
    const expected = {
      lastUpdatedOn: null,
      firstName: null,
      lastName: null,
    }
    const crawler = new Crawler()
    const request = new CrawlRequest('https://api.myservice.com', null, {
      lastUpdatedOn: 'lastUpdatedOn',
      firstName: 'firstName',
      lastName: 'lastName',
    })

    const actual = await crawler.crawl(request)

    expect(actual).toEqual(expected)
  })

  test('rename one property', async () => {
    const expected = {
      sirName: null,
    }
    const crawler = new Crawler()
    const request = new CrawlRequest('https://api.myservice.com', null, {
      lastName: 'sirName',
    })

    const actual = await crawler.crawl(request)

    expect(actual).toEqual(expected)
  })

  test(`requesting a property that doesn't exist returns null`, async () => {
    const expected = {
      bingo: null,
    }
    const crawler = new Crawler()
    const request = new CrawlRequest('https://api.myservice.com', null, {
      bingo: 'bingo',
    })

    const actual = await crawler.crawl(request)

    expect(actual).toEqual(expected)
  })
})
