import {
  getPostalCode,
  getOtpCountries,
  getlov,
  orderTickets,
  createServiceOrder
} from "/src/public/api"
import generalError from '/src/utils/generalError'
import {
  debounce
} from "/src/utils/debounce";
import { customNavigateTo } from "/src/utils/route-util";
import dayjs from "dayjs";
import {
  flag
} from "country-emoji";
import {
  capitalizeTxt
} from "/src/utils/capitalize";

/* JShield-obfus:enable */
Page({
  data: {
    switchStatus: Boolean(false),
    focusInputSection: {
      fullName: Boolean(false),
      idCard: Boolean(false)
    },
    customerData: {
      fullName: String(""),
      idCard: String("")
    },
    popupVisible: Boolean(false),
    popupContent: {
      section: String(""),
      content: []
    },
    selectedPopupValue: {
      citizen: String("javaJazzFestivalListInputDataVisitorScreenWNILabel"),
      gender: String(""),
      postalCode: String("")
    },
    items3: [{
      title: String(''),
    }],
    items2: [{
      title: String(''),
    },],
    birthDateInputLockey: {
      "day": {
        value: String("")
      },
      "month": {
        value: String("")
      },
      "year": {
        value: String("")
      }
    },
    birthDateFocusStatus: String(""),
    birthDateValue: Object({
      "day": String(""),
      "month": String(""),
      "year": String("")
    }),
    fullPopupVisible: Boolean(false),
    fullPopupCurrentlyActive: "countries",
    lovData: Object({}),
    postalCodeData: [],
    orderRequest: Object({}),
    activePopup: String(""),
    isLoading: Boolean(false),
    isBirthDateValid: Boolean(true),
    isDataValid: Boolean(false),
    isNikValid: Boolean(false),
    isNikSame: Boolean(false),
    searchValue: String(""),
    fullPopupPageCount: Number(1),
    toggleTabDisabled: Boolean(false),
    page: Number(1),
    noOfRecord: Number(10),
    collapseStatus: Boolean(true),
    collapseStatusOther: Boolean(true),
    filteredPostalCodeData: []
  },
  async onLoad(query) {
    const queryParams = my.customUrlQueryData[query.customUrlQueryData]

    const lang = getApp().globalData.languagePack

    this.setData({
      ticketIndex: queryParams.ticketIndex,
      orderRequest: queryParams.tickets,
      visitorIndex: queryParams.visitorIndex,
      personalData: queryParams.personalData,
      autoSingleVisitor: !!queryParams.autoSingleVisitor,
      lang,
      toggleTabDisabled: queryParams.isPersonalNikUsed,
      searchNotFound: false,
      secondIndex: queryParams.secondIndex,
      ticketId: queryParams.ticketId,
      selectedTicket: queryParams.selectedTickets,
      eventDetail: queryParams.eventDetail,
      templateId: (queryParams.eventDetail && queryParams.eventDetail.templates && queryParams.eventDetail.templates.visitorInput) || (queryParams.eventDetail && queryParams.eventDetail.templateId) || 1,
    })
    this.setData({
      birthDateInputLockey: {
        "day": {
          value: lang.javaJazzFestivalInputDataVisitorScreenInputDateLabel
        },
        "month": {
          value: lang.javaJazzFestivalInputDataVisitorScreenInputMonthLabel
        },
        "year": {
          value: lang.javaJazzFestivalInputDataVisitorScreenInputYearLabel
        }
      },
      items2: [{
        title: lang.javaJazzFestivalInputDataVisitorScreenOtherDetailsLabel
      }],
      items3: [{
        title: lang.javaJazzFestivalInputDataVisitorScreenPersonalDetailsLabel
      }]
    })
    await this.handleInitialRequest()
    this.populateVisitorInput()
    this.validateOrderRequest()
  },
  async proceedSingleFlow() {
    try {
      const { orderRequest, personalData } = this.data;
      const ticketPayload = {
        name: personalData.fullName,
        email: personalData.email,
        phone: personalData.phone,
        gender: personalData.gender,
        ticketId: orderRequest.ticketId,
        ticketQty: orderRequest.ticketTotal,
        category: orderRequest.category,
        category2: orderRequest.category2,
        category3: orderRequest.category3,
        type: orderRequest.type,
        oldPrice: orderRequest.oldPrice,
        price: orderRequest.price,
        priceTaxService: orderRequest.priceTaxService,
        customerTicket: orderRequest.customerTicket
      };
      const req = { tickets: [ticketPayload] };
      const signature = { dataProtected: req };
      const { data } = await orderTickets({ dataProtected: req }, { "Signature": signature });
      
      const ticketList = (orderRequest.ticketList || []);
      const priceCount = ticketList.reduce((sum, t) => sum + (t.amount || 0), 0);
      
      // Simpan personal data ke storage agar bisa dibaca di halaman Riwayat
      my.setStorageSync({ key: 'personalData', data: personalData });

      // TUNDA pembuatan order di POS/CMS. 
      // Kirim data yang dibutuhkan ke gather-screen-va agar nanti bisa diproses di result-screen
      const posContext = {
        orderType: "event",
        serviceId: this.data.eventDetail.id || "EVENT-JJF",
        serviceName: this.data.eventDetail.name || "Java Jazz",
        customerName: personalData.fullName || "User Miniprogram",
        customerPhone: personalData.phone || "-",
        notes: `Booking Tiket Event: ${this.data.eventDetail.name || "Java Jazz"}`,
        quantity: orderRequest.ticketCount || 1,
        totalAmount: priceCount,
        orderPayload: {
          tickets: req.tickets,
          orderId: data.dataProtected.orderId || "INTERNAL-ID"
        }
      };

      customNavigateTo({
        url: '/src/app/package_transaction/pages/gather-screen-va/gather-screen-va',
        data: {
          selectedTicket: req,
          personalData: this.data.personalData,
          ticketCount: orderRequest.ticketCount,
          priceCount,
          ticketList,
          partnerMenu: getApp().globalData.partnerMenu,
          orderData: data.dataProtected,
          posContext // Sertakan context POS untuk diproses di akhir
        }
      })
    } catch (err) {
      generalError({ err })
    }
  },

  onSwitch() {
    if (this.data.toggleTabDisabled[this.data.ticketIndex].toggleTabDisabled) {
      return;
    }

    this.setData({
      switchStatus: !this.data.switchStatus,
      clearButton: false
    });

    if (this.data.switchStatus) {
      this.updateCustomerTicket();
      this.setBirthDateValue();
      this.setSelectedPopupValue();
      this.setData({
        isNikValid: true
      });
      this.validateOrderRequest();
    }
  },

  updateCustomerTicket() {
    const {
      personalData,
      orderRequest,
      visitorIndex
    } = this.data;
    const customerTicket = orderRequest.customerTicket;

    customerTicket[visitorIndex] = {
      ...customerTicket[visitorIndex],
      fullName: personalData.fullName,
      gender: personalData.gender,
      dob: this.formatDOB(personalData),
      citizen: this.getCitizenLabel(personalData.nationality),
      country: this.getCountryLabel(personalData.nationality),
      statusForeign: this.getStatusForeignLabel(personalData.nationality),
      idCard: personalData.nik,
      postCode: personalData.postalCode,
      urbanv: personalData.subdistrict
    };

    this.setData({
      orderRequest: {
        ...orderRequest,
        customerTicket
      }
    });
  },

  formatDOB(personalData) {
    return `${personalData.yearBirth}-${personalData.monthBirth}-${personalData.dateBirth}`;
  },

  getCitizenLabel(nationality) {
    return nationality === "ID" ? "Indonesia" : "Foreign";
  },

  getCountryLabel(nationality) {
    return nationality === "ID" ? "Indonesia" : "Foreign";
  },

  getStatusForeignLabel(nationality) {
    return nationality === "ID" ? "" : "Foreign";
  },

  setBirthDateValue() {
    const {
      personalData
    } = this.data;
    this.setData({
      birthDateValue: {
        day: personalData.dateBirth,
        month: personalData.monthBirth,
        year: personalData.yearBirth
      }
    });
  },

  setSelectedPopupValue() {
    const {
      personalData,
      lovData
    } = this.data;

    this.setData({
      selectedPopupValue: {
        ...this.data.selectedPopupValue,
        gender: lovData.gender.find(val => val.lovValue === personalData.gender).lovDisplay,
        postCode: {
          subdistrictName: personalData.subdistrict,
          postCode: personalData.postalCode,
        },
        citizen: lovData.citizen.find(val => val.lovValue === this.getCitizenLabel(personalData.nationality)).lovDisplay
      }
    });
  },
  async handlePopUp(e) {
    const {
      selectedPopup
    } = e.currentTarget.dataset

    if (this.data.switchStatus) {
      return;
    }
    this.setData({
      activePopup: selectedPopup,
      "popupVisible": true,
      focusInputSection: {
        fullName: false,
        idCard: false,
      }
    })
  },
  birthDateInputOnFocus(e) {
    this.setData({
      birthDateFocusStatus: e
    })


    if (this.data.birthDateValue['day'] && this.data.birthDateValue['day'] < 10 && (this.data.birthDateFocusStatus === 'month' || this.data.birthDateFocusStatus === 'year')) {
      this.setData({
        birthDateValue: {
          ...this.data.birthDateValue,
          day: this.data.birthDateValue['day'].toString().padStart(2, '0')
        }
      })
    }

    if (this.data.birthDateValue['month'] && this.data.birthDateValue['month'] < 10 && (this.data.birthDateFocusStatus === 'day' || this.data.birthDateFocusStatus === 'year')) {
      this.setData({
        birthDateValue: {
          ...this.data.birthDateValue,
          month: this.data.birthDateValue['month'].toString().padStart(2, '0')
        }
      })
    }

    for (const key in this.data.birthDateValue) {
      if (this.data.birthDateValue[key] == '00') {
        this.setData({
          [`birthDateValue.${key}`]: ""
        })
      }
    }
    if (this.data.birthDateValue['year'] == '0') {
      this.setData({
        [`birthDateValue.year`]: ""
      })
    }

    if ((this.data.birthDateValue.day == "" && this.data.birthDateValue.month < 13) || (this.data.birthDateValue.month == "" && this.data.birthDateValue.day < 32)) {
      this.setData({
        isBirthDateValid: false
      })
    }

    if (this.data.birthDateFocusStatus) {
      my.createSelectorQuery().select('#java-jazz-festival-input-data-screen-full-name').scrollOffset().exec(() => {
        my.pageScrollTo({
          scrollTop: 400,
          duration: 200,
        });
      })
      this.setData({
        paddingBottom: 70
      })
    }

    if (this.data.birthDateValue.year < 1900) {
      this.setData({
        birthDateValue: {
          ...this.data.birthDateValue,
          year: "",
        },
        isBirthDateValid: false,
      })
    }
  },
  onKeyboardClose() {
    this.setData({
      paddingBottom: 0
    })

    const birthDateInput = this.data.birthDateValue
    const birthDate = this.data.orderRequest["customerTicket"][this.data.visitorIndex].dob
    const birthDateDayjs = dayjs(birthDate)
    const today = dayjs();

    if (birthDateInput.day && birthDateInput.day == 0) {
      setTimeout(() => {
        this.setData({
          birthDateValue: {
            ...this.data.birthDateValue,
            day: ""
          },
        })
      }, 10)
    } else if (birthDateInput.day && birthDateInput.day < 10 && birthDateInput.day.length < 2) {
      setTimeout(() => {
        this.setData({
          birthDateValue: {
            ...this.data.birthDateValue,
            day: `0${birthDateInput.day}`
          },
        })
        if (birthDateDayjs.isBefore(today)) {
          this.setData({
            isBirthDateValid: true
          })
        }
      }, 50);
    }


    if (birthDateInput.month && birthDateInput.month == 0) {
      setTimeout(() => {
        this.setData({
          birthDateValue: {
            ...this.data.birthDateValue,
            month: ""
          },
        })
      }, 10)
    } else if (birthDateInput['month'] && birthDateInput['month'] < 10) {
      this.setData({
        birthDateValue: {
          ...birthDateInput,
          month: birthDateInput['month'].toString().padStart(2, '0')
        },
      })
      if (birthDateDayjs.isBefore(today)) {
        this.setData({
          isBirthDateValid: true
        })
      }
    }

    if (birthDateInput.year < 1900) {
      this.setData({
        birthDateValue: {
          ...birthDateInput,
          year: "",
        },
        isBirthDateValid: false
      })
    }

    setTimeout(() => {
      const allKeysFilled = Object.keys(birthDateInput).every(key => {
        return birthDateInput[key] !== undefined && birthDateInput[key] !== null && birthDateInput[key] !== "" && birthDateInput[key] !== "0" && birthDateInput[key] !== "00";
      });

      if (allKeysFilled) {
        if (birthDateDayjs.isAfter(today)) {
          setTimeout(() => {
            this.setData({
              birthDateValue: {
                day: "",
                month: "",
                year: ""
              },
              birthDateFocusStatus: "day",
            })
          }, 20);
        }
      } else if (birthDateDayjs.isBefore(today)) {
        this.setData({
          isBirthDateValid: true
        })
      }

      if (!allKeysFilled) {
        this.setData({
          isBirthDateValid: false
        })
      }

    }, 50);

  },
  onChangeBirthdateInput(e) {
    const birthDateStatus = this.data.birthDateFocusStatus;
    const customerTicket = this.data.orderRequest.customerTicket


    if (
      (birthDateStatus === 'year' && e.length <= 4) ||
      (birthDateStatus === 'month' && e.length <= 2) ||
      (birthDateStatus === 'day' && e.length <= 2)
    ) {
      this.setData({
        birthDateValue: {
          ...this.data.birthDateValue,
          [birthDateStatus]: e
        },
      });
    }

    customerTicket[this.data.visitorIndex] = {
      ...this.data.orderRequest.customerTicket[this.data.visitorIndex],
      dob: `${this.data.birthDateValue.year}-${this.data.birthDateValue.month}-${this.data.birthDateValue.day}`
    }

    this.setData({
      orderRequest: {
        ...this.data.orderRequest,
        customerTicket
      }
    })
    this.validateOrderRequest()
    this.validateBirthDateInput(e)
  },
  validateBirthDateInput(e) {
    const birthDateInput = this.data.birthDateValue
    const birthDateStatus = this.data.birthDateFocusStatus

    const dayValue = this.data.birthDateValue['day'];
    const monthValue = this.data.birthDateValue['month'];
    const yearValue = this.data.birthDateValue['year'];

    const isValidDay = /^(0?[0-9]|[12][0-9]|3[01])$/.test(dayValue);
    const isValidMonth = /^(0?[0-9]|1[0-2])$/.test(monthValue);

    if (this.data.birthDateFocusStatus === 'day') {
      if (!isValidDay) {
        this.setData({
          birthDateValue: {
            ...birthDateInput,
            day: "",
          },
          birthDateFocusStatus: "day",
        })
      }
    } else if (this.data.birthDateFocusStatus === 'month') {
      if (!isValidMonth) {
        this.setData({
          birthDateValue: {
            ...birthDateInput,
            month: "",
          },
          birthDateFocusStatus: "month",
        })
      }
    }

    if (yearValue > new Date().getFullYear() && this.data.birthDateFocusStatus === 'year') {
      this.setData({
        birthDateValue: {
          ...birthDateInput,
          year: "",
        },
        birthDateFocusStatus: "year",
      })
    }

    if (this.data.birthDateValue.year.startsWith("0")) {
      this.setData({
        'birthDateValue.year': ""
      });
    }


    const allKeysFilled = Object.keys(birthDateInput).every(key => {
      return birthDateInput[key] !== undefined && birthDateInput[key] !== null && birthDateInput[key] !== "" && birthDateInput[key] !== "0" && birthDateInput[key] !== "00";
    });

    if (birthDateStatus === 'day' && birthDateInput.day.length >= 2 && isValidDay) {
      if (allKeysFilled) {
        this.setData({
          birthDateFocusStatus: ''
        });
      } else {
        this.setData({
          birthDateFocusStatus: 'month'
        });
      }
    } else if (birthDateStatus === 'month' && birthDateInput.month.length >= 2 && isValidMonth) {
      if (allKeysFilled) {
        this.setData({
          birthDateFocusStatus: ''
        });
      } else {
        this.setData({
          birthDateFocusStatus: 'year'
        });
      }
    } else if (birthDateStatus === 'year' && birthDateInput.year.length >= 4) {
      if (allKeysFilled) {
        this.setData({
          birthDateFocusStatus: ''
        });
      }
    }


    for (const key in birthDateInput) {
      if (birthDateInput[key] == '00') {
        this.setData({
          [`birthDateValue.${key}`]: ""
        })
      }
    }

    const birthDate = this.data.orderRequest["customerTicket"][this.data.visitorIndex].dob
    if (birthDate.length > 9) {

      const birthDateDayjs = dayjs(birthDate)

      const today = dayjs();

      if (allKeysFilled) {

        if (
          e.length > 2 && this.data.birthDateValue[birthDateStatus].length >= 2 && (birthDateStatus === 'day' || birthDateStatus === 'month')
        ) {
          this.setData({
            paddingBottom: 0
          });
          return;
        }
      }

      if (allKeysFilled) {
        if (birthDateDayjs.isAfter(today)) {
          setTimeout(() => {
            this.setData({
              birthDateValue: {
                day: "",
                month: "",
                year: ""
              },
              birthDateFocusStatus: "day",
            })
          }, 20);
        } else if (birthDateDayjs.isBefore(today) && birthDateInput.year >= 1900) {
          setTimeout(() => {
            this.setData({
              isBirthDateValid: true
            })
          }, 20);
        }


      }

      if (birthDateInput.year < 1900) {
        this.setData({
          birthDateValue: {
            ...birthDateInput,
            year: "",
          },
          isBirthDateValid: false,
          birthDateFocusStatus: "year",
        })
      }

      if (dayjs(birthDateDayjs).year() > dayjs().year()) {
        this.setData({
          birthDateValue: {
            ...birthDateInput,
            year: ""
          },
        })
      }
    }
  },
  onClosePopup() {
    this.setData({
      popupVisible: false
    })
  },

  async moveToNextVisitor(orderRequest) {
    const {
      selectedTicket,
      ticketIndex,
      visitorIndex,
    } = this.data
    // Pastikan objek customerTicketTemp ada dan memiliki elemen untuk visitorIndex
    const ticketGroup = selectedTicket[ticketIndex];
    if (!ticketGroup.customerTicketTemp) {
      ticketGroup.customerTicketTemp = [];
    }
    if (!ticketGroup.customerTicketTemp[visitorIndex]) {
      // Buat objek kosong untuk visitor jika belum ada
      ticketGroup.customerTicketTemp[visitorIndex] = {};
    }

    // Assign data customer dari orderRequest ke properti customerData
    ticketGroup.customerTicketTemp[visitorIndex].customerData = orderRequest.customerTicket[visitorIndex];

    const nextVisitor = orderRequest.customerTicket[this.data.visitorIndex + 1];
    if (nextVisitor.urbanv) {
      await this.fetchPostalCode(nextVisitor.urbanv)
      this.setData({
        searchValue: nextVisitor.urbanv
      })
    } else {
      this.setData({
        filteredPostalCodeData: [],
      })
    }
    this.setData({
      selectedPopupValue: {
        gender: nextVisitor.gender === "" ? "" : nextVisitor.gender === "F" ?
          "javaJazzFestivalListInputDataVisitorScreenGenderFemaleModal" : "javaJazzFestivalListInputDataVisitorScreenGenderMaleModal",
        postCode: {
          subdistrictName: nextVisitor.urbanv,
          postCode: nextVisitor.postCode
        },
        statusForeign: nextVisitor.statusForeign === "Visit for JJF" ? "javaJazzFestivalListInputDataVisitorScreenVisitorOfJJFLabel" : "javaJazzFestivalListInputDataVisitorScreenLimitedResidenceLabel",
        citizen: nextVisitor.country === "Indonesia" ? "javaJazzFestivalListInputDataVisitorScreenWNILabel" : "javaJazzFestivalListInputDataVisitorScreenWNALabel"
      }
    })

    if (nextVisitor.dob) {
      this.setBirthDate(nextVisitor.dob);
    } else {
      this.resetBirthDate();
    }

    this.setData({
      visitorIndex: this.data.visitorIndex + 1
    });
  },

  setBirthDate(dob) {
    const [year, month, day] = dob.split("-");

    this.setData({
      birthDateValue: {
        day,
        month,
        year
      },
      isNikValid: true,
      isNikSame: false,
      isDataValid: true,
      collapseStatus: true,
      collapseStatusOther: true,
      switchStatus: false,
    });
  },

  onHandleSelectPopUpContent(e) {
    const customerTicket = this.data.orderRequest.customerTicket
    const {
      selectedPopupValue
    } = e.currentTarget.dataset
    if (selectedPopupValue["lovValue"] === "Foreign" && this.data.activePopup === 'citizen') {
      customerTicket[this.data.visitorIndex] = {
        ...this.data.orderRequest.customerTicket[this.data.visitorIndex],
        [this.data.activePopup]: selectedPopupValue["lovValue"],
        postCode: "",
        country: "",
        idCard: ""
      }
    } else if (selectedPopupValue["lovValue"] === "Indonesia" && this.data.activePopup === 'citizen') {
      customerTicket[this.data.visitorIndex] = {
        ...this.data.orderRequest.customerTicket[this.data.visitorIndex],
        [this.data.activePopup]: selectedPopupValue["lovValue"],
        statusForeign: "",
        "country": "Indonesia",
        "idCard": ""
      }
    } else {
      customerTicket[this.data.visitorIndex] = {
        ...this.data.orderRequest.customerTicket[this.data.visitorIndex],
        [this.data.activePopup]: selectedPopupValue["lovValue"]
      }
    }
    this.setData({
      orderRequest: {
        ...this.data.orderRequest,
        customerTicket
      },
      selectedPopupValue: {
        ...this.data.selectedPopupValue,
        [this.data.activePopup]: selectedPopupValue["lovDisplay"]
      },
      popupVisible: false
    })
    this.validateOrderRequest()

  },
  async handleInitialRequest() {
    this.setData({
      isLoading: true
    })
    try {
      const javaJazzLovKey = "lifestyle-javajazz.input-data"
      const [{
        data: countriesData
      },
        {
          data: lovData
        }
      ] = await Promise.all([getOtpCountries(), getlov(javaJazzLovKey)])

      const displayCountries = countriesData.data.countryList.map(country => {
        country.countryFlag = flag(country.countryId)
        return country
      });

      const updatedDataCountry = displayCountries.filter(country => country.countryId !== 'ID');

      this.setData({
        countriesData: updatedDataCountry,
        lovData: lovData.data,
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

  resetBirthDate() {
    this.setData({
      birthDateValue: {
        day: "",
        month: "",
        year: ""
      },
      switchStatus: false,
      isNikValid: false,
      isNikSame: false,
      isDataValid: false,
      collapseStatus: true,
      collapseStatusOther: true,
    });
  },

  finalizeNavigation() {
    const {
      selectedTicket,
      ticketIndex,
      visitorIndex,
      orderRequest,
    } = this.data

    const ticketGroup = selectedTicket[ticketIndex];
    if (!ticketGroup.customerTicketTemp) {
      ticketGroup.customerTicketTemp = [];
    }
    if (!ticketGroup.customerTicketTemp[visitorIndex]) {
      // Buat objek kosong untuk visitor jika belum ada
      ticketGroup.customerTicketTemp[visitorIndex] = {};
    }

    // Assign data customer dari orderRequest ke properti customerData
    ticketGroup.customerTicketTemp[visitorIndex].customerData = orderRequest.customerTicket[visitorIndex];

    my.refreshVisitorListScreen(this.data.orderRequest, this.data.ticketIndex, this.data.visitorIndex, this.data.toggleTabDisabled, this.data.selectedTicket);
    my.navigateBack();
  },
  exitInputData() {
    const { visitorIndex, orderRequest, selectedTicket, ticketIndex } = this.data;

    if (visitorIndex === 0) {
      my.navigateBack();
      return;
    }

    const previousTicket = orderRequest.customerTicket[visitorIndex - 1];
    if (previousTicket && previousTicket.idCard) {
      const tempInputData = selectedTicket[ticketIndex].customerTicketTemp[visitorIndex].customerData;

      this.data.orderRequest.customerTicket[visitorIndex] = {
        ...this.data.orderRequest.customerTicket[visitorIndex],
        fullName: tempInputData.fullName || "",
        idCard: tempInputData.idCard || "",
        gender: tempInputData.gender || "",
        dob: tempInputData.dob || "",
        citizen: tempInputData.citizen || "Indonesia",
        country: tempInputData.country || "Indonesia",
        statusForeign: tempInputData.statusForeign || "",
        postCode: tempInputData.postCode || "",
      };

      my.refreshVisitorListScreen(orderRequest, ticketIndex, visitorIndex, this.data.toggleTabDisabled, selectedTicket);
    }

    my.navigateBack();
  },

  populateVisitorInput() {
    let dob;

    const customerTicket = this.data.orderRequest.customerTicket[this.data.visitorIndex]
    if (this.data.orderRequest["customerTicket"][this.data.visitorIndex].dob) {
      dob = this.data.orderRequest["customerTicket"][this.data.visitorIndex].dob.split("-")
      this.setData({
        birthDateValue: {
          day: dob[2],
          month: dob[1],
          year: dob[0]
        }
      })
    }

    this.setData({
      selectedPopupValue: {
        gender: customerTicket.gender === "" ? "" : customerTicket.gender === "F" ?
          "javaJazzFestivalListInputDataVisitorScreenGenderFemaleModal" : "javaJazzFestivalListInputDataVisitorScreenGenderMaleModal",
        postCode: {
          subdistrictName: customerTicket.urbanv,
          postCode: customerTicket.postCode
        },
        statusForeign: customerTicket.statusForeign === "Visit for JJF" ? "javaJazzFestivalListInputDataVisitorScreenVisitorOfJJFLabel" : "javaJazzFestivalListInputDataVisitorScreenLimitedResidenceLabel",
        citizen: customerTicket.country === "Indonesia" ? "javaJazzFestivalListInputDataVisitorScreenWNILabel" : "javaJazzFestivalListInputDataVisitorScreenWNALabel"
      }
    })
  },
  birthDateClear() {
    this.setData({
      birthDateValue: {
        ...this.data.birthDateValue,
        [this.data.birthDateFocusStatus]: ""
      },
      birthDateFocusStatus: ""
    })
    this.validateOrderRequest()
    this.validateNik()
  },
  onFocusSearch() {
    this.setData({
      focusSearch: true
    })
  },
  onBlurSearch() {
    this.setData({
      focusSearch: false
    })
  },
  onSearch(e) {
    let searchValue = e.detail.value || '';

    this.setData({
      searchValue: searchValue,
      searchNotFound: false
    });

    clearTimeout(this.data.timer)
    let specialStr = "";
    const timer = setTimeout(() => {
      let str = String(this.data.searchValue)
      let pattern = new RegExp("[^a-zA-Z0-9\\ ]"); // eslint-disable-line

      for (var i = 0; i < str.length; i++) {
        specialStr += str.substr(i, 1).replace(pattern, '');
      }

      this.setData({
        searchValue: specialStr
      });

    }, 0);

    this.setData({
      timer: timer,
    })

    try {


      if (this.data.fullPopupCurrentlyActive === 'postalCode' && this.data.searchValue.length > 2) {
        debounce(this.fetchPostalCode, 500, this.data.timeoutId, this, this.data.searchValue)
      } else if (this.data.fullPopupCurrentlyActive === 'postalCode' && this.data.searchValue.length <= 2) {
        this.setData({
          filteredPostalCodeData: [],
        })
      } else {
        const filteredCountries = this.data.countriesData.filter(country =>
          country.countryName.toLowerCase().includes(this.data.searchValue.toLowerCase())
        );

        const searchNotFound = filteredCountries.length > 0
        this.setData({
          searchNotFound: !searchNotFound,
          filteredCountriesData: filteredCountries
        });
      }
    } catch (err) {
      generalError({
        err
      });
    }
  },
  async fetchPostalCode(filterValue) {
    try {
      const encFilterData = {
        filter: filterValue,
      }
      const encryptedReq = encFilterData
      let signature = {
        "dataProtected": encryptedReq
      }
      const {
        data: postalCodeData
      } = await getPostalCode({
        dataProtected: encryptedReq,
        data: {}
      }, {
        "Signature": signature
      })

      const decryptData = postalCodeData.dataProtected
      this.setData({
        filteredPostalCodeData: decryptData.subdistrictPostcodeList,
        noOfRecord: decryptData.noOfRecord,
        page: decryptData.page,
      })

      const filteredPostalCode = this.data.filteredPostalCodeData.filter(postCode =>
        postCode.postalCode.toLowerCase().includes(this.data.searchValue.toLowerCase()) ||
        postCode.subdistrictName.toLowerCase().includes(this.data.searchValue.toLowerCase())
      )

      filteredPostalCode.map((postalCode) => {
        postalCode.subdistrictName = capitalizeTxt(String(postalCode.subdistrictName))
        return postalCode
      })
      const searchNotFound = filteredPostalCode.length > 0

      this.setData({
        searchNotFound: !searchNotFound,
        filteredPostalCodeData: filteredPostalCode
      })

    } catch (err) {
      generalError({
        err
      })
    }
  },
  async handleFullPopup(e) {
    const {
      selectedPopup
    } = e.currentTarget.dataset
    if (this.data.switchStatus) {
      return;
    }

    this.setData({
      focusInputSection: {
        fullName: false,
        idCard: false,
      }
    })

    setTimeout(() => {
      this.setData({
        fullPopupVisible: true,
        fullPopupCurrentlyActive: selectedPopup
      })
    }, 350);

    if (this.data.orderRequest.customerTicket[this.data.visitorIndex].urbanv && selectedPopup == 'postalCode') {
      await this.fetchPostalCode(this.data.orderRequest.customerTicket[this.data.visitorIndex].urbanv)
      this.setData({
        searchValue: this.data.orderRequest.customerTicket[this.data.visitorIndex].urbanv
      })
    } else {
      this.setData({
        filteredPostalCodeData: [],
      })
    }
  },
  onCloseFullPopup() {
    this.setData({
      fullPopupVisible: false,
      searchNotFound: false,
      filteredPostalCodeData: "",
      filteredCountriesData: "",
      searchValue: ""
    })
  },
  navigateBackToVisitorList() {
    const orderRequest = this.data.orderRequest;

    if (this.data.visitorIndex > 0) {
      this.updateToggleTabDisabled(orderRequest);
    }
    if (this.data.visitorIndex < orderRequest.ticketTotal - 1) {
      this.moveToNextVisitor(orderRequest);
    } else {
      this.finalizeNavigation();
    }
  },

  updateToggleTabDisabled(orderRequest) {
    const toggleTabDisabledData = this.data.toggleTabDisabled;
    const isNikPersonalUsed = this.checkNikUsage(orderRequest);

    toggleTabDisabledData[this.data.ticketIndex] = {
      toggleTabDisabled: isNikPersonalUsed
    };

    this.setData({
      toggleTabDisabled: toggleTabDisabledData
    });
  },

  checkNikUsage(orderRequest) {
    return orderRequest.customerTicket.some((element, index) => {
      return index > 0 && element.idCard === this.data.personalData.nik;
    });
  },

  onHandleSelectFullPopUpContent(e) {
    const customerTicket = this.data.orderRequest.customerTicket
    const {
      selectedPopupValue,
      selectedPopup
    } = e.currentTarget.dataset
    customerTicket[this.data.visitorIndex] = {
      ...this.data.orderRequest.customerTicket[this.data.visitorIndex],
      [selectedPopup]: selectedPopupValue[selectedPopup === "country" ? 'countryName' : 'postalCode'],
      urbanv: selectedPopupValue.subdistrictName
    }

    this.setData({
      orderRequest: {
        ...this.data.orderRequest,
        customerTicket
      },
      selectedPopupValue: {
        ...this.data.selectedPopupValue,
        [selectedPopup]: selectedPopupValue
      },
      fullPopupVisible: false,
      searchValue: ''
    })
    this.validateOrderRequest()
  },
  validateOrderRequest() {
    let isCustomersDataValid = true;
    const orderRequest = this.data.orderRequest;
    let customerTicketsToCheck = ['citizen', 'country', 'dob', 'fullName', 'gender', 'idCard', 'postCode', 'ticketName'];
    const customerTicket = orderRequest["customerTicket"][this.data.visitorIndex];

    if (customerTicket.citizen === 'Foreign') {
      customerTicketsToCheck = customerTicketsToCheck.filter((key) => key !== 'postCode');
      customerTicketsToCheck.push('statusForeign');
    }

    let pattern = /^[A-Za-z\s]+$/; // eslint-disable-line

    if (!pattern.test(customerTicket.fullName)) {
      isCustomersDataValid = false;
    }

    let isOnlySpaces = String(customerTicket.fullName).trim() === '';

    if (isOnlySpaces) {
      isCustomersDataValid = false;
    }

    if (customerTicket.idCard.length >= 16 && customerTicket.citizen === 'Indonesia') {
      this.setData({
        isNikValid: true
      })
    }

    if (customerTicket.idCard.length >= 6 && customerTicket.citizen === 'Foreign') {
      this.setData({
        isNikValid: true
      })
    }

    if (customerTicketsToCheck.some(key => customerTicket[key] === undefined || customerTicket[key] === null || customerTicket[key] === '')) {
      isCustomersDataValid = false;
    }

    this.setData({
      isDataValid: isCustomersDataValid
    });
  },
  validateNik() {
    const orderRequest = [...this.data.orderRequest["customerTicket"]]
    const customerTicket = new Set();
    let duplicateFound = false;

    let emptyIdCardFound = false; //eslint-disable-line

    if (!orderRequest || !Array.isArray(orderRequest) || orderRequest.length === 0) {
      this.setData({
        isNikSame: false
      });
      return;
    }

    orderRequest.sort((a, b) => {
      if (!a.idCard) return -1;
      if (!b.idCard) return 1;
      return 0;
    });

    for (const item of orderRequest) {
      if (!item.idCard) {
        emptyIdCardFound = true;
        continue;
      }
      if (customerTicket.has(item.idCard)) {
        duplicateFound = true;
        break;
      } else {
        customerTicket.add(item.idCard);
      }
    }

    this.setData({
      isNikSame: duplicateFound
    });
  },
  clearSearch() {
    this.setData({
      searchValue: "",
      searchNotFound: false,
      filteredCountriesData: [],
      filteredPostalCodeData: []
    })
  },
  clearButton(e) {
    if (this.data.switchStatus) {
      return;
    }
    const customerTicket = this.data.orderRequest.customerTicket
    const {
      inputSection
    } = e.currentTarget.dataset
    customerTicket[this.data.visitorIndex] = {
      ...this.data.orderRequest.customerTicket[this.data.visitorIndex],
      [inputSection]: ""
    }
    this.setData({
      orderRequest: {
        ...this.data.orderRequest,
        customerTicket
      },
      clearButton: false
    })
    this.validateOrderRequest()
    this.validateNik()
  },
  onFocusInput() {
    this.setData({
      clearButton: true
    })
  },
  onBlurInput(e) {
    setTimeout(() => {
      this.setData({
        paddingBottom: 0,
        clearButton: false,
        focusInputSection: {
          ...this.data.focusInputSection,
          [e.currentTarget.dataset.inputSection]: false
        },
      })
    }, 300);
  },
  onFocus(e) {
    if (this.data.switchStatus) {
      return;
    }
    this.setData({
      focusInputSection: {
        ...this.data.focusInputSection,
        [e.currentTarget.dataset.inputSection]: true
      }
    })

    const {
      platform
    } = my.getSystemInfoSync()
    if (this.data.focusInputSection.idCard && platform == "Android") {
      my.createSelectorQuery().select('#java-jazz-festival-input-data-screen-full-name').scrollOffset().exec(() => {
        my.pageScrollTo({
          scrollTop: 600,
          duration: 200,
        });
      })
      this.setData({
        paddingBottom: 120
      })
    }
  },
  onChangeName(e) {
    const customerTicket = this.data.orderRequest.customerTicket;
    const {
      inputSection
    } = e.currentTarget.dataset;
    let valueInput = e.detail.value;

    valueInput = valueInput.replace(/^[\s]+/, '') // eslint-disable-line

    customerTicket[this.data.visitorIndex] = {
      ...customerTicket[this.data.visitorIndex],
      [inputSection]: valueInput
    };

    this.setData({
      orderRequest: {
        ...this.data.orderRequest,
        customerTicket
      }
    });


    clearTimeout(this.data.timer)
    let specialStr = "";
    const timer = setTimeout(() => {
      let str = String(this.data.orderRequest.customerTicket[this.data.visitorIndex][inputSection])
      let pattern = new RegExp("[^a-zA-Z\\ ]"); // eslint-disable-line

      for (var i = 0; i < str.length; i++) {
        specialStr += str.substr(i, 1).replace(pattern, '');
      }

      specialStr = specialStr.replace(/^[\s]+/, '') // eslint-disable-line

      customerTicket[this.data.visitorIndex] = {
        ...customerTicket[this.data.visitorIndex],
        [inputSection]: specialStr
      };

      this.setData({
        orderRequest: {
          ...this.data.orderRequest,
          customerTicket
        }
      });

    }, 0);

    this.validateOrderRequest();

    this.setData({
      timer: timer,
    })
  },
  onChangeIdCard(e) {
    const customerTicket = this.data.orderRequest.customerTicket;
    const {
      inputSection
    } = e.currentTarget.dataset;
    const valueInput = e.detail.value;

    customerTicket[this.data.visitorIndex] = {
      ...customerTicket[this.data.visitorIndex],
      [inputSection]: valueInput
    };

    this.setData({
      orderRequest: {
        ...this.data.orderRequest,
        customerTicket
      }
    });

    let isNikValid = false;

    clearTimeout(this.data.timer)
    let specialStr = "";
    const timer = setTimeout(() => {
      let str = String(this.data.orderRequest.customerTicket[this.data.visitorIndex][inputSection])
      let pattern = new RegExp(customerTicket[this.data.visitorIndex].citizen === 'Indonesia' ? "[^0-9]" : "[^a-zA-Z0-9]"); // eslint-disable-line

      for (var i = 0; i < str.length; i++) {
        specialStr += str.substr(i, 1).replace(pattern, '');
      }

      const maxLength = 16;
      const minLength = customerTicket[this.data.visitorIndex].citizen === 'Foreign' ? "6" : "16";
      const isValidLength = specialStr.length <= maxLength && specialStr.length >= minLength

      isNikValid = isValidLength;

      customerTicket[this.data.visitorIndex] = {
        ...customerTicket[this.data.visitorIndex],
        [inputSection]: specialStr
      };

      this.setData({
        isNikValid,
        orderRequest: {
          ...this.data.orderRequest,
          customerTicket
        }
      });

    }, 0);

    this.validateOrderRequest();
    this.validateNik();

    this.setData({
      timer: timer,
    })
  },
  async handleLazyLoadPostal() {
    try {
      const filterValue = {
        filter: ''
      }
      const {
        postalCodeData
      } = this.data

      const temppostalCodeData = [...postalCodeData]
      const encryptedReq = filterValue
      let signature = {
        "dataProtected": encryptedReq
      }
      const {
        data: postalCode
      } = await getPostalCode({
        dataProtected: encryptedReq,
        data: {
          "page": this.data.page + 1,
          "noOfRecord": this.data.noOfRecord
        }
      }, {
        "Signature": signature
      })

      const decryptData = postalCode.dataProtected

      temppostalCodeData.push(...decryptData.subdistrictPostcodeList)

      this.setData({
        postalCodeData: temppostalCodeData,
        noOfRecord: decryptData.noOfRecord,
        page: decryptData.page,
      })
    } catch (err) {
      generalError({
        err
      })
    }
  },
  onChangeCollapse(current) {
    this.setData({
      collapseOther: current.length,
      paddingBottom: 0,
      collapseStatus: false
    })
  },

  onChangeCollapseOther() {
    this.setData({
      collapseOther: false,
      paddingBottom: 0,
      collapseStatus: true,
      collapseStatusOther: true
    })
  },

  onChangeCollapsePersonal(current) {
    this.setData({
      collapseOther: current.length,
      paddingBottom: 0,
      collapseStatus: false,
      collapseStatusOther: false
    })
  },
});
/* JShield-obfus:disable */
