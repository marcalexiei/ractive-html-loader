import Ractive from 'ractive';
import url from 'url';
import loaderUtils from 'loader-utils';

import attrParse from './attributesParser';

function randomIdent() {
  return `xxxHTMLLINKxxx${Math.random()}${Math.random()}xxx`;
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
  let json = JSON.stringify(source, (key, value) => {
    if (typeof value === 'function') {
      functions.push(value);
      return placeholder;
    }
    return value;
  }, space);
  json = json.replace(new RegExp(`"${placeholder}"`, 'g'), () => functions.shift());
  return json;
}

/**
 * @typedef InternalParseOptions
 * @type {Object}
 * @property {string[]} attrs
 * @property {import('ractive').ParseOpts} parseOptions
 */

/**
 * @param {string} source
 * @param {InternalParseOptions} options
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
      return (`${tag}:${attr}`) === a;
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
      if (ractiveInterpolations.some(
        ([_open, _close]) => link.value.includes(_open) && link.value.includes(_close),
      )) return;
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

  let ractiveTemplate = Ractive.parse(contentOutput, options.parseOptions);

  // Inline function. Needed for parserOptions.csp
  ractiveTemplate = stringifyFunctions(ractiveTemplate);

  ractiveTemplate = ractiveTemplate.replace(/xxxHTMLLINKxxx[0-9.]+xxx/g, (match) => {
    if (!data[match]) return match;

    const urlToRequest = loaderUtils.urlToRequest(data[match], root);
    return `" + require(${JSON.stringify(urlToRequest)}) + "`;
  });

  return ractiveTemplate;
}
