/**
 * @jest-environment node
 */
import compiler from './compiler';

describe('Validate options', () => {
  [
    {
      title: 'should break with unknown properties as config',
      options: { asd: true },
    },
    {
      title: 'should break with unknown properties inside `parseOptions`',
      options: { parseOptions: { foo: 'bar' } },
    },
  ].forEach(({ title, options }) => {
    test(title, async () => {
      expect.assertions(2);
      try {
        await compiler('./fixtures/only-text.rhtml', options);
      } catch (e) {
        expect(e).toBeInstanceOf(Array);
        expect(e[0].message.includes('ValidationError:')).toBe(true);
      }
    });
  });
});
