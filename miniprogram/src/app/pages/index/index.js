import {
  getJavaJazzLandingData,
  getJavaJazzPendingOrder
} from "/src/public/api"
import {
  currencyFormat
} from "/src/utils/currency-util";
import {
  firebaseEvent,
  firebaseScreenView
} from "/src/utils/firebaseTracker";
import {
  customNavigateTo
} from "/src/utils/route-util";
import generalError from "/src/utils/generalError";
import getNetWork from "/src/utils/getNetWork";

/* JShield-obfus:enable */
Page({
  data: {
    isExpanded: Boolean(false),
    isExpandInfo: Boolean(false),
    currentInfo: Number(0),
    currentPoster: Number(0),
    isFullscreen: Boolean(false),
    isLoading: Boolean(false),
    imageFullScreen: String(''),
    ticketDataList: Array(),
    ticketData: Object({}),
    lang: Object({}),
    templateId: 1
  },

  onLoad(query) {
    const {
      id,
    } = my.customUrlQueryData[query.customUrlQueryData];
    this.setData({
      eventId: id
    })
    this.getPendingOrder()
    // firebaseScreenView("javaJazzFestivalLandingPageScreen", "javaJazzFestivalLandingPageScreen")
  },
  onReady() {
    // Mock language pack if missing
    const app = getApp();
    const lang = (app.globalData && app.globalData.languagePack) || {
      lifestyleJavaJazzFestivalLandingScreenHeaderTitleLabel: "Wondr Event",
      lifestyleJavaJazzFestivalLandingScreenCloseEventDescLabel: "Close",
      lifestyleJavaJazzFestivalLandingScreenOpenEventDescLabel: "Read More",
      lifestyleJavaJazzFestivalLandingScreenChooseTicketLabel: "Choose Ticket",
      lifestyleJavaJazzFestivalLandingScreenPromoLabel: "Promo",
      lifestyleJavaJazzFestivalLandingScreenAmountStartFromLabel: "Starts from",
      lifestyleJavaJazzFestivalLandingScreenInfoSectionTitleLabel: "Info",
      lifestyleJavaJazzFestivalLandingScreenTermsCondition1Label: "By buying this ticket, you agree to",
      lifestyleJavaJazzFestivalLandingScreenTermsCondition2Label: "Terms & Conditions",
      lifestyleJavaJazzFestivalLandingScreenTermsCondition3Label: "applied.",
      lifestyleJavaJazzFestivalLandingScreenMuatUlangTitleLabel: "Failed to load",
      lifestyleJavaJazzFestivalLandingScreenMuatUlangDescLabel: "Please try again"
    }

    this.setData({
      lang
    })
  },

  onShow() {
    my.call("enableSwipe", {
      isSwipe: false
    }, () => {});
    getNetWork();
  },

  isExpanded() {
    if (!this.data.isExpanded) {
      firebaseEvent('javaJazzFestivalLandingPageScreen', 'AppClick', 'click_deskripsi_acara_landing_page')
    } else {
      firebaseEvent('javaJazzFestivalLandingPageScreen', 'AppClick', 'click_tutup_acara_landing_page')
    }
    this.setData({
      isExpanded: !this.data.isExpanded
    })
  },

  isExpandInfo() {
    this.setData({
      isExpandInfo: !this.data.isExpandInfo
    })
  },
  indicatorPromo(event) {
    const target = event.target;
    this.setData({
      currentInfo: +target.dataset.index,
    });
  },

  onSwipeChangePromo(event) {
    this.setData({
      currentInfo: event.detail.current,
    });
  },

  indicatorPoster(event) {
    const target = event.target;
    this.setData({
      currentPoster: +target.dataset.index,
    });
  },
  onSwipeChangePoster(event) {
    this.setData({
      currentPoster: event.detail.current,
    });
  },
  popupPromo(eventOrData) {
    let imageFullScreen;
    if (eventOrData && eventOrData.target && eventOrData.target.dataset) {
      imageFullScreen = eventOrData.target.dataset.image;
    } else {
      imageFullScreen = eventOrData;
    }

    this.setData({
      isFullscreen: true,
      imageFullScreen
    });
  },
  popupPromoClose() {
    this.setData({
      isFullscreen: false,
    });
  },

  async getLandingData() {
    this.setData({
      isLoading: true
    })

    const app = getApp();
    const idPartner = this.data.eventId

    await getJavaJazzLandingData(idPartner)
      .then(res => {
        console.log(res, "res");
        const dataResponse = res.data.dataProtected

        const detailEvent = dataResponse.detailEvent
        const ticketCategories = dataResponse.ticketCategories
        app.globalData.eventTitle = detailEvent.eventName
        // Normalize banner to array
        if (detailEvent.bannerUrls && Array.isArray(detailEvent.bannerUrls)) {
          detailEvent.banner = detailEvent.bannerUrls;
        } else if (detailEvent.bannerUrl) {
          detailEvent.banner = [detailEvent.bannerUrl];
        } else if (!detailEvent.banner) {
          detailEvent.banner = [];
        }

        // Parse socials if string
        if (typeof detailEvent.socials === 'string') {
          try {
            detailEvent.socials = JSON.parse(detailEvent.socials);
          } catch (e) {
            console.error('Failed to parse socials', e);
            detailEvent.socials = {};
          }
        }

        ticketCategories.map((ticket) => {
          const priceStr = currencyFormat({
            value: ticket.price || ticket.startFrom
          });

          ticket.priceFormatted = priceStr;
          ticket.formatPriceTaxService = priceStr;

          if (ticket.normalPrice && ticket.normalPrice > (ticket.price || ticket.startFrom)) {
            ticket.normalPriceFormatted = currencyFormat({
              value: ticket.normalPrice
            });
          }

          // Legacy support
          ticket.price = priceStr;
        })

        this.setData({
          detailEvent,
          ticketDataList: ticketCategories,
          templateId: (detailEvent.templates && detailEvent.templates.index && detailEvent.templates.index.id) || detailEvent.templateId || 1,
          isLoading: false,
          successFetch: true
        })

      })
      .catch((error) => {

        this.setData({
          isLoading: false,
          successFetch: false
        })

        generalError({
          err: error,
          isSwipe: true,
        })
      })
  },

  async getPendingOrder() {
    this.setData({
      isLoading: true
    })

    await getJavaJazzPendingOrder()
      .then(response => {

        console.log(response);
        if (response.statusCode === 200 || response.status === 200) {

          const dataResponse = response.data.dataProtected

          customNavigateTo({
            url: "/src/app/package_transaction/pages/gather-screen-va/gather-screen-va",
            data: {
              personalData: dataResponse.personalData,
              priceCount: dataResponse.priceCount,
              ticketCount: dataResponse.ticketCount,
              selectedTicket: dataResponse.ticketList,
              ticketList: dataResponse.ticketList,
              orderData: dataResponse.orderData
            }
          })

        } else if (response.statusCode === 204 || response.status === 204) {
          this.getLandingData()
        } else {
          this.setData({
            isLoading: false,
            successFetch: false
          })
        }
      })
      .catch((error) => {
        this.setData({
          isLoading: false,
          successFetch: false
        })

        generalError({
          err: error,
          isSwipe: true,
        })
      })
  },
  goToTnc() {
    firebaseEvent('javaJazzFestivalLandingPageScreen', 'AppClick', 'click_snk_acara_landing_page')
    customNavigateTo({
      url: "/src/app/pages/tnc-details/tnc-details",
      data: {
        transactionType: 'javajazz-festival'
      },
    });
  },
  goToTicketList(eventOrData) {
    let ticketData;
    if (eventOrData && eventOrData.target && eventOrData.target.dataset) {
      ticketData = eventOrData.target.dataset.ticketData;
    } else {
      ticketData = eventOrData;
    }

    const eventDetail = this.data.detailEvent

    let url = "/src/app/pages/book-ticket/book-ticket";

    customNavigateTo({
      url: url,
      data: {
        ticketData,
        eventDetail
      },
    });
  },
  openMap() {
    // my.call("openURL", {
    //   url:  this.data.detailEvent.locationUrl
    // }, () => {})
  }
});
/* JShield-obfus:disable */