# Get started

## Install

::: code-group

```shell [npm]
npm install --save-dev ractive-html-loader
```

```shell [pnpm]
pnpm add --save-dev ractive-html-loader
```

```shell [yarn]
yarn add --dev ractive-html-loader
```

```shell [bun]
bun add --dev ractive-html-loader
```

:::

##  Add loader to webpack config

Add the loader to your webpack config.
For example:

```javascript
// webpack.config.js
module.exports = {
  // ...
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
  // ...
};
```

## Usage

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
