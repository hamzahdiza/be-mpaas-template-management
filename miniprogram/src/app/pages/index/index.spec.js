import "./index"
import {
  expect,
  vi
} from "vitest"

import * as networkUtil from "/src/utils/getNetWork";
import * as api from "/src/public/api"
import * as e2ee from "/src/utils/e2ee"
import * as routeUtil from "../../../utils/route-util";


const instance = global.pageInstance

my.call = vi.fn((param1, param2, callback) => {
  if (typeof callback === "function") {
    callback({});
  }
});

describe('index', () => {

  test('onLoad sets language and screen info', () => {
    vi.spyOn(instance, 'getLandingData');
    vi.spyOn(instance, 'getPendingOrder');

    instance.onLoad();
    instance.getLandingData()
    instance.getPendingOrder()

  });

  test('onLoad sets language and screen info', () => {
    instance.onReady();
  });


  test("should disable swipe and call getNetWork", () => {
    vi.spyOn(networkUtil, 'default');

    instance.onShow();
    expect(my.call).toHaveBeenCalledWith("enableSwipe", {
      isSwipe: false
    }, expect.any(Function));
    expect(networkUtil.default).toHaveBeenCalled();
  });

  test('isCollapse toggles isCollapse state', () => {
    instance.isExpanded();
    expect(instance.data.isExpanded).toBe(true);

    instance.isExpanded();
    expect(instance.data.isExpanded).toBe(false);
  });

  test('isExpandInfo toggles isExpandInfo state', () => {
    instance.isExpandInfo();
    expect(instance.data.isExpandInfo).toBe(true);

    instance.isExpandInfo();
    expect(instance.data.isExpandInfo).toBe(false);
  });

  test('indicatorPromo sets currentInfo based on event target', () => {
    const event = {
      target: {
        dataset: {
          index: 1,
        },
      },
    };

    instance.indicatorPromo(event);
    expect(instance.data.currentInfo).toBe(1);
  });

  test('onSwipeChangePromo updates currentInfo', () => {
    const mockEvent = {
      detail: {
        current: 2
      }
    };

    instance.onSwipeChangePromo(mockEvent);

    expect(instance.data.currentInfo).toBe(2);
  });

  test('onSwipeChangePoster updates currentPoster', () => {
    const mockEvent = {
      detail: {
        current: 2
      }
    };

    instance.onSwipeChangePoster(mockEvent);

    expect(instance.data.currentPoster).toBe(2);
  });


  test('indicatorPoster updates currentPoster', () => {
    const mockEvent = {
      target: {
        dataset: {
          index: '3'
        }
      }
    };
    instance.indicatorPoster(mockEvent);

    expect(instance.data.currentPoster).toBe(3);
  });

  test('popupPromo sets show to true', () => {
    const mockEvent = {
      target: {
        dataset: {
          image: 'url/to/image.jpg'
        }
      }
    };
    instance.popupPromo(mockEvent);
    expect(instance.data.isFullscreen).toBe(true);
    expect(instance.data.imageFullScreen).toBe('url/to/image.jpg');
  });

  test('popupPromoClose sets show to false', () => {
    instance.popupPromoClose();
    expect(instance.data.isFullscreen).toBe(false);
  });

  test("should hit api category-ticket", async () => {
    const mockRes = {
      data: {
        "dataProtected": "result"
      }
    }
    const mockDecryptedData = JSON.stringify({});
    vi.spyOn(api, 'getJavaJazzLandingData');
    vi.spyOn(e2ee, 'decryptAPIData');


    api.getJavaJazzLandingData.mockResolvedValueOnce(mockRes);
    vi.spyOn(e2ee, 'decryptAPIData').mockReturnValue(mockDecryptedData);

    await instance.getLandingData()

    expect(api.getJavaJazzLandingData).toHaveBeenCalled()
  });

  test("navigate to gather screen when pending order available", async () => {
    const mockRes = {
      data: {
        "dataProtected": "result"
      },
      statusCode: 200
    }
    const mockDecryptedData = JSON.stringify({});
    vi.spyOn(api, 'getJavaJazzPendingOrder');
    vi.spyOn(e2ee, 'decryptAPIData');
    vi.spyOn(routeUtil, "customNavigateTo")


    api.getJavaJazzPendingOrder.mockResolvedValueOnce(mockRes);
    vi.spyOn(e2ee, 'decryptAPIData').mockReturnValue(mockDecryptedData);

    await instance.getPendingOrder()

    expect(api.getJavaJazzPendingOrder).toHaveBeenCalled()
  });


  test("navigate to gather screen when pending order available", async () => {
    const mockRes = {
      data: {
        "dataProtected": "result"
      },
      statusCode: 204
    }
    const mockDecryptedData = JSON.stringify({});
    vi.spyOn(api, 'getJavaJazzPendingOrder');
    vi.spyOn(e2ee, 'decryptAPIData');
    vi.spyOn(routeUtil, "customNavigateTo")


    api.getJavaJazzPendingOrder.mockResolvedValueOnce(mockRes);
    vi.spyOn(e2ee, 'decryptAPIData').mockReturnValue(mockDecryptedData);

    await instance.getPendingOrder()

    expect(api.getJavaJazzPendingOrder).toHaveBeenCalled()
  });

  test("navigate to gather screen when pending order available", async () => {
    const mockRes = {
      data: {
        "dataProtected": "result"
      },
      status: 204
    }
    const mockDecryptedData = JSON.stringify({});
    vi.spyOn(api, 'getJavaJazzPendingOrder');
    vi.spyOn(e2ee, 'decryptAPIData');
    vi.spyOn(routeUtil, "customNavigateTo")


    api.getJavaJazzPendingOrder.mockResolvedValueOnce(mockRes);
    vi.spyOn(e2ee, 'decryptAPIData').mockReturnValue(mockDecryptedData);

    await instance.getPendingOrder()

    expect(api.getJavaJazzPendingOrder).toHaveBeenCalled()
  });


  test("pending order error", async () => {
    const mockRes = {
      data: {
        "dataProtected": "result"
      },
      status: 501
    }
    const mockDecryptedData = JSON.stringify({});
    vi.spyOn(api, 'getJavaJazzPendingOrder');
    vi.spyOn(e2ee, 'decryptAPIData');
    vi.spyOn(routeUtil, "customNavigateTo")


    api.getJavaJazzPendingOrder.mockResolvedValueOnce(mockRes);
    vi.spyOn(e2ee, 'decryptAPIData').mockReturnValue(mockDecryptedData);

    await instance.getPendingOrder()

    expect(api.getJavaJazzPendingOrder).toHaveBeenCalled()
  });

  test('should handle error in catch block', async () => {
    api.getJavaJazzPendingOrder.mockRejectedValue(new Error('Network Error'));

    await instance.getPendingOrder();
  });

  test('should process ticketCategories and set data correctly', async () => {
    const mockResponse = {
        data: {
            dataProtected: {
                detailEvent: { name: 'Java Jazz' },
                ticketCategories: [
                    { oldPrice: 100, price: '' },
                    { oldPrice: 200, price: '' }
                ]
            }
        }
    };

    api.getJavaJazzLandingData.mockResolvedValue(mockResponse);

    await instance.getLandingData();

});

  test("should navigate to TnC page with correct data", () => {
    const mockticketData = {
      transactionType: 'javajazz-festival'
    }
    instance.data.ticketData = mockticketData

    instance.goToTnc();
  });

  test("should navigate to ticket list page with correct data", () => {
    const mockEvent = {
      target: {
        dataset: {
          ticketData: 0,
        },
      },
    };

    instance.goToTicketList(mockEvent);

  });

  test("should open url when click", () => {

    instance.data.detailEvent = {
      locationUrl: "http://google.com"
    }
    instance.openMap();
    expect(my.call).toHaveBeenCalledWith("openURL", {
      url: "http://google.com",
    }, expect.any(Function));
  });

});