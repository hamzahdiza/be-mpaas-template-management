import { customNavigateTo } from "/src/utils/route-util";

Page({
  data: {
    culinaryData: {},
    templateId: 1,
    cart: [],
    totalCartPrice: 0,
    cartCount: 0
  },
  onLoad(query) {
    const { culinaryData } = my.customUrlQueryData[query.customUrlQueryData];
    if (culinaryData) {
      this.setData({
        culinaryData,
        templateId: (culinaryData.templates && culinaryData.templates.index && culinaryData.templates.index.id) || 1,
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
  goToMenuDetail(menuData) {
    customNavigateTo({
      url: "/src/app/pages/package_culinary/detail-culinary/detail-culinary",
      data: {
        menuData,
        culinaryData: this.data.culinaryData,
      },
    });
  },
  handleAddToCart(item) {
    const app = getApp();
    app.addToCart(item, this.data.culinaryData);
    this.refreshCart();
    my.showToast({
      content: 'Berhasil ditambah ke keranjang',
      type: 'success',
      duration: 1000
    });
  },
  goToCheckout() {
    if (this.data.cartCount === 0) return;
    
    customNavigateTo({
      url: "/src/app/pages/cart-checkout/cart-checkout",
      data: {
        orderType: "CULINARY",
        serviceId: this.data.culinaryData.id,
        serviceName: this.data.culinaryData.name,
        totalAmount: this.data.totalCartPrice,
        cart: this.data.cart,
        merchantInfo: this.data.culinaryData
      }
    });
  }
});
