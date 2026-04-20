Component({
  props: {
    data: {},
    cartCount: 0,
    totalCartPrice: 0,
    onScreenChange: () => {},
    onAddToCart: () => {},
    onCheckout: () => {}
  },
  methods: {
    handleRoomTap(e) {
      const { item } = e.currentTarget.dataset;
      this.props.onScreenChange(item);
    },
    onAddClick(e) {
      const { item } = e.currentTarget.dataset;
      this.props.onAddToCart(item);
    },
    onCheckoutClick() {
      this.props.onCheckout();
    }
  }
});