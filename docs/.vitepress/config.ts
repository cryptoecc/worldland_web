import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "WorldLand Docs",
  description: "Official Documentation for WorldLand - Decentralized GPU Infrastructure",
  
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  
  // Force Dark Mode preferred
  appearance: 'dark',

  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    // Add Inter Font
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap', rel: 'stylesheet' }],
    ['meta', { property: 'og:description', content: 'Decentralized GPU Infrastructure Network - DePIN for AI Era' }],
  ],
  
  themeConfig: {
    // Logo Configuration
    logo: { src: '/logo.png', width: 32, height: 32 },
    siteTitle: 'WorldLand',
    
    nav: [
      {
        text: 'Learn',
        items: [
          { text: 'Executive Summary', link: '/' },
          { text: 'Key Features', link: '/introduction/key-features' },
          { text: 'WorldLand Token ($WL)', link: '/introduction/token' },
          { text: 'Whitepaper', link: '/whitepaper/' },
        ]
      },
      {
        text: 'Network',
        items: [
          { text: 'WorldLand Core', link: '/network/core' },
          { text: 'The Provider', link: '/network/provider' },
          { text: 'The Broker', link: '/network/broker' },
          { text: 'Add Network', link: '/introduction/links' }, // Fallback
          { text: 'Block Explorer', link: 'https://scan.worldland.foundation/' },
        ]
      },
      {
        text: 'Cloud',
        items: [
          { text: 'GPU Console', link: 'https://cloud.worldland.foundation' },
          { text: 'Pricing', link: 'https://cloud.worldland.foundation/pricing' },
          { text: 'How to Provide', link: '/cloud/provider/how-to-provide' },
          { text: 'How to Use', link: '/cloud/customer/how-to-use' },
        ]
      },
      {
        text: 'Developer',
        items: [
          { text: 'Documentation', link: '/' },
          { text: 'GitHub', link: 'https://github.com/cryptoecc/WorldLand' },
          { text: 'FAQ', link: '/introduction/faq' },
        ]
      },
      {
        text: 'Community',
        items: [
          { text: 'Discord', link: 'https://discord.gg/yJERYVnE6a' },
          { text: 'Twitter', link: 'https://twitter.com/Worldland_space' },
          { text: 'Medium', link: 'https://medium.com/@worldland-official' },
          { text: 'DAO Vote', link: 'https://dao.worldland.foundation' },
        ]
      }
    ],
    
    sidebar: [
      {
        text: 'Executive Summary',
        link: '/',
      },
      {
        text: 'WorldLand Introduction',
        collapsed: false,
        items: [
          { text: 'Key Features', link: '/introduction/key-features' },
          { text: 'WorldLand Token ($WL)', link: '/introduction/token' },
          { text: 'Design System', link: '/introduction/design-system' },
          { text: 'Important Links', link: '/introduction/links' },
          { text: 'FAQ', link: '/introduction/faq' },
        ]
      },
      {
        text: 'WorldLand Network',
        collapsed: false,
        items: [
          { text: 'WorldLand Core', link: '/network/core' },
          { text: 'The Provider', link: '/network/provider' },
          { text: 'The Broker', link: '/network/broker' },
          { text: 'Network Participants', link: '/network/participants' },
        ]
      },
      {
        text: 'WorldLand Tokenomics',
        collapsed: false,
        items: [
          { text: 'Token Overview', link: '/tokenomics/overview' },
          { text: 'Token Distribution', link: '/tokenomics/distribution' },
          { text: 'Token Vesting', link: '/tokenomics/vesting' },
          { text: 'Token Utility & Purpose', link: '/tokenomics/utility' },
          { text: 'Provider Rewards', link: '/tokenomics/provider-rewards' },
          { text: 'Reward Emissions', link: '/tokenomics/emissions' },
          { text: 'Circulating Supply', link: '/tokenomics/circulating-supply' },
        ]
      },
      {
        text: 'WorldLand Cloud',
        collapsed: false,
        items: [
          { text: 'What is WorldLand Cloud', link: '/cloud/overview' },
          { 
            text: 'Provider Guide', 
            collapsed: true,
            items: [
              { text: 'How to Provide', link: '/cloud/provider/how-to-provide' },
              { text: 'Provider Policy', link: '/cloud/provider/policy' },
            ]
          },
          { 
            text: 'Customer Guide', 
            collapsed: true,
            items: [
              { text: 'How to Use', link: '/cloud/customer/how-to-use' },
              { text: 'Portal Guide', link: '/cloud/customer/portal-guide' },
            ]
          },
        ]
      },
      {
        text: 'Community',
        link: '/community/',
      },
      {
        text: 'Whitepaper',
        link: '/whitepaper/',
      },
    ],
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cryptoecc/WorldLand' },
      { icon: 'twitter', link: 'https://twitter.com/Worldland_space' },
      { icon: 'discord', link: 'https://discord.gg/yJERYVnE6a' },
    ],
    
    search: {
      provider: 'local'
    },
    
    editLink: {
      pattern: 'https://github.com/cryptoecc/WorldLand/edit/master/docs/:path',
      text: 'Edit this page on GitHub'
    },
    
    footer: {
      message: 'Decentralized GPU Infrastructure for the AI Era',
      copyright: 'Copyright © 2026 WorldLand'
    },
    
    lastUpdated: {
      text: 'Last updated'
    },
    
    docFooter: {
      prev: 'Previous',
      next: 'Next'
    },
    
    outline: {
      label: 'On this page',
      level: [2, 3]
    }
  }
})
