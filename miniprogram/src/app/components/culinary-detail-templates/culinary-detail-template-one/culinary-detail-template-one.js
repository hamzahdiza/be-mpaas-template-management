Component({
  props: {
    room: {},
    hotel: {},
    onBack: () => {},
    onBook: () => {}
  },
  methods: {
    onBack() {
      this.props.onBack();
    },
    onBook() {
      this.props.onBook();
    }
  }
});
