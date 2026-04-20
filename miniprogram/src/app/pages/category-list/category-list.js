import { customNavigateTo } from "../../../utils/route-util";

Page({
  data: {
    categoryName: "",
    partnerList: [],
    lang: {},
    isLoading: false
  },

  onLoad(query) {
    const mark = query.customUrlQueryData;
    const data = my.customUrlQueryData[mark];
    
    if (data) {
      this.setData({
        categoryName: data.categoryName,
        partnerList: data.partnerList,
        lang: data.lang || {}
      });
    }
  },

  goToPartnerWebview(e) {
    const partnerSelected = e.currentTarget.dataset.selectedPartner;
    const category = partnerSelected.partnerCategory.toLowerCase();
    
    if (category === 'rental') {
      customNavigateTo({
        url: "/src/app/pages/package_rental/index/index",
        data: {
          rentalData: partnerSelected.rawMenu.rawMenu || partnerSelected.rawMenu
        }
      });
      return;
    }

    if (category === 'umkm') {
      customNavigateTo({
        url: "/src/app/pages/package_umkm/index/index",
        data: {
          umkmData: partnerSelected.rawMenu.rawMenu || partnerSelected.rawMenu
        }
      });
      return;
    }

    if (category === 'hotel') {
      customNavigateTo({
        url: "/src/app/pages/package_hotel/index/index",
        data: {
          hotelData: partnerSelected.rawMenu.rawMenu || partnerSelected.rawMenu
        }
      });
      return;
    }

    if (category === 'cafe' || category === 'restoran' || category === 'restaurant') {
      customNavigateTo({
        url: "/src/app/pages/package_culinary/index/index",
        data: {
          culinaryData: partnerSelected.rawMenu.rawMenu || partnerSelected.rawMenu
        }
      });
      return;
    }

    const partnerMenu = partnerSelected.rawMenu;
    
    my.call("getAppConfig", {
      keys: ["app.config.lifestyle.checkCasa"]
    }, (res) => {
      // Logic from landing.js
      const checkCasa = res["app.config.lifestyle.checkCasa"] || "";
      const matchingCasa = checkCasa.slice(1, -1).split(',').map(item => item.toLowerCase()).includes(partnerMenu.transactionType);

      if (partnerMenu.isUrlMicrositeStatic && partnerMenu.urlMicrosite == 'app_id') {
        const dataNative = {
          clientRelease: getApp().globalData.nativeData.clientRelease,
          clientPlatform: getApp().globalData.nativeData.clientPlatform,
          clientVersion: getApp().globalData.nativeData.clientVersion,
          userAgent: getApp().globalData.nativeData.userAgent,
          authorization: getApp().globalData.nativeData.authorization
        };

        my.navigateToMiniProgram({
          appId: partnerMenu.partnerId,
          path: '/src/app/pages/index/index',
          extraData: {
            nativeData: JSON.stringify(dataNative),
            partnerMenu: JSON.stringify(partnerMenu),
            nativeDataAndroid: dataNative,
            partnerMenuAndroid: partnerMenu,
          },
        });
      } else {
        customNavigateTo({
          url: "/src/app/pages/microsite/webview-lifestyle/webview-lifestyle",
          data: {
            partnerMenu,
            isFromLanding: true
          },
        });
      }
    });
  },

  goToNative() {
    my.navigateBack();
  },

  imageLoad(e) {
    const index = e.currentTarget.dataset.index;
    let partnerList = this.data.partnerList;
    if (partnerList[index]) {
      partnerList[index].isImageLoading = false;
      this.setData({ partnerList });
    }
  }
});
