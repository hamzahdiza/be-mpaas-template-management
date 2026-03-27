const errorCodeConfig = require("../../../public/error_code_config.json");

Component({
  mixins: [],
  data: {
    lang: "",
    generalError: false,
    errorTitle: "",
    errorMessage: "",
    isSwipe: false,
    errorCode: '',
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
    this.$page.currentAuthErrorCom = this
    my.authErrorFunc = (obj) => {
      // for 503 http status
      if (obj.errorHttpStatus === 503 || obj.errorHttpStatus === 401 || obj.err.isIntercept) return
      // distinguish between page calls and request calls
      if ((result.includes(obj.errorCode) || obj.errorCode.startsWith('LIM-') || obj.errorCode.startsWith('GTW-'))) return
      const _this_ = getCurrentPages()[getCurrentPages().length - 1].currentAuthErrorCom
      my.call("enableSwipe", { isSwipe: false }, () => {})
      let errorTitle = obj.errorCode + '_errorTitle'
      let errorMessage = obj.errorCode + '_errorMessage'
      _this_.setData({
        lang: getApp().globalData.languagePack,
        generalError: true,
        isSwipe: obj.isSwipe,
        errorCode: obj.errorCode,
        errorTitle,
        errorMessage,
      })
      _this_.$page.setData({
        lottieLoading: false,
        submitting: false,
      })
    }
  },
  methods: {
    change() {
      my.call("goToHomeScreen", { }, () => {})
    },
  },
});