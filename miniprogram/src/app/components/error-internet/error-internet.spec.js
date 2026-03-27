import {
  describe,
  expect,
  it,
  vi
} from "vitest";

import './error-internet'
const currentPage = global.pageInstance;
my.call = vi.fn((p1, p2, callback) => {callback({})})
my.hideKeyboard = vi.fn()

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

describe('test for listen internet is failure status', ()=> {
  it('should set currentInternetErrorCom and define errorInternetModalFunc on didMount', () => {
    const page = createPage(currentPage);
    const instance = page;

    my.getNetworkType.mockImplementation(({ success }) => {
      success({ networkAvailable: true });
    });
    instance.didMount();

    expect(my.errorInternetModalFunc).toBeDefined();
    const mockErrorInternetModalFunc = {
      setData: vi.fn(),
      $page: {
        setData: vi.fn()
      }
    };
    
    global.getCurrentPages = vi.fn(() => [{ currentInternetErrorCom: mockErrorInternetModalFunc }]);

    const errorInternetModalFunc = my.errorInternetModalFunc;
    errorInternetModalFunc(true);

    expect(my.call).toHaveBeenCalledWith("enableSwipe", { isSwipe: false }, expect.any(Function));

    const lang = getApp().globalData.languagePack

    expect(mockErrorInternetModalFunc.setData).toHaveBeenCalledWith({
      lang,
      errorInternet: true
    });

    expect(my.getNetworkType).toBeDefined()

    expect(mockErrorInternetModalFunc.$page.setData).toHaveBeenCalledWith({
      lottieLoading: false,
      submitting: false,
      productDetailIsLoading: false
    })
  });

  it('test for network type is failure' , ()=> {
    const page = createPage(currentPage);
    const instance = page;

    my.getNetworkType.mockImplementation(({ success }) => {
      success({ networkAvailable: false });
    });
    instance.didMount();

    expect(my.errorInternetModalFunc).toBeDefined();
    const mockErrorInternetModalFunc = {
      setData: vi.fn(),
      $page: {
        setData: vi.fn()
      }
    };
    
    global.getCurrentPages = vi.fn(() => [{ currentInternetErrorCom: mockErrorInternetModalFunc }]);

    const errorInternetModalFunc = my.errorInternetModalFunc;
    errorInternetModalFunc(true);

    expect(my.call).toHaveBeenCalledWith("enableSwipe", { isSwipe: false }, expect.any(Function));

    const lang = getApp().globalData.languagePack

    expect(mockErrorInternetModalFunc.setData).toHaveBeenCalledWith({
      lang,
      errorInternet: true
    });

    expect(my.getNetworkType).toBeDefined()

    expect(mockErrorInternetModalFunc.$page.setData).toHaveBeenCalledWith({
      lottieLoading: false,
      submitting: false,
      productDetailIsLoading: false
    })
  })
  it('test other empty function', ()=> {
    currentPage.didUpdate()
    currentPage.didUnmount()
  })
})