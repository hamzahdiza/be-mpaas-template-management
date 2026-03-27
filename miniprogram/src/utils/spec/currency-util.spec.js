import {
  expect,
  test
} from 'vitest'
import {
  currencyFormat,
  percentageFormat,
  findLongestSubstringWithNumericEdges
} from '../currency-util'
import language from '../../public/language-pack.json'

const idLanguage = language.languagePack["id-ID"]

test('Format 330123 and retain 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '330123'
  })).toBe('Rp330.123')
})

test('Format 330123.0 and retain 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '330123.0'
  })).toBe('Rp330.123')
})

test('Format 330123.01 and retain 0 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '330123.01',
    places: 0
  })).toBe('Rp330.123')
})

test('Format 330123.00 and retain 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '330123.00',
  })).toBe('Rp330.123')
})

test('Format 330123.1 and retain 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '330123.1'
  })).toBe('Rp330.123')
})

test('Format 330123.1 and retain 0 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '330123.1',
    places: 0
  })).toBe('Rp330.123')
})

test('Format 330123.101 and retain 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '330123.101'
  })).toBe('Rp330.123')
})

test('Format 330123.10 and retain 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '330123.10'
  })).toBe('Rp330.123')
})

test('Format 123456789.10 and use abbreviations while retaining 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '123456789.10',
    isAbbr: true
  })).toBe(`Rp123,45 ${idLanguage.millionAbbreviation}`)
})

test('Format 123456789.11 and use abbreviations while retaining 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '123456789.11',
    isAbbr: true
  })).toBe(`Rp123,45 ${idLanguage.millionAbbreviation}`)
})

test('Format 123456789 and use abbreviations while retaining 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '123456789',
    isAbbr: true
  })).toBe(`Rp123,45 ${idLanguage.millionAbbreviation}`)
})

test('Format 123456789.01 and use abbreviations while retaining 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '123456789.01',
    isAbbr: true
  })).toBe(`Rp123,45 ${idLanguage.millionAbbreviation}`)
})

test('Format 123456789.1 and use abbreviations while retaining 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '123456789.1',
    isAbbr: true
  })).toBe(`Rp123,45 ${idLanguage.millionAbbreviation}`)
})

test('Format 123456789.101 and use abbreviations while retaining 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '123456789.101',
    isAbbr: true
  })).toBe(`Rp123,45 ${idLanguage.millionAbbreviation}`)
})

test('Format 123456789.00 and use abbreviations while retaining 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '123456789.00',
    isAbbr: true
  })).toBe(`Rp123,45 ${idLanguage.millionAbbreviation}`)
})

test('Format 123456789.001 and use abbreviations while retaining 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '123456789.001',
    isAbbr: true
  })).toBe(`Rp123,45 ${idLanguage.millionAbbreviation}`)
})

test('Format 330000000000.001 and use abbreviations while retaining 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '330000000000.001',
    isAbbr: true
  })).toBe(`Rp330 ${idLanguage.billionAbbreviation}`)
})

test('Format 330000000000 and use abbreviations while retaining 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '330000000000',
    isAbbr: true
  })).toBe(`Rp330 ${idLanguage.billionAbbreviation}`)
})

test('Format 3300000000000 and use abbreviations while retaining 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '3300000000000',
    isAbbr: true
  })).toBe(`Rp3,30 ${idLanguage.trillionAbbreviation}`)
})

test('Format 330110000000 and use abbreviations while retaining 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '330110000000',
    isAbbr: true
  })).toBe(`Rp330,11 ${idLanguage.billionAbbreviation}`)
})

test('Format 330001100000 and use abbreviations while retaining 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '330001100000',
    isAbbr: true
  })).toBe(`Rp330 ${idLanguage.billionAbbreviation}`)
})

test('Format 330011100000 and use abbreviations while retaining 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '330011100000',
    isAbbr: true
  })).toBe(`Rp330,01 ${idLanguage.billionAbbreviation}`)
})

test('Format 330101100000 and use abbreviations while retaining 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '330101100000',
    isAbbr: true
  })).toBe(`Rp330,10 ${idLanguage.billionAbbreviation}`)
})

test('Format 3301011000000000 and use abbreviations while retaining 2 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '3301011000000000',
    isAbbr: true
  })).toBe(`Rp3.301,01 ${idLanguage.trillionAbbreviation}`)
})

test('Format 3301011000000000 and use abbreviations while retaining 0 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '3301011000000000',
    isAbbr: true,
    places: 0
  })).toBe(`Rp3.301,01 ${idLanguage.trillionAbbreviation}`)
})

test('Format 3301011000000000 and use abbreviations while retaining 0 decimal places (on IDR)', () => {
  expect(currencyFormat({
    value: '3301011000000000',
    isAbbr: true,
    places: 3
  })).toBe(`Rp3.301,01 ${idLanguage.trillionAbbreviation}`)
})

test('Format 1789.11 to obtain currency string object and obtain abbreviation', () => {
  expect(currencyFormat({
    value: '1789.11',
    isAbbr: true
  })).toBe('Rp1.789')
})

test('Format 0 to with symbol and space,use percentage format(IDR)', () => {
  expect(percentageFormat(0, true, true)).toBe('0%')
})

test('Format 0 to without symbol and with space,use percentage format(IDR)', () => {
  expect(percentageFormat(0, false, true)).toBe('0%')
})

test('Format 0 to with symbol and without space,use percentage format(IDR)', () => {
  expect(percentageFormat(0, true, false)).toBe('0%')
})

test('Format 0 to without symbol and space,use percentage format(IDR)', () => {
  expect(percentageFormat(0, false, false)).toBe('0%')
})

test('Format 1.234 to with symbol and space,use percentage format(IDR)', () => {
  expect(percentageFormat(1.234, true, true)).toBe('+ 1,23%')
})

test('Format 1.234 to without symbol and with space,use percentage format(IDR)', () => {
  expect(percentageFormat(1.234, false, true)).toBe('1,23%')
})

test('Format 1.234 to with symbol and without space,use percentage format(IDR)', () => {
  expect(percentageFormat(1.234, true, false)).toBe('+1,23%')
})

test('Format 1.234 to without symbol and space,use percentage format(IDR)', () => {
  expect(percentageFormat(1.234, false, false)).toBe('1,23%')
})

test('Format -1.234 to with symbol and space,use percentage format(IDR)', () => {
  expect(percentageFormat(-1.234, true, true)).toBe('- 1,23%')
})

test('Format -1.234 to without symbol and with space,use percentage format(IDR)', () => {
  expect(percentageFormat(-1.234, false, true)).toBe('1,23%')
})

test('Format -1.234 to with symbol and without space,use percentage format(IDR)', () => {
  expect(percentageFormat(-1.234, true, false)).toBe('-1,23%')
})

test('Format -1.234 to without symbol and space,use percentage format(IDR)', () => {
  expect(percentageFormat(-1.234, false, false)).toBe('1,23%')
})

test('Format 1.200 use percentage format(IDR)', () => {
  expect(percentageFormat(1.200, true, true)).toBe('+ 1,20%')
})

test('Format -1.200 use percentage format(IDR)', () => {
  expect(percentageFormat(-1.200, true, true)).toBe('- 1,20%')
})

test('Format 0 to with symbol and space,use percentage format(USD)', () => {
  getApp().globalData.nativeData.language = 'en-ID'
  expect(percentageFormat(0, true, true)).toBe('0%')
})

test('Format 0 to without symbol and with space,use percentage format(USD)', () => {
  expect(percentageFormat(0, false, true)).toBe('0%')
})

test('Format 0 to with symbol and without space,use percentage format(USD)', () => {
  expect(percentageFormat(0, true, false)).toBe('0%')
})

test('Format 0 to without symbol and space,use percentage format(USD)', () => {
  expect(percentageFormat(0, false, false)).toBe('0%')
})

test('Format 1.234 to with symbol and space,use percentage format(USD)', () => {
  expect(percentageFormat(1.234, true, true)).toBe('+ 1.23%')
})

test('Format 1.234 to without symbol and with space,use percentage format(USD)', () => {
  expect(percentageFormat(1.234, false, true)).toBe('1.23%')
})

test('Format 1.234 to with symbol and without space,use percentage format(USD)', () => {
  expect(percentageFormat(1.234, true, false)).toBe('+1.23%')
})

test('Format 1.234 to without symbol and space,use percentage format(USD)', () => {
  expect(percentageFormat(1.234, false, false)).toBe('1.23%')
})

test('Format -1.234 to with symbol and space,use percentage format(USD)', () => {
  expect(percentageFormat(-1.234, true, true)).toBe('- 1.23%')
})

test('Format -1.234 to without symbol and with space,use percentage format(USD)', () => {
  expect(percentageFormat(-1.234, false, true)).toBe('1.23%')
})

test('Format -1.234 to with symbol and without space,use percentage format(USD)', () => {
  expect(percentageFormat(-1.234, true, false)).toBe('-1.23%')
})

test('Format -1.234 to without symbol and space,use percentage format(USD)', () => {
  expect(percentageFormat(-1.234, false, false)).toBe('1.23%')
})

test('Format -1.20 to without symbol and space,use percentage format(USD)', () => {
  expect(percentageFormat(-1.20, false, false)).toBe('1.20%')
})

test('Format 1.200 use percentage format(USD)', () => {
  expect(percentageFormat(1.200, true, true)).toBe('+ 1.20%')
})

test('Format -1.200 use percentage format(USD)', () => {
  expect(percentageFormat(-1.200, true, true)).toBe('- 1.20%')
})

test('Format undefined use percentage format(USD)', () => {
  expect(percentageFormat(undefined, true, true)).toBe('undefined')
})


test('Format -123456 with showNegativeSymbol on (IDR)', () => {
  expect(currencyFormat({
    value: '-123456',
    showNegativeSymbol: true,
    currency: 'IDR'
  })).toBe('-Rp123.456')
})

test('Format 123456 with showNegativeSymbol on (IDR)', () => {
  expect(currencyFormat({
    value: '123456',
    showNegativeSymbol: true,
    currency: 'IDR'
  })).toBe('+Rp123.456')
})

test('Format -1234.56 with showNegativeSymbol on (USD)', () => {
  expect(currencyFormat({
    value: '-1234.56',
    showNegativeSymbol: true,
    currency: 'USD'
  })).toBe('-USD 1,234.56')
})

test('Format 1234.56 with showNegativeSymbol on (USD)', () => {
  expect(currencyFormat({
    value: '1234.56',
    showNegativeSymbol: true,
    currency: 'USD'
  })).toBe('+USD 1,234.56')
})

// Tests for findLongestSubstringWithNumericEdges
test('Find longest numeric substring with edges in "abc1234def5678" for IDR', () => {
  expect(findLongestSubstringWithNumericEdges('abc1234def5678', 'IDR')).toBe('12345678')
})

test('Find longest numeric substring with edges in "abc1234.5678" for USD', () => {
  expect(findLongestSubstringWithNumericEdges('abc1234.5678xyz', 'USD')).toBe('1234')
})

test('Find longest numeric substring in "start123middle456end7890" (IDR)', () => {
  expect(findLongestSubstringWithNumericEdges('start123middle456end7890', 'IDR')).toBe('1234567890')
})

test('Find longest numeric substring in "start123.45end" (USD)', () => {
  expect(findLongestSubstringWithNumericEdges('start123.45end', 'USD')).toBe('123')
})

test('Find longest numeric substring with mixed characters in "xy12345abc67.89z" (USD)', () => {
  expect(findLongestSubstringWithNumericEdges('xy12345abc67.89z', 'USD')).toBe('1234567')
})

test('Find longest numeric substring with no numeric content in "abcdefg" (IDR)', () => {
  expect(findLongestSubstringWithNumericEdges('abcdefg', 'IDR')).toBe('')
})