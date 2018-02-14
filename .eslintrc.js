module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "parserOptions" : {
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "modules": true
    }
  },
  "parser": "babel-eslint",
  "extends": "eslint:recommended",
  "rules": {
    "indent": [
      "error",
      2
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "never"
    ],
    "eqeqeq": "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": [
      "error", "always"
    ],
    "arrow-spacing": [
      "error", { "before": true, "after": true }
    ],
    "no-console": 0,
  },
  "globals": {
    "document": true,
    "describe": true,
    "beforeAll": true,
    "beforeEach": true,
    "afterAll": true,
    "afterEach": true,
    "it": true,
    "test": true,
    "expect": true
  }
};