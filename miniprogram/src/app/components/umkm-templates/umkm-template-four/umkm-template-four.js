Component({
  props: { data: {}, cartCount: 0, totalCartPrice: 0, onProductTap: () => {}, onAddToCart: () => {}, onCheckoutClick: () => {} },
  methods: {
    onProductTap(e) { this.props.onProductTap(e.currentTarget.dataset.item); },
    onAddToCart(e) { this.props.onAddToCart(e.currentTarget.dataset.item); },
    onCheckoutClick() { this.props.onCheckoutClick(); }
  }
});
