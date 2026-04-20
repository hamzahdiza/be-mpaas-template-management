Component({
  props: {
    data: {},
    onVehicleTap: () => {}
  },
  methods: {
    onVehicleTap(e) {
      const { item } = e.currentTarget.dataset;
      this.props.onVehicleTap(item);
    }
  }
});
