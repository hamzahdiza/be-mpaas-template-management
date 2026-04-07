import { createServiceOrder } from "/src/public/api";

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
    try {
      const menu = this.data.menuData || {};
      const culinary = this.data.culinaryData || {};
      await createServiceOrder({
        orderType: culinary.category || "cafe",
        serviceId: culinary.id,
        customerName: "User Miniprogram",
        customerPhone: "-",
        notes: `Pesanan menu ${menu.name || "-"}`,
        quantity: 1,
        totalAmount: Number(menu.pricePerNight || menu.price || 0),
        orderPayload: {
          menuId: menu.id,
          menuName: menu.name,
          vendorType: culinary.category,
        },
      });
      my.showToast({ content: "Pesanan berhasil dikirim" });
    } catch (e) {
      my.showToast({ content: "Gagal kirim pesanan" });
    }
  },
});
