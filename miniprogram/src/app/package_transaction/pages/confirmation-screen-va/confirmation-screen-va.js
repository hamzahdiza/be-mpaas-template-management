import {
  getBillPayment,
  transactionLimit,
} from "/src/public/api";
import {
  currencyFormat
} from "/src/utils/currency-util";
import generalError from "/src/utils/generalError"
import {
  customNavigateTo
} from "/src/utils/route-util"
import {
  firebaseEvent,
  firebaseScreenView
} from "/src/utils/firebaseTracker";

const app = getApp()

/* JShield-obfus:enable */
Page({
  data: {
    currentDetail: Array(),
    isLoading: Boolean(true),
    isExpand: Boolean(false),
    isError: Boolean(false),
    isOpen: Boolean(false),
    currentExpandMode: String(),
    dataLimit: Object(),
    partnerMenu: Object(),
    personalData: Object(),
    sourceOfFund: Object(),
    billerDetail: Object(),
    selectedTicket: Array(),
    priceCount: String(),
    adminFee: Number(0),
    ticketCount: String(),
    lang: Object({})
  },

  onLoad(query) {
    firebaseScreenView("javaJazzFestivalConfirmationScreen", "javaJazzFestivalConfirmationScreen")
    let lang = getApp().globalData.languagePack;
    const {
      partnerMenu,
      personalData,
      sourceOfFund,
      billerDetail,
      selectedTicket,
      priceCount,
      ticketCount,
      adminFee,
      billerAmount,
      billerTotal
    } = my.customUrlQueryData[query.customUrlQueryData];

    const foramtSelectedTicket = selectedTicket.map(ticket => {
      ticket.formatTotalPrice = currencyFormat({
        value: parseInt(ticket.amount)
      })
      return {
        ...ticket
      }
    })

    const formatAdminfee = currencyFormat({
      value: adminFee,
      isPrefix: false

    })

    const detailTransaksi = [{
      title: lang.javaJazzFestivalConfirmationScreenNominalLabel,
      value: currencyFormat({
        value: priceCount
      }),
      id: "lifestyle-java-jazz-festival-confirmation-screen-detail-nominal"
    }, {
      title: lang.javaJazzFestivalConfirmationScreenFeeAmountLabel,
      value: `Rp${formatAdminfee}`,
      id: "lifestyle-java-jazz-festival-confirmation-screen-detail-admin-fee"
    }, ]
    const detailTransaksiLain = [{
      title: lang.javaJazzFestivalConfirmationScreenBuyerNameLabel,
      value: personalData.fullName,
      id: "lifestyle-java-jazz-festival-confirmation-screen-button-show-close-detail"
    }, {
      title: lang.javaJazzFestivalConfirmationScreenBuyerEmailLabel,
      value: personalData.email,
      id: "lifestyle-virtual-account-confirmation-detail-payment-fee-amount"
    }, ]

    const totalAmount = parseInt(priceCount) + parseInt(adminFee)

    const formatedTotalAmount = currencyFormat({
      value: totalAmount
    })

    this.setData({
      eventTitle: app.globalData.eventTitle,
      ticketCount,
      partnerMenu,
      personalData,
      sourceOfFund,
      lang,
      billerDetail,
      ticketList: foramtSelectedTicket,
      detailTransaksi,
      detailTransaksiLain,
      priceCount,
      adminFee,
      billerAmount,
      billerTotal,
      totalAmount,
      formatedTotalAmount,
    })
    this.transactionLimit()
  },

  async transactionLimit() {
    try {
      const data = "bill-payment"
      const headers = {
        "Screen-Id": "javaJazzFestivalConfirmationScreen",
      }
      const res = await transactionLimit(data, headers)
      this.setData({
        dataLimit: res.data.data,
        isLoading: false
      })
    } catch (err) {
      generalError({
        err,
        isSwipe: true,
        event: ''
      })
      this.setData({
        isLoading: false
      })
    }
  },

  navBack() {
    firebaseEvent('javaJazzFestivalConfirmationScreen', 'AppClick', 'click_back_bill_payment_java_jazz_confirmation')
    my.navigateBack()
  },
  async callDataConfirmation() {
    try {
      this.setData({
        isLoading: true
      })
      const {
        billerTotal,
        dataLimit,
        billerDetail,
        sourceOfFund,
        totalAmount,
        partnerMenu
      } = this.data

      let authType = ''
      if (totalAmount <= dataLimit.dailyPostloginLimit && totalAmount <= dataLimit.transactionPostloginNoPinLimit) {
        authType = 'POSTLOGIN_NO_PIN'
      } else {
        authType = 'POSTLOGIN'
      }

      let dataRequest = {
        dataProtected: {
          accountNumber: sourceOfFund.accountNumber,
          billKey1: billerDetail.billKey1,
          billKey2: billerTotal
        },
        data: {
          billerCode: billerDetail.billItemList[0].billCode,
          ubpCompanyCode: billerDetail.companyCode,
          authType,
          denomDetail: {
            denomAmount: billerTotal,
          }
        }
      };
      
      let request = dataRequest.dataProtected
      let signature = request
      const payload = {
        "dataProtected": request,
        "data": dataRequest.data
      }
      const headers = {
        "Screen-id": "javaJazzFestivalConfirmationScreen",
        signature
      }

      const response = await getBillPayment(payload, headers)
      let res =  response.data.dataProtected

      const dataCombined = {
        "data": response.data.data,
        "dataProtected": res
      }
      this.setData({
        isLoading: false
      })

      customNavigateTo({
        url: '/src/app/package_transaction/pages/input-pin/input-pin',
        data: {
          transactionId: dataCombined.dataProtected.transactionId,
          scenario: "bill-payment-lifestyle-javaJazzFestival",
          transactionData: dataCombined,
          authType,
          partnerMenu,
          transactionTypePartner: partnerMenu.transactionType
        }
      })
    } catch (err) {
      this.setData({
        isLoading: false
      })

      generalError({
        err,
        isSwipe: true,
        event: ''
      })

    }

  },

  setExpandStatus() {
    if (!this.data.isExpand) {
      firebaseEvent('javaJazzFestivalConfirmationScreen', 'AppClick', 'click_detail_bill_payment_java_jazz_confirmation')
    } else {
      firebaseEvent('javaJazzFestivalConfirmationScreen', 'AppClick', 'click_close_detail_bill_payment_java_jazz_confirmation')
    }
    this.setData({
      isExpand: !this.data.isExpand
    })
  },

  async navNext() {
    firebaseEvent('javaJazzFestivalConfirmationScreen', 'AppClick', 'click_konfirmasi_java_jazz_festival')
    await this.callDataConfirmation()
  },
});
/* JShield-obfus:disable */