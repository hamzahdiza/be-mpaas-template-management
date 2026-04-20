import { getAllHotels } from "/src/public/api";
import { currencyFormat } from "/src/utils/currency-util";
import { customNavigateTo } from "/src/utils/route-util";
import generalError from "/src/utils/generalError";
import getNetWork from "/src/utils/getNetWork";

Page({
  data: {
    hotelList: [],
    isLoading: true,
    successFetch: false,
    lang: {},
  },

  onLoad() {
    this.fetchHotels();
  },

  onShow() {
    getNetWork();
    my.call("hideAppBar"); // Mengikuti style landing yang custom bar
  },

  async fetchHotels() {
    this.setData({ isLoading: true });
    try {
      // Mocking call ke /lifestyle/v1/all-hotels
      const res = await getAllHotels();
      if (res.data && res.data.statusCode === 200) {
        console.log(res.data.data, "<<< res list hotel");
        const formattedHotels = res.data.data.map(hotel => {
          // Ambil harga terendah dari categories
          const prices = hotel.categories.map(c => c.pricePerNight);
          const startPrice = Math.min(...prices);
          
          return {
            ...hotel,
            templateId: hotel.templates.index.id,
            formattedPrice: currencyFormat({ value: startPrice }),
            // Support star rating array untuk looping di AXML
            stars: Array.from({ length: hotel.starRating }, (_, i) => i)
          };
        });
        
        // console.log(formattedHotels, "<<< hotel");
        this.setData({
          hotelList: formattedHotels,
          successFetch: true,
          isLoading: false
        });
      }
    } catch (error) {
      console.log(error, "<<< ERROR list hotrls");
      this.setData({ isLoading: false, successFetch: false });
      generalError({ err: error, isSwipe: true });
    }
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset;
    
    const selectedHotel = this.data.hotelList.find(hotel => hotel.id === id);
    // navigateTo({
    //   url: "/src/app/pages/package_hotel/index/index"
    // })
    if (selectedHotel) {
      customNavigateTo({
        url: "/src/app/pages/package_hotel/index/index",
        data: { 
          hotelData: selectedHotel
        }
      });
    }
  },


  onGoBack() {
    my.navigateBack();
  }
});