/* eslint-disable no-undef,no-tabs,no-mixed-spaces-and-tabs */
import findMatchStrategy from '../../src/utils/findMatchStrategy'

describe('utils::findMatchStrategy', () => {
  it('all should be match rule', () => {
    let strategy = {
      urlExp: '*'
    }

    expect(
      findMatchStrategy(strategy, '/test')
    ).toEqual(strategy)

    expect(
      findMatchStrategy(strategy, '/')
    ).toEqual(strategy)

    expect(
      findMatchStrategy(strategy, 'http://www.test.com?name=hx')
    ).toEqual(strategy)
  })

  it('should be match rules with Regexp', () => {
    let strategy = {
      urlExp: /test/g
    }

    expect(
      findMatchStrategy(strategy, '/test')
    ).toEqual(strategy)

    expect(
      findMatchStrategy(strategy, '/')
    ).toEqual(null)

    expect(
      findMatchStrategy(strategy, 'http://www.test.com?name=hx')
    ).toEqual(strategy)
  })

  it('should be match rules with path', () => {
    let strategy = {
      urlExp: 'www.test.com/path?name=hx'
    }

    expect(
      findMatchStrategy(strategy, 'www.test.com/path?name=hx')
    ).toEqual(strategy)

    expect(
      findMatchStrategy(strategy, '/')
    ).toEqual(null)

    expect(
      findMatchStrategy(strategy, 'http://www.test.com?name=hx')
    ).toEqual(null)
  })

  it('should be match rules with path', () => {
    let strategy = [{
      urlExp: 'www.test.com/path?name=hx'
    }, {
      urlExp: /test/g
    }, {
      urlExp: '*'
    }]

    expect(
      findMatchStrategy(strategy, 'www.test.com/path?name=hx')
    ).toEqual(strategy[0])

    expect(
      findMatchStrategy(strategy, '/')
    ).toEqual(strategy[2])

    expect(
      findMatchStrategy(strategy, 'http://www.test.com?name=hx')
    ).toEqual(strategy[1])
  })
})
