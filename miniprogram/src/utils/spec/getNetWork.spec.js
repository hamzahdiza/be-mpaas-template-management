import { describe, it, vi } from "vitest";
import getNetWork from "../getNetWork"


describe('getNetWork', () => {
  it('execute getNetWork when network disable', () => {
    global.my = {
      getNetworkType: vi.fn(({success: callback}) => {
        callback({
          networkAvailable: false
        })
      }),
      call: vi.fn((param1, param2, callback) => {
         callback()
      })
    }
    getNetWork()
  })

  it('execute getNetWork when network disable', () => {
    global.my = {
      getNetworkType: vi.fn(({success: callback}) => {
        callback({
          networkAvailable: true
        })
      }),
      call: vi.fn((param1, param2, callback) => {
         callback()
      })
    }
    getNetWork()
  })
})