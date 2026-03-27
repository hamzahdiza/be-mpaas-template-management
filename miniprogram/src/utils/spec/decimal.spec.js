import {
  expect,
  test
} from 'vitest'
import decimal from "../decimal"

test('plus()', () => {
  expect(decimal().plus(0.1, 0.2)).toBe('0.3')
  expect(decimal().plus('0.1', 0.2)).toBe('0.3')
  expect(decimal().plus(1.123456, 2.3456)).toBe('3.469056')
  expect(decimal().plus(undefined, 2.3456)).toBe('2.3456')
})

test('minus()', () => {
  expect(decimal().minus(0.2, 0.1)).toBe('0.1')
  expect(decimal().minus('0.2', 0.1)).toBe('0.1')
  expect(decimal().minus(2.123456, 1.3456)).toBe('0.777856')
})

test('divide()', () => {
  expect(decimal().divide('355', '113')).toBe('3.1415929203539823009')
})

test('multiply()', () => {
  expect(decimal().multiply(6, 0.3)).toBe('1.8')
})