/**
 * @jest-environment node
 */
import compiler from './compiler';

describe('Validate options', () => {
  test('should break with unknown properties in the root', async () => {
    expect.assertions(1);
    try {
      await compiler('./template/only-text.rhtml', { asd: true });
    } catch (e) {
      expect(e).toBeInstanceOf(Array);
    }
  });

  test('should break with unknown properties in the `parseOptions`', async () => {
    expect.assertions(1);
    try {
      await compiler('./template/only-text.rhtml', { parseOptions: { asd: true } });
    } catch (e) {
      expect(e).toBeInstanceOf(Array);
    }
  });
});

describe('text content', () => {
  test('should properly generate template for text-content', async () => {
    const stats = await compiler('./template/only-text.rhtml', {});
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output).toBe('export default {"v":4,"t":["only text!"]}');
  });
});


// describe('images', () => {
//   test('should convert to requires', async () => {
//     const stats = await compiler('./template/image.rhtml', {});
//     const output = stats.toJson({ source: true }).modules[0].source;

//     expect(output).toBe('export default {"v":4,"t":["only text!"]}');
//   });
// });
