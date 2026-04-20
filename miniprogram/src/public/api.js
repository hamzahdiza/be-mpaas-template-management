import request from '../utils/request'


export function lifeStyleMenu() {
  return request({
    url: "/lifestyle/v1/menu",
    method: "GET",
    headers: {}
  });
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
  // return request({
  //   method: "POST",
  //   url: '/bill-payment/v1/biller/validate',
  //   data,
  //   headers: {
  //     ...headers,
  //     "Screen-Id": "transactionalMPINMpaas"
  //   }
  // })
  return new Promise((resolve, reject) => {
    // Simulasi proses asinkron (seperti API call)
    if (data) {
      resolve({
        "data": {
          "data": {
            "scope": "POSTLOGIN_TRANSACTION",
            "token": "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NjAzNTIxMCwiaWF0IjoxNjg2MDM1MjEwfQ.RXX4dvImDl-3eUdwFVU3__LfHNj8BhiUNDab4R1CL0",
            "tokenExpiry": "2023-12-31 23:59:59.000+07:00"
          }
        },
        "status": 200,
        "statusCode": 200,
      });
    } else {
      reject(new Error("Data tidak ditemukan"));
    }
  });
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
  // return request({
  //   method: "POST",
  //   url: '/bill-payment/v1/biller/execution',
  //   data,
  //   headers: {
  //     ...headers,
  //     "Screen-Id": "transactionLoading"
  //   }
  // })
  return new Promise((resolve, reject) => {
    // Simulasi proses asinkron (seperti API call)
    if (data) {
      resolve({
        "data": {
          "data": {
            "journalNumber": "961021",
            "billerAliasName": "User Test Aia",
            "billKey1LabelEn": "Payment Number",
            "billItemList": [{
              "billAmount": "210000",
              "billCustomerChargeAmount": "0",
              "billCode": "01",
              "billName": "American International Assurance Premi"
            }],
            "additionalBillerData": [{
                "additionalValue": "210000",
                "additionalLabel": "Nominal Tagihan"
              },
              {
                "additionalValue": "STEPHEN PERDANA",
                "additionalLabel": "Nama Tertanggung Polis"
              },
              {
                "additionalValue": "AKTIF",
                "additionalLabel": "Status Polis"
              },
              {
                "additionalValue": "10/01/2021",
                "additionalLabel": "Tanggal Jatuh Tempo"
              }
            ],
            "isContactFull": false,
            "ubpCompanyCode": "0031000013",
            "categoryData": {
              "crown": "Off",
              "categoryName": "Event",
              "isCrowned": false,
              "categoryId": "zDe8pgfzM_bVJYE4Ehb2G",
              "isPopular": false,
              "categoryIcon": "https://mav-apigw-ext-test2.bni.co.id:48202/asset/v1/image/d5jew6wPdFWg8bTO6XeWi.png",
              "categorySequence": 3
            },
            "transactionStatus": "SUCCESS",
            "billKey1LabelId": "Nomor Pembayaran",
            "billAmount": 350000,
            "completionTime": "2025-02-25 10:37:37.457+0700",
            "billTotalAmount": 350000,
            "billKey1Label": "Nomor Pembayaran",
            "packageData": {},
            "billerCode": "1066",
            "billerName": "Java Jazz Festival",
            "paymentMethod": "ACCOUNT",
            "isFromContact": false,
            "billerLogo": "https://mav-apigw-ext-test2.bni.co.id:48202/asset/v1/image/d5jew6wPdFWg8bTO6XeWi.png",
            "sofType": "ACCOUNT",
            "paymentType": "3"
          },
          "dataProtected": {
            "referenceId": "202502211037174247",
            "billInfoListNextDay": [{
                "label": "NOMOR BAYAR",
                "value": "1207175"
              },
              {
                "label": "NAMA PEMEGANG POLIS",
                "value": "User Test AIA"
              },
              {
                "label": "NOMINAL PEMBAYARAN",
                "value": "350000"
              }
            ],
            "billKey2": "350000",
            "billInfoListToday": [{
                "label": "NOMOR BAYAR",
                "value": "1207175"
              },
              {
                "label": "NAMA PEMEGANG POLIS",
                "value": "User Test AIA"
              },
              {
                "label": "NOMINAL PEMBAYARAN",
                "value": "350000"
              },
              {
                "label": "TOTAL",
                "value": "350000"
              }
            ],
            "billInfoList": [{
                "label": "Nomor Bayar",
                "value": "1207175"
              },
              {
                "label": "Nama Pemegang Polis",
                "value": "User Test AIA"
              },
              {
                "label": "Nominal Pembayaran",
                "value": "350000"
              },
              {
                "label": "Total",
                "value": "350000"
              }
            ],
            "addedBillInfoList": [{
                "label": "NOMOR BAYAR",
                "value": "1207175"
              },
              {
                "label": "NAMA PEMEGANG POLIS",
                "value": "User Test AIA"
              },
              {
                "label": "NOMINAL PEMBAYARAN",
                "value": "350000"
              },
              {
                "label": "TOTAL",
                "value": "350000"
              }
            ],
            "billKey1": "1207175",
            "creditCard": {},
            "transactionId": "sW1I5q6cINhvSOeNyGZVm",
            "customerName": "User Test AIA",
            "account": {
              "accountName": "SYAMSUL BAHRI",
              "productName": "TAPLUS",
              "accountNumber": "1000914700"
            },
            "transactionDetail": [{
                "label": "NOMOR BAYAR",
                "value": "1207175"
              },
              {
                "label": "NAMA PEMEGANG POLIS",
                "value": "User Test AIA"
              },
              {
                "label": "NOMINAL PEMBAYARAN",
                "value": "350000"
              }
            ]
          }
        },
        "status": 200,
        "statusCode": 200,
      });
    } else {
      reject(new Error("Data tidak ditemukan"));
    }
  });
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
  return new Promise((resolve, reject) => {
    // Simulasi proses asinkron (seperti API call)
    if (data) {
      resolve({
        "data": {
          "dataProtected": {
            "sofList": [{
              "isMainAccount": true,
              "ownership": "OWN  ",
              "accountNumber": "1000785003",
              "activeBalance": 10649579,
              "disburseAmount": 0,
              "accountType": "2000",
              "subCat": "0001",
              "accountProductType": "TABUNGAN",
              "branchCode": "259",
              "limit": 0,
              "cif": "10001015659",
              "currency": "IDR",
              "accountStatus": "BUKA",
              "sofFlag": true,
              "accountTypeCode": "DEP",
              "accountName": "SYAMSUL BAHRI",
              "productName": "TAPLUS",
              "flagBank": "0",
              "cardlessSupported": true,
              "balance": 4106495796
            }]
          }
        },
        "status": 200,
        "statusCode": 200,
      });
    } else {
      reject(new Error("Data tidak ditemukan"));
    }
  });

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
  // return request({
  //   method: "POST",
  //   url: `/lifestyle-javajazz/v1/subdistrict-postcode`,
  //   headers: {
  //     "Screen-Id": "javaJazzFestivalInputDataVisitorScreen",
  //     ...headers
  //   },
  //   data: {
  //     ...data
  //   }
  // })
  return new Promise((resolve, reject) => {
    // Simulasi proses asinkron (seperti API call)
    if (data) {
      resolve({
        "data": {
          "dataProtected": {
            "totalPage": 8339,
            "page": 1,
            "noOfRecord": 10,
            "subdistrictPostcodeList": [{
                "subdistrictName": "GAMBIR",
                "postalCode": "10110"
              },
              {
                "subdistrictName": "MENTENG",
                "postalCode": "10310"
              },
              {
                "subdistrictName": "GLODOK",
                "postalCode": "11120"
              },
              {
                "subdistrictName": "BINTARO",
                "postalCode": "12330"
              },
              {
                "subdistrictName": "SENAYAN",
                "postalCode": "12190"
              },
              {
                "subdistrictName": "PLUIT",
                "postalCode": "14450"
              },
              {
                "subdistrictName": "KELAPA GADING BARAT",
                "postalCode": "14240"
              },
              {
                "subdistrictName": "CIKOKOL",
                "postalCode": "15117"
              },
              {
                "subdistrictName": "KARAWACI",
                "postalCode": "15115"
              },
              {
                "subdistrictName": "BSD CITY (LENGKONG GUDANG)",
                "postalCode": "15310"
              },
              {
                "subdistrictName": "ALAM SUTERA (PANUNGGANGAN)",
                "postalCode": "15143"
              },
              {
                "subdistrictName": "GADONG SERPONG (PAKUJAMBE)",
                "postalCode": "15810"
              }
            ]
          }
        },
        "status": 200,
        "statusCode": 200,
      });
    } else {
      reject(new Error("Data tidak ditemukan"));
    }
  });
}
export function getOtpCountries() {
  return new Promise((resolve, reject) => {
    // Simulasi proses asinkron (seperti API call)
    resolve({
      "data": {
        "data": {
          "countryList": [{
              "countryImage": [
                "1F1EE",
                "1F1E9"
              ],
              "countryId": "ID",
              "callingPrefix": "62",
              "countryName": "Indonesia"
            },
            {
              "countryImage": [
                "1F1FA",
                "1F1F8"
              ],
              "countryId": "US",
              "callingPrefix": "1",
              "countryName": "Amerika Serikat"
            },
            {
              "countryImage": [
                "1F1F3",
                "1F1F1"
              ],
              "countryId": "NL",
              "callingPrefix": "31",
              "countryName": "Belanda"
            },
            {
              "countryImage": [
                "1F1ED",
                "1F1F0"
              ],
              "countryId": "HK",
              "callingPrefix": "852",
              "countryName": "Hong Kong"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1E7"
              ],
              "countryId": "GB",
              "callingPrefix": "44",
              "countryName": "Inggris Raya"
            },
            {
              "countryImage": [
                "1F1EF",
                "1F1F5"
              ],
              "countryId": "JP",
              "callingPrefix": "81",
              "countryName": "Jepang"
            },
            {
              "countryImage": [
                "1F1F0",
                "1F1F7"
              ],
              "countryId": "KR",
              "callingPrefix": "82",
              "countryName": "Korea Selatan"
            },
            {
              "countryImage": [
                "1F1F8",
                "1F1EC"
              ],
              "countryId": "SG",
              "callingPrefix": "65",
              "countryName": "Singapura"
            },
            {
              "countryImage": [
                "1F1E6",
                "1F1EB"
              ],
              "countryId": "AF",
              "callingPrefix": "93",
              "countryName": "Afganistan"
            },
            {
              "countryImage": [
                "1F1FF",
                "1F1E6"
              ],
              "countryId": "ZA",
              "callingPrefix": "27",
              "countryName": "Afrika Selatan"
            },
            {
              "countryImage": [
                "1F1E6",
                "1F1F1"
              ],
              "countryId": "AL",
              "callingPrefix": "355",
              "countryName": "Albania"
            },
            {
              "countryImage": [
                "1F1E9",
                "1F1FF"
              ],
              "countryId": "DZ",
              "callingPrefix": "213",
              "countryName": "Aljazair"
            },
            {
              "countryImage": [
                "1F1E6",
                "1F1E9"
              ],
              "countryId": "AD",
              "callingPrefix": "376",
              "countryName": "Andorra"
            },
            {
              "countryImage": [
                "1F1E6",
                "1F1F4"
              ],
              "countryId": "AO",
              "callingPrefix": "244",
              "countryName": "Angola"
            },
            {
              "countryImage": [
                "1F1E6",
                "1F1EE"
              ],
              "countryId": "AI",
              "callingPrefix": "1264",
              "countryName": "Anguilla"
            },
            {
              "countryImage": [
                "1F1E6",
                "1F1F6"
              ],
              "countryId": "AQ",
              "callingPrefix": "672",
              "countryName": "Antartika"
            },
            {
              "countryImage": [
                "1F1E6",
                "1F1EC"
              ],
              "countryId": "AG",
              "callingPrefix": "1268",
              "countryName": "Antigua dan Barbuda"
            },
            {
              "countryImage": [
                "1F1F8",
                "1F1E6"
              ],
              "countryId": "SA",
              "callingPrefix": "966",
              "countryName": "Arab Saudi"
            },
            {
              "countryImage": [
                "1F1E6",
                "1F1F7"
              ],
              "countryId": "AR",
              "callingPrefix": "54",
              "countryName": "Argentina"
            },
            {
              "countryImage": [
                "1F1E6",
                "1F1F2"
              ],
              "countryId": "AM",
              "callingPrefix": "374",
              "countryName": "Armenia"
            },
            {
              "countryImage": [
                "1F1E6",
                "1F1FC"
              ],
              "countryId": "AW",
              "callingPrefix": "297",
              "countryName": "Aruba"
            },
            {
              "countryImage": [
                "1F1E6",
                "1F1FA"
              ],
              "countryId": "AU",
              "callingPrefix": "61",
              "countryName": "Australia"
            },
            {
              "countryImage": [
                "1F1E6",
                "1F1F9"
              ],
              "countryId": "AT",
              "callingPrefix": "43",
              "countryName": "Austria"
            },
            {
              "countryImage": [
                "1F1E6",
                "1F1FF"
              ],
              "countryId": "AZ",
              "callingPrefix": "994",
              "countryName": "Azerbaijan"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1F8"
              ],
              "countryId": "BS",
              "callingPrefix": "1242",
              "countryName": "Bahama"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1ED"
              ],
              "countryId": "BH",
              "callingPrefix": "973",
              "countryName": "Bahrain"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1E9"
              ],
              "countryId": "BD",
              "callingPrefix": "880",
              "countryName": "Bangladesh"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1E7"
              ],
              "countryId": "BB",
              "callingPrefix": "1246",
              "countryName": "Barbados"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1FE"
              ],
              "countryId": "BY",
              "callingPrefix": "375",
              "countryName": "Belarus"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1EA"
              ],
              "countryId": "BE",
              "callingPrefix": "32",
              "countryName": "Belgia"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1FF"
              ],
              "countryId": "BZ",
              "callingPrefix": "501",
              "countryName": "Belize"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1EF"
              ],
              "countryId": "BJ",
              "callingPrefix": "229",
              "countryName": "Benin"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1F2"
              ],
              "countryId": "BM",
              "callingPrefix": "1441",
              "countryName": "Bermuda"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1F9"
              ],
              "countryId": "BT",
              "callingPrefix": "975",
              "countryName": "Bhutan"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1F4"
              ],
              "countryId": "BO",
              "callingPrefix": "591",
              "countryName": "Bolivia"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1E6"
              ],
              "countryId": "BA",
              "callingPrefix": "387",
              "countryName": "Bosnia dan Herzegovina"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1FC"
              ],
              "countryId": "BW",
              "callingPrefix": "267",
              "countryName": "Botswana"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1F7"
              ],
              "countryId": "BR",
              "callingPrefix": "55",
              "countryName": "Brazil"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1F3"
              ],
              "countryId": "BN",
              "callingPrefix": "673",
              "countryName": "Brunei Darussalam"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1EC"
              ],
              "countryId": "BG",
              "callingPrefix": "359",
              "countryName": "Bulgaria"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1EB"
              ],
              "countryId": "BF",
              "callingPrefix": "226",
              "countryName": "Burkina Faso"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1EE"
              ],
              "countryId": "BI",
              "callingPrefix": "257",
              "countryName": "Burundi"
            },
            {
              "countryImage": [
                "1F1F9",
                "1F1E9"
              ],
              "countryId": "TD",
              "callingPrefix": "235",
              "countryName": "Chad"
            },
            {
              "countryImage": [
                "1F1E8",
                "1F1F1"
              ],
              "countryId": "CL",
              "callingPrefix": "56",
              "countryName": "Chili"
            },
            {
              "countryImage": [
                "1F1E8",
                "1F1F3"
              ],
              "countryId": "CN",
              "callingPrefix": "86",
              "countryName": "Cina"
            },
            {
              "countryImage": [
                "1F1E8",
                "1F1EE"
              ],
              "countryId": "CI",
              "callingPrefix": "225",
              "countryName": "Cote"
            },
            {
              "countryImage": [
                "1F1E9",
                "1F1F0"
              ],
              "countryId": "DK",
              "callingPrefix": "45",
              "countryName": "Denmark"
            },
            {
              "countryImage": [
                "1F1E9",
                "1F1EF"
              ],
              "countryId": "DJ",
              "callingPrefix": "253",
              "countryName": "Djibouti"
            },
            {
              "countryImage": [
                "1F1E9",
                "1F1F2"
              ],
              "countryId": "DM",
              "callingPrefix": "1767",
              "countryName": "Dominika"
            },
            {
              "countryImage": [
                "1F1EA",
                "1F1E8"
              ],
              "countryId": "EC",
              "callingPrefix": "593",
              "countryName": "Ekuador"
            },
            {
              "countryImage": [
                "1F1F8",
                "1F1FB"
              ],
              "countryId": "SV",
              "callingPrefix": "503",
              "countryName": "El Salvador"
            },
            {
              "countryImage": [
                "1F1EA",
                "1F1F7"
              ],
              "countryId": "ER",
              "callingPrefix": "291",
              "countryName": "Eritrea"
            },
            {
              "countryImage": [
                "1F1EA",
                "1F1EA"
              ],
              "countryId": "EE",
              "callingPrefix": "372",
              "countryName": "Estonia"
            },
            {
              "countryImage": [
                "1F1EA",
                "1F1F9"
              ],
              "countryId": "ET",
              "callingPrefix": "251",
              "countryName": "Etiopia"
            },
            {
              "countryImage": [
                "1F1EB",
                "1F1EF"
              ],
              "countryId": "FJ",
              "callingPrefix": "679",
              "countryName": "Fiji"
            },
            {
              "countryImage": [
                "1F1F5",
                "1F1ED"
              ],
              "countryId": "PH",
              "callingPrefix": "63",
              "countryName": "Filipina"
            },
            {
              "countryImage": [
                "1F1EB",
                "1F1EE"
              ],
              "countryId": "FI",
              "callingPrefix": "358",
              "countryName": "Finlandia"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1E6"
              ],
              "countryId": "GA",
              "callingPrefix": "241",
              "countryName": "Gabon"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1F2"
              ],
              "countryId": "GM",
              "callingPrefix": "220",
              "countryName": "Gambia"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1EA"
              ],
              "countryId": "GE",
              "callingPrefix": "995",
              "countryName": "Georgia"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1F8"
              ],
              "countryId": "GS",
              "callingPrefix": "500",
              "countryName": "Georgia Selatan dan Kepulauan Sandwich Selatan"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1ED"
              ],
              "countryId": "GH",
              "callingPrefix": "233",
              "countryName": "Ghana"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1EE"
              ],
              "countryId": "GI",
              "callingPrefix": "350",
              "countryName": "Gibraltar"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1E9"
              ],
              "countryId": "GD",
              "callingPrefix": "1473",
              "countryName": "Granada"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1F1"
              ],
              "countryId": "GL",
              "callingPrefix": "299",
              "countryName": "Greenland"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1F5"
              ],
              "countryId": "GP",
              "callingPrefix": "590",
              "countryName": "Guadeloupe"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1FA"
              ],
              "countryId": "GU",
              "callingPrefix": "1671",
              "countryName": "Guam"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1F9"
              ],
              "countryId": "GT",
              "callingPrefix": "502",
              "countryName": "Guatemala"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1EC"
              ],
              "countryId": "GG",
              "callingPrefix": "441481",
              "countryName": "Guernsey"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1F3"
              ],
              "countryId": "GN",
              "callingPrefix": "224",
              "countryName": "Guinea"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1F6"
              ],
              "countryId": "GQ",
              "callingPrefix": "240",
              "countryName": "Guinea Khatulistiwa"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1FC"
              ],
              "countryId": "GW",
              "callingPrefix": "245",
              "countryName": "Guinea-Bissau"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1FE"
              ],
              "countryId": "GY",
              "callingPrefix": "595",
              "countryName": "Guyana"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1EB"
              ],
              "countryId": "GF",
              "callingPrefix": "594",
              "countryName": "Guyana Prancis"
            },
            {
              "countryImage": [
                "1F1ED",
                "1F1F9"
              ],
              "countryId": "HT",
              "callingPrefix": "509",
              "countryName": "Haiti"
            },
            {
              "countryImage": [
                "1F1ED",
                "1F1F3"
              ],
              "countryId": "HN",
              "callingPrefix": "504",
              "countryName": "Honduras"
            },
            {
              "countryImage": [
                "1F1ED",
                "1F1FA"
              ],
              "countryId": "HU",
              "callingPrefix": "36",
              "countryName": "Hungaria"
            },
            {
              "countryImage": [
                "1F1EE",
                "1F1F3"
              ],
              "countryId": "IN",
              "callingPrefix": "91",
              "countryName": "India"
            },
            {
              "countryImage": [
                "1F1EE",
                "1F1F6"
              ],
              "countryId": "IQ",
              "callingPrefix": "964",
              "countryName": "Irak"
            },
            {
              "countryImage": [
                "1F1EE",
                "1F1EA"
              ],
              "countryId": "IE",
              "callingPrefix": "353",
              "countryName": "Irlandia"
            },
            {
              "countryImage": [
                "1F1EE",
                "1F1F8"
              ],
              "countryId": "IS",
              "callingPrefix": "354",
              "countryName": "Islandia"
            },
            {
              "countryImage": [
                "1F1EE",
                "1F1F1"
              ],
              "countryId": "IL",
              "callingPrefix": "972",
              "countryName": "Israel"
            },
            {
              "countryImage": [
                "1F1EE",
                "1F1F9"
              ],
              "countryId": "IT",
              "callingPrefix": "39",
              "countryName": "Italia"
            },
            {
              "countryImage": [
                "1F1EF",
                "1F1F2"
              ],
              "countryId": "JM",
              "callingPrefix": "1876",
              "countryName": "Jamaika"
            },
            {
              "countryImage": [
                "1F1E9",
                "1F1EA"
              ],
              "countryId": "DE",
              "callingPrefix": "49",
              "countryName": "Jerman"
            },
            {
              "countryImage": [
                "1F1EF",
                "1F1EA"
              ],
              "countryId": "JE",
              "callingPrefix": "441534",
              "countryName": "Jersey"
            },
            {
              "countryImage": [
                "1F1F3",
                "1F1E8"
              ],
              "countryId": "NC",
              "callingPrefix": "687",
              "countryName": "Kaledonia Baru"
            },
            {
              "countryImage": [
                "1F1F0",
                "1F1ED"
              ],
              "countryId": "KH",
              "callingPrefix": "855",
              "countryName": "Kamboja"
            },
            {
              "countryImage": [
                "1F1E8",
                "1F1F2"
              ],
              "countryId": "CM",
              "callingPrefix": "237",
              "countryName": "Kamerun"
            },
            {
              "countryImage": [
                "1F1E8",
                "1F1E6"
              ],
              "countryId": "CA",
              "callingPrefix": "1",
              "countryName": "Kanada"
            },
            {
              "countryImage": [
                "1F1F0",
                "1F1FF"
              ],
              "countryId": "KZ",
              "callingPrefix": "7",
              "countryName": "Kazakhstan"
            },
            {
              "countryImage": [
                "1F1F0",
                "1F1EA"
              ],
              "countryId": "KE",
              "callingPrefix": "254",
              "countryName": "Kenya"
            },
            {
              "countryImage": [
                "1F1E6",
                "1F1FD"
              ],
              "countryId": "AX",
              "callingPrefix": "358",
              "countryName": "Kepulauan Aland"
            },
            {
              "countryImage": [
                "1F1F0",
                "1F1FE"
              ],
              "countryId": "KY",
              "callingPrefix": "1345",
              "countryName": "Kepulauan Cayman"
            },
            {
              "countryImage": [
                "1F1E8",
                "1F1E8"
              ],
              "countryId": "CC",
              "callingPrefix": "61",
              "countryName": "Kepulauan Cocos"
            },
            {
              "countryImage": [
                "1F1E8",
                "1F1F0"
              ],
              "countryId": "CK",
              "callingPrefix": "682",
              "countryName": "Kepulauan Cook"
            },
            {
              "countryImage": [
                "1F1EB",
                "1F1F0"
              ],
              "countryId": "FK",
              "callingPrefix": "500",
              "countryName": "Kepulauan Falkland"
            },
            {
              "countryImage": [
                "1F1EB",
                "1F1F4"
              ],
              "countryId": "FO",
              "callingPrefix": "298",
              "countryName": "Kepulauan Faroe"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1F5"
              ],
              "countryId": "MP",
              "callingPrefix": "1670",
              "countryName": "Kepulauan Mariana Utara"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1ED"
              ],
              "countryId": "MH",
              "callingPrefix": "692",
              "countryName": "Kepulauan Marshall"
            },
            {
              "countryImage": [
                "1F1F8",
                "1F1E7"
              ],
              "countryId": "SB",
              "callingPrefix": "677",
              "countryName": "Kepulauan Solomon"
            },
            {
              "countryImage": [
                "1F1F9",
                "1F1E8"
              ],
              "countryId": "TC",
              "callingPrefix": "1649",
              "countryName": "Kepulauan Turks dan Caicos"
            },
            {
              "countryImage": [
                "1F1FB",
                "1F1EC"
              ],
              "countryId": "VI",
              "callingPrefix": "1340",
              "countryName": "Kepulauan Virgin, AS"
            },
            {
              "countryImage": [
                "1F1FB",
                "1F1EC"
              ],
              "countryId": "VG",
              "callingPrefix": "1284",
              "countryName": "Kepulauan Virgin, Inggris"
            },
            {
              "countryImage": [
                "1F1F0",
                "1F1EC"
              ],
              "countryId": "KG",
              "callingPrefix": "996",
              "countryName": "Kirgistan"
            },
            {
              "countryImage": [
                "1F1F0",
                "1F1EE"
              ],
              "countryId": "KI",
              "callingPrefix": "686",
              "countryName": "Kiribati"
            },
            {
              "countryImage": [
                "1F1E8",
                "1F1F4"
              ],
              "countryId": "CO",
              "callingPrefix": "57",
              "countryName": "Kolumbia"
            },
            {
              "countryImage": [
                "1F1F0",
                "1F1F2"
              ],
              "countryId": "KM",
              "callingPrefix": "269",
              "countryName": "Komoro"
            },
            {
              "countryImage": [
                "1F1E8",
                "1F1E9"
              ],
              "countryId": "CG",
              "callingPrefix": "242",
              "countryName": "Kongo"
            },
            {
              "countryImage": [
                "1F1E8",
                "1F1F7"
              ],
              "countryId": "CR",
              "callingPrefix": "506",
              "countryName": "Kosta Rika"
            },
            {
              "countryImage": [
                "1F1FB",
                "1F1E6"
              ],
              "countryId": "VA",
              "callingPrefix": "379",
              "countryName": "Kota Vatikan"
            },
            {
              "countryImage": [
                "1F1ED",
                "1F1F7"
              ],
              "countryId": "HR",
              "callingPrefix": "385",
              "countryName": "Kroasia"
            },
            {
              "countryImage": [
                "1F1F0",
                "1F1FC"
              ],
              "countryId": "KW",
              "callingPrefix": "965",
              "countryName": "Kuwait"
            },
            {
              "countryImage": [
                "1F1F1",
                "1F1E6"
              ],
              "countryId": "LA",
              "callingPrefix": "856",
              "countryName": "Laos"
            },
            {
              "countryImage": [
                "1F1F1",
                "1F1FB"
              ],
              "countryId": "LV",
              "callingPrefix": "371",
              "countryName": "Latvia"
            },
            {
              "countryImage": [
                "1F1F1",
                "1F1E7"
              ],
              "countryId": "LB",
              "callingPrefix": "961",
              "countryName": "Lebanon"
            },
            {
              "countryImage": [
                "1F1F1",
                "1F1F8"
              ],
              "countryId": "LS",
              "callingPrefix": "266",
              "countryName": "Lesotho"
            },
            {
              "countryImage": [
                "1F1F1",
                "1F1F7"
              ],
              "countryId": "LR",
              "callingPrefix": "231",
              "countryName": "Liberia"
            },
            {
              "countryImage": [
                "1F1F1",
                "1F1EE"
              ],
              "countryId": "LI",
              "callingPrefix": "423",
              "countryName": "Liechtenstein"
            },
            {
              "countryImage": [
                "1F1F1",
                "1F1F9"
              ],
              "countryId": "LT",
              "callingPrefix": "370",
              "countryName": "Lithuania"
            },
            {
              "countryImage": [
                "1F1F1",
                "1F1FA"
              ],
              "countryId": "LU",
              "callingPrefix": "352",
              "countryName": "Luksemburg"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1EC"
              ],
              "countryId": "MG",
              "callingPrefix": "261",
              "countryName": "Madagaskar"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1F4"
              ],
              "countryId": "MO",
              "callingPrefix": "853",
              "countryName": "Makau"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1F0"
              ],
              "countryId": "MK",
              "callingPrefix": "389",
              "countryName": "Makedonia"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1FB"
              ],
              "countryId": "MV",
              "callingPrefix": "960",
              "countryName": "Maladewa"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1FC"
              ],
              "countryId": "MW",
              "callingPrefix": "265",
              "countryName": "Malawi"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1FE"
              ],
              "countryId": "MY",
              "callingPrefix": "60",
              "countryName": "Malaysia"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1F1"
              ],
              "countryId": "ML",
              "callingPrefix": "223",
              "countryName": "Mali"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1F9"
              ],
              "countryId": "MT",
              "callingPrefix": "356",
              "countryName": "Malta"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1E6"
              ],
              "countryId": "MA",
              "callingPrefix": "212",
              "countryName": "Maroko"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1F6"
              ],
              "countryId": "MQ",
              "callingPrefix": "596",
              "countryName": "Martinik"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1F7"
              ],
              "countryId": "MR",
              "callingPrefix": "222",
              "countryName": "Mauritania"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1FA"
              ],
              "countryId": "MU",
              "callingPrefix": "230",
              "countryName": "Mauritius"
            },
            {
              "countryImage": [
                "1F1FE",
                "1F1F9"
              ],
              "countryId": "YT",
              "callingPrefix": "262",
              "countryName": "Mayotte"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1FD"
              ],
              "countryId": "MX",
              "callingPrefix": "52",
              "countryName": "Meksiko"
            },
            {
              "countryImage": [
                "1F1EA",
                "1F1EC"
              ],
              "countryId": "EG",
              "callingPrefix": "20",
              "countryName": "Mesir"
            },
            {
              "countryImage": [
                "1F1EB",
                "1F1F2"
              ],
              "countryId": "FM",
              "callingPrefix": "691",
              "countryName": "Mikronesia"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1E9"
              ],
              "countryId": "MD",
              "callingPrefix": "373",
              "countryName": "Moldova"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1E8"
              ],
              "countryId": "MC",
              "callingPrefix": "377",
              "countryName": "Monako"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1F3"
              ],
              "countryId": "MN",
              "callingPrefix": "976",
              "countryName": "Mongolia"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1EA"
              ],
              "countryId": "ME",
              "callingPrefix": "382",
              "countryName": "Montenegro"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1F8"
              ],
              "countryId": "MS",
              "callingPrefix": "1664",
              "countryName": "Montserrat"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1FF"
              ],
              "countryId": "MZ",
              "callingPrefix": "258",
              "countryName": "Mozambik"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1F2"
              ],
              "countryId": "MM",
              "callingPrefix": "95",
              "countryName": "Myanmar"
            },
            {
              "countryImage": [
                "1F1F3",
                "1F1E6"
              ],
              "countryId": "NA",
              "callingPrefix": "264",
              "countryName": "Namibia"
            },
            {
              "countryImage": [
                "1F1F3",
                "1F1F7"
              ],
              "countryId": "NR",
              "callingPrefix": "674",
              "countryName": "Nauru"
            },
            {
              "countryImage": [
                "1F1F3",
                "1F1F5"
              ],
              "countryId": "NP",
              "callingPrefix": "977",
              "countryName": "Nepal"
            },
            {
              "countryImage": [
                "1F1F3",
                "1F1EA"
              ],
              "countryId": "NE",
              "callingPrefix": "227",
              "countryName": "Niger"
            },
            {
              "countryImage": [
                "1F1F3",
                "1F1EC"
              ],
              "countryId": "NG",
              "callingPrefix": "234",
              "countryName": "Nigeria"
            },
            {
              "countryImage": [
                "1F1F3",
                "1F1EE"
              ],
              "countryId": "NI",
              "callingPrefix": "505",
              "countryName": "Nikaragua"
            },
            {
              "countryImage": [
                "1F1F3",
                "1F1FA"
              ],
              "countryId": "NU",
              "callingPrefix": "683",
              "countryName": "Niue"
            },
            {
              "countryImage": [
                "1F1F3",
                "1F1F4"
              ],
              "countryId": "NO",
              "callingPrefix": "47",
              "countryName": "Norway"
            },
            {
              "countryImage": [
                "1F1F4",
                "1F1F2"
              ],
              "countryId": "OM",
              "callingPrefix": "968",
              "countryName": "Oman"
            },
            {
              "countryImage": [
                "1F1F5",
                "1F1F0"
              ],
              "countryId": "PK",
              "callingPrefix": "92",
              "countryName": "Pakistan"
            },
            {
              "countryImage": [
                "1F1F5",
                "1F1FC"
              ],
              "countryId": "PW",
              "callingPrefix": "680",
              "countryName": "Palau"
            },
            {
              "countryImage": [
                "1F1F5",
                "1F1F8"
              ],
              "countryId": "PS",
              "callingPrefix": "970",
              "countryName": "Palestina"
            },
            {
              "countryImage": [
                "1F1F5",
                "1F1E6"
              ],
              "countryId": "PA",
              "callingPrefix": "507",
              "countryName": "Panama"
            },
            {
              "countryImage": [
                "1F1F5",
                "1F1EC"
              ],
              "countryId": "PG",
              "callingPrefix": "675",
              "countryName": "Papua Nugini"
            },
            {
              "countryImage": [
                "1F1F5",
                "1F1FE"
              ],
              "countryId": "PY",
              "callingPrefix": "595",
              "countryName": "Paraguay"
            },
            {
              "countryImage": [
                "1F1F5",
                "1F1EA"
              ],
              "countryId": "PE",
              "callingPrefix": "51",
              "countryName": "Peru"
            },
            {
              "countryImage": [
                "1F1F5",
                "1F1F3"
              ],
              "countryId": "PN",
              "callingPrefix": "872",
              "countryName": "Pitcairn"
            },
            {
              "countryImage": [
                "1F1F5",
                "1F1F1"
              ],
              "countryId": "PL",
              "callingPrefix": "48",
              "countryName": "Polandia"
            },
            {
              "countryImage": [
                "1F1F5",
                "1F1EB"
              ],
              "countryId": "PF",
              "callingPrefix": "689",
              "countryName": "Polinesia Prancis"
            },
            {
              "countryImage": [
                "1F1F5",
                "1F1F9"
              ],
              "countryId": "PT",
              "callingPrefix": "351",
              "countryName": "Portugal"
            },
            {
              "countryImage": [
                "1F1EB",
                "1F1F7"
              ],
              "countryId": "FR",
              "callingPrefix": "33",
              "countryName": "Prancis"
            },
            {
              "countryImage": [
                "1F1F5",
                "1F1F7"
              ],
              "countryId": "PR",
              "callingPrefix": "1787",
              "countryName": "Puerto Riko"
            },
            {
              "countryImage": [
                "1F1F5",
                "1F1F7"
              ],
              "countryId": "PR",
              "callingPrefix": "1939",
              "countryName": "Puerto Riko"
            },
            {
              "countryImage": [
                "1F1EE",
                "1F1F2"
              ],
              "countryId": "IM",
              "callingPrefix": "441624",
              "countryName": "Pulau Man"
            },
            {
              "countryImage": [
                "1F1E8",
                "1F1FD"
              ],
              "countryId": "CX",
              "callingPrefix": "61",
              "countryName": "Pulau Natal"
            },
            {
              "countryImage": [
                "1F1F3",
                "1F1EB"
              ],
              "countryId": "NF",
              "callingPrefix": "672",
              "countryName": "Pulau Norfolk"
            },
            {
              "countryImage": [
                "1F1F6",
                "1F1E6"
              ],
              "countryId": "QA",
              "callingPrefix": "974",
              "countryName": "Qatar"
            },
            {
              "countryImage": [
                "1F1E8",
                "1F1FF"
              ],
              "countryId": "CZ",
              "callingPrefix": "420",
              "countryName": "Republik Ceko"
            },
            {
              "countryImage": [
                "1F1E8",
                "1F1E9"
              ],
              "countryId": "CD",
              "callingPrefix": "243",
              "countryName": "Republik Demokratik Kongo"
            },
            {
              "countryImage": [
                "1F1E9",
                "1F1F4"
              ],
              "countryId": "DO",
              "callingPrefix": "1849",
              "countryName": "Republik Dominika"
            },
            {
              "countryImage": [
                "1F1E9",
                "1F1F4"
              ],
              "countryId": "DO",
              "callingPrefix": "1809",
              "countryName": "Republik Dominika"
            },
            {
              "countryImage": [
                "1F1E9",
                "1F1F4"
              ],
              "countryId": "DO",
              "callingPrefix": "1829",
              "countryName": "Republik Dominika"
            },
            {
              "countryImage": [
                "1F1F7",
                "1F1EA"
              ],
              "countryId": "RE",
              "callingPrefix": "262",
              "countryName": "Reuni"
            },
            {
              "countryImage": [
                "1F1F7",
                "1F1F4"
              ],
              "countryId": "RO",
              "callingPrefix": "40",
              "countryName": "Rumania"
            },
            {
              "countryImage": [
                "1F1F7",
                "1F1FC"
              ],
              "countryId": "RW",
              "callingPrefix": "250",
              "countryName": "Rwanda"
            },
            {
              "countryImage": [
                "1F1F8",
                "1F1ED"
              ],
              "countryId": "SH",
              "callingPrefix": "290",
              "countryName": "Saint Helena, Kenaikan dan Tristan Da Cunha"
            },
            {
              "countryImage": [
                "1F1F0",
                "1F1F3"
              ],
              "countryId": "KN",
              "callingPrefix": "1869",
              "countryName": "Saint Kitts dan Nevis"
            },
            {
              "countryImage": [
                "1F1F5",
                "1F1F2"
              ],
              "countryId": "PM",
              "callingPrefix": "508",
              "countryName": "Saint Pierre dan Miquelon"
            },
            {
              "countryImage": [
                "1F1FB",
                "1F1E8"
              ],
              "countryId": "VC",
              "callingPrefix": "1784",
              "countryName": "Saint Vincent dan Grenadines"
            },
            {
              "countryImage": [
                "1F1E6",
                "1F1F8"
              ],
              "countryId": "WS",
              "callingPrefix": "685",
              "countryName": "Samoa"
            },
            {
              "countryImage": [
                "1F1E6",
                "1F1F8"
              ],
              "countryId": "AS",
              "callingPrefix": "1684",
              "countryName": "Samoa Amerika"
            },
            {
              "countryImage": [
                "1F1F8",
                "1F1F2"
              ],
              "countryId": "SM",
              "callingPrefix": "378",
              "countryName": "San Marino"
            },
            {
              "countryImage": [
                "1F1E7",
                "1F1F1"
              ],
              "countryId": "BL",
              "callingPrefix": "590",
              "countryName": "Santo Barthelemy"
            },
            {
              "countryImage": [
                "1F1F1",
                "1F1E8"
              ],
              "countryId": "LC",
              "callingPrefix": "1758",
              "countryName": "Santo Lusia"
            },
            {
              "countryImage": [
                "1F1F2",
                "1F1EB"
              ],
              "countryId": "MF",
              "callingPrefix": "590",
              "countryName": "Santo Martin"
            },
            {
              "countryImage": [
                "1F1F8",
                "1F1F9"
              ],
              "countryId": "ST",
              "callingPrefix": "239",
              "countryName": "Sao Tome dan Principe"
            },
            {
              "countryImage": [
                "1F1F3",
                "1F1FF"
              ],
              "countryId": "NZ",
              "callingPrefix": "64",
              "countryName": "Selandia Baru"
            },
            {
              "countryImage": [
                "1F1F8",
                "1F1F3"
              ],
              "countryId": "SN",
              "callingPrefix": "221",
              "countryName": "Senegal"
            },
            {
              "countryImage": [
                "1F1F7",
                "1F1F8"
              ],
              "countryId": "RS",
              "callingPrefix": "381",
              "countryName": "Serbia"
            },
            {
              "countryImage": [
                "1F1F8",
                "1F1E8"
              ],
              "countryId": "SC",
              "callingPrefix": "248",
              "countryName": "Seychelles"
            },
            {
              "countryImage": [
                "1F1F8",
                "1F1F1"
              ],
              "countryId": "SL",
              "callingPrefix": "232",
              "countryName": "Sierra Leone"
            },
            {
              "countryImage": [
                "1F1E8",
                "1F1FE"
              ],
              "countryId": "CY",
              "callingPrefix": "357",
              "countryName": "Siprus"
            },
            {
              "countryImage": [
                "1F1F8",
                "1F1EE"
              ],
              "countryId": "SI",
              "callingPrefix": "386",
              "countryName": "Slovenia"
            },
            {
              "countryImage": [
                "1F1F8",
                "1F1F0"
              ],
              "countryId": "SK",
              "callingPrefix": "421",
              "countryName": "Slowakia"
            },
            {
              "countryImage": [
                "1F1EA",
                "1F1F8"
              ],
              "countryId": "ES",
              "callingPrefix": "34",
              "countryName": "Spanyol"
            },
            {
              "countryImage": [
                "1F1F1",
                "1F1F0"
              ],
              "countryId": "LK",
              "callingPrefix": "94",
              "countryName": "Srilanka"
            },
            {
              "countryImage": [
                "1F1F8",
                "1F1F7"
              ],
              "countryId": "SR",
              "callingPrefix": "597",
              "countryName": "Suriname"
            },
            {
              "countryImage": [
                "1F1F8",
                "1F1EF"
              ],
              "countryId": "SJ",
              "callingPrefix": "47",
              "countryName": "Svalbard dan Jan Mayen"
            },
            {
              "countryImage": [
                "1F1F8",
                "1F1FF"
              ],
              "countryId": "SZ",
              "callingPrefix": "268",
              "countryName": "Swaziland"
            },
            {
              "countryImage": [
                "1F1F8",
                "1F1EA"
              ],
              "countryId": "SE",
              "callingPrefix": "46",
              "countryName": "Swedia"
            },
            {
              "countryImage": [
                "1F1E8",
                "1F1ED"
              ],
              "countryId": "CH",
              "callingPrefix": "41",
              "countryName": "Swiss"
            },
            {
              "countryImage": [
                "1F1F9",
                "1F1FC"
              ],
              "countryId": "TW",
              "callingPrefix": "886",
              "countryName": "Taiwan"
            },
            {
              "countryImage": [
                "1F1F9",
                "1F1EF"
              ],
              "countryId": "TJ",
              "callingPrefix": "992",
              "countryName": "Tajikistan"
            },
            {
              "countryImage": [
                "1F1E8",
                "1F1FB"
              ],
              "countryId": "CV",
              "callingPrefix": "238",
              "countryName": "Tanjung Verde"
            },
            {
              "countryImage": [
                "1F1F9",
                "1F1FF"
              ],
              "countryId": "TZ",
              "callingPrefix": "255",
              "countryName": "Tanzania"
            },
            {
              "countryImage": [
                "1F1EE",
                "1F1F4"
              ],
              "countryId": "IO",
              "callingPrefix": "246",
              "countryName": "Teritori Inggris di Samudra Hindia"
            },
            {
              "countryImage": [
                "1F1F9",
                "1F1ED"
              ],
              "countryId": "TH",
              "callingPrefix": "66",
              "countryName": "Thailand"
            },
            {
              "countryImage": [
                "1F1F9",
                "1F1F1"
              ],
              "countryId": "TL",
              "callingPrefix": "670",
              "countryName": "Timor-Leste"
            },
            {
              "countryImage": [
                "1F1F9",
                "1F1EC"
              ],
              "countryId": "TG",
              "callingPrefix": "228",
              "countryName": "Togo"
            },
            {
              "countryImage": [
                "1F1F9",
                "1F1F0"
              ],
              "countryId": "TK",
              "callingPrefix": "690",
              "countryName": "Tokelau"
            },
            {
              "countryImage": [
                "1F1F9",
                "1F1F4"
              ],
              "countryId": "TO",
              "callingPrefix": "676",
              "countryName": "Tonga"
            },
            {
              "countryImage": [
                "1F1F9",
                "1F1F9"
              ],
              "countryId": "TT",
              "callingPrefix": "1868",
              "countryName": "Trinidad dan Tobago"
            },
            {
              "countryImage": [
                "1F1F9",
                "1F1F3"
              ],
              "countryId": "TN",
              "callingPrefix": "216",
              "countryName": "Tunisia"
            },
            {
              "countryImage": [
                "1F1F9",
                "1F1F7"
              ],
              "countryId": "TR",
              "callingPrefix": "90",
              "countryName": "Turki"
            },
            {
              "countryImage": [
                "1F1F9",
                "1F1F2"
              ],
              "countryId": "TM",
              "callingPrefix": "993",
              "countryName": "Turkmenistan"
            },
            {
              "countryImage": [
                "1F1F9",
                "1F1FB"
              ],
              "countryId": "TV",
              "callingPrefix": "688",
              "countryName": "Tuvalu"
            },
            {
              "countryImage": [
                "1F1FA",
                "1F1EC"
              ],
              "countryId": "UG",
              "callingPrefix": "256",
              "countryName": "Uganda"
            },
            {
              "countryImage": [
                "1F1FA",
                "1F1E6"
              ],
              "countryId": "UA",
              "callingPrefix": "380",
              "countryName": "Ukraina"
            },
            {
              "countryImage": [
                "1F1E6",
                "1F1EA"
              ],
              "countryId": "AE",
              "callingPrefix": "971",
              "countryName": "Uni Emirat Arab"
            },
            {
              "countryImage": [
                "1F1FA",
                "1F1FE"
              ],
              "countryId": "UY",
              "callingPrefix": "598",
              "countryName": "Uruguay"
            },
            {
              "countryImage": [
                "1F1FA",
                "1F1FF"
              ],
              "countryId": "UZ",
              "callingPrefix": "998",
              "countryName": "Uzbekistan"
            },
            {
              "countryImage": [
                "1F1FB",
                "1F1FA"
              ],
              "countryId": "VU",
              "callingPrefix": "678",
              "countryName": "Vanuatu"
            },
            {
              "countryImage": [
                "1F1FB",
                "1F1EA"
              ],
              "countryId": "VE",
              "callingPrefix": "58",
              "countryName": "Venezuela"
            },
            {
              "countryImage": [
                "1F1FB",
                "1F1F3"
              ],
              "countryId": "VN",
              "callingPrefix": "84",
              "countryName": "Vietnam"
            },
            {
              "countryImage": [
                "1F1FC",
                "1F1EB"
              ],
              "countryId": "WF",
              "callingPrefix": "681",
              "countryName": "Wallis dan Futuna"
            },
            {
              "countryImage": [
                "1F1FE",
                "1F1EA"
              ],
              "countryId": "YE",
              "callingPrefix": "967",
              "countryName": "Yaman"
            },
            {
              "countryImage": [
                "1F1EF",
                "1F1F4"
              ],
              "countryId": "JO",
              "callingPrefix": "962",
              "countryName": "Yordania"
            },
            {
              "countryImage": [
                "1F1EC",
                "1F1F7"
              ],
              "countryId": "GR",
              "callingPrefix": "30",
              "countryName": "Yunani"
            },
            {
              "countryImage": [
                "1F1FF",
                "1F1F2"
              ],
              "countryId": "ZM",
              "callingPrefix": "260",
              "countryName": "Zambia"
            }
          ]
        }
      },
      "status": 200,
      "headers": {
        "content-type": "application/json; charset=utf-8",
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS",
        "access-control-allow-headers": "Content-Type, Origin, Accept, Authorization, Content-Length, X-Requested-With",
        "content-length": "718",
        "date": "Mon, 02 Mar 2026 08:49:53 GMT",
        "connection": "keep-alive",
        "keep-alive": "timeout=5"
      },
      "profile": {
        "domainLookup": 8,
        "connect": 1,
        "SSLconnection": 0,
        "Waiting": 18,
        "totalTime": 27,
        "socketReused": false,
        "protocol": "http/1.1"
      },
      "statusCode": 200,
      "header": {
        "content-type": "application/json; charset=utf-8",
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS",
        "access-control-allow-headers": "Content-Type, Origin, Accept, Authorization, Content-Length, X-Requested-With",
        "content-length": "718",
        "date": "Mon, 02 Mar 2026 08:49:53 GMT",
        "connection": "keep-alive",
        "keep-alive": "timeout=5"
      }
    });

  });
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
  // return request({
  //   url: "/lifestyle-javajazz/v1/order-tickets",
  //   method: "post",
  //   headers: {
  //     "Screen-Id": "javaJazzFestivalListInputDataVisitorScreen",
  //     ...headers
  //   },
  //   data
  // })
  return new Promise((resolve, reject) => {
    // Simulasi proses asinkron (seperti API call)
    if (data) {
      resolve({
        "data": {
          "dataProtected": {
            "subTotal": 6000,
            "expiredTimeWib": 1739159112,
            "orderId": "1207392",
            "grandTotal": 10000
          }
        },
        "status": 200,
        "statusCode": 200,
      });
    } else {
      reject(new Error("Data tidak ditemukan"));
    }
  });

}
export function getlov(queryParam, headers = {
  "Screen-Id": "javaJazzFestivalInputDataVisitorScreen"
}) {
  return new Promise((resolve, reject) => {
    resolve({
      "data": {
        "data": {
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
      },
      "status": 200,
      "headers": {
        "content-type": "application/json; charset=utf-8",
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS",
        "access-control-allow-headers": "Content-Type, Origin, Accept, Authorization, Content-Length, X-Requested-With",
        "content-length": "718",
        "date": "Mon, 02 Mar 2026 08:49:53 GMT",
        "connection": "keep-alive",
        "keep-alive": "timeout=5"
      },
      "profile": {
        "domainLookup": 8,
        "connect": 1,
        "SSLconnection": 0,
        "Waiting": 18,
        "totalTime": 27,
        "socketReused": false,
        "protocol": "http/1.1"
      },
      "statusCode": 200,
      "header": {
        "content-type": "application/json; charset=utf-8",
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS",
        "access-control-allow-headers": "Content-Type, Origin, Accept, Authorization, Content-Length, X-Requested-With",
        "content-length": "718",
        "date": "Mon, 02 Mar 2026 08:49:53 GMT",
        "connection": "keep-alive",
        "keep-alive": "timeout=5"
      }
    });
  })
}

export function transactionLimit(data, headers) {
  // return request({
  //   url: `/limit/v1/transaction-limit/remaining?featureCode=${data}`,
  //   headers: {
  //     ...headers,
  //     "Screen-Id": "javaJazzFestivalConfirmationScreen",
  //   },
  // })
  return new Promise((resolve, reject) => {
    // Simulasi proses asinkron (seperti API call)
    if (data) {
      resolve({
        "data": {
          "data": {
            "dailySegmentLimit": 99999999990000,
            "transactionPostloginNoPinLimit": 1000000,
            "dailyChannelLimit": 999999989999,
            "subfeatureLimit": {},
            "dailyFeatureLimit": 5000000000,
            "dailyPostloginLimit": 3000000,
            "dailyPreloginLimit": 2000000
          }
        },
        "status": 200,
        "statusCode": 200,
      });
    } else {
      reject(new Error("Data tidak ditemukan"));
    }
  });
}
export function getBillPayment(data, headers) {
  // return request({
  //   url: `/bill-payment/v1/biller/preparation`,
  //   method: "POST",
  //   data,
  //   headers: {
  //     ...headers,
  //     "Screen-Id": "javaJazzFestivalConfirmationScreen",
  //   },
  // })
  return new Promise((resolve, reject) => {
    // Simulasi proses asinkron (seperti API call)
    if (data) {
      resolve({
        "data": {
          "data": {
            "billerCode": "01",
            "billKey1Label": "Kode pembayaran",
            "billAmount": 10000,
            "completionTime": "2025-01-22 10:37:50.959+0700",
            "billerName": "JavaJazz",
            "isFromContact": false,
            "billTotalAmount": 10000,
            "billerAliasName": "Syamsul Bahri",
            "categoryData": {
              "isCrowned": false,
              "categoryName": "Event",
              "categoryId": "t6C2IzMd5lbGT8yEhPV64",
              "categoryIcon": "https://mav-apigw-ext-test2.bni.co.id:48202/asset/v1/image/VAaDn3IvzMQ0PlIEVSvgn.png",
              "crown": "Off",
              "categorySequence": 2,
              "isPopular": false
            },
            "packageData": {},
            "additionalBillerData": [],
            "paymentMethod": "ACCOUNT",
            "billKey1LabelEn": "Payment Code",
            "ubpCompanyCode": "0050000009",
            "paymentType": "3",
            "authType": "POSTLOGIN",
            "billKey1LabelId": "Kode pembayaran",
            "billerLogo": "https://mav-apigw-ext-test2.bni.co.id:48202/asset/v1/image/9LHn2SpHTUaEctOgbQVWQ.png"
          },
          "dataProtected": {
            "creditCard": {
              "cardNumber": ""
            },
            "billKey2": "0",
            "transactionId": "R388RKarsqD04oc42Vufi",
            "customerName": "SYAMSUL BAHRI",
            "billInfoList": [{
                "label": "NAMA",
                "value": "SYAMSUL BAHRI"
              },
              {
                "label": "NOMINAL",
                "value": "0"
              },
              {
                "label": "TOTAL",
                "value": "10000"
              }
            ],
            "billKey1": "1206960",
            "account": {
              "accountName": "SYAMSUL BAHRI",
              "productName": "TAPLUS",
              "accountNumber": "1000914700"
            },
            "referenceId": "202501221037505362"
          }
        },
        "status": 200,
        "statusCode": 200,
      });
    } else {
      reject(new Error("Data tidak ditemukan"));
    }
  });
}

export function getListTicket(params, headers) {
  console.log(params, "A:SDA");
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
  // return request({
  //   url: '/lifestyle/v1/inquiry-bill-payment',
  //   method: 'POST',
  //   data,
  //   headers: {
  //     ...headers
  //   },
  // })
  return new Promise((resolve, reject) => {
    // Simulasi proses asinkron (seperti API call)
    if (data) {
      resolve({
        "data": {
          "dataProtected": {
            "companyCode": "0050000009",
            "currencyCode": "IDR",
            "billInfoList": [{
                "label": "NAME",
                "value": "ANDREAS H PAKPAHAN"
              },
              {
                "label": "AMOUNT",
                "value": "10000"
              },
              {
                "label": "ADMIN FEES",
                "value": "0"
              },
              {
                "label": "PENALTY",
                "value": "0"
              },
              {
                "label": "TOTAL",
                "value": "10000"
              }
            ],
            "transactionDetails": [],
            "billItemList": [{
              "billCode": "01",
              "billAmount": 10000,
              "billCustomerChargeAmount": 0,
              "billName": "Lifestyle JFP - Java Jazz"
            }],
            "billKey3": "",
            "customerAccountNumber": "1001074305",
            "billKey2": "",
            "accountType": "SVGS",
            "billKey1": "1207175",
            "languageCode": "EN",
            "additionalBillerData": {
              "dataRaw": null,
              "productData": null,
              "masaAktif": "30 Days",
              "productName": "Combo Sakti Unlimited",
              "phoneNumber": "6282116857457"
            }
          }
        },
        "status": 200,
        "statusCode": 200,
      });
    } else {
      reject(new Error("Data tidak ditemukan"));
    }
  });
}

export function getJavaJazzPendingOrder() {
  return new Promise((resolve, reject) => {
    resolve({
      "data": "",
      "status": 204,
      "headers": {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS",
        "access-control-allow-headers": "Content-Type, Origin, Accept, Authorization, Content-Length, X-Requested-With",
        "date": "Mon, 02 Mar 2026 10:17:17 GMT",
        "connection": "keep-alive",
        "keep-alive": "timeout=5"
      },
      "profile": {
        "domainLookup": 9,
        "connect": 0,
        "SSLconnection": 0,
        "Waiting": 128,
        "totalTime": 140,
        "socketReused": false,
        "protocol": "http/1.1"
      },
      "statusCode": 204,
      "header": {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS",
        "access-control-allow-headers": "Content-Type, Origin, Accept, Authorization, Content-Length, X-Requested-With",
        "date": "Mon, 02 Mar 2026 10:17:17 GMT",
        "connection": "keep-alive",
        "keep-alive": "timeout=5"
      }
    })
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

export function getAllHotels() {
  return request({
    url: '/lifestyle/v1/all-hotels',
    headers: {
      'Screen-Id': 'lifestyleLandingPageScreen'
    }
  });
};

export function getAllCafes() {
  return request({
    url: '/lifestyle/v1/all-cafes',
    headers: {
      'Screen-Id': 'lifestyleLandingPageScreen'
    }
  });
};

export function getAllRestaurants() {
  return request({
    url: '/lifestyle/v1/all-restaurants',
    headers: {
      'Screen-Id': 'lifestyleLandingPageScreen'
    }
  });
};

export function createServiceOrder(data) {
  return request({
    url: '/api/orders',
    method: 'POST',
    data,
    headers: {
      'Screen-Id': 'lifestyleOrderScreen',
      'content-type': 'application/json'
    }
  });
};

export function getTransactionHistory(params) {
  return request({
    url: '/api/orders' + (params.customerPhone ? `?customerPhone=${params.customerPhone}` : ''),
    method: 'GET',
    headers: {
      'Screen-Id': 'lifestyleTransactionHistoryScreen'
    }
  });
};
