# Ractive HTML loader

Based on [webpack-html-loader](https://github.com/webpack-contrib/html-loader).

This loader parse Ractive templates [Ractive](https://github.com/ractivejs/ractive) into object template (via [Ractive.parse](https://ractive.js.org/api/#ractiveparse)) and resolves loadable resources.

## Getting started

Install the package:

```bash
npm install --save-dev ractive-html-loader
```

Then add the loader to your webpack config.
For example:

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.rhtml$/i,
        loader: 'ractive-html-loader',
        options: {
          /* ... */
        }
      },
    ],
  },
};
```

Then import template file in your code

```javascript
import template from './file.rhtml';

const Cmp = Ractive.extend({
  template,
});

class Cmp extends Ractive { /* ... */ }

Ractive.extendWith(Cmp, {
  template,
});
```

## Options

### `attrs`

`boolean | string | string[]`

Default: `['img:src']`

Specify what type of attribute of which tag must be as external file.

You may need to specify loaders for asset modules. See this [guide](https://webpack.js.org/guides/asset-modules/).

e.g.:

`['tag:attribute']`
`'tag:attribute tag:attribute'`

### `root`

Base path for the resources

`string`

Default: `undefined`

### `parseOptions`

`Object`

Default: `undefined`

params to be passed to [Ractive.parse](https://ractive.js.org/api/#ractiveparse).

### `esModule`

`boolean`

produce output using ES syntax

Default: `true`

## TODO - FUTURE

- improve attribute handling
