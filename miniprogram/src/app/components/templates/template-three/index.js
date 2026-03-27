Component({
  props: {
    detailEvent: {},
    ticketDataList: [],
    onGoToTicketList: () => {},
    formattedDate: ''
  },
  didMount() {
    const eventDate = new Date(this.props.detailEvent.eventDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    this.setData({
      formattedDate: eventDate.toLocaleDateString('id-ID', options)
    });
  },
  methods: {
    goToTicketList(e) {
      this.props.onGoToTicketList(e.target.dataset.ticketData);
    },
  },
});