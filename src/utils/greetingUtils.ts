type TimePeriod = 'morning' | 'noon' | 'afternoon' | 'evening';
type GreetingLocale = 'fa' | 'en';

export interface GreetingUserInfo {
  authTime?: string | Date;
  fullName?: string;
}

interface PeriodEntry {
  readonly period: TimePeriod;
  readonly minHour: number;
  readonly maxHour: number;
}

const TIME_PERIODS: readonly PeriodEntry[] = [
  { period: 'morning', minHour: 5, maxHour: 12 },
  { period: 'noon', minHour: 12, maxHour: 17 },
  { period: 'afternoon', minHour: 17, maxHour: 20 },
  { period: 'evening', minHour: 20, maxHour: 29 }
] as const;

const PERIOD_TEXT: Record<GreetingLocale, Record<TimePeriod, { greeting: string; label: string }>> = {
  fa: {
    morning: { greeting: 'صبح بخیر', label: 'صبح' }, noon: { greeting: 'ظهر بخیر', label: 'ظهر' },
    afternoon: { greeting: 'عصر بخیر', label: 'عصر' }, evening: { greeting: 'شب بخیر', label: 'شب' }
  },
  en: {
    morning: { greeting: 'Good morning', label: 'Morning' }, noon: { greeting: 'Good afternoon', label: 'Noon' },
    afternoon: { greeting: 'Good evening', label: 'Afternoon' }, evening: { greeting: 'Good evening', label: 'Evening' }
  }
};

function resolveLocale(locale?: GreetingLocale): GreetingLocale {
  if (locale) return locale;
  return typeof document !== 'undefined' && document.documentElement.lang.startsWith('en') ? 'en' : 'fa';
}

function toDate(value?: string | Date): Date {
  return value ? new Date(value) : new Date();
}

function getPeriod(hour: number): TimePeriod {
  return TIME_PERIODS.find(({ minHour, maxHour }) => hour >= minHour && hour < maxHour)?.period ?? 'evening';
}

export class GreetingUtils {
  static getGreeting(serverTime?: string | Date, locale?: GreetingLocale): string {
    const hour = toDate(serverTime).getHours();
    return PERIOD_TEXT[resolveLocale(locale)][getPeriod(hour)].greeting;
  }

  static getTimePeriod(serverTime?: string | Date, locale?: GreetingLocale): string {
    const hour = toDate(serverTime).getHours();
    return PERIOD_TEXT[resolveLocale(locale)][getPeriod(hour)].label;
  }

  static getGreetingWithName(serverTime?: string | Date, userName?: string, locale?: GreetingLocale): string {
    return `${GreetingUtils.getGreeting(serverTime, locale)} ${userName ?? (resolveLocale(locale) === 'en' ? 'User' : 'کاربر')}`;
  }

  static getGreetingWithTime(serverTime?: string | Date, locale?: GreetingLocale): string {
    const date = toDate(serverTime);
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return resolveLocale(locale) === 'en'
      ? `${GreetingUtils.getGreeting(serverTime, locale)} - ${hh}:${mm}`
      : `${GreetingUtils.getGreeting(serverTime, locale)} - ساعت ${hh}:${mm}`;
  }

  static getFullGreeting(serverTime?: string | Date, userName?: string, locale?: GreetingLocale): string {
    const date = toDate(serverTime);
    const resolved = resolveLocale(locale);
    const formattedDate = date.toLocaleDateString(resolved === 'en' ? 'en-US' : 'fa-IR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString(resolved === 'en' ? 'en-US' : 'fa-IR', { hour: '2-digit', minute: '2-digit' });
    const name = userName ?? (resolved === 'en' ? 'User' : 'کاربر');
    return resolved === 'en'
      ? `${GreetingUtils.getGreeting(serverTime, resolved)} ${name} - ${formattedDate} - ${formattedTime}`
      : `${GreetingUtils.getGreeting(serverTime, resolved)} ${name} - ${formattedDate} - ساعت ${formattedTime}`;
  }

  /** Convenience: build greeting from a full UserInfoResponse. */
  static fromUserInfo(userInfo: GreetingUserInfo, locale?: GreetingLocale): string {
    return GreetingUtils.getGreetingWithName(userInfo.authTime, userInfo.fullName, locale);
  }
}
