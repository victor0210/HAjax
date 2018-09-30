/* eslint-disable no-undef,no-tabs,no-mixed-spaces-and-tabs */
import mergeConfig from '../../src/utils/mergeConfig'
import defaults from '../../src/config/initConfig.ts'

describe('utils::mergeConfig', () => {
  it('should accept undefined for second argument', () => {
    expect(mergeConfig(defaults, undefined)).toEqual(defaults)
  })

  it('should accept type except object for second argument', () => {
    expect(mergeConfig(defaults, 12321)).toEqual(defaults)
  })

  it('should cover default timeout', () => {
    expect(
      mergeConfig(defaults, { timeout: 2000 }).timeout
    ).toEqual(2000)
  })

  it('should cover default header`s [Content-Type]', () => {
    expect(
      mergeConfig(defaults, {
        headers: {
          'Content-Type': 'new-content-type'
        }
      }).headers['Content-Type']
    ).toEqual('new-content-type')
  })

  it('should not cover default header`s [Content-Type]', () => {
    expect(
      mergeConfig(defaults, {
        headers: {
          'Auth': 'auth-header'
        }
      }).headers
    ).toEqual({
      'Content-Type': 'application/json',
      'Auth': 'auth-header'
    })
  })
})
