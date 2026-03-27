import { expect, test } from 'vitest'
import { isDomainWhitelisted } from '../checkDomainWhiteList.js'

test('should return true if domain is in whitelist without www', () => {
  const whitelistArr = ['example.com', 'google.com']
  const url = 'https://example.com/path/to/resource'
  
  const result = isDomainWhitelisted(url, whitelistArr)
  
  expect(result).toBe(true)
})

test('should return true if domain is in whitelist with www', () => {
  const whitelistArr = ['example.com', 'google.com']
  const url = 'https://www.example.com/path/to/resource'
  
  const result = isDomainWhitelisted(url, whitelistArr)
  
  expect(result).toBe(true)
})

test('should return false if domain is not in whitelist', () => {
  const whitelistArr = ['example.com', 'google.com']
  const url = 'https://nonexistentdomain.com/path/to/resource'
  
  const result = isDomainWhitelisted(url, whitelistArr)
  
  expect(result).toBe(false)
})

test('should return true if domain is in whitelist with www, case insensitive', () => {
  const whitelistArr = ['example.com', 'google.com']
  const url = 'https://www.example.com/path/to/resource'
  
  const result = isDomainWhitelisted(url, whitelistArr)
  
  expect(result).toBe(true)
})

test('should return true if domain is in whitelist with www, case insensitive', () => {
  const whitelistArr = ['example.com', 'google.com']
  const url = 'example.com/path/to/resource'
  
  const result = isDomainWhitelisted(url, whitelistArr)
  
  expect(result).toBe(true)
})

test('should handle URLs with no domain and return false', () => {
  const whitelistArr = ['example.com', 'google.com'];
  const url = '';

  const result = isDomainWhitelisted(url, whitelistArr);

  expect(result).toBe(false);
});

test('should return false if domain is not in whitelist with www and case insensitive', () => {
  const whitelistArr = ['example.com', 'google.com']
  const url = 'https://www.nonexistentdomain.com/path/to/resource'
  
  const result = isDomainWhitelisted(url, whitelistArr)
  
  expect(result).toBe(false)
})
