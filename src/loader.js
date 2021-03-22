import parse from './lib/parse';
import { getOutputExportCode, normalizeOptions } from './utils';
import schema from './options.schema.json';

export default function loader(source) {
  this.cacheable && this.cacheable();

  const rawOptions = this.getOptions(schema);
  const options = normalizeOptions(rawOptions);

  const parsedTemplate = parse(source, options);

  return `${getOutputExportCode(options.esModule)} ${parsedTemplate}`;
}
