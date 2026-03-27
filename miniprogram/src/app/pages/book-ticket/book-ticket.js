import {
  currencyFormat
} from "/src/utils/currency-util"
import {
  dateFormat,
  formatDateTreeDays
} from "/src/utils/date-util";
import {
  getListTicket,
  getPersonalData
} from "/src/public/api"
import {
  customNavigateTo
} from "/src/utils/route-util";
import generalError from "/src/utils/generalError";
import {
  firebaseEvent,
  firebaseScreenView
} from "/src/utils/firebaseTracker";

/* JShield-obfus:enable */
Page({
  data: {
    lang: Object(),
    resize: Boolean(),
    dataTicket: Array(),
    count: Number(0),
    totalAmount: Number(0),
    totalPrice: Number(0),
    totalTicket: Number(),
    ticketBuy: Array(),
    isCopyTriggered: Boolean(false),
    tabActive: Number(0),
    isLoading: Boolean(false),
    showTab: Boolean(true),
    ticketData: Object({}),
    eventDetail: Object({}),
    errorApi: Boolean(),
    tabFilter: Array()
  },

  onLoad(query) {
    firebaseScreenView("javaJazzFestivalListTicketScreen", "javaJazzFestivalListTicketScreen")
    const lang = getApp().globalData.languagePack;
    const {
      ticketData,
      eventDetail
    } = my.customUrlQueryData[query.customUrlQueryData];
    this.setData({
      ticketData,
      eventDetail,
      templateId: (eventDetail.templates && eventDetail.templates.bookTicket) || eventDetail.templateId || 1
    })

    this.setData({
      lang,
      tabFilter: [{
        title: lang.javaJazzFestivalListTicketScreenCategoryPromoLabel
      },
      {
        title: lang.javaJazzFestivalListTicketScreenCategoryRegularLabel
      }
      ]
    })
    this.getDataTicket()
  },

  async getDataTicket() {
    try {
      this.setData({
        isLoading: true,
      })
      const headers = {
        "Screen-Id": "javaJazzFestivalListTicketScreen",
      }
      const params = this.data.ticketData.id
      let dataPromoList = []
      let dataRegulerList = []
      console.log(this.data.ticketData,"CACAC");
      const res = await getListTicket(params, headers);
      const decryptData = res.data.dataProtected
      const {
        validation,
        promoList,
        regulerList
      } = decryptData;

      const dataListTicket = {
        validation,
        promoList,
        regulerList
      }

      const maxOrderMap = validation.reduce((map, {
        ticketIdList,
        maxOrder
      }) => {
        ticketIdList.forEach(ticketId => {
          map[ticketId] = maxOrder;
        });
        return map;
      }, {});

      if (promoList.length > 0) {
        dataPromoList = this.formaterDataTicket(promoList, maxOrderMap)
      } else {
        this.setData({
          tabActive: 1,
          showTab: false
        })
      }

      if (regulerList.length > 0) {
        dataRegulerList = this.formaterDataTicket(regulerList, maxOrderMap)
      } else {
        this.setData({
          showTab: false
        })
      }
console.log(dataRegulerList,"<AS");
      this.setData({
        dataPromoList,
        dataRegulerList,
        dataListTicket,
        typeTicket: dataRegulerList[0].type || undefined,
        isLoading: false
      })

    } catch (err) {
      this.setData({
        isLoading: false
      })
console.log(err,"<<<<<err");
      generalError({
        err,
        isSwipe: true,
      })
    }

  },

  formatTicketDate(item) {
    const locale = getApp().globalData.dayjsLocale;

    if (item.category === 'three_days_pass') {
      return locale === 'id' ? formatDateTreeDays(item.ticketDate) :
        locale === 'en' ? item.ticketDate :
          dateFormat(item.ticketDate, "dddd, DD MMM YYYY", locale);
    }

    return dateFormat(item.ticketDate, "dddd, DD MMM YYYY", locale);
  },

  formaterDataTicket(data, maxOrderMap) {
    return data.map(item => {
      const formattedTicketDate = this.formatTicketDate(item);
      console.log(item.priceTaxService);
      const formattedPrice = currencyFormat({
        value: item.priceTaxService
      });
      const formattedOldPrice = item.oldPrice > 0 ? currencyFormat({
        value: item.oldPrice
      }) : undefined;

      return {
        ...item,
        formatedTicketDate: formattedTicketDate,
        formatPriceTaxService: formattedPrice,
        count: 0,
        total: 0,
        oldPriceFormat: formattedOldPrice,
        maxOrder: maxOrderMap[item.ticketId] || null,
      };
    });
  },

  handleResize() {
    this.setData({
      resize: !this.data.resize
    })
  },

  handleRemove(e) {
    const {
      count,
      amount,
      type,
      ticketId,
      countAdd
    } = e.currentTarget.dataset;

    const {
      dataPromoList,
      dataRegulerList,
      ticketBuy,
      totalTicket,
      totalAmount,
      typeTicket,
      dataListTicket
    } = this.data;

    const ticketList = type === typeTicket ? dataRegulerList : dataPromoList;

    const updatedTicketList = ticketList.map(item =>
      item.ticketId === ticketId
        ? {
          ...item,
          count: count - 1,
          total: item.total - countAdd,
        }
        : item
    );

    const updatedTicketBuy = ticketBuy
      .map(ticket =>
        ticket.ticketId === ticketId
          ? {
            ...ticket,
            total: ticket.total - countAdd,
            totalPrice: ticket.totalPrice - amount,
            orderAdd: count - 1,
          }
          : ticket
      )
      .filter(ticket => ticket.total > 0);

    const newTotalAmount = totalAmount - amount;

    const formattedTicketBuy = updatedTicketBuy.map(ticket => ({
      ...ticket,
      formatPrice: currencyFormat({
        value: ticket.price
      }),
    }));

    const tempDataListTicket = { ...dataListTicket };

    const validationItem = tempDataListTicket.validation.find(item =>
      item.ticketIdList.includes(ticketId)
    );

    if (validationItem) {
      if (!validationItem.tickets) {
        validationItem.tickets = [];
      }

      const existingTicketIndex = validationItem.tickets.findIndex(
        ticket => ticket.ticketId === ticketId
      );
      validationItem.maxOrder = (validationItem.maxOrder || 0) + 1;

      const updatedTicketData = updatedTicketBuy.find(ticket => ticket.ticketId === ticketId);

      if (existingTicketIndex !== -1) {
        if (updatedTicketData) {
          validationItem.tickets[existingTicketIndex] = { ...updatedTicketData };
          validationItem.tickets = validationItem.tickets.map(item => ({
            ...item,
            maxOrder: validationItem.maxOrder
          }));
        } else {
          validationItem.tickets.splice(existingTicketIndex, 1);
        }
      }
    }
    this.setData({
      [type === typeTicket ? 'dataRegulerList' : 'dataPromoList']: updatedTicketList,
      totalTicket: totalTicket - countAdd,
      totalPrice: currencyFormat({
        value: newTotalAmount,
        currency: "IDR",
        isPrefix: false
      }),
      totalAmount: newTotalAmount,
      ticketBuy: formattedTicketBuy,
      dataListTicket: tempDataListTicket
    });


    const updateDataRegulerList = this.data.dataRegulerList.map(item => {
      const validationData = tempDataListTicket.validation.find(data =>
        data.ticketIdList.includes(item.ticketId)
      );
      return validationData ? { ...item, maxOrder: validationData.maxOrder } : item;
    });
    const updateDataPromoList = this.data.dataPromoList.map(item => {
      const validationData = tempDataListTicket.validation.find(data =>
        data.ticketIdList.includes(item.ticketId)
      );

      return validationData ? { ...item, maxOrder: validationData.maxOrder } : item;
    });

    this.setData({
      dataRegulerList: updateDataRegulerList,
      dataPromoList: updateDataPromoList
    });
  },

  handlePlus(e) {
    const { count, amount, title, type, ticketId, countAdd } = e.currentTarget.dataset;
    const {
      dataPromoList,
      dataRegulerList,
      ticketBuy,
      totalTicket,
      totalAmount,
      typeTicket,
      dataListTicket,
      eventDetail
    } = this.data;

    const tempDataListTicket = { ...dataListTicket };

    const purchaseMode = (eventDetail && (eventDetail.vendorConfig && eventDetail.vendorConfig.purchaseMode)) || eventDetail.purchaseMode || 'multiple';
    if (purchaseMode === 'single' && totalTicket >= 1) {
      return;
    }

    const ticketList = type === typeTicket ? dataRegulerList : dataPromoList;
    const targetTicket = ticketList.find(item => item.ticketId === ticketId);

    const updatedTicketList = ticketList.map(item =>
      item.ticketId === ticketId
        ? {
          ...item,
          count: count + 1,
          total: item.total + countAdd,
        }
        : item
    );

    const updatedTicketBuy = ticketBuy.map(ticket =>
      ticket.ticketId === ticketId
        ? {
          ...ticket,
          total: ticket.total + countAdd,
          totalPrice: ticket.totalPrice + amount,
          orderAdd: count + 1,
        }
        : ticket
    );

    if (!ticketBuy.some(ticket => ticket.ticketId === ticketId)) {
      updatedTicketBuy.push({
        ...targetTicket,
        title,
        total: countAdd,
        totalPrice: amount,
        orderAdd: 1
      });
    }

    const validationItemAdd = tempDataListTicket.validation.find(item =>
      item.ticketIdList.includes(ticketId)
    );

    if (validationItemAdd) {
      if (!validationItemAdd.tickets) {
        validationItemAdd.tickets = [];
      }

      const existingTicketIndexAdd = validationItemAdd.tickets.findIndex(
        ticket => ticket.ticketId === ticketId
      );
      validationItemAdd.maxOrder = (validationItemAdd.maxOrder || 0) - 1;

      const updatedTicketData = updatedTicketBuy.find(ticket => ticket.ticketId === ticketId);

      if (existingTicketIndexAdd !== -1) {
        validationItemAdd.tickets[existingTicketIndexAdd] = { ...updatedTicketData };
        validationItemAdd.tickets = validationItemAdd.tickets.map(item => ({
          ...item,
          maxOrder: validationItemAdd.maxOrder
        }));
      } else {
        validationItemAdd.tickets.push({ ...updatedTicketData });
      }
    }

    const newTotalAmount = totalAmount + amount;

    const formattedTicketBuy = updatedTicketBuy.map(ticket => ({
      ...ticket,
      formatPrice: currencyFormat({
        value: ticket.price
      }),
    }));

    this.setData({
      [type === typeTicket ? 'dataRegulerList' : 'dataPromoList']: updatedTicketList,
      totalTicket: totalTicket + countAdd,
      totalPrice: currencyFormat({
        value: newTotalAmount,
        currency: "IDR",
        isPrefix: false
      }),
      totalAmount: newTotalAmount,
      ticketBuy: formattedTicketBuy,
      selectedTicket: tempDataListTicket.validation,
    });

    const updateDataRegulerListAdd = this.data.dataRegulerList.map(item => {
      const validationData = tempDataListTicket.validation.find(data =>
        data.ticketIdList.includes(+item.ticketId)
      );
      return validationData ? { ...item, maxOrder: validationData.maxOrder } : item;
    });
    const updateDataPromoListAdd = this.data.dataPromoList.map(item => {
      const validationData = tempDataListTicket.validation.find(data =>
        data.ticketIdList.includes(+item.ticketId)
      );
      return validationData ? { ...item, maxOrder: validationData.maxOrder } : item;
    });

    this.setData({
      dataRegulerList: updateDataRegulerListAdd,
      dataPromoList: updateDataPromoListAdd
    });

    const finalList = type === typeTicket ? updateDataRegulerListAdd : updateDataPromoListAdd;
    const targetUpdated = finalList.find(item => item.ticketId === ticketId);
    if (targetUpdated && 0 === targetUpdated.maxOrder) {
      this.setData({
        isCopyTriggered: true,
        isToastIn: true
      });
      setTimeout(() => this.setData({ isToastIn: false }), 1000);
      setTimeout(() => this.setData({ isCopyTriggered: false }), 2000);
    }
  },

  disableToast() {
    if (this.data.isCopyTriggered) {
      this.setData({
        isCopyTriggered: false,
      });
    }
  },
  handleFilter(e) {
    firebaseEvent('javaJazzFestivalListTicketScreen', 'AppClick', 'click_chip_bill_payment_java_jazz_festival')
    const {
      idx
    } = e.currentTarget.dataset
    this.setData({
      tabActive: idx,
    })
  },

  async nextPage() {
    const {
      totalAmount,
      totalTicket,
      ticketData,
      eventDetail,
      selectedTicket
    } = this.data

    getApp().globalData.totalPriceGlobal = totalAmount

    const filteredData = selectedTicket.filter(item => Object.prototype.hasOwnProperty.call(item, 'tickets'));

    filteredData.forEach(group => {
      group.total = group.tickets.reduce((sum, ticket) => sum + ticket.total, 0);
    });

    const formatFilteredData = filteredData.filter(item => item.total !== 0);

    const purchaseMode = (eventDetail && (eventDetail.vendorConfig && eventDetail.vendorConfig.purchaseMode)) || eventDetail.purchaseMode || 'multiple';

    firebaseEvent('javaJazzFestivalListTicketScreen', 'AppClick', 'click_next_bill_payment_java_jazz_festival')

    if (purchaseMode === 'single') {
      this.setData({ isLoading: true });
      try {
        const res = await getPersonalData();
        const personalData = res.data.dataProtected;

        const ticketGroup = formatFilteredData[0];
        const ticketDetail = ticketGroup.tickets[0];

        // Initialize customerTicketTemp as list screen would
        formatFilteredData.forEach(item => {
          item.customerTicketTemp = [];
          let counter = 0;
          item.customerTicketCount = 0;
          item.amount = 0;

          item.tickets.forEach(ticket => {
            item.amount += (ticket.totalPrice || 0);
            for (let index = 0; index < ticket.total; index++) {
              item.customerTicketTemp.push({
                ticketId: ticket.ticketId,
                index: counter,
                customerData: {
                  "fullName": "",
                  "idCard": "",
                  "gender": "",
                  "dob": "",
                  "citizen": "Indonesia",
                  "country": "Indonesia",
                  "statusForeign": "",
                  "postCode": "",
                }
              });
              counter++;
              item.customerTicketCount++;
            }
          });
          // Format date for display like list screen
          item.ticketDate = dateFormat(item.tickets[0].ticketDate, "DD MMM YYYY", getApp().globalData.dayjsLocale);
        });

        const navData = {
          "tickets": {
            "name": personalData.fullName,
            "email": personalData.email,
            "phone": personalData.phone,
            "gender": personalData.gender,
            "ticketId": ticketDetail.ticketId,
            "ticketQty": ticketDetail.orderAdd,
            "category": ticketDetail.category,
            "category2": ticketDetail.category2,
            "category3": ticketDetail.category3,
            "type": ticketDetail.type,
            "oldPrice": ticketDetail.oldPrice,
            "price": ticketDetail.price,
            "priceTaxService": ticketDetail.priceTaxService,
            "customerTicket": Array.from({ length: ticketGroup.total }, () => ({
              fullName: "",
              idCard: "",
              gender: "",
              dob: "",
              citizen: "Indonesia",
              country: "Indonesia",
              statusForeign: "",
              postCode: "",
              ticketName: ticketDetail.title || ticketDetail.ticketName,
              ticketDate: ticketDetail.formatedTicketDate
            })),
            ticketTotal: ticketGroup.total,
            ticketCount: totalTicket,
            ticketList: formatFilteredData.map((ticket) => ({
              title: ticket.tickets[0].title,
              "totalDetailTicket": ticket.total,
              "amount": ticket.tickets[0].totalPrice
            }))
          },
          visitorIndex: 0,
          ticketIndex: 0,
          personalData: personalData,
          autoSingleVisitor: true,
          isPersonalNikUsed: formatFilteredData.map(() => ({ toggleTabDisabled: false })),
          selectedTickets: formatFilteredData,
          eventDetail: eventDetail,
        };

        customNavigateTo({
          data: navData,
          url: '/src/app/pages/visitor-input-screen/visitor-input-screen',
        });
      } catch (err) {
        generalError({ err });
      } finally {
        this.setData({ isLoading: false });
      }
    } else {
      const data = {
        selectedTicket: formatFilteredData,
        priceCount: totalAmount,
        ticketCount: totalTicket,
        ticketData,
        eventDetail,
        autoSingleVisitor: false
      }

      customNavigateTo({
        data,
        url: '/src/app/pages/visitor-list-screen/visitor-list-screen',
      })
    }
  }

});
/* JShield-obfus:disable */
