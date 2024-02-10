import compiler from './compiler';

describe('must throw with invalid options', () => {
  test.each([
    {
      title: 'should break with unknown properties as config',
      options: { asd: true },
    },
    {
      title: 'should break with unknown properties inside `parseOptions`',
      options: { parseOptions: { foo: 'bar' } },
    },
    {
      title: 'should break with invalid `attrs`',
      options: { attrs: { foo: 'bar' } },
    },
  ])('$title', async ({ options }) => {
    expect.assertions(2);
    try {
      await compiler('./fixtures/only-text.rhtml', options);
    } catch (e) {
      expect(e).toBeInstanceOf(Array);
      expect(e[0].message.includes('ValidationError:')).toBe(true);
    }
  });
});
