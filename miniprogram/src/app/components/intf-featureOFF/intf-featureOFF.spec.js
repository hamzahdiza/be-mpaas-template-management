import {
  describe,
  expect,
  it,
  vi
} from "vitest";

import './intf-featureOFF'
const currentPage = global.pageInstance;
my.call = vi.fn((p1, p2, callback) => {callback({})})

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

describe('test for request api and return error code is 503', ()=> {
  it('should set currentFeatureCom and define featureCheckModalFunc on didMount', () => {
    
    const page = createPage(currentPage);
    
    const instance = page;
    instance.didMount(); 

    
    expect(my.featureCheckModalFunc).toBeDefined();

    
    const mockCurrentFeatureCom = {
      setData: vi.fn(),
      $page: {
        setData: vi.fn()
      }
    };
    global.getCurrentPages = vi.fn(() => [{ currentFeatureCom: mockCurrentFeatureCom }]);

    
    const featureCheckModalFunc = my.featureCheckModalFunc;
    featureCheckModalFunc(true);

    
    expect(my.call).toHaveBeenCalledWith("enableSwipe", { isSwipe: false }, expect.any(Function));

    const lang = getApp().globalData.languagePack

    
    expect(mockCurrentFeatureCom.setData).toHaveBeenCalledWith({
      featureCheckModal: true,
      lang
    });

    
    expect(mockCurrentFeatureCom.$page.setData).toHaveBeenCalledWith({
      lottieLoading: false,
      submitting: false,
    });
  });
  it('test other empty function', ()=> {
    currentPage.didUpdate()
    currentPage.didUnmount()
    currentPage.methods()
  })
})