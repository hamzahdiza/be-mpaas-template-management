import {
  postBillerValidation,
  postBillerExecution
} from "/src/public/api";
import {
  customNavigateTo
} from "/src/utils/route-util";
import {
  encryptMPIN
} from "/src/utils/e2ee"
import getNetWork from "/src/utils/getNetWork";
import generalError from "/src/utils/generalError";

/* JShield-obfus:enable */
Page({
  data: {
    lang: Object({}),
    showErrorDialog: Boolean(false),
    showErrorExecution: Boolean(false),
    executionErrorTitle: String(""),
    executionErrorMessage: String(""),
    executionErrorButton: String(""),
    mpinInputBoxMargin: String("0rpx"),
    scenario: String(""),
    forgetPin: Boolean(false),
    canInput: Boolean(false),
    mpinInput: Array(),
    submitting: Boolean(true),
    transactionId: String(""),
    errorPromp: String(""),
    transactionData: Object(),
    isError: Boolean(false),
    buttonFuncFlag: String(""),
    authType: String("")
  },

  onLoad(query) {
    const {
        transactionId,
        scenario,
        transactionData,
        partnerMenu,
        transactionTypePartner,
        authType,
        posContext
      } = my.customUrlQueryData[query.customUrlQueryData];

    let globalLang = getApp().globalData.languagePack;

    this.setData({
        lang: globalLang,
        transactionId,
        scenario,
        transactionData,
        partnerMenu,
        transactionTypePartner,
        authType,
        posContext
      })

    if (authType === "POSTLOGIN_NO_PIN") {
      this.verifyPassword()
    } else {
      this.setData({
        submitting: false,
        canInput: true
      })
    }
  },

  onHandleClick(event) {
    const {
      canInput,
      mpinInput
    } = this.data;

    if (!canInput) return;

    if (mpinInput.length < 6) {
      my.vibrateShort();
      mpinInput.push(event.target.dataset.attr);
      this.setData({
        mpinInput: mpinInput
      });

      if (mpinInput.length === 6) {
        this.verifyPassword();
      }
    } else if (mpinInput.length === 6) {
      this.setData({
        isError: false,
        mpinInput: [event.target.dataset.attr],
      });
      my.vibrateShort();
    }
  },


  onHandleClickDelete() {
    const {
      canInput,
      mpinInput
    } = this.data;

    if (!canInput || !mpinInput || mpinInput.length === 0) return;

    my.vibrateShort();

    if (mpinInput.length === 6) {
      this.setData({
        isError: false,
        mpinInput: [],
      });
    } else {
      this.setData({
        mpinInput: mpinInput.slice(0, -1),
      });
    }
  },

  async verifyPassword() {
    this.setData({
      submitting: true,
      canInput: false
    })

    try {
      let mpin;
      if (this.data.authType !== "POSTLOGIN_NO_PIN") {
        mpin = 1 //encryptMPIN(getApp().globalData.nativeData.beE2EEPublicKey, getApp().globalData.nativeData.userId, this.data.mpinInput.join(''))
      }

      const payloadProtected = {
        "transactionId": this.data.transactionId
      }

      const request = payloadProtected

      let bodyPayload;

      if (this.data.authType === "POSTLOGIN_NO_PIN") {
        bodyPayload = {
          "data": {
            "scenario": this.data.scenario,
          },
          "dataProtected": request
        }
      } else {
        bodyPayload = {
          "data": {
            "scenario": this.data.scenario,
            "mpinBlock": mpin
          },
          "dataProtected": request
        }
      }


      const signature = bodyPayload

      const response = await postBillerValidation(bodyPayload, {
        "Signature": signature
      })

      const {
        token
      } = response.data.data

      await this.transactionExecution(token)

    } catch (err) {
      this.setData({
        submitting: false,
      })

      const errorCode = err.data ? err.data.errorCode : 'UNKNOWN_ERROR'

      if (errorCode === "UMS-002-110") {
        this.setData({
          showErrorDialog: true,
          isError: true,
          errorPromp: this.data.lang.transactionalMpaasMpinScreenInlineErrorBlockedMPINLabel
        })
        my.call("enableSwipe", {
          isSwipe: false
        }, () => {})
      } else if (errorCode === "UMS-002-102" || errorCode === 'UMS-002-119') {

        this.setData({
          showErrorDialog: false,
          isError: true,
          errorPromp: errorCode === "UMS-002-102" ? this.data.lang.transactionalMpaasMpinScreenInlineErrorWrongCredentialsLabel : this.data.lang.transactionalMpaasMpinScreenInlineErrorWrongCredentialsLastChanceLabel
        })
      } else {
        my.authErrorFunc({
          err: err,
          errorCode: errorCode,
          isSwipe: true,
          errorHttpStatus: err.statusCode
        })
      }


    } finally {
      this.setData({
        canInput: true,
        submitting: false
      })
    }
  },

  async transactionExecution(token) {
    try {

      const executionPayload = {
        transactionId: this.data.transactionId,
        notificationFlag: this.data.transactionTypePartner
      }

      const executionRequest = executionPayload
      const executionSignature = {
        "dataProtected": executionRequest
      }


      const response = await postBillerExecution({
        dataProtected: executionRequest
      }, {
        "Signature": executionSignature,
        "Mav-Authorization": token
      })


      const {
        data: res
      } = response

      if (res.data.transactionStatus.toUpperCase() == "SENT") {
        this.data.transactionData.data.transactionStatus = "INPROGRESS"
      }

      my.call("enableSwipe", {
        isSwipe: false
      }, () => {});


      customNavigateTo({
        url: "/src/app/pages/result-screen/result-screen",
        mode: "redirectTo",
        data: {
          transactionId: this.data.transactionId,
          scenario: this.data.scenario,
          transactionData: res.data.transactionStatus === "SENT" ? this.data.transactionData : res,
          transactionTypePartner: this.data.transactionTypePartner,
          posContext: this.data.posContext
        }
      })
    } catch (err) {
      const {
        errorTitle,
        errorMessage,
        errorCode
      } = err.data

      let executionErrorTitle, executionErrorMessage, executionErrorButton, buttonFuncFlag, flag
      switch (errorCode) {
        case 'VAT-030-023':
          executionErrorTitle = errorTitle
          executionErrorMessage = errorMessage
          executionErrorButton = this.data.lang.transactionLoadingBehaviourBackHomeButtonLabel
          buttonFuncFlag = "goToHomeScreen"
          flag = true
          break
        case 'GNR-000-902':
          executionErrorTitle = this.data.lang.transactionLoadingBehaviourInvalidConfigVirtualAccountTitleLabel
          executionErrorMessage = this.data.lang.transactionLoadingBehaviourInvalidConfigVirtualAccountDescriptionLabel
          executionErrorButton = this.data.lang.transactionLoadingBehaviourBackGatherVirtualAccountButtonLabel
          flag = true
          break
        case 'VAT-030-012':
          executionErrorTitle = this.data.lang.transactionLoadingBehaviourIdNotFoundVirtualAccountTitleLabel
          executionErrorMessage = this.data.lang.transactionLoadingBehaviourIdNotFoundVirtualAccountDescriptionLabel
          executionErrorButton = this.data.lang.transactionLoadingBehaviourBackGatherVirtualAccountButtonLabel
          flag = true
          break
        case 'VAT-030-013':
          executionErrorTitle = this.data.lang.transactionLoadingBehaviourIdAlreadyExecutedVirtualAccountTitleLabel
          executionErrorMessage = this.data.lang.transactionLoadingBehaviourIdAlreadyExecutedVirtualAccountDescriptionLabel
          executionErrorButton = this.data.lang.transactionLoadingBehaviourBackGatherVirtualAccountButtonLabel
          flag = true
          break
        case 'VAT-030-014':
          executionErrorTitle = this.data.lang.transactionLoadingBehaviourFailedVerifyVirtualAccountTitleLabel
          executionErrorMessage = this.data.lang.transactionLoadingBehaviourFailedVerifyVirtualAccountDescriptionLabel
          executionErrorButton = this.data.lang.transactionLoadingBehaviourBackGatherVirtualAccountButtonLabel
          flag = true
          break
        case 'VAT-030-015':
          executionErrorTitle = this.data.lang.transactionLoadingBehaviourAlreadyExpiredVirtualAccountTitleLabel
          executionErrorMessage = this.data.lang.transactionLoadingBehaviourAlreadyExpiredVirtualAccountDescriptionLabel
          executionErrorButton = this.data.lang.transactionLoadingBehaviourBackGatherVirtualAccountButtonLabel
          flag = true
          break
        case 'VAT-030-008':
          executionErrorTitle = errorTitle
          executionErrorMessage = errorMessage
          executionErrorButton = this.data.lang.transactionLoadingBehaviourBackHomeButtonLabel
          buttonFuncFlag = "goToHomeScreen"
          flag = true
          break
        case 'VAT-030-024':
          executionErrorTitle = errorTitle
          executionErrorMessage = errorMessage
          executionErrorButton = this.data.lang.transactionLoadingBehaviourButtonLabel
          buttonFuncFlag = "goToSplashScreen"
          flag = true
          break
        case 'GNR-000-996':
        case 'GNR-000-995': {
          generalError({
            err,
            isSwipe: false,
            event: 'goToHomeScreen'
          })

          break
        }
        case 'BPY-037-1588':
          if (this.data.scenario) {
            flag = false
            this.data.transactionData.data.transactionStatus = "INPROGRESS"

            my.call("enableSwipe", {
              isSwipe: false
            }, () => {});

            customNavigateTo({
              url: "/src/app/pages/result-screen/result-screen",
              mode: "redirectTo",
              data: {
                transactionId: this.data.transactionId,
                scenario: this.data.scenario,
                transactionData: this.data.transactionData
              }
            })
          } else {
            executionErrorTitle = errorTitle
            executionErrorMessage = errorMessage
            executionErrorButton = this.data.lang.transactionLoadingBehaviourBackHomeButtonLabel
            buttonFuncFlag = "goToHomeScreen"
            flag = true
          }
          break
        default: {

          my.call("enableSwipe", {
            isSwipe: false
          }, () => {});

          customNavigateTo({
            url: "/src/app/pages/result-screen/result-screen",
            mode: "redirectTo",
            data: {
              transactionId: this.data.transactionId,
              scenario: this.data.scenario,
              transactionData: {
                data: {
                  ...this.data.transactionData.data,
                  transactionStatus: "FAILED",
                  transactionDescription: errorMessage
                },
                dataProtected: {
                  ...this.data.transactionData.dataProtected
                }
              }
            }
          })
          break
        }
      }
      if (flag) {
        this.setData({
          executionErrorTitle,
          executionErrorMessage,
          executionErrorButton,
          buttonFuncFlag,
          showErrorExecution: true
        })
      }
    } finally {
      this.setData({
        canInput: true,
        submitting: false
      })
    }
  },

  onClickErrorExecution() {
    if (!this.data.buttonFuncFlag) {
      customNavigateTo({
        url: "/src/app/pages/index/index",
        mode: "redirectTo",
        data: {}
      })
    } else {
      my.call(this.data.buttonFuncFlag, {}, () => {})
    }
  },

  onHandleClickForgot() {
    this.setData({
      forgetPin: true
    })
    my.call("enableSwipe", {
      isSwipe: false
    }, () => {})
  },


  resetMPIN() {
    this.setData({
      showErrorDialog: false,
      forgetPin: false
    });
    my.call('validateUserCredential', {
      scenario: 'RESET_MPIN'
    }, () => {});
  },

  backToHome() {
    my.call("goToHomeScreen", {}, () => {})
  },

  closeModal() {
    this.setData({
      forgetPin: false
    });
    my.call("enableSwipe", {
      isSwipe: true
    }, () => {})
  },
  onUnload() {
    my.call("disableScreenshot", {
      isDisabled: false
    }, () => {})
  },
  onHide() {
    my.call("disableScreenshot", {
      isDisabled: false
    }, () => {})
  },
  onShow() {
    this.setData({
      mpinInput: [],
      showErrorDialog: false,
      showErrorExecution: false,
      executionErrorTitle: "",
      executionErrorMessage: "",
      executionErrorButton: "",
      isError: false,
      errorPromp: "",
      buttonFuncFlag: ""
    })
    if (this.data.authType !== "POSTLOGIN_NO_PIN") {
      this.setData({
        canInput: true,
        submitting: false,
      })
    } else {
      this.setData({
        canInput: false,
        submitting: true,
      })
    }
    my.call("disableScreenshot", {
      isDisabled: true
    }, () => {})
    my.call("enableSwipe", {
      isSwipe: true
    }, () => {})
    getNetWork()
  }
});
/* JShield-obfus:disable */