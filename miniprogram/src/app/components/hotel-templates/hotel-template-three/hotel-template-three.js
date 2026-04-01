Component({
  props: {
    data: {},
    onScreenChange: () => {}
  },
  methods: {
    handleRoomTap(e) {
      const { item } = e.currentTarget.dataset;
      // Memanggil fungsi callback dari parent page
      this.props.onScreenChange(item);
    }
  }
});