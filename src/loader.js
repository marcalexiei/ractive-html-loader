import { validate } from 'schema-utils';

import parse from './lib/parse';
import schema from './options.schema.json';

/**
 * @typedef RawOptions
 * @type {Object}
 * @property {?string[] | string} attrs
 * @property {?string} root
 * @property {?boolean} esModule
 * @property {import('ractive').ParseOpts} parseOptions
 */

/**
 * @typedef InternalParseOptions
 * @type {Object}
 * @property {string[]} attrs
 * @property {boolean} esModule
 * @property {import('ractive').ParseOpts} parseOptions
 */

/**
 *
 * @param {RawOptions} rawOptions
 * @returns {InternalParseOptions}
 */
function normalizeOptions(rawOptions) {
  let attrs = ['img:src'];
  if (rawOptions.attrs !== undefined) {
    if (typeof rawOptions.attrs === 'string') attrs = rawOptions.attrs.split(' ');
    else if (Array.isArray(rawOptions.attrs)) attrs = rawOptions.attrs;
    else if (rawOptions.attrs === false) attrs = [];
  }

  return {
    ...rawOptions,
    attrs,
    parseOptions: typeof rawOptions.parseOptions === 'object' ? rawOptions.parseOptions : {},
    esModule: typeof rawOptions.esModule === 'boolean' ? rawOptions.esModule : true,
  };
}

export default function loader(source) {
  this.cacheable && this.cacheable();

  // this.getOptions not exposed why loader is used together with thread-loader
  // @see https://github.com/webpack-contrib/thread-loader/issues/106
  const rawOptions = this.getOptions(schema);

  validate(schema, rawOptions);

  const options = normalizeOptions(rawOptions);

  const parsedTemplate = parse(source, options);

  return parsedTemplate;
}
