module.exports = {
  extends: 'react-app',
  "plugins": ["react-hooks"],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'no-restricted-properties': [
      2,
      {
        property: 'defaultProps',
        message:
          'Specifying static properties such as defaultProps can break tree shaking. Use default parameter values instead. See http://es6-features.org/#DefaultParameterValues.',
      },
    ],
    // Forbid the use of extraneous packages
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'rollup.config.js',
          'jest.*.js',
          '**/*{.,_}{stories,story}.{js,jsx,ts,tsx}',
          'test/**', // tape, common npm pattern
          'tests/**', // also common npm pattern
          'spec/**', // mocha, rspec-like pattern
          '**/__tests__/**', // jest pattern
          '**/__mocks__/**', // jest pattern
          'test.{js,jsx,ts,tsx}', // repos with a single test file
          'test-*.{js,jsx,ts,tsx}', // repos with multiple top-level test files
          '**/*{.,_}{test,spec}.{js,jsx,ts,tsx}', // tests where the extension or filename suffix denotes that it is a test
          '**/jest.config.js', // jest config
          '**/postcss.config.js', // postcss config
          '**/webpack.config.js', // webpack config
          '**/webpack.config.*.js', // webpack config
        ],
      },
    ],
  },
};
