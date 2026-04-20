import { customNavigateTo } from "/src/utils/route-util";

Page({
  data: {
    umkmData: {},
    templateId: 1,
    cart: [],
    totalCartPrice: 0,
    cartCount: 0
  },
  onLoad(query) {
    const { umkmData } = my.customUrlQueryData[query.customUrlQueryData];
    
    if (umkmData) {
      this.setData({
        umkmData,
        templateId: (umkmData.templates && umkmData.templates.index && umkmData.templates.index.id) || 1
      });
    }
  },
  onShow() {
    this.refreshCart();
  },
  refreshCart() {
    const app = getApp();
    const cart = app.globalData.cart;
    const totalCartPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    this.setData({
      cart,
      totalCartPrice,
      cartCount
    });
  },
  handleProductTap(productData) {
    customNavigateTo({
      url: "/src/app/pages/package_umkm/detail-umkm/detail-umkm",
      data: {
        productData,
        umkmData: this.data.umkmData
      }
    });
  },
  handleAddToCart(item) {
    const app = getApp();
    app.addToCart(item, this.data.umkmData);
    this.refreshCart();
    my.showToast({
      content: 'Berhasil ditambah ke keranjang',
      type: 'success',
      duration: 1000
    });
  },
  handleCheckout() {
    if (this.data.cartCount === 0) return;
    
    customNavigateTo({
      url: "/src/app/pages/cart-checkout/cart-checkout",
      data: {
        orderType: "UMKM",
        serviceId: this.data.umkmData.id,
        serviceName: this.data.umkmData.name,
        totalAmount: this.data.totalCartPrice,
        cart: this.data.cart,
        merchantInfo: this.data.umkmData
      }
    });
  }
});
