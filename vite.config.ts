import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import path from 'path';
import { resolve } from 'path';

// Check if we're building the library
const isLibrary = process.env.BUILD_LIB === 'true';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Library build configuration
  if (isLibrary) {
    return {
      plugins: [
        vue({
          template: {
            compilerOptions: {
              isCustomElement: (tag) => ['v-list-recognize-title'].includes(tag)
            }
          }
        }),
        // styles: 'none' -> do NOT inject Vuetify's component styles into the
        // library bundle. `vuetify` is a peerDependency, so the consuming app
        // already ships Vuetify's CSS. This keeps the library's style.css to
        // only the kit's own component/layout styles.
        vuetify({
          autoImport: true,
          styles: 'none'
        })
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src')
        }
      },
      css: {
        preprocessorOptions: {
          scss: {}
        }
      },
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'UiKit',
          fileName: (format) => `ui-kit.${format}.js`,
          formats: ['es', 'cjs']
        },
        rollupOptions: {
          // Externalize deps that shouldn't be bundled. These are provided by
          // the consuming app (declared as peer/normal deps) so they are not
          // duplicated inside the library bundle.
          external: [
            'vue',
            'vue-router',
            'pinia',
            'vuetify',
            'axios',
            '@vueuse/core',
            '@tabler/icons-vue',
            // Heavy feature deps – kept out of the bundle to keep it lean.
            'xlsx',
            'xlsx-js-style',
            'vue3-lottie',
            'vue3-perfect-scrollbar',
            // jalaali-js is bundled, not externalized (to avoid CJS/ESM issues)
            'vue3-persian-datetime-picker',
            '@dsb-norge/vue-keycloak-js'
          ],
          output: {
            // Provide global variables for externalized deps
            globals: {
              vue: 'Vue',
              'vue-router': 'VueRouter',
              pinia: 'Pinia',
              vuetify: 'Vuetify',
              axios: 'axios',
              '@vueuse/core': 'VueUse',
              '@tabler/icons-vue': 'TablerIcons',
              xlsx: 'XLSX',
              'xlsx-js-style': 'XLSXStyle',
              'vue3-lottie': 'Vue3Lottie',
              'vue3-perfect-scrollbar': 'Vue3PerfectScrollbar',
              // jalaali-js is bundled, no global needed
              'vue3-persian-datetime-picker': 'Vue3PersianDatetimePicker',
              '@dsb-norge/vue-keycloak-js': 'VueKeycloakJs'
            },
            // Preserve directory structure
            preserveModules: false,
            assetFileNames: (assetInfo) => {
              if (assetInfo.name?.endsWith('.css')) {
                return 'style.css';
              }
              return assetInfo.name || 'asset';
            }
          }
        },
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        },
        sourcemap: true,
        cssCodeSplit: false, // Bundle all CSS into one file
        cssMinify: true
      },
      optimizeDeps: {
        exclude: ['vuetify'],
        entries: ['./src/**/*.vue']
      }
    };
  }
  
  // Application build configuration (default)
  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => ['v-list-recognize-title'].includes(tag)
          }
        }
      }),
      vuetify({
        autoImport: true
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {}
      }
    },
    build: {
      chunkSizeWarningLimit: 1024 * 1024, // Set the limit to 1 MB
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router', 'pinia'],
            'vuetify': ['vuetify'],
          }
        }
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: env.VITE_DEBUG !== 'true',
          drop_debugger: env.VITE_DEBUG !== 'true'
        }
      }
    },
    optimizeDeps: {
      exclude: ['vuetify'],
      entries: ['./src/**/*.vue']
    },
    server: {
      host: true, // Allow external connections (same as --host)
      port: parseInt(env.VITE_PORT) || 5050, // Use env port or fallback to 5050
      headers: {
        'Cross-Origin-Embedder-Policy': 'unsafe-none',
        'Cross-Origin-Opener-Policy': 'unsafe-none'
      }
    },
    // Dynamic base URL based on environment
    base: env.VITE_BASE_URL || '/',
  };
});
