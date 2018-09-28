/* eslint-disable no-undef,no-tabs,no-mixed-spaces-and-tabs */
import transferResponseData from '../../src/utils/transferResponseData'

describe('utils::transferResponseData', () => {
  it('number-string should be converted to number with responseType: json', () => {
    const xhr1 = {
      responseType: 'json',
      response: '123'
    }

    expect(
      transferResponseData(xhr1)
    ).toEqual(123)
  })

  it('number-string shouldn`t be converted to number with responseType: text', () => {
    const xhr1 = {
      responseType: 'text',
      response: '123'
    }

    expect(
      transferResponseData(xhr1)
    ).toEqual('123')
  })

  it('content of JSON.stringify should be converted to json object', () => {
    const xhr = {
      responseType: 'json',
      response: JSON.stringify({ name: 'hx' })
    }

    expect(
      transferResponseData(xhr)
    ).toEqual({ name: 'hx' })
  })

  it('content of json shouldn`t be converted to another type', () => {
    const xhr = {
      responseType: 'json',
      response: { name: 'hx' }
    }

    expect(
      transferResponseData(xhr)
    ).toEqual({ name: 'hx' })
  })
})
