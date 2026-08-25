import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import path from 'path';
import { resolve } from 'path';

// Check if we're building the library
const isLibrary = process.env.BUILD_LIB === 'true';
const isLibraryWatch = process.env.BUILD_LIB_WATCH === 'true';

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
          scss: {
            // Dart Sass deprecated @import; silence until SCSS is migrated to @use/@forward
            silenceDeprecations: ['import']
          }
        }
      },
      build: {
        // `vite build --watch` runs after declaration generation in `dev:link`.
        // Preserve those declarations so linked consumers retain type safety.
        emptyOutDir: !isLibraryWatch,
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'UiKit',
          // CJS must use a `.cjs` extension: the package is `"type": "module"`,
          // so a `.js` CJS file would be parsed as ESM by Node and yield an empty
          // module on `require()`. ESM stays `.es.js` (correct ESM under type:module).
          fileName: (format) => (format === 'es' ? 'ui-kit.es.js' : 'ui-kit.cjs'),
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
            'vue3-lottie',
            'vue3-perfect-scrollbar',
            // Optional chat renderer dependencies remain separate modules so
            // adding chat primitives does not inflate the UI Kit core bundle.
            'markdown-it',
            /^highlight\.js(?:\/|$)/,
            // jalaali-js is bundled, not externalized (to avoid CJS/ESM issues)
            'vue3-persian-datetime-picker',
            '@dsb-norge/vue-keycloak-js'
          ],
          output: {
            // Rolldown requires mixed named+default exports to declare 'named'
            exports: 'named',
            // Rolldown-native (Oxc) minify with console/debugger stripping.
            minify: { compress: { dropConsole: true, dropDebugger: true }, mangle: true },
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
        minify: 'oxc',
        // No source maps for the published library: `.npmignore` intentionally
        // excludes *.map from the package, so emitting them only produces dangling
        // `sourceMappingURL` references (404s in consumers' devtools) and bloats
        // the build dir. To ship maps instead, set this to true AND drop the
        // dist/*.map exclusions in `.npmignore`.
        sourcemap: false,
        cssCodeSplit: false, // Bundle all CSS into one file
        cssMinify: 'lightningcss' // Vite 8 default; fast native CSS minifier
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
        scss: {
          // Dart Sass deprecated @import; silence until SCSS is migrated to @use/@forward
          silenceDeprecations: ['import']
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 1024 * 1024, // Set the limit to 1 MB
      rollupOptions: {
        output: {
          // Rolldown (Vite 8) requires manualChunks to be a function, not an object
          manualChunks(id) {
            if (['vue', 'vue-router', 'pinia'].some((pkg) => id.includes(`/node_modules/${pkg}/`))) {
              return 'vendor';
            }
            if (id.includes('/node_modules/vuetify/')) {
              return 'vuetify';
            }
          },
          // Rolldown-native (Oxc) minify; strip console/debugger unless VITE_DEBUG.
          minify: {
            compress: {
              dropConsole: env.VITE_DEBUG !== 'true',
              dropDebugger: env.VITE_DEBUG !== 'true'
            },
            mangle: true
          }
        }
      },
      // Use Rolldown's native Oxc minifier instead of terser (much faster, no extra dep)
      minify: 'oxc'
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
