// utils/dateConverter.ts
import * as jalaali from 'jalaali-js';

export class DateConverter {
  // Convert Gregorian to Shamsi
  static toShamsi(dateStr: string | null | undefined): string {
    // Handle null, undefined, or empty string
    if (!dateStr || dateStr === '') {
      return '';
    }

    try {
      const date = new Date(dateStr);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return '';
      }

      const { gy, gm, gd } = {
        gy: date.getFullYear(),
        gm: date.getMonth() + 1, // JS months are 0-based
        gd: date.getDate(),
      };

      const { jy, jm, jd } = jalaali.toJalaali(gy, gm, gd);
      return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
    } catch (error) {
      console.error('Error converting date to Shamsi:', error, dateStr);
      return '';
    }
  }

  // Convert Shamsi to Gregorian
  static toGregorian(jalaliStr: string): string {
    const [jy, jm, jd] = jalaliStr.split('/').map(Number);
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
    return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
  }
}
