/**
 * @jest-environment node
 */
import compiler from './compiler';

describe('text content', () => {
  test('should properly generate template for text-content', async () => {
    const stats = await compiler('./template/only-text.rhtml');
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output).toBe('export default {"v":4,"t":["only text!"]}');
  });
});
