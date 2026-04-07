import { getAllCafes, getAllRestaurants } from "/src/public/api";
import { currencyFormat } from "/src/utils/currency-util";
import { customNavigateTo } from "/src/utils/route-util";
import generalError from "/src/utils/generalError";
import getNetWork from "/src/utils/getNetWork";

Page({
  data: {
    activeTab: "cafe",
    cafeList: [],
    restaurantList: [],
    isLoading: true,
    successFetch: false,
  },

  onLoad(query) {
    const payload = (query && query.customUrlQueryData && my.customUrlQueryData[query.customUrlQueryData]) || {};
    if (payload.category) {
      this.setData({ activeTab: payload.category === "restaurant" ? "restaurant" : "cafe" });
    }
    this.fetchCulinary();
  },

  onShow() {
    getNetWork();
    my.call("hideAppBar");
  },

  async fetchCulinary() {
    this.setData({ isLoading: true, successFetch: false });
    try {
      const [cafesRes, restaurantsRes] = await Promise.all([getAllCafes(), getAllRestaurants()]);
      const cafes = (cafesRes.data && cafesRes.data.data) || [];
      const restaurants = (restaurantsRes.data && restaurantsRes.data.data) || [];

      const normalize = (item, category) => {
        const firstMenu = (item.menuItems && item.menuItems[0]) || {};
        return {
          ...item,
          category,
          templateId: (item.templates && item.templates.index && item.templates.index.id) || 1,
          bannerUrl: item.bannerUrl || (item.images && item.images[0]) || "",
          formattedPrice: currencyFormat({ value: firstMenu.price || item.priceRangeMin || 0 }),
        };
      };

      this.setData({
        cafeList: cafes.map((i) => normalize(i, "cafe")),
        restaurantList: restaurants.map((i) => normalize(i, "restaurant")),
        successFetch: true,
        isLoading: false,
      });
    } catch (error) {
      this.setData({ isLoading: false, successFetch: false });
      generalError({ err: error, isSwipe: true });
    }
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  goToDetail(e) {
    const { id, category } = e.currentTarget.dataset;
    const list = category === "cafe" ? this.data.cafeList : this.data.restaurantList;
    const selected = list.find((item) => item.id === id);
    if (!selected) return;

    const menuItems = (selected.menuItems || []).map((menu) => ({
      id: menu.id,
      name: menu.name,
      roomType: category === "cafe" ? "Menu Cafe" : "Menu Restoran",
      pricePerNight: Number(menu.price || 0),
      capacity: 1,
      images: [menu.imageUrl || selected.bannerUrl],
      description: menu.description || "",
    }));

    customNavigateTo({
      url: "/src/app/pages/package_culinary/index/index",
      data: {
        culinaryData: {
          ...selected,
          starRating: 5,
          categories: menuItems,
          typeLabel: category === "cafe" ? "Cafe" : "Restoran",
        },
      },
    });
  },

  onGoBack() {
    my.navigateBack();
  },
});
