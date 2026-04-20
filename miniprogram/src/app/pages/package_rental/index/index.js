import { customNavigateTo } from "/src/utils/route-util";

Page({
  data: {
    rentalData: {},
    templateId: 1
  },
  onLoad(query) {
    const { rentalData } = my.customUrlQueryData[query.customUrlQueryData];
    
    if (rentalData) {
      this.setData({
        rentalData,
        templateId: (rentalData.templates && rentalData.templates.index && rentalData.templates.index.id) || 1
      });
    }
  },
  handleVehicleTap(vehicleData) {
    customNavigateTo({
      url: "/src/app/pages/package_rental/detail-rental/detail-rental",
      data: {
        vehicleData,
        rentalData: this.data.rentalData
      }
    });
  }
});
