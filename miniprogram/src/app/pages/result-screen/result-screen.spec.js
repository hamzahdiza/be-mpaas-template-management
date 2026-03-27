import "./result-screen";
import * as e2ee from "../../../utils/e2ee";
import {
  describe,
  it,
  beforeAll,
  expect,
  vi
} from "vitest"; 


vi.mock("/src/public/api", () => ({
  checkStatusBP:vi.fn()
}));


vi.mock("/src/utils/e2ee", () => ({
  decryptAPIData: vi.fn(),
  encryptAPIData: vi.fn()
}))

const currentResProtected = {
  "transactionId":"6sYDRLt1USYhyu6-Uw6Wi",
  "billAmount":7500.0,
  "completionTime":"2024-11-19 10:21:25.793+0700",
  "referenceNumber":"3123131231",
  "transactionTypePartner":"KAI",
  
  "billerName":"KAI",
  "billKey1":"242042367",
  "account":{
    "accountName":"ALIFAH FADIYAH",
    "productName":"TAPLUS",
    "accountNumber":"1000902126"
  }
}
const lang = {...getApp().globalData.languagePack, lifestyleBillPaymentJavaJazzFestivalResultScreenRecentReceiptButtonLabel: "Receipt", lifestyleBillPaymentJavaJazzFestivalResultScreenHistoryTransactionButtonLabel: "Transaction History",
lifestyleBillPaymentJavaJazzFestivalResultScreenMutationCheckButtonLabel:"Check Mutation"}
const getAppMock = vi.fn().mockReturnValue({
  globalData: {
    transactionTypePartner:"kai",
    nativeData: {
      sessionKey: getApp().globalData.nativeData.sessionKey
    },
    languagePack: lang,
  }

})


const currentPage = global.pageInstance;
const my = global.my;
my.call = vi.fn((param1, param2, callback) => {
  callback()
})
my.navigateToMiniProgram = vi.fn()
describe('result screen kai', () => {

  beforeAll(() => {
    vi.spyOn(global, "getApp").getMockImplementation(getAppMock)
    global.getApp = getAppMock

  });

  describe('if transactionDetail return SUCCESS', () => {


    it('should return success', async () => {
      my.customUrlQueryData["result-screen"] = {
        transactionData: {
          "data": {
            "paymentType": "3",
            "billAmount": 102000,
            "isContactFull": false,
            "packageData": {},
            "billKey1Label": "Nomor Telepon",
            "journalNumber": "974019",
            "transactionStatus": "SUCCESS",
            "sofType": "ACCOUNT",
            "billKey1LabelId": "Nomor Telepon",
            "billerCode": "01",
            "ubpCompanyCode": "0010000016",
            "billerAliasName": "Telkomsel Paket Hemat",
            "additionalBillerData": [
              {
                "additionalLabel": "Nomor Referensi",
                "additionalValue": "000000536906"
              }
            ],
            "billerName": "Telkomsel Paket Hemat",
            "billerLogo": "https://mav-apigw-ext-test2.bni.co.id:48202/asset/v1/image/paf7zukFDplDSIlxTfQl8.png",
            "billKey1LabelEn": "Phone Number",
            "isFromContact": false,
            "paymentMethod": "ACCOUNT",
            "completionTime": "2024-10-12 15:03:38.650+0700",
            "categoryData":{
              "categoryName":"Transportasi"
            },
          },
          dataProtected: "dummy"
        },
      };


      vi.spyOn(e2ee, 'decryptAPIData')
      vi.spyOn(my, "call").mockImplementation((p1,p2,p3) => {p3({data:"test"})});
      currentPage.onShow()
      getCurrentPages.mockReturnValue([1,{route:"dummmy false"}]);     
     await currentPage.onLoad({
        customUrlQueryData: "result-screen"
      });

      e2ee.decryptAPIData.mockReturnValue(JSON.stringify(currentResProtected))

      await currentPage.onLoad({
        customUrlQueryData: "result-screen"
      });
      await delay(0)

      expect(currentPage.data.nominalAmount).toBeTypeOf("string")

      expect(my.call).toHaveBeenCalled()
      
      vi.spyOn(JSON, 'parse').mockReturnValueOnce(currentPage.data.transactionData);
      my.customUrlQueryData["result-screen"] = {transactionData:false}
      currentPage.onLoad({
        customUrlQueryData: "result-screen"
      })
    
  
      expect(my.call).toHaveBeenCalled()

    });
  });
 
  describe('if transactionDetail return INPROGRESS', () => {

    it('transactionStatus to be INPROGRESS', async () => {

    
      my.customUrlQueryData["result-screen"] = {
        transactionData: {
          "data": {
            "paymentType": "3",
            "isContactFull": false,
            "packageData": {},
            "billKey1Label": "Nomor Telepon",
            "journalNumber": "974019",
            "transactionStatus": "INPROGRESS",
            "categoryData": {
              "categoryIcon": "https://mav-apigw-ext-test2.bni.co.id:48202/asset/v1/image/FGpP_WBvO6a5A5hCegL5X.png",
              "isCrowned": false,
              "categorySequence": 1,
              "isPopular": false,
              "categoryName": "Paket Data",
              "categoryId": "zDe8pgfzM_bVJYE4Ehb2A",
              "crown": "Off"
            },
            "sofType": "ACCOUNT",
            "billKey1LabelId": "Nomor Telepon",
            "billerCode": "01",
            "ubpCompanyCode": "0010000016",
            "billerAliasName": "Telkomsel Paket Hemat",
            "additionalBillerData": [
              {
                "additionalLabel": "Nomor Referensi",
                "additionalValue": "000000536906"
              }
            ],
            "billerName": "Telkomsel Paket Hemat",
          
            "completionTime": "2024-10-12 15:03:38.650+0700"
          },
          dataProtected: {
            "billKey1":"222222",
            "transactionId": "A9e5Zd0-PGVUsxVm7ms-5",
            "referenceId": "202410080951308638",
            "referenceNumber": "202410080951308638",
    
            "account": {
                "accountNumber": "1000796503",
                "accountName": "ANGGIT PRAYOGO",
                "productName": "TAPLUS"
            }
          }
        },
      }


      vi.spyOn(e2ee, 'decryptAPIData')

      getCurrentPages.mockReturnValue([1,{route:"dummmy false"}]); 
     await currentPage.onLoad({
        customUrlQueryData: "result-screen"
      });
     
      await delay(0)
      e2ee.decryptAPIData.mockReturnValue(JSON.stringify(currentResProtected))


      getCurrentPages.mockReturnValue([1,{route:"dummmy false"}]);     
     await currentPage.onLoad({
        customUrlQueryData: "result-screen"
      });

      e2ee.decryptAPIData.mockReturnValue(JSON.stringify(currentResProtected))

      await currentPage.onLoad({
        customUrlQueryData: "result-screen"
      });
      await delay(0)

      expect(currentPage.data.transactionData).toHaveProperty("dataProtected")
      expect(currentPage.data.nominalAmount).toBeTypeOf("string")

      expect(currentPage.data.transactionData.data.transactionStatus).toBe("INPROGRESS")

    });
  });

  describe('if transactionDetail return FAILED', () => {

    it('should return success 200 and transactionStatus to be failed', async () => {


     
      my.customUrlQueryData["result-screen"] = {
        transactionData: {
          "data": {
            "paymentType": "3",
            "isContactFull": false,
            "packageData": {},
            "billKey1Label": "Nomor Telepon",
            "journalNumber": "974019",
            "transactionStatus": "FAILED",
            "categoryData": {
              "categoryIcon": "https://mav-apigw-ext-test2.bni.co.id:48202/asset/v1/image/FGpP_WBvO6a5A5hCegL5X.png",
              "isCrowned": false,
              "categorySequence": 1,
              "isPopular": false,
              "categoryName": "Paket Data",
              "categoryId": "zDe8pgfzM_bVJYE4Ehb2A",
              "crown": "Off"
            },
            "sofType": "ACCOUNT",
            "billKey1LabelId": "Nomor Telepon",
            "billerCode": "01",
            "ubpCompanyCode": "0010000016",
            "billerAliasName": "Telkomsel Paket Hemat",
            "additionalBillerData": [
              {
                "additionalLabel": "Nomor Referensi",
                "additionalValue": "000000536906"
              }
            ],
            "billerName": "Telkomsel Paket Hemat",
          
            "completionTime": "2024-10-12 15:03:38.650+0700"
          },
          dataProtected: {
            "billKey1":"222222",
            "transactionId": "A9e5Zd0-PGVUsxVm7ms-5",
            "referenceId": "202410080951308638",
            "referenceNumber": "202410080951308638",
    
            "account": {
                "accountNumber": "1000796503",
                "accountName": "ANGGIT PRAYOGO",
                "productName": "TAPLUS"
            }
          }
        },
      }


      vi.spyOn(e2ee, 'decryptAPIData')

      getCurrentPages.mockReturnValue([1,{route:"dummmy false"}]); 
     await currentPage.onLoad({
        customUrlQueryData: "result-screen"
      });
     
      await delay(0)
      e2ee.decryptAPIData.mockReturnValue(JSON.stringify(currentResProtected))


      getCurrentPages.mockReturnValue([1,{route:"dummmy false"}]);     
     await currentPage.onLoad({
        customUrlQueryData: "result-screen"
      });

      e2ee.decryptAPIData.mockReturnValue(JSON.stringify(currentResProtected))

      await currentPage.onLoad({
        customUrlQueryData: "result-screen"
      });
      await delay(0)

      expect(currentPage.data.transactionData).toHaveProperty("dataProtected")
      expect(currentPage.data.nominalAmount).toBeTypeOf("string")

      expect(currentPage.data.transactionData.data.transactionStatus).toBe("FAILED")

    });
  });
 



  describe("if featureHandler invoked, and it's name value is from lang.lang.lifestyleBillPaymentResultScreenRecentReceiptButtonLabel", () => {
    it("should set isOpen to true", () => {
      vi.spyOn(my, "call").mockImplementation((p1,p2,p3) => {
        p3()
      });
      currentPage.featureHandler({
        currentTarget: {
          dataset: {
            name: currentPage.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenRecentReceiptButtonLabel
          }
        }
      })

      expect(my.call).toHaveBeenCalled()
      expect(my.call).toHaveBeenCalledWith("goToReceiptScreen", {
        transactionId: currentPage.data.transactionData.dataProtected.transactionId,
        fromScreen: "src/app/package_result_screen/result-screen-bp/result-screen-bp"
      }, expect.any(Function))
      expect(my.call.mock.calls[0][2]).toBeInstanceOf(Function); 

    })
  })

  describe("if featureHandler invoked, and it's name value is from  this.data.lang.lifestyleBillPaymentResultScreenMutationCheckButtonLabel", () => {
    it("should navigate to casa detail with JSAPI", () => {
  
     
      vi.spyOn(my, "call").mockImplementation((p1, p2, p3) => {
        p3()
      });
      currentPage.data.transactionData = {dataProtected: {
        "account": {
          "accountNumber": "1000796503",
          "accountName": "ANGGIT PRAYOGO",
          "productName": "TAPLUS"
      }
      }}
      currentPage.featureHandler({
        currentTarget: {
          dataset: {
            name: currentPage.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenMutationCheckButtonLabel
          }
        }
      })

      expect(my.call).toHaveBeenCalled()
      expect(my.call).toHaveBeenCalledWith("goToCasaDetail", {accountNumber: currentPage.data.transactionData.dataProtected.account.accountNumber}, expect.any(Function))

      currentPage.featureHandler({
        currentTarget: {
          dataset: {
            name: currentPage.data.lang.lifestyleBillPaymentResultScreenMutationCheckButtonLabel
          }
        }
      })


      expect(my.call).toHaveBeenCalled()
      expect(my.call).toHaveBeenCalledWith("goToCasaDetail", { accountNumber: currentPage.data.transactionData.dataProtected.account.accountNumber}, expect.any(Function))
    })
  })


  describe("if homeHandler  invoked", () => {
    it(" should call my.call(goToHomeScreen)", () => {
      vi.spyOn(my, "call").mockImplementation((p1,p2,p3) => {
        p3()
      });
      currentPage.homeHandler()

      expect(my.call).toHaveBeenCalled()
      expect(my.call).toHaveBeenCalledWith("goToHomeScreen", {}, expect.any(Function))
      expect(my.call.mock.calls[0][2]).toBeInstanceOf(Function); 

    })
  })
  describe("if closeStillPending  invoked", () => {
    it(" should close the stillPending modal", () => {
     
      currentPage.closeStillPending()

      expect(currentPage.data.isStillPending).toBe(false)
     

    })
  })
 
  

});


describe('open transaction history lifestyle', () => {
  beforeEach(() => {
    global.my = {
      call: vi.fn(),
      navigateToMiniProgram: vi.fn(),
    };
  });

  it('should call my.navigateToMiniProgram with correct appId and path', () => {
    my.call.mockImplementation((method, params, callback) => {
      callback({
        "app.mpaas.application.id.lifestyle": "someAppId",
        "app.mpaas.application.path.lifestyle.history": "somePath",
      });
    });

    currentPage.featureHandler({
      currentTarget: {
        dataset: {
          name: "currentPage.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenMutationCheckButtonLabel"
        }
      }
    })
  });

  

  it('should call my.navigateToMiniProgram with correct appId and path', () => {
    my.call.mockImplementation((method, params, callback) => {
      callback({
        "app.mpaas.application.id.lifestyle": "someAppId",
        "app.mpaas.application.path.lifestyle.history": "somePath",
      });
    });
    currentPage.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenHistoryTransactionButtonLabel = "Label"

    currentPage.featureHandler({
      currentTarget: {
        dataset: {
          name: currentPage.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenHistoryTransactionButtonLabel
        }
      }
    })
  });

  it('should call my.navigateToMiniProgram with correct appId and path', () => {

    currentPage.setFeaturesList('status')
  });
});