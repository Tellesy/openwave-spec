import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OpenWave',
  description: 'Open Payment & Open Banking Standard — Bank-agnostic, Interoperable, Built for Emerging Markets',
  base: '/openwave-spec/',

  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/openwave-spec/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#7c3aed' }],
    ['meta', { property: 'og:title', content: 'OpenWave — Open Payment Standard' }],
    ['meta', { property: 'og:description', content: 'Bank-agnostic payment & open banking standard built for emerging markets.' }],
    ['meta', { property: 'og:image', content: 'https://Tellesy.github.io/openwave-spec/og-preview.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  themeConfig: {
    logo: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/></svg>' },
    siteTitle: 'OpenWave',

    nav: [
      { text: 'Guide', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: 'API Reference', link: '/api/overview', activeMatch: '/api/' },
      { text: 'Downloads', link: '/downloads' },
      { text: 'Architecture', link: '/guide/architecture' },
      {
        text: 'Specs',
        items: [
          {
            text: 'OpenAPI Files',
            items: [
              { text: 'Payments v1', link: 'https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-payments-v1.yaml' },
              { text: 'Open Banking v1', link: 'https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-open-banking-v1.0.yaml' },
              { text: 'Identity v1', link: 'https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-identity-v1.0.yaml' },
            ]
          },
          {
            text: 'Tools',
            items: [
              { text: 'Swagger Editor', link: 'https://editor.swagger.io/?url=https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-payments-v1.yaml' },
              { text: 'All Downloads', link: '/downloads' },
            ]
          }
        ]
      },
      {
        text: 'v1.0.0',
        items: [
          { text: 'Changelog', link: 'https://github.com/Tellesy/openwave-spec/blob/main/CHANGELOG.md' },
          { text: 'Contributing', link: 'https://github.com/Tellesy/openwave-spec/blob/main/CONTRIBUTING.md' },
          { text: 'GitHub Repo', link: 'https://github.com/Tellesy/openwave-spec' },
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'What is OpenWave?', link: '/guide/introduction' },
            { text: 'Core Concepts', link: '/guide/concepts' },
            { text: 'NPT — National Payment Tag', link: '/guide/npt' },
            { text: 'Architecture & Infrastructure', link: '/guide/architecture' },
          ]
        },
        {
          text: 'Integration Guides',
          collapsed: false,
          items: [
            { text: 'For Merchants', link: '/guide/merchants' },
            { text: 'For Banks', link: '/guide/banks' },
            { text: 'For TPPs (Open Banking)', link: '/guide/tpp' },
            { text: 'Gateway Operators', link: '/guide/operators' },
          ]
        },
        {
          text: 'Reference',
          collapsed: false,
          items: [
            { text: 'Authentication', link: '/guide/authentication' },
            { text: 'Webhooks', link: '/guide/webhooks' },
            { text: 'Error Codes', link: '/guide/errors' },
            { text: 'Amount Convention', link: '/guide/amounts' },
            { text: 'Settlement & CBL Infrastructure', link: '/guide/settlement' },
          ]
        },
        {
          text: 'Downloads',
          collapsed: false,
          items: [
            { text: 'Spec Files & Postman', link: '/downloads' },
            { text: 'Spec Files (raw)', link: '/spec' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/api/overview' },
            { text: 'Interactive Explorer', link: '/api/explorer' },
            { text: 'Payments', link: '/api/payments' },
            { text: 'Alias (NPT)', link: '/api/alias' },
            { text: 'Open Banking', link: '/api/open-banking' },
            { text: 'Identity Registry', link: '/api/identity' },
            { text: 'Webhooks', link: '/api/webhooks' },
          ]
        }
      ]
    },

    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Tellesy/openwave-spec' }
    ],

    footer: {
      message: 'Released under the <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank">Apache 2.0 License</a>.',
      copyright: 'Developed and maintained by <a href="https://neptune.ly" target="_blank">Neptune Fintech Solutions</a>'
    },

    search: { provider: 'local' },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: { dateStyle: 'medium' }
    },

    docFooter: {
      prev: 'Previous',
      next: 'Next'
    },

    returnToTopLabel: 'Back to top',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Theme',
  }
})
