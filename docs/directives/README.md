# Directives

Custom Vue directives provided by the UI Kit.

## v-digit-limit

Limits the number of digits that can be entered in an input field.

### Usage

```vue
<template>
  <v-text-field
    v-model="value"
    v-digit-limit="10"
    label="Enter number (max 10 digits)"
  />
</template>
```

### Parameters

- `limit` - Maximum number of digits allowed (number)

### Example

```vue
<script setup lang="ts">
import { DigitLimit } from '@amirjalili1374/ui-kit'
import { ref } from 'vue'

const phoneNumber = ref('')
</script>

<template>
  <v-text-field
    v-model="phoneNumber"
    v-digit-limit="11"
    label="Phone Number"
    hint="Maximum 11 digits"
  />
</template>
```

## Global Registration

When using the UI Kit plugin, the `v-digit-limit` directive is automatically registered:

```typescript
import UiKit from '@amirjalili1374/ui-kit'

app.use(UiKit) // Registers v-digit-limit globally
```

## Manual Registration

If you prefer to register manually:

```typescript
import { DigitLimit } from '@amirjalili1374/ui-kit'

app.directive('digit-limit', DigitLimit)
```

