module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ["problems", "eslint:recommended", "plugin:react/recommended"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    sourceType: "module"
  },
  plugins: ["react"],
  rules: {
    "no-unused-vars": ["warn"],
    indent: ["error", 2],
    "linebreak-style": ["error"],
    quotes: ["error", "single"],
    semi: ["error", "never"],
    'react/prop-types': [0],
    "react/jsx-no-undef": ["error"],
    "react/prefer-stateless-function": [1, { ignorePureComponents: true }],
    indent: ['error', 2, { SwitchCase: 1 }]
  }
};
