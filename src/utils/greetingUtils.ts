import type { UserInfoResponse } from '@/types/models/userInfo';

type TimePeriod = 'morning' | 'noon' | 'afternoon' | 'evening';

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

const PERIOD_TEXT: Record<TimePeriod, { greeting: string; label: string }> = {
  morning: { greeting: 'صبح بخیر', label: 'صبح' },
  noon: { greeting: 'ظهر بخیر', label: 'ظهر' },
  afternoon: { greeting: 'عصر بخیر', label: 'عصر' },
  evening: { greeting: 'شب بخیر', label: 'شب' }
};

function toDate(value?: string | Date): Date {
  return value ? new Date(value) : new Date();
}

function getPeriod(hour: number): TimePeriod {
  return TIME_PERIODS.find(({ minHour, maxHour }) => hour >= minHour && hour < maxHour)?.period ?? 'evening';
}

export class GreetingUtils {
  static getGreeting(serverTime?: string | Date): string {
    const hour = toDate(serverTime).getHours();
    return PERIOD_TEXT[getPeriod(hour)].greeting;
  }

  static getTimePeriod(serverTime?: string | Date): string {
    const hour = toDate(serverTime).getHours();
    return PERIOD_TEXT[getPeriod(hour)].label;
  }

  static getGreetingWithName(serverTime?: string | Date, userName?: string): string {
    return `${GreetingUtils.getGreeting(serverTime)} ${userName ?? 'کاربر'}`;
  }

  static getGreetingWithTime(serverTime?: string | Date): string {
    const date = toDate(serverTime);
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${GreetingUtils.getGreeting(serverTime)} - ساعت ${hh}:${mm}`;
  }

  static getFullGreeting(serverTime?: string | Date, userName?: string): string {
    const date = toDate(serverTime);
    const persianDate = date.toLocaleDateString('fa-IR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const persianTime = date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    return `${GreetingUtils.getGreeting(serverTime)} ${userName ?? 'کاربر'} - ${persianDate} - ساعت ${persianTime}`;
  }

  /** Convenience: build greeting from a full UserInfoResponse. */
  static fromUserInfo(userInfo: Pick<UserInfoResponse, 'authTime' | 'fullName'>): string {
    return GreetingUtils.getGreetingWithName(userInfo.authTime, userInfo.fullName);
  }
}
