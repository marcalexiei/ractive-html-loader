/**
 * @jest-environment node
 */
import compiler from './compiler';

describe('Validate options', () => {
  [
    {
      title: 'should break with unknown properties in the root',
      options: { asd: true },
    },
  ].forEach(({ title, options }) => {
    test(title, async () => {
      expect.assertions(2);
      try {
        await compiler('./template/only-text.rhtml', options);
      } catch (e) {
        expect(e).toBeInstanceOf(Array);
        expect(e[0].message.includes('ValidationError:')).toBe(true);
      }
    });
  });
});
