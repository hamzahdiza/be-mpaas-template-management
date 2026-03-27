import dayjs from "dayjs";
import "dayjs/locale/id";
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import advanced from "dayjs/plugin/advancedFormat"

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advanced)

/**
 * Convert the target time to a specified format string
 * @param {string | number | Date} date  time
 * @param {string} format Formatted Template
 * @param {string} locale default id
 */
export function dateFormat(date, format, locale = "id") {
	return dayjs(date).locale(locale).format(format);
}


/**
 * Convert the target time to a specified format string.
 *
 * Predefined format options:
 * - `raw`: returns the date in "YYYY-MM-DD HH:mm:ss.SSSZ" format.
 * - `datetime`: returns date and time in "dd MM yyyy HH:mm:ss + 'WIB'" format.
 * - `shortDate`: returns date in "dd MMM yyyy" format.
 * - `longDate`: returns date in "dd MMMM yyyy" format.
 * - `monthYear`: returns the month and year in "MMMM yyyy" format.
 * - `time` (with server time): returns time in "HH:mm:ss + 'WIB'" format.
 * - `time` (with local time): returns time in "HH:mm:ss" format.
 * - `hourMinute` (with server time): returns time in "HH:mm + 'WIB'" format.
 * - `hourMinute` (with local time): returns time in "HH:mm" format.
 * - `custom format`: applies any user-defined format string passed in the `format` parameter.
 *
 * @param {string | number | Date} datetimeValue - The target date or time to be formatted.
 * @param {string} format - The format template or one of the predefined options.
 * @param {string} [locale="id"] - The locale used for formatting (default is "id" for Indonesian locale).
 * @param {boolean} [server=false] - Determines whether the formatting uses server time (no timezone conversion) or local time (converts to device's local timezone).
 * 
 * @returns {string} - The formatted date or time string.
 */
export function dateFormatTimeStamp(datetimeValue, format, locale = "id", server = false) {
  let date

  // Adjust date based on whether it's server time or local device time
  if (typeof datetimeValue === "string") {
    datetimeValue = datetimeValue
      .replace(" ", "T") // Replace space with 'T'
      .replace(/([+-]\d{2})(\d{2})$/, '$1:$2'); // +0700 -> +07:00
    date = dayjs(datetimeValue);
  } else {
    date = dayjs(datetimeValue);
  }

  if (!server) {
    date = date.local();
  }

  return date.locale(locale).format(format);
}



export function formatDateTreeDays(date) {
  return date
    .replace(/Sat/g, 'Sab')
    .replace(/Sun/g, 'Min')
    .replace(/Mon/g, 'Sen')
    .replace(/Tue/g, 'Sel')
    .replace(/Wed/g, 'Rab')
    .replace(/Thu/g, 'Kam')
    .replace(/Fri/g, 'Jum')

    .replace(/January/g, 'Januari')
    .replace(/February/g, 'Februari')
    .replace(/March/g, 'Maret')
    .replace(/April/g, 'April')
    .replace(/May/g, 'Mei')
    .replace(/June/g, 'Juni')
    .replace(/July/g, 'Juli')
    .replace(/August/g, 'Agustus')
    .replace(/September/g, 'September')
    .replace(/October/g, 'Oktober')
    .replace(/November/g, 'November')
    .replace(/December/g, 'Desember')

}