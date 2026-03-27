import {
  bigTruncRetain,
  supplementFloatPartZero
} from "./number-util";

const currencySymbol = {
  "USD": {
    symbol: "USD ",
    floatSeparator: ".",
    quantileSeparator: ","
  },
  "IDR": {
    symbol: "Rp",
    floatSeparator: ",",
    quantileSeparator: "."
  },
};

const abbreviationMap = {
  6: "millionAbbreviation",
  9: "billionAbbreviation",
  12: "trillionAbbreviation",
}

function currencyDefaultFormat(localInfo, value, places, retainCall, supplementCall) {
  const {
    floatSeparator,
    quantileSeparator
  } = localInfo;
  const positive = value.slice(value.startsWith("-"), value.length);
  // Preserve decimals on data
  const [intPart, floatPart] = retainCall(positive, places).toString().split(".");
  const currency = Object.defineProperty({
      negativeNumber: Number(value) < 0,
      value: positive,
      intPart: intPart.replace(/\B(?=(\d{3})+(?!\d))/g, quantileSeparator),
      floatSeparator,
    },
    "floatPart", {
      set(newFloatPart) {
        if (newFloatPart && /^\d+$/.test(newFloatPart)) {
          this.formatValue = this.intPart + this.floatSeparator + newFloatPart;
        } else {
          this.formatValue = this.intPart;
        }
      },
      get() {
        return this.formatValue.split(this.floatSeparator)[1] || "";
      },
    }
  );
  currency.floatPart = !/^0+$/.test(floatPart) && floatPart;

  if (supplementCall && supplementCall(currency.floatPart, places)) {
    currency.floatPart = currency.floatPart.padEnd(places, "0");
  }
  return currency;
}

/**
 * Generate monetary numerical form objects for target values
 * @param {value:String | Number,  currency: Stirng,isAbbr:Boolean, isPrefix:Boolean, places:Number}
 * @return currency string
 */
export function currencyFormat({
  value, // [required] Origin value
  currency = 'IDR', // [option] Currency type
  isAbbr = false, // [option] Need abbreviations
  isPrefix = true, // [option] Need prefix
  showNegativeSymbol = false, // [option] Force display of positive and negative signs
  places // [option] Default maximum number of decimal places to be retained
}) {
  const localInfo = currencySymbol[currency];
  if (!places && places !== 0) {
      if (currency === 'IDR') {
          places = 0
      } else {
          places = 2
      }
  }

  const currencyInfo = currencyDefaultFormat(
    localInfo,
    String(value),
    places,
    bigTruncRetain,
    supplementFloatPartZero
  );
  let result = currencyInfo.formatValue

  // EXTENDS - Abbreviation Settings
  if (isAbbr && currencyInfo.value >= 1000000) {
    const maps = Object.entries(abbreviationMap);
    for (const [multiple, abbSymbol] of maps) {
      let temp = currencyInfo.value / 10 ** parseInt(multiple);
      if (temp < 1000 || multiple === maps.slice(-1)[0][0]) {
        const currencyTemp = currencyDefaultFormat(localInfo, String(temp), 2, bigTruncRetain, supplementFloatPartZero)
        result = currencyTemp.formatValue + ' ' + getApp().globalData.languagePack[abbSymbol]
        break;
      }
    }
  }

  // EXTENDS - required prefix
  if (isPrefix) {
    result = localInfo.symbol + result
  }

  // EXTENDS - required sign
  if (showNegativeSymbol && bigTruncRetain(String(value).replace(/[-+]/g, ''), currency === "IDR" ? 0 : 2) !== "0") {
    result = (currencyInfo.negativeNumber ? '-' : '+') + result
  }
  return result
}
/**
 * Format the unit
 * @param {*} value
 * @return formatValue
 */
export function unitFormat(value) {
  const localInfo = currencySymbol[getApp().globalData.nativeData.language === 'id-ID' ? "IDR" : "USD"];
  const currency = currencyDefaultFormat(
    localInfo,
    String(value),
    4,
    bigTruncRetain
  );
  return currency.formatValue;
}
/**
 * Format the percentage
 * @param {ALL} value format value
 * @param {Boolean} symbol return symbol
 * @param {Boolean} space return space
 */
export function percentageFormat(value, symbol = false, space = false) {
  if (value == undefined) {
    return "undefined"
  }
  const localInfo = currencySymbol[getApp().globalData.nativeData.language === 'id-ID' ? "IDR" : "USD"];
  const currency = currencyDefaultFormat(
    localInfo,
    String(value),
    2,
    bigTruncRetain,
    supplementFloatPartZero
  );
  if (currency.formatValue == 0) {
    return '0%'
  }
  if (space && symbol) {
    return !currency.negativeNumber ? '+ ' + currency.formatValue + '%' : '- ' + currency.formatValue + '%'
  }
  if (symbol) {
    return !currency.negativeNumber ? '+' + currency.formatValue + '%' : '-' + currency.formatValue + '%'
  }
  return currency.formatValue + '%';
}

export function findLongestSubstringWithNumericEdges(s,currency) {
  let maxLength = 0;
  let longestSubstring = "";
  for (let i = 0; i < s.length; i++) {
      if (!isNaN(s[i])) {
          for (let j = s.length - 1; j >= i; j--) {
              if (!isNaN(s[j])) {
                  const currentSubstring = s.slice(i, j + 1);
                  if (currentSubstring.length > maxLength) {
                      maxLength = currentSubstring.length;
                      longestSubstring = currentSubstring;
                  }
                  break;
              }
          }
      }
  }
  let cleanedStr = longestSubstring.replace(currency === 'IDR' ? /[^0-9,]/g : /[^0-9.]/g, '')
  let firstCommaPosition = cleanedStr.indexOf(currency === 'IDR'?',' : '.');
  if (firstCommaPosition === -1) {
      return cleanedStr.slice(0, 12);
  } else {
      let substring = cleanedStr.substring(0, firstCommaPosition);
      return substring.slice(0, 12);
  }
}