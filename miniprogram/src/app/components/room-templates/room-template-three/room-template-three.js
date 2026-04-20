Component({
  props: {
    room: {},
    hotel: {},
    onBack: () => {},
    onBook: () => {}
  },
  methods: {
    onBackTap() {
      this.props.onBack();
    },
    onBookTap() {
      this.props.onBook();
    }
  }
});