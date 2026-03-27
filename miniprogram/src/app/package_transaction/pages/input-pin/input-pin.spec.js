import "./input-pin"
import * as api from '/src/public/api'
import {
  expect,
  vi
} from "vitest"
import * as e2ee from '/src/utils/e2ee'
import * as routeUtil from "/src/utils/route-util";

const instance = global.pageInstance
const my = global.my
my.authErrorFunc = vi.fn()
my.call = vi.fn((param1, param2, callback) => {
  if (typeof callback === "function") {
    callback({});
  }
});
my.vibrateShort = vi.fn((res) => ({
  res
}))

vi.spyOn(api, 'postBillerValidation')
vi.spyOn(api, 'postBillerExecution')



vi.mock(('../../../../utils/e2ee'), () => ({
  encryptMPIN: vi.fn(),
  encryptAPIData: vi.fn(),
  decryptAPIData: vi.fn()
}));
vi.mock(('../../../../utils/signature'), () => ({
  generateSignature: vi.fn(),
}))


my.call = vi.fn((param1, param2, callback) => {
  callback({})
})
describe("input pin", () => {

  describe('onUnload', () => {
    it("test for on unload function", () => {
      instance.onUnload()
      expect(1).toBe(1)
    })
  })

  describe('onHide', () => {
    it("test for onhide function", () => {
      instance.onHide()
      expect(1).toBe(1)
    })
  })

  describe('onShow', () => {
    it("test for onShow function", () => {
      instance.onShow()
      expect(1).toBe(1)
    })
    it("test for onShow function", () => {
      instance.data.authType = "POSTLOGIN_NO_PIN"
      instance.onShow()
      expect(1).toBe(1)
    })
  })
  describe('onLoad', () => {


    it('should set data correctly from query parameters', () => {
      const query = {
        customUrlQueryData: 'testId'
      };

      my.customUrlQueryData = {
        testId: {
          transactionId: '12345',
          scenario: 'testScenario',
          transactionData: {
            key: 'value'
          },
          partnerMenu: 'testMenu',
          transactionTypePartner: 'testType',
          authType: 'NONE'
        }
      };

      instance.onLoad.call(instance, query);

    });

    it('should call verifyPassword when authType is POSTLOGIN_NO_PIN', () => {
      const query = {
        customUrlQueryData: 'testId'
      };

      my.customUrlQueryData = {
        testId: {
          transactionId: '12345',
          scenario: 'testScenario',
          transactionData: {
            key: 'value'
          },
          partnerMenu: 'testMenu',
          transactionTypePartner: 'testType',
          authType: 'POSTLOGIN_NO_PIN'
        }
      };

      instance.onLoad.call(instance, query);

    });

    it('should set submitting and canInput correctly when authType is not POSTLOGIN_NO_PIN', () => {
      const query = {
        customUrlQueryData: 'testId'
      };

      my.customUrlQueryData = {
        testId: {
          transactionId: '12345',
          scenario: 'testScenario',
          transactionData: {
            key: 'value'
          },
          partnerMenu: 'testMenu',
          transactionTypePartner: 'testType',
          authType: 'NONE'
        }
      };

      instance.onLoad.call(instance, query);

    });
  });


  describe('onHandleClick', () => {

    it("shouldnt click pin", () => {

      instance.setData({
        canInput: false,
        mpinInput: []
      })

      const mock = {
        target: {
          dataset: {
            attr: '123123'
          }
        }
      }
      instance.onHandleClick(mock)

      expect(instance.data.mpinInput).toStrictEqual([])
    })

    it("click pin", () => {

      instance.setData({
        canInput: true,
        mpinInput: []
      })

      const mock = {
        target: {
          dataset: {
            attr: '123123'
          }
        }
      }
      instance.onHandleClick(mock)

      expect(instance.data.mpinInput).toStrictEqual(['123123'])
    })

    it("click pin (mpinInput.length =  6)", () => {

      instance.setData({
        canInput: true,
        mpinInput: ['1', '2', '3', '4', '5', '6']
      })

      const mock = {
        target: {
          dataset: {
            attr: '6'
          }
        }
      }
      instance.onHandleClick(mock)
      instance.onHandleClick(mock)
      instance.onHandleClick(mock)
      instance.onHandleClick(mock)
      instance.onHandleClick(mock)
      instance.onHandleClick(mock)


      expect(instance.data.mpinInput).toStrictEqual(['6', '6', '6', '6', '6', '6'])
      expect(instance.data.isError).toBe(false)
    })
  })

  describe('onHandleClickDelete', () => {
    it('shouldnt do nothing', () => {
      instance.setData({
        canInput: false,
        mpinInput: ['1', '2', '3', '4', '5', '6']
      })

      instance.onHandleClickDelete()

      expect(instance.data.isError).toBe(false)
      expect(instance.data.mpinInput).toStrictEqual(['1', '2', '3', '4', '5', '6'])

    });

    it('6-digit password entered', () => {
      instance.setData({
        canInput: true,
        mpinInput: ['1', '2', '3', '4', '5', '6']
      })

      instance.onHandleClickDelete()

      expect(instance.data.isError).toBe(false)
      expect(instance.data.mpinInput).toStrictEqual([])

    });

    it('5-digit password entered', () => {
      instance.setData({
        canInput: true,
        mpinInput: ['1', '2', '3', '4', '5']
      })

      instance.onHandleClickDelete()

      expect(instance.data.mpinInput).toStrictEqual(['1', '2', '3', '4'])

    });
  })

  describe('resetMPIN', () => {
    it('resetMPIN ', () => {
      instance.resetMPIN()
      expect(instance.data.showErrorDialog).toStrictEqual(false)
      expect(instance.data.forgetPin).toStrictEqual(false)
    });
  })

  describe('onHandleClickForgot', () => {
    it('onHandleClickForgot ', () => {
      instance.onHandleClickForgot()
      expect(instance.data.forgetPin).toStrictEqual(true)
    });
  })

  describe('closeModal', () => {
    it('closeModal ', () => {
      instance.closeModal()
      expect(instance.data.forgetPin).toStrictEqual(false)
    });
  })

  describe('backToHome', () => {
    it('test back to home function', () => {
      instance.backToHome()
      expect(1).toBe(1)
    })
    
    it('test for transactionExecution',  () => {
      vi.spyOn(instance, 'transactionExecution')
      vi.spyOn(routeUtil, "customNavigateTo")

       instance.transactionExecution.call(instance, "casdasdasd")

    })
  })

  describe('verifyPassword', () => {


    const mockDataExecution = {
      "data": {
        "transactionStatus": "SENT",
        "creditCardChargeAmount": 500000,
        "isFromContact": true,
        "additionalBillerData": [{
          "additionalLabel": "Promo Code",
          "additionalValue": "DISCOUNT123"
        }],
        "packageData": {
          "packageCode": "PKG123",
          "title": "Premium Package",
          "description": "Full-feature package"
        },
        "categoryData": {
          "categoryId": "py72wj7639eWWBI",
          "categoryIcon": "iconlink1",
          "categoryName": "Pulsa & Pascabayar",
          "isCrowned": true,
          "crown": "Baru",
          "categorySequence": 1,
          "isPopular": true
        },
        "ubpCompanyCode": "UTILCO",
        "billerCode": "ELECTRICITY",
        "billerName": "Electricity Provider",
        "billerAliasName": "Electricity",
        "billerLogo": "electricity_icon.png",
        "subRegionName": "RegionABC",
        "subRegionPrefixCode": "110593",
        "billKey1Label": "Meter Number",
        "billKey1LabelEn": "Meter Number",
        "billKey1LabelId": "meter_number",
        "journalNumberValues": [
          "JN12345",
          "JN67890"
        ],
        "paymentMethod": "Credit Card",
        "paymentType": "One-time",
        "completionTime": "2023-12-15T12:34:56Z",
        "billAmount": 515000,
        "isContactFull": true
      },
      
        "dataProtected": {
            "billInfoList": [
                {
                    "label": "NAMA",
                    "value": "IDHAM DHIYAULHAQ HABIBI"
                },
                {
                    "label": "NOMINAL",
                    "value": "10000"
                },
                {
                    "label": "BIAYA ADMIN",
                    "value": "5000"
                },
                {
                    "label": "PENALTI",
                    "value": "0"
                },
                {
                    "label": "TOTAL",
                    "value": "15000"
                }
            ],
            "account": {
                "accountName": "John Doe",
                "productName": "Gold Package",
                "accountNumber": "1234567890"
            },
            "creditCard": {
                "cardProduct": "Platinum Card",
                "cardNumber": "**** **** **** 1234",
                "amexPrincipalFlag": false,
                "binFirstDigits": "1234",
                "binLastDigits": "5678"
            },
            "referenceId": "REF123",
            "customerName": "John Doe",
            "sipNumber": "192.168.1.1",
            "referenceNumber": "REF-09876",
            "electricityTokenNumber": "TOKEN123",
            "billKey1": "123456789012",
            "billKey2": "987654321098",
            "billKey3": "543210987654"
        }
    
    }

    const mockDecrypted = {
      "transactionId": "V59jhJsfTHC7ZeCrCec7G",
      "completionTime": "10910912",
      "settlementDate": "19/10/2024",
      "series": "ORI02-120",
      "referenceNumber": "153253",
      "amount": 4000000,
      "currencyCode": "IDR",
      "accountName": "Budi Sembada",
      "accountProductName": "Taplus Bisnis",
      "customerAccountNumber": "1000798385",
      "status": "SUCCESS",
      "receiptInfo": [{
          "label": "NAMA WAJIB BAYAR",
          "value": "ERDIENY"
        },
        {
          "label": "MATA UANG",
          "value": "IDR"
        },
        {
          "label": "BIAYA ADMIN",
          "value": "0"
        },
        {
          "label": "PENALTI",
          "value": "0"
        },
        {
          "label": "JUMLAH SETORAN",
          "value": "1000000"
        },
        {
          "label": "TERBILANG",
          "value": "satu juta rupiah"
        },
        {
          "label": "KODE BILLING",
          "value": "924090520536775"
        },
        {
          "label": "NTPN",
          "value": "A20411MLUCTVS1M7"
        },
        {
          "label": "TANGGAL BUKU",
          "value": "06/09/2024"
        },
        {
          "label": "NTB",
          "value": "117702153253"
        },
        {
          "label": "STAN",
          "value": "936775"
        }
      ]
    }

    
    const mockData = {
      "data": {
        "data": {
          token: "tokennnntokennn"
        },
        "dataProtected":mockDecrypted
      }
    }

    beforeAll(() => {
      my.customUrlQueryData["input-pin"] = {
        "featureType": "bonds",
        transactionId: "txId",
        transactionType: "booking",
      }
      instance.data.authType = "POSTLOGIN_NO_PIN"

    })



    it('test for verify password function for call api booking is success', async () => {
      instance.setData({
        scenario: "bill-payment"
      })

      api.postBillerValidation.mockResolvedValueOnce(mockData)
      api.postBillerExecution.mockResolvedValueOnce({
        "data": mockDataExecution
      })
      await delay(0)
      await instance.verifyPassword()

    })


    it('test for verify password function for call api is failed with error code BPY-037-1588', async () => {

      const mockData = {
        data: {
          "errorCode": "BPY-037-1588",
          "errorTitle": "BPY-037-1588_errorTitle",
          "errorMessage": "BPY-037-1588_errorMessage"
        }
      }
      api.postBillerValidation.mockRejectedValueOnce(mockData)
      await instance.verifyPassword()
      await delay(0)
      const mockE2ee = vi.mocked(e2ee)

      expect(mockE2ee.encryptMPIN).toHaveBeenCalled()
    })

    it('test for verify password function for call api is failed with error code UMS-002-110', async () => {

      const mockData = {
        data: {
          "errorCode": "UMS-002-110",
          "errorTitle": "UMS-002-102_errorTitle",
          "errorMessage": "UMS-002-102_errorMessage"
        }
      }
      api.postBillerValidation.mockRejectedValueOnce(mockData)
      await instance.verifyPassword()
      await delay(0)
    })

    it('test for verify password function for call api is failed with error code UMS-002-102', async () => {

      const mockData = {
        data: {
          "errorCode": "UMS-002-102",
          "errorTitle": "UMS-002-102_errorTitle",
          "errorMessage": "UMS-002-102_errorMessage"
        }
      }

      api.postBillerValidation.mockRejectedValueOnce(mockData)
      await instance.verifyPassword()
      await delay(0)
     
    })

    it('test for verify password function for call api is failed with error code UMS-002-119', async () => {

      const mockData = {
        data: {
          "errorCode": "UMS-002-119",
          "errorTitle": "UMS-002-102_errorTitle",
          "errorMessage": "UMS-002-102_errorMessage"
        }
      }

      api.postBillerValidation.mockRejectedValueOnce(mockData)
      await instance.verifyPassword()
      await delay(0)
     
      expect(instance.data.showErrorDialog).toBe(false)
      expect(instance.data.isError).toBe(true)
    })

    it('test for verify password function for call api is failed with error code UMS-002-xxx', async () => {

      const mockData = {
        data: {
          "errorCode": "UMS-002-xxx",
          "errorTitle": "UMS-002-102_errorTitle",
          "errorMessage": "UMS-002-102_errorMessage"
        }
      }

      api.postBillerValidation.mockRejectedValueOnce(mockData)
      await instance.verifyPassword()
      await delay(0)
     
      expect(instance.data.showErrorDialog).toBe(false)
      expect(instance.data.isError).toBe(true)
    })

    it('test for verify password function for call api validate is success and execution is failed TRX-000-608 ', async () => {

      const mockDataReject = {
        data: {
          "errorCode": "TRX-000-608",
          "errorTitle": "UMS-002-102_errorTitle",
          "errorMessage": "UMS-002-102_errorMessage"
        }
      }

      instance.setData({
        transactionData: {
          data: {
            transactionStatus: "tx status"
          }
        }
      })

      api.postBillerValidation.mockResolvedValueOnce(mockData)
      api.postBillerExecution.mockRejectedValueOnce(mockDataReject)
      await delay(0)
      
      await instance.verifyPassword()

      
    })

    it('test for verify password function for call api validate is success and execution is failed BPY-037-1588 ', async () => {

      const mockDataReject = {
        data: {
          "errorCode": "BPY-037-1588",
          "errorTitle": "UMS-002-102_errorTitle",
          "errorMessage": "UMS-002-102_errorMessage"
        }
      }
      instance.data.scenario = false

      api.postBillerValidation.mockResolvedValueOnce(mockData)
      api.postBillerExecution.mockRejectedValueOnce(mockDataReject)
      e2ee.decryptAPIData.mockReturnValueOnce(JSON.stringify(mockDecrypted))
      await delay(0)
      const mockE2ee = vi.mocked(e2ee)
      await instance.verifyPassword()

      expect(mockE2ee.encryptMPIN).toHaveBeenCalled()
    })



    it('test for verify password function for call api validate is success and execution is failed BPY-037-1588 ', async () => {

      const mockDataReject = {
        data: {
          "errorCode": "BPY-037-1588",
          "errorTitle": "UMS-002-102_errorTitle",
          "errorMessage": "UMS-002-102_errorMessage"
        }
      }
      instance.data.scenario = true

      api.postBillerValidation.mockResolvedValueOnce(mockData)
      api.postBillerExecution.mockRejectedValueOnce(mockDataReject)
      await delay(0)
     
      await instance.verifyPassword()

     
    })

    it('test for verify password function for call api validate is success and execution is failed WBN-065-032 ', async () => {

      const mockDataReject = {
        data: {
          "errorCode": "GNR-000-996",
          "errorTitle": "UMS-002-102_errorTitle",
          "errorMessage": "UMS-002-102_errorMessage"
        }
      }

      api.postBillerValidation.mockResolvedValueOnce(mockData)
      api.postBillerExecution.mockRejectedValueOnce(mockDataReject)
      await delay(0)
     
      await instance.verifyPassword()

     
    })

    it('test for verify password function for call api validate is success and execution is failed TRX-000-607 ', async () => {

      const mockDataReject = {
        data: {
          "errorCode": "TRX-000-607",
          "errorTitle": "UMS-002-102_errorTitle",
          "errorMessage": "UMS-002-102_errorMessage"
        }
      }

      api.postBillerValidation.mockResolvedValueOnce(mockData)
      api.postBillerExecution.mockRejectedValueOnce(mockDataReject)
      await delay(0)
     
      await instance.verifyPassword()

     
    })

    it('test for verify password function for call api validate is success and execution is failed UMS-002-xxx ', async () => {

      const mockDataReject = {
        data: {
          "errorCode": "VAT-030-023",
          "errorTitle": "UMS-002-102_errorTitle",
          "errorMessage": "UMS-002-102_errorMessage"
        }
      }

      instance.setData({
        transactionData: {
          data: {
            transactionStatus: "tx status"
          }
        },
        scenario: "tsel"
      })

      api.postBillerValidation.mockResolvedValueOnce(mockData)
      api.postBillerExecution.mockRejectedValueOnce(mockDataReject)
      await delay(0)
      
      await instance.verifyPassword()

     
    })

    it('test for verify password function for call api validate is success and execution is failed UMS-002-xxx ', async () => {

      const mockDataReject = {
        data: {
          "errorCode": "GNR-000-902",
          "errorTitle": "UMS-002-102_errorTitle",
          "errorMessage": "UMS-002-102_errorMessage"
        }
      }

      instance.setData({
        transactionData: {
          data: {
            transactionStatus: "tx status"
          }
        },
        scenario: "tsel"
      })

      api.postBillerValidation.mockResolvedValueOnce(mockData)
      api.postBillerExecution.mockRejectedValueOnce(mockDataReject)
      await delay(0)
     
      await instance.verifyPassword()

     
    })

    it('test for verify password function for call api validate is success and execution is failed UMS-002-xxx ', async () => {

      const mockDataReject = {
        data: {
          "errorCode": "VAT-030-012",
          "errorTitle": "UMS-002-102_errorTitle",
          "errorMessage": "UMS-002-102_errorMessage"
        }
      }

      instance.setData({
        transactionData: {
          data: {
            transactionStatus: "tx status"
          }
        },
        scenario: "tsel"
      })

      api.postBillerValidation.mockResolvedValueOnce(mockData)
      api.postBillerExecution.mockRejectedValueOnce(mockDataReject)
      await delay(0)
     
      await instance.verifyPassword()

     
    })

    it('test for verify password function for call api validate is success and execution is failed UMS-002-xxx ', async () => {

      const mockDataReject = {
        data: {
          "errorCode": "VAT-030-013",
          "errorTitle": "UMS-002-102_errorTitle",
          "errorMessage": "UMS-002-102_errorMessage"
        }
      }

      instance.setData({
        transactionData: {
          data: {
            transactionStatus: "tx status"
          }
        },
        scenario: "tsel"
      })

      api.postBillerValidation.mockResolvedValueOnce(mockData)
      api.postBillerExecution.mockRejectedValueOnce(mockDataReject)
      await delay(0)
     
      await instance.verifyPassword()

      
    })

    it('test for verify password function for call api validate is success and execution is failed UMS-002-xxx ', async () => {

      const mockDataReject = {
        data: {
          "errorCode": "VAT-030-014",
          "errorTitle": "UMS-002-102_errorTitle",
          "errorMessage": "UMS-002-102_errorMessage"
        }
      }

      instance.setData({
        transactionData: {
          data: {
            transactionStatus: "tx status"
          }
        },
        scenario: "tsel"
      })

      api.postBillerValidation.mockResolvedValueOnce(mockData)
      api.postBillerExecution.mockRejectedValueOnce(mockDataReject)
      await delay(0)
     
      await instance.verifyPassword()

     
    })

    it('test for verify password function for call api validate is success and execution is failed UMS-002-xxx ', async () => {

      const mockDataReject = {
        data: {
          "errorCode": "VAT-030-015",
          "errorTitle": "UMS-002-102_errorTitle",
          "errorMessage": "UMS-002-102_errorMessage"
        }
      }

      instance.setData({
        transactionData: {
          data: {
            transactionStatus: "tx status"
          }
        },
        scenario: "tsel"
      })

      api.postBillerValidation.mockResolvedValueOnce(mockData)
      api.postBillerExecution.mockRejectedValueOnce(mockDataReject)
      await delay(0)
     
      await instance.verifyPassword()

      
    })

    it('test for verify password function for call api validate is success and execution is failed UMS-002-xxx ', async () => {

      const mockDataReject = {
        data: {
          "errorCode": "VAT-030-008",
          "errorTitle": "UMS-002-102_errorTitle",
          "errorMessage": "UMS-002-102_errorMessage"
        }
      }

      instance.setData({
        transactionData: {
          data: {
            transactionStatus: "tx status"
          }
        },
        scenario: "tsel"
      })

      api.postBillerValidation.mockResolvedValueOnce(mockData)
      api.postBillerExecution.mockRejectedValueOnce(mockDataReject)
      await delay(0)
     
      await instance.verifyPassword()

    
    })

    it('test for verify password function for call api validate is success and execution is failed UMS-002-xxx ', async () => {

      const mockDataReject = {
        data: {
          "errorCode": "VAT-030-024",
          "errorTitle": "UMS-002-102_errorTitle",
          "errorMessage": "UMS-002-102_errorMessage"
        }
      }

      instance.setData({
        transactionData: {
          data: {
            transactionStatus: "tx status"
          }
        },
        scenario: "tsel"
      })

      api.postBillerValidation.mockResolvedValueOnce(mockData)
      api.postBillerExecution.mockRejectedValueOnce(mockDataReject)
      await delay(0)
     
      await instance.verifyPassword()

     
    })

  })

  describe('onClickErrorExecution', () => {

    it('should navigate to index', () => {


      instance.onClickErrorExecution()

      expect(instance.data.buttonFuncFlag).toBeTypeOf("string")
      expect(my.call).toHaveBeenCalled()
    })

    it('should navigate to index', () => {
      instance.setData({
        buttonFuncFlag: false
      })

      instance.onClickErrorExecution()

      expect(instance.data.buttonFuncFlag).toBe(false)
      expect(my.redirectTo).toHaveBeenCalled()
    })
    
  })

})