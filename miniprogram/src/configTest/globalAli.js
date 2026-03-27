import { vi } from 'vitest';
import languagePacks from '../public/language-pack.json';
import { customNavigateTo } from '../utils/route-util';
import { dateFormat } from '../utils/date-util'
const locale = 'id-ID';
const locales = {
  'en-US':languagePacks.languagePack['en-ID'],
  "id-ID":languagePacks.languagePack['id-ID']
};
const lang = locales[locale]

global.my = {
  getNetworkType: vi.fn(),
  startPullDownRefresh: vi.fn(({ success, fail }) => {
    success && success({
      
    });

    fail && fail({
      error: 'error',
      errorMessage: 'errorMessage'
    });
  }),
  showLoading: vi.fn(),
  hideLoading: vi.fn(),
  hideBackHome:vi.fn(),
  showModal: vi.fn(),
  request: vi.fn(),
  getStorageSync: vi.fn(() => ({})),
  showShareMenu: vi.fn(),
  showToast: vi.fn(),
  alert: vi.fn(),
  getSystemInfoSync: vi.fn(() => {
      return {'statusBarHeight':23,'titleBarHeight':56}
  }),
  getSystemInfo: vi.fn(({ success, fail }) => {
    success && success({
      
    });

    fail && fail({
      error: 'error',
      errorMessage: 'errorMessage'
    });
  }),
  removeStorageSync: vi.fn(),
  reLaunch: vi.fn(),
  redirectTo: vi.fn(),
  canIUse: vi.fn(),
  setNavigationBar: vi.fn(),
  setCanPullDown: vi.fn(),
  getLocation: vi.fn(({ cacheTimeout, type, success, fail, complete }) => {
    success &&
      success({
        longitude: "longitude",
        latitude: "latitude",
        accuracy: "accuracy",
        horizontalAccuracy: "Horizontal Accuracy",
        country: "country",
        countryCode: "Country code",
        province: "province",
        city: "city",
        cityAdcode: "city-level area code",
        district: "district and county",
        districtAdcode: "District code at the district and county level",
        streetNumber: {},
        pois: [],
      });

    fail &&
      fail({
        error: "error",
        errorMessage: "errorMessage",
      });

    complete &&
      complete({
        cacheTimeout: cacheTimeout,
        type: type,
      });
  }),
  getAuthCode: vi.fn(({ scopes, success, fail, complete }) => {
    success && success({
      authCode: scopes, // mock authCode
      authErrorScopes: {},
      authSuccessScopes: []
    })
    fail && fail({
      errorMessage: 'this is errorMessage'
    })
    complete && complete()
  }),
  navigateTo: vi.fn(({ url, complete, success, fail }) => {
    if (url) {
      // console.log("Navigating to URL:", url);
    }
    
    complete &&
      complete({
        error: undefined,
        errorMessage: undefined,
      });

    success && success();
 
    fail && fail({
      error: "error",
      errorMessage: "errorMessage",
    });
  }),
  navigateBack: vi.fn(),
  setStorageSync: vi.fn(),
  authorize: vi.fn(({ scopes }) => {
    // Perform authorization actions based on the given scopes

    if (scopes.includes('read')) {
      // console.log('Authorization for reading data');
      // Perform authorization action for reading data
    }

    if (scopes.includes('write')) {
      // console.log('Authorization for writing data');
      // Perform authorization action for writing data
    }

    return {};
  }),
  tb: {
    chooseAddress: ({ addAddress, searchAddress, locateAddress, success, fail }) => {
      // Simulate the logic for adding an address
      if (addAddress) {
        // console.log('Adding address:', addAddress);
        // Perform the logic to add the address
      }

      // Simulate the logic for searching an address
      if (searchAddress) {
        // console.log('Searching address:', searchAddress);
        // Perform the logic to search for the address
      }

      // Simulate the logic for locating an address
      if (locateAddress) {
        // console.log('Locating address:', locateAddress);
        // Perform the logic to locate the address
      }

      success && success({
        type: 'locationAddress',
        name: 'my.tb.chooseAddress',
        latitude: '111',
        longitude: '222'
      });

      fail && fail({
        error: 'error',
        errorMessage: 'errorMessage'
      });
    }
  },
  chooseLocation: vi.fn(({ success, fail }) => {
    success && success({
      latitude: '12',
      longitude: '345',
      address: 'chooseLocation address',
      name: 'chooseLocation name'
    });

    fail && fail({
      error: 'error',
      errorMessage: 'errorMessage'
    });
  }),
  showAuthGuide: vi.fn(),
  stopPullDownRefresh: vi.fn(),
  customNavigateTo,
  customUrlQueryData: {},
  dateFormat,
  generalErrorFunc: vi.fn(),
  downloadFile: vi.fn(),
  getCurrentPages: vi.fn(),
  questionnaireInfo: null,
  pageScrollTo: vi.fn(),
  call: vi.fn(),
  seeNearBranchesModalFunc:vi.fn()
};

const appOptions = {
  globalData: {
    languagePack: lang,
    partnerMenu:{id:1},
    nativeData:{
      wealthFeatureOn: null,
      wealthMfFeatureOn: false,
      wealthTransactionFeatureOn: null,
      wealthMfTransactionFeatureOn: false,
      authorization: '',
      clientRelease: '',
      clientPlatform: 'ios',
      clientVersion: '0.1.35',
      userAgent: 'Mozilla Firefox5.0',
      language: 'id-ID',
      deviceId: 'B4F9F7BB-6246-40BC-A8D4-143943BB9FF7',
      refreshToken: '',
      accessToken: '',
      beEncryptPublicKey: '',
      beE2EEPublicKey: '',
      sessionKey: '64E5144EEC32266790649A8D8DDA3C18',
      signingPrivateKey: '',
      signingPublicKey: '',
      userId: 'f7b8w6jwFw_BOunLT0VDu',
      encSessionKey: ''
    },
    dayjsLocale: "id", // id or en
    statusBarHeight: 0,
    navigateBackRelaunch:false,
    // purchase
    purchase: {
      selectedAccount: null,
    },
  },
  onLaunch: vi.fn()
};

const processKeys = (key) => {
  const arr = [];
  const _keys = key.split('.');
  
  _keys.forEach(_key => {
    const reg = /(\w+)?(\[(\d+)\])/g;
    let matched;
    let mark = false;
    
    while ((matched = reg.exec(_key))) {
      mark = true;
      if (matched[1]) arr.push(matched[1]);
      if (matched[3]) arr.push(+matched[3]);
    }
    
    if (!mark) arr.push(_key);
  });
  
  return arr;
};

const applyData = (obj, arr, value) => {
  arr.reduce((acc, prop, index) => {
    if (index === arr.length - 1) {
      acc[prop] = value;
      return acc[prop];
    }
    if (acc[prop]) return acc[prop];
    acc[prop] = typeof arr[index + 1] === 'number' ? [] : {};
    return acc[prop];
  }, obj);
};

const spliceData = (data, arr, key) => {
  let _obj = arr.reduce((acc, prop) => {
    const reg = /(\w+)?(\[(\d+)\])/g;
    let matched;
    let mark = false;
    
    while ((matched = reg.exec(prop))) {
      mark = true;
      acc = matched[1] ? acc[matched[1]] : acc;
      acc = matched[3] ? acc[matched[3]] : acc;
    }
    
    return mark ? acc : acc[prop];
  }, data);
  
  _obj.splice(data[key][0], data[key][1], ...data[key].slice(2));
};

// Common setData and $spliceData implementations
const setData = function (newData, cb) {
  const keys = Object.keys(newData);
  keys.forEach(key => {
    const arr = processKeys(key);
    applyData(this.data, arr, newData[key]);
  });
  cb && cb();
};

const $spliceData = function (data, cb) {
  const keys = Object.keys(data);
  keys.forEach(key => {
    const arr = processKeys(key);
    spliceData(this.data, arr, key);
  });
  cb && cb();
};

global.getApp = vi.fn(() => appOptions)

// Define Page and Component with shared logic
global.Page = ({ data, ...rest }) => {
  const page = {
    data,
    setData: vi.fn(setData),
    createMediaQueryObserver: vi.fn(),
    $spliceData: vi.fn($spliceData),
    ...rest,
  };
  
  global.pageInstance = page;
  return page;
};

global.Component = ({ data, ...rest }) => {
  const component = {
    data,
    props: vi.fn(),
    setData: vi.fn(setData),
    createMediaQueryObserver: vi.fn(),
    $spliceData: vi.fn($spliceData),
    ...rest,
    ...rest.methods,
    $page: vi.fn(() => new global.Page())
  };

  global.pageInstance = component;
  return component;
};

global.getCurrentPages = vi.fn(() => [])

global.delay = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}

vi.mock('../utils/generalError.js', () => ({
  default: vi.fn()
}));
