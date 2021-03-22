/**
 * @jest-environment node
 */
import compiler from './compiler';

describe('text content', () => {
  test('should properly generate template for text-content', async () => {
    const stats = await compiler('./fixtures/only-text.rhtml');
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output).toBe('export default {"v":4,"t":["only text!"]}');
  });
});

describe('`csp` option', () => {
  test('shouldn\'t produces functions when `csp` parseOptions is set to `false`', async () => {
    const stats = await compiler('./fixtures/template-with-expression.rhtml', {
      parseOptions: {
        csp: false,
      },
    });
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output).toBe('export default {"v":4,"t":[{"t":7,"e":"div","f":[{"t":2,"x":{"r":["test"],"s":"_0+1"}}]}]}');
  });

  test('should produces functions when `csp` parseOptions is set to `true`', async () => {
    const stats = await compiler('./fixtures/template-with-expression.rhtml', {
      parseOptions: {
        csp: true,
      },
    });
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output).toBe('export default {"v":4,"t":[{"t":7,"e":"div","f":[{"t":2,"x":{"r":["test"],"s":"_0+1"}}]}],"e":{"_0+1":function (_0){return(_0+1);}}}');
  });
});

describe('esModule', () => {
  test('should return module.export = when `esModule` is false', async () => {
    const stats = await compiler('./fixtures/only-text.rhtml', { esModule: false });
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output.startsWith('module.exports =')).toBe(true);
  });

  test('should return `export default` when `esModule` is true', async () => {
    const stats = await compiler('./fixtures/only-text.rhtml', { esModule: true });
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output.startsWith('export default ')).toBe(true);
  });

  test('should return `export default` when `esModule` is not set', async () => {
    const stats = await compiler('./fixtures/only-text.rhtml');
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output.startsWith('export default ')).toBe(true);
  });
});

describe('sources handling', () => {
  test('should properly generate template when image tag with src is present', async () => {
    const stats = await compiler('./fixtures/image.rhtml');
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output).toBe('export default {"v":4,"t":["Text ",{"t":7,"e":"img","m":[{"n":"src","f":"" + require("./image-local.png") + "","t":13,"g":1}]}," Text"]}');
  });

  test('should accept attrs from query (space separated)', async () => {
    const stats = await compiler('./fixtures/image-and-script.rhtml', { attrs: 'script:src img:src' });
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output).toBe('export default {"v":4,"t":["Text ",{"t":7,"e":"script","m":[{"n":"src","f":"" + require("./assets/script.js") + "","t":13,"g":1}]}," ",{"t":7,"e":"img","m":[{"n":"src","f":"" + require("./image-local.png") + "","t":13,"g":1}]}]}');
  });

  test('should ignore hash fragments in URLs', async () => {
    const stats = await compiler('./fixtures/image-with-hash.rhtml');
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output).toBe('export default {"v":4,"t":[{"t":7,"e":"img","m":[{"n":"src","f":"" + require("./image-local.png") + "#hash","t":13,"g":1}]}]}');
  });

  test("should ignore anchor with 'mailto:' in the href attribute", async () => {
    const stats = await compiler('./fixtures/link-mail-to.rhtml');
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output).toBe('export default {"v":4,"t":[{"t":7,"e":"a","m":[{"n":"href","f":"mailto:username@exampledomain.com","t":13,"g":1}],"f":["Mail to"]}]}');
  });

  test('should accept root from options', async () => {
    const stats = await compiler('./fixtures/image-root.rhtml', {
      root: './assets',
    });
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output).toBe('export default {"v":4,"t":["Text ",{"t":7,"e":"img","m":[{"n":"src","f":"" + require("./assets/image.png") + "","t":13,"g":1}]}," Text"]}');
  });
});
