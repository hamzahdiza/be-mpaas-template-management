Component({
  props: {
    detailEvent: {},
    ticketDataList: [],
    lang: {},
    onGoToTicketList: () => {},
  },
  data: {
    currentPoster: 0,
    currentInfo: 0,
    isExpanded: false,
    isExpandInfo: false,
    formattedDate: ''
  }, didMount() {
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
    indicatorPoster(e) {
      this.setData({ currentPoster: e.target.dataset.index });
    },
    toggleExpanded() {
      this.setData({ isExpanded: !this.data.isExpanded });
    },
    toggleExpandInfo() {
      this.setData({ isExpandInfo: !this.data.isExpandInfo });
    },
    onSwipeChangePromo(e) {
      this.setData({ currentInfo: e.detail.current });
    },
    indicatorPromo(e) {
      this.setData({ currentInfo: e.target.dataset.index });
    },
    openMap() {
        // Implement map opening logic or emit event
    },
    goToTicketList(e) {
        this.props.onGoToTicketList(e.target.dataset.ticketData);
    },
    popupPromo(e) {
        // Emit event to parent to show popup (since popup might be global or at page level)
        // Or handle it here if we move the popup component inside this template
        // For now, let's assume we emit it
        this.props.onPopupPromo(e.target.dataset.image);
    }
  },
});