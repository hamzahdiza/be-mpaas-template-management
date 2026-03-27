import {
  expect,
  test
} from 'vitest'
import {
  bigTruncRetain, supplementFloatPartZero
} from "../number-util";

test('Truncate 12345 to 2 decimal places', () => {
  expect(bigTruncRetain('12345.00', 2)).toBe('12345')
})

test('Truncate 12345 to 2 decimal places', () => {
  expect(bigTruncRetain('12345', 2)).toBe('12345')
})
test('Truncate 12345.00006 to 4 decimal places', () => {
  expect(bigTruncRetain('12345.00006', 4)).toBe('12345')
})

test('Truncate 12345.0000 to 4 decimal places', () => {
  expect(bigTruncRetain('12345.0000', 4)).toBe('12345')
})

test('Truncate 12345.0 to 2 decimal places', () => {
  expect(bigTruncRetain('12345.0', 2)).toBe('12345')
})

test('Truncate 12345.6 to 2 decimal places', () => {
  expect(bigTruncRetain('12345.6', 2)).toBe('12345.6')
})

test('Truncate 12345.60 to 2 decimal places', () => {
  expect(bigTruncRetain('12345.60', 2)).toBe('12345.6')
})

test('Truncate 12345.60 to 0 decimal places', () => {
  expect(bigTruncRetain('12345.60', 0)).toBe('12345')
})

test('Truncate 0.60 to 0 decimal places', () => {
  expect(bigTruncRetain('0.60', 0)).toBe('0')
})

test('Truncate 0.60 to 1 decimal places', () => {
  expect(bigTruncRetain('0.60', 1)).toBe('0.6')
})

test('Truncate 0.60 to 2 decimal places', () => {
  expect(bigTruncRetain('0.60', 2)).toBe('0.6')
})

test('Determine whether the decimal part "230" needs to be filled with 0',()=>{
  expect(supplementFloatPartZero('230',2)).toBe(false)
})

test('Determine whether the decimal part "2" needs to be filled with 0',()=>{
  expect(supplementFloatPartZero('2',2)).toBe(true)
})

test('Determine whether the decimal part "0" needs to be filled with 0',()=>{
  expect(supplementFloatPartZero('0',2)).toBe(false)
})