Component({
  props: {
    data: {},
    onScreenChange: () => {}
  },
  methods: {
    handleRoomTap(e) {
      const { item } = e.currentTarget.dataset;
      // Trigger callback ke parent (index page)
      this.props.onScreenChange(item);
    }
  }
});