import { IconAlertCircle, IconBell, IconChevronDown, IconMenu2, IconPalette, IconRefresh, IconSettings } from '@tabler/icons-vue';
import { ModernTheme } from '../theme/lightThemes/ModernTheme';
import { DarkModernTheme } from '../theme/darkThemes/DarkModernTheme';
import type { UiMessages, UiSemanticIcons, UiThemeRegistry } from './types';

export const defaultMessages: Record<'fa-IR' | 'en-US', UiMessages> = {
  'en-US': { loading: 'Please wait', emptyTitle: 'No results', emptyDescription: 'There is nothing to display.', errorTitle: 'Something went wrong', errorDescription: 'Please try again.', retry: 'Try again', permissionDeniedTitle: 'Access denied', permissionDeniedDescription: 'You do not have permission to view this content.', confirm: 'Confirm', cancel: 'Cancel', navigationMenu: 'Open navigation menu', compactSidebar: 'Toggle compact sidebar', themeCustomizer: 'Open theme customizer', notifications: 'Open notifications', profileSettings: 'Open profile settings' },
  'fa-IR': { loading: 'لطفا منتظر بمانید', emptyTitle: 'نتیجه‌ای یافت نشد', emptyDescription: 'موردی برای نمایش وجود ندارد.', errorTitle: 'خطایی رخ داد', errorDescription: 'لطفا دوباره تلاش کنید.', retry: 'تلاش مجدد', permissionDeniedTitle: 'دسترسی غیرمجاز', permissionDeniedDescription: 'شما اجازه مشاهده این محتوا را ندارید.', confirm: 'تایید', cancel: 'انصراف', navigationMenu: 'باز کردن منوی ناوبری', compactSidebar: 'تغییر حالت فشرده نوار کناری', themeCustomizer: 'باز کردن تنظیمات پوسته', notifications: 'باز کردن اعلان‌ها', profileSettings: 'باز کردن تنظیمات پروفایل' }
};

export const defaultIcons: UiSemanticIcons = { loading: IconRefresh, empty: IconAlertCircle, error: IconAlertCircle, permissionDenied: IconAlertCircle, retry: IconRefresh, menu: IconMenu2, theme: IconPalette, notifications: IconBell, profile: IconSettings, chevronDown: IconChevronDown };
export const defaultThemes: UiThemeRegistry = { modern: ModernTheme, 'modern-dark': DarkModernTheme };
