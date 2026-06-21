import { describe, it, expect } from 'vitest';
import { GreetingUtils } from './greetingUtils';

// Build a local Date at a specific hour (getHours() is local-time based).
const atHour = (hour: number) => new Date(2024, 0, 1, hour, 30, 0);

describe('GreetingUtils.getGreeting', () => {
  it('returns the morning greeting between 05:00 and 11:59', () => {
    expect(GreetingUtils.getGreeting(atHour(8))).toBe('صبح بخیر');
  });

  it('returns the noon greeting between 12:00 and 16:59', () => {
    expect(GreetingUtils.getGreeting(atHour(14))).toBe('ظهر بخیر');
  });

  it('returns the afternoon greeting between 17:00 and 19:59', () => {
    expect(GreetingUtils.getGreeting(atHour(18))).toBe('عصر بخیر');
  });

  it('returns the night greeting otherwise', () => {
    expect(GreetingUtils.getGreeting(atHour(23))).toBe('شب بخیر');
    expect(GreetingUtils.getGreeting(atHour(3))).toBe('شب بخیر');
  });
});

describe('GreetingUtils.getGreetingWithName', () => {
  it('appends the provided name', () => {
    expect(GreetingUtils.getGreetingWithName(atHour(8), 'امیر')).toBe('صبح بخیر امیر');
  });

  it('falls back to a default name', () => {
    expect(GreetingUtils.getGreetingWithName(atHour(8))).toBe('صبح بخیر کاربر');
  });
});

describe('GreetingUtils.getTimePeriod', () => {
  it('maps hours to period labels', () => {
    expect(GreetingUtils.getTimePeriod(atHour(8))).toBe('صبح');
    expect(GreetingUtils.getTimePeriod(atHour(14))).toBe('ظهر');
    expect(GreetingUtils.getTimePeriod(atHour(18))).toBe('عصر');
    expect(GreetingUtils.getTimePeriod(atHour(23))).toBe('شب');
  });
});
