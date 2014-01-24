/**
 * MIT License http://www.opensource.org/licenses/mit-license.php
 */
// const htmlMinifier = require("html-minifier");
const loaderUtils = require('loader-utils');
const url = require('url');
const assign = require('object-assign');
const Ractive = require('ractive');
const attrParse = require('./lib/attributesParser');

function randomIdent() {
  return `xxxHTMLLINKxxx${Math.random()}${Math.random()}xxx`;
}

function getLoaderConfig(context) {
  const query = loaderUtils.getOptions(context) || {};
  const configKey = query.config || 'htmlLoader';
  const config = context.options && Object.prototype.hasOwnProperty.call(context.options, configKey)
    ? context.options[configKey]
    : {};

  delete query.config;

  return assign(query, config);
}

module.exports = function ractiveHTMLLoader(content) {
  this.cacheable && this.cacheable();

  let contentOutput = content;

  const config = getLoaderConfig(this);

  let attributes = ['img:src'];
  if (config.attrs !== undefined) {
    if (typeof config.attrs === 'string') attributes = config.attrs.split(' ');
    else if (Array.isArray(config.attrs)) attributes = config.attrs;
    else if (config.attrs === false) attributes = [];
    else throw new Error('Invalid value to config parameter attrs');
  }
  const { root } = config;
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

  if (config.interpolate === 'require') {
    const reg = /\$\{require\([^)]*\)\}/g;
    let result;
    const reqList = [];
    while ((result = reg.exec(contentOutput))) {
      reqList.push({
        length: result[0].length,
        start: result.index,
        value: result[0],
      });
    }
    reqList.reverse();
    contentOutput = [contentOutput];
    reqList.forEach((link) => {
      const x = contentOutput.pop();
      let ident;
      do {
        ident = randomIdent();
      } while (data[ident]);
      data[ident] = link.value.substring(11, link.length - 3);
      contentOutput.push(x.substr(link.start + link.length));
      contentOutput.push(ident);
      contentOutput.push(x.substr(0, link.start));
    });
    contentOutput.reverse();
    contentOutput = contentOutput.join('');
  }

  /*
  if(typeof config.minimize === "boolean" ? config.minimize : this.minimize) {
    const minimizeOptions = assign({}, config);

    [
      "removeComments",
      "removeCommentsFromCDATA",
      "removeCDATASectionsFromCDATA",
      "collapseWhitespace",
      "conservativeCollapse",
      "removeAttributeQuotes",
      "useShortDoctype",
      "keepClosingSlash",
      "minifyJS",
      "minifyCSS",
      "removeScriptTypeAttributes",
      "removeStyleTypeAttributes",
    ].forEach(name => {
      if(typeof minimizeOptions[name] === "undefined") {
        minimizeOptions[name] = true;
      }
    });

    contentOutput = htmlMinifier.minify(contentOutput, minimizeOptions);
  }
  */

  /*
  if (config.interpolate && config.interpolate !== 'require') {
    // Double escape quotes so that they are not unescaped completely in the template string
    contentOutput = contentOutput.replace(/\\"/g, "\\\\\"");
    contentOutput = contentOutput.replace(/\\'/g, "\\\\\'");
    contentOutput = compile('`' + contentOutput + '`').code;
  }
  */

  /**
  * @param {Object} obj
  *
  * @see https: //gist.github.com/cowboy/3749767
  */
  const stringifyJSONWithFunctions = function (obj) {
    const placeholder = '____PLACEHOLDER____';
    const functions = [];
    let json = JSON.stringify(obj, (key, value) => {
      if (typeof value === 'function') {
        functions.push(value);
        return placeholder;
      }
      return value;
    }, 2);
    json = json.replace(new RegExp(`"${placeholder}"`, 'g'), () => functions.shift());
    return json;
  };

  const ractiveTemplate = Ractive.parse(contentOutput, config.parserOptions);
  contentOutput = stringifyJSONWithFunctions(ractiveTemplate);

  const contentWithResources = contentOutput.replace(/xxxHTMLLINKxxx[0-9.]+xxx/g, (match) => {
    if (!data[match]) return match;

    let urlToRequest;

    if (config.interpolate === 'require') {
      urlToRequest = data[match];
    } else {
      urlToRequest = loaderUtils.urlToRequest(data[match], root);
    }

    return `" + require(${JSON.stringify(urlToRequest)}) + "`;
  });

  let exportsString = 'module.exports = ';
  if (config.exportAsDefault) {
    exportsString = 'exports.default = ';
  } else if (config.exportAsEs6Default) {
    exportsString = 'export default ';
  }

  return `${exportsString} ${contentWithResources}`;
};
