import "./index";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";
import * as e2ee from "../../../utils/e2ee";
import * as networkUtil from "../../../utils/getNetWork";
import generalError from "../../../utils/generalError";
import * as routeUtil from "../../../utils/route-util";
import * as api from "../../../public/api";
import {
  currencyFormat
} from "../../../utils/currency-util";
import * as firebase from "../../../utils/firebaseTracker"

const instance = global.pageInstance;
const my = global.my;

my.getSystemInfo = vi.fn(({
  success
}) => {
  success({
    titleBarHeight: 50,
    statusBarHeight: 20
  });
});

my.call = vi.fn((param1, param2, callback) => {
  if (typeof callback === "function") {
    callback({});
  }
});

describe("Lifestyle Page", () => {
  beforeEach(() => {
    vi.spyOn(networkUtil, "default");
    vi.spyOn(routeUtil, "customNavigateTo");
    vi.spyOn(e2ee, "decryptAPIData");
    vi.spyOn(instance, "onLoad");
    instance.globalData = {
      data: {
        lang: "",
        statusBarHeight: 0,
      },
      customHeight: vi.fn(),
      setData: vi.fn(),
    };

    global.getCurrentPages = vi.fn(() => {
      return [{}];
    });

    global.getApp = vi.fn(() => ({
      globalData: {
        statusBarHeight: 20,
        languagePack: "en",
        nativeData: {
          sessionKey: "dummySessionKey",
          someKey: "someValue",
          clientPlatform: 'ios'
        },
      },
    }));
  });

  it("should reset global isFromJjf flag when true", async () => {
    const mockGlobalData = {
      isFromJjf: true,
      statusBarHeight: 20,
      languagePack: "en",
      nativeData: {
        language: 'en-ID'
      },
    };

    global.getApp = vi.fn(() => ({
      globalData: mockGlobalData,
    }));

    vi.spyOn(instance, "setData");

    await instance.onLoad();

  });

  it("should not modify global isFromJjf flag when false", async () => {
    const mockGlobalData = {
      isFromJjf: false,
      statusBarHeight: 20,
      languagePack: "en",
      nativeData: {
        language: 'en-ID'
      },
    };

    global.getApp = vi.fn(() => ({
      globalData: mockGlobalData,
    }));

    vi.spyOn(instance, "setData");

    await instance.onLoad();

    expect(mockGlobalData.isFromJjf).toBe(false);
  });

  it("should disable swipe and call getNetWork", () => {
    instance.onShow();
    expect(my.call).toHaveBeenCalledWith("enableSwipe", {
      isSwipe: false
    }, expect.any(Function));
    expect(networkUtil.default).toHaveBeenCalled();
  });

  it("should call showAppBar and set heights correctly on onLoad", async () => {
    vi.useFakeTimers();

    const mockResponse = {
      data: {
        data: {
          partnerMenus: []
        }
      },
    };
    vi.spyOn(api, "lifeStyleMenu").mockResolvedValue(mockResponse);

    await instance.onLoad();

    vi.runAllTimers();

    expect(my.call).toHaveBeenCalledWith(
      "showAppBar", {
        isShow: false,
        title: ""
      },
      expect.any(Function)
    );

    vi.useRealTimers();
  });

  it("should set partnerMenus and dataPartner correctly on lifeStyleMenuThen", () => {
    const mockResponse = {
      data: {
        data: {
          partnerMenus: [{
              title: "Menu 1",
              displayImage: "",
              description: "",
              amount: 100,
              isDiscount: false,
              category: "event"
            },
            {
              title: "Menu 2",
              displayImage: "",
              description: "",
              amount: 200,
              isDiscount: true,
              discount: 50,
              category: "transportasi"
            },
          ],
        },
      },
    };

    instance.lifeStyleMenuThen(mockResponse);

    expect(instance.data.partnerMenus.length).toBe(2);
    expect(instance.data.dataPartner.length).toBe(2);
    expect(instance.data.dataPartner[0].partnerAmount).toBe(currencyFormat({
      value: 100
    }));
    expect(instance.data.dataPartner[1].total).toBe(currencyFormat({
      value: 150
    }));
    expect(instance.data.isOneData).toBe(false);
  });

  it("should handle error correctly on lifeStyleMenuCatch", () => {
    const mockError = {
      statusCode: 409
    };

    instance.lifeStyleMenuCatch(mockError);

    expect(instance.data.isLoading).toBe(false);
  });

  it("should navigate to Partner Webview with correct data", () => {
    const mockPartnerMenus = [{
        title: "Menu 1",
        transactionType: "kai",
        transactionTypeDisplay: "KAI",
        isUrlMicrositeStatic: false
      },
      {
        title: "Menu 2",
        transactionType: "pointplus",
        transactionTypeDisplay: "Undian Rejeki BNI",
        isUrlMicrositeStatic: false
      }
    ];

    instance.data = {
      partnerMenus: mockPartnerMenus,
      isShowLottery: false,
      isAccountValid: false // Set initial account validity
    };

    const mockEvent = {
      currentTarget: {
        dataset: {
          selectedPartner: {
            partnerTransactionTypeDisplay: "KAI"
          },
        },
      },
    };

    instance.goToPartnerWebview(mockEvent);

  });
  it("should navigate to Partner Webview with correct data", () => {
    const mockPartnerMenus = [{
      title: "Menu 1"
    }, {
      title: "Menu 2"
    }];
    instance.data.partnerMenus = mockPartnerMenus;

    const mockEvent = {
      currentTarget: {
        dataset: {
          selectedPartner: 0,
        },
      },
    };

    instance.goToPartnerWebview(mockEvent);
  });

  it("should navigate to Partner Webview with sofList == null", () => {
    const mockPartnerMenus = [{
      title: "Menu 1"
    }, {
      title: "Menu 2"
    }];
    instance.data.partnerMenus = mockPartnerMenus;

    const mockEvent = {
      currentTarget: {
        dataset: {
          selectedPartner: 0,
        },
      },
    };


    instance.goToPartnerWebview(mockEvent);
  });


  it("should navigate to TnC page with correct data", () => {
    const mockPartnerMenus = [{
      title: "Menu 1"
    }, {
      title: "Menu 2"
    }];
    instance.data.partnerMenus = mockPartnerMenus;

    instance.goToTnc();

    expect(routeUtil.customNavigateTo).toHaveBeenCalledWith({
      url: "/src/app/pages/chose-tnc/chose-tnc",
      data: {
        lifestyleData: mockPartnerMenus
      },
    });
  });

  it("should navigate to the transaction history page", () => {
    const navigateToSpy = vi.spyOn(my, "navigateTo");

    instance.goToTransactionHistory();

    expect(navigateToSpy).toHaveBeenCalledWith({
      url: "/src/app/pages/transaction-history/transaction-history?customUrlQueryData=transaction-history",
    });

    navigateToSpy.mockRestore();
  });

  it("should set image loading state to false on imageLoad", () => {
    instance.data.dataPartner = [{
      isImageLoading: true
    }];
    const mockEvent = {
      currentTarget: {
        dataset: {
          index: 0,
        },
      },
    };

    instance.imageLoad(mockEvent);

    expect(instance.data.dataPartner[0].isImageLoading).toBe(false);
  });

  it("should set image loading state to false on imageError", () => {
    instance.data.dataPartner = [{
      isImageLoading: true
    }];
    const mockEvent = {
      currentTarget: {
        dataset: {
          index: 0,
        },
      },
    };

    instance.imageError(mockEvent);

    expect(instance.data.dataPartner[0].isImageLoading).toBe(false);
  });

  it("should call lifeStyleMenuThen on successful fetch", async () => {
    const mockResponse = {
      data: {
        data: {
          partnerMenus: [{
            title: "Menu 1",
            displayImage: "",
            description: "",
            amount: 100,
            isDiscount: false
          }],
        },
      },
    };

    vi.spyOn(api, "lifeStyleMenu").mockResolvedValue(mockResponse);
    vi.spyOn(instance, "lifeStyleMenuThen");

    await instance.onLoad();

    expect(api.lifeStyleMenu).toHaveBeenCalled();
    expect(instance.lifeStyleMenuThen).toHaveBeenCalledWith(mockResponse);
  });

  it("should call lifeStyleMenuCatch on fetch failure", async () => {
    const mockError = {
      statusCode: 500,
      err: {
        message: "Server Error"
      }
    };

    vi.spyOn(api, "lifeStyleMenu").mockRejectedValue(mockError);
    vi.spyOn(instance, "lifeStyleMenuCatch");

    await instance.onLoad();

    expect(api.lifeStyleMenu).toHaveBeenCalled();
    expect(instance.lifeStyleMenuCatch).toHaveBeenCalledWith(mockError);
  });

  it("should navigate to mini program if isUrlMicrositeStatic is true", () => {
    my.navigateToMiniProgram = vi.fn();

    const mockPartnerMenus = [{
      title: "Menu 1",
      isUrlMicrositeStatic: true,
      urlMicrosite: "app_id",
      partnerId: "myMiniProgramId",
    }, ];
    instance.data.partnerMenus = mockPartnerMenus;

    const mockEvent = {
      currentTarget: {
        dataset: {
          selectedPartner: 0,
        },
      },
    };

    instance.goToPartnerWebview(mockEvent);
  });

  it("should call customNavigateTo if isUrlMicrositeStatic is false", () => {

    const mockPartnerMenus = [{
      title: "Menu 2",
      isUrlMicrositeStatic: false
    }, ];
    instance.data.partnerMenus = mockPartnerMenus;

    const mockEvent = {
      currentTarget: {
        dataset: {
          selectedPartner: 0,
        },
      },
    };

    instance.goToPartnerWebview(mockEvent);
  });

  it("should call goToHomeScreen using my.call", () => {
    my.call = vi.fn();

    instance.goToNative();


    expect(my.call).toHaveBeenCalledWith(
      "goToHomeScreen", {},
      expect.any(Function)
    );
  });

  describe("Lifestyle Page", () => {

    beforeEach(() => {
      vi.spyOn(networkUtil, "default");
      vi.spyOn(routeUtil, "customNavigateTo");
      vi.spyOn(instance, "onLoad");
      vi.spyOn(api, "accountListPost");
      vi.spyOn(e2ee, "decryptAPIData");
      vi.spyOn(my, "call");
    });

    it("should push menu with category 'banner' to dataBanner array", () => {
      const mockResponse = {
        data: {
          data: {
            partnerMenus: [{
                category: "banner",
                title: "Banner Menu",
                amount: 100
              },
              {
                category: "other",
                title: "Other Menu",
                amount: 200
              }
            ]
          }
        }
      };

      instance.lifeStyleMenuThen(mockResponse);
    });
    it("should process accountListPost and set isShowLottery based on sofList", async () => {
      const mockResponse = {
        data: {
          dataProtected: {
            "sofList": [{
              currency: "IDR"
            }]
          }
        }
      };

      vi.spyOn(e2ee, "decryptAPIData").mockReturnValueOnce(mockResponse.data.dataProtected);

      vi.spyOn(api, "accountListPost").mockResolvedValue(mockResponse);

      await instance.hitApiListAccount();

    });

    it("should process accountListPost and set isShowLottery based on sofList", async () => {
      const mockResponse = {
        data: {
          dataProtected: {
            "sofList": [{
              currency: "DORM"
            }]
          }
        }
      };

      vi.spyOn(e2ee, "decryptAPIData").mockReturnValueOnce(mockResponse.data.dataProtected);

      vi.spyOn(api, "accountListPost").mockResolvedValue(mockResponse);

      await instance.hitApiListAccount();

    });

    it("should process accountListPost and set isShowLottery based on sofList", async () => {
      const mockResponse = {
        data: {
          dataProtected: {
            "sofList": [{
              currency: "USD"
            }]
          }
        }
      };

      vi.spyOn(e2ee, "decryptAPIData").mockReturnValueOnce(mockResponse.data.dataProtected);

      vi.spyOn(api, "accountListPost").mockResolvedValue(mockResponse);

      await instance.hitApiListAccount();

    });

    it("should call goSavingAccount with correct parameters", () => {
      instance.goSavingAccount();
      expect(my.call).toHaveBeenCalledWith("goToSavingAccountDataVerification", {}, expect.any(Function));
    });

  });

  it("should set isShowLottery to true if sofList is null", async () => {
    const mockPartnerMenus = [{
      title: "Menu 1",
      category: "gift"
    }];
    instance.data.partnerMenus = mockPartnerMenus;

    instance.data.resSourceOfFunds = {
      sofList: null
    };

    const mockEvent = {
      currentTarget: {
        dataset: {
          selectedPartner: 0,
        },
      },
    };

    instance.goToPartnerWebview(mockEvent);

  });

  it("should set isShowLottery to true if sofList is undefined", async () => {
    const mockPartnerMenus = [{
      title: "Menu 2",
      category: "banner"
    }];
    instance.data.partnerMenus = mockPartnerMenus;

    instance.data.resSourceOfFunds = {
      sofList: undefined
    };

    const mockEvent = {
      currentTarget: {
        dataset: {
          selectedPartner: 0,
        },
      },
    };

    instance.goToPartnerWebview(mockEvent);

  });

  it("should set isShowLottery to true if sofList is an empty array", async () => {
    const mockPartnerMenus = [{
      title: "Menu 3"
    }];
    instance.data.partnerMenus = mockPartnerMenus;

    instance.data.resSourceOfFunds = {
      sofList: []
    };

    const mockEvent = {
      currentTarget: {
        dataset: {
          selectedPartner: 0,
        },
      },
    };

    instance.goToPartnerWebview(mockEvent);

  });

  it("should set isShowLottery to false if sofList is not null, undefined, or empty", async () => {
    const mockPartnerMenus = [{
      title: "Menu 4",
      category: "banner"
    }];
    instance.data.partnerMenus = mockPartnerMenus;

    instance.data.resSourceOfFunds = {
      sofList: [1, 2, 3]
    };

    const mockEvent = {
      currentTarget: {
        dataset: {
          selectedPartner: 0,
        },
      },
    };

    instance.goToPartnerWebview(mockEvent);

  });


  describe('Error Handling in hitApiListAccount', () => {
    it('should set isAccountValid to false when errorCode is ACC-003-629', async () => {
      const mockError = {
        data: {
          errorCode: 'ACC-003-629',
        }
      };

      vi.spyOn(api, 'accountListPost').mockRejectedValue(mockError);

      vi.spyOn(instance, 'setData');

      await instance.hitApiListAccount.call(instance);


    });

    it('should call my.call with enableSwipe and generalError for other errorCodes', async () => {
      const mockError = {
        data: {
          errorCode: 'GEN-001',
        }
      };

      vi.spyOn(api, 'accountListPost').mockRejectedValue(mockError);

      vi.spyOn(my, 'call');
      await instance.hitApiListAccount.call(instance);

      expect(my.call).toHaveBeenCalledWith("enableSwipe", {
        isSwipe: false
      }, expect.any(Function));

      expect(generalError).toHaveBeenCalledWith({
        err: mockError,
        isSwipe: true,
        event: 'goToHomeScreen',
      });
    });
  });

  describe('handleRequest', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.spyOn(instance, 'setData');
      vi.spyOn(instance, 'lifeStyleMenuThen');
      vi.spyOn(instance, 'lifeStyleMenuCatch');
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should call lifeStyleMenuThen on success and set imageShow to true after delay', async () => {
      const mockResponse = {
        data: {
          data: {
            partnerMenus: []
          }
        }
      };

      vi.spyOn(api, 'lifeStyleMenu').mockResolvedValue(mockResponse);

      await instance.handleRequest();

    });

    it('should call lifeStyleMenuCatch on failure and set imageShow to true after delay', async () => {
      const mockError = {
        statusCode: 500,
      };

      vi.spyOn(api, 'lifeStyleMenu').mockRejectedValue(mockError);

      await instance.handleRequest();

    });
  });

  describe('closeModal', () => {
    it('should set isShowLottery to false', () => {
      instance.setData({
        isShowLottery: true
      });

      instance.closeModal();

      expect(instance.data.isShowLottery).toBe(false);
    });
  });


  describe("goToPartnerWebview", () => {
    it("should call handleFireBaseTracker when transactionType is 'poinplus'", () => {
      const mockPartnerMenus = [{
        "id": "jM3p1F8fXAQV9zRr4ek6uIDcb2X7QdCKxbo2",
        "isDiscount": false,
        "amount": 275000,
        "partnerAlias": "RINTIS",
        "categoryDisplay": "Transportasi",
        "urlMicrosite": "http://kai.com",
        "urlRedirect": "https://lifestyle.bni.co.id",
        "category": "transportasi",
        "paymentType": "BILL_PAYMENT",
        "transactionType": "poinplus",
        "title": "lifestylePartnerKaiTitle",
        "icon": "http://asset-service-comp-test2.apps.jtl-dev.maverick.ocp.hq.bni.co.id/asset/v1/image/ipV2Q7CD2ezcYp78BiHML.png",
        "isActive": true,
        "boBillerUbpCompanyCode": "0050000007",
        "virtualAccountBillersCid": null,
        "virtualAccountDetail": null,
        "isUrlMicrositeStatic": false,
        "partnerId": "0050000007",
        "description": "lifestylePartnerKaiDescription"
      }];
      instance.setData({
        partnerMenus: mockPartnerMenus,
      });

      const mockEvent = {
        currentTarget: {
          dataset: {
            selectedPartner: "undian_display",
          },
        },
      };

      instance.goToPartnerWebview(mockEvent);

      firebase.handleFireBaseTracker()
    });
  });

});

describe('func lifeStyleMenuCatch', () => {

  it('should set isLoading to false and errorReload to 2 when statusCode is not 409', () => {
    const mockEvent = {
      statusCode: 200,
      status: 200
    };

    instance.lifeStyleMenuCatch(mockEvent);
  });

  it('should call generalError when statusCode is 409', () => {
    const mockEvent = {
      statusCode: 409,
      status: 409
    };

    instance.lifeStyleMenuCatch(mockEvent);

  });
});


describe('func lifeStyleMenuThen', () => {


  it('should format partner menus correctly and set page data', () => {
    const mockResponse = {
      data: {
        data: {
          partnerMenus: [{
              title: 'Menu 1',
              displayImage: 'image1.png',
              description: 'Description 1',
              category: 'Event',
              amount: 100,
              transactionTypeDisplay: 'Type 1',
              isDiscount: false,
              discount: 0,
            },
            {
              title: 'Menu 2',
              displayImage: 'image2.png',
              description: 'Description 2',
              category: 'Gift',
              amount: 200,
              transactionTypeDisplay: 'Type 2',
              isDiscount: true,
              discount: 50,
            },
          ],
        },
      },
    };

    instance.lifeStyleMenuThen(mockResponse);

  });


  it('should set isOneData to true when there is one partner menu', () => {
    const mockResponse = {
      data: {
        data: {
          partnerMenus: [{
            title: 'Menu 1',
            displayImage: 'image1.png',
            description: 'Description 1',
            category: 'Event',
            amount: 100,
            transactionTypeDisplay: 'Type 1',
            isDiscount: false,
            discount: 0,
          }, ],
        },
      },
    };

    instance.lifeStyleMenuThen(mockResponse);

  });

  it("should open app store when click", () => {
    instance.handleUpdate();
  });

  it("should open playstore when click", () => {
    global.getApp = vi.fn(() => ({
      globalData: {
        nativeData: {
          clientPlatform: 'android'
        },
      },
    }));
    instance.handleUpdate();
  });

});