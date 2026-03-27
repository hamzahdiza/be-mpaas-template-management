import {
  getTncDetail
} from "/src/public/api";
import generalError from "/src/utils/generalError";
import getNetWork from "/src/utils/getNetWork";

/* JShield-obfus:enable */
Page({
  data: {
    submitting: false,
    html: "",
    scroolVisiable: true,
    type: "",
    transactionId: "",
    flag: true,
    isErrorApi: false,
  },
  onShow() {
    my.call("enableSwipe", {
      isSwipe: true
    }, () => {})
    getNetWork()
  },
  onReachBottom() {
    this.setData({
      scroolVisiable: false
    })
  },
  onLoad(query) {
    let lang = getApp().globalData.languagePack;
    const queryData = my.customUrlQueryData[query.customUrlQueryData];
    this.setData({
      lang,
      subType: queryData.transactionType,
    });
    this.loadTncDetail();
  },
  backtToLanding() {
    my.navigateBack()
  },

  scrollToButtom() {
    my.createSelectorQuery()
      .selectViewport().scrollOffset().exec((ret) => {
        my.pageScrollTo({
          scrollTop: ret[0].scrollHeight,
          duration: 300,
        });
      })
  },
  loadTncDetail() {
    this.setData({
      submitting: true,
    });
    const subType = this.data.subType

    getTncDetail(subType, {
        'Accepted-Language': getApp().globalData.dayjsLocale.toUpperCase() 
      })
      .then((res) => {
        this.setData({
          html: res.data.data.tncContent,
          submitting: false,
        });
      })
      .catch((err) => {
        if (err.statusCode === 404) {
          this.setData({
            submitting: false,
            isErrorApi: true
          })
        } else {
          this.setData({
            submitting: false,
            isErrorApi: true
          });
          generalError({
            err,
            isSwipe: true,
          })
        }

      });
  },


});
/* JShield-obfus:disable */