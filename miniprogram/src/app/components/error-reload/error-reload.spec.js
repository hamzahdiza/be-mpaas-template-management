import {
  describe,
  expect,
  it,
  vi
} from "vitest";
import './error-reload'

const currentPage = global.pageInstance;

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

describe('error-reload', () => {
  it('didMount', () => {
    const page = createPage(currentPage);
    const instance = page;
    instance.didMount();
    expect(instance.data.lang).toEqual(getApp().globalData.languagePack)
  })

  it('didUpdate', () => {
    const page = createPage(currentPage);
    const instance = page;
    instance.didUpdate();
  })

  it('didUnmount', () => {
    const page = createPage(currentPage);
    const instance = page;
    instance.didUnmount();
  })

  it('handleReload', () => {
    const page = createPage(currentPage);
    const instance = page;
    instance.methods.handleReload.call(currentPage)
  })
})