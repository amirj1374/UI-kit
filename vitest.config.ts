import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// Dedicated Vitest config (kept separate from vite.config.ts to avoid the
// library/app branching logic that depends on BUILD_LIB).
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{ts,js}', 'tests/**/*.{test,spec}.{ts,js}'],
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/utils/**/*.ts',
        'src/composables/**/*.ts',
        'src/directives/**/*.ts',
        'src/validators/**/*.ts',
        'src/components/Loading.vue',
        'src/components/common/AppStepper.vue',
        'src/components/layout/AppHeader.vue',
        'src/components/shared/{BaseIcon,ConfirmDialog,ShamsiDatePicker,ToggleSwitch}.vue',
        'src/components/shared/data-table-v2/headerFieldUtils.ts',
        'src/components/shared/data-table-v2/computeActionColumnWidth.ts'
      ],
      exclude: ['src/**/*.d.ts', 'src/**/*.{test,spec}.ts']
    }
  }
});
