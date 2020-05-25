// babel.config.js
module.exports = {
  "exclude": "node_modules/**",
  "plugins": [
    "@babel/plugin-proposal-class-properties",
    [
    "@babel/plugin-transform-runtime",
    {
      "absoluteRuntime": false,
      "corejs": false,
      "helpers": true,
      "regenerator": true,
      "useESModules": false,
      "version": "7.0.0-beta.41"
    }
    ]
  ],
  "presets": ["@babel/preset-env", "@babel/preset-react"]
};
