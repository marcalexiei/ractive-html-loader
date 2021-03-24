/**
 *  @param {boolean} esModule
 */
export function getOutputExportCode(esModule) {
  if (esModule) return 'export default';

  return 'module.exports =';
}

export function normalizeOptions(rawOptions) {
  let attrs = ['img:src'];
  if (rawOptions.attrs !== undefined) {
    if (typeof rawOptions.attrs === 'string') attrs = rawOptions.attrs.split(' ');
    else if (Array.isArray(rawOptions.attrs)) attrs = rawOptions.attrs;
    else if (rawOptions.attrs === false) attrs = [];
  }

  return {
    ...rawOptions,
    attrs,
    esModule: typeof rawOptions.esModule === 'boolean' ? rawOptions.esModule : true,
  };
}
