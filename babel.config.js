const presets = [
  [
    "@babel/env",
    {
      targets: {
        chrome: "72",
        edge: "17",
        firefox: "64",
        ie: "11",
        safari: "11.1"
      }  
    }
  ]
];

module.exports = { presets };

