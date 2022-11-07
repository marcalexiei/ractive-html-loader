import { validate } from 'schema-utils';

import parse from './lib/parse';
import { getOutputExportCode, normalizeOptions } from './utils';
import schema from './options.schema.json';

export default function loader(source) {
  this.cacheable && this.cacheable();

  // this.getOptions not exposed why loader is used together with thread-loader
  // @see https://github.com/webpack-contrib/thread-loader/issues/106
  const rawOptions = this.getOptions(schema);

  validate(schema, rawOptions);

  const options = normalizeOptions(rawOptions);

  const parsedTemplate = parse(source, options);

  return `${getOutputExportCode(options.esModule)} ${parsedTemplate}`;
}
