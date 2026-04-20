import {
  accountListPost,
  inquiryBillPayment
} from "/src/public/api";
import {
  capitalizeTxt
} from "/src/utils/capitalize";
import {
  currencyFormat
} from "/src/utils/currency-util";
import generalError from "/src/utils/generalError";
import {
  customNavigateTo
} from "/src/utils/route-util";

const app = getApp()

/* JShield-obfus:enable */
Page({
  data: {
    isLoading: Boolean(true),
    showBalance: Boolean(true),
    phoneNumber: String(''),
    buttonDisabled: Boolean(true),
    mainAccountBalance: String(''),
    mainSourceOfFund: Object({}),
    lang: Object({}),
    showDetail: Boolean(false),
    basicVisible: Boolean(),
  },
  onShow() {
    const globalDataAccount = getApp().globalData.purchase.selectedAccount

    if (globalDataAccount !== null) {
      const balanceAccount = currencyFormat({
        value: globalDataAccount.activeBalance,
        isPrefix: false
      })
      this.setData({
        isNegative: globalDataAccount.activeBalance < 0 ? true : false,
        mainSourceOfFund: globalDataAccount,
        mainAccountBalance: balanceAccount

      })
      this.checkSufficientBalance()
    }

    my.call("enableSwipe", {
      isSwipe: false
    }, () => {});
  },
  async onLoad(query) {
    const lang = getApp().globalData.languagePack;
    const partnerMenu = getApp().globalData.partnerMenu

    const queryData = my.customUrlQueryData[query.customUrlQueryData] || {};
    
    const {
      priceCount = {},
      personalData = {},
      ticketList = [],
      ticketCount = 0,
      selectedTicket = null,
      orderData = {},
      posContext = null
    } = queryData;
    
    const formatPriceCount = currencyFormat({
      value: getApp().globalData.totalPriceGlobal || (priceCount.value || 0),
      currency: "IDR",
      isPrefix: false
    })

    const ticketsToFormat = (ticketList && ticketList.length > 0) ? ticketList : ((selectedTicket && (selectedTicket.ticketList || selectedTicket.tickets)) || []);
    
    const formatTicket = (ticketsToFormat || []).map(ticket => {
      const amount = ticket.amount || ticket.price || 0;
      ticket.formatTotalPrice = currencyFormat({
          value: parseInt(amount)
        }),
        ticket.ticketName = ticket.title || ticket.name || "Service",
        ticket.total = ticket.totalDetailTicket || ticket.ticketQty || 1,
        ticket.amount = amount
      return {
        ...ticket,
      }
    })
    const truncateString = (str, num) => {
      if (!str) return "";
      if (str.length <= num) {
        return str;
      }
      return str.slice(0, num) + '...';
    };

    let valPriceCount = 0;
    if (priceCount && typeof priceCount.value === 'number') {
      valPriceCount = priceCount.value;
    } else if (typeof priceCount === 'number') {
      valPriceCount = priceCount;
    } else if (typeof priceCount === 'string') {
      valPriceCount = parseInt(priceCount) || 0;
    }

    this.setData({
      eventTitle:truncateString(app.globalData.eventTitle || (orderData && orderData.serviceName) || "Payment", 21), 
      lang,
      partnerMenu,
      isLoading: false,
      formatPriceCount,
      ticketList: formatTicket,
      personalData: {
        ...personalData,
        fullName: capitalizeTxt(personalData.fullName || "User")
      },
      priceCount: valPriceCount,
      orderData,
      ticketCount,
      selectedTicket: formatTicket,
      posContext
    })
    await this.callApiBillPayment()
  },
  checkSufficientBalance() {
    const {
      priceCount,
      mainSourceOfFund,
      adminFee
    } = this.data
    const total = parseInt(adminFee) + parseInt(priceCount)
    if (mainSourceOfFund.activeBalance >= total) {
      this.setData({
        buttonDisabled: false
      });
    } else {
      this.setData({
        buttonDisabled: true
      });
    }

  },

  async callApiListAccount() {
    this.setData({
      isLoading: true
    })
    const headers = {
      "Screen-Id": "javajazzFestivalGatherScreen"
    }
    const data = {
      data: {
        "isSOF": true,
        "currency": ['IDR']
      }
    }
    await accountListPost(data, headers)
      .then((response) => {
        const listSourceOfFund = response.data.dataProtected
        const getPrimaryAccount = listSourceOfFund.sofList
        let selectedAccount;

        if (getPrimaryAccount.length === 1) {
          selectedAccount = getPrimaryAccount[0];
        } else {
          selectedAccount = getPrimaryAccount.find(item => item.isMainAccount === true) || getPrimaryAccount[0];
        }

        const balanceAccount = currencyFormat({
          value: selectedAccount.activeBalance,
          isPrefix: false
        })
        if (getPrimaryAccount.length <= 1) {
          this.setData({
            changeSofArrow: false
          })
        } else {
          this.setData({
            changeSofArrow: true
          })
        }
        this.setData({
          isNegative: selectedAccount.activeBalance < 0 ? true : false,
          currency: selectedAccount.currency,
          mainSourceOfFund: selectedAccount,
          mainAccountBalance: balanceAccount,

        })
        this.checkSufficientBalance()

        this.setData({
          isLoading: false
        })

      })
      .catch((err) => {
        this.setData({
          isLoading: false
        })
        generalError({
          err,
          isSwipe: true,
          event: 'goToHomeScreen'
        })
      })
  },

  async callApiBillPayment() {
    this.setData({
      isLoading: true
    })

    const {
      partnerMenu,
      orderData,
    } = this.data
    const data = {
      "id": orderData.orderId,
      "ubpCompanyCode": partnerMenu.boBillerUbpCompanyCode,
    }

    let request = data
    let signature = request
    const payload = {
      "dataProtected": request,
    }
    const headers = {
      "Screen-Id": "javajazzFestivalGatherScreen",
      signature,
    }
    await inquiryBillPayment(payload, headers)
      .then((response) => {
        const dataResponse = response.data.dataProtected

        const amount = dataResponse.billInfoList.find(item => item.label === "NOMINAL" || item.label === "AMOUNT").value;
        const adminFee = dataResponse.billInfoList.find(item => item.label === "BIAYA ADMIN" || item.label === "ADMIN FEES").value;
        const total = dataResponse.billInfoList.find(item => item.label === "TOTAL").value;
        const valueAdminFee = currencyFormat({
          value: adminFee,
        })
        const formatBillerTotal = currencyFormat({
          value: total
        })
        this.setData({
          billerDetail: dataResponse,
          valueAdminFee,
          adminFee,
          billerAmount: amount,
          billerTotal: total,
          formatBillerTotal,
        })
        this.callApiListAccount()
      })
      .catch((err) => {
        this.setData({
          isLoading: false
        })
        generalError({
          err,
          isSwipe: true,
          event: 'goToHomeScreen'
        })

      })
  },
  showAccount() {
    if (!this.data.isLoading) {
      this.setData({
        showBalance: !this.data.showBalance,
      });
    }
  },
  showHideDetail() {
    this.setData({
      showDetail: !this.data.showDetail
    })
  },
  changeSof() {
    const data = {
      amount: this.data.priceCount,
      selectedAccount: {
        "accountNumber": this.data.mainSourceOfFund.accountNumber
      }
    }
    customNavigateTo({
      url: '/src/app/package_transaction/pages/change-sof-va/change-sof-va',
      data
    })
  },
  nextButton() {
    const {
      partnerMenu,
      personalData,
      mainSourceOfFund,
      billerDetail,
      selectedTicket,
      priceCount,
      ticketCount,
      adminFee,
      billerAmount,
      billerTotal
    } = this.data
    const data = {
      partnerMenu,
      personalData,
      sourceOfFund: mainSourceOfFund,
      billerDetail,
      selectedTicket,
      priceCount,
      ticketCount,
      adminFee,
      billerAmount,
      billerTotal,
      posContext: this.data.posContext
    }
    customNavigateTo({
      url: '/src/app/package_transaction/pages/confirmation-screen-va/confirmation-screen-va',
      data
    })
  },

  openModal() {
    this.setData({
      basicVisible: true
    })
  },

  backToLifestyle() {
    this.setData({
      basicVisible: false
    })
  },
});
/* JShield-obfus:disable */