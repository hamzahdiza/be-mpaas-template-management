const errorCodeConfig = require("../../../public/error_code_config.json");


Component({
  mixins: [],
  data: {
    lang: "",
    generalError: false,
    errorTitle: "",
    errorMessage: "",
    isSwipe: false,
    event: '',
    param: '',
    errorCode: '',
    errorButton: ''
  },
  ref() {
    return {
      changeVisiable: () => this.change(),
    };
  },
  didMount() {
    const requestGeneralError = [errorCodeConfig.toNearestBranch,
      errorCodeConfig.toSplashScreen,
      errorCodeConfig.validateUSerCredentialResetPassword,
      errorCodeConfig.validateUSerCredentialProvisioning,
      errorCodeConfig.toHomeScreen];
    let result = requestGeneralError.flatMap(item => Object.values(item))
    this.$page.currentGeneralErrorCom = this
    my.generalErrorFunc = (obj) => {
      // for 503 http status
      if (obj.errorHttpStatus === 503 || obj.errorHttpStatus === 401 || obj.isIntercept) return

      // distinguish between page calls and request calls
      if ((result.includes(obj.errorCode) || obj.errorCode.startsWith('LIM-') || obj.errorCode.startsWith('GTW-'))  && !obj.event) return

      const _this_ = getCurrentPages()[getCurrentPages().length - 1].currentGeneralErrorCom
      my.call("enableSwipe", { isSwipe: false }, () => {})
      let errorTitle = ''
      let errorMessage = ''
      let errorButton = ''
      if (obj.errorCode.startsWith('GTW-')) {
        errorTitle = 'commonGeneralOverlayErrorTitle'
        errorMessage = 'commonGeneralOverlayErrorBody'
        errorButton = 'commonGeneralOverlayErrorCTACloseButton'
      } else if (obj.isRefresh) {
        errorTitle = 'generalAccessTokenErrorOverlayTitleLabel'
        errorMessage = 'generalAccessTokenErrorOverlayDescriptionLabel'
        errorButton = 'generalAccessTokenErrorOverlayButtonLabel'
      } else {
        errorTitle = obj.errorCode + '_errorTitle'
        errorMessage = obj.errorCode + '_errorMessage'
        if (obj.errorCode.startsWith('LIM-')) {
          errorButton = 'transactionLoadingBehaviourBackHomeButtonLabel'
        } else {
          errorButton = 'commonGeneralErrorResponseCTAButton'
        }
      }
      _this_.setData({
        lang: getApp().globalData.languagePack,
        generalError: true,
        isSwipe: obj.isSwipe,
        errorCode: obj.errorCode,
        errorTitle,
        errorMessage,
        errorButton,
        event: obj.event ? obj.event : '',
        param: obj.param ? obj.param: ''
      })
      _this_.$page.setData({
        lottieLoading: false,
        submitting: false,
      })
    }
  },
  methods: {
    change() {
      if (this.data.event === '' || this.data.event === 'isRequest') {
        this.setData({
          generalError: false
        })
        my.call("enableSwipe", { isSwipe: this.data.isSwipe }, () => {})
      } else {
        my.call(this.data.event, this.data.param, () => {})
      }
    },
  },
});