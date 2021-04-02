module.exports = {
  env: {
    browser: true,
  },
  extends: ['airbnb', 'plugin:prettier/recommended', 'prettier/react'],
  plugins: ['babel'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        'space-before-function-paren': [2, 'never'],
        'object-curly-newline': false,
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/prefer-default-export': 'off',
    'prefer-destructuring': 'off',
    'prefer-template': 'off',
    'no-unused-vars': 1,
    'no-console': 'off',
  },
}
