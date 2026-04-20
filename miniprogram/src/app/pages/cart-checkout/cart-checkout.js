import { createServiceOrder } from "../../../public/api";
import { customNavigateTo } from "/src/utils/route-util";

Page({
  data: {
    orderType: "",
    serviceId: "",
    serviceName: "",
    customerName: "User Miniprogram",
    customerPhone: "081234567890",
    totalAmount: 0,
    quantity: 1,
    orderPayload: {},
    notes: "",
    isLoading: false,
    personalData: {},
    cart: [],
    merchantInfo: {}
  },

  onLoad(query) {
    const mark = query.customUrlQueryData;
    const data = my.customUrlQueryData[mark];
    
    if (data) {
      this.setData({
        orderType: data.orderType,
        serviceId: data.serviceId,
        serviceName: data.serviceName,
        customerName: data.customerName || "User Miniprogram",
        customerPhone: data.customerPhone || "081234567890",
        totalAmount: data.totalAmount,
        quantity: data.quantity || 1,
        orderPayload: data.orderPayload || {},
        notes: data.notes || "",
        personalData: data.personalData || {},
        cart: data.cart || [],
        merchantInfo: data.merchantInfo || {}
      });
    }
  },

  onBack() {
    my.navigateBack();
  },

  onIncrease(e) {
    const { index } = e.currentTarget.dataset;
    const { cart } = this.data;
    cart[index].quantity += 1;
    this.recalculateTotal(cart);
  },

  onDecrease(e) {
    const { index } = e.currentTarget.dataset;
    const { cart } = this.data;
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      this.recalculateTotal(cart);
    }
  },

  onRemove(e) {
    const { index } = e.currentTarget.dataset;
    const { cart } = this.data;
    cart.splice(index, 1);
    this.recalculateTotal(cart);
  },

  recalculateTotal(cart) {
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.setData({ cart, totalAmount });
    
    // Update global cart state as well
    const app = getApp();
    app.globalData.cart = cart;
  },

  async handlePayment() {
    this.setData({ isLoading: true });
    
    try {
      // Simpan personal data ke storage agar bisa dibaca di halaman Riwayat
      my.setStorageSync({ 
        key: 'personalData', 
        data: { 
          fullName: this.data.customerName, 
          phone: this.data.customerPhone 
        } 
      });

      const posContext = {
        orderType: this.data.orderType,
        serviceId: this.data.serviceId,
        serviceName: this.data.serviceName,
        customerName: this.data.customerName,
        customerPhone: this.data.customerPhone,
        notes: this.data.notes,
        quantity: this.data.quantity,
        totalAmount: this.data.totalAmount,
        orderPayload: this.data.orderPayload
      };

      // TUNDA pembuatan order. Hanya kirim data sebagai context untuk result-screen
      const checkoutData = {
        priceCount: {
          value: this.data.totalAmount,
          formatted: this.data.totalAmount.toLocaleString('id-ID')
        },
        personalData: {
          fullName: this.data.customerName,
          phone: this.data.customerPhone
        },
        ticketList: [{
          title: this.data.notes,
          amount: this.data.totalAmount,
          totalDetailTicket: this.data.quantity
        }],
        ticketCount: this.data.quantity,
        orderData: {
          orderId: "PENDING-VA", // ID sementara sebelum dibayar
          serviceName: this.data.serviceName,
          orderType: this.data.orderType
        },
        posContext // Sertakan data order untuk diproses di result-screen
      };

      // Set global total price for gather-screen-va
      getApp().globalData.totalPriceGlobal = this.data.totalAmount;
      getApp().globalData.eventTitle = this.data.serviceName;

      // Clear cart after proceeding to payment
      getApp().clearCart();

      customNavigateTo({
        url: "/src/app/package_transaction/pages/gather-screen-va/gather-screen-va",
        data: checkoutData
      });
    } catch (err) {
      console.error("Internal POS Context Error:", err);
      my.showToast({
        type: 'fail',
        content: 'Gagal memproses data pembayaran'
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  onBack() {
    my.navigateBack();
  }
});
