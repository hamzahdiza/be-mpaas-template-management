import {
  currencyFormat
} from "../../../../utils/currency-util"

import {
  accountListPost
} from '../../../../public/api'
import generalError from '../../../../utils/generalError';
import getNetWork from '../../../../utils/getNetWork';

/* JShield-obfus:enable */
Page({
  data: {
    featureType: String(''),
    isLoading: Boolean(true), 
    statusBarHeight: Number(0),
    isExpand: Boolean(true),
    currency: String(),
    currencyType: String(),
    options: Array(),
  },
  selectOption(e) {
    const checkIndex = e.currentTarget.dataset.index
    const list = this.data.options.map((item, i) => {
      return {
        ...item,
        checked: i === checkIndex
      }
    })
    this.setData({
      options: list
    })
    getApp().globalData.purchase.selectedAccount = this.data.options.find(item => item.checked)
    my.navigateBack()
  },
  expandOption() {
    if (!this.data.isLoading) {
      this.setData({
        isExpand: !this.data.isExpand
      })
    }
  },
  onLoad(query) {
    this.setData({
      statusBarHeight: getApp().globalData.statusBarHeight,
      lang: getApp().globalData.languagePack
    })
    const queryData = my.customUrlQueryData[query.customUrlQueryData];

    this.getBondsSof(queryData)
  },

  getBondsSof(queryData) {
    accountListPost({
      data:{
        "isSOF": true,
        "currency": ['IDR']
      }
      }, {
        "Screen-Id": 'lifestyleSofListScreen'
      })
      .then((response) => {
        let res = response.data.dataProtected
        const sofList = res.sofList.sort((a, b) => {
          return a.accountNumber - b.accountNumber;
        });
        const accounts = sofList.map(item => {
          item.isNegative = item.activeBalance < 0 ? true : false
          item.effectiveBalanceString = currencyFormat({
            value: item.activeBalance,
            currency: item.currency,
            isPrefix: false
          })
          return {
            ...item,
            disabled: item.activeBalance < queryData.amount,
            checked: item.accountNumber === queryData.selectedAccount.accountNumber
          }
        })
        this.setData({
          options: accounts,
          isLoading: false,
        })
      }).catch(err => {
        generalError({
          err,
          isSwipe: true,
        })
      })
  },

  onShow() {
    getNetWork()
  }
});
/* JShield-obfus:disable */