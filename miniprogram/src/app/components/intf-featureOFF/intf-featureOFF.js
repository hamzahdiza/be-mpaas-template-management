Component({
  mixins: [],
  data: {
    featureCheckModal: false
  },
  props: {},
  didMount() {
    this.$page.currentFeatureCom = this
    my.featureCheckModalFunc = (flag) => {
      const _this_ = getCurrentPages()[getCurrentPages().length - 1].currentFeatureCom
      my.call("enableSwipe", { isSwipe: false }, () => {})
      _this_.setData({
        featureCheckModal: flag,
        lang: getApp().globalData.languagePack
      })
      _this_.$page.setData({
        lottieLoading: false,
        submitting: false,
      })
    }
  },
  didUpdate() {},
  didUnmount() {
  },
  methods() {
  },
});