import Ractive from 'ractive';
import url from 'url';
import loaderUtils from 'loader-utils';

import attrParse from './attributesParser';

function randomIdent() {
  return `xxxHTMLLINKxxx${Math.random()}${Math.random()}xxx`;
}

function getOutputExportCode(esModule) {
  if (esModule) return 'export default';

  return 'module.exports =';
}

/**
 * @param {Object} obj
 * @param {number?} space
 *
 * @see https: //gist.github.com/cowboy/3749767
 */
export function stringifyFunctions(source, space = null) {
  const placeholder = '____PLACEHOLDER____';
  const functions = [];
  let json = JSON.stringify(
    source,
    (key, value) => {
      if (typeof value === 'function') {
        functions.push(value);
        return placeholder;
      }
      return value;
    },
    space,
  );
  json = json.replace(new RegExp(`"${placeholder}"`, 'g'), () =>
    functions.shift(),
  );
  return json;
}

/**
 * @param {string} source
 * @param {import('../loader').InternalParseOptions} options
 *
 * @returns {string}
 */
export default function parse(source, options) {
  let contentOutput = source;

  const attributes = options.attrs;
  const { root } = options;
  const links = attrParse(contentOutput, (tag, attr) => {
    const res = attributes.find((a) => {
      if (a.charAt(0) === ':') {
        return attr === a.slice(1);
      }
      return `${tag}:${attr}` === a;
    });
    return !!res;
  });
  links.reverse();
  const data = {};
  contentOutput = [contentOutput];
  links.forEach((link) => {
    if (!loaderUtils.isUrlRequest(link.value, root)) return;

    if (link.value.includes('mailto:')) return;

    /**
     * Check if the string contains Ractive delimiters.
     * If yes do not add them to webpack resolutions.
     */
    {
      const {
        delimiters = Ractive.defaults.delimiters,
        tripleDelimiters = Ractive.defaults.tripleDelimiters,
        staticDelimiters = Ractive.defaults.staticDelimiters,
        staticTripleDelimiters = Ractive.defaults.tripleDelimiters,
      } = options.parseOptions;

      const ractiveInterpolations = [
        delimiters,
        tripleDelimiters,
        staticDelimiters,
        staticTripleDelimiters,
      ];
      if (
        ractiveInterpolations.some(
          ([_open, _close]) =>
            link.value.includes(_open) && link.value.includes(_close),
        )
      )
        return;
    }

    const uri = url.parse(link.value);
    if (uri.hash !== null && uri.hash !== undefined) {
      uri.hash = null;
      link.value = uri.format();
      link.length = link.value.length;
    }

    let ident;

    do {
      ident = randomIdent();
    } while (data[ident]);

    data[ident] = link.value;
    const x = contentOutput.pop();
    contentOutput.push(x.substr(link.start + link.length));
    contentOutput.push(ident);
    contentOutput.push(x.substr(0, link.start));
  });
  contentOutput.reverse();
  contentOutput = contentOutput.join('');

  const ractiveTemplate = Ractive.parse(contentOutput, options.parseOptions);

  // Inline function. Needed for parserOptions.csp
  const ractiveTemplateString = stringifyFunctions(ractiveTemplate);

  const imports = [];
  let template = '';
  let resourceCount = 0;

  template = ractiveTemplateString.replace(
    /xxxHTMLLINKxxx[0-9.]+xxx/g,
    (match) => {
      if (!data[match]) return match;

      const urlToRequest = loaderUtils.urlToRequest(data[match], root);

      const resourceName = `res${resourceCount}`;
      resourceCount += 1;

      if (options.esModule) {
        imports.push(
          `import ${resourceName} from ${JSON.stringify(urlToRequest)};`,
        );
      } else {
        imports.push(
          `const ${resourceName} = require(${JSON.stringify(urlToRequest)});`,
        );
      }

      return `" + ${resourceName} + "`;
    },
  );

  let result = '';
  if (imports.length) {
    result += `${imports.join('\n')}\n\n`;
  }

  result += `${getOutputExportCode(options.esModule)} ${template};`;

  return result;
}
