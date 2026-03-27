import {
  describe,
  expect,
  it,
  vi
} from "vitest";

import './general-error'
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

describe('test for request api return normal error code', () => {
  describe('test for current didmount function', () => {

    it('should set currentGeneralErrorCom and define generalErrorFunc on didMount and http status is other', () => {
      const page = createPage(currentPage);
      const instance = page;
      instance.didMount();

      expect(my.generalErrorFunc).toBeDefined();
      const mockGeneralErrorFunc = {
        setData: vi.fn(),
        $page: {
          setData: vi.fn()
        }
      };
      global.getCurrentPages = vi.fn(() => [{
        currentGeneralErrorCom: mockGeneralErrorFunc
      }]);

      const generalErrorFunc = my.generalErrorFunc;
      const mockData = {
        errorHttpStatus: 400,
        isIntercept: false,
        errorCode: 'asd',
        event: 'isRequest',
        isRefresh: true,
        isSwipe: true,
        param: '1'
      }
      generalErrorFunc(mockData);

      const lang = getApp().globalData.languagePack
      expect(mockGeneralErrorFunc.setData).toHaveBeenCalledWith({
        "generalError": true,
        "errorButton": "generalAccessTokenErrorOverlayButtonLabel",
        "errorCode": "asd",
        "errorMessage": "generalAccessTokenErrorOverlayDescriptionLabel",
        "errorTitle": "generalAccessTokenErrorOverlayTitleLabel",
        "event": "isRequest",
        "isSwipe": true,
        "param": "1",
        lang
      });
    })
    it('should set currentGeneralErrorCom and define generalErrorFunc on didMount and http status is 503 or 401 or isIntercept is true', () => {
      const page = createPage(currentPage);
      const instance = page;
      instance.didMount();

      expect(my.generalErrorFunc).toBeDefined();
      const mockGeneralErrorFunc = {
        setData: vi.fn(),
        $page: {
          setData: vi.fn()
        }
      };
      global.getCurrentPages = vi.fn(() => [{
        currentGeneralErrorCom: mockGeneralErrorFunc
      }]);

      const generalErrorFunc = my.generalErrorFunc;
      const mockData = {
        errorHttpStatus: 503,
        isIntercept: false,
        errorCode: 'asd',
        event: 'isRequest',
        isRefresh: true,
        isSwipe: true,
        param: '1'
      }
      generalErrorFunc(mockData);
    })
    it('should set currentGeneralErrorCom and define generalErrorFunc on didMount and http status is other error code start with LIM- and event is null or false', () => {
      const page = createPage(currentPage);
      const instance = page;
      instance.didMount();

      expect(my.generalErrorFunc).toBeDefined();
      const mockGeneralErrorFunc = {
        setData: vi.fn(),
        $page: {
          setData: vi.fn()
        }
      };
      global.getCurrentPages = vi.fn(() => [{
        currentGeneralErrorCom: mockGeneralErrorFunc
      }]);

      const generalErrorFunc = my.generalErrorFunc;
      const mockData = {
        errorHttpStatus: 400,
        isIntercept: false,
        errorCode: 'LIM-',
        event: false,
        isRefresh: true,
        isSwipe: true,
        param: '1'
      }
      generalErrorFunc(mockData);
    })

    it('should set currentGeneralErrorCom and define generalErrorFunc on didMount and http status is other error code start with GTW- and event is not null or true', () => {
      const page = createPage(currentPage);
      const instance = page;
      instance.didMount();

      expect(my.generalErrorFunc).toBeDefined();
      const mockGeneralErrorFunc = {
        setData: vi.fn(),
        $page: {
          setData: vi.fn()
        }
      };
      global.getCurrentPages = vi.fn(() => [{
        currentGeneralErrorCom: mockGeneralErrorFunc
      }]);

      const generalErrorFunc = my.generalErrorFunc;
      const mockData = {
        errorHttpStatus: 400,
        isIntercept: false,
        errorCode: 'GTW-',
        event: true,
        isRefresh: true,
        isSwipe: true,
        param: '1'
      }
      generalErrorFunc(mockData);
      const lang = getApp().globalData.languagePack
      expect(mockGeneralErrorFunc.setData).toHaveBeenCalledWith({
        "generalError": true,
        "errorButton": "commonGeneralOverlayErrorCTACloseButton",
        "errorCode": "GTW-",
        "errorMessage": "commonGeneralOverlayErrorBody",
        "errorTitle": "commonGeneralOverlayErrorTitle",
        "event": true,
        "isSwipe": true,
        "param": "1",
        lang
      });
    })
    it('should set currentGeneralErrorCom and define generalErrorFunc on didMount and http status is other error code start with other and event is not null or true and isRefresh is false', () => {
      const page = createPage(currentPage);
      const instance = page;
      instance.didMount();

      expect(my.generalErrorFunc).toBeDefined();
      const mockGeneralErrorFunc = {
        setData: vi.fn(),
        $page: {
          setData: vi.fn()
        }
      };
      global.getCurrentPages = vi.fn(() => [{
        currentGeneralErrorCom: mockGeneralErrorFunc
      }]);

      const generalErrorFunc = my.generalErrorFunc;
      const mockData = {
        errorHttpStatus: 400,
        isIntercept: false,
        errorCode: 'TEST-',
        event: true,
        isRefresh: false,
        isSwipe: true,
        param: '1'
      }
      generalErrorFunc(mockData);

      const lang = getApp().globalData.languagePack
      expect(mockGeneralErrorFunc.setData).toHaveBeenCalledWith({
        "generalError": true,
        "errorButton": "commonGeneralErrorResponseCTAButton",
        "errorCode": "TEST-",
        "errorMessage": "TEST-_errorMessage",
        "errorTitle": "TEST-_errorTitle",
        "event": true,
        "isSwipe": true,
        "param": "1",
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
      expect(currentPage.data.generalError).toBe(false)
    })
    it('test for change function while event is isRequest', () => {
      currentPage.setData({
        event: 'isRequest',
        generalError: true
      })
      currentPage.methods.change.call(currentPage)
      expect(currentPage.data.generalError).toBe(false)
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