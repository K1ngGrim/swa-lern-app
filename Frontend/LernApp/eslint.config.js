// Modern ESLint config for Angular, TypeScript, and Prettier
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettier,
  {
  ignores: ['dist/**', 'out-tsc/**', 'node_modules/**', 'build/**', 'test-out/**', 'coverage/**'],
    files: ['src/app/**/*.ts', 'src/main.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.app.json',
        sourceType: 'module',
      },
      globals: {
        window: true,
        document: true,
        console: true,
      },
      // No 'env' key, only 'globals' for browser support
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
  ignores: ['dist/**', 'out-tsc/**', 'node_modules/**', 'build/**', 'test-out/**', 'coverage/**'],
    files: ['src/app/**/*.spec.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.spec.json',
        sourceType: 'module',
      },
      globals: {
        describe: true,
        it: true,
        beforeEach: true,
        expect: true,
        jasmine: true,
      },
      // No 'env' key, only 'globals' for Jasmine and browser support
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
