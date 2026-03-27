import request from '../utils/request'


export function lifeStyleMenu() {
  return request({
    url: '/lifestyle/v1/menu?isLifestyle=true',
    headers: {
      'Screen-Id': 'lifestyleLandingPageScreen'
    }
  })
}
export function addContact(data, headers) {
  return request({
    url: "/bill-payment/v1/contact/add",
    method: "POST",
    data,
    headers
  })
}

export function postBillerValidation(data, headers) {
  return request({
    method: "POST",
    url: '/bill-payment/v1/biller/validate',
    data,
    headers: {
      ...headers,
      "Screen-Id": "transactionalMPINMpaas"
    }
  })
}

export function getTransactionHistories(query) {
  return request({
    url: query ? "/lifestyle/v1/transaction-history/list" + query : "/lifestyle/v1/transaction-history/list",
    headers: {
      'Screen-Id': "lifestyleTransactionHistoryScreen"
    }
  })
}

export function getListOfValueFilter() {
  return request({
    url: "/reference/v1/lov?category=lifestyle.trx-history",
    headers: {
      'Screen-Id': "lifestyleFilterScreen"
    }
  })
}

export function postBillerExecution(data, headers) {
  return request({
    method: "POST",
    url: '/bill-payment/v1/biller/execution',
    data,
    headers: {
      ...headers,
      "Screen-Id": "transactionLoading"
    }
  })
}


export function vaTransferPreparation(data, headers) {
  return request({
    url: '/virtual-account/v1/transfer/preparation',
    method: 'POST',
    data,
    headers: {
      ...headers
    }
  })
}

export function accountListPost(data, headers) {
  return request({
    url: '/account/v2/list',
    method: 'POST',
    data,
    headers: {
      ...headers
    }
  })
}


export function postVirtualAccountValidation(data, headers) {
  return request({
    method: "POST",
    url: '/virtual-account/v1/transfer/validate',
    data,
    headers: {
      ...headers,
      "Screen-Id": "transactionalMPINMpaas"
    }
  })
}

export function postVirtualAccountExecution(data, headers) {
  return request({
    method: "POST",
    url: '/virtual-account/v1/transfer/execution',
    data,
    headers: {
      ...headers,
      "Screen-Id": "transactionLoading"
    }
  })
}

export function inquiryVirtualAccountPost(data, headers) {
  return request({
    url: '/lifestyle/v1/inquiry-virtual-account',
    method: 'POST',
    data,
    headers: {
      ...headers
    },
  })
}
export function getTncDetail(data, headers) {
  return request({
    url: `/content/v1/tnc?subType=${data}`,
    headers: {
      ...headers,
      "Screen-Id": "lifestyleTermAndConditionScreen",
    },
  })
}
export function getPostalCode(data, headers) {
  return request({
    method: "POST",
    url: `/lifestyle-javajazz/v1/subdistrict-postcode`,
    headers: {
      "Screen-Id": "javaJazzFestivalInputDataVisitorScreen",
      ...headers
    },
    data: {
      ...data
    }
  })
}
export function getOtpCountries() {
  return request({
    url: "/reference/v1/otp-countries",
    headers: {
      "Screen-Id": "javaJazzFestivalInputDataVisitorScreen",

    }
  })
}
export function getPersonalData() {
  return request({
    url: "/lifestyle-javajazz/v1/personal-data",
    headers: {
      "Screen-Id": "javaJazzFestivalListInputDataVisitorScreen"
    }
  })
}
export function orderTickets(data, headers) {
  return request({
    url: "/lifestyle-javajazz/v1/order-tickets",
    method: "post",
    headers: {
      "Screen-Id": "javaJazzFestivalListInputDataVisitorScreen",
      ...headers
    },
    data
  })
}
export function getlov(queryParam, headers = {
  "Screen-Id": "javaJazzFestivalInputDataVisitorScreen"
}) {
  return request({
    url: `/reference/v1/lov?category=${queryParam}`,
    headers: {
      ...headers
    }
  })
}

export function transactionLimit(data, headers) {
  return request({
    url: `/limit/v1/transaction-limit/remaining?featureCode=${data}`,
    headers: {
      ...headers,
      "Screen-Id": "javaJazzFestivalConfirmationScreen",
    },
  })
}
export function getBillPayment(data, headers) {
  return request({
    url: `/bill-payment/v1/biller/preparation`,
    method: "POST",
    data,
    headers: {
      ...headers,
      "Screen-Id": "javaJazzFestivalConfirmationScreen",
    },
  })
}

export function getListTicket(params, headers) {
  return request({
    url: `/lifestyle-javajazz/v1/tickets?category=${params}`,
    headers: {
      ...headers,
      "Screen-Id": "javaJazzFestivalListTicketScreen",
    },
  })
}

export function getJavaJazzLandingData(data) {
  return request({
    url: `/lifestyle-javajazz/v1/category-ticket?id=${data}`,
    headers: {
      'Screen-Id': "javaJazzFestivalLandingPageScreen"
    }
  })
}

export function inquiryBillPayment(data, headers) {
  return request({
    url: '/lifestyle/v1/inquiry-bill-payment',
    method: 'POST',
    data,
    headers: {
      ...headers
    },
  })
}

export function getJavaJazzPendingOrder() {
  return request({
    url: `/lifestyle-javajazz/v1/pending-order`,
    headers: {
      'Screen-Id': "javaJazzFestivalLandingPageScreen"
    },
    method: 'GET',
    data: {},
  })
}

export function getAllEvents() {
  return request({
    url: '/lifestyle/v1/all-events',
    headers: {
      'Screen-Id': 'lifestyleLandingPageScreen'
    }
  })
}
