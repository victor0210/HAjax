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

  it('should contact baseURL and url', () => {
    expect(
      urlFormat('http://www.base.com', 'path')
    ).toEqual('http://www.base.com/path')
  })

  it('should just baseURL 1', () => {
    expect(
      urlFormat('http://www.base.com/')
    ).toEqual('http://www.base.com')
  })

  it('should just baseURL 2', () => {
    expect(
      urlFormat('http://www.base.com')
    ).toEqual('http://www.base.com')
  })

  it('should just baseURL 3', () => {
    expect(
      urlFormat('http://www.base.com/', '/')
    ).toEqual('http://www.base.com')
  })

  it('should parse params 1', () => {
    expect(
      urlFormat('http://www.base.com/', 'path', { name: 'hx' })
    ).toEqual('http://www.base.com/path?name=hx')
  })

  it('should parse params 2', () => {
    expect(
      urlFormat('http://www.base.com/', 'path', { name: 'hx', age: 20 })
    ).toEqual('http://www.base.com/path?name=hx&age=20')
  })

  it('should parse params 3', () => {
    expect(
      urlFormat('http://www.base.com/', '/path/po', { name: 'hx', age: 20 })
    ).toEqual('http://www.base.com/path/po?name=hx&age=20')
  })

  it('should parse params 4', () => {
    expect(
      urlFormat('http://www.base.com/', '/path/po', { name: 'hx', age: 20, obj: { o1: 'o1' } })
    ).toEqual('http://www.base.com/path/po?name=hx&age=20&obj=[object Object]')
  })

  it('should parse params 5', () => {
    expect(
      urlFormat('http://www.base.com/', '/path/po', { name: 'hx', age: 20, obj: [1, 2] })
    ).toEqual('http://www.base.com/path/po?name=hx&age=20&obj=1,2')
  })
})
