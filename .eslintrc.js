module.exports = {
    "env": {
      "browser": false,
      "node": true,
      "es6": true
    },
    "extends": "google",
    "rules": {
      "comma-dangle": 0,
      "curly": 0,
      "key-spacing": [2, {align: "value"}],
      "max-len": [1, 120],
      "no-var": 0,
      "quotes": [2, "single", {avoidEscape: true}],
      "require-jsdoc": 0
    }
};
