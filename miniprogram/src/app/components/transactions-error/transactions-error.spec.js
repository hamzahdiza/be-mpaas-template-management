import {
  describe,
  expect,
  it,
  vi
} from "vitest";

import './transactions-error'
const currentPage = global.pageInstance;
my.call = vi.fn((p1, p2, callback) => {
  callback({})
})

function createPage(Component) {
  return {
    data: Component.data,
    setData: vi.fn(),
    $page: {
      setData: vi.fn()
    },
    ...Component
  };
}

describe('test for request api return for transactions error', () => {
  describe('test for current didmount function', () => {

    it('should set currentTranErrorCom and define tranErrorFunc on didMount and http status is other', () => {
      const page = createPage(currentPage);
      const instance = page;
      instance.didMount();

      expect(my.tranErrorFunc).toBeDefined();
      const mockTranErrorFunc = {
        setData: vi.fn(),
        $page: {
          setData: vi.fn()
        }
      };
      global.getCurrentPages = vi.fn(() => [{
        currentTranErrorCom: mockTranErrorFunc
      }]);

      const tranErrorFunc = my.tranErrorFunc;
      const mockData = {
        errorHttpStatus: 400,
        errorCode: 'asd',
        event: 'isRequest',
        isRefresh: true,
        isSwipe: true,
        param: '1',
        err: {
          isIntercept: false,
        }
      }
      tranErrorFunc(mockData);

      const lang = getApp().globalData.languagePack
      expect(mockTranErrorFunc.setData).toHaveBeenCalledWith({
        "generalError": true,
        "errorCode": "asd",
        "errorButton": "transactionsErrorResponseToHomeButton",
        "errorMessage": "asd_errorMessage",
        "errorTitle": "asd_errorTitle",
        "event": "goToHomeScreen",
        "isSwipe": true,
        lang
      });
    })
    it('should set currentTranErrorCom and define tranErrorFunc on didMount and http status is 503 or 401 or isIntercept is true', () => {
      const page = createPage(currentPage);
      const instance = page;
      instance.didMount();

      expect(my.tranErrorFunc).toBeDefined();
      const mockTranErrorFunc = {
        setData: vi.fn(),
        $page: {
          setData: vi.fn()
        }
      };
      global.getCurrentPages = vi.fn(() => [{
        currentTranErrorCom: mockTranErrorFunc
      }]);

      const tranErrorFunc = my.tranErrorFunc;
      const mockData = {
        errorHttpStatus: 503,
        isIntercept: false,
        errorCode: 'asd',
        event: 'isRequest',
        isRefresh: true,
        isSwipe: true,
        param: '1'
      }
      tranErrorFunc(mockData);
    })
    
    it('should set currentTranErrorCom and define tranErrorFunc on didMount and http status is other error code start with LIM- and event is null or false', () => {
      const page = createPage(currentPage);
      const instance = page;
      instance.didMount();

      expect(my.tranErrorFunc).toBeDefined();
      const mockTranErrorFunc = {
        setData: vi.fn(),
        $page: {
          setData: vi.fn()
        }
      };
      global.getCurrentPages = vi.fn(() => [{
        currentTranErrorCom: mockTranErrorFunc
      }]);

      const tranErrorFunc = my.tranErrorFunc;
      const mockData = {
        errorHttpStatus: 409,
        errorCode : 'TRX-000-608',
        event: false,
        isRefresh: true,
        isSwipe: true,
        param: '1',
        err: {
          isIntercept: false,
        }
      }
      tranErrorFunc(mockData);
    })

    it('should set currentTranErrorCom and define tranErrorFunc on didMount and http status is other error code start with LIM- and event is null or false', () => {
      const page = createPage(currentPage);
      const instance = page;
      instance.didMount();

      expect(my.tranErrorFunc).toBeDefined();
      const mockTranErrorFunc = {
        setData: vi.fn(),
        $page: {
          setData: vi.fn()
        }
      };
      global.getCurrentPages = vi.fn(() => [{
        currentTranErrorCom: mockTranErrorFunc
      }]);

      const tranErrorFunc = my.tranErrorFunc;
      const mockData = {
        errorHttpStatus: 400,
        errorCode: 'LIM-',
        event: false,
        isRefresh: true,
        isSwipe: true,
        param: '1',
        err: {
          isIntercept: false,
        }
      }
      tranErrorFunc(mockData);
    })

    it('should set currentTranErrorCom and define tranErrorFunc on didMount and http status is other error code start with GTW- and event is not null or true', () => {
      const page = createPage(currentPage);
      const instance = page;
      instance.didMount();

      expect(my.tranErrorFunc).toBeDefined();
      const mockTranErrorFunc = {
        setData: vi.fn(),
        $page: {
          setData: vi.fn()
        }
      };
      global.getCurrentPages = vi.fn(() => [{
        currentTranErrorCom: mockTranErrorFunc
      }]);

      const tranErrorFunc = my.tranErrorFunc;
      const mockData = {
        errorHttpStatus: 400,
        errorCode: 'GTW-',
        event: true,
        isRefresh: true,
        isSwipe: true,
        param: '1',
        err: {
          isIntercept: false,
        }
      }
      tranErrorFunc(mockData);
    })
    it('should set currentTranErrorCom and define tranErrorFunc on didMount and http status is other error code start with other and event is not null or true and isRefresh is false', () => {
      const page = createPage(currentPage);
      const instance = page;
      instance.didMount();

      expect(my.tranErrorFunc).toBeDefined();
      const mockTranErrorFunc = {
        setData: vi.fn(),
        $page: {
          setData: vi.fn()
        }
      };
      global.getCurrentPages = vi.fn(() => [{
        currentTranErrorCom: mockTranErrorFunc
      }]);

      const tranErrorFunc = my.tranErrorFunc;
      const mockData = {
        errorHttpStatus: 400,
        errorCode: 'TEST',
        event: true,
        isRefresh: false,
        isSwipe: true,
        param: '1',
        err: {
          isIntercept: false,
        }
      }
      tranErrorFunc(mockData);

      const lang = getApp().globalData.languagePack
      expect(mockTranErrorFunc.setData).toHaveBeenCalledWith({
        "generalError": true,
        "errorCode": "TEST",
        "errorButton": "transactionsErrorResponseToHomeButton",
        "errorMessage": "TEST_errorMessage",
        "errorTitle": "TEST_errorTitle",
        "event": "goToHomeScreen",
        "isSwipe": true,
        lang
      });
    })


  });

  describe('test for ref', () => {
    it('test for ref', () => {
      currentPage.ref()
    })
  })

  describe('test for methods object', () => {
    it('test for change function while event is empty', () => {
      currentPage.setData({
        event: '',
        generalError: true
      })
      currentPage.methods.change.call(currentPage)
      expect(currentPage.data.generalError).toBe(true)
    })
    it('test for change function while event is isRequest', () => {
      currentPage.setData({
        event: 'isRequest',
        generalError: true
      })
      currentPage.methods.change.call(currentPage)
      expect(currentPage.data.generalError).toBe(true)
    })
    it('test for change function whilt event is other value', () => {
      currentPage.setData({
        event: 'event',
        generalError: true
      })
      currentPage.methods.change.call(currentPage)
      expect(currentPage.data.generalError).toBe(true)
    })
  })

})