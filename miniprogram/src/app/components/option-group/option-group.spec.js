import {
  describe,
  it,
  vi
} from "vitest";

import './option-group'
const currentPage = global.pageInstance;
const my = global.my
my.questionnaireInfo = vi.fn()

describe('test for option group component', () => {
  it('test for methods object', () => {
    const mockData = {
      currentTarget: {
        dataset: {
          index: '123'
        }
      }
    }
    currentPage.methods.selectOption.call(currentPage, mockData)
  })
})