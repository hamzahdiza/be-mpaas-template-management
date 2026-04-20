import { customNavigateTo } from "/src/utils/route-util";

Page({
  data: {
    hotelData: {},
    templateId: 1
  },
  onLoad(query) {
    const { hotelData } = my.customUrlQueryData[query.customUrlQueryData];
    
    if (hotelData) {
      this.setData({
        hotelData,
        templateId: hotelData.templates.index.id || 1
      });
    }
  },
  goToRoomDetail(roomData) {
    customNavigateTo({
      url: "/src/app/pages/package_hotel/detail-hotel/detail-hotel",
      data: { 
        roomData,
        hotelData: this.data.hotelData 
      }
    });
    // my.navigateTo({
    //   url: '/src/app/pages/package_hotel/detail-hotel/detail-hotel',
    //   data: { 
    //     roomData,
    //     hotelData: this.data.hotelData 
    //   }
    // });
  }
});