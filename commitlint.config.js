module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'deps',
        'feat',
        'fix',
        'perf',
        'refactor',
        'test',
      ],
    ],
  },
};
