export default {
  presets: [
    [
      '@babel/preset-env',
      {
        // now that this package is a module no need to transpile modules
        modules: false,
        targets: {
          node: '18.0.0',
        },
      },
    ],
  ],
};
