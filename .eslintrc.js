module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'vue/singleline-html-element-content-newline': 0,
    'space-before-function-paren': 0,
    'prefer-const': 0,
    'template-curly-spacing': 0,
    'vue/no-unused-vars': 1,
    'no-unused-vars': 1,
    'no-template-curly-in-string': 0
  }
}
