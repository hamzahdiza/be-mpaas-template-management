import {
  describe,
  it,
  vi
} from "vitest";
import './bottom-popup'

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

describe('bottom-popup', () => {
  it('didMount', () => {
    const page = createPage(currentPage);
    const instance = page;
    instance.didMount();
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
  it('onClose', () => {
    const page = createPage(currentPage);
    const instance = page;
    instance.methods.onClose.call(currentPage)
  })
})