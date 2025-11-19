# Date Utilities

Utilities for date conversion and manipulation, especially for Persian (Jalali) dates.

## Functions

### `toJalali(date: Date | string): string`

Converts a Gregorian date to Jalali (Persian) date string.

**Parameters:**
- `date` - Date object or date string

**Returns:** Jalali date string in format `YYYY/MM/DD`

**Example:**
```typescript
import { toJalali } from '@amirjalili1374/ui-kit'

const jalaliDate = toJalali(new Date('2024-01-15'))
// Returns: "1402/10/25"
```

### `toGregorian(jalaliDate: string): Date`

Converts a Jalali date string to Gregorian Date object.

**Parameters:**
- `jalaliDate` - Jalali date string in format `YYYY/MM/DD`

**Returns:** Date object

**Example:**
```typescript
import { toGregorian } from '@amirjalili1374/ui-kit'

const gregorianDate = toGregorian('1402/10/25')
// Returns: Date object for 2024-01-15
```

### `formatDate(date: Date | string, format?: string): string`

Formats a date according to the specified format.

**Parameters:**
- `date` - Date object or date string
- `format` - Optional format string (default: `'YYYY/MM/DD'`)

**Returns:** Formatted date string

**Example:**
```typescript
import { formatDate } from '@amirjalili1374/ui-kit'

const formatted = formatDate(new Date(), 'YYYY-MM-DD')
```

### `getCurrentJalaliDate(): string`

Gets the current date in Jalali format.

**Returns:** Current Jalali date string

**Example:**
```typescript
import { getCurrentJalaliDate } from '@amirjalili1374/ui-kit'

const today = getCurrentJalaliDate()
// Returns: "1402/10/25" (current date)
```

