import {
  beforeAll,
  describe,
  expect,
  it,
  vi
} from "vitest";

import './amount-input'
const currentPage = global.pageInstance;
my.call = vi.fn((p1, p2, callback) => {
  callback({})
})

describe('test for amount input component', () => {
  beforeAll(() => {
    currentPage.onInit()
    currentPage.props = {
      disabled: false,
      type: "RP",
      onCopy: vi.fn(),
      onPaste: vi.fn(),
      inputValue: "",
      onClear: vi.fn(),
      onFocus: vi.fn(),
      isFocus: vi.fn(),
      scrollPosition: vi.fn(),
      error: false,
      caption: "",
      showKeybord: false,
      onChange: vi.fn(),
      onClose: vi.fn(),
      onLongTap: vi.fn(),
      keyboardButtonText: ""
    }
  })
  describe('test for onHandleClick function', () => {

    describe('test for original value is empty', () => {
      it('test for attr is "."', async () => {
        currentPage.setData({
          originalValue: []
        })
        const mockData = {
          target: {
            dataset: {
              attr: "."
            }
          }
        }
        currentPage.methods.onHandleClick.call(currentPage, mockData)
        await delay(50)
        expect(currentPage.data.originalValue).toStrictEqual(['0', '.'])
      })
      it('test for attr is "000"', async () => {
        currentPage.setData({
          originalValue: []
        })
        const mockData = {
          target: {
            dataset: {
              attr: "000"
            }
          }
        }
        currentPage.methods.onHandleClick.call(currentPage, mockData)
        await delay(50)
      })
      it('test for attr is "0"', async () => {
        currentPage.setData({
          originalValue: []
        })
        const mockData = {
          target: {
            dataset: {
              attr: "0"
            }
          }
        }
        currentPage.methods.onHandleClick.call(currentPage, mockData)
        await delay(50)
      })
      it('test for attr is else', async () => {
        currentPage.setData({
          originalValue: []
        })
        const mockData = {
          target: {
            dataset: {
              attr: "0123"
            }
          }
        }
        currentPage.methods.onHandleClick.call(currentPage, mockData)
        await delay(50)
      })
    })
    describe('test for original value length is 1', () => {
      it('test for original value start with 0 and attr is "0"', async () => {
        currentPage.setData({
          originalValue: ["0"]
        })
        const mockData = {
          target: {
            dataset: {
              attr: "0"
            }
          }
        }
        currentPage.methods.onHandleClick.call(currentPage, mockData)
        await delay(50)
        expect(currentPage.data.originalValue).toStrictEqual(["0"])
      })
      it('test for original value start with 0 and attr is "000"', async () => {
        currentPage.setData({
          originalValue: ["0"]
        })
        const mockData = {
          target: {
            dataset: {
              attr: "000"
            }
          }
        }
        currentPage.methods.onHandleClick.call(currentPage, mockData)
        await delay(50)
        expect(currentPage.data.originalValue).toStrictEqual(["0"])
      })
      it('test for original value is not start with 0 or attr is "."', async () => {
        currentPage.setData({
          originalValue: ["123"]
        })
        const mockData = {
          target: {
            dataset: {
              attr: "."
            }
          }
        }
        currentPage.methods.onHandleClick.call(currentPage, mockData)
        await delay(50)
      })
    })
    describe('test for original value length more than 1', () => {
      it('test for original value exclude "." and attr is "."', async () => {
        currentPage.setData({
          originalValue: ["1", "2"]
        })
        const mockData = {
          target: {
            dataset: {
              attr: "."
            }
          }
        }
        currentPage.methods.onHandleClick.call(currentPage, mockData)
        await delay(50)
      })
      it('test for original value exclude "." and attr is not "." and original value langth small than maxLength', async () => {
        currentPage.setData({
          originalValue: ["1", "2"]
        })
        const mockData = {
          target: {
            dataset: {
              attr: "1"
            }
          }
        }
        currentPage.methods.onHandleClick.call(currentPage, mockData)
        await delay(50)
      })
      it('test for attr is not "." and original value length decreate original value index of "." smaller than 2', async () => {
        currentPage.setData({
          originalValue: ["1", "."]
        })
        const mockData = {
          target: {
            dataset: {
              attr: "1"
            }
          }
        }
        currentPage.methods.onHandleClick.call(currentPage, mockData)
        await delay(50)
      })
    })
  })

  describe('test for setChange function', () => {
    describe('test for attr is "000"', () => {
      it('test for max length decreate original value length is more than 3', () => {
        currentPage.setData({
          originalValue: ["1"]
        })
        const mockData = {
          target: {
            dataset: {
              attr: "000"
            }
          }
        }
        currentPage.methods.setChange.call(currentPage, mockData)
        expect(currentPage.data.originalValue).toStrictEqual(["1", "0", "0", "0"])
      })

      it('test for otherwise', () => {
        currentPage.setData({
          originalValue: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
        })
        const mockData = {
          target: {
            dataset: {
              attr: "000"
            }
          }
        }
        currentPage.methods.setChange.call(currentPage, mockData)
        expect(currentPage.data.originalValue).toStrictEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "0"])
      })
    })
  })

  describe('test for onHandleClickDelete function', () => {
    it('test for onHandleClickDelete function', async () => {
      currentPage.methods.onHandleClickDelete.call(currentPage)
      await delay(50)
      expect(currentPage.data.showCopy).toBe(false)
      expect(currentPage.data.originalValue).toStrictEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"])
    })
  })

  describe('test for handlePopupClose function', () => {
    it('test for handlePopupClose function', () => {
      currentPage.methods.handlePopupClose.call(currentPage)
      expect(currentPage.data.showCopy).toBe(false)
    })
  })

  describe('test for onLongTap function', () => {
    it('test for onLongTap function while props disabled is false', () => {
      currentPage.methods.onLongTap.call(currentPage)
    })
    it('test for onLongTap function while props disabled is true', () => {
      currentPage.props.disabled = true
      currentPage.methods.onLongTap.call(currentPage)
    })
  })

  describe('test for onCopy function', () => {
    it('test for onCopy function', () => {
      currentPage.methods.onCopy.call(currentPage)
    })
  })

  describe('test for onPaste function', () => {
    it('test for onPaste function', () => {
      currentPage.methods.onPaste.call(currentPage)
    })
  })

  describe('test for changeOrginValue function', () => {
    it('test for changeOrginValue function', () => {
      const mockData = ["1", "2"]
      currentPage.methods.changeOrginValue.call(currentPage, mockData)
      expect(currentPage.data.originalValue).toStrictEqual(["1", "2"])
      expect(currentPage.data.showCopy).toBe(false)
    })
  })

  describe('test for closePopover function', () => {
    it('test for closePopover function while props disabled is false', () => {
      const mockData = true
      currentPage.props.disabled = false
      currentPage.methods.closePopover.call(currentPage, mockData)
      expect(currentPage.data.showCopy).toBe(mockData)
    })
    it('test for closePopover function while props disabled is true', () => {
      const mockData = false
      currentPage.props.disabled = true
      currentPage.methods.closePopover.call(currentPage, mockData)
      expect(currentPage.data.showCopy).toBe(true)
    })
  })

  describe('test for ref function', () => {
    it('test for ref function', () => {
      currentPage.ref()
    })
  })
})