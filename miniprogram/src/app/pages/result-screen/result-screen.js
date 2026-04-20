import {
  currencyFormat
} from "/src/utils/currency-util";

import {
  dateFormatTimeStamp
} from "/src/utils/date-util"

import getNetwork from "/src/utils/getNetWork"
import { createServiceOrder } from "/src/public/api"

const app = getApp()

/* JShield-obfus:enable */
Page({
  data: {
    isFetching: Boolean(false),
    mergeStatus: Object({
      isMerge: String("true"),
      isNotMerge: String("false")
    }),
    buttonFeatures: Array(),
    isOpen: Boolean(false),
    billerInfo: Object(),
    userAccInfo: Object(),
    titleStatus: String(),
    descriptionText: String(),
    lang: Object(),
    illustrationSource: String(""),
    transactionId: String(),
    transactionData: Object(),
    nominalAmount: String(),
    timeStamp: String(),
    refId: String(),
    isFailMergeModal: Boolean(false),
    failMergeRes: Object(),
  },
  onShow() {
    my.call("enableSwipe", {
      isSwipe: false
    }, () => {});
    getNetwork()
  },

  async onLoad(query) {
    const lang = getApp().globalData.languagePack
    this.setData({
      lang
    })
    let queryParams = query.customUrlQueryData ? my.customUrlQueryData[query.customUrlQueryData] : ""


    if (!queryParams.transactionData) {
      const clientPlatform = getApp().globalData.nativeData.clientPlatform;
      const nativeKey = clientPlatform === "ios" ? "lifestyleTransactionDetailContext" : "common/lifestyleTransactionDetail";

      my.call("getSecureValueByKey", {
        key: nativeKey
      }, async (res) => {

        if (res && res.data) {
          let parsed = JSON.parse(res.data)
          this.getTransactionDetail(parsed, queryParams.posContext)
        }

      });

    } else {
      this.getTransactionDetail(queryParams.transactionData, queryParams.posContext)
    }
  },

  getTransactionDetail(dataParams, posContext = null) {
    try {

      let {
        data,
        dataProtected,
        transactionTypePartner
      } = dataParams

      if (data.transactionStatus.toUpperCase() == "FAILED") {
        let updatedLang = {
          ...this.data.lang
        }
        updatedLang.lifestyleBillPaymentJavaJazzFestivalResultScreenFailedLabel = this.data.lang[data.transactionDescription]
        this.setData({
          lang: updatedLang
        })
      }

      const
        decryptedData = dataProtected

      const {
        updatedIllus,
        updatedDescription,
        updatedTitleStatus
      } = this.setDetailInformation(data.transactionStatus)

      const updatedList = this.setFeaturesList(data.transactionStatus)


      const updatedBiller = {
        categoryName: data.categoryData.categoryName,
        billerName: data.billerName,
      }

      let {
        account
      } = decryptedData



      account.maskedValue = "*".repeat(account.accountNumber.length - 3) + account.accountNumber.slice(-3)


      const updatedAccount = {
        accountName: account.accountName,
        productName: account.productName,
        accountNumber: account.maskedValue
      }
      this.setData({
          eventTitle: app.globalData.eventTitle,
          transactionTypePartner,
        transactionData: {
          data,
          dataProtected: decryptedData
        },
        illustrationSource: updatedIllus,
        buttonFeatures: updatedList,
        billerInfo: updatedBiller,
        userAccInfo: updatedAccount,
        descriptionText: updatedDescription,
        titleStatus: updatedTitleStatus,
        nominalAmount: currencyFormat({
          value: getApp().globalData.totalPriceGlobal,
          currency: data.currencyCode || "IDR"
        }),
        timeStamp: dateFormatTimeStamp(new Date(), "DD MMM YYYY [•] HH:mm:ss [WIB] [•]"),
        refId: decryptedData.referenceNumber || decryptedData.referenceId,
        posContext: posContext || null
      })

      if (data.transactionStatus.toUpperCase() == "SUCCESS") {
        this.processPOSOrder()
      }

      if (data.transactionStatus.toUpperCase() == "SUCCESS" || data.transactionStatus.toUpperCase() == "FAILED") {
        this.storeTransaction({
          data,
          decryptedData,
          transactionTypePartner
        })
      }
    } catch (error) {
      this.setData({
        isFailCustomModal: true,
        initFail: true,
        failCustomRes: {
          title: "general error",
          description: error.toString()
        }
      })
    }
  },
  setDetailInformation(status) {
    status = status.toUpperCase()
    const updatedIllus = status == "FAILED" ? "/src/assets/images/illustration_result_va_fail.svg" :
      status == "SUCCESS" ? "/src/assets/images/illustration_result_va_success.svg" : "/src/assets/images/illustration_result_va_progress.svg"

    const updatedDescription = status == "FAILED" ? this.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenFailedLabel : status == "INPROGRESS" ? this.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenInProgressLabel : this.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenSuccessLabelJavaJazzFestival

    const updatedTitleStatus = status == "FAILED" ? this.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenFailedTitleLabel : status == "INPROGRESS" ? this.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenInProgressTitleLabel : this.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenSuccessTitleLabel
    return {
      updatedIllus,
      updatedDescription,
      updatedTitleStatus
    }
  },
  setFeaturesList(status) {
    const featuresList = new Array()
    status = status.toUpperCase()
    if (status == "SUCCESS") {

      featuresList.push({
        name: this.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenRecentReceiptButtonLabel,
        icon: "/src/assets/icons/Icon_print_trans.svg",
        disabled: false,
        iconId: "lifestyle-tsel-result-receipt-icon",
        textId: "lifestyle-tsel-result-receipt-label"
      })
    } else if (status == "FAILED") {
      featuresList.push({
        name: this.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenMutationCheckButtonLabel,
        icon: "/src/assets/icons/Icon_mutation_history.svg",
        disabled: false,
        iconId: "lifestyle-tsel-result-check-transaction-icon",
        textId: "lifestyle-tsel-result-check-transaction-label"
      })

      featuresList.push({
        name: this.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenRecentReceiptButtonLabel,
        icon: "/src/assets/icons/Icon_print_trans.svg",
        disabled: false,
        iconId: "lifestyle-tsel-result-receipt-icon",
        textId: "lifestyle-tsel-result-receipt-label"
      })
    } else if (status == "INPROGRESS") {
      featuresList.push({
        name: this.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenHistoryTransactionButtonLabel,
        icon: "/src/assets/icons/Icon_transaction_history.svg",
        disabled: false,
        iconId: "lifestyle-tsel-result-transaction-history-icon",
        textId: "lifestyle-tsel-result-transaction-history-label"
      })
    }
    return featuresList
  },
  async featureHandler(e) {
    let {
      name
    } = e.currentTarget.dataset

    if (name == this.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenMutationCheckButtonLabel) {
      //CHECK MUTATION 

      my.call("goToCasaDetail", {
        accountNumber: this.data.transactionData.dataProtected.account.accountNumber
      }, () => {})

    } else if (name == this.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenHistoryTransactionButtonLabel) {
      //TRANSACTION HISTORY

      my.call(
        "getAppConfig", {
          keys: ["app.mpaas.application.id.lifestyle", "app.mpaas.application.path.lifestyle.history"]
        },
        (res) => {

          const dataNative = getApp().globalData.nativeData
          const partnerMenu = getApp().globalData.partnerMenu

          my.navigateToMiniProgram({
            appId: res["app.mpaas.application.id.lifestyle"],
            path: res["app.mpaas.application.path.lifestyle.history"],
            extraData: {
              nativeData: JSON.stringify(dataNative),
              partnerMenu: JSON.stringify(partnerMenu),
              nativeDataAndroid: dataNative,
              partnerMenuAndroid: partnerMenu,
            },
    
          });
        }
      );

    } else if (name == this.data.lang.lifestyleBillPaymentJavaJazzFestivalResultScreenRecentReceiptButtonLabel) {
      //RECEIPT SCREEN
      my.call("goToReceiptScreen", {
        transactionId: this.data.transactionData.dataProtected.transactionId,
        fromScreen: "src/app/package_result_screen/result-screen-bp/result-screen-bp",
      }, () => {})
    }
  },

  closeStillPending() {
    this.setData({
      isStillPending: false
    })
  },
  storeTransaction(dataPayload) {
    const {
      data,
      decryptedData,
      transactionTypePartner
    } = dataPayload
    const storedData = {
      data: {

        completionTime: data.completionTime,
        transactionStatus: data.transactionStatus,
        billAmount: data.billAmount,
        currencyCode: data.currencyCode,
        billerName: data.billerName,
        categoryData: data.categoryData,
      },
      dataProtected: {
        referenceNumber: decryptedData.referenceNumber || decryptedData.referenceId,
        transactionId: decryptedData.transactionId,
        billKey1: decryptedData.billKey1,
        account: decryptedData.account
      },
      transactionTypePartner
    }
    my.call("storeTransactionDetailContext", {
      data: JSON.stringify(storedData),
    }, () => {})
  },

  homeHandler() {
    my.call("goToHomeScreen", {}, () => {})
  },

  async processPOSOrder() {
    const { posContext, transactionData } = this.data;
    if (posContext && transactionData.data.transactionStatus.toUpperCase() === "SUCCESS") {
      try {
        console.log("Processing POS Order after SUCCESS payment...");
        // Status diset ke 'accepted' karena sudah PAID
        const payload = {
          ...posContext,
          status: "accepted" 
        };
        const res = await createServiceOrder(payload);
        console.log("POS Order Created Successfully:", res);
      } catch (err) {
        console.error("Failed to create POS Order after payment:", err);
      }
    }
  }
});
/* JShield-obfus:disable */