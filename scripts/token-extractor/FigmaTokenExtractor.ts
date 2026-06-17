export type TokenPrimitiveValue = string | number | boolean

export type TokenLeaf = {
  value: TokenPrimitiveValue
  type?: string
}

export type TokenBranch = Record<string, unknown>

export type RemConversionConfig = {
  baseFontSize?: number
  decimalPrecision?: number
}

export type FigmaTokenExtractorOptions = {
  fontWeightMap?: Readonly<Record<string, string>>
  fontFamilyMap?: Readonly<Record<string, string>>
  remConversion?: RemConversionConfig
  unitlessNumericKeys?: readonly string[]
  pixelNumericKeys?: readonly string[]
  indentation?: string
  globalCssPath?: string
}

const DEFAULT_FONT_WEIGHT_MAP = {
  thin: '100',
  'extra light': '200',
  light: '300',
  regular: '400',
  medium: '500',
  'semi bold': '600',
  semibold: '600',
  bold: '700',
  'extra bold': '800',
  black: '900',
} as const

const DEFAULT_FONT_FAMILY_MAP = {
  inter: '"Inter", system-ui, sans-serif',
  'open sans': '"Open Sans", sans-serif',
  'mencken-std-head-narrow': '"mencken-std-head-narrow", serif',
} as const

const MAPPED_TOKEN_SET_PREFIX = 'Mapped/'
const RESPONSIVE_THEME_KEY = 'NOT-IMPORTANT'
const SKIPPED_TOKEN_MARKER = '\u2198\uFE0E'

/**
 * Converts Figma token JSON into CSS custom properties.
 *
 * The extractor owns token traversal, alias resolution, and CSS value
 * normalisation. Filesystem concerns are intentionally left to the CLI so the
 * class can be reused with a pre-parsed token source.
 */
export class FigmaTokenExtractor {
  readonly #tokens: TokenBranch
  readonly #fontWeightMap: Readonly<Record<string, string>>
  readonly #fontFamilyMap: Readonly<Record<string, string>>
  readonly #remConversion: Required<RemConversionConfig>
  readonly #unitlessNumericKeys: readonly string[]
  readonly #pixelNumericKeys: readonly string[]
  readonly #indentation: string
  readonly #globalCssPath: string

  constructor(tokens: unknown, options: FigmaTokenExtractorOptions = {}) {
    if (!FigmaTokenExtractor.#isRecord(tokens)) {
      throw new TypeError('Figma tokens must be a JSON object.')
    }

    this.#tokens = tokens
    this.#fontWeightMap = options.fontWeightMap ?? DEFAULT_FONT_WEIGHT_MAP
    this.#fontFamilyMap = options.fontFamilyMap ?? DEFAULT_FONT_FAMILY_MAP
    this.#remConversion = {
      baseFontSize: options.remConversion?.baseFontSize ?? 16,
      decimalPrecision: options.remConversion?.decimalPrecision ?? 2,
    }
    this.#unitlessNumericKeys = options.unitlessNumericKeys ?? [
      'weight',
      'line-height',
    ]
    this.#pixelNumericKeys = options.pixelNumericKeys ?? ['border']
    this.#indentation = options.indentation ?? '    '
    this.#globalCssPath = options.globalCssPath ?? 'src/global.css'
  }

  /**
   * Converts a pixel value to rem using a base font size and precision.
   */
  static pxToRem(px: number | string, config: RemConversionConfig = {}): number {
    const { baseFontSize = 16, decimalPrecision = 2 } = config
    const exponent = 10 ** decimalPrecision
    return Math.round((Number(px) / baseFontSize) * exponent) / exponent
  }

  /**
   * Builds the complete CSS payload for all theme and responsive tokens.
   */
  generateCSS(): string {
    let cssContent = `/* To use, copy the content of this into ${this.#globalCssPath} */\n\n`

    this.#getThemeKeys().forEach((theme, index) => {
      const selector =
        index === 0
          ? `:root, [data-theme="${theme}"]`
          : `[data-theme="${theme}"]`

      cssContent += `${selector} {\n`
      cssContent += this.generateThemeCSS(theme)
      cssContent += '\n}\n'
    })

    cssContent += `\n${this.generateResponsiveTokensCSS()}\n`

    return cssContent
  }

  /**
   * Generates CSS custom property declarations for one mapped theme.
   */
  generateThemeCSS(theme: string): string {
    const cssLines: string[] = []

    this.#getThemeCategories(theme).forEach((category) => {
      const themeCategory = this.#getTokenSet(`${MAPPED_TOKEN_SET_PREFIX}${theme}`)[
        category
      ]

    if (FigmaTokenExtractor.#isRecord(themeCategory)) {
        this.#processTokenCategory(
          themeCategory,
          `--${category.toLowerCase()}`,
          theme,
          cssLines,
        )
      }
    })

    return cssLines.join('\n')
  }

  /**
   * Generates CSS custom properties for responsive desktop and mobile tokens.
   */
  generateResponsiveTokensCSS(): string {
    let cssContent = '/* Responsive Tokens */\n:root {\n'
    const cssLines: string[] = []

    const desktopTokens = this.#tokens['Responsive/Desktop']
    if (FigmaTokenExtractor.#isRecord(desktopTokens)) {
      this.#processTokenCategory(
        desktopTokens,
        '--res-desktop',
        RESPONSIVE_THEME_KEY,
        cssLines,
      )
    }

    const mobileTokens = this.#tokens['Responsive/Mobile']
    if (FigmaTokenExtractor.#isRecord(mobileTokens)) {
      this.#processTokenCategory(
        mobileTokens,
        '--res-mobile',
        RESPONSIVE_THEME_KEY,
        cssLines,
      )
    }

    cssContent += cssLines.join('\n')
    cssContent += '\n}'

    return cssContent
  }

  static #isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }

  static #isTokenLeaf(value: unknown): value is TokenLeaf {
    return (
      FigmaTokenExtractor.#isRecord(value) &&
      'value' in value &&
      FigmaTokenExtractor.#isTokenPrimitiveValue(value.value)
    )
  }

  static #isTokenPrimitiveValue(value: unknown): value is TokenPrimitiveValue {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    )
  }

  #getThemeCategories(themeKey: string): string[] {
    return Object.keys(this.#getTokenSet(`${MAPPED_TOKEN_SET_PREFIX}${themeKey}`))
  }

  #getThemeKeys(): string[] {
    const metadata = this.#tokens.$metadata

    if (!FigmaTokenExtractor.#isRecord(metadata)) {
      return []
    }

    const tokenSetOrder = metadata.tokenSetOrder

    if (!Array.isArray(tokenSetOrder)) {
      return []
    }

    return tokenSetOrder
      .filter((key): key is string => typeof key === 'string')
      .filter((key) => key.startsWith(MAPPED_TOKEN_SET_PREFIX))
      .map((key) => key.replace(MAPPED_TOKEN_SET_PREFIX, ''))
  }

  #getTokenSet(key: string): TokenBranch {
    const tokenSet = this.#tokens[key]
    return FigmaTokenExtractor.#isRecord(tokenSet) ? tokenSet : {}
  }

  /**
   * Resolves token references like "{Scale.X}" across the theme, alias, and
   * primitive token sets. References can point to other references, so this
   * follows them until a concrete value is found.
   */
  #resolveTokenValue(
    tokenValue: TokenPrimitiveValue,
    themeContext: string,
    visitedReferences = new Set<string>(),
  ): TokenPrimitiveValue {
    if (typeof tokenValue !== 'string' || !tokenValue.startsWith('{')) {
      return tokenValue
    }

    if (visitedReferences.has(tokenValue)) {
      return tokenValue
    }

    visitedReferences.add(tokenValue)

    const pathSegments = tokenValue.replace(/[{}]/g, '').split('.')
    const searchRoots = [
      this.#getTokenSet(`${MAPPED_TOKEN_SET_PREFIX}${themeContext}`),
      this.#getTokenSet(`Alias colours/${themeContext}`),
      this.#getTokenSet('Primitives/Default'),
    ]

    for (const root of searchRoots) {
      const token = this.#findNestedToken(root, pathSegments)

      if (FigmaTokenExtractor.#isTokenLeaf(token)) {
        return this.#resolveTokenValue(
          token.value,
          themeContext,
          visitedReferences,
        )
      }
    }

    return tokenValue
  }

  #findNestedToken(root: TokenBranch, pathSegments: readonly string[]): unknown {
    let current: unknown = root

    for (const segment of pathSegments) {
      if (!FigmaTokenExtractor.#isRecord(current) || !(segment in current)) {
        return undefined
      }

      current = current[segment]
    }

    return current
  }

  #processTokenCategory(
    categoryObj: TokenBranch,
    prefix: string,
    currentTheme: string,
    cssLines: string[],
  ): void {
    for (const [tokenName, token] of Object.entries(categoryObj)) {
      if (tokenName.includes(SKIPPED_TOKEN_MARKER)) {
        continue
      }

      const cssPropertyName = this.#buildCssPropertyName(prefix, tokenName)

      if (!FigmaTokenExtractor.#isTokenLeaf(token)) {
        if (FigmaTokenExtractor.#isRecord(token)) {
          this.#processTokenCategory(
            token,
            cssPropertyName,
            currentTheme,
            cssLines,
          )
        }

        continue
      }

      const resolvedValue = this.#resolveTokenValue(token.value, currentTheme)
      const cssValue = this.#normaliseCssValue(
        resolvedValue,
        token.type,
        cssPropertyName,
      )

      cssLines.push(`${this.#indentation}${cssPropertyName}: ${cssValue};`)
    }
  }

  #buildCssPropertyName(prefix: string, tokenName: string): string {
    return `${prefix}-${tokenName.toLowerCase().replace(/\s+/g, '-')}`
  }

  /**
   * Normalises resolved token values into CSS-safe output: font names and
   * weights are mapped, dimensions gain px/rem units, and configured numeric
   * values such as line heights stay unitless.
   */
  #normaliseCssValue(
    resolvedValue: TokenPrimitiveValue,
    tokenType: string | undefined,
    cssPropertyName: string,
  ): TokenPrimitiveValue | string {
    let cssValue = resolvedValue

    if (cssPropertyName.includes('weight')) {
      const lookupKey = String(cssValue).toLowerCase().trim()
      cssValue = this.#fontWeightMap[lookupKey] ?? cssValue
    }

    if (cssPropertyName.includes('font-family')) {
      const lookupKey = String(cssValue).toLowerCase().trim()
      cssValue = this.#fontFamilyMap[lookupKey] ?? `"${cssValue}", sans-serif`
    }

    const shouldRemainUnitless = this.#unitlessNumericKeys.some((key) =>
      cssPropertyName.includes(key),
    )

    if (
      tokenType !== 'number' ||
      typeof cssValue !== 'number' ||
      !Number.isFinite(cssValue) ||
      shouldRemainUnitless
    ) {
      return cssValue
    }

    const shouldRemainPixels = this.#pixelNumericKeys.some((key) =>
      cssPropertyName.includes(key),
    )

    if (shouldRemainPixels) {
      return `${cssValue}px`
    }

    return `${FigmaTokenExtractor.pxToRem(cssValue, this.#remConversion)}rem`
  }
}
