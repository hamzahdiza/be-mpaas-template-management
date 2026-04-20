Component({
  props: {
    data: {},
    onVehicleTap: () => {}
  },
  methods: {
    onVehicleTap(e) {
      const { item } = e.target.dataset;
      this.props.onVehicleTap(item);
    }
  }
});
