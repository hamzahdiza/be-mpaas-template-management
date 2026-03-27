import "./change-sof-va"
import {
  describe,
  it,
  expect
} from 'vitest';
import * as api from "../../../../public/api";
import generalError from '../../../../utils/generalError'
const instance = global.pageInstance
my.call = vi.fn((param1,param2,callback)=>{
  callback({})
})

await beforeAll(async () => {
  instance.data.isLoading = false
  instance.data.options = [
    {
      accountNumber: '456',
      currency: "IDR",
      productName: 'Tabungan Taplus Muda', 
      accountName: 'Hartanto Adhitya',
      balance: 6400006.123456, 
      activeBalance: '1358161613',
      effectiveBalanceString: "1.358.161.613",
      investmentAccountNumber: "5720823804",
      checked: false
    },
    {
      accountNumber: '798',
      currency: "IDR",
      productName: 'Tabungan Taplus Muda',
      accountName: 'HartantoAdhitya',
      balance: 6400000, 
      activeBalance: '4161616489331',
      effectiveBalanceString: "4.161.616.489.331",
      investmentAccountNumber: "7462300195",
      checked: true
    }
  ]
  vi.spyOn(api, 'accountListPost');
 
})

describe("purchase select sof", () => {
  describe('expandOption', () => {
    it('execute expandOption when isLoading = false', () => {
      instance.expandOption()
      expect(instance.data.isExpand).toBe(false)
    })
    it('execute expandOption when isLoading = true', () => {
      instance.data.isLoading = true
      instance.expandOption()
      expect(instance.data.isExpand).toBe(false)
      instance.data.isLoading = false
    })
  })
  describe('onLoad', () => {
    it('request USD selectSOF successful and featureType equal bonds', async() => {
      my.customUrlQueryData["purchaseSelectSOF"] = {
        amount: 0,
        productCode: "BZ002EQCDANSHM00",
        featureType:'bonds'
      }
      const mockResponse = {
        data: {
          dataProtected: {
            sofList: [
              {
                accountNumber: '456',
                currency: "USD",
                productName: 'Tabungan Taplus Muda', 
                accountName: 'Hartanto Adhitya',
                balance: 6400006.123456, 
                activeBalance: '1358161613',
                effectiveBalanceString: "1.358.161.613",
                investmentAccountNumber: "5720823804"
              },
              {
                accountNumber: '798',
                currency: "USD",
                productName: 'Tabungan Taplus Muda',
                accountName: 'HartantoAdhitya',
                balance: 6400000, 
                activeBalance: '4161616489331',
                effectiveBalanceString: "4.161.616.489.331",
                investmentAccountNumber: "7462300195"
              }
            ]
          },
        },
      };  
      api.accountListPost.mockResolvedValue(mockResponse);
   
      
      await instance.onLoad({
        'customUrlQueryData': "purchaseSelectSOF",
      });
      await delay(1000);
      expect(api.accountListPost).toHaveBeenCalled();
      expect(instance.data.isLoading).toBe(false)
    })
 
    it('request IDR selectSOF successful and featureType equal bonds', async() => {
      my.customUrlQueryData["purchaseSelectSOF"] = {
        amount: 0,
        productCode: "BZ002EQCDANSHM00",
        featureType:'bonds'
      }
      const mockResponse = {
        data: {
          dataProtected: {
            sofList: [
              {
                accountNumber: '456',
                currency: "IDR",
                productName: 'Tabungan Taplus Muda', 
                accountName: 'Hartanto Adhitya',
                balance: 6400006.123456, 
                activeBalance: '1358161613',
                effectiveBalanceString: "1.358.161.613",
                investmentAccountNumber: "5720823804"
              },
              {
                accountNumber: '798',
                currency: "IDR",
                productName: 'Tabungan Taplus Muda',
                accountName: 'HartantoAdhitya',
                balance: 6400000, 
                activeBalance: '4161616489331',
                effectiveBalanceString: "4.161.616.489.331",
                investmentAccountNumber: "7462300195"
              }
            ]
          },
        },
      };  
      api.accountListPost.mockResolvedValue(mockResponse);
    
      
      await instance.onLoad({
        'customUrlQueryData': "purchaseSelectSOF",
      });
      await delay(1000);
      expect(api.accountListPost).toHaveBeenCalled();
      expect(instance.data.isLoading).toBe(false)
    })
 
    it('fail request select bonds sof',async()=>{
      const mockErrorInfo = {
        statusCode: 500,
        data: {
          errCode: ''
        }
      }
      api.accountListPost.mockRejectedValue(mockErrorInfo);
      
      await instance.onLoad({
        'customUrlQueryData': "purchaseSelectSOF"
      });
      await delay(1000);
      expect(generalError).toHaveBeenCalledWith({
        err: mockErrorInfo,
        isSwipe: true
      });
    })
  })
  describe('selectOption', () => {
    it('', () => {
      const e = {
        currentTarget: {
          dataset: {
            index: 0
          }
        }
      }
      instance.selectOption(e)

    })
  })
  describe('onShow', () => {
    it("should disable swipe,", () => {
      instance.onShow();
    })
  })

  describe('getBondsSof', () => {
    it('should call setData with accounts and isLoading false', async () => {
      const queryData = {
        amount: 1000,
        selectedAccount: {
          accountNumber: '456'
        }
      }
  
      const mockResponse = {
        data: {
          dataProtected: {
            sofList: [
              {
                accountNumber: '456',
                currency: "IDR",
                productName: 'Tabungan Taplus Muda', 
                accountName: 'Hartanto Adhitya',
                balance: 6400006.123456, 
                activeBalance: 5000,
                investmentAccountNumber: "5720823804"
              },
              {
                accountNumber: '798',
                currency: "IDR",
                productName: 'Tabungan Taplus Muda',
                accountName: 'HartantoAdhitya',
                balance: 6400000, 
                activeBalance: 200,
                investmentAccountNumber: "7462300195"
              }
            ]
          }
        }
      }
  
      const spy = vi.spyOn(instance, 'setData')
      api.accountListPost.mockResolvedValue(mockResponse)
  
      await instance.getBondsSof(queryData)
      expect(api.accountListPost).toHaveBeenCalled()
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        options: expect.any(Array),
        isLoading: false
      }))
    })

    it('should set isNegative to true when activeBalance < 0', async () => {
      const queryData = {
        amount: 1000,
        selectedAccount: {
          accountNumber: '999'
        }
      }
    
      const mockResponse = {
        data: {
          dataProtected: {
            sofList: [
              {
                accountNumber: '999',
                currency: "IDR",
                productName: 'Tabungan Taplus Muda',
                accountName: 'Negatif Balance',
                balance: 6400000,
                activeBalance: -100, // 👈 NEGATIVE VALUE di sini
                investmentAccountNumber: "1111111111"
              }
            ]
          }
        }
      }
    
      api.accountListPost.mockResolvedValue(mockResponse)
    
      const setDataSpy = vi.spyOn(instance, 'setData')
    
      await instance.getBondsSof(queryData)
    
      expect(setDataSpy).toHaveBeenCalledWith(expect.objectContaining({
        options: expect.arrayContaining([
          expect.objectContaining({
            isNegative: true 
          })
        ]),
        isLoading: false
      }))
    })
  })

})

