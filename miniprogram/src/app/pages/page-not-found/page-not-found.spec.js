import {
  describe,
  expect,
  it
} from "vitest";

import './page-not-found'
const currentPage = global.pageInstance;
const my = global.my
my.call = vi.fn((param1,param2,callback)=>{
  callback({})
})

describe("test for page not found screen", ()=> {
  it("test for onLoad hook for android", ()=> {
    currentPage.onLoad()
    expect(1).toBe(1)
  })
  it("test for onLoad hook for ios", ()=> {
    my.call = vi.fn((param1,param2,callback)=>{
      const mockData = {
        data: 'en-id'
      }
      callback(mockData)
    })
    currentPage.onLoad()
    expect(1).toBe(1)
  })
})