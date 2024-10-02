module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['module-resolver', 'prettier'],
  rules: {
    'module-resolver/use-alias': [
      'error',
      {
        root: ['./'],
        alias: {
          '@': './',
        },
      },
    ],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
      },
    ],
    'react/jsx-sort-props': 'error',
  },
};
