import { getTransactionHistory } from "/src/public/api";
import { currencyFormat } from "/src/utils/currency-util";
import { dateFormatTimeStamp } from "/src/utils/date-util";

Page({
  data: {
    isLoading: true,
    transactions: [],
    statusLabels: {
      'pending': 'Menunggu Pembayaran',
      'accepted': 'Dibayar (Diproses)',
      'rejected': 'Dibatalkan',
      'completed': 'Selesai',
      'preparing': 'Sedang Disiapkan',
      'ready': 'Makanan Siap',
      'ready_to_pick': 'Siap Diambil',
      'searching_driver': 'Mencari Driver',
      'driver_found': 'Driver Ditemukan',
      'delivering': 'Sedang Diantar'
    }
  },

  onLoad() {
    this.fetchHistory();
  },

  onPullDownRefresh() {
    this.fetchHistory(() => {
      my.stopPullDownRefresh();
    });
  },

  async fetchHistory(callback) {
    this.setData({ isLoading: true });
    try {
      // Ambil phone dari global data atau storage
      // Biasanya diisi saat visitor input data
      const personalData = getApp().globalData.personalData || my.getStorageSync({ key: 'personalData' }).data;
      const customerPhone = personalData.phone;

      const res = await getTransactionHistory({ customerPhone });
      if (res && res.data && res.data.data) {
        const formatted = res.data.data.map(item => ({
          ...item,
          formattedAmount: currencyFormat({ value: item.totalAmount, currency: 'IDR' }),
          formattedDate: dateFormatTimeStamp(item.createdAt, "DD MMM YYYY, HH:mm"),
          displayStatus: this.data.statusLabels[item.status] || item.status,
          categoryIcon: this.getIcon(item.orderType)
        }));
        this.setData({ transactions: formatted });
      }
    } catch (err) {
      console.error("Failed to fetch transaction history:", err);
      my.showToast({ content: 'Gagal memuat riwayat' });
    } finally {
      this.setData({ isLoading: false });
      if (callback) callback();
    }
  },

  getIcon(type) {
    switch(type) {
      case 'event': return '🎟️';
      case 'hotel': return '🏨';
      case 'cafe':
      case 'restaurant': return '🍴';
      default: return '📦';
    }
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset;
    // Implementasi detail jika diperlukan nanti
    my.showToast({ content: 'Detail untuk ID: ' + id });
  }
});
