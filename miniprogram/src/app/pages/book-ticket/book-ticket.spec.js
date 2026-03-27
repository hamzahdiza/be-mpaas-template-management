import "./book-ticket"
import {
  vi
} from "vitest"
import * as api from "/src/public/api";

const instance = global.pageInstance
const my = global.my
my.call = vi.fn((param1, param2, callback) => {
  callback({})
})

const select = vi.fn(() => ({
  boundingClientRect: vi.fn(() => ({
    select,
    exec: vi.fn((callback) => {
      callback([{
          height: 50
        }, // #mpin-title-box
        {
          height: 60
        }, // #mpin-input-box
        {
          height: 70
        }, // #mpin-inut-prompt-box
        {
          height: 80
        }, // #mpin-input-keyboard-group
        {
          height: 400,
          width: 300
        }, // Viewport
      ]);
    }),


  }))
}))

const mocApi = {
  "validation": [{
      "ticketIdList": [841, 842],
      "maxOrder": 4
    },
    {
      "ticketIdList": [843, 844],
      "maxOrder": 4
    }
  ],
  "promoList": [{
      "ticketId": 841,
      "ticketName": "Daily Pass Friday",
      "ticketDate": "Friday, 30 May 2025",
      "description": [
        "", ""
      ],
      "oldPrice": 850000,
      "price": 525000,
      "priceTaxService": 637500,
      "category": "daily_pass",
      "isAvailable": 1,
      "type": "disc25",
      "countAdd": 1

    },
    {
      "ticketId": 843,
      "ticketName": "Daily Pass Saturday",
      "ticketDate": "Saturday, 31 May 2025",
      "description": [
        "", ""
      ],
      "oldPrice": 850000,
      "price": 525000,
      "priceTaxService": 637500,
      "category": "daily_pass",
      "isAvailable": 1,
      "type": "disc25",
      "countAdd": 1,
    }
  ],
  "regulerList": [{
      "ticketId": 842,
      "ticketName": "Daily Pass Friday",
      "ticketDate": "Friday, 30 May 2025",
      "description": [
        "", ""
      ],
      "oldPrice": 0,
      "price": 525000,
      "priceTaxService": 850000,
      "category": "daily_pass",
      "isAvailable": 1,
      "type": "reguler",
      "countAdd": 1
    },
    {
      "ticketId": 844,
      "ticketName": "Daily Pass Saturday",
      "ticketDate": "Saturday, 31 May 2025",
      "description": [
        "", ""
      ],
      "oldPrice": 850000,
      "price": 525000,
      "priceTaxService": 637500,
      "category": "daily_pass",
      "isAvailable": 1,
      "type": "reguler",
      "countAdd": 1
    }
  ]
}


beforeAll(() => {
  instance.data.isLoading = false
  vi.spyOn(api, 'getListTicket');


  my.createSelectorQuery = vi.fn(() => ({
    select,
  }))
  vi.spyOn(my, 'createSelectorQuery')

})

describe('book-ticket', () => {

  describe('handle onload', () => {
    it('onLoad set data ticket', () => {

      my.createSelectorQuery = vi.fn(() => ({
        select,
      }))
      vi.spyOn(my, 'createSelectorQuery')
      my.customUrlQueryData["book-ticket"] = {
        "eventDetail": {},
        "ticketData": {
          "title": 'adsa',
          "description": 'adsa'
        },
      }
      instance.onLoad({
        'customUrlQueryData': "book-ticket"
      });
    })
    it('onLoad set data ticket PromoList langth > 0', async () => {

      my.createSelectorQuery = vi.fn(() => ({
        select,
      }))
      vi.spyOn(my, 'createSelectorQuery')

      my.customUrlQueryData["book-ticket"] = {
        "eventDetail": {},
        "ticketData": {
          "title": 'adsa',
          "description": 'adsa'
        },
      }

      my.customUrlQueryData["book-ticket"] = {
        "eventDetail": {},
        "ticketData": {
          "title": 'adsa',
          "description": 'adsa'
        },
      }
      const mockResponse = {
        data: {
          dataProtected: mocApi,
        }
      };

      api.getListTicket.mockResolvedValue(mockResponse);

      await instance.onLoad({
        'customUrlQueryData': "book-ticket"
      });
    })

    it('onLoad set data ticket PromoList langth > 0', async () => {

      my.createSelectorQuery = vi.fn(() => ({
        select,
      }))
      vi.spyOn(my, 'createSelectorQuery')
      my.customUrlQueryData["book-ticket"] = {
        "eventDetail": {},
        "ticketData": {
          "title": 'adsa',
          "description": 'adsa'
        },
      }

      const mockResponse = {
        data: {
          dataProtected: mocApi,
        }
      };

      mocApi.promoList = []
      mocApi.regulerList = []
      api.getListTicket.mockResolvedValue(mockResponse);
      my.customUrlQueryData["book-ticket"] = {
        "eventDetail": {},
        "ticketData": {
          "title": 'adsa',
          "description": 'adsa'
        },
      }
      await instance.onLoad({
        'customUrlQueryData': "book-ticket"
      });
    })

  })


  describe('handle Resize', () => {
    it('set margin Bottom', () => {

      my.createSelectorQuery = vi.fn(() => ({
        select,
      }))
      vi.spyOn(my, 'createSelectorQuery')
      instance.handleResize();
    })
  })
  describe('handle Remove', () => {
    it('set when remove type ticket reguler', () => {

      my.createSelectorQuery = vi.fn(() => ({
        select,
      }))
      vi.spyOn(my, 'createSelectorQuery')

      const e = {
        currentTarget: {
          dataset: {
            idx: 1,
            count: 2,
            amount: 3,
            title: 'sempe',
            type: 'reguler',
            "ticketId": 842,
          }
        }
      }

      instance.setData({
        dataRegulerList: [{
          "ticketId": 842,
          "ticketName": "Daily Pass Friday",
          "ticketDate": "Friday, 30 May 2025",
          "description": [
            "Price excludes tax & admin fees", "Price excludes tax & admin fees"
          ],
          "oldPrice": 0,
          "price": 525000,
          "priceTaxService": 850000,
          "category": "daily_pass",
          "isAvailable": 1,
          "type": "reguler",
          "countAdd": 1
        }, ],
        dataPromoList: [{
          "ticketId": 843,
          "ticketName": "Daily Pass Friday",
          "ticketDate": "Friday, 30 May 2025",
          "description": [
            "Price excludes tax & admin fees", "Price excludes tax & admin fees"
          ],
          "oldPrice": 0,
          "price": 525000,
          "priceTaxService": 850000,
          "category": "daily_pass",
          "isAvailable": 1,
          "type": "reguler",
          "countAdd": 1
        }, ],
        ticketBuy: [{
          "ticketId": 842,
          "ticketName": "Daily Pass Friday",
          "ticketDate": "Friday, 30 May 2025",
          "description": [
            "Price excludes tax & admin fees", "Price excludes tax & admin fees"
          ],
          "oldPrice": 0,
          "price": 525000,
          "priceTaxService": 850000,
          "category": "daily_pass",
          "isAvailable": 1,
          "type": "reguler",
          "countAdd": 1,
          total: 0,
        }, ],
        dataListTicket:{
          "regulerList": [
            {
              "maxorOrder":4,
              "priceTaxService": 10000,
              "ticketId": "1002",
              "isAvailable": 1,
              "type": "regular",
              "ticketDate": "Friday, 30 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Friday",
              "countAdd": 1,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 6000
            },
            {
              "priceTaxService": 65000,
              "ticketId": "1004",
              "isAvailable": 1,
              "type": "regular",
              "ticketDate": "Saturday, 31 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Saturday",
              "countAdd": 1,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 50000
            },
            {
              "priceTaxService": 65000,
              "ticketId": "1003",
              "isAvailable": 0,
              "type": "regular",
              "ticketDate": "Sunday, 1 June 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Sunday",
              "countAdd": 1,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 50000
            }
          ],
          "validation": [
            {
              "ticketIdList": ["743", 844, 1003],
              "maxOrder": 4
            },
            {
              "ticketIdList": [742, 843, 1004],
              "maxOrder": 4
            },
            {
              "ticketIdList": [842, "1002"],
              "maxOrder": 4
            },
            {
              "ticketIdList": [741],
              "maxOrder": 4
            }
          ],
          "promoList": [
            {
              "priceTaxService": 2000,
              "ticketId": "741",
              "isAvailable": 1,
              "type": "b1g2",
              "ticketDate": "Friday, 30 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Friday",
              "countAdd": 2,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 500
            },
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
              "price": 500
            },
            {
              "priceTaxService": 2000,
              "ticketId": "743",
              "isAvailable": 1,
              "type": "b1g2",
              "ticketDate": "Sunday, 1 June 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Sunday",
              "countAdd": 2,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 500
            },
            {
              "priceTaxService": 637500,
              "ticketId": "842",
              "isAvailable": 0,
              "type": "disc25",
              "ticketDate": "Friday, 30 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Friday",
              "countAdd": 1,
              "category": "daily_pass",
              "oldPrice": 850000,
              "price": 525000
            },
            {
              "priceTaxService": 637500,
              "ticketId": "843",
              "isAvailable": 1,
              "type": "disc25",
              "ticketDate": "Saturday, 31 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Saturday",
              "countAdd": 1,
              "category": "daily_pass",
              "oldPrice": 850000,
              "price": 525000
            },
            {
              "priceTaxService": 637500,
              "ticketId": "844",
              "isAvailable": 1,
              "type": "disc25",
              "ticketDate": "Sunday, 1 June 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Sunday",
              "countAdd": 1,
              "category": "daily_pass",
              "oldPrice": 850000,
              "price": 525000
            }
          ]
        }
      })


      instance.handleRemove(e);
    })

    it('set when remove type ticket diskon', () => {

      my.createSelectorQuery = vi.fn(() => ({
        select,
      }))
      vi.spyOn(my, 'createSelectorQuery')

      const e = {
        currentTarget: {
          dataset: {
            idx: 1,
            count: 2,
            amount: 3,
            title: 'sempe',
            type: 'b1g2',
            "ticketId": "1002",
            typeTicket: 'reguler'
          }
        }
      }

      instance.setData({
        dataRegulerList: [{
          "ticketId": "1002",
          "ticketName": "Daily Pass Friday",
          "ticketDate": "Friday, 30 May 2025",
          "description": [
            "Price excludes tax & admin fees", "Price excludes tax & admin fees"
          ],
          "oldPrice": 0,
          "price": 525000,
          "priceTaxService": 850000,
          "category": "daily_pass",
          "isAvailable": 1,
          "type": "reguler",
          "countAdd": 1,
          "maxOrder":4
        }, ],
        dataPromoList: [{
          "ticketId": 843,
          "ticketName": "Daily Pass Friday",
          "ticketDate": "Friday, 30 May 2025",
          "description": [
            "Price excludes tax & admin fees", "Price excludes tax & admin fees"
          ],
          "oldPrice": 0,
          "price": 525000,
          "priceTaxService": 850000,
          "category": "daily_pass",
          "isAvailable": 1,
          "type": "b1g2",
          "countAdd": 1,
          "maxorOrder":4
        }, ],
        ticketBuy: [{
          "ticketId": 843,
          "ticketName": "Daily Pass Friday",
          "ticketDate": "Friday, 30 May 2025",
          "description": [
            "Price excludes tax & admin fees", "Price excludes tax & admin fees"
          ],
          "oldPrice": 0,
          "price": 525000,
          "priceTaxService": 850000,
          "category": "daily_pass",
          "isAvailable": 1,
          "type": "b1g2",
          "countAdd": 1,
          total: 0,
          "maxorOrder":4

        }, ],
        dataListTicket:{
          "regulerList": [
            {
              "maxorOrder":4,
              "priceTaxService": 10000,
              "ticketId": "1002",
              "isAvailable": 1,
              "type": "regular",
              "ticketDate": "Friday, 30 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Friday",
              "countAdd": 1,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 6000
            },
            {
              "priceTaxService": 65000,
              "ticketId": "1004",
              "isAvailable": 1,
              "type": "regular",
              "ticketDate": "Saturday, 31 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Saturday",
              "countAdd": 1,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 50000
            },
            {
              "priceTaxService": 65000,
              "ticketId": "1003",
              "isAvailable": 0,
              "type": "regular",
              "ticketDate": "Sunday, 1 June 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Sunday",
              "countAdd": 1,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 50000
            }
          ],
          "validation": [
            {
              "ticketIdList": ["743", 844, 1003],
              "maxOrder": 4
            },
            {
              "ticketIdList": [742, 843, 1004],
              "maxOrder": 4
            },
            {
              "ticketIdList": [842, "1002"],
              "maxOrder": 4
            },
            {
              "ticketIdList": [741],
              "maxOrder": 4
            }
          ],
          "promoList": [
            {
              "priceTaxService": 2000,
              "ticketId": "741",
              "isAvailable": 1,
              "type": "b1g2",
              "ticketDate": "Friday, 30 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Friday",
              "countAdd": 2,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 500
            },
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
              "price": 500
            },
            {
              "priceTaxService": 2000,
              "ticketId": "743",
              "isAvailable": 1,
              "type": "b1g2",
              "ticketDate": "Sunday, 1 June 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Sunday",
              "countAdd": 2,
              "category": "daily_pass",
              "oldPrice": 0,
              "price": 500
            },
            {
              "priceTaxService": 637500,
              "ticketId": "842",
              "isAvailable": 0,
              "type": "disc25",
              "ticketDate": "Friday, 30 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Friday",
              "countAdd": 1,
              "category": "daily_pass",
              "oldPrice": 850000,
              "price": 525000
            },
            {
              "priceTaxService": 637500,
              "ticketId": "843",
              "isAvailable": 1,
              "type": "disc25",
              "ticketDate": "Saturday, 31 May 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Saturday",
              "countAdd": 1,
              "category": "daily_pass",
              "oldPrice": 850000,
              "price": 525000
            },
            {
              "priceTaxService": 637500,
              "ticketId": "844",
              "isAvailable": 1,
              "type": "disc25",
              "ticketDate": "Sunday, 1 June 2025",
              "description": [
                "Harga sudah termasuk pajak dan biaya admin",
                "Tiket hanya valid untuk 1 hari"
              ],
              "ticketName": "Daily Pass Sunday",
              "countAdd": 1,
              "category": "daily_pass",
              "oldPrice": 850000,
              "price": 525000
            }
          ]
        }
      })


      instance.handleRemove(e);
    })

  })

  describe('handle Plus', () => {
    it('set data ticke when count >= 1', () => {

      my.createSelectorQuery = vi.fn(() => ({
        select,
      }))
      vi.spyOn(my, 'createSelectorQuery')

      const e = {
        currentTarget: {
          dataset: {
            idx: 1,
            count: 2,
            amount: 3,
            title: 'sempe',
            type: 'b1g2',
            "ticketId": 842,
          }
        }
      }

      instance.setData({
        dataRegulerList: [{
            "ticketId": 842,
            "ticketName": "Daily Pass Friday",
            "ticketDate": "Friday, 30 May 2025",
            "description": [
              "Price excludes tax & admin fees", "Price excludes tax & admin fees"
            ],
            "oldPrice": 0,
            "price": 525000,
            "priceTaxService": 850000,
            "category": "daily_pass",
            "isAvailable": 1,
            "type": "reguler",
            "countAdd": 1
          },
          {
            "ticketId": 843,
            "ticketName": "Daily Pass Friday",
            "ticketDate": "Friday, 30 May 2025",
            "description": [
              "Price excludes tax & admin fees", "Price excludes tax & admin fees"
            ],
            "oldPrice": 0,
            "price": 525000,
            "priceTaxService": 850000,
            "category": "daily_pass",
            "isAvailable": 1,
            "type": "reguler",
            "countAdd": 1
          },
        ],
        dataPromoList: [{
            "ticketId": 842,
            "ticketName": "Daily Pass Friday",
            "ticketDate": "Friday, 30 May 2025",
            "description": [
              "Price excludes tax & admin fees", "Price excludes tax & admin fees"
            ],
            "oldPrice": 0,
            "price": 525000,
            "priceTaxService": 850000,
            "category": "daily_pass",
            "isAvailable": 1,
            "type": "b1g2",
            "countAdd": 1
          },
          {
            "ticketId": 843,
            "ticketName": "Daily Pass Friday",
            "ticketDate": "Friday, 30 May 2025",
            "description": [
              "Price excludes tax & admin fees", "Price excludes tax & admin fees"
            ],
            "oldPrice": 0,
            "price": 525000,
            "priceTaxService": 850000,
            "category": "daily_pass",
            "isAvailable": 1,
            "type": "reguler",
            "countAdd": 1
          },
        ],
        ticketBuy: [{
          "ticketId": 842,
          "ticketName": "Daily Pass Friday",
          "ticketDate": "Friday, 30 May 2025",
          "description": [
            "Price excludes tax & admin fees", "Price excludes tax & admin fees"
          ],
          "oldPrice": 0,
          "price": 525000,
          "priceTaxService": 850000,
          "category": "daily_pass",
          "isAvailable": 1,
          "type": "reguler",
          "countAdd": 1,
          total: 0,
        }, ],
      })

      instance.handlePlus(e);
    })

    it('set data ticke when tye diskon', async () => {

      my.createSelectorQuery = vi.fn(() => ({
        select,
      }))
      vi.spyOn(my, 'createSelectorQuery')

      const e = {
        currentTarget: {
          dataset: {
            idx: 1,
            count: 2,
            amount: 3,
            title: 'sempe',
            type: 'b1g2',
            "ticketId": 843,
          }
        }
      }

      instance.setData({
        dataPromoList: [{
            "ticketId": 842,
            "ticketName": "Daily Pass Friday",
            "ticketDate": "Friday, 30 May 2025",
            "description": [
              "Price excludes tax & admin fees", "Price excludes tax & admin fees"
            ],
            "oldPrice": 0,
            "price": 525000,
            "priceTaxService": 850000,
            "category": "daily_pass",
            "isAvailable": 1,
            "type": "reguler",
            "countAdd": 1,
            count: 0
          },
          {
            "ticketId": 843,
            "ticketName": "Daily Pass Friday",
            "ticketDate": "Friday, 30 May 2025",
            "description": [
              "Price excludes tax & admin fees", "Price excludes tax & admin fees"
            ],
            "oldPrice": 0,
            "price": 525000,
            "priceTaxService": 850000,
            "category": "daily_pass",
            "isAvailable": 1,
            "type": "reguler",
            "countAdd": 1,
            count: 0
          },
        ],
        ticketBuy: [{
          "ticketId": 842,
          "ticketName": "Daily Pass Friday",
          "ticketDate": "Friday, 30 May 2025",
          "description": [
            "Price excludes tax & admin fees", "Price excludes tax & admin fees"
          ],
          "oldPrice": 0,
          "price": 525000,
          "priceTaxService": 850000,
          "category": "daily_pass",
          "isAvailable": 1,
          "type": "b1g2",
          "countAdd": 1,
          total: 0,
          count: 0
        }, ],
      })
      await new Promise((resolve) => setTimeout(resolve, 2000));
      instance.handlePlus(e);
    })
    test('set data ticke when tye diskon', async () => {

      my.createSelectorQuery = vi.fn(() => ({
        select,
      }))
      vi.spyOn(my, 'createSelectorQuery')

      const e = {
        currentTarget: {
          dataset: {
            idx: 1,
            count: 2,
            amount: 3,
            title: 'sempe',
            type: 'reguler',
            "ticketId": 843,
          }
        }
      }

      instance.setData({
        dataRegulerList: [{
            "ticketId": 842,
            "ticketName": "Daily Pass Friday",
            "ticketDate": "Friday, 30 May 2025",
            "description": [
              "Price excludes tax & admin fees", "Price excludes tax & admin fees"
            ],
            "oldPrice": 0,
            "price": 525000,
            "priceTaxService": 850000,
            "category": "daily_pass",
            "isAvailable": 1,
            "type": "reguler",
            "countAdd": 1,
            count: 0
          },
          {
            "ticketId": 843,
            "ticketName": "Daily Pass Friday",
            "ticketDate": "Friday, 30 May 2025",
            "description": [
              "Price excludes tax & admin fees", "Price excludes tax & admin fees"
            ],
            "oldPrice": 0,
            "price": 525000,
            "priceTaxService": 850000,
            "category": "daily_pass",
            "isAvailable": 1,
            "type": "reguler",
            "countAdd": 1,
            count: 0
          },
        ],
        ticketBuy: [{
          "ticketId": 842,
          "ticketName": "Daily Pass Friday",
          "ticketDate": "Friday, 30 May 2025",
          "description": [
            "Price excludes tax & admin fees", "Price excludes tax & admin fees"
          ],
          "oldPrice": 0,
          "price": 525000,
          "priceTaxService": 850000,
          "category": "daily_pass",
          "isAvailable": 1,
          "type": "b1g2",
          "countAdd": 1,
          total: 0,
          count: 0
        }, ],
      })
      await new Promise((resolve) => setTimeout(resolve, 2000));
      instance.handlePlus(e);
    })

  })

  describe('handle filter', () => {
    it('setfilter promo or reguler when first index', () => {

      my.createSelectorQuery = vi.fn(() => ({
        select,
      }))
      vi.spyOn(my, 'createSelectorQuery')


      const e = {
        currentTarget: {
          dataset: {
            idx: 0,

          }
        }
      }
      instance.handleFilter(e);
    })

  })

  describe('handle nextPage', () => {
    it('ser params to nextpage', () => {
      my.createSelectorQuery = vi.fn(() => ({
        select,
      }))
      vi.spyOn(my, 'createSelectorQuery')
      instance.nextPage();
    })
  })
})

describe('formatTicketDate', () => {
  beforeEach(() => {
    global.getApp = vi.fn(() => ({
      globalData: {
        dayjsLocale: 'en'
      }
    }));
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

    instance.formatTicketDate(item);
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

    instance.formatTicketDate(item);
  });

  it('should format date for other categories', () => {
    const item = {
      category: 'single_day_pass',
      ticketDate: '2025-06-30'
    };

    instance.formatTicketDate(item);
  });
  it('should call dateFormat for non-three_days_pass categories', () => {
    const item = {
      category: 'single_day_pass',
      ticketDate: '2025-06-30'
    };

    instance.formatTicketDate(item);
  });

  it('disable toast', () => {
    vi.spyOn(instance, 'disableToast')
    instance.data.isCopyTriggered = true

    instance.disableToast();
  });


  it('disable toast', () => {
    vi.spyOn(instance, 'disableToast')
    instance.data.isCopyTriggered = false

    instance.disableToast();
  });
});