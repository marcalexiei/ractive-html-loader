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

describe('image', () => {
  test('should properly generate template when image tag with src is present', async () => {
    const stats = await compiler('./fixtures/image.rhtml');
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output).toBe('export default {"v":4,"t":["Text ",{"t":7,"e":"img","m":[{"n":"src","f":"" + require("./image-local.png") + "","t":13,"g":1}]}," Text"]}');
  });
});
