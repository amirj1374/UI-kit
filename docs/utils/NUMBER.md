# Number Utilities

Utilities for number formatting and manipulation.

## Functions

### `formatNumber(value: number | string, decimals?: number): string`

Formats a number with thousand separators and decimal places.

**Parameters:**
- `value` - Number or string to format
- `decimals` - Number of decimal places (default: 0)

**Returns:** Formatted number string

**Example:**
```typescript
import { formatNumber } from '@amirjalili1374/ui-kit'

formatNumber(1234567.89, 2)
// Returns: "1,234,567.89"

formatNumber(1234567)
// Returns: "1,234,567"
```

### `parseNumber(value: string): number`

Parses a formatted number string back to a number.

**Parameters:**
- `value` - Formatted number string

**Returns:** Number

**Example:**
```typescript
import { parseNumber } from '@amirjalili1374/ui-kit'

parseNumber("1,234,567.89")
// Returns: 1234567.89
```

### `formatCurrency(value: number | string, currency?: string): string`

Formats a number as currency.

**Parameters:**
- `value` - Number or string to format
- `currency` - Currency symbol (default: `'$'`)

**Returns:** Formatted currency string

**Example:**
```typescript
import { formatCurrency } from '@amirjalili1374/ui-kit'

formatCurrency(1234567.89, 'ریال')
// Returns: "1,234,567.89 ریال"
```

