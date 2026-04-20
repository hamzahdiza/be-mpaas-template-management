import {
  currencyFormat
} from "/src/utils/currency-util"
import {
  customNavigateTo
} from "/src/utils/route-util"
import {
  getPersonalData,
  orderTickets,
  createServiceOrder
} from "/src/public/api"
import generalError from '/src/utils/generalError'
import {
  dateFormat,
  formatDateTreeDays
} from "/src/utils/date-util"
import {
  firebaseEvent,
  firebaseScreenView
} from "/src/utils/firebaseTracker"
import {
  capitalizeTxt
} from "/src/utils/capitalize"

/* JShield-obfus:enable */
Page({
  data: {
    ticketCount: Number(2),
    orderRequest: Object({
      "tickets": []
    }),
    personalData: Object({}),
    isLoading: Boolean(true),
    isPersonalNikUsed: Boolean(false)
  },
  async onLoad(query) {
    firebaseScreenView("javaJazzFestivalListInputDataVisitorScreen", "javaJazzFestivalListInputDataVisitorScreen")

    const queryParams = my.customUrlQueryData[query.customUrlQueryData]

    const lang = getApp().globalData.languagePack
    let selectedTicket = queryParams.selectedTicket

    selectedTicket.forEach(item => {
      item.customerTicketTemp = [];
      let counter = 0;
      item.customerTicketCount = 0
      item.amount = 0

      item.tickets.forEach(ticket => {
        item.amount += ticket.totalPrice
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
          counter++; // increment counter setiap kali push
          item.customerTicketCount++
        }
      });
    });

    this.setData({
      selectedTicket: queryParams.selectedTicket.map((ticket) => {
        ticket.ticketDate = this.formatTicketDate(ticket.tickets[0])
        return ticket
      }),
      priceCount: {
        displayFormat: currencyFormat({
          value: queryParams.priceCount,
          currency: "IDR"
        }),
        value: queryParams.priceCount
      },
      ticketData: queryParams.ticketData,
      eventDetail: queryParams.eventDetail,
      orderRequest: {
        tickets: Array.from({
          length: queryParams.selectedTicket.length
        }, () => [])
      },
      ticketCount: queryParams.ticketCount,
      lang,
      templateId: (queryParams.eventDetail.templates && queryParams.eventDetail.templates.visitorList) || queryParams.eventDetail.templateId || 1,
      isPersonalNikUsed: Array.from({
        length: queryParams.selectedTicket.length
      }, () => ({
        toggleTabDisabled: false
      })),
      singleFlow: !!queryParams.autoSingleVisitor
    })
    await this.fetchPersonalData()

    // Auto open single visitor flow when vendor config is 'single' and exactly 1 ticket
    if (my.customUrlQueryData[query.customUrlQueryData] && my.customUrlQueryData[query.customUrlQueryData].autoSingleVisitor) {
      if (this.data.ticketCount === 1 && this.data.selectedTicket && this.data.selectedTicket.length > 0) {
        const ticketIndex = 0;
        const visitorIndex = 0;
        const ticketId = this.data.selectedTicket[0].tickets[0].ticketId;
        this.navigateToVisitorInput({
          currentTarget: {
            dataset: {
              ticketIndex,
              visitorIndex,
              ticketId
            }
          }
        });
      }
    }
  },

  formatTicketDate(item) {
    const locale = getApp().globalData.dayjsLocale;

    if (item.category === 'three_days_pass') {
      return locale === 'id' ? formatDateTreeDays(item.ticketDate.replace(/^[A-Za-z]{3}-[A-Za-z]{3},\s*/, '')) :
        locale === 'en' ? item.ticketDate.replace(/^[A-Za-z]{3}-[A-Za-z]{3},\s*/, '') :
          dateFormat(item.ticketDate, "DD MMM YYYY", locale);
    }

    return dateFormat(item.ticketDate, "DD MMM YYYY", locale);
  },
  navigateToVisitorInput(e) {
    firebaseEvent('javaJazzFestivalListInputDataVisitorScreen', 'AppClick', 'click_add_data_visitor_bill_payment_java_jazz_festival')
    const {
      ticketIndex,
      visitorIndex,
      ticketId,
    } = e.currentTarget.dataset
    const {
      orderRequest,
    } = this.data

    const personalData = this.data.personalData
    const selectedTickets = this.data.selectedTicket
    my.refreshVisitorListScreen = (orderDetail, ticket, visitor, isPersonalNikUsed, selectedCustomer) => {
      const tickets = [...orderRequest.tickets]
      tickets[ticket] = orderDetail

      this.setData({
        orderRequest: {
          tickets: tickets,
          ticketCount: this.data.ticketCount,
          ticketList: selectedTickets.map((ticket) => {
            return {
              title: ticket.tickets[0].title,
              "totalDetailTicket": ticket.customerTicketCount,
              "amount": ticket.amount
            }
          })
        },
        selectedTicket: selectedCustomer,
        isPersonalNikUsed
      })

      this.validateOrderRequest()
    }
    const dataTicketTemp = selectedTickets[ticketIndex].tickets.find(item => item.ticketId === ticketId)

    customNavigateTo({
      url: "/src/app/pages/visitor-input-screen/visitor-input-screen",
      data: {
        "tickets": {
          "name": personalData.fullName,
          "email": personalData.email,
          "phone": personalData.phone,
          "gender": personalData.gender,
          "ticketId": dataTicketTemp.ticketId,
          "ticketQty": dataTicketTemp.orderAdd,
          "category": dataTicketTemp.category,
          "category2": dataTicketTemp.category2,
          "category3": dataTicketTemp.category3,
          "type": dataTicketTemp.type,
          "oldPrice": dataTicketTemp.oldPrice,
          "price": dataTicketTemp.price,
          "priceTaxService": dataTicketTemp.priceTaxService,
          "customerTicket": orderRequest.tickets[ticketIndex].customerTicket || Array.from({
            length: selectedTickets[ticketIndex].total
          },
            () => ({
              fullName: "",
              idCard: "",
              gender: "",
              dob: "",
              citizen: "Indonesia",
              country: "Indonesia",
              statusForeign: "",
              postCode: "",
              ticketName: selectedTickets[ticketIndex].tickets[0].ticketName,
              ticketDate: selectedTickets[ticketIndex].ticketDate
            })
          ),
          ticketTotal: selectedTickets[ticketIndex].total,
          ticketCount: this.data.ticketCount,
          ticketList: selectedTickets.map((ticket) => {
            return {
              title: ticket.tickets[0].title,
              "totalDetailTicket": ticket.total,
              "amount": ticket.tickets[0].totalPrice
            }
          })
        },
        visitorIndex,
        ticketIndex,
        personalData: personalData,
        autoSingleVisitor: this.data.singleFlow,
        isPersonalNikUsed: this.data.isPersonalNikUsed,
        selectedTickets,
        eventDetail: this.data.eventDetail,
      }
    })

  },
  async fetchPersonalData() {
    try {
      this.setData({
        isLoading: true
      })
      const {
        data
      } = await getPersonalData()
      this.setData({
        personalData: {
          ...data.dataProtected,
          fullName: capitalizeTxt(data.dataProtected.fullName),
          subdistrict: capitalizeTxt(data.dataProtected.subdistrict)
        }
      })
    } catch (err) {
      generalError({
        err
      })
    } finally {
      this.setData({
        isLoading: false
      })
    }
  },
  validateOrderRequest() {
    let isTicketsDataValid = true;
    let isCustomersDataValid = true;

    const orderRequests = this.data.orderRequest.tickets;
    const ticketFields = [
      'name', 'ticketId', 'type', 'category',
      'email', 'phone', 'gender', 'ticketQty',
      'price'
    ];
    const customerFieldsDomestic = [
      'citizen', 'country', 'dob', 'fullName',
      'gender', 'idCard', 'postCode', 'ticketName'
    ];
    const customerFieldsForeign = [
      'citizen', 'country', 'dob', 'fullName',
      'gender', 'idCard', 'statusForeign', 'ticketName'
    ];

    orderRequests.forEach(order => {
      if (ticketFields.some(field => !order[field])) {
        isTicketsDataValid = false;
      }

      if (order.customerTicket) {
        order.customerTicket.forEach(ticket => {
          const fieldsToCheck = ticket.country == "Indonesia" ?
            customerFieldsDomestic :
            customerFieldsForeign;

          if (fieldsToCheck.some(field => !ticket[field])) {
            isTicketsDataValid = false;
          }
        });
      } else {
        isCustomersDataValid = false;
      }
    });

    if (isTicketsDataValid && isCustomersDataValid) {
      this.setData({
        isDataValid: true
      });
    }
  },

  async handleContinueButton() {
    firebaseEvent('javaJazzFestivalListInputDataVisitorScreen', 'AppClick', 'click_next_bill_payment_java_jazz_festival')
    try {
      let {
        orderRequest,
        selectedTicket,
        personalData
      } = this.data;

      orderRequest.tickets = [];

      selectedTicket.forEach(ticketGroup => {
        const groupedCustomer = (ticketGroup.customerTicketTemp || []).reduce((acc, item) => {
          const tid = item.ticketId;
          if (item.customerData) {
            if (!acc[tid]) {
              acc[tid] = [];
            }
            acc[tid].push(item.customerData);
          }
          return acc;
        }, {});

        (ticketGroup.tickets).forEach(ticketDetail => {
          const tid = ticketDetail.ticketId;
          if (groupedCustomer[tid] && groupedCustomer[tid].length > 0) {
            const customerArray = groupedCustomer[tid];
            const newTicket = {
              "name": personalData.fullName,
              "email": personalData.email,
              "phone": personalData.phone,
              "gender": personalData.gender,
              ticketId: tid,
              ticketQty: ticketDetail.orderAdd,
              category: ticketDetail.category,
              category2: ticketDetail.category2,
              category3: ticketDetail.category3,
              type: ticketDetail.type,
              oldPrice: ticketDetail.oldPrice,
              price: ticketDetail.price,
              priceTaxService: ticketDetail.priceTaxService,
              customerTicket: customerArray
            };

            orderRequest.tickets.push(newTicket);
          }
        });
      });

      orderRequest.tickets = orderRequest.tickets.map(({
        ticketCount, // eslint-disable-line
        ticketList, // eslint-disable-line
        ticketTotal, // eslint-disable-line
        ...rest
      }) => rest)

      const encryptedReq = orderRequest
      let signature = {
        "dataProtected": encryptedReq
      }
      const {
        data
      } = await orderTickets({
        dataProtected: encryptedReq
      }, {
        "Signature": signature
      })

      // Integrate with Internal POS System
      try {
        const posPayload = {
          orderType: "event",
          serviceId: this.data.eventDetail.id || "EVENT-JJF",
          customerName: this.data.personalData.fullName || "User Miniprogram",
          customerPhone: this.data.personalData.phone || "-",
          notes: `Booking Tiket Event (Multi): ${this.data.eventDetail.name || "Java Jazz"}`,
          quantity: this.data.ticketCount || 1,
          totalAmount: this.data.priceCount.value || 0,
          orderPayload: {
            tickets: encryptedReq.tickets,
            orderId: data.dataProtected.orderId || "INTERNAL-ID"
          }
        };

        console.log("Sending to POS:", posPayload);
        const posRes = await createServiceOrder(posPayload);
        console.log("POS Response:", posRes);

        // Update orderData with POS result if available
        const finalOrderData = {
          ...data.dataProtected,
          orderId: (posRes.data && posRes.data.id) || posRes.id || (data.dataProtected && data.dataProtected.orderId)
        };

        customNavigateTo({
          url: '/src/app/package_transaction/pages/gather-screen-va/gather-screen-va',
          data: {
            selectedTicket: orderRequest,
            personalData: this.data.personalData,
            ticketCount: this.data.ticketCount,
            priceCount: this.data.priceCount.value,
            ticketList: this.data.selectedTicket.map((ticket) => {
              return {
                title: ticket.tickets[0].title,
                "totalDetailTicket": ticket.total,
                "amount": ticket.tickets[0].totalPrice
              }
            }),
            partnerMenu: getApp().globalData.partnerMenu,
            orderData: finalOrderData
          }
        })
      } catch (posErr) {
        console.error("POS Integration Error:", posErr);
        // Tetap arahkan ke payment screen meskipun POS gagal, agar user bisa bayar
        customNavigateTo({
          url: '/src/app/package_transaction/pages/gather-screen-va/gather-screen-va',
          data: {
            selectedTicket: orderRequest,
            personalData: this.data.personalData,
            ticketCount: this.data.ticketCount,
            priceCount: this.data.priceCount.value,
            ticketList: this.data.selectedTicket.map((ticket) => {
              return {
                title: ticket.tickets[0].title,
                "totalDetailTicket": ticket.total,
                "amount": ticket.tickets[0].totalPrice
              }
            }),
            partnerMenu: getApp().globalData.partnerMenu,
            orderData: data.dataProtected
          }
        })
      }
    } catch (err) {
      generalError({
        err
      })
    }
  },
  handleBackButton() {

    this.setData({
      visiblePopup: true
    })
  },
  handlePopup() {
    customNavigateTo({
      url: "/src/app/pages/index/index",
      mode: "redirectTo",
      data: ""
    });
  },
  handlePopupClose() {
    this.setData({
      visiblePopup: false
    })
  }
});
/* JShield-obfus:disable */
