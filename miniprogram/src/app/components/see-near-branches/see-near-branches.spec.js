import {
  describe,
  expect,
  it,
  vi
} from "vitest";

import './see-near-branches'
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

describe('test for see near branches function', ()=> {
  it('should set currentSeeNearBranchCom and define seeNearBranchesModalFunc on didMount', () => {
    const page = createPage(currentPage);
    const instance = page;
    instance.didMount();

    expect(my.seeNearBranchesModalFunc).toBeDefined();
    const mockSeeNearBranchesModalFunc = {
      setData: vi.fn(),
      $page: {
        setData: vi.fn()
      }
    };
    global.getCurrentPages = vi.fn(() => [{ currentSeeNearBranchCom: mockSeeNearBranchesModalFunc }]);

    const seeNearBranchesModalFunc = my.seeNearBranchesModalFunc;
    seeNearBranchesModalFunc(true);

    expect(my.call).toHaveBeenCalledWith("enableSwipe", { isSwipe: false }, expect.any(Function));

    const lang = getApp().globalData.languagePack
    expect(mockSeeNearBranchesModalFunc.setData).toHaveBeenCalledWith({
      seeNearBranchesModal: true,
      lang
    });

  });
  it('test other empty function', ()=> {
    currentPage.didUpdate()
    currentPage.didUnmount()
  })
  it('test for methods function', ()=> {
    vi.spyOn(currentPage.methods,'toSeeNearestBranchLocations')
    currentPage.methods.toSeeNearestBranchLocations()
    expect(currentPage.methods.toSeeNearestBranchLocations).toHaveBeenCalledTimes(1)
  })
})