module.exports = {
  env: {
    browser: true
  },
  extends: ['airbnb', 'plugin:prettier/recommended', 'prettier/react'],
  plugins: ['babel'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        jsxSingleQuote: true,
        'space-before-function-paren': [2, 'never'],
        'object-curly-newline': false
      }
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],
    'no-underscore-dangle': 'off',
    'import/prefer-default-export': 'off',
    'prefer-destructuring': 'off',
    'prefer-template': 'off',
    'react/prop-types': 'off',
    'react/destructuring-assignment': 'off',
    'no-unused-vars': 1,
    'no-console': 'off',
    'jsx-a11y/accessible-emoji': ['off']
  }
}
