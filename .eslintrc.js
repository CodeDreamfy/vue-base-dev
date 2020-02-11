module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {
    _: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/prettier',
    'eslint:recommended',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'prettier/prettier':
      process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  plugins: ['vue'],
};
