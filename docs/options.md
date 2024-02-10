# Options

## `attrs`

`boolean | string | string[]`

Default: `['img:src']`

Specify what type of attribute of which tag must be as external file.

You may need to specify loaders for asset modules. See this [guide](https://webpack.js.org/guides/asset-modules/).

e.g.:

`['tag:attribute']`
`'tag:attribute tag:attribute'`

## `root`

Base path for the resources

`string`

Default: `undefined`

## `parseOptions`

`Object`

Default: `undefined`

params to be passed to [Ractive.parse](https://ractive.js.org/api/#ractiveparse).

## `esModule`

`boolean`

produce output using ES syntax

Default: `true`
