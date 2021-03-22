import Ractive from 'ractive';

import schema from './options.schema.json';

export default function loader(source) {
  this.cacheable && this.cacheable();

  const options = this.getOptions(schema);

  const parsedTemplate = Ractive.parse(source, options.parserOptions);

  return `export default ${JSON.stringify(parsedTemplate)}`;
}
