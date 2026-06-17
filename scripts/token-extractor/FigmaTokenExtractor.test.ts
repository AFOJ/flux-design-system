import { describe, expect, it } from '@jest/globals'

import { FigmaTokenExtractor } from './FigmaTokenExtractor.ts'

const createExtractor = (tokens: unknown): FigmaTokenExtractor =>
  new FigmaTokenExtractor(tokens)

describe('FigmaTokenExtractor', () => {
  it('converts pixel values to rem using the provided config', () => {
    expect(FigmaTokenExtractor.pxToRem(24)).toBe(1.5)
    expect(FigmaTokenExtractor.pxToRem('18', { decimalPrecision: 3 })).toBe(
      1.125,
    )
    expect(FigmaTokenExtractor.pxToRem(10, { baseFontSize: 10 })).toBe(1)
  })

  it('generates theme CSS with resolved aliases and normalized values', () => {
    const extractor = createExtractor({
      $metadata: {
        tokenSetOrder: ['Mapped/booker'],
      },
      'Mapped/booker': {
        Surface: {
          Colour: {
            Page: {
              value: '{Colour.White.1000}',
              type: 'color',
            },
            Accent: {
              value: '{Theme.Primary}',
              type: 'color',
            },
          },
          Border: {
            Radius: {
              value: 8,
              type: 'number',
            },
          },
          ['\u2198\uFE0E Label']: {
            value: 'ignored',
            type: 'string',
          },
        },
        Font: {
          Font: {
            Family: {
              Heading: {
                value: 'Inter',
                type: 'string',
              },
            },
            Weight: {
              Body: {
                value: 'Semi Bold',
                type: 'string',
              },
            },
          },
        },
      },
      'Alias colours/booker': {
        Theme: {
          Primary: {
            value: '#fc4c02',
            type: 'color',
          },
        },
      },
      'Primitives/Default': {
        Colour: {
          White: {
            '1000': {
              value: '#ffffff',
              type: 'color',
            },
          },
        },
      },
    })

    expect(extractor.generateThemeCSS('booker')).toBe(
      [
        '    --surface-colour-page: #ffffff;',
        '    --surface-colour-accent: #fc4c02;',
        '    --surface-border-radius: 8px;',
        '    --font-font-family-heading: "Inter", system-ui, sans-serif;',
        '    --font-font-weight-body: 600;',
      ].join('\n'),
    )
  })

  it('generates complete CSS for all themes and responsive tokens', () => {
    const extractor = createExtractor({
      $metadata: {
        tokenSetOrder: ['Mapped/booker', 'Mapped/venus'],
      },
      'Mapped/booker': {
        Surface: {
          Colour: {
            Page: {
              value: '#ffffff',
              type: 'color',
            },
          },
        },
      },
      'Mapped/venus': {
        Surface: {
          Colour: {
            Page: {
              value: '#f5f5f5',
              type: 'color',
            },
          },
        },
      },
      'Responsive/Desktop': {
        Spacing: {
          Md: {
            value: 16,
            type: 'number',
          },
        },
        Line: {
          Height: {
            Body: {
              value: 20,
              type: 'number',
            },
          },
        },
      },
      'Responsive/Mobile': {
        Font: {
          Size: {
            Body: {
              value: 14,
              type: 'number',
            },
          },
        },
      },
    })

    expect(extractor.generateCSS()).toBe(
      [
        '/* To use, copy the content of this into src/global.css */',
        '',
        ':root, [data-theme="booker"] {',
        '    --surface-colour-page: #ffffff;',
        '}',
        '[data-theme="venus"] {',
        '    --surface-colour-page: #f5f5f5;',
        '}',
        '',
        '/* Responsive Tokens */',
        ':root {',
        '    --res-desktop-spacing-md: 1rem;',
        '    --res-desktop-line-height-body: 20;',
        '    --res-mobile-font-size-body: 0.88rem;',
        '}',
        '',
      ].join('\n'),
    )
  })

  it('leaves unresolved and circular references unchanged', () => {
    const extractor = createExtractor({
      $metadata: {
        tokenSetOrder: ['Mapped/booker'],
      },
      'Mapped/booker': {
        Surface: {
          Colour: {
            Missing: {
              value: '{Colour.Does.Not.Exist}',
              type: 'color',
            },
            CircularA: {
              value: '{Surface.Colour.CircularB}',
              type: 'color',
            },
            CircularB: {
              value: '{Surface.Colour.CircularA}',
              type: 'color',
            },
          },
        },
      },
    })

    expect(extractor.generateThemeCSS('booker')).toBe(
      [
        '    --surface-colour-missing: {Colour.Does.Not.Exist};',
        '    --surface-colour-circulara: {Surface.Colour.CircularB};',
        '    --surface-colour-circularb: {Surface.Colour.CircularA};',
      ].join('\n'),
    )
  })
})
