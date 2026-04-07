import { createServiceOrder } from "/src/public/api";

Page({
  data: {
    roomData: {},
    hotelData: {},
    templateId: 1
  },
  onLoad(query) {
    // Menangkap data yang dikirim dari Index via customUrlQueryData
    const { roomData, hotelData } = my.customUrlQueryData[query.customUrlQueryData];
    
    this.setData({
      roomData,
      hotelData,
      // Menggunakan ID dari hotelDetail untuk menentukan template
      templateId: hotelData.templates.hotelDetail.id || 1
    });
  },
  onBackToIndex() {
    my.navigateBack();
  },
  async handleBooking() {
    try {
      const room = this.data.roomData || {};
      const hotel = this.data.hotelData || {};
      const totalAmount = Number(room.pricePerNight || room.price || 0);

      await createServiceOrder({
        orderType: "hotel",
        serviceId: hotel.id,
        customerName: "User Miniprogram",
        customerPhone: "-",
        notes: `Booking kamar ${room.roomType || room.name || "Hotel Room"}`,
        quantity: 1,
        totalAmount,
        orderPayload: {
          roomId: room.id,
          roomType: room.roomType || room.name,
          checkInDate: room.checkInDate || null,
          checkOutDate: room.checkOutDate || null
        }
      });

      my.showToast({ content: "Pesanan hotel berhasil dikirim" });
    } catch (e) {
      my.showToast({ content: "Gagal kirim pesanan hotel" });
    }
  }
});
