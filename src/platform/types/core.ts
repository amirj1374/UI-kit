import type { UiDirection, UiLocale } from './locale';
import type { UiMessageCatalog } from './messages';
import type { UiSemanticIcons } from './icons';
import type { UiPermissionEvaluator, UiPermissionOptions } from './permissions';
import type { UiThemeOptions } from './themes';
export interface UiKitOptions { locale: UiLocale; direction: UiDirection; theme: UiThemeOptions; messages: UiMessageCatalog; icons: Partial<UiSemanticIcons>; permissions: UiPermissionOptions }
export type UiKitConfig = Partial<Omit<UiKitOptions, 'theme' | 'messages' | 'icons' | 'permissions'>> & { theme?: UiThemeOptions; messages?: UiMessageCatalog; icons?: Partial<UiSemanticIcons>; permissions?: UiPermissionOptions | UiPermissionEvaluator };
