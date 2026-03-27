Component({
  mixins: [],
  data: {
    featureCheckModal: false,
    statusBarHeight: 0
  },
  props: {},
  didMount() {
    this.$page.currentSeeNearBranchCom = this
    const {statusBarHeight} = my.getSystemInfoSync()
    this.setData({
      statusBarHeight
    })
    my.seeNearBranchesModalFunc = (flag) => {
      const _this_ = getCurrentPages()[getCurrentPages().length - 1].currentSeeNearBranchCom
      my.call("enableSwipe", { isSwipe: false }, () => {})
      _this_.setData({
        lang: getApp().globalData.languagePack,
        seeNearBranchesModal: flag
      })
    }
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    toSeeNearestBranchLocations(){
      my.call("openExternalBrowserListBranch", {}, () => { });
    }
  },
});