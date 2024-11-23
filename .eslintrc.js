module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['module-resolver', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
      },
    ],
    'react/jsx-sort-props': 'error',
  },
};
