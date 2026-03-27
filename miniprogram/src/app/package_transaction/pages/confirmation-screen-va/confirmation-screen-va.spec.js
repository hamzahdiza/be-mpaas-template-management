import {
  beforeAll,
  expect,
  vi
} from 'vitest';
import "./confirmation-screen-va"
import * as api from "/src/public/api"


const my = global.my
const page = global.pageInstance
my.exitMiniProgram = vi.fn(() => {});
my.call = vi.fn((param1, param2, callback) => {
  callback({});
});

await beforeAll(async () => {
  vi.spyOn(api, 'getBillPayment');
  vi.spyOn(api, 'transactionLimit');
})

describe("Page", () => {
  it("set initial data onLoad", () => {
    my.customUrlQueryData["confirmation-screen-va"] = {
      inqVA: {
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
        "inquiryRequestId": "123",
        "phoneNumber": "628123456789"
      },
      sourceOfFund: {
        "accountNumber": "51239028372",
        "accountName": "Rina",
        "accountStatus": "BUKA",
        "accountTypeCode": "123",
        "productName": "Tabungan Plus (Taplus) RC",
        "currency": "IDR",
        "ownership": "Rina",
        "balance": 1000000,
        "effectiveBalance": 9000000,
        "limit": 100000,
        "disburseAmount": 100000,
        "accountType": "2000",
        "accountProductType": "TABUNGAN",
        "subCat": "123",
        "branchCode": "009",
        "flagBank": "123123123",
        "cif": "123123123",
        "isMainAccount": true
      },
      partnerMenu: {
        categoryDisplay: 'Event',
        transactionTypeDisplay: 'Java Jezz',
      },
      personalData: {
        fullName: 'Putri Negara',
        email: "putri.negara@gmail.com"
      },
  
      billerDetail:{
        billKey1 :'123241'
      },
  
      selectedTicket : [
        {
          "title": "Daily Pass Friday",
          "price": 1162500,
          "total": 2,
          "ticketId": 841,
          "ticketName": "Daily Pass Friday",
          "ticketDate": "Jumat, 30 Mei 2025",
          "description": [
              "Price excludes tax & admin fees",
              "Price excludes tax & admin fees"
          ],
          "oldPrice": 850000,
          "priceTaxService": 637500,
          "category": "daily_pass",
          "isAvailable": 10,
          "type": "disc25",
          "countAdd": 1,
          "amount": "637.500",
          "count": 0,
          "discount": "850.000",
          "maxOrder": 11,
          "formatPrice": "1.162.500"
        },
        {
            "title": "Daily Pass Saturday",
            "price": 525000,
            "total": 1,
            "ticketId": 843,
            "ticketName": "Daily Pass Saturday",
            "ticketDate": "Sabtu, 31 Mei 2025",
            "description": [
                "Price excludes tax & admin fees",
                "Price excludes tax & admin fees"
            ],
            "oldPrice": 850000,
            "priceTaxService": 637500,
            "category": "daily_pass",
            "isAvailable": 10,
            "type": "b1g2",
            "countAdd": 1,
            "amount": "637.500",
            "count": 0,
            "discount": "850.000",
            "maxOrder": 7,
            "formatPrice": "525.000"
        },
       
      ],
  
      priceCount : 1912500,
      ticketCount :3
    };

    page.onLoad({
      customUrlQueryData: "confirmation-screen-va"
    });

    expect(page.data.isExpand).toBe(false);
    expect(page.data.isError).toBe(false);

    page.setData({
      dataRequest: {
        "dataProtected": {
          "virtualAccountNumber": "6049287839297172",
          "accountNumber": "339281928382",
          "amount": 100000,
          "authType": "POSTLOGIN"
        }
      }
    })
  })

  it('call data confirmation and handle success', async () => {
    page.setData({
      dataRequest: {
        "dataProtected": {
          "virtualAccountNumber": "6049287839297172",
          "accountNumber": "339281928382",
          "amount": 100000,
          "authType": "POSTLOGIN"
        }
      },
      billerDetail: {
        billItemList: [],
        companyCode: '',
        billkey1: '',
        billKey2: '123241'
      },
      priceCount: 1000,
      adminFee: 25000,
      dataLimit: {
        dailyPostloginLimit: 10000000,
        transactionPostloginNoPinLimit: 10000000
      },
      totalAmount: 10000

    })
    getApp().globalData.nativeData = {
      sessionKey: 'db39fc728d9f6c3da4420e901c2a1fec',
      signingPrivateKey: 'LSAg6l2bKsDr4SCX0dqbHBrPwSrXnyYX6xwbVs3kPAA=',
      signingPublicKey: 'YjdmOg9PCcODLfux74ecc8cVfj6gCMSc+XKyMigggHY='
    };

    const mockResponse = {
      data: {
        dataProtected: {
          "dailyChannelLimit":100000000,
            "dailySegmentLimit":100000000,
            "dailyPreloginLimit":100000000,
            "dailyPostloginLimit":100000000,
            "dailyFeatureLimit":100000000,
            "subfeatureLimit":{
                "monthlyLimit":21341412,
                "weeklyLimit":412123123,
                "dailyLimit":113212312,
                "transactionLimit":11341412
            }
          },
        data: 'mockData'
      }
    };

    api.transactionLimit.mockResolvedValue(mockResponse);

    await page.transactionLimit();
  });


  it('call data confirmation and handle success', async () => {
    page.setData({
      dataRequest: {
        "dataProtected": {
          "virtualAccountNumber": "6049287839297172",
          "accountNumber": "339281928382",
          "amount": 100000,
          "authType": "POSTLOGIN"
        }
      },
      // billerDetail.billKey2 !== "" && billerDetail.billKey2 !== null && billerDetail.billKey2 !== undefined
      billerDetail: {
        billItemList: [],
        companyCode: '',
        billkey1: '',
        billKey2: "13123",
        billKey3: "13123"
      },
      
      priceCount:1000,
       adminFee:0,
       dataLimit:{
        dailyPostloginLimit:10000000,
        transactionPostloginNoPinLimit:10000000
      }
    })
    getApp().globalData.nativeData = {
      sessionKey: 'db39fc728d9f6c3da4420e901c2a1fec',
      signingPrivateKey: 'LSAg6l2bKsDr4SCX0dqbHBrPwSrXnyYX6xwbVs3kPAA=',
      signingPublicKey: 'YjdmOg9PCcODLfux74ecc8cVfj6gCMSc+XKyMigggHY='
    };

    const mockResponse = {
      data: {
        dataProtected: 'mockEncryptedData',
        data: 'mockData'
      }
    };

    api.getBillPayment.mockResolvedValue(mockResponse);
    await page.callDataConfirmation();
  });


  it('call data confirmation and handle success', async () => {
    page.setData({
      dataRequest: {
        "dataProtected": {
          "virtualAccountNumber": "6049287839297172",
          "accountNumber": "339281928382",
          "amount": 100000,
          "authType": "POSTLOGIN"
        }
      },
      billerDetail: {
        billItemList: [],
        companyCode: '',
        billkey1: '',
        billKey2: "13123",
        billKey3: "13123"
      },
      
      priceCount:1000,
       adminFee:0,
       dataLimit:{
        dailyPostloginLimit:10000000,
        transactionPostloginNoPinLimit:10000000
      }
    })
    getApp().globalData.nativeData = {
      sessionKey: 'db39fc728d9f6c3da4420e901c2a1fec',
      signingPrivateKey: 'LSAg6l2bKsDr4SCX0dqbHBrPwSrXnyYX6xwbVs3kPAA=',
      signingPublicKey: 'YjdmOg9PCcODLfux74ecc8cVfj6gCMSc+XKyMigggHY='
    };

    const mockResponse = {
      data: {
        dataProtected:{
          "transactionId": "97c0575f-735e-4b1e-8d91-59a59defa9f0",
          "refNumber": "123123123",
          "virtualAccountNumber": "12312312321",
          "virtualAccountName": "TOKPED",
          "virtualAccountTransactionType": "openMaximum",
          "accountNumber": "123123123123",
          "accountName": "SAFIDRA",
          "productName": "BNI TAPLUS",
          "cif": "123123123"
        },
        data: 'mockData'
      }
    };

    api.getBillPayment.mockResolvedValue(mockResponse);

    await page.callDataConfirmation();
  });
  it('call data confirmation and handle success', async () => {
    page.setData({
      dataRequest: {
        "dataProtected": {
          "virtualAccountNumber": "6049287839297172",
          "accountNumber": "339281928382",
          "amount": 100000,
          "authType": "POSTLOGIN",
        }
      },
      billerDetail: {
        billItemList: [{
          billCode: 11
        }],
        companyCode: '',
        billkey1: '',
        billKey2: "13123",
        billKey3: "13123"
      },
      priceCount: 1000,
      adminFee: 0,
      dataLimit: {
        dailyPostloginLimit: 0,
        transactionPostloginNoPinLimit: 0
      }
    })
    getApp().globalData.nativeData = {
      sessionKey: 'db39fc728d9f6c3da4420e901c2a1fec',
      signingPrivateKey: 'LSAg6l2bKsDr4SCX0dqbHBrPwSrXnyYX6xwbVs3kPAA=',
      signingPublicKey: 'YjdmOg9PCcODLfux74ecc8cVfj6gCMSc+XKyMigggHY='
    };

    const mockResponse = {
      data: {
        dataProtected: {
          "transactionId": "97c0575f-735e-4b1e-8d91-59a59defa9f0",
          "refNumber": "123123123",
          "virtualAccountNumber": "12312312321",
          "virtualAccountName": "TOKPED",
          "virtualAccountTransactionType": "openMaximum",
          "accountNumber": "123123123123",
          "accountName": "SAFIDRA",
          "productName": "BNI TAPLUS",
          "cif": "123123123"
        },
        data: 'mockData'
      }
    };

    api.getBillPayment.mockResolvedValue(mockResponse);

    await page.callDataConfirmation();
  });

  it('handle other error codes', async () => {
    page.setData({
      dataRequest: {
        "dataProtected": {
          "virtualAccountNumber": "6049287839297172",
          "accountNumber": "339281928382",
          "amount": 100000,
          "authType": "POSTLOGIN"
        }
      }
    })

    getApp().globalData.nativeData = {
      sessionKey: 'db39fc728d9f6c3da4420e901c2a1fec',
      signingPrivateKey: 'LSAg6l2bKsDr4SCX0dqbHBrPwSrXnyYX6xwbVs3kPAA=',
      signingPublicKey: 'YjdmOg9PCcODLfux74ecc8cVfj6gCMSc+XKyMigggHY='
    };

    const mockError = {
      data: {
        errorCode: 'OTHER_ERROR'
      }
    };

    api.getBillPayment.mockRejectedValue(mockError);
    await page.callDataConfirmation();

    expect(page.data.isLoading).toBe(false);
    
  });

  it('expand status', () => {
    expect(page.data.isExpand).toBe(false);
    // const currentDetailSpy = vi.spyOn(page, 'currentDetail');
    page.setExpandStatus();
    expect(page.data.isExpand).toBe(true);
  })

  
  it('expand status', () => {
    page.data.isExpand = true
    page.setExpandStatus();
  })

  it('navNext', () => {
    vi.spyOn(page, "navNext")
    page.navNext();
    expect(page.navNext).toHaveBeenCalled();
  });

  it('navNext', () => {
    vi.spyOn(page, "navBack")
    page.navBack();
  });

})