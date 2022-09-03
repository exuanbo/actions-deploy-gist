module.exports = {
  extends: ['./node_modules/ts-standardx/.eslintrc.js'],
  overrides: [
    {
      files: '**/*.ts',
      rules: {
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off'
      }
    }
  ]
}
