import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import vuetify from 'vite-plugin-vuetify';

// Dedicated Vitest config (kept separate from vite.config.ts to avoid the
// library/app branching logic that depends on BUILD_LIB).
export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    // The Vuetify-heavy DataTable integration matrix can exceed Vitest's
    // 5-second default when all workers run with V8 coverage instrumentation.
    testTimeout: 30000,
    environment: 'happy-dom',
    server: { deps: { inline: ['vuetify'] } },
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
        'src/components/shared/data-table-v2/CustomDataTableV2.vue',
        'src/components/shared/data-table-v2/components/DataTableFilterFields.vue',
        'src/components/shared/data-table-v2/headerFieldUtils.ts',
        'src/components/shared/data-table-v2/computeActionColumnWidth.ts',
        'src/platform/**/*.ts',
        'src/components/state/*.vue',
        'src/components/permissions/*.vue'
      ],
      exclude: ['src/**/*.d.ts', 'src/**/*.{test,spec}.ts']
    }
  }
});
