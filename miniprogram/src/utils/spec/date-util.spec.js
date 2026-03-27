import {expect, it} from 'vitest'
import dayjs from 'dayjs';
import {dateFormat, dateFormatTimeStamp, formatDateTreeDays} from '../date-util'

describe('Date Utilities', () => {
  describe('dateFormat', () => {
    it('should format the date correctly in default locale', () => {
      const formattedDate = dateFormat('2023-10-20', 'DD MMMM YYYY');
      expect(formattedDate).toBe('20 Oktober 2023');
    });

    it('should format the date correctly in custom locale', () => {
      const formattedDate = dateFormat('2023-10-20', 'DD MMMM YYYY', 'en');
      expect(formattedDate).toBe('20 October 2023');
    });
  });

  describe('dateFormatTimeStamp', () => {

    it('should handle invalid date input', () => {
      const timestamp = dateFormatTimeStamp('invalid-date', 'shortDate');
      expect(timestamp).toBe('Invalid Date');
    });
  });

  describe('formatDateTreeDays', () => {
    it('should replace English days and months with Indonesian', () => {
      const dateString = 'Mon, January 1 2023';
      const formattedDate = formatDateTreeDays(dateString);
      expect(formattedDate).toBe('Sen, Januari 1 2023');
    });

    it('should replace all days and months correctly', () => {
      const dateString = 'Fri, February 2 2023';
      const formattedDate = formatDateTreeDays(dateString);
      expect(formattedDate).toBe('Jum, Februari 2 2023');
    });
  });
});



describe('dateFormatTimeStamp', () => {
    it('should format string datetime correctly in local time', () => {
        const datetimeValue = '2023-02-21 14:30';
        const format = 'YYYY-MM-DD HH:mm';
        const locale = 'id';
        
        const result = dateFormatTimeStamp(datetimeValue, format, locale);
        expect(result).toBe(dayjs(datetimeValue.replace(' ', 'T')).local().locale(locale).format(format));
    });

    it('should format string datetime correctly in server time', () => {
        const datetimeValue = '2023-02-21 14:30';
        const format = 'YYYY-MM-DD HH:mm';
        const locale = 'id';
        const server = true;

        const result = dateFormatTimeStamp(datetimeValue, format, locale, server);
        expect(result).toBe(dayjs(datetimeValue.replace(' ', 'T')).locale(locale).format(format));
    });

    it('should format Date object correctly', () => {
        const datetimeValue = new Date('2023-02-21T14:30:00Z');
        const format = 'YYYY-MM-DD HH:mm';
        const locale = 'id';

        const result = dateFormatTimeStamp(datetimeValue, format, locale);
        expect(result).toBe(dayjs(datetimeValue).local().locale(locale).format(format));
    });

    it('should handle invalid datetime inputs gracefully', () => {
        const datetimeValue = 'invalid-date';
        const format = 'YYYY-MM-DD HH:mm';
        const locale = 'id';

        const result = dateFormatTimeStamp(datetimeValue, format, locale);
        expect(result).toBe('Invalid Date'); // dayjs should return 'Invalid Date'
    });
});