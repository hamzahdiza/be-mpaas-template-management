Component({
  props: {
    data: {},
    onScreenChange: () => {}
  },
  methods: {
    handleRoomTap(e) {
      const { item } = e.currentTarget.dataset;
      this.props.onScreenChange(item);
    }
  }
});