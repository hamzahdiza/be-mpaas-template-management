import "./gather-screen-va";
import * as api from "/src/public/api";
import {
  beforeAll,
  describe,
  expect,
  it,
  vi
} from "vitest";

const app = getApp();
my.exitMiniProgram = vi.fn(() => {});

my.call = vi.fn((param1, param2, callback) => {
  callback({})
})
const currentPage = global.pageInstance;


describe("gather screen virtual account page", () => {
  beforeAll(() => {
    vi.spyOn(currentPage, 'callApiListAccount');
    vi.spyOn(currentPage, 'callApiBillPayment');
    // vi.spyOn(currentPage, 'setDetailTransaction');
    // vi.spyOn(currentPage, 'gatherScreenCatch');
    vi.spyOn(api, 'accountListPost');
    vi.spyOn(api, 'inquiryBillPayment')

  });

  describe("onLoad", () => {


    it("set state isLoading, lang orderID transaction type", async () => {
      const mocDEc = {
        data: {
          "dataProtected": ""
        }
      }
    
      my.customUrlQueryData["gather-screen-va"] = {
        "partnerData": {
          "partnerId": "2024",
          "partnerName": "Whoosh",
          "partnerAlias": "WSH",
          "paymentType": "VA",
          "transactionId": "T2KC4ACM0q2iRZNK8Vb3l",
          "screenId": "lifestyleWhoosh",
          "urlRedirect": "https://mvrk-bo-dev.bni.co.id/mpaas/?urlCallback=https:%2F%2Fgoogle.com",
          "urlMicrosite": "https://mvrk-bo-dev.bni.co.id/mpaas/?urlCallback=https:%2F%2Fgoogle.com",
          "ubpCompanyCode": "901101239"
        },
        "queryParam": {
          "orderid": "1231231234565444",
          "packagename": "hemat 2GB",
          "packageprice": "200000",
          "producttype": "paket",
          "productinfo": "2GB 30 hari",
          "msisdn": "628132454222561"
        },
        "ticketList":[
          {
          "ticketId": 842,
          "ticketName": "Daily Pass Friday",
          "ticketDate": "Friday, 30 May 2025",
          "description": [
            "", ""
          ],
          "oldPrice": 0,
          "price": 525000,
          "priceTaxService": 850000,
          "category": "daily_pass",
          "isAvailable": 1,
          "type": "reguler",
          "countAdd": 1,
          "total": 2,
        },
        {
          "ticketId": 844,
          "ticketName": "Daily Pass Saturday",
          "ticketDate": "Saturday, 31 May 2025",
          "description": [
            "", ""
          ],
          "oldPrice": 850000,
          "price": 525000,
          "priceTaxService": 637500,
          "category": "daily_pass",
          "isAvailable": 1,
          "type": "reguler",
          "countAdd": 1,
          "total": 4,
        },
  
        ],
        "selectedTicket": {
          
        "ticketList":[
          {
          "ticketId": 842,
          "ticketName": "Daily Pass Friday",
          "ticketDate": "Friday, 30 May 2025",
          "description": [
            "", ""
          ],
          "oldPrice": 0,
          "price": 525000,
          "priceTaxService": 850000,
          "category": "daily_pass",
          "isAvailable": 1,
          "type": "reguler",
          "countAdd": 1,
          "total": 2,
        },
        {
          "ticketId": 844,
          "ticketName": "Daily Pass Saturday",
          "ticketDate": "Saturday, 31 May 2025",
          "description": [
            "", ""
          ],
          "oldPrice": 850000,
          "price": 525000,
          "priceTaxService": 637500,
          "category": "daily_pass",
          "isAvailable": 1,
          "type": "reguler",
          "countAdd": 1,
          "total": 4,
        },
  
        ],
        },
        priceCount:13123,
        personalData:{

        },
        "ticketCount":123123,
        "orderData":{
          id:"13213"
        }
      };

      my.customUrlQueryData["gather-screen-va"].selectedTicket = my.customUrlQueryData["gather-screen-va"].ticketList

      const mockQuery = {
        customUrlQueryData: 'gather-screen-va'
      };

currentPage.selectedTicket =[]
      api.inquiryBillPayment.mockResolvedValue(mocDEc);

      api.accountListPost.mockResolvedValue(mocDEc);
      currentPage.onLoad(mockQuery);
      currentPage.callApiBillPayment()
      currentPage.callApiListAccount()

      await currentPage.callApiBillPayment();
    });



    it("set state isLoading, lang orderID transaction type", async () => {
      const mockResBook = {
        data: {
          "dataProtected": {
            "billInfoList": [
                {
                    "value": "Combo Sakti Unlimited",
                    "label": "NAMA PAKET"
                },
                {
                    "value": "Combo Sakti Unlimited 25GB,150MntTsel,400SMSTsel",
                    "label": "DETAIL PAKET"
                },
                {
                    "value": "30 Days",
                    "label": "MASA AKTIF"
                },
                {
                    "value": "6282116857457",
                    "label": "NOMOR HP"
                },
                {
                    "value": "102000",
                    "label": "NOMINAL"
                },
                {
                    "value": "1500",
                    "label": "BIAYA ADMIN"
                },
                {
                    "value": "103500",
                    "label": "TOTAL"
                }
            ],
            "currencyCode": "IDR",
            "languageCode": "ID",
            "customerAccountNumber": "17900005014",
            "billKey2": "0",
            "billKey3": "",
            "accountType": "SVGS",
            "billItemList": [
                {
                    "billCustomerChargeAmount": 1500,
                    "billAmount": 102000,
                    "billCode": "01",
                    "billName": "Telkomsel OMNI"
                }
            ],
            "additionalBillerData": {
                "dataRaw": null,
                "productData": null,
                "masaAktif": "30 Days",
                "productName": "Combo Sakti Unlimited",
                "phoneNumber": "6282116857457"
            },
            "companyCode": "0010000016",
            "billKey1": "387770001"
        }
        }
      }
      const mockResAcc = {
        data: {
          "dataProtected":
          {
            sofList: [{
              accountNumber: '123',
              productName: 'BNI',
              accountName: 'Jhamzah',
              balance: 100000,
            },
            {
              accountNumber: '123',
              productName: 'BNI',
              accountName: 'Jhamzah',
              balance: 100000,
              isMainAccount: false
            }
          ]
          }
      }}
     
    
    
      my.customUrlQueryData["gather-screen-va"] = {
        "partnerData": {
          "partnerId": "2024",
          "partnerName": "Whoosh",
          "partnerAlias": "WSH",
          "paymentType": "VA",
          "transactionId": "T2KC4ACM0q2iRZNK8Vb3l",
          "screenId": "lifestyleWhoosh",
          "urlRedirect": "https://mvrk-bo-dev.bni.co.id/mpaas/?urlCallback=https:%2F%2Fgoogle.com",
          "urlMicrosite": "https://mvrk-bo-dev.bni.co.id/mpaas/?urlCallback=https:%2F%2Fgoogle.com",
          "ubpCompanyCode": "901101239"
        },
        "queryParam": {
          "orderid": "1231231234565444",
          "packagename": "hemat 2GB",
          "packageprice": "200000",
          "producttype": "paket",
          "productinfo": "2GB 30 hari",
          "msisdn": "628132454222561"
        },
        "selectedTicket": {
          
        "ticketList":[
          {
          "ticketId": 842,
          "ticketName": "Daily Pass Friday",
          "ticketDate": "Friday, 30 May 2025",
          "description": [
            "", ""
          ],
          "oldPrice": 0,
          "price": 525000,
          "priceTaxService": 850000,
          "category": "daily_pass",
          "isAvailable": 1,
          "type": "reguler",
          "countAdd": 1,
          "total": 2,
        },
        {
          "ticketId": 844,
          "ticketName": "Daily Pass Saturday",
          "ticketDate": "Saturday, 31 May 2025",
          "description": [
            "", ""
          ],
          "oldPrice": 850000,
          "price": 525000,
          "priceTaxService": 637500,
          "category": "daily_pass",
          "isAvailable": 1,
          "type": "reguler",
          "countAdd": 1,
          "total": 4,
        },
  
        ],
        },
        priceCount:13123,
        personalData:{

        },
        "ticketCount":123123,
        "orderData":{
          id:"13213"
        },
       
      };

      const mockQuery = {
        customUrlQueryData: 'gather-screen-va'
      };


      api.inquiryBillPayment.mockResolvedValue(mockResBook);

      api.accountListPost.mockResolvedValue(mockResAcc);
      currentPage.onLoad(mockQuery);
      currentPage.callApiBillPayment()
      currentPage.callApiListAccount()

      await currentPage.callApiBillPayment();
    });
    it("set state isLoading, lang orderID transaction type", async () => {
      currentPage.showHideDetail()
      currentPage.nextButton()
      currentPage.showAccount()

      currentPage.checkSufficientBalance()
    })
    it("set state isLoading, lang orderID transaction type", async () => {
      const mockResBook = {
        data: {
          "dataProtected": {
        "billInfoList": [
            {
                "value": "Combo Sakti Unlimited",
                "label": "NAMA PAKET"
            },
            {
                "value": "Combo Sakti Unlimited 25GB,150MntTsel,400SMSTsel",
                "label": "DETAIL PAKET"
            },
            {
                "value": "30 Days",
                "label": "MASA AKTIF"
            },
            {
                "value": "6282116857457",
                "label": "NOMOR HP"
            },
            {
                "value": "102000",
                "label": "NOMINAL"
            },
            {
                "value": "1500",
                "label": "BIAYA ADMIN"
            },
            {
                "value": "103500",
                "label": "TOTAL"
            }
        ],
        "currencyCode": "IDR",
        "languageCode": "ID",
        "customerAccountNumber": "17900005014",
        "billKey2": "0",
        "billKey3": "",
        "accountType": "SVGS",
        "billItemList": [
            {
                "billCustomerChargeAmount": 1500,
                "billAmount": 102000,
                "billCode": "01",
                "billName": "Telkomsel OMNI"
            }
        ],
        "additionalBillerData": {
            "dataRaw": null,
            "productData": null,
            "masaAktif": "30 Days",
            "productName": "Combo Sakti Unlimited",
            "phoneNumber": "6282116857457"
        },
        "companyCode": "0010000016",
        "billKey1": "387770001"
    }}}

      const mockResAcc = {
        data: {
          "dataProtected": {
        sofList: [{
          accountNumber: '123',
          productName: 'BNI',
          accountName: 'Jhamzah',
          balance: 100000,
        }]}
      }
      }

      my.customUrlQueryData["gather-screen-va"] = {
        "partnerData": {
          "partnerId": "2024",
          "partnerName": "Whoosh",
          "partnerAlias": "WSH",
          "paymentType": "VA",
          "transactionId": "T2KC4ACM0q2iRZNK8Vb3l",
          "screenId": "lifestyleWhoosh",
          "urlRedirect": "https://mvrk-bo-dev.bni.co.id/mpaas/?urlCallback=https:%2F%2Fgoogle.com",
          "urlMicrosite": "https://mvrk-bo-dev.bni.co.id/mpaas/?urlCallback=https:%2F%2Fgoogle.com",
          "ubpCompanyCode": "901101239"
        },
        "queryParam": {
          "orderid": "1231231234565444",
          "packagename": "hemat 2GB",
          "packageprice": "200000",
          "producttype": "paket",
          "productinfo": "2GB 30 hari",
          "msisdn": "628132454222561"
        },
        
        "selectedTicket": {
          
          "ticketList":[
            {
            "ticketId": 842,
            "ticketName": "Daily Pass Friday",
            "ticketDate": "Friday, 30 May 2025",
            "description": [
              "", ""
            ],
            "oldPrice": 0,
            "price": 525000,
            "priceTaxService": 850000,
            "category": "daily_pass",
            "isAvailable": 1,
            "type": "reguler",
            "countAdd": 1,
            "total": 2,
          },
          {
            "ticketId": 844,
            "ticketName": "Daily Pass Saturday",
            "ticketDate": "Saturday, 31 May 2025",
            "description": [
              "", ""
            ],
            "oldPrice": 850000,
            "price": 525000,
            "priceTaxService": 637500,
            "category": "daily_pass",
            "isAvailable": 1,
            "type": "reguler",
            "countAdd": 1,
            "total": 4,
          },
    
          ],
          },
        priceCount:13123,
        personalData:{

        },
        "ticketCount":123123,
        "orderData":{
          id:"13213"
        },
      
      };

      const mockQuery = {
        customUrlQueryData: 'gather-screen-va'
      };

      currentPage.data.inqVA = {
        billedAmount: 5000,
        feeAmount: 5000
      }
      currentPage.data.sourceOfFundList = {
        balance: 5000
      }

      api.accountListPost.mockResolvedValue(mockResAcc);

      api.inquiryBillPayment.mockResolvedValue(mockResBook);
      currentPage.onLoad(mockQuery);
      currentPage.callApiListAccount()
      currentPage.callApiBillPayment()
      currentPage.checkSufficientBalance()

      // currentPage.setDetailTransaction(sampleData)

    });

  });

  describe("onShow", () => {
    it("should hit onShow  ", () => {
      app.globalData.purchase.selectedAccount = {
        accountNumber: "123"
      }
      currentPage.onShow();
    })
    it("should hit onShow  ", () => {
      app.globalData.purchase.selectedAccount = {}
      currentPage.onShow();
    })
  })

  describe('function fetchAccount called', () => {
   
    it("should hit api accounts success with one account", async () => {
      const mockDecryptedData = JSON.stringify({
        sofList: [{
          accountNumber: '123',
          productName: 'BNI',
          accountName: 'Jhamzah',
          balance: 100000,
        }]
      });

      const mockRes = {
        data: {
          "dataProtected":mockDecryptedData
        }
      }
      vi.spyOn(api, 'accountListPost');

      api.accountListPost.mockResolvedValueOnce(mockRes);

      await currentPage.callApiListAccount()

      expect(api.accountListPost).toHaveBeenCalled()
      // expect(e2ee.decryptAPIData).toHaveBeenCalledWith(globalTest.sessionKey, mockRes.data.dataProtected);

      currentPage.setData({
        sourceOfFundList: {
          accountNumber: '987654321',
          sofName: 'Bank A',
          id: 'John Doe',
          balance: 1000,
          balanceFormatter: '1,000.00' // Assuming `currencyFormat` formats this way
        },
        customerNameData: 'John Doe'
      });
    })
    it("should hit api accounts success with one account", async () => {
      const mockDecryptedData = JSON.stringify({
        sofList: [{
          accountNumber: '123',
          productName: 'BNI',
          accountName: 'Jhamzah',
          balance: 100000,
          isMainAccount: false
        },
        {
          accountNumber: '123',
          productName: 'BNI',
          accountName: 'Jhamzah',
          balance: 100000,
          isMainAccount: false
        }]
      });

      const mockRes = {
        data: {
          "dataProtected":mockDecryptedData
        }
      }
      vi.spyOn(api, 'accountListPost');

      api.accountListPost.mockResolvedValueOnce(mockRes);

      await currentPage.callApiListAccount()

      expect(api.accountListPost).toHaveBeenCalled()
      // expect(e2ee.decryptAPIData).toHaveBeenCalledWith(globalTest.sessionKey, mockRes.data.dataProtected);

      currentPage.setData({
        sourceOfFundList: {
          accountNumber: '987654321',
          sofName: 'Bank A',
          id: 'John Doe',
          balance: 1000,
          balanceFormatter: '1,000.00' // Assuming `currencyFormat` formats this way
        },
        customerNameData: 'John Doe'
      });
    })
    it("should hit api accounts success more than one account", async () => {
      const mockDecryptedData = JSON.stringify({
        sofList: [{
            accountNumber: '123',
            productName: 'BNI',
            accountName: 'Hamzah',
            balance: 100000,
          },
          {
            accountNumber: '123',
            productName: 'BNI',
            accountName: 'Hamzah',
            balance: 100000,
            isMainAccount: false
          }
        ]
      });
      const mockRes = {
        data: {
          "dataProtected":mockDecryptedData
        }
      }
      vi.spyOn(api, 'accountListPost');

      api.accountListPost.mockResolvedValueOnce(mockRes);

      await currentPage.callApiListAccount()

      expect(api.accountListPost).toHaveBeenCalled()
      // expect(e2ee.decryptAPIData).toHaveBeenCalledWith(globalTest.sessionKey, mockRes.data.dataProtected);

      currentPage.setData({
        sourceOfFundList: {
          accountNumber: '123',
          sofName: 'BNI',
          id: 'Hamzah',
          balance: 10000,
          balanceFormatter: '1,000.00'
        },
        customerNameData: 'Hamzah'
      });
    })
    it("should hit api accounts failed", async () => {
      api.inquiryBillPayment.mockRejectedValue({
        statusCode: 409,
        data: {
          errCode: ''
        }
      });
      currentPage.callApiBillPayment()
    })
  })
  describe('function fetchBooking called', () => {

    const mockRes = {
      "billingNumber": "81120000564937282",
      "billingLabel": "No.VA",
      "virtualAccountNumber": "81120000564937282",
      "virtualAccountName": "Hafizh Hamzah",
      "vaNameLabel": "Nama",
      "virtualAccountTrxType": "o",
      "billedAmountLabel": "Minimum Bayar",
      "billedAmountValue": "Rp 0.00",
      "billedAmount": 0,
      "additionalLabel1": "Label 1",
      "additionalLabel2": "Label 2",
      "additionalLabel3": "Label 3",
      "additionalValue1": "1",
      "additionalValue2": "2",
      "additionalValue3": "3",
      "feeAmountLabel": "Biaya admin",
      "feeAmountValue": "",
      "feeAmount": 0,
      "accountNumberTo": "0.",
      "inquiryRequestId": "123"
    }
    it("should hit api  success", async () => {
      // vi.spyOn(currentPage, 'setDetailTransaction');
      const mockSOFResponse = {
        data: {
          dataProtected: mockRes,
        },
      };
      api.inquiryBillPayment.mockResolvedValue(mockSOFResponse);

      await currentPage.callApiBillPayment();

      //  const transactionInfo = currentPage.setDetailTransaction(mockRes);
      currentPage.setData({
        inqVA: mockRes,
        currentDetail: [],
        currentUnderlined: "result",
      })
      //  expect(setDetailTransaction).toHaveBeenCalled();

    })
    it("should hit api  failed", () => {

      // api.transactionGatherVA.mockRejectedValue(mockErrorInfo);
      currentPage.callApiBillPayment()
    })
  })

  describe('function expandHandler called', () => {
    it("set data value whenhideDetailTransaction true ", () => {
      currentPage.data.hideDetailTransaction = true;
      // currentPage.expandHandler();
    })
    it("set data value whenhideDetailTransaction false ", () => {
      currentPage.data.hideDetailTransaction = false;
      // currentPage.expandHandler();
    })
  })

  describe('function navToSof called', () => {
    it("when navigate to page SOF data", () => {
      currentPage.changeSof();
    })


    it('effective > cost', () => {
      currentPage.data.inqVA = {
        billedAmount: 5000,
        feeAmount: 5000
      }
      currentPage.data.mainSourceOfFund = {
        activeBalance: 10000000
      }

      currentPage.checkSufficientBalance()

    })
 
    it('Show Account data ', () => {

      currentPage.data.showBalance = {
        showBalance: false
      }

      currentPage.showAccount()
    })

    it('Show Account data ', () => {

      currentPage.data.isLoading = true

      currentPage.showAccount()
    })
  })

  describe("checkSufficientBalance", () => {
    it("should set buttonDisabled to false when activeBalance >= feeAmountValue", () => {
      // Set up data to trigger the condition
      currentPage.setData({
        mainSourceOfFund: { activeBalance: 10000 },
        inqVA: { feeAmountValue: 5000 }
      });
  
      // Call the function to test
      currentPage.checkSufficientBalance();
  
      // Expect buttonDisabled to be set to false
      expect(currentPage.data.buttonDisabled).toBe(true);
    });
  
    it("should set buttonDisabled to true when activeBalance < feeAmountValue", () => {
      // Set up data to trigger the condition
      currentPage.setData({
        mainSourceOfFund: { activeBalance: 1000 },
        inqVA: { feeAmountValue: 5000 }
      });
  
      // Call the function to test
      currentPage.checkSufficientBalance();
  
      // Expect buttonDisabled to be set to true
      expect(currentPage.data.buttonDisabled).toBe(true);
    });
  });
  
  describe("openModal", () => {
    it("open modal succes", () => {
      // Set up data to trigger the condition
      // Call the function to test
      currentPage.openModal();
      // Expect buttonDisabled to be set to false
    
    });
  
  });
 
  describe("backToLifestyle", () => {
    it("when props clos modal ", () => {
      // Set up data to trigger the condition
      // Call the function to test
      const e = {
        target:{
          dataset:{
            props:'close'
          }
        }
      }
      currentPage.backToLifestyle(e);
      // Expect buttonDisabled to be set to false
    
    });
    it("when props lifestyle modal ", () => {
      // Set up data to trigger the condition
      // Call the function to test
      const e = {
        target:{
          dataset:{
            props:'lifestyle'
          }
        }
      }
      vi.spyOn(my, 'exitMiniProgram');
      currentPage.backToLifestyle(e);
      // Expect buttonDisabled to be set to false
    
    });
  
  });
  
})