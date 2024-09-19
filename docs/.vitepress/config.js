import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Ractive HTML loader',
  description: 'Loader module for Webpack',

  base: '/ractive-html-loader/',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Get started', link: '/get-started' },
      { text: 'Options', link: '/options' },
    ],

    sidebar: [
      {
        items: [
          { text: 'Get started', link: '/get-started' },
          { text: 'Options', link: '/options' },
        ],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/marcalexiei/ractive-html-loader',
      },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2018-present Pasqualetti Marco',
    },

    search: {
      provider: 'local',
    },
  },
});
