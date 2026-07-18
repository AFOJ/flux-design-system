import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'
import fluxLogo from '../public/flux.svg'

addons.setConfig({
  theme: create({
    base: 'light',
    brandImage: fluxLogo,
    brandTitle: 'Flux Design System',
    brandTarget: '_self',
    colorPrimary: '#323338',
    colorSecondary: '#323338',
    appBg: '#ffffff',
    appContentBg: '#ffffff',
    appBorderColor: '#e4e4e7',
    appBorderRadius: 5,
    barBg: '#ffffff',
    barTextColor: '#18181b',
    barHoverColor: '#ee1b78',
    barSelectedColor: '#323338',
    textColor: '#18181b',
    inputBg: '#ffffff',
    appHoverBg: '#efeff1',
    inputTextColor: '#18181b',
    fontBase: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontCode: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  }),
  sidebar: { showRoots: true },
})
