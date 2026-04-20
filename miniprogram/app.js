const languagePacks = require("/src/public/language-pack.json");

App({
  globalData: {
    personalData: {
      phone: ""
    },
    languagePack: {},
    dayjsLocale: "id",
    statusBarHeight: 0,
    purchase: {
      selectedAccount: null,
    },
    nativeData: {
      language: "",
      deviceId: "",
      refreshToken: "",
      accessToken: "",
      beEncryptPublicKey: "",
      beE2EEPublicKey: "",
      signingPrivateKey: "",
      signingPublicKey: "",
      userId: "",
      authorization: "",
      clientRelease: "",
      clientPlatform: "",
      clientVersion: "",
      userAgent: "",
    },
    partnerMenu: {
      "id": "jM3p1F8fXAQV9zRr4ek6uIDcb2X7QdCKxbo4",
      "paymentType": "BILL_PAYMENT",
      "amount": 275000,
      "screenId": "exploreScreen",
      "transactionType": "jjf",
      "category": "event",
      "params": [],
      "partnerAlias": "RINTIS",
      "partnerId": "0100010000060004",
      "virtualAccountDetail": null,
      "displayImage": "image_link",
      "virtualAccountBillersCid": null,
      "isUrlMicrositeStatic": true,
      "urlMicrosite": "app_id",
      "detailBoBiller": {
        "adminFee": 0,
        "categoryId": "zDe8pgfzM_bVJYE4Ehb2H",
        "paymentType": "3",
        "billKey1MaxLength": 13,
        "billKey2MaxAmount": 0,
        "billKey1MaxAmount": 1000000,
        "specialHandlingType": null,
        "billKey3MaxAmount": 0,
        "amountAsBillKey": 10000,
        "errorCodeMappingFlag": "Error Code Mapping",
        "prefixCode": null,
        "billKey1MinLength": 1,
        "billerName": "JavaJazz",
        "billKeyCount": 1,
        "regionCode": "0000",
        "isSpecialhandling": false,
        "billKeyLabel2": null,
        "hasSubRegionFlag": false,
        "billerCode": "01",
        "ccServiceFee": null,
        "billKey3MaxLength": 0,
        "billKey2MinAmount": 0,
        "billKey3MinLength": 0,
        "ubpCompanyCode": "0050000009",
        "billKeyLabel3": null,
        "billKey2MinLength": 0,
        "isActive": true,
        "billerAbbreviation": "KAI",
        "billKeyLabel1": "Kode pembayaran",
        "billKey2MaxLength": 0,
        "isCcSupported": false,
        "billKey3MinAmount": 0,
        "billKey1MinAmount": 1
      },
      "urlRedirect": "https://lifestyle.bni.co.id",
      "description": "lifestylePartnerJavaJazzDescription",
      "partnerName": "RINTIS",
      "categoryDisplay": "Event",
      "isActive": true,
      "transactionTypeDisplay": "JavaJazz",
      "position": 3,
      "discount": 0,
      "icon": "http://asset-service-comp-dev2.apps.jtl-dev.maverick.ocp.hq.bni.co.id/asset/v1/image/ipV2Q7CD2ezcYp78BiHML.png",
      "isDiscount": false,
      "boBillerUbpCompanyCode": "0050000009",
      "title": "lifestylePartnerJavaJazzTitle"
    },
    cart: [],
    merchantInfo: null
  },
  addToCart(item, merchant) {
    if (this.globalData.merchantInfo && this.globalData.merchantInfo.id !== merchant.id) {
      // Clear cart if different merchant
      this.globalData.cart = [];
    }
    this.globalData.merchantInfo = merchant;
    
    const existingItem = this.globalData.cart.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.globalData.cart.push({ ...item, quantity: 1 });
    }
  },
  removeFromCart(itemId) {
    const index = this.globalData.cart.findIndex(i => i.id === itemId);
    if (index > -1) {
      if (this.globalData.cart[index].quantity > 1) {
        this.globalData.cart[index].quantity -= 1;
      } else {
        this.globalData.cart.splice(index, 1);
      }
    }
    if (this.globalData.cart.length === 0) {
      this.globalData.merchantInfo = null;
    }
  },
  clearCart() {
    this.globalData.cart = [];
    this.globalData.merchantInfo = null;
  },
  onLaunch(options) {
    this.globalData.nativeData.sessionKey = "db39fc728d9f6c3da4420e901c2a1fec"
    this.globalData.languagePack = languagePacks.languagePack["id-ID"] || {};
  },
});