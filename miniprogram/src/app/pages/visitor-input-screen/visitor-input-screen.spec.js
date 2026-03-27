import {
  describe,
  it,
  vi,
  beforeAll
} from 'vitest';
import './visitor-input-screen.js';
import * as api from '/src/public/api';
import * as e2ee from '/src/utils/e2ee';
import * as debounce from '/src/utils/debounce'
import {
  flag
} from 'country-emoji'

my.refreshVisitorListScreen = vi.fn()
const mockScrollOffset = vi.fn().mockReturnValue({
  exec: vi.fn((callback) => {
    callback();
  }),
});

const mockSelectorQuery = {
  select: vi.fn().mockReturnValue({
    scrollOffset: mockScrollOffset,
  }),
};

my.createSelectorQuery = vi.fn().mockReturnValue(mockSelectorQuery);

const currentPage = global.pageInstance;

function createPage(Component) {
  return {
    data: Component.data,
    setData: vi.fn(),
    $page: {
      setData: vi.fn()
    },
    ...Component
  };
}
describe("java jazz visitor input screen", () => {
  beforeAll(() => {
    vi.spyOn(api, 'getPersonalData');
    vi.spyOn(e2ee, 'decryptAPIData');

    my.customUrlQueryData['visitor-input-screen'] = {
      personalData: {
        "fullName": "Ilham Nasution",
        "email": "ilhamnasution@gmail.com",
        "phone": "085888746402",
        "gender": "F",
        "dateBirth": "26",
        "monthBirth": "01",
        "yearBirth": "1999",
        "nationality": "ID",
        "nik": "1231232131123211",
        "subdistrict": "CILINCING",
        "postalCode": "14120"
      },
      tickets: {
        "name": "Ilham Nasution",
        "email": "ilhamnasution@gmail.com",
        "phone": "085888746402",
        "gender": "F",
        "ticketId": 843,
        "ticketQty": 1,
        "category": "daily_pass",
        "type": "b1g2",
        "oldPrice": 850000,
        "price": 525000,
        "priceTaxService": 637500,
        "customerTicket": [{
          "fullname": "",
          "idCard": "",
          "gender": "",
          "dob": "",
          "citizen": "INDONESIA",
          "country": "INDONESIA",
          "statusForeign": "",
          "postCode": "",
          "ticketName": "Daily Pass Saturday"
        }]
      },
      selectedTickets: [{
        "maxOrder": 3,
        "ticketIdList": [
          842,
          1002,
          741
        ],
        "tickets": [{
          "priceTaxService": 10000,
          "ticketId": "1002",
          "ticketName": "Daily Pass Friday",
          "description": [
            "Harga sudah termasuk pajak dan biaya admin",
            "Tiket hanya valid untuk 1 hari"
          ],
          "type": "regular",
          "oldPrice": 6000,
          "category": "daily_pass",
          "isAvailable": 1,
          "price": 6000,
          "countAdd": 1,
          "ticketDate": "Friday, 30 May 2025",
          "formatedTicketDate": "Jumat, 30 Mei 2025",
          "formatPriceTaxService": "Rp10.000",
          "count": 0,
          "total": 1,
          "oldPriceFormat": "Rp6.000",
          "maxOrder": 4,
          "title": "Daily Pass Friday",
          "totalPrice": 10000,
          "orderAdd": 1
        }],
        "total": 1,
        "customerTicketTemp": [{
          "ticketId": "1002",
          "index": 0,
          "customerData": {
            "fullName": "Ilham Nasution",
            "idCard": "1412023423423423",
            "gender": "F",
            "dob": "1999-01-26",
            "citizen": "Indonesia",
            "country": "Indonesia",
            "statusForeign": "",
            "postCode": "1122",
            "ticketName": "Daily Pass Friday",
            "ticketDate": "Friday, 30 May 2025",
            "urbanv": "ulu"
          }
        }],
        "customerTicketCount": 1,
        "amount": 10000,
        "ticketDate": "30 Mei 2025"
      }],
      ticketIndex: 1,
      visitorIndex: 0
    };

    currentPage.onLoad({
      customUrlQueryData: 'visitor-input-screen',
    });
  });

  it("onload", () => {
    vi.spyOn(api, 'getPostalCode')
    vi.spyOn(api, 'getOtpCountries')
    vi.spyOn(api, 'getlov')
    vi.spyOn(e2ee, 'decryptAPIData');

    api.getPostalCode.mockResolvedValue({
      data: {
        dataProtected: '',
      },
    })
    api.getOtpCountries.mockResolvedValue({
      data: {
        data: '',
      },
    })
    api.getlov.mockResolvedValue({
      data: {

        "data": {
          "status-foreign": [{
              "lovKey": "lifestyle-javajazz.input-data.status-foreign.visitor",
              "lovValue": "Visit for JJF",
              "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenVisitorOfJJFLabel"
            },
            {
              "lovKey": "lifestyle-javajazz.input-data.status-foreign.residence",
              "lovValue": "Limited / Permanent Residence",
              "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenLimitedResidenceLabel"
            }
          ],
          "citizen": [{
              "lovKey": "lifestyle-javajazz.input-data.citizen.wni",
              "lovValue": "INDONESIA",
              "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenWNILabel"
            },
            {
              "lovKey": "lifestyle-javajazz.input-data.citizen.wna",
              "lovValue": "CITIZEN",
              "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenWNALabel"
            }
          ],
          "gender": [{
              "lovKey": "lifestyle-javajazz.input-data.gender.male",
              "lovValue": "M",
              "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenGenderMaleModal"
            },
            {
              "lovKey": "lifestyle-javajazz.input-data.gender.female",
              "lovValue": "F",
              "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenGenderFemaleModal"
            }
          ]
        }

      },
    })
    e2ee.decryptAPIData.mockReturnValue(JSON.stringify({
      "subdistrictPostcodeList": [{
          "subdistrictName": "KEBON JERUK",
          "postalCode": "11530"
        },
        {
          "subdistrictName": "KEBON JERUK",
          "postalCode": "11531"
        },
        {
          "subdistrictName": "KEBON JERUK",
          "postalCode": "11532"
        },
        {
          "subdistrictName": "KEBON JERUK",
          "postalCode": "11533"
        },
        {
          "subdistrictName": "KEBON JERUK",
          "postalCode": "11534"
        },
        {
          "subdistrictName": "KEBON JERUK",
          "postalCode": "11535"
        },
        {
          "subdistrictName": "KEBON JERUK",
          "postalCode": "11536"
        },
        {
          "subdistrictName": "KEBON JERUK",
          "postalCode": "11537"
        },
        {
          "subdistrictName": "KEBON JERUK",
          "postalCode": "11538"
        },
        {
          "subdistrictName": "KEBON JERUK",
          "postalCode": "14120"
        }
      ],
      "page": 1,
      "totalPage": 5,
      "noOfRecord": 10
    }))
    currentPage.onLoad({
      customUrlQueryData: 'visitor-input-screen',
    });
  })

})

describe("validator", () => {
  it("should success validate order request", () => {
    vi.spyOn(currentPage, 'validateOrderRequest')

    currentPage.isTicketsDataValid = true;
    currentPage.isCustomersDataValid = true;
    currentPage.data.orderRequest = {
      "name": "Ilham Nasution",
      "email": "ilhamnasution@gmail.com",
      "phone": "085888746402",
      "gender": "F",
      "ticketId": 843,
      "ticketQty": 1,
      "category": "daily_pass",
      "type": "b1g2",
      "oldPrice": 850000,
      "price": 525000,
      "priceTaxService": 637500,
      "customerTicket": [{
        "fullname": "Ilham Nasution",
        "idCard": "1231232131123211",
        "gender": "F",
        "dob": "1999-01-26",
        "citizen": "INDONESIA",
        "country": "INDONESIA",
        "statusForeign": "",
        "postCode": "14120",
        "ticketName": "Daily Pass Saturday"
      }]
    }
    currentPage.validateOrderRequest()
  })
  it("should success validate order request citizen", () => {
    vi.spyOn(currentPage, 'validateOrderRequest')
    currentPage.data.orderRequest = {
      "name": "Ilham Nasution",
      "email": "ilhamnasution@gmail.com",
      "phone": "085888746402",
      "gender": "F",
      "ticketId": 843,
      "ticketQty": 1,
      "category": "daily_pass",
      "type": "b1g2",
      "oldPrice": 850000,
      "price": 525000,
      "priceTaxService": 637500,
      "customerTicket": [{
        "fullname": "Ilham Nasution",
        "idCard": "1231232131123211",
        "gender": "F",
        "dob": "1999-01-26",
        "citizen": "CITIZEN",
        "country": "INDONESIA",
        "statusForeign": "JJG",
        "postCode": "",
        "ticketName": "Daily Pass Saturday"
      }]
    }
    currentPage.validateOrderRequest()
  })

  it("should success validate order request citizen", () => {
    vi.spyOn(currentPage, 'validateOrderRequest')
    currentPage.data.orderRequest = {
      "name": "Ilham Nasution",
      "email": "ilhamnasution@gmail.com",
      "phone": "085888746402",
      "gender": "F",
      "ticketId": 843,
      "ticketQty": 1,
      "category": "daily_pass",
      "type": "b1g2",
      "oldPrice": 850000,
      "price": 525000,
      "priceTaxService": 637500,
      "customerTicket": [{
          "fullname": "Ilham Nasution",
          "idCard": "1231232131123211",
          "gender": "F",
          "dob": "1999-01-26",
          "citizen": "CITIZEN",
          "country": "INDONESIA",
          "statusForeign": "JJG",
          "postCode": "",
          "ticketName": "Daily Pass Saturday"
        },
        {
          "fullname": "Ilham Nasution",
          "idCard": "1231232131123211",
          "gender": "F",
          "dob": "1999-01-26",
          "citizen": "CITIZEN",
          "country": "INDONESIA",
          "statusForeign": "JJG",
          "postCode": "",
          "ticketName": "Daily Pass Saturday"
        }
      ]
    }
    currentPage.validateNik()
  })
  it("should success validate order request citizen", () => {
    vi.spyOn(currentPage, 'validateOrderRequest')
    currentPage.data.orderRequest = {
      "name": "Ilham Nasution",
      "email": "ilhamnasution@gmail.com",
      "phone": "085888746402",
      "gender": "F",
      "ticketId": 843,
      "ticketQty": 1,
      "category": "daily_pass",
      "type": "b1g2",
      "oldPrice": 850000,
      "price": 525000,
      "priceTaxService": 637500,
      "customerTicket": [{
          "fullname": "Ilham Nasution",
          "idCard": "",
          "gender": "F",
          "dob": "1999-01-26",
          "citizen": "CITIZEN",
          "country": "INDONESIA",
          "statusForeign": "JJG",
          "postCode": "",
          "ticketName": "Daily Pass Saturday"
        },
        {
          "fullname": "Ilham Nasution",
          "idCard": "111111111",
          "gender": "F",
          "dob": "1999-01-26",
          "citizen": "CITIZEN",
          "country": "INDONESIA",
          "statusForeign": "JJG",
          "postCode": "",
          "ticketName": "Daily Pass Saturday"
        }
      ]
    }
    currentPage.validateNik()
  })

})

describe("toogle tab button", () => {
  it("switch on 1", () => {

    currentPage.data.ticketIndex = 1
    currentPage.data.toggleTabDisabled = [{
        toggleTabDisabled: 1
      },
      {
        toggleTabDisabled: 1
      }
    ]

    vi.spyOn(currentPage, 'validateOrderRequest')
    vi.spyOn(currentPage, 'onSwitch')
    vi.spyOn(currentPage, 'onBlurInput')
    vi.spyOn(currentPage, 'onFocus')
    currentPage.data.switchStatus = false
    currentPage.personalData = {
      citizen: 'Foreign'
    }
    currentPage.data.lovData = {
      "gender": [{
          "lovValue": "M",
          "lovKey": "lifestyle-javajazz.input-data.gender.male",
          "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenGenderMaleModal"
        },
        {
          "lovValue": "F",
          "lovKey": "lifestyle-javajazz.input-data.gender.female",
          "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenGenderFemaleModal"
        }
      ],
      "citizen": [{
          "lovValue": "Indonesia",
          "lovKey": "lifestyle-javajazz.input-data.citizen.wni",
          "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenWNILabel"
        },
        {
          "lovValue": "Foreign",
          "lovKey": "lifestyle-javajazz.input-data.citizen.wna",
          "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenWNALabel"
        }
      ],
      "status-foreign": [{
          "lovValue": "Visit for JJF",
          "lovKey": "lifestyle-javajazz.input-data.status-foreign.visitor",
          "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenVisitorOfJJFLabel"
        },
        {
          "lovValue": "Limited / Permanent Residence",
          "lovKey": "lifestyle-javajazz.input-data.status-foreign.residence",
          "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenLimitedResidenceLabel"
        }
      ]
    }
    currentPage.onSwitch()
    currentPage.onBlurInput({
      currentTarget: {
        dataset: {
          inputSection: "idCard"
        }
      }
    })
    currentPage.setData({
      switchStatus: false
    })
    currentPage.onFocus({
      currentTarget: {
        dataset: {
          inputSection: "idCard"
        }
      }
    })
    currentPage.validateOrderRequest()
  })
  it("switch on 2", () => {
    vi.spyOn(currentPage, 'validateOrderRequest')
    vi.spyOn(currentPage, 'onSwitch')
    vi.spyOn(currentPage, 'onBlurInput')
    vi.spyOn(currentPage, 'onFocus')
    currentPage.data.switchStatus = false
    currentPage.personalData = {
      citizen: 'Foreign',
      nationality: 'ID'
    }
    currentPage.data.lovData = {
      "gender": [{
          "lovValue": "M",
          "lovKey": "lifestyle-javajazz.input-data.gender.male",
          "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenGenderMaleModal"
        },
        {
          "lovValue": "F",
          "lovKey": "lifestyle-javajazz.input-data.gender.female",
          "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenGenderFemaleModal"
        }
      ],
      "citizen": [{
          "lovValue": "Indonesia",
          "lovKey": "lifestyle-javajazz.input-data.citizen.wni",
          "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenWNILabel"
        },
        {
          "lovValue": "Foreign",
          "lovKey": "lifestyle-javajazz.input-data.citizen.wna",
          "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenWNALabel"
        }
      ],
      "status-foreign": [{
          "lovValue": "Visit for JJF",
          "lovKey": "lifestyle-javajazz.input-data.status-foreign.visitor",
          "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenVisitorOfJJFLabel"
        },
        {
          "lovValue": "Limited / Permanent Residence",
          "lovKey": "lifestyle-javajazz.input-data.status-foreign.residence",
          "lovDisplay": "javaJazzFestivalListInputDataVisitorScreenLimitedResidenceLabel"
        }
      ]
    }
    currentPage.onSwitch();
    currentPage.onBlurInput({
      currentTarget: {
        dataset: {
          inputSection: "idCard"
        }
      }
    })
    currentPage.setData({
      switchStatus: true
    })
    currentPage.onFocus({
      currentTarget: {
        dataset: {
          inputSection: "idCard"
        }
      }
    })
    currentPage.validateOrderRequest()

  })

  it("switch on 3", async () => {

    currentPage.data.ticketIndex = 1
    currentPage.data.toggleTabDisabled = [{
        toggleTabDisabled: 1
      },
      {
        toggleTabDisabled: 1
      }
    ]
    vi.spyOn(currentPage, 'onSwitch')
    vi.spyOn(currentPage, 'onBlurInput')
    vi.spyOn(currentPage, 'onFocus')
    currentPage.switchStatus = false
    currentPage.personalData = {
      citizen: 'Foreign'
    }
    currentPage.data.lovData = {
      gender: "F",
      citizen: "indo"
    }

    currentPage.onSwitch()
    currentPage.onBlurInput({
      currentTarget: {
        dataset: {
          inputSection: "idCard"
        }
      }
    })
    await new Promise(resolve => setTimeout(resolve, 100));

    currentPage.setData({
      switchStatus: false
    })

    currentPage.data.switchStatus = 1
    currentPage.onFocus({
      currentTarget: {
        dataset: {
          inputSection: "idCard"
        }
      }
    })
  })
})

describe("onChange", () => {

  it("should change the input", async () => {

    currentPage.onChangeName({
      currentTarget: {
        dataset: {
          inputSection: "c"
        }
      },
      detail: {
        value: "yoyoyoyoyo"
      }
    })
  })

  it("should change the input", async () => {

    currentPage.onChangeName({
      currentTarget: {
        dataset: {
          inputSection: "fullname"
        }
      },
      detail: {
        value: "yoyoyoyoyo"
      }
    })
  })

  it("should change the input idcard CITIZEN invalid", async () => {

    vi.spyOn(currentPage, 'onChangeIdCard')
    currentPage.data.orderRequest = {
      ...currentPage.data.orderRequest,
      customerTicket: [{
        fullname: 'yoyoyoyoyo',
        idCard: '1234567891234562',
        gender: 'F',
        dob: '1999-01-26',
        citizen: 'Foreign',
        country: 'INDONESIA',
        statusForeign: '',
        postCode: '14120',
        ticketName: 'Daily Pass Saturday'
      }]
    }


    currentPage.onChangeIdCard({
      currentTarget: {
        dataset: {
          inputSection: "idCard"
        }
      },
      detail: {
        value: "123"
      }
    })
  })


  it("should change the input idcard CITIZEN >6", async () => {

    vi.spyOn(currentPage, 'onChangeIdCard')
    currentPage.data.orderRequest = {
      ...currentPage.data.orderRequest,
      customerTicket: [{
        fullname: 'yoyoyoyoyo',
        idCard: '1234567891234562',
        gender: 'F',
        dob: '1999-01-26',
        citizen: 'Indonesia',
        country: 'INDONESIA',
        statusForeign: '',
        postCode: '14120',
        ticketName: 'Daily Pass Saturday'
      }]
    }


    currentPage.onChangeIdCard({
      currentTarget: {
        dataset: {
          inputSection: "idCard"
        }
      },
      detail: {
        value: "1232222222222222"
      }
    })
  })

  it("should change the input idcard CITIZEN <6", async () => {

    vi.spyOn(currentPage, 'onChangeIdCard')
    currentPage.data.orderRequest = {
      ...currentPage.data.orderRequest,
      customerTicket: [{
        fullname: 'yoyoyoyoyo',
        idCard: '1234567891234562',
        gender: 'F',
        dob: '1999-01-26',
        citizen: 'Indonesia',
        country: 'INDONESIA',
        statusForeign: '',
        postCode: '14120',
        ticketName: 'Daily Pass Saturday'
      }]
    }


    currentPage.onChangeIdCard({
      currentTarget: {
        dataset: {
          inputSection: "idCard"
        }
      },
      detail: {
        value: "11"
      }
    })
  })

  it('onChange birthDate', () => {
    vi.spyOn(currentPage, 'onChangeBirthdateInput')
    currentPage.data.birthDateFocusStatus = 'year'
    currentPage.data.birthDateValue.year = 0
    currentPage.onChangeBirthdateInput("10")
  })

  it('onChange birthDate', () => {
    vi.spyOn(currentPage, 'onChangeBirthdateInput')
    currentPage.data.birthDateFocusStatus = 'month'
    currentPage.onChangeBirthdateInput("10")
  })
  it('onChange birthDate', () => {
    vi.spyOn(currentPage, 'onChangeBirthdateInput')
    currentPage.data.birthDateFocusStatus = 'day'
    currentPage.onChangeBirthdateInput("10")
  })
  it('onChange birthDate', () => {
    vi.spyOn(currentPage, 'onChangeBirthdateInput')
    currentPage.data.birthDateFocusStatus = 'day'
    currentPage.onChangeBirthdateInput("102")
  })
  it('onChange birthDate', () => {
    vi.spyOn(currentPage, 'onChangeBirthdateInput')
    currentPage.data.birthDateFocusStatus = 'day'
    currentPage.onChangeBirthdateInput("34")
  })
  it('onChange birthDate', () => {
    vi.spyOn(currentPage, 'onChangeBirthdateInput')
    currentPage.data.birthDateFocusStatus = 'month'
    currentPage.onChangeBirthdateInput("13")
  })
  it('onChange birthDate', () => {
    vi.spyOn(currentPage, 'onChangeBirthdateInput')
    currentPage.data.birthDateFocusStatus = 'year'
    currentPage.onChangeBirthdateInput("8000")
  })
  it('onChange birthDate', () => {
    vi.spyOn(currentPage, 'onChangeBirthdateInput')
    currentPage.data.birthDateFocusStatus = 'year'
    currentPage.data.birthDateValue.year = '01'
    currentPage.validateBirthDateInput("8000")
  })

  it('onChange birthDate', () => {
    vi.spyOn(currentPage, 'onChangeBirthdateInput')
    currentPage.data.birthDateFocusStatus = 'year'
    currentPage.data.birthDateValue = {
      day: '01',
      month: '12',
      year: '2023'
    }
    currentPage.validateBirthDateInput("2023-12-01")
  })


  it('onChange birthDate', () => {
    vi.spyOn(currentPage, 'onChangeBirthdateInput')
    currentPage.data.birthDateFocusStatus = 'month'
    currentPage.data.birthDateValue = {
      day: '01',
      month: '12',
      year: '2023'
    }
    currentPage.validateBirthDateInput("2023-12-01")
  })

  it('onChange birthDate', () => {
    vi.spyOn(currentPage, 'onChangeBirthdateInput')
    currentPage.data.birthDateFocusStatus = 'day'
    currentPage.data.birthDateValue = {
      day: '01',
      month: '12',
      year: ''
    }
    currentPage.validateBirthDateInput("-12-01")
  })


  it('onChange birthDate', () => {
    vi.spyOn(currentPage, 'onChangeBirthdateInput')
    currentPage.data.birthDateFocusStatus = 'day'
    currentPage.data.birthDateValue = {
      day: '00',
      month: '12',
      year: ''
    }
    currentPage.validateBirthDateInput("-12-01")
  })


  it('onChange birthDate', () => {
    vi.spyOn(currentPage, 'onChangeBirthdateInput')
    currentPage.data.birthDateFocusStatus = 'day'
    currentPage.data.visitorIndex = 0
    currentPage.data.orderRequest["customerTicket"][currentPage.data.visitorIndex].dob = "2023-10-11"
    currentPage.data.birthDateValue = {
      day: '00',
      month: '12',
      year: ''
    }
    currentPage.validateBirthDateInput("2012-12-01")
  })

  it('onChange birthDate', () => {
    vi.spyOn(currentPage, 'onChangeBirthdateInput')
    currentPage.data.birthDateFocusStatus = 'day'
    currentPage.data.visitorIndex = 0
    currentPage.data.orderRequest["customerTicket"][currentPage.data.visitorIndex].dob = "2023-10-11"
    currentPage.data.birthDateValue = {
      day: '00',
      month: '12',
      year: '2021'
    }
    currentPage.validateBirthDateInput("2012-12-01")
  })

  it('onChange birthDate', () => {
    vi.spyOn(currentPage, 'onChangeBirthdateInput')
    currentPage.data.birthDateFocusStatus = 'month'
    currentPage.data.visitorIndex = 0
    currentPage.data.orderRequest["customerTicket"][currentPage.data.visitorIndex].dob = "2023-10-11"
    currentPage.data.birthDateValue = {
      day: '00',
      month: '12',
      year: '2021'
    }
    currentPage.validateBirthDateInput("2012-12-01")
  })

})
describe("handle pop up ", () => {
  it("should select the popup value", () => {
    vi.spyOn(currentPage, 'onHandleSelectPopUpContent')
    currentPage.data.activePopup = 'citizen'
    currentPage.data.orderRequest = {
      ...currentPage.data.orderRequest,
      customerTicket: [{
        fullname: 'yoyoyoyoyo',
        idCard: '1234567891234562',
        gender: 'F',
        dob: '1999-01-26',
        citizen: 'Foreign',
        country: 'INDONESIA',
        statusForeign: '',
        postCode: '14120',
        ticketName: 'Daily Pass Saturday'
      }]
    }
    currentPage.onHandleSelectPopUpContent({
      currentTarget: {
        dataset: {
          selectedPopupValue: {
            "lovValue": "Foreign"
          }
        }
      }
    })
  })
  it("should select the popup value", () => {
    vi.spyOn(currentPage, 'onHandleSelectPopUpContent')
    currentPage.data.activePopup = 'citizen'
    currentPage.data.orderRequest = {
      ...currentPage.data.orderRequest,
      customerTicket: [{
        fullname: 'yoyoyoyoyo',
        idCard: '1234567891234562',
        gender: 'F',
        dob: '1999-01-26',
        citizen: 'Foreign',
        country: 'INDONESIA',
        statusForeign: '',
        postCode: '14120',
        ticketName: 'Daily Pass Saturday'
      }]
    }
    currentPage.onHandleSelectPopUpContent({
      currentTarget: {
        dataset: {
          selectedPopupValue: {
            "lovValue": "Indonesia"
          }
        }
      }
    })
  })

  it("should select the popup value", () => {
    vi.spyOn(currentPage, 'onHandleSelectPopUpContent')
    currentPage.data.activePopup = 'gender'
    currentPage.data.orderRequest = {
      ...currentPage.data.orderRequest,
      customerTicket: [{
        fullname: 'yoyoyoyoyo',
        idCard: '1234567891234562',
        gender: 'F',
        dob: '1999-01-26',
        citizen: 'Foreign',
        country: 'INDONESIA',
        statusForeign: '',
        postCode: '14120',
        ticketName: 'Daily Pass Saturday'
      }]
    }
    currentPage.onHandleSelectPopUpContent({
      currentTarget: {
        dataset: {
          selectedPopupValue: {
            "LOV_VALUE": "F"
          }
        }
      }
    })
    currentPage.onClosePopup()
  })
  it("should handle the full popup", () => {
    vi.spyOn(currentPage, 'handleFullPopup')

    currentPage.handleFullPopup({
      currentTarget: {
        dataset: {
          selectedPopup: "postCode"
        }
      }
    })
  })

  it("should handle the full popup", () => {
    vi.spyOn(currentPage, 'handleFullPopup')

    currentPage.handleFullPopup({
      currentTarget: {
        dataset: {
          selectedPopup: "postCode"
        }
      }
    })
  })


  it("should handle the full popup", () => {
    vi.spyOn(currentPage, 'handleFullPopup')
    currentPage.data.switchStatus = 1
    currentPage.handleFullPopup({
      currentTarget: {
        dataset: {
          selectedPopup: "postCode"
        }
      }
    })
  })
  it("should handle the full popup but disabled", () => {
    vi.spyOn(currentPage, 'handleFullPopup')
    vi.spyOn(currentPage, 'onCloseFullPopup')
    currentPage.data.orderRequest.customerTicket[currentPage.data.visitorIndex].urbanv = "sas"
    currentPage.data.switchStatus = false
    currentPage.handleFullPopup({
      currentTarget: {
        dataset: {
          selectedPopup: "postCode"
        }
      }
    })
    currentPage.onCloseFullPopup()
  })
  it("should handle the full popup but disabled", () => {
    vi.spyOn(currentPage, 'handleFullPopup')
    vi.spyOn(currentPage, 'onCloseFullPopup')

    currentPage.data.switchStatus = true
    currentPage.handleFullPopup({
      currentTarget: {
        dataset: {
          selectedPopup: "postCode"
        }
      }
    })
    currentPage.onCloseFullPopup()
  })
  it("should select the full popup content ", () => {
    vi.spyOn(currentPage, 'onHandleSelectFullPopUpContent')

    currentPage.data.switchStatus = true
    currentPage.onHandleSelectFullPopUpContent({
      currentTarget: {
        dataset: {
          selectedPopup: "postCode",
          selectedPopupValue: {
            postalCode: "sadsad"
          }
        }
      }
    })
  })
  it("should select the full popup content ", () => {
    vi.spyOn(currentPage, 'onHandleSelectFullPopUpContent')

    currentPage.data.switchStatus = true
    currentPage.onHandleSelectFullPopUpContent({
      currentTarget: {
        dataset: {
          selectedPopup: "country",
          selectedPopupValue: {
            countryName: "sadsad"
          }
        }
      }
    })
  })
})


describe("handle navigate back to visitor list 1", () => {
  it("should navigateback", () => {
    vi.spyOn(currentPage, 'populateVisitorInput')

    currentPage.data.orderRequest["customerTicket"][1] = {
      dob: "aaa-1",
      urbanv: "asa",
      gender: "F",
      statusForeign: "Visit for JJF",
      country: "Indonesia"
    }

    currentPage.data.visitorIndex = 1

    currentPage.populateVisitorInput()
  })


})

describe("handle navigate back to visitor list 2", () => {

  it("should navigateback 1", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    currentPage.data.visitorIndex = -1
    currentPage.data.ticketIndex = 1
    currentPage.data.selectedTicket[currentPage.data.ticketIndex] = {}

    currentPage.orderRequest = {
      ticketTotal: 8
    }
    currentPage.data.visitorIndex = 1

    currentPage.navigateBackToVisitorList()
  })


  it("should navigateback 1x", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    currentPage.data.visitorIndex = 1
    currentPage.data.ticketIndex = 1
    currentPage.data.selectedTicket[currentPage.data.ticketIndex] = {}

    currentPage.orderRequest = {
      ticketTotal: 8
    }
    currentPage.data.visitorIndex = 1

    currentPage.navigateBackToVisitorList()
  })

  it('onFocusInput', () => {
    currentPage.onFocusInput()
  })


  it('onFocus', () => {
    vi.spyOn(currentPage, 'onFocus')
    currentPage.data.focusInputSection.idCard = true
    my.getSystemInfoSync().platform = "Android"
    currentPage.onFocus({
      focusInputSection: {
        idCard: 121
      }
    })
  })

  it("should navigateback 12", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    currentPage.data.visitorIndex = 0
    currentPage.data.ticketIndex = 0
    currentPage.orderRequest = {
      ticketQty: 8
    }
    currentPage.data.selectedTicket = [{
      "maxOrder": 3,
      "ticketIdList": [
        842,
        1002,
        741
      ],
      "tickets": [{
        "priceTaxService": 10000,
        "ticketId": "1002",
        "ticketName": "Daily Pass Friday",
        "description": [
          "Harga sudah termasuk pajak dan biaya admin",
          "Tiket hanya valid untuk 1 hari"
        ],
        "type": "regular",
        "oldPrice": 6000,
        "category": "daily_pass",
        "isAvailable": 1,
        "price": 6000,
        "countAdd": 1,
        "ticketDate": "Friday, 30 May 2025",
        "formatedTicketDate": "Jumat, 30 Mei 2025",
        "formatPriceTaxService": "Rp10.000",
        "count": 0,
        "total": 1,
        "oldPriceFormat": "Rp6.000",
        "maxOrder": 4,
        "title": "Daily Pass Friday",
        "totalPrice": 10000,
        "orderAdd": 1
      }],
      "total": 1,
      "customerTicketTemp": [{
        "ticketId": "1002",
        "index": 0,
        "customerData": {
          "fullName": "Ilham Nasution",
          "idCard": "1412023423423423",
          "gender": "F",
          "dob": "1999-01-26",
          "citizen": "Indonesia",
          "country": "Indonesia",
          "statusForeign": "",
          "postCode": "1122",
          "ticketName": "Daily Pass Friday",
          "ticketDate": "Friday, 30 May 2025",
          "urbanv": "ulu"
        }
      }],
      "customerTicketCount": 1,
      "amount": 10000,
      "ticketDate": "30 Mei 2025"
    }]
    currentPage.data.visitorIndex = 1

    currentPage.navigateBackToVisitorList()
  })
  it("should navigateback 2", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    currentPage.data.orderRequest.ticketTotal = 2
    currentPage.data.ticketIndex = 0

    currentPage.data.selectedTicket = [{
      "maxOrder": 3,
      "ticketIdList": [
        842,
        1002,
        741
      ],
      "tickets": [{
        "priceTaxService": 10000,
        "ticketId": "1002",
        "ticketName": "Daily Pass Friday",
        "description": [
          "Harga sudah termasuk pajak dan biaya admin",
          "Tiket hanya valid untuk 1 hari"
        ],
        "type": "regular",
        "oldPrice": 6000,
        "category": "daily_pass",
        "isAvailable": 1,
        "price": 6000,
        "countAdd": 1,
        "ticketDate": "Friday, 30 May 2025",
        "formatedTicketDate": "Jumat, 30 Mei 2025",
        "formatPriceTaxService": "Rp10.000",
        "count": 0,
        "total": 1,
        "oldPriceFormat": "Rp6.000",
        "maxOrder": 4,
        "title": "Daily Pass Friday",
        "totalPrice": 10000,
        "orderAdd": 1
      }],
      "total": 1,
      "customerTicketTemp": [{
        "ticketId": "1002",
        "index": 0,
        "customerData": {
          "fullName": "Ilham Nasution",
          "idCard": "1412023423423423",
          "gender": "F",
          "dob": "1999-01-26",
          "citizen": "Indonesia",
          "country": "Indonesia",
          "statusForeign": "",
          "postCode": "1122",
          "ticketName": "Daily Pass Friday",
          "ticketDate": "Friday, 30 May 2025",
          "urbanv": "ulu"
        }
      }],
      "customerTicketCount": 1,
      "amount": 10000,
      "ticketDate": "30 Mei 2025"
    }]
    currentPage.orderRequest = {
      ticketQty: 8
    }
    currentPage.data.visitorIndex = 1

    currentPage.navigateBackToVisitorList()
  })

  it("should navigateback 33", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    currentPage.data.orderRequest.ticketTotal = 2
    currentPage.data.visitorIndex = 1
    currentPage.data.orderRequest = {
        ticketQty: 1,
        customerTicket: [{
          citizen: "",
          idCard: 1
        }, {
          citizen: "",
          idCard: 1
        }]
      },
      currentPage.navigateBackToVisitorList()
  })
  it("should navigateback 3", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    currentPage.data.visitorIndex = 1
    currentPage.data.orderRequest = {
        ticketQty: 1,
        customerTicket: [{
          citizen: "",
          idCard: 1
        }, {
          citizen: "",
          idCard: 1
        }]
      },
      currentPage.navigateBackToVisitorList()
  })
  it("should navigateback 4", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    vi.spyOn(currentPage, 'birthDateInputOnFocus')
    my.customUrlQueryData['visitor-input-screen'] = {
      personalData: {
        "fullName": "Ilham Nasution",
        "email": "ilhamnasution@gmail.com",
        "phone": "085888746402",
        "gender": "F",
        "dateBirth": "26",
        "monthBirth": "01",
        "yearBirth": "1999",
        "nationality": "ID",
        "nik": "1231232131123211",
        "subdistrict": "CILINCING",
        "postalCode": "14120"
      },
      tickets: {
        "name": "Ilham Nasution",
        "email": "ilhamnasution@gmail.com",
        "phone": "085888746402",
        "gender": "F",
        "ticketId": 843,
        "ticketQty": 2,
        "category": "daily_pass",
        "type": "b1g2",
        "oldPrice": 850000,
        "price": 525000,
        "priceTaxService": 637500,
        "customerTicket": [{
            "fullname": "",
            "idCard": "",
            "gender": "",
            "dob": "",
            "citizen": "INDONESIA",
            "country": "INDONESIA",
            "statusForeign": "",
            "postCode": "",
            "ticketName": "Daily Pass Saturday"
          },
          {
            "fullname": "",
            "idCard": "",
            "gender": "",
            "dob": "",
            "citizen": "INDONESIA",
            "country": "INDONESIA",
            "statusForeign": "",
            "postCode": "",
            "ticketName": "Daily Pass Saturday"
          }
        ]
      },
      ticketIndex: true,
      visitorIndex: 0
    };
    currentPage.navigateBackToVisitorList()
    currentPage.birthDateInputOnFocus('month')
  })


  it("should navigateback 5", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    vi.spyOn(currentPage, 'birthDateInputOnFocus')
    currentPage.data.birthDateValue['day'] = 9
    currentPage.data.birthDateFocusStatus = 'month'
    currentPage.navigateBackToVisitorList()
    currentPage.birthDateInputOnFocus('month')
  })

  it("should navigateback 5", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    vi.spyOn(currentPage, 'birthDateInputOnFocus')
    currentPage.data.birthDateValue.day = 9
    currentPage.data.birthDateValue.month = ""
    currentPage.data.birthDateFocusStatus = 'day'
    currentPage.navigateBackToVisitorList()
    currentPage.birthDateInputOnFocus('month')
  })

  it("should navigateback 5", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    vi.spyOn(currentPage, 'birthDateInputOnFocus')
    currentPage.data.birthDateValue.month = 9
    currentPage.data.birthDateFocusStatus = 'day'
    currentPage.navigateBackToVisitorList()
    currentPage.birthDateInputOnFocus('month')
  })

  it("should navigateback 61", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    vi.spyOn(currentPage, 'birthDateInputOnFocus')
    currentPage.data.birthDateValue['day'] = 9
    currentPage.navigateBackToVisitorList()
    currentPage.birthDateInputOnFocus('year')
  })
  it("should navigateback 62", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    vi.spyOn(currentPage, 'birthDateInputOnFocus')
    currentPage.data.birthDateValue['day'] = '00'
    currentPage.navigateBackToVisitorList()
    currentPage.birthDateInputOnFocus('year')
  })

  it("should navigateback 63", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    vi.spyOn(currentPage, 'birthDateInputOnFocus')
    currentPage.data.birthDateValue['year'] = '0'
    currentPage.navigateBackToVisitorList()
    currentPage.birthDateInputOnFocus('year')
  })

  it("should navigateback 64", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    vi.spyOn(currentPage, 'birthDateInputOnFocus')
    currentPage.data.birthDateValue['day'] = '0'
    currentPage.navigateBackToVisitorList()
    currentPage.birthDateInputOnFocus('year')
  })
  it("should navigateback 65", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    vi.spyOn(currentPage, 'birthDateInputOnFocus')
    currentPage.data.birthDateValue['day'] = '0'
    currentPage.data.visitorIndex = 1
    const birthDate = currentPage.data.orderRequest["customerTicket"][currentPage.data.visitorIndex].dob = "1995-11-2"
    const birthDateDayjs = dayjs(birthDate)
    const today = dayjs();
    birthDateDayjs.isBefore(today)
    currentPage.onKeyboardClose()
  })

  it("should navigateback 6", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    vi.spyOn(currentPage, 'birthDateInputOnFocus')
    currentPage.data.birthDateValue = {
      day: 11,
      month: 12,
      year: 2222
    }
    currentPage.data.visitorIndex = 1
    const birthDate = currentPage.data.orderRequest["customerTicket"][currentPage.data.visitorIndex].dob = "2995-11-2"
    const birthDateDayjs = dayjs(birthDate)
    const today = dayjs();
    birthDateDayjs.isAfter(today)
    currentPage.validateBirthDateInput()
  })


  it("should navigateback 6", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    vi.spyOn(currentPage, 'birthDateInputOnFocus')
    currentPage.data.birthDateInputOnFocus = 'month'
    currentPage.data.birthDateValue = {
      day: 111,
      month: 122,
      year: 2222
    }
    currentPage.data.visitorIndex = 1
    const birthDate = currentPage.data.orderRequest["customerTicket"][currentPage.data.visitorIndex].dob = "2995-11-2"
    const birthDateDayjs = dayjs(birthDate)
    const today = dayjs();
    birthDateDayjs.isAfter(today)
    currentPage.validateBirthDateInput()
  })

  it("should navigateback 6", () => {
    vi.spyOn(currentPage, 'navigateBackToVisitorList')
    vi.spyOn(currentPage, 'birthDateInputOnFocus')
    currentPage.data.birthDateValue = {
      day: 11,
      month: 12,
      year: 2222
    }
    currentPage.data.visitorIndex = 1
    const birthDate = currentPage.data.orderRequest["customerTicket"][currentPage.data.visitorIndex].dob = "2995-11-2"
    const birthDateDayjs = dayjs(birthDate)
    const today = dayjs();
    dayjs(currentPage.data.birthDateValue).year()
    birthDateDayjs.isAfter(today)
    currentPage.validateBirthDateInput()
  })

})

describe('clear button', () => {
  it('clear button', () => {
    const test = vi.fn()
    vi.spyOn(currentPage, 'clearButton')
    vi.spyOn(debounce, 'debounce')
    const mockGeneralErrorFunc = {
      setData: vi.fn(),
      $page: {
        setData: vi.fn()
      }
    };
    global.getCurrentPages = vi.fn(() => [mockGeneralErrorFunc]);

    currentPage.clearButton({
      currentTarget: {
        dataset: {
          inputSection: 'idCard'
        }
      }
    })
    debounce.debounce(test, 200, currentPage.data.timeoutId, createPage(currentPage), "tes")
  })
  it('clear button', () => {
    const test = vi.fn()
    vi.spyOn(currentPage, 'clearButton')
    vi.spyOn(debounce, 'debounce')
    currentPage.data.switchStatus = false
    currentPage.clearButton({
      currentTarget: {
        dataset: {
          inputSection: 'idCard'
        }
      }
    })

    debounce.debounce(test, 200, currentPage.data.timeoutId, currentPage, "tes")

  })
  it('clear button birthDate', () => {
    vi.spyOn(currentPage, 'birthDateClear')
    currentPage.birthDateClear({
      currentTarget: {
        dataset: {
          inputSection: 'month'
        }
      }
    })
  })
  it('clear button search', () => {
    vi.spyOn(currentPage, 'clearSearch')
    currentPage.clearSearch()
  })

})

describe("search", () => {
  it("search value", () => {
    vi.spyOn(currentPage, "onSearch")
    vi.spyOn(debounce, "debounce")
    currentPage.data.fullPopupCurrentlyActive = "countries"
    currentPage.data.countriesData = [{
        "countryId": "ID",
        "countryImage": ["1F1F2", "1F1FE"],
        "callingPrefix": "62",
        "countryName": "Indonesia"
      },
      {
        "countryId": "US",
        "countryImage": ["1F1F2", "1F1FE"],
        "callingPrefix": "1",
        "countryName": "Amerika"
      },
      {
        "countryId": "US",
        "countryImage": ["1F1F2", "1F1FE"],
        "callingPrefix": "1",
        "countryName": "Amerika"
      },
      {
        "countryId": "US",
        "countryImage": ["1F1F2", "1F1FE"],
        "callingPrefix": "1",
        "countryName": "Amerika"
      },
      {
        "countryId": "US",
        "countryImage": ["1F1F2", "1F1FE"],
        "callingPrefix": "1",
        "countryName": "Amerika"
      },
      {
        "countryId": "US",
        "countryImage": ["1F1F2", "1F1FE"],
        "callingPrefix": "1",
        "countryName": "Amerika"
      },
      {
        "countryId": "US",
        "countryImage": ["1F1F2", "1F1FE"],
        "callingPrefix": "1",
        "countryName": "Amerika"
      },
      {
        "countryId": "US",
        "countryImage": ["1F1F2", "1F1FE"],
        "callingPrefix": "1",
        "countryName": "Amerika"
      },
      {
        "countryId": "US",
        "countryImage": ["1F1F2", "1F1FE"],
        "callingPrefix": "1",
        "countryName": "Amerika"
      },
      {
        "countryId": "US",
        "countryImage": ["1F1F2", "1F1FE"],
        "callingPrefix": "1",
        "countryName": "Amerika"
      },
      {
        "countryId": "US",
        "countryImage": ["1F1F2", "1F1FE"],
        "callingPrefix": "1",
        "countryName": "Amerika"
      },
      {
        "countryId": "US",
        "countryImage": ["1F1F2", "1F1FE"],
        "callingPrefix": "1",
        "countryName": "Amerika"
      },
      {
        "countryId": "US",
        "countryImage": ["1F1F2", "1F1FE"],
        "callingPrefix": "1",
        "countryName": "Amerika"
      },
      {
        "countryId": "US",
        "countryImage": ["1F1F2", "1F1FE"],
        "callingPrefix": "1",
        "countryName": "Amerika"
      },
      {
        "countryId": "US",
        "countryImage": ["1F1F2", "1F1FE"],
        "callingPrefix": "1",
        "countryName": "Amerika"
      }
    ]

    currentPage.onSearch({
      detail: {
        value: "tt"
      }
    })
  })
  it("search value", () => {
    vi.spyOn(currentPage, "onSearch")

    currentPage.data.fullPopupCurrentlyActive = "postalCode"


    currentPage.onSearch({
      detail: {
        value: "t"
      }
    })
  })


  it("search value", () => {
    vi.spyOn(currentPage, "onSearch")

    currentPage.data.fullPopupCurrentlyActive = "postalCode"


    currentPage.onSearch({
      detail: {
        value: "t"
      }
    })
  })


  it("search value", () => {
    vi.spyOn(currentPage, "onSearch")

    currentPage.data.fullPopupCurrentlyActive = "postalCodeX"


    currentPage.onSearch({
      detail: {}
    })
  })


  it("fetchPostalCode", () => {
    vi.spyOn(currentPage, "fetchPostalCode")

    currentPage.fetchPostalCode()
  })


  it('clear button', () => {
    const test = vi.fn()
    vi.spyOn(currentPage, 'handlePopUp')
    currentPage.handlePopUp({
      currentTarget: {
        dataset: {
          inputSection: 'idCard'
        }
      }
    })
    currentPage.handlePopUp(test, 200)
  })

  it('clear button', () => {
    const test = vi.fn()
    currentPage.data.switchStatus = 1
    vi.spyOn(currentPage, 'handlePopUp')
    currentPage.handlePopUp({
      currentTarget: {
        dataset: {
          inputSection: 'idCard'
        }
      }
    })
    currentPage.handlePopUp(test, 200)
  })
})

describe('func handleLazyLoadPostal', () => {
  it('should add data from pagination', () => {

    vi.spyOn(currentPage, 'handleLazyLoadPostal')
    currentPage.handleLazyLoadPostal()

  });
  it('should add data from pagination', () => {

    vi.spyOn(currentPage, 'resetBirthDate')

    currentPage.resetBirthDate()
  });
  it('should add data from pagination', () => {

    vi.spyOn(currentPage, 'onFocusSearch')

    currentPage.onFocusSearch()
  });
  it('should add data from pagination', () => {

    vi.spyOn(currentPage, 'onBlurSearch')

    currentPage.onBlurSearch()
  });
  it('should add data from pagination', () => {

    vi.spyOn(currentPage, 'setBirthDate')

    currentPage.setBirthDate.call(currentPage, "1111-11-11");
  });



});

describe('moveToNextVisitor', () => {

  it('should set birth date when next visitor has dob', () => {
    vi.spyOn(currentPage, 'moveToNextVisitor')
    currentPage.data = {
      visitorIndex: 0,
      orderRequest: {
        customerTicket: [{
            dob: '1990-01-01',
            urbanv: 'asasd',
            gender: 'M'
          },
          {
            dob: '1992-02-02',
            urbanv: 'asasd',
            gender: 'M'
          }
        ]
      }
    };
    currentPage.data.orderRequest.customerTicket[currentPage.data.visitorIndex + 1].urbanv = "asa"

    currentPage.populateVisitorInput();

  });

  it('should set birth date when next visitor has dob', () => {
    vi.spyOn(currentPage, 'moveToNextVisitor')
    currentPage.data = {
      visitorIndex: 0,
      orderRequest: {
        customerTicket: [{
            dob: '1990-01-01',
            urbanv: 'asasd',
            gender: ''
          },
          {
            dob: '1992-02-02',
            urbanv: 'asasd',
            gender: ''
          }
        ]
      }
    };
    currentPage.data.orderRequest.customerTicket[currentPage.data.visitorIndex + 1].urbanv = "asa"

    currentPage.populateVisitorInput();

  });


  it('should set birth date when next visitor has dob', () => {
    vi.spyOn(currentPage, 'moveToNextVisitor')
    currentPage.data = {
      visitorIndex: 0,
      orderRequest: {
        customerTicket: [{
            dob: '1990-01-01',
            urbanv: 'asasd',
            gender: ''
          },
          {
            dob: '1992-02-02',
            urbanv: 'asasd',
            gender: ''
          }
        ]
      }
    };
    currentPage.data.orderRequest.customerTicket[currentPage.data.visitorIndex + 1].urbanv = "asa"

    currentPage.moveToNextVisitor.call(currentPage, currentPage.data.orderRequest);

  });


  it('should set birth date when next visitor has dob', () => {
    vi.spyOn(currentPage, 'moveToNextVisitor')
    currentPage.data = {
      visitorIndex: 0,
      orderRequest: {
        customerTicket: [{
            dob: '1990-01-01',
            urbanv: 'asasd',
            gender: ''
          },
          {
            dob: '1992-02-02',
            urbanv: 'asasd',
            gender: ''
          }
        ]
      }
    };
    currentPage.data.orderRequest.customerTicket[currentPage.data.visitorIndex + 1].urbanv = "asa"

    currentPage.moveToNextVisitor.call(currentPage, currentPage.data.orderRequest);

  });

  it('should set birth date when next visitor has dob', () => {
    vi.spyOn(currentPage, 'moveToNextVisitor')
    currentPage.data = {
      visitorIndex: 0,
      orderRequest: {
        customerTicket: [{
            dob: '1990-01-01',
            urbanv: 'asasd'
          },
          {
            dob: '1992-02-02',
            urbanv: 'asasd'
          }
        ]
      }
    };
    currentPage.data.orderRequest.customerTicket[currentPage.data.visitorIndex + 1].urbanv = "asa"

    currentPage.moveToNextVisitor.call(currentPage, currentPage.data.orderRequest);

  });

  it('should set birth date when next visitor has dob', () => {
    vi.spyOn(currentPage, 'moveToNextVisitor')
    currentPage.data = {
      visitorIndex: 0,
      ticketIndex: 0,
      orderRequest: {
        customerTicket: [{
            dob: '1990-01-01'
          },
          {
            dob: '1992-02-02'
          },
          {
            dob: null
          }
        ]
      },
      selectedTicket: [{
        "maxOrder": 3,
        "ticketIdList": [
          842,
          1002,
          741
        ],
        "tickets": [{
          "priceTaxService": 10000,
          "ticketId": "1002",
          "ticketName": "Daily Pass Friday",
          "description": [
            "Harga sudah termasuk pajak dan biaya admin",
            "Tiket hanya valid untuk 1 hari"
          ],
          "type": "regular",
          "oldPrice": 6000,
          "category": "daily_pass",
          "isAvailable": 1,
          "price": 6000,
          "countAdd": 1,
          "ticketDate": "Friday, 30 May 2025",
          "formatedTicketDate": "Jumat, 30 Mei 2025",
          "formatPriceTaxService": "Rp10.000",
          "count": 0,
          "total": 1,
          "oldPriceFormat": "Rp6.000",
          "maxOrder": 4,
          "title": "Daily Pass Friday",
          "totalPrice": 10000,
          "orderAdd": 1
        }],
        "total": 1,
        "customerTicketTemp": [{
          "ticketId": "1002",
          "index": 0,
          "customerData": {
            "fullName": "Ilham Nasution",
            "idCard": "1412023423423423",
            "gender": "F",
            "dob": "1999-01-26",
            "citizen": "Indonesia",
            "country": "Indonesia",
            "statusForeign": "",
            "postCode": "1122",
            "ticketName": "Daily Pass Friday",
            "ticketDate": "Friday, 30 May 2025",
            "urbanv": "ulu"
          }
        }],
        "customerTicketCount": 1,
        "amount": 10000,
        "ticketDate": "30 Mei 2025"
      }]
    };

    currentPage.moveToNextVisitor.call(currentPage, currentPage.data.orderRequest);

  });

  it('should reset birth date when next visitor does not have dob', () => {
    vi.spyOn(currentPage, 'moveToNextVisitor')

    currentPage.data = {
      visitorIndex: 0,
      orderRequest: {
        customerTicket: [{
            dob: '1990-01-01'
          },
          {
            dob: '1992-02-02'
          },
          {
            dob: null
          }
        ]
      }
    };
    currentPage.data.visitorIndex = 1;
    currentPage.moveToNextVisitor.call(currentPage, currentPage.data.orderRequest);
  });


  it('should reset birth date when next visitor does not have dob', () => {
    vi.spyOn(currentPage, 'moveToNextVisitor')
    currentPage.data = {
      visitorIndex: 0,
      orderRequest: {
        customerTicket: [{
            dob: '1990-01-01',
            gender: "F",
            statusForeign: "Visit for JJF",
            country: "Indonesia"
          },
          {
            dob: '1992-02-02',
            gender: "F",
            statusForeign: "Visit for JJF",
            country: "Indonesia"
          },
          {
            dob: null,
            gender: "F",
            statusForeign: "Visit for JJF",
            country: "Indonesia"
          }
        ]
      }
    };
    currentPage.data.visitorIndex = 1;
    currentPage.moveToNextVisitor.call(currentPage, currentPage.data.orderRequest);
  });
});

describe('function onSwitch and Helper Methods', () => {

  beforeEach(() => {
    currentPage.data = {
      toggleTabDisabled: [{
        toggleTabDisabled: false
      }],
      ticketIndex: 0,
      switchStatus: false,
      personalData: {
        fullName: 'John Doe',
        gender: 'M',
        yearBirth: '1990',
        monthBirth: '01',
        dateBirth: '01',
        nationality: 'ID',
        nik: '1234567890123456',
        postalCode: '12345',
        subdistrict: 'Central Jakarta'
      },
      orderRequest: {
        customerTicket: [{}]
      },
      visitorIndex: 0,
      lovData: {
        gender: [{
          lovValue: 'M',
          lovDisplay: 'Male'
        }],
        citizen: [{
          lovValue: 'Indonesia',
          lovDisplay: 'Indonesia'
        }]
      },
      birthDateValue: {},
      selectedPopupValue: {}
    };
  });

  it('should not switch if toggleTab is disabled', () => {
    currentPage.data.toggleTabDisabled[0].toggleTabDisabled = true;
    currentPage.onSwitch();

    expect(currentPage.data.switchStatus).toBe(false);
  });

  it('should toggle switch status correctly', () => {
    currentPage.onSwitch();

    expect(currentPage.data.switchStatus).toBe(true);
  });

  test('should not call functions when switchStatus is false', () => {
    currentPage.data.switchStatus = false
    currentPage.data.toggleTabDisabled = [{
      toggleTabDisabled: false
    }]

    currentPage.onSwitch();

    expect(currentPage.setData).toHaveBeenCalledWith({
      switchStatus: true,
      clearButton: false
    });
  });


  it('should update customer ticket when switch is turned on', () => {
    currentPage.onSwitch();

    expect(currentPage.data.orderRequest.customerTicket[0]).toEqual({
      fullName: 'John Doe',
      gender: 'M',
      dob: '1990-01-01',
      citizen: 'Indonesia',
      country: 'Indonesia',
      statusForeign: '',
      idCard: '1234567890123456',
      postCode: '12345',
      "urbanv": "Central Jakarta",
    });
  });

  it('should set birthDateValue correctly', () => {
    currentPage.onSwitch();

    expect(currentPage.data.birthDateValue).toEqual({
      day: '01',
      month: '01',
      year: '1990'
    });
  });

  it('should set selectedPopupValue correctly', () => {
    currentPage.onSwitch();

    expect(currentPage.data.selectedPopupValue).toEqual({
      gender: 'Male',
      postCode: {
        subdistrictName: 'Central Jakarta',
        postCode: '12345',
      },
      citizen: 'Indonesia'
    });
  });

  it('should format date of birth correctly', () => {
    const dob = currentPage.formatDOB(currentPage.data.personalData);
    expect(dob).toBe('1990-01-01');
  });

  it('should return correct citizen label', () => {
    const citizenLabel = currentPage.getCitizenLabel('ID');
    expect(citizenLabel).toBe('Indonesia');
  });

  it('should return correct citizen label', () => {
    const citizenLabel = currentPage.getCitizenLabel('IDN');
    expect(citizenLabel).toBe('Foreign');
  });

  it('should return correct country label', () => {
    const countryLabel = currentPage.getCountryLabel('ID');
    expect(countryLabel).toBe('Indonesia');
  });


  it('should return correct country label', () => {
    const countryLabel = currentPage.getCountryLabel('IDN');
    expect(countryLabel).toBe('Foreign');
  });

  it('should return correct status foreign label', () => {
    const statusLabel = currentPage.getStatusForeignLabel('ID');
    expect(statusLabel).toBe('');
  });


  it('should return correct status foreign label', () => {
    const statusLabel = currentPage.getStatusForeignLabel('IDN');
    expect(statusLabel).toBe('Foreign');
  });
});


describe('function onSearch', () => {

  beforeEach(() => {
    currentPage.data = {
      countriesData: [{
          countryName: 'Indonesia'
        },
        {
          countryName: 'Malaysia'
        },
        {
          countryName: 'Singapore'
        }
      ],
      fullPopupCurrentlyActive: 'country',
      searchValue: '',
      filteredCountriesData: [],
      timeoutId: null
    };
    currentPage.fetchPostalCode = vi.fn();

  });

  it('should clear filteredCountriesData for invalid input', async () => {
    const event = {
      detail: {
        value: 'invalid!'
      }
    };

    await currentPage.onSearch(event);

  });

  it('should set searchValue and filter countries for valid input', async () => {
    const event = {
      detail: {
        value: 'Indo'
      }
    };

    await currentPage.onSearch(event);

  });

  it('should call fetchPostalCode when fullPopupCurrentlyActive is postalCode', async () => {
    currentPage.data.fullPopupCurrentlyActive = 'postalCode';
    const event = {
      detail: {
        value: '12345'
      }
    };

    await currentPage.onSearch(event);

  });

  it('should handle errors gracefully', async () => {
    const event = {
      detail: {
        value: 'ValidInput'
      }
    };

    await currentPage.onSearch(event);

  });
});


describe('function onChange', () => {

  beforeEach(() => {
    currentPage.data = {
      orderRequest: {
        customerTicket: [{
          citizen: 'Indonesia',
          idCard: '',
          fullName: ''
        }]
      },
      visitorIndex: 0,
      timer: null,
    };
  });

  it('should filter out non-alphabetic characters for non-idCard input', async () => {
    const event = {
      currentTarget: {
        dataset: {
          inputSection: 'fullName'
        }
      },
      detail: {
        value: 'John Doe123!'
      }
    };

    await currentPage.onChangeName(event);
  });

  it('should handle empty input correctly', async () => {
    const event = {
      currentTarget: {
        dataset: {
          inputSection: 'fullName'
        }
      },
      detail: {
        value: ''
      }
    };

    await currentPage.onChangeName(event);

  });


  it('should filter out non-alphabetic characters for non-idCard input', async () => {
    const event = {
      currentTarget: {
        dataset: {
          inputSection: 'fullName'
        }
      },
      detail: {
        value: 'John Doe123!'
      }
    };

    await currentPage.onChangeName(event);

  });

  it('should handle empty input correctly', async () => {
    const event = {
      currentTarget: {
        dataset: {
          inputSection: 'fullName'
        }
      },
      detail: {
        value: ''
      }
    };

    await currentPage.onChangeName(event);

  });

  it('should return early if the input length is invalid for idCard', async () => {
    const event = {
      currentTarget: {
        dataset: {
          inputSection: 'idCard'
        }
      },
      detail: {
        value: '12345678901234567'
      }
    };

    await currentPage.onChangeIdCard(event);

  });

  it('should set isNikValid correctly when the input length is valid for idCard', async () => {
    const event = {
      currentTarget: {
        dataset: {
          inputSection: 'idCard'
        }
      },
      detail: {
        value: '1234567890123456'
      }
    };

    await currentPage.onChangeIdCard(event);

  });

  it('should update collapseOther and paddingBottom correctly', () => {
    const current = [1, 2]
    currentPage.onChangeCollapse(current);
  });

  it('should update collapseOther and paddingBottom correctly', () => {
    const current = [1, 2]
    currentPage.onChangeCollapseOther(current);
  });

  it('should update collapseOther and paddingBottom correctly', () => {
    const current = [1, 2]
    currentPage.onChangeCollapsePersonal(current);
  });

  // it("exitInputData 1", () => {
  //   currentPage.data.visitorIndex = 1
  //   currentPage.data.orderRequest.customerTicket[currentPage.data.visitorIndex].idCard = 1
  //   currentPage.exitInputData()
  // })
  it("exitInputData 2", () => {
    currentPage.data.visitorIndex = 1
    currentPage.data.ticketIndex = 0
    // currentPage.data.selectedTicket[currentPage.data.ticketIndex].customerTicketTemp[currentPage.data.visitorIndex].customerData;
    
    currentPage.tempInputData = {
      fullName:'11111',
    }
    currentPage.data.selectedTicket = [{
      customerTicketTemp:[
        {
          customerData: {
            idCard:'11111',
            fullName:'11111',
          }
        },
        {
          customerData: {
            idCard:'11111',
            fullName:'11111',
          }
        }
      ]
    }]
    currentPage.data.orderRequest = {
      customerTicket:[
        {
          idCard:'11111'
        },
        {
          idCard:'11111111'
        }
      ]
    }
    currentPage.data.orderRequest.customerTicket[currentPage.data.visitorIndex].idCard = 1
    currentPage.exitInputData()
  })
  // it("exitInputData 3", () => {
  //   currentPage.data.visitorIndex = 1
  //   currentPage.data.orderRequest = {
  //     customerTicket:[
  //       {
  //         idCard:''
  //       },
  //       {
  //         idCard:''
  //       }
  //     ]
  //   }
  //   currentPage.data.orderRequest.customerTicket[currentPage.data.visitorIndex].idCard = 1
  //   currentPage.exitInputData()
  // })

});




describe('country-emoji flag function', () => {
  it('should return the correct flag for a valid country code', () => {
    expect(flag('CL')).toBe('🇨🇱');
    expect(flag('US')).toBe('🇺🇸');
    expect(flag('FR')).toBe('🇫🇷');
  });

  it('should handle lowercase country codes', () => {
    expect(flag('cl')).toBe('🇨🇱');
    expect(flag('us')).toBe('🇺🇸');
  });

});


import dayjs from 'dayjs';

describe('onKeyboardClose', () => {

  test('should call moveToNextVisitor when visitorIndex is less than ticketTotal - 1', () => {
    currentPage.data.visitorIndex = 0;
    currentPage.validateNik()
  });

  it('should check if all keys are filled', () => {
    currentPage.data.birthDateValue = {
      day: '01',
      month: '01',
      year: '2000'
    };

    currentPage.onKeyboardClose();

  });


  it('should check if all keys are filled', async () => {
    currentPage.data.birthDateValue = {
      day: '01',
      month: '0',
      year: '2000'
    };
    currentPage.onKeyboardClose();
    await new Promise(resolve => setTimeout(resolve, 100));
  });
});


describe('navigateBackToVisitorList', () => {

  beforeEach(() => {
    currentPage.data = {
      visitorIndex: 0,
      orderRequest: {
        ticketTotal: 5,
      },
    };

    currentPage.updateToggleTabDisabled = vi.fn();
    currentPage.moveToNextVisitor = vi.fn();
    currentPage.finalizeNavigation = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call updateToggleTabDisabled when visitorIndex is greater than 0', () => {
    currentPage.data.visitorIndex = 1;
    currentPage.navigateBackToVisitorList();

    expect(currentPage.updateToggleTabDisabled).toHaveBeenCalledWith(currentPage.data.orderRequest);
  });

  test('should call moveToNextVisitor when visitorIndex is less than ticketTotal - 1', () => {
    currentPage.data.visitorIndex = 0;
    currentPage.navigateBackToVisitorList();
  });

});


// exitInputData.test.js

// describe('exitInputData', () => {
//   let instance = currentPage;

//   // beforeEach(() => {
//   //   // Membuat instance dari objek yang berisi metode exitInputData
//   //   instance = {
//   //     data: {
//   //       visitorIndex: 0,
//   //       orderRequest: {
//   //         customerTicket: [{}]
//   //       },
//   //       selectedTicket: [{
//   //         customerTicketTemp: [{}]
//   //       }],
//   //       ticketIndex: 0,
//   //       toggleTabDisabled: false,
//   //     },
//   //     my: {
//   //       navigateBack: jest.fn(),
//   //       refreshVisitorListScreen: jest.fn(),
//   //     },
//   //   };
//   // });

//   test('should navigate back if visitorIndex is 0', () => {
//     vi.spyOn(currentPage, "exitInputData")
//     currentPage.data.visitorIndex = 1
//     currentPage.data.ticketIndex = 0
//     currentPage.data.selectedTicket = [{
//       customerTicketTemp: [{
//         customerData: {
//           "fullName": "",
//           "idCard": "",
//           "gender": "",
//           "dob": "",
//           "citizen": "Indonesia",
//           "country": "Indonesia",
//           "statusForeign": "",
//           "postCode": "",
//         }
//       }]
//     },
//     {
//       customerTicketTemp: [{
//         ticketId: "123",
//         index: "1",
//         customerData: "as"
//       }]
//     }]

//     currentPage.data.orderRequest.customerTicket = [{
//         fullName: 'John Doe',
//         gender: 'M',
//         dob: '1990-01-01',
//         citizen: 'Indonesia',
//         country: 'Indonesia',
//         statusForeign: '',
//         idCard: '1234567890123456',
//         postCode: '12345',
//         "urbanv": "Central Jakarta",
//       },
//       {
//         fullName: 'John Doe',
//         gender: 'M',
//         dob: '1990-01-01',
//         citizen: 'Indonesia',
//         country: 'Indonesia',
//         statusForeign: '',
//         idCard: '1234567890123456',
//         postCode: '12345',
//         "urbanv": "Central Jakarta",
//       }
//     ]
//     currentPage.exitInputData();
//   });

//   // test('should refresh visitor list screen and navigate back if idCard exists', () => {
//   //     // currentPage.data.visitorIndex = 1; // Set visitorIndex so it doesn't trigger navigateBack
//   //     // currentPage.data.orderRequest.customerTicket[0] = { idCard: '12345' }; // Mock idCard

//   //     // currentPage.data.selectedTicket[0].customerTicketTemp[1] = {
//   //     //     customerData: {
//   //     //         fullName: 'John Doe',
//   //     //         idCard: '12345',
//   //     //         gender: 'Male',
//   //     //         dob: '1990-01-01',
//   //     //         citizen: 'Indonesia',
//   //     //         country: 'Indonesia',
//   //     //         statusForeign: '',
//   //     //         postCode: '12345',
//   //     //     }
//   //     // };

//   //     currentPage.exitInputData();


//   // });

//   // test('should navigate back if idCard does not exist', () => {
//   //     currentPage.data.visitorIndex = 1; // Set visitorIndex so it doesn't trigger navigateBack
//   //     currentPage.data.orderRequest.customerTicket[0] = {}; // No idCard

//   //     currentPage.exitInputData();
//   // });
// });

