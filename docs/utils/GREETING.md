# Greeting Utilities

Utilities for generating time-based greetings in Persian.

## GreetingUtils Class

A utility class for generating contextual greetings based on time of day.

### Methods

### `getGreeting(serverTime?: string | Date): string`

Gets a greeting based on the time of day.

**Parameters:**
- `serverTime` - Optional server time (ISO string or Date object). If not provided, uses current time.

**Returns:** Greeting string in Persian:
- `'صبح بخیر'` (Good morning) - 5:00 to 11:59
- `'ظهر بخیر'` (Good afternoon) - 12:00 to 16:59
- `'عصر بخیر'` (Good evening) - 17:00 to 19:59
- `'شب بخیر'` (Good night) - 20:00 to 4:59

**Example:**
```typescript
import { GreetingUtils } from '@amirjalili1374/ui-kit'

const greeting = GreetingUtils.getGreeting()
// Returns: "صبح بخیر" (depending on current time)

const greetingWithTime = GreetingUtils.getGreeting(new Date('2024-01-15T14:30:00'))
// Returns: "ظهر بخیر"
```

### `getGreetingWithName(serverTime?: string | Date, userName?: string): string`

Gets a greeting with the user's name.

**Parameters:**
- `serverTime` - Optional server time
- `userName` - Optional user name (defaults to `'کاربر'`)

**Returns:** Greeting with name

**Example:**
```typescript
import { GreetingUtils } from '@amirjalili1374/ui-kit'

const greeting = GreetingUtils.getGreetingWithName(undefined, 'علی')
// Returns: "صبح بخیر علی"

const greetingDefault = GreetingUtils.getGreetingWithName()
// Returns: "صبح بخیر کاربر"
```

### `getGreetingWithTime(serverTime?: string | Date): string`

Gets a greeting with time information.

**Parameters:**
- `serverTime` - Optional server time

**Returns:** Greeting with time string

**Example:**
```typescript
import { GreetingUtils } from '@amirjalili1374/ui-kit'

const greeting = GreetingUtils.getGreetingWithTime()
// Returns: "صبح بخیر - ساعت 09:30"
```

### `getTimePeriod(serverTime?: string | Date): string`

Gets the time period description.

**Parameters:**
- `serverTime` - Optional server time

**Returns:** Time period in Persian:
- `'صبح'` (Morning) - 5:00 to 11:59
- `'ظهر'` (Noon) - 12:00 to 16:59
- `'عصر'` (Evening) - 17:00 to 19:59
- `'شب'` (Night) - 20:00 to 4:59

**Example:**
```typescript
import { GreetingUtils } from '@amirjalili1374/ui-kit'

const period = GreetingUtils.getTimePeriod()
// Returns: "صبح" (depending on current time)
```

### `getFullGreeting(serverTime?: string | Date, userName?: string): string`

Gets a full greeting with date, time, and user name.

**Parameters:**
- `serverTime` - Optional server time
- `userName` - Optional user name

**Returns:** Full greeting with date and time in Persian format

**Example:**
```typescript
import { GreetingUtils } from '@amirjalili1374/ui-kit'

const fullGreeting = GreetingUtils.getFullGreeting(undefined, 'علی')
// Returns: "صبح بخیر علی - یکشنبه، ۱۵ دی ۱۴۰۲ - ساعت ۰۹:۳۰"
```

## Usage in Components

```vue
<script setup lang="ts">
import { GreetingUtils } from '@amirjalili1374/ui-kit'
import { computed } from 'vue'

const greeting = computed(() => {
  return GreetingUtils.getGreetingWithName(undefined, 'علی')
})
</script>

<template>
  <div>
    <h1>{{ greeting }}</h1>
  </div>
</template>
```

