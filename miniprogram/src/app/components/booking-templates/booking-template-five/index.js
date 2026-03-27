Component({
  props: {
    lang: {},
    isLoading: false,
    ticketData: {},
    eventDetail: {},
    showTab: false,
    tabFilter: [],
    tabActive: 0,
    dataPromoList: [],
    dataRegulerList: [],
    totalTicket: 0,
    totalAmount: 0,
    totalPrice: 0,
    errorApi: false,
    isExit: false,
    isCopyTriggered: false,
    isToastIn: false,
    onHandleFilter: () => {},
    onHandleRemove: () => {},
    onHandlePlus: () => {},
    onDisableToast: () => {},
    onNextPage: () => {},
    onHandleNotif: () => {}
  },
  methods: {
      handleFilter(e) {
          this.props.onHandleFilter(e);
      },
      handleRemove(e) {
          this.props.onHandleRemove(e);
      },
      handlePlus(e) {
          this.props.onHandlePlus(e);
      },
      disableToast() {
          this.props.onDisableToast();
      },
      nextPage() {
          this.props.onNextPage();
      },
      handleNotif() {
          this.props.onHandleNotif();
      }
  }
});
