# Validation Utilities

Utilities for form validation and data validation.

## NationalCodeValidator

Validates Iranian national code (کد ملی).

### Functions

### `validateNationalCode(code: string): boolean`

Validates an Iranian national code.

**Parameters:**
- `code` - National code string (10 digits)

**Returns:** `true` if valid, `false` otherwise

**Example:**
```typescript
import { validateNationalCode } from '@amirjalili1374/ui-kit'

const isValid = validateNationalCode('1234567890')
// Returns: true or false
```

### `nationalCodeRule`

Vee-Validate rule for national code validation.

**Usage:**
```typescript
import { nationalCodeRule } from '@amirjalili1374/ui-kit'
import { useForm } from 'vee-validate'

const { defineField } = useForm({
  validationSchema: {
    nationalCode: nationalCodeRule
  }
})
```

