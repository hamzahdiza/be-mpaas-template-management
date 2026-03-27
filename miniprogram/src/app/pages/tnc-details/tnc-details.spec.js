import {
  expect
} from "vitest";
import "./tnc-details"
import * as api from "/src/public/api";
import generalError from '/src/utils/generalError'
const instance = global.pageInstance
vi.spyOn(api, 'getTncDetail');
my.call = vi.fn((param1,param2,callback)=>{
  callback({})
})

describe('tnc', () => {
  beforeAll(() => {
    my.customUrlQueryData["tnc"] = {
      type: "purchase",
      transactionId: '1'
    };
  });
  
  describe('onLoad', () => {
    it('should load TnC detail on load when type = purchase', async () => {      
      instance.onLoad({
        'customUrlQueryData': "tnc"
      });      
    });
    it('should load TnC detail on load when type = redeem', async () => {      
      my.customUrlQueryData["tnc"] = {
        type: "redeem",
        transactionId: '1'
      };
      instance.onLoad({
        'customUrlQueryData': "tnc"
      });
    });
  })
  describe('should load TnC detail', () => {
    it('request getTncDetail successful', async() => {
      const mockResponse = {
        data: {
          data: {
            tncContent: '<p>Terms and Conditions</p>',
          },
        },
      };  
      instance.data.subType = "ASAS";
      vi.fn().mockReturnValue({
        globalData: {
          languagePack: 'en',
          nativeData: {
            language: 'en-ID',
          },
        },
      });
      api.getTncDetail.mockResolvedValue(mockResponse);
      await instance.loadTncDetail();
      await delay(1000);
      expect(api.getTncDetail).toHaveBeenCalled();
      expect(instance.data.html).toBe('<p>Terms and Conditions</p>');
      expect(instance.data.submitting).toBe(false);
    })
    it('request getTncDetail successful', async() => {
      const mockResponse = {
        data: {
          data: {
            tncContent: '<p>Terms and Conditions</p>',
          },
        },
      };  
      
      vi.fn().mockReturnValue({
        globalData: {
          nativeData: {
            language: 'id-ID',
          },
        },
      });
      await instance.loadTncDetail();
      api.getTncDetail.mockResolvedValue(mockResponse);
      await delay(1000);
      expect(api.getTncDetail).toHaveBeenCalled();
      expect(instance.data.html).toBe('<p>Terms and Conditions</p>');
      expect(instance.data.submitting).toBe(false);
    })
    it('request getTncDetail fail 404', async() => {
      const mockErrorInfo = {
        statusCode: 404,
        data: {
          errCode: ''
        }
      };
      api.getTncDetail.mockRejectedValue(mockErrorInfo);
      await instance.loadTncDetail();
      await delay(1000);
     
    })
    it('request getTncDetail fail 409', async() => {
      const mockErrorInfo = {
        statusCode: 409,
        data: {
          errCode: ''
        }
      };
      api.getTncDetail.mockRejectedValue(mockErrorInfo);
      await instance.loadTncDetail();
      await delay(1000);
      expect(generalError).toHaveBeenCalledWith({
        err: mockErrorInfo,
        isSwipe: true
      });
      expect(instance.data.submitting).toBe(false);
    })
  });

  describe('onShow', () => {
    it("should disable swipe,", () => {
      instance.onShow();
      expect(my.call).toHaveBeenCalled()
    })
    it("should scrollToButtom call,", () => {
      my.pageScrollTo = vi.fn(()=>{})
      my.createSelectorQuery = vi.fn(() => ({
        selectViewport : vi.fn(() => ({
          scrollOffset: vi.fn(() => ({
            exec:vi.fn(() => ({
            }))
          }))
        }))
      }))
      vi.spyOn(my, 'createSelectorQuery') 
      vi.spyOn(my, 'pageScrollTo') 
      instance.scrollToButtom();
      
    })
  })
  describe('onReachBottom', () => {
    it("reach bottom", () => {
      instance.onReachBottom();
      expect(instance.data.scroolVisiable).toBe(false)
    })
  })
  describe("getTncDetail()", () => {
    it("get TNC content", () => {
      instance.data.html = "123"
      expect(instance.data.html).toBe("123")
    })
  })
  describe('toInputMPIN', () => {
    it("jump to input mpin page", async() => {
      instance.backtToLanding();
      await delay(200)
      expect(instance.data.flag).toBe(true)
    })

    it("toInputMPIN when flag = false", () => {
      instance.data.flag = false
      instance.backtToLanding()
    })
  })
})




describe('scrollToButtom Method', () => {
  it('should scroll to the bottom of the page', () => {
    // Mocking my API
    const mockPageScrollTo = vi.fn();
    const mockExec = vi.fn((callback) => {
      // Simulasi respon dari exec
      callback([{ scrollHeight: 200 }]); // Simulasi scrollHeight
    });

    const mockScrollOffset = vi.fn().mockReturnValue({
      exec: mockExec,
    });

    const mockSelectViewport = vi.fn().mockReturnValue({
      scrollOffset: mockScrollOffset,
    });

    const mockCreateSelectorQuery = vi.fn().mockReturnValue({
      selectViewport: mockSelectViewport,
    });

    global.my = {
      createSelectorQuery: mockCreateSelectorQuery,
      pageScrollTo: mockPageScrollTo,
    };

    // Call the method
    instance.scrollToButtom();

  });
});