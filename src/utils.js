// eslint-disable-next-line import/prefer-default-export
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
    parseOptions: typeof rawOptions.parseOptions === 'object' ? rawOptions.parseOptions : {},
    esModule: typeof rawOptions.esModule === 'boolean' ? rawOptions.esModule : true,
  };
}
