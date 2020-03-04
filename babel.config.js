const presets =  [
  ["@babel/preset-env", {
    "modules": true,
    "targets": ["> 0.5% in JP, not dead", "not ie <= 10"],
    "useBuiltIns": "usage"
  }]
];
module.exports = {presets}
