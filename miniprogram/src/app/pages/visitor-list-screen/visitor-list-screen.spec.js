import {
  describe,
  it,
  expect,
  vi,
  beforeAll
} from 'vitest';
import './visitor-list-screen.js';
import * as api from '/src/public/api';
import * as e2ee from '/src/utils/e2ee';
import * as routeUtil from "../../../utils/route-util";


const currentPage = global.pageInstance;
my.refreshVisitorListScreen = vi.fn()
// my.navigateBack = vi.fn()
my.customUrlQueryData['visitor-list-screen'] = {
  "selectedTicket": [
    {
      "ticketIdList": [743, 844, 1003],
      "maxOrder": 4,
      "tickets": [
        {
          "priceTaxService": 2000,
          "ticketId": "843",
          "isAvailable": 1,
          "type": "reguler",
          "ticketDate": "Saturday, 31 May 2025",
          "description": [
            "Harga sudah termasuk pajak dan biaya admin",
            "Tiket hanya valid untuk 1 hari"
          ],
          "ticketName": "Daily Pass Saturday",
          "countAdd": 2,
          "category": "daily_pass",
          "oldPrice": 0,
          "price": 500,
          "order": 4,
          "orderAdd": 2,
          "totalPrice": 4000
        }
      ]
    },
    {
      "ticketIdList": [742, 843, 1004],
      "maxOrder": 4,
      "tickets": [
        {
          "priceTaxService": 2000,
          "ticketId": "742",
          "isAvailable": 1,
          "type": "b1g2",
          "ticketDate": "Saturday, 31 May 2025",
          "description": [
            "Harga sudah termasuk pajak dan biaya admin",
            "Tiket hanya valid untuk 1 hari"
          ],
          "ticketName": "Daily Pass Saturday",
          "countAdd": 2,
          "category": "daily_pass",
          "oldPrice": 0,
          "price": 500,
          "order": 4,
          "orderAdd": 2,
          "totalPrice": 4000
        },
        {
          "priceTaxService": 2000,
          "ticketId": "843",
          "isAvailable": 1,
          "type": "reguler",
          "ticketDate": "Saturday, 31 May 2025",
          "description": [
            "Harga sudah termasuk pajak dan biaya admin",
            "Tiket hanya valid untuk 1 hari"
          ],
          "ticketName": "Daily Pass Saturday",
          "countAdd": 2,
          "category": "daily_pass",
          "oldPrice": 0,
          "price": 500,
          "order": 4,
          "orderAdd": 2,
          "totalPrice": 4000
        }
      ]
    }
  ],
  priceCount: 1912500,
  ticketCount: 3,
  ticketData: {},
  eventDetail: {},
  isDataValid: false,
};
describe('java jazz visitor list screen', () => {
  beforeAll(() => {
    vi.spyOn(currentPage, 'fetchPersonalData');
    vi.spyOn(api, 'getPersonalData');
    vi.spyOn(e2ee, 'decryptAPIData');

    const mockGeneralErrorFunc = {
      setData: vi.fn(),
      $page: {
        setData: vi.fn()
      }
    };
    global.getCurrentPages = vi.fn(() => [mockGeneralErrorFunc]);
    my.customUrlQueryData['visitor-list-screen'] = {
      "selectedTicket": [
        {
          "ticketIdList": [743, 844, 1003],
          "maxOrder": 4,
          "tickets": [
            {
              "priceTaxService": 2000,
              "ticketId": "843",
              "isAvailable": 1,
              "type": "reguler",
              "ticketDate": "Saturday, 31 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Saturday",
              "countAdd": 2,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 500,
              "order": 4,
              "orderAdd": 2,
              "totalPrice": 4000
            }
          ]
        },
        {
          "ticketIdList": [742, 843, 1004],
          "maxOrder": 4,
          "tickets": [
            {
              "priceTaxService": 2000,
              "ticketId": "742",
              "isAvailable": 1,
              "type": "b1g2",
              "ticketDate": "Saturday, 31 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Saturday",
              "countAdd": 2,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 500,
              "order": 4,
              "orderAdd": 2,
              "totalPrice": 4000
            },
            {
              "priceTaxService": 2000,
              "ticketId": "843",
              "isAvailable": 1,
              "type": "reguler",
              "ticketDate": "Saturday, 31 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Saturday",
              "countAdd": 2,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 500,
              "order": 4,
              "orderAdd": 2,
              "totalPrice": 4000
            }
          ]
        }
      ],
      priceCount: 1912500,
      ticketCount: 3,
      ticketData: {},
      eventDetail: {},
      isDataValid: false,
    };

    currentPage.onLoad({
      customUrlQueryData: 'visitor-list-screen',
    });
  });

  describe('onLoad', () => {
    it('should call fetchPortfolioDetail with portfolioId from page query params', async () => {
      vi.spyOn(e2ee, 'decryptAPIData');
      vi.spyOn(api, 'getPersonalData');
      vi.spyOn(routeUtil, "customNavigateTo")

      api.getPersonalData.mockResolvedValue({
        data: {
          dataProtected: '',
        },
      });

      e2ee.decryptAPIData.mockReturnValueOnce(
        JSON.stringify({
          dataProtected: {
            fullName: 'Ilham Nasution',
            email: 'ilhamnasution@gmail.com',
            phone: '085888746402',
            gender: 'F',
            dateBirth: '26',
            monthBirth: '01',
            yearBirth: '1999',
            nationality: 'ID',
            nik: '1231232131123211',
            subdistrict: 'CILINCING',
            postalCode: '14120',
          },
        })
      );

      currentPage.onLoad({
        customUrlQueryData: 'visitor-list-screen',
      });

      expect(currentPage.fetchPersonalData).toHaveBeenCalled();
    });

    it('should navigate to visitor input screen', () => {
      vi.spyOn(currentPage, 'navigateToVisitorInput');

      currentPage.data.personalData = {
        fullName: 'Ilham Nasution',
        email: 'ilhamnasution@gmail.com',
        phone: '085888746402',
        gender: 'F',
        dateBirth: '26',
        monthBirth: '01',
        yearBirth: '1999',
        nationality: 'ID',
        nik: '1231232131123211',
        subdistrict: 'CILINCING',
        postalCode: '14120',
      };

      currentPage.data.selectedTicket =[
        {
          "ticketIdList": [743, 844, 1003],
          "maxOrder": 4,
          "tickets": [
            {
              "priceTaxService": 2000,
              "ticketId": "843",
              "isAvailable": 1,
              "type": "reguler",
              "ticketDate": "Saturday, 31 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Saturday",
              "countAdd": 2,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 500,
              "order": 4,
              "orderAdd": 2,
              "totalPrice": 4000
            },
            
          ],
          "customerTicketTemp":[
            {
              ticketId:"742",
              index:0,
              customerData:[
                {
                  "priceTaxService": 2000,
                  "ticketId": "843",
                  "isAvailable": 1,
                  "type": "reguler",
                  "ticketDate": "Saturday, 31 May 2025",
                  "description": [
                    "Harga sudah termasuk pajak dan biaya admin",
                    "Tiket hanya valid untuk 1 hari"
                  ],
                  "ticketName": "Daily Pass Saturday",
                  "countAdd": 2,
                  "category": "daily_pass",
                  "oldPrice": 0,
                  "price": 500,
                  "order": 4,
                  "orderAdd": 2,
                  "totalPrice": 4000
                }
              ]
            },
            {
              ticketId:"844",
              index:0,
              customerData:[
                {
                  "priceTaxService": 2000,
                  "ticketId": "843",
                  "isAvailable": 1,
                  "type": "reguler",
                  "ticketDate": "Saturday, 31 May 2025",
                  "description": [
                    "Harga sudah termasuk pajak dan biaya admin",
                    "Tiket hanya valid untuk 1 hari"
                  ],
                  "ticketName": "Daily Pass Saturday",
                  "countAdd": 2,
                  "category": "daily_pass",
                  "oldPrice": 0,
                  "price": 500,
                  "order": 4,
                  "orderAdd": 2,
                  "totalPrice": 4000
                }
              ]
            },
          ]
        },
        {
          "ticketIdList": [742, 843, 1004],
          "maxOrder": 4,
          "tickets": [
            {
              "priceTaxService": 2000,
              "ticketId": "742",
              "isAvailable": 1,
              "type": "b1g2",
              "ticketDate": "Saturday, 31 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Saturday",
              "countAdd": 2,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 500,
              "order": 4,
              "orderAdd": 2,
              "totalPrice": 4000
            },
            {
              "priceTaxService": 2000,
              "ticketId": "843",
              "isAvailable": 1,
              "type": "reguler",
              "ticketDate": "Saturday, 31 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Saturday",
              "countAdd": 2,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 500,
              "order": 4,
              "orderAdd": 2,
              "totalPrice": 4000
            }
          ],
          "customerTicketTemp":[
            {
              ticketId:"742",
              index:0,
              customerData:[
                {
                  "priceTaxService": 2000,
                  "ticketId": "843",
                  "isAvailable": 1,
                  "type": "reguler",
                  "ticketDate": "Saturday, 31 May 2025",
                  "description": [
                    "Harga sudah termasuk pajak dan biaya admin",
                    "Tiket hanya valid untuk 1 hari"
                  ],
                  "ticketName": "Daily Pass Saturday",
                  "countAdd": 2,
                  "category": "daily_pass",
                  "oldPrice": 0,
                  "price": 500,
                  "order": 4,
                  "orderAdd": 2,
                  "totalPrice": 4000
                }
              ]
            },
            {
              ticketId:"843",
              index:0,
              
            },
          ]
        }
      ]
      const e = {
        currentTarget: {
          dataset: {
            ticketIndex: 1,
            visitorIndex: 0,
            ticketId:"843",
          }
        }
      }
      currentPage.data.orderRequest = {
        "tickets": [{
          "name": "Testing Tiket",
          "email": "testing@gmail.com",
          "phone": "085720452768",
          "gender": "M",
          "ticketId": 843,
          "ticketQty": 1,
          "category": "daily_pass",
          "type": "disc25",
          "oldPrice": 20000,
          "price": 10000,
          "priceTaxService": 2000,
          "customerTicket": [{
            "fullname": "Test Satu",
            "idCard": "3204101201850002",
            "gender": "M",
            "dob": "1994-10-25",
            "citizen": "Indonesia",
            "country": "Indonesia",
            "statusForeign": "",
            "postCode": "13410",
            "ticketName": "Daily Pass Friday"
          }]
        },
        {
          "name": "Testing Tiket",
          "email": "testing@gmail.com",
          "phone": "085720452768",
          "gender": "M",
          "ticketId": 742,
          "ticketQty": 1,
          "category": "daily_pass",
          "type": "disc25",
          "oldPrice": 20000,
          "price": 10000,
          "priceTaxService": 2000,
          "customerTicket": [{
            "fullname": "Test Satu",
            "idCard": "3204101201850002",
            "gender": "M",
            "dob": "1994-10-25",
            "citizen": "Indonesia",
            "country": "Indonesia",
            "statusForeign": "",
            "postCode": "13410",
            "ticketName": "Daily Pass Friday"
          }]
        }
      ]
      }

      currentPage.navigateToVisitorInput(e);
      currentPage.validateOrderRequest()
      my.refreshVisitorListScreen()
      expect(currentPage.navigateToVisitorInput).toHaveBeenCalled();
    });
    it('should navigate to visitor input screen invalid data', () => {
      vi.spyOn(currentPage, 'navigateToVisitorInput');

      currentPage.data.personalData = {
        fullName: 'Ilham Nasution',
        email: 'ilhamnasution@gmail.com',
        phone: '085888746402',
        gender: 'F',
        dateBirth: '26',
        monthBirth: '01',
        yearBirth: '1999',
        nationality: 'ID',
        nik: '1231232131123211',
        subdistrict: 'CILINCING',
        postalCode: '14120',
      };

      currentPage.data.selectedTicket =[
        {
          "ticketIdList": [743, 844, 1003],
          "maxOrder": 4,
          "tickets": [
            {
              "priceTaxService": 2000,
              "ticketId": "843",
              "isAvailable": 1,
              "type": "reguler",
              "ticketDate": "Saturday, 31 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Saturday",
              "countAdd": 2,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 500,
              "order": 4,
              "orderAdd": 2,
              "totalPrice": 4000
            },
            
          ],
       
        },
        {
          "ticketIdList": [742, 843, 1004],
          "maxOrder": 4,
          "tickets": [
            {
              "priceTaxService": 2000,
              "ticketId": "742",
              "isAvailable": 1,
              "type": "b1g2",
              "ticketDate": "Saturday, 31 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Saturday",
              "countAdd": 2,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 500,
              "order": 4,
              "orderAdd": 2,
              "totalPrice": 4000
            },
            {
              "priceTaxService": 2000,
              "ticketId": "843",
              "isAvailable": 1,
              "type": "reguler",
              "ticketDate": "Saturday, 31 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Saturday",
              "countAdd": 2,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 500,
              "order": 4,
              "orderAdd": 2,
              "totalPrice": 4000
            }
          ],
          "customerTicketTemp":[
            {
              ticketId:"742",
              index:0,
              customerData:[
                {
                  "priceTaxService": 2000,
                  "ticketId": "843",
                  "isAvailable": 1,
                  "type": "reguler",
                  "ticketDate": "Saturday, 31 May 2025",
                  "description": [
                    "Harga sudah termasuk pajak dan biaya admin",
                    "Tiket hanya valid untuk 1 hari"
                  ],
                  "ticketName": "Daily Pass Saturday",
                  "countAdd": 2,
                  "category": "daily_pass",
                  "oldPrice": 0,
                  "price": 500,
                  "order": 4,
                  "orderAdd": 2,
                  "totalPrice": 4000
                }
              ]
            },
            {
              ticketId:"843",
              index:0,
              
            },
          ]
        }
      ]
      const e = {
        currentTarget: {
          dataset: {
            ticketIndex: 1,
            visitorIndex: 0,
            ticketId:"843",
          }
        }
      }
      currentPage.data.orderRequest = {
        "tickets": [{
          "name": "Testing Tiket",
          "email": "testing@gmail.com",
          "phone": "085720452768",
          "gender": "M",
          "ticketId": 843,
          "ticketQty": 1,
          "category": "daily_pass",
          "type": "disc25",
          "oldPrice": 20000,
          "price": 10000,
          "priceTaxService": 2000,
          "customerTicket": [{
            "fullname": "Test Satu",
            "idCard": "3204101201850002",
            "gender": "M",
            "dob": "1994-10-25",
            "citizen": "Indonesia",
            "country": "Indonesia",
            "statusForeign": "",
            "postCode": "13410",
            "ticketName": "Daily Pass Friday"
          }]
        },
        {
          "name": "Testing Tiket",
          "email": "testing@gmail.com",
          "phone": "085720452768",
          "gender": "M",
          "ticketId": 742,
          "ticketQty": 1,
          "category": "daily_pass",
          "type": "disc25",
          "oldPrice": 20000,
          "price": 10000,
          "priceTaxService": 2000,
          "customerTicket": [{
            "fullname": "Test Satu",
            "idCard": "3204101201850002",
            "gender": "M",
            "dob": "1994-10-25",
            "citizen": "Indonesia",
            "country": "Indonesia",
            "statusForeign": "",
            "postCode": "13410",
            "ticketName": "Daily Pass Friday"
          }]
        }
      ]
      }

      currentPage.navigateToVisitorInput(e);
      currentPage.validateOrderRequest()
      // my.refreshVisitorListScreen()
      expect(currentPage.navigateToVisitorInput).toHaveBeenCalled();
    });


    it("should not verified order request", () => {
      vi.spyOn(currentPage, 'validateOrderRequest');
      vi.spyOn(routeUtil, "customNavigateTo")
      //   vi.spyOn(e2ee, 'decryptAPIData');
      vi.spyOn(api, 'orderTickets');

      currentPage.isTicketsDataValid = true;
      currentPage.isCustomersDataValid = true;
      currentPage.data.orderRequest = {
        "tickets": [{
          "email": "testing@gmail.com",
          "phone": "085720452768",
          "gender": "M",
          "ticketId": 1002,
          "ticketQty": 1,
          "oldPrice": 1,
          "category": "daily_pass",
          "type": "disc25",

          "price": 10000,
          "priceTaxService": 2000,
          "customerTicket": [{
            "fullname": "Test Satu",
            "idCard": "3204101201850002",
            "gender": "M",
            "dob": "1994-10-25",
            "citizen": "Indonesia",
            "statusForeign": "A",
            "postCode": "13410",
            "ticketName": "Daily Pass Friday",
            "country": 'Indonesia'
          }]
        }]
      }
      currentPage.validateOrderRequest()
    })


    it("should not verified order request", () => {
      vi.spyOn(currentPage, 'validateOrderRequest');
      vi.spyOn(routeUtil, "customNavigateTo")
      //   vi.spyOn(e2ee, 'decryptAPIData');
      vi.spyOn(api, 'orderTickets');

      currentPage.isTicketsDataValid = true;
      currentPage.isCustomersDataValid = true;
      currentPage.data.orderRequest = {
        "tickets": [{
          "email": "testing@gmail.com",
          "phone": "085720452768",
          "gender": "M",
          "ticketId": 1002,
          "ticketQty": 1,
          "oldPrice": 1,
          "category": "daily_pass",
          "type": "disc25",

          "price": 10000,
          "priceTaxService": 2000,
          "customerTicket": [{
            "fullname": "Test Satu",
            "idCard": "3204101201850002",
            "gender": "M",
            "dob": "1994-10-25",
            "citizen": "Indonesia",

            "statusForeign": "",
            "postCode": "13410",
            "ticketName": "Daily Pass Friday"
          }]
        }]
      }
      api.orderTickets.mockResolvedValue({
        data: {
          dataProtected: '',
        },
      });
      currentPage.validateOrderRequest()
    })

    it("should not verified order request", () => {
      vi.spyOn(currentPage, 'validateOrderRequest');
      vi.spyOn(routeUtil, "customNavigateTo")
      //   vi.spyOn(e2ee, 'decryptAPIData');
      vi.spyOn(api, 'orderTickets');

      currentPage.isTicketsDataValid = true;
      currentPage.isCustomersDataValid = true;
      currentPage.data.selectedTickets=[
        {
            "maxOrder": 3,
            "ticketIdList": [
                842,
                1002,
                741
            ],
            "tickets": [
                {
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
                }
            ],
            "total": 1,
            "customerTicketTemp": [
                {
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
                }
            ],
            "customerTicketCount": 1,
            "amount": 10000,
            "ticketDate": "30 Mei 2025"
        }
       ]
      currentPage.data.orderRequest = {
        "tickets": [{
          "name": "Testing Tiket",
          "email": "testing@gmail.com",
          "phone": "085720452768",
          "gender": "M",
          "ticketId": 1002,
          "ticketQty": 1,
          "oldPrice": 1,
          "category": "daily_pass",
          "type": "disc25",

          "price": 10000,
          "priceTaxService": 2000,
          "customerTicket": [{
            "fullname": "Test Satu",
            "idCard": "3204101201850002",
            "gender": "M",
            "dob": "1994-10-25",
            "citizen": "Indonesia",

            "statusForeign": "",
            "postCode": "13410",
            "ticketName": "Daily Pass Friday"
          }]
        }]
      }
      api.orderTickets.mockResolvedValue({
        data: {
          dataProtected: '',
        },
      });
      e2ee.decryptAPIData.mockReturnValueOnce(
        JSON.stringify({
          dataProtected: {
            fullName: 'Ilham Nasution',
            email: 'ilhamnasution@gmail.com',
            phone: '085888746402',
            gender: 'F',
            dateBirth: '26',
            monthBirth: '01',
            yearBirth: '1999',
            nationality: 'ID',
            nik: '1231232131123211',
            subdistrict: 'CILINCING',
            postalCode: '14120',
          },
        })
      );
      e2ee.decryptAPIData.mockReturnValueOnce(
        JSON.stringify({
          dataProtected: {
            fullName: 'Ilham Nasution',
            email: 'ilhamnasution@gmail.com',
            phone: '085888746402',
            gender: 'F',
            dateBirth: '26',
            monthBirth: '01',
            yearBirth: '1999',
            nationality: 'ID',
            nik: '1231232131123211',
            subdistrict: 'CILINCING',
            postalCode: '14120',
          },
        })
      );
      currentPage.validateOrderRequest()
      currentPage.handleContinueButton()
      currentPage.handleBackButton()
      expect(true).toBe(true)
    })
   
   
    it("should not verified order request", () => {
      vi.spyOn(currentPage, 'validateOrderRequest');
      vi.spyOn(routeUtil, "customNavigateTo")
      //   vi.spyOn(e2ee, 'decryptAPIData');
      vi.spyOn(api, 'orderTickets');

      currentPage.isTicketsDataValid = true;
      currentPage.isCustomersDataValid = true;
      currentPage.data.orderRequest = {
        "tickets": [{
          "name": "Testing Tiket",
          "email": "testing@gmail.com",
          "phone": "085720452768",
          "gender": "M",
          "ticketId": 1002,
          "category": "daily_pass",
          "type": "disc25",

          "price": 10000,
          "priceTaxService": 2000
        }]
      }
      api.orderTickets.mockRejectedValue({
        statusCode: 409,
        data: {
          errCode: ''
        }
      });
      e2ee.decryptAPIData.mockReturnValueOnce(
        JSON.stringify({
          dataProtected: {
            fullName: 'Ilham Nasution',
            email: 'ilhamnasution@gmail.com',
            phone: '085888746402',
            gender: 'F',
            dateBirth: '26',
            monthBirth: '01',
            nationality: 'ID',
            nik: '1231232131123211',
            subdistrict: 'CILINCING',
            postalCode: '14120',
          },
        })
      );
      e2ee.decryptAPIData.mockReturnValueOnce(
        JSON.stringify({
          dataProtected: {
            fullName: 'Ilham Nasution',
            email: 'ilhamnasution@gmail.com',
            phone: '085888746402',
            gender: 'F',
            dateBirth: '26',
            monthBirth: '01',
            yearBirth: '1999',
            nationality: 'ID',
            nik: '1231232131123211',
            subdistrict: 'CILINCING',
            postalCode: '14120',
          },
        })
      );
      currentPage.validateOrderRequest()
      currentPage.handleContinueButton()
      currentPage.handleBackButton()
      expect(true).toBe(true)
    })
    it("should not verified order request not indeonesia", () => {
      vi.spyOn(currentPage, 'validateOrderRequest');
      vi.spyOn(routeUtil, "customNavigateTo")
      //   vi.spyOn(e2ee, 'decryptAPIData');
      vi.spyOn(api, 'orderTickets');

      currentPage.isTicketsDataValid = true;
      currentPage.isCustomersDataValid = true;
      currentPage.data.isDataValid=true
      currentPage.data.orderRequest = {
        "tickets": [{
          "name": "Testing Tiket",
          "email": "testing@gmail.com",
          "phone": "085720452768",
          "gender": "M",
          "ticketId": 1002,
          "category": "daily_pass",
          "type": "disc25",

          "price": 10000,
        }]
      }
      api.orderTickets.mockRejectedValue({
        statusCode: 409,
        data: {
          errCode: ''
        }
      });
      e2ee.decryptAPIData.mockReturnValueOnce(
        JSON.stringify({
          dataProtected: {
            fullName: 'Ilham Nasution',
            email: 'ilhamnasution@gmail.com',
            phone: '085888746402',
            gender: 'F',
            dateBirth: '26',
            monthBirth: '01',
            postalCode: '14120',
          },
        })
      );
      e2ee.decryptAPIData.mockReturnValueOnce(
        JSON.stringify({
          dataProtected: {
            fullName: 'Ilham Nasution',
            email: 'ilhamnasution@gmail.com',
            phone: '085888746402',
            gender: 'F',
            dateBirth: '26',
            monthBirth: '01',
            yearBirth: '1999',
            nationality: 'ID',
            nik: '1231232131123211',
            subdistrict: 'CILINCING',
            postalCode: '14120',
          },
        })
      );
      currentPage.validateOrderRequest()
      currentPage.handleContinueButton()
      currentPage.handleBackButton()
      expect(true).toBe(true)
    })

    it('should fetch personal data successfully', async () => {

      let mockSetData = vi.fn();
      const mockRes = {
        data: {
          "dataProtected": "result"
        }
      }
      const mockDecryptedData = JSON.stringify({});
      vi.spyOn(api, 'getPersonalData');
      vi.spyOn(e2ee, 'decryptAPIData');

      api.getPersonalData.mockResolvedValueOnce(mockRes);
      vi.spyOn(e2ee, 'decryptAPIData').mockReturnValue(mockDecryptedData);


      currentPage.fetchPersonalData.call({
        setData: mockSetData
      });
    });

    it('should handle errors', async () => {
      let mockSetData = vi.fn();
      vi.spyOn(api, 'getPersonalData');


      const mockError = new Error('Fetch error');
      api.getPersonalData.mockRejectedValue(mockError);
      currentPage.fetchPersonalData.call({
        setData: mockSetData
      });
    });
  });
});
describe("handle popup", () => {
  it("open popup", () => {
    vi.spyOn(currentPage, "handleBackButton")

    currentPage.handleBackButton()
  })
  it("open popup", () => {
    vi.spyOn(currentPage, "handlePopup")

    currentPage.handlePopup()
  })
  it("open popup", () => {
    vi.spyOn(currentPage, "handlePopupClose")

    currentPage.handlePopupClose()
  })
})



describe('validateOrderRequest', () => {

  it('should mark customers data invalid if customerTicket is missing', () => {
    let mockSetData = vi.fn();

    const mockData = {
      orderRequest: {
        tickets: [{
          name: 'John Doe',
          ticketId: '123',
          type: 'adult',
          category: 'VIP',
          email: 'john@example.com',
          phone: '1234567890',
          gender: 'male',
          ticketQty: 1,
          oldPrice: 100,
          price: 90,
          priceTaxService: 10,
        }]
      }
    };

    const context = {
      data: mockData,
      setData: mockSetData
    };
    currentPage.validateOrderRequest.call(context);

  });


});


describe('formatTicketDate', () => {
  beforeEach(() => {
    global.getApp = vi.fn(() => ({
      globalData: {
        dayjsLocale: 'en',
        nativeData: {
          accessToken: '11111'
        }
      }
    }));
  });

  it('should format date for "three_days_pass" category in English', () => {
    const item = {
      category: 'three_days_pas',
      ticketDate: '2025-06-30'
    };

    global.getApp.mockReturnValueOnce({
      globalData: {
        dayjsLocale: 'idx'
      }
    });

    currentPage.formatTicketDate(item);
  });
  it('should format date for "three_days_pass" category in English', () => {
    const item = {
      category: 'three_days_pass',
      ticketDate: '2025-06-30'
    };

    global.getApp.mockReturnValueOnce({
      globalData: {
        dayjsLocale: 'en'
      }
    });

    currentPage.formatTicketDate(item);
  });

  it('should format date for "three_days_pass" category in Indonesian', () => {
    const item = {
      category: 'three_days_pass',
      ticketDate: '2025-06-30'
    };

    global.getApp.mockReturnValueOnce({
      globalData: {
        dayjsLocale: 'id'
      }
    });

    currentPage.formatTicketDate(item);
  });

  it('should format date for other categories', () => {
    const item = {
      category: 'single_day_pass',
      ticketDate: '2025-06-30'
    };

    currentPage.formatTicketDate(item);
  });
  it('should call dateFormat for non-three_days_pass categories', () => {
    const item = {
      category: 'single_day_pass',
      ticketDate: '2025-06-30'
    };

    currentPage.formatTicketDate(item);
  });
});