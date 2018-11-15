# Ractive HTML loader

Based on [webpack-html-loader](https://github.com/webpack-contrib/html-loader).
This loader handles HTML file includeding external resources and generates [Ractive](https://github.com/ractivejs/ractive) object template using [Ractive.parse](https://ractive.js.org/api/#ractiveparse).

## Configuration

- `parserOptions` - params to be passed to [Ractive.parse](https://ractive.js.org/api/#ractiveparse).
- `templateSpace` – If you want to have JSON printed in a more readble way you can use this property.
- see [webpack-html-loader](https://github.com/webpack-contrib/html-loader) for other params.

## TODO

- manage interpolate & test
- manage minifization & test
