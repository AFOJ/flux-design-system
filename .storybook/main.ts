import type { StorybookConfig } from '@storybook/preact-vite'

const config: StorybookConfig = {
  staticDirs: ['../public'],
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: '@storybook/preact-vite',
  managerHead: (head) => `${head}
  <style>
    .sidebar-item svg[type='component'], .sidebar-item svg[type='document'], .sidebar-item svg[type='story'] {
    display: none;
  }

  .sidebar-item > button {
    align-items: center;
  }
  </style>`,
}
export default config
