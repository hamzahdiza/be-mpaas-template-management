import { describe, it, vi } from "vitest";
import request from "../request"

describe('request.js', () => {

  my.featureCheckModalFunc = vi.fn()
  my.call = vi.fn((param1, param2, callback) => { callback() })

  describe('API Status = 401', () => {
    it('execute request api and return 401', async () => {
      my.request = vi.fn(({ success: callback1, fail: callback2, complete: callback3 }) => {
        callback1({ data: { data: { token: '', refreshToken: '' } } })
        callback2({ status: 401 })
        callback3()
      })
      my.call = vi.fn(() => {})
      request({
        url: '/wealth-mf/v1/mutual-fund-products',
        headers: {}
      }, global.Page({ data: {} }))
      await delay(50)
      my.call = vi.fn((param1, param2, callback) => { callback() })
    })
  })

  describe('API Status = 409', () => {
    it('toNearestBranch, GNR-000-005', async () => {
      my.request = vi.fn(({ success: callback1, fail: callback2, complete: callback3 }) => {
        callback1({})
        callback2({ statusCode: 409, data: { errorCode: 'GNR-000-005' } })
        callback3()
      })
      request({
        url: '/bill-payment/v1/biller/execution',
        headers: {}
      }, global.Page({ data: {} }))
      await delay(50)
    })

    it('toSplashScreen, UMS-002-116', async () => {
      my.request = vi.fn(({ success: callback1, fail: callback2, complete: callback3 }) => {
        callback1({})
        callback2({ statusCode: 409, data: { errorCode: 'UMS-002-116' } })
        callback3()
      })
      request({
        url: '/bill-payment/v1/biller/execution',
        headers: {}
      }, global.Page({ data: {} }))
      await delay(50)
    })

    it('validateUSerCredentialResetPassword, GNR-000-004', async () => {
      my.request = vi.fn(({ success: callback1, fail: callback2, complete: callback3 }) => {
        callback1({})
        callback2({ statusCode: 409, data: { errorCode: 'GNR-000-004' } })
        callback3()
      })
      request({
        url: '/bill-payment/v1/biller/execution',
        headers: {}
      }, global.Page({ data: {} }))
      await delay(50)
    })

    it('validateUSerCredentialProvisioning, GNR-000-003', async () => {
      my.request = vi.fn(({ success: callback1, fail: callback2, complete: callback3 }) => {
        callback1({})
        callback2({ statusCode: 409, data: { errorCode: 'GNR-000-003' } })
        callback3()
      })
      request({
        url: '/bill-payment/v1/biller/execution',
        headers: {}
      }, global.Page({ data: {} }))
      await delay(50)
    })

    it('toHomeScreen, GNR-000-904', async () => {
      my.request = vi.fn(({ success: callback1, fail: callback2, complete: callback3 }) => {
        callback1({})
        callback2({ statusCode: 409, data: { errorCode: 'GNR-000-904' } })
        callback3()
      })
      request({
        url: '/bill-payment/v1/biller/execution',
        headers: {}
      }, global.Page({ data: {} }))
      await delay(50)
    })

    it('generalError, GTW-XXX-XXX', async () => {
      my.request = vi.fn(({ success: callback1, fail: callback2, complete: callback3 }) => {
        callback1({})
        callback2({ statusCode: 409, data: { errorCode: 'GTW-000-904' } })
        callback3()
      })
      request({
        url: '/bill-payment/v1/biller/execution',
        headers: {}
      }, global.Page({ data: {} }))
      await delay(50)
    })

    it('not include in the error list', async () => {
      my.request = vi.fn(({ success: callback1, fail: callback2, complete: callback3 }) => {
        callback1({})
        callback2({ statusCode: 409, data: { errorCode: 'GNR-000-555' } })
        callback3()
      })
      request({
        url: '/bill-payment/v1/biller/execution',
        headers: {}
      }, global.Page({ data: {} }))
      await delay(50)
    })

    it('not contain data', async () => {
      my.request = vi.fn(({ success: callback1, fail: callback2, complete: callback3 }) => {
        callback1({})
        callback2({ statusCode: 409 })
        callback3()
      })
      request({
        url: '/bill-payment/v1/biller/execution',
        headers: {}
      }, global.Page({ data: {} }))
      await delay(50)
    })
  })


  describe('API Status = 503', () => {
    it('errorCode is GNR-000-997', async () => {
      my.request = vi.fn(({ success: callback1, fail: callback2, complete: callback3 }) => {
        callback1({})
        callback2({ statusCode: 503, data: { errorCode: 'GNR-000-997' } })
        callback3()
      })
      request({
        url: '/bill-payment/v1/biller/execution',
        headers: {}
      }, global.Page({ data: {} }))
      await delay(50)
    })
    it('errorCode is GNR-000-998', async () => {

      my.request = vi.fn(({ success: callback1, fail: callback2, complete: callback3 }) => {
        callback1({})
        callback2({ statusCode: 503, data: { errorCode: 'GNR-000-998' } })
        callback3()
      })
      request({
        url: '/bill-payment/v1/biller/execution',
        headers: {}
      }, global.Page({ data: {} }))
      await delay(50)
    })
    it('errorCode is GNR-000-999', async () => {
      my.request = vi.fn(({ success: callback1, fail: callback2, complete: callback3 }) => {
        callback1({})
        callback2({ statusCode: 503, data: { errorCode: 'GNR-000-999' } })
        callback3()
      })
      request({
        url: '/bill-payment/v1/biller/execution',
        headers: {}
      }, global.Page({ data: {} }))
      await delay(50)
    })
    it('errorCode not inlcude in the list, and userId is null, it will setTimeout 1500', async () => {
      my.request = vi.fn(({ success: callback1, fail: callback2, complete: callback3 }) => {
        callback1({})
        callback2({ statusCode: 503, data: { errorCode: 'GNR-000-000' } })
        callback3()
      })
      getApp().globalData.nativeData.userId = null
      request({
        url: '/bill-payment/v1/biller/execution',
        headers: {}
      }, global.Page({ data: {} }))
      await delay(1550)
    })
  })

})