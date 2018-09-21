/* eslint-disable no-undef,no-tabs,no-mixed-spaces-and-tabs */
import { matchType, matchInstance, containedInArr } from '../../src/utils/matcher'
import { TYPE_NUMBER, TYPE_STRING, TYPE_OBJECT } from '../../src/config/baseType'

describe('utils::matchType', () => {
  it('should be `number`', () => {
    expect(
      matchType(12321, TYPE_NUMBER)
    ).toEqual(true)
  })

  it('should be `string`', () => {
    expect(
      matchType('123321', TYPE_NUMBER)
    ).toEqual(false)

    expect(
      matchType('123321', TYPE_STRING)
    ).toEqual(true)
  })

  it('should be `object`', () => {
    expect(
      matchType([], TYPE_OBJECT)
    ).toEqual(true)

    expect(
      matchType({}, TYPE_OBJECT)
    ).toEqual(true)
  })
})

describe('utils::matchInstance', () => {
  it('should be instance of `RegExp`', () => {
    expect(
      matchInstance(/12321/, RegExp)
    ).toEqual(true)
  })
})

describe('utils::containedInArr', () => {
  it('should accept undefined for variable', () => {
    expect(
      containedInArr(1, undefined)
    ).toEqual(false)
  })

  it('should be contained', () => {
    expect(
      containedInArr(1, [1, 2, 3])
    ).toEqual(true)
  })

  it('shouldn`t be contained', () => {
    expect(
      containedInArr('1', [1, 2, 3])
    ).toEqual(false)
  })

  it('shouldn`t be contained because the stack address of objects are not the same', () => {
    expect(
      containedInArr({}, [{}, 2, 3])
    ).toEqual(false)
  })
})
