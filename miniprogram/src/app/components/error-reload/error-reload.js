Component({
  mixins: [],
  data: {},
  props: {
    onReload: () => {},
    title: '',
    desc: ''
  },
  didMount() {
    this.setData({
      lang: getApp().globalData.languagePack
    })
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    handleReload() {
      this.setData({
        lang: getApp().globalData.languagePack
      })
      this.props.onReload()
    }
  },
});