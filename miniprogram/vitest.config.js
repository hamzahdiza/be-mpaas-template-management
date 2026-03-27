import {
  defineConfig
} from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: [
      './src/configTest/setup.js',
      './src/configTest/globalAli.js',
    ],
    testTimeout: 50000,
    coverage: {
      provider: 'istanbul',
      include: ['src/app/pages/*', 'src/app/package_transaction/**/*', 'src/utils/*', 'src/app/components/*'],
      exclude: ['src/app/components/mp-html/*', '**/*.spec.js'],
      reporter: ['text', 'lcov', 'html'],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
      watermarks: {
        lines: [70, 80],
        functions: [70, 80],
        branches: [70, 80],
        statements: [70, 80],
      },
    },
  },
})