/**
 *
 * @param {boolean} esModule
 */
export function getOutputExportCode(esModule) {
  if (esModule) return 'export default';

  return 'module.exports =';
}

export function normalizeOptions(rawOptions) {
  return {
    ...rawOptions,
    esModule: typeof rawOptions.esModule === 'boolean' ? rawOptions.esModule : true,
  };
}
