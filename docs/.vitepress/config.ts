import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OpenWave',
  description: 'Open Payment & Open Banking Standard — Bank-agnostic, Interoperable, Built for Emerging Markets',
  base: '/openwave-spec/',

  head: [
    ['link', { rel: 'icon', href: '/openwave-spec/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#7c3aed' }],
    ['meta', { property: 'og:title', content: 'OpenWave — Open Payment Standard' }],
    ['meta', { property: 'og:description', content: 'Bank-agnostic payment & open banking standard built for emerging markets.' }],
  ],

  themeConfig: {
    logo: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/></svg>' },
    siteTitle: 'OpenWave',

    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'API Reference', link: '/api/overview' },
      { text: 'Spec Files', link: '/spec' },
      {
        text: 'v1.0.0',
        items: [
          { text: 'Changelog', link: 'https://github.com/openwave-standard/openwave-spec/blob/main/CHANGELOG.md' },
          { text: 'Contributing', link: 'https://github.com/openwave-standard/openwave-spec/blob/main/CONTRIBUTING.md' },
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'What is OpenWave?', link: '/guide/introduction' },
            { text: 'Core Concepts', link: '/guide/concepts' },
            { text: 'NPT — National Payment Tag', link: '/guide/npt' },
          ]
        },
        {
          text: 'Integration Guides',
          items: [
            { text: '🏪 For Merchants', link: '/guide/merchants' },
            { text: '🏦 For Banks', link: '/guide/banks' },
            { text: '🔗 For TPPs (Open Banking)', link: '/guide/tpp' },
            { text: '⚙️ Gateway Operators', link: '/guide/operators' },
          ]
        },
        {
          text: 'Reference',
          items: [
            { text: 'Authentication', link: '/guide/authentication' },
            { text: 'Webhooks', link: '/guide/webhooks' },
            { text: 'Error Codes', link: '/guide/errors' },
            { text: 'Amount Convention', link: '/guide/amounts' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/overview' },
            { text: '▶ Interactive Explorer', link: '/api/explorer' },
            { text: 'Payments', link: '/api/payments' },
            { text: 'Alias (NPT)', link: '/api/alias' },
            { text: 'Open Banking', link: '/api/open-banking' },
            { text: 'Identity Registry', link: '/api/identity' },
            { text: 'Webhooks', link: '/api/webhooks' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/openwave-standard/openwave-spec' }
    ],

    footer: {
      message: 'Released under the Apache 2.0 License.',
      copyright: 'Developed and maintained by Neptune Fintech'
    },

    search: { provider: 'local' },

    editLink: {
      pattern: 'https://github.com/openwave-standard/openwave-spec/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
  }
})
