Component({
  props: {
    data: {},
    cartCount: 0,
    totalCartPrice: 0,
    onProductTap: () => {},
    onAddToCart: () => {},
    onCheckoutClick: () => {}
  },
  methods: {
    onProductTap(e) {
      const { item } = e.currentTarget.dataset;
      this.props.onProductTap(item);
    },
    onAddToCart(e) {
      const { item } = e.currentTarget.dataset;
      this.props.onAddToCart(item);
    },
    onCheckoutClick() {
      this.props.onCheckoutClick();
    }
  }
});
