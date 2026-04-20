import { customNavigateTo } from "/src/utils/route-util";

Page({
  data: {
    productData: {},
    umkmData: {},
    quantity: 1
  },
  onLoad(query) {
    const mark = query.customUrlQueryData;
    const data = my.customUrlQueryData[mark];
    
    if (data) {
      this.setData({
        productData: data.productData,
        umkmData: data.umkmData
      });
    }
  },
  onBack() {
    my.navigateBack();
  },
  onDecrease() {
    if (this.data.quantity > 1) {
      this.setData({ quantity: this.data.quantity - 1 });
    }
  },
  onIncrease() {
    this.setData({ quantity: this.data.quantity + 1 });
  },
  onAddToCart() {
    const app = getApp();
    const item = {
      id: this.data.productData.id,
      name: this.data.productData.name,
      price: this.data.productData.price,
      quantity: this.data.quantity,
      image: this.data.productData.imageUrl,
      type: 'umkm',
      merchantName: this.data.umkmData.name
    };
    
    app.addToCart(item, this.data.umkmData);
    
    my.showToast({
      type: 'success',
      content: 'Added to cart',
      duration: 1500
    });
    
    setTimeout(() => {
      my.navigateBack();
    }, 1500);
  }
});
