export class GreetingUtils {
  /**
   * Get greeting based on time of day
   * @param serverTime - Server time in ISO string or Date object
   * @returns Appropriate greeting in Persian
   */
  static getGreeting(serverTime?: string | Date): string {
    const time = serverTime ? new Date(serverTime) : new Date();
    const hour = time.getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'صبح بخیر';
    } else if (hour >= 12 && hour < 17) {
      return 'ظهر بخیر';
    } else if (hour >= 17 && hour < 20) {
      return 'عصر بخیر';
    } else {
      return 'شب بخیر';
    }
  }

  /**
   * Get greeting with user name
   * @param serverTime - Server time in ISO string or Date object
   * @param userName - User's name
   * @returns Greeting with user name
   */
  static getGreetingWithName(serverTime?: string | Date, userName?: string): string {
    const greeting = this.getGreeting(serverTime);
    const name = userName || 'کاربر';
    return `${greeting} ${name}`;
  }

  /**
   * Get greeting with time information
   * @param serverTime - Server time in ISO string or Date object
   * @returns Greeting with time period
   */
  static getGreetingWithTime(serverTime?: string | Date): string {
    const time = serverTime ? new Date(serverTime) : new Date();
    const hour = time.getHours();
    const minute = time.getMinutes();
    
    const greeting = this.getGreeting(serverTime);
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    return `${greeting} - ساعت ${timeString}`;
  }

  /**
   * Get time period description
   * @param serverTime - Server time in ISO string or Date object
   * @returns Time period description in Persian
   */
  static getTimePeriod(serverTime?: string | Date): string {
    const time = serverTime ? new Date(serverTime) : new Date();
    const hour = time.getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'صبح';
    } else if (hour >= 12 && hour < 17) {
      return 'ظهر';
    } else if (hour >= 17 && hour < 20) {
      return 'عصر';
    } else {
      return 'شب';
    }
  }

  /**
   * Get full greeting with date and time
   * @param serverTime - Server time in ISO string or Date object
   * @param userName - User's name
   * @returns Full greeting with date and time
   */
  static getFullGreeting(serverTime?: string | Date, userName?: string): string {
    const time = serverTime ? new Date(serverTime) : new Date();
    const greeting = this.getGreeting(serverTime);
    const name = userName || 'کاربر';
    
    // Format date in Persian
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    const persianDate = time.toLocaleDateString('fa-IR', dateOptions);
    const timeString = time.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `${greeting} ${name} - ${persianDate} - ساعت ${timeString}`;
  }
} 