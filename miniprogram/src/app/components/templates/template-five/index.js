Component({
  props: {
    detailEvent: {},
    ticketDataList: [],
    lang: {},
    onGoToTicketList: () => {},
    onPopupPromo: () => {},
    formattedDate: ''
  },
  data: {
    currentPoster: 0,
    isDescExpanded: false
  },
  didMount() {
    const eventDate = new Date(this.props.detailEvent.eventDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    this.setData({
      formattedDate: eventDate.toLocaleDateString('id-ID', options)
    });
  },
  methods: {
    onSwipeChangePoster(e) {
      this.setData({ currentPoster: e.detail.current });
    },
    goBack() {
      my.navigateBack();
    },
    toggleDescExpanded() {
      this.setData({ isDescExpanded: !this.data.isDescExpanded });
    },
    openMap() {
      // Implement map logic
    },
    goToTicketList(e) {
      this.props.onGoToTicketList(e.target.dataset.ticketData);
    }
  }
});
