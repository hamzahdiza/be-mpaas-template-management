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
  handleBooking() {
    // Logika lanjut ke flow pembayaran BNI
    my.showToast({ content: 'Melanjutkan ke Pembayaran...' });
  }
});