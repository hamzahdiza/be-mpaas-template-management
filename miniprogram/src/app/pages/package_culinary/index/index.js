import { customNavigateTo } from "/src/utils/route-util";

Page({
  data: {
    culinaryData: {},
    templateId: 1,
  },
  onLoad(query) {
    const { culinaryData } = my.customUrlQueryData[query.customUrlQueryData];
    if (culinaryData) {
      this.setData({
        culinaryData,
        templateId: (culinaryData.templates && culinaryData.templates.index && culinaryData.templates.index.id) || 1,
      });
    }
  },
  goToMenuDetail(menuData) {
    customNavigateTo({
      url: "/src/app/pages/package_culinary/detail-culinary/detail-culinary",
      data: {
        menuData,
        culinaryData: this.data.culinaryData,
      },
    });
  },
});
