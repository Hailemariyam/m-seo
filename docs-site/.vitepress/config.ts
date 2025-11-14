import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'm-seo Documentation',
  description: 'Multiversal SEO utility for all frameworks',
  base: '/m-seo/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'API', link: '/api' },
      { text: 'Examples', link: '/examples' },
      { text: 'FAQ', link: '/faq' },
      { text: 'Project Structure', link: '/project-structure' }
    ],
    sidebar: [
      { text: 'Introduction', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'API Reference', link: '/api' },
      { text: 'Examples', link: '/examples' },
      { text: 'FAQ', link: '/faq' },
      { text: 'Project Structure', link: '/project-structure' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Hailemariyam/m-seo' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/m-seo' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Hailemariyam Kebede'
    }
  }
});