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
      // Disable core ESLint no-unused-vars so the TypeScript-aware rule below is used
      'no-unused-vars': 'off',
      // Constructor-injected dependencies in Angular can appear unused to the
      // linter if they're only used for DI. Ignore unused function args to
      // prevent false positives while still warning for unused variables.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'none',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
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
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'none',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
