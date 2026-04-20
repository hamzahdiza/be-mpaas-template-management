const { customNavigateTo } = require("/src/utils/route-util");

Page({
  data: {
    menuData: {},
    culinaryData: {},
    templateId: 1,
  },
  onLoad(query) {
    const { menuData, culinaryData } = my.customUrlQueryData[query.customUrlQueryData];
    this.setData({
      menuData,
      culinaryData,
      templateId: (culinaryData.templates && culinaryData.templates.detail && culinaryData.templates.detail.id) || 1,
    });
  },
  onBackToIndex() {
    my.navigateBack();
  },
  async handleBooking() {
    const menu = this.data.menuData || {};
    const culinary = this.data.culinaryData || {};

    const app = getApp();
    app.addToCart(menu, culinary);

    my.showToast({
      content: 'Berhasil ditambah ke keranjang',
      type: 'success',
      duration: 1000,
      success: () => {
        setTimeout(() => {
          my.navigateBack();
        }, 1000);
      }
    });
  },
});
