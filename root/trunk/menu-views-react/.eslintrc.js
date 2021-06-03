module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
    "chrome": "readonly", // Don't check chrome variable. I know it exist always in Chrome extension.
    "axios": "readonly", // Don't check axios variable. It's always import before that.
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 8,
    "allowImportExportEverywhere": true,
    "sourceType": "module"
  },
  "plugins": [
    "react",
  ],
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "double", { "allowTemplateLiterals": true }],
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "react/no-unescaped-entities": 0
  },
  "ignorePatterns": ["dist"], // uncheck "dist" folder
  "settings": {
    "react": {
      "version": "detect", // React version. "detect" automatically picks the version you have installed.
                           // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
                           // default to latest and warns if missing
                           // It will default to "detect" in the future

    },
  }
};
