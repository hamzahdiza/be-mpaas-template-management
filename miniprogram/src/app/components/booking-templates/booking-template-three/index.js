Component({
  props: {
    lang: Object,
    isLoading: Boolean,
    ticketData: Object,
    eventDetail: Object,
    showTab: Boolean,
    tabFilter: Array,
    tabActive: Number,
    dataPromoList: Array,
    dataRegulerList: Array,
    totalTicket: Number,
    totalAmount: Number,
    totalPrice: String,
    errorApi: Boolean,
    isExit: Boolean,
    isCopyTriggered: Boolean,
    isToastIn: Boolean,
    onHandleFilter: () => {},
    onHandleRemove: () => {},
    onHandlePlus: () => {},
    onDisableToast: () => {},
    onNextPage: () => {},
    onHandleNotif: () => {}
  },
  data: {
    safeAreaBottom: 0,
    footerHeight: 0
  },
  didMount() {
    try {
      const sysInfo = my.getSystemInfoSync();
      if (sysInfo.safeArea) {
        const safeAreaBottom = sysInfo.screenHeight - sysInfo.safeArea.bottom;
        this.setData({
          safeAreaBottom: Math.max(0, safeAreaBottom)
        });
      }
      setTimeout(() => {
        this.createSelectorQuery()
          .select('.bottom-container')
          .boundingClientRect()
          .exec((ret) => {
            if (ret && ret[0]) {
              this.setData({
                footerHeight: ret[0].height
              });
            }
          });
      }, 100);
    } catch (e) {
      console.error(e);
    }
  },
  didUpdate(prevProps) {
    if (this.props.totalTicket > 0 && (prevProps.totalTicket === 0 || this.props.totalTicket !== prevProps.totalTicket)) {
      setTimeout(() => {
        this.createSelectorQuery()
          .select('.bottom-container')
          .boundingClientRect()
          .exec((ret) => {
            if (ret && ret[0]) {
              this.setData({
                footerHeight: ret[0].height
              });
            }
          });
      }, 100);
    }
  },
  methods: {
    handleFilter(e) {
      if (this.props.onHandleFilter) {
        this.props.onHandleFilter(e);
      }
    },
    handleRemove(e) {
      if (this.props.onHandleRemove) {
        this.props.onHandleRemove(e);
      }
    },
    handlePlus(e) {
      if (this.props.onHandlePlus) {
        this.props.onHandlePlus(e);
      }
    },
    disableToast(e) {
      if (this.props.onDisableToast) {
        this.props.onDisableToast(e);
      }
    },
    nextPage(e) {
      if (this.props.onNextPage) {
        this.props.onNextPage(e);
      }
    },
    handleNotif(e) {
      if (this.props.onHandleNotif) {
        this.props.onHandleNotif(e);
      }
    }
  }
});
