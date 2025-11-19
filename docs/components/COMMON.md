# Common Components

Common utility components used across the application.

## AppStepper

A step-by-step wizard/stepper component for multi-step forms or processes.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `Step[]` | `[]` | Array of step definitions |
| `currentStep` | `number` | `0` | Current active step index |
| `vertical` | `boolean` | `false` | Display steps vertically |

### Usage

```vue
<script setup lang="ts">
import { AppStepper } from '@amirjalili1374/ui-kit'
import { ref } from 'vue'

const currentStep = ref(0)
const steps = [
  { title: 'Step 1', description: 'First step' },
  { title: 'Step 2', description: 'Second step' },
  { title: 'Step 3', description: 'Third step' }
]
</script>

<template>
  <AppStepper
    :steps="steps"
    :currentStep="currentStep"
    :vertical="false"
  />
</template>
```

## Loading

A loading spinner/indicator component.

### Usage

```vue
<script setup lang="ts">
import { Loading } from '@amirjalili1374/ui-kit'
import { ref } from 'vue'

const isLoading = ref(false)
</script>

<template>
  <Loading v-if="isLoading" />
</template>
```

