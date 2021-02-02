module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'space-before-function-paren': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'eol-last': 0, // end of life 不需要换行
    indent: ['off', 'tab'],
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-tab': 0,
    'no-multi-spaces': 0,
    'no-mixed-spaces-and-tabs': 0,
    'no-unused-vars': 0,
    'no-trailing-spaces': 0,
    eqeqeq: 0,  
    'vue/valid-template-root': 0,
    'no-multiple-template-root': 0,
    camelcase: 0
  }
}
