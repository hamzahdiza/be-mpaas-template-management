import { customNavigateTo } from "/src/utils/route-util";

Page({
  data: {
    vehicleData: {},
    rentalData: {}
  },
  onLoad(query) {
    const mark = query.customUrlQueryData;
    const data = my.customUrlQueryData[mark];
    
    if (data) {
      this.setData({
        vehicleData: data.vehicleData,
        rentalData: data.rentalData
      });
    }
  },
  onBack() {
    my.navigateBack();
  },
  onRentNow() {
    const app = getApp();
    const item = {
      id: this.data.vehicleData.id,
      name: this.data.vehicleData.name,
      price: this.data.vehicleData.pricePerDay,
      quantity: 1,
      image: this.data.vehicleData.imageUrl,
      type: 'rental',
      merchantName: this.data.rentalData.name
    };
    
    // Use global cart logic
    app.addToCart(item, this.data.rentalData);
    
    customNavigateTo({
      url: "/src/app/pages/cart-checkout/cart-checkout",
      data: {
        orderType: "rental",
        serviceId: this.data.rentalData.id,
        serviceName: this.data.rentalData.name,
        totalAmount: this.data.vehicleData.pricePerDay,
        quantity: 1,
        cart: [item],
        merchantInfo: this.data.rentalData
      }
    });
  }
});
