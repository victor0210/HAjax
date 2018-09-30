/* eslint-disable no-undef,no-tabs,no-mixed-spaces-and-tabs */
import urlFormat from '../../src/utils/urlFormat'

describe('utils::urlFormat', () => {
  it('should prefix slash with url 1', () => {
    expect(
      urlFormat(undefined, 'path')
    ).toEqual('/path')
  })

  it('should prefix slash with url 2', () => {
    expect(
      urlFormat(undefined, 'path/')
    ).toEqual('/path')
  })

  it('should contact baseUrl and url', () => {
    expect(
      urlFormat('http://www.base.com', 'path')
    ).toEqual('http://www.base.com/path')
  })

  it('should just baseUrl 1', () => {
    expect(
      urlFormat('http://www.base.com/')
    ).toEqual('http://www.base.com')
  })

  it('should just baseUrl 2', () => {
    expect(
      urlFormat('http://www.base.com')
    ).toEqual('http://www.base.com')
  })

  it('should just baseUrl 3', () => {
    expect(
      urlFormat('http://www.base.com/', '/')
    ).toEqual('http://www.base.com')
  })

  it('should parse params 1', () => {
    expect(
      urlFormat('http://www.base.com/', 'path', { name: 'mx' })
    ).toEqual('http://www.base.com/path?name=mx')
  })

  it('should parse params 2', () => {
    expect(
      urlFormat('http://www.base.com/', 'path', { name: 'mx', age: 20 })
    ).toEqual('http://www.base.com/path?name=mx&age=20')
  })

  it('should parse params 3', () => {
    expect(
      urlFormat('http://www.base.com/', '/path/po', { name: 'mx', age: 20 })
    ).toEqual('http://www.base.com/path/po?name=mx&age=20')
  })

  it('should parse params 4', () => {
    expect(
      urlFormat('http://www.base.com/', '/path/po', { name: 'mx', age: 20, obj: { o1: 'o1' } })
    ).toEqual('http://www.base.com/path/po?name=mx&age=20&obj=[object Object]')
  })

  it('should parse params 5', () => {
    expect(
      urlFormat('http://www.base.com/', '/path/po', { name: 'mx', age: 20, obj: [1, 2] })
    ).toEqual('http://www.base.com/path/po?name=mx&age=20&obj=1,2')
  })
})
