# Token Extractor

The token extractor converts Figma Tokens JSON into CSS custom properties for
Flux Design System themes and responsive values. It is split into a small CLI entrypoint and
a reusable `FigmaTokenExtractor` class so the same conversion logic can be used
from scripts, tests, or future tooling.

## Quick Start

Run the extractor from the project root:

```bash
npm run build:design-tokens
```

Copy the generated CSS into `src/global.css` when the design-token output should
be applied to the component library.

## Public API

```ts
import { FigmaTokenExtractor } from './FigmaTokenExtractor.ts'

const extractor = new FigmaTokenExtractor(figmaTokens)

const allCss = extractor.generateCSS()
const themeSpecificCss = extractor.generateThemeCSS('booker')
const responsiveCss = extractor.generateResponsiveTokensCSS()
```

### Constructor

```ts
new FigmaTokenExtractor(tokens, options)
```

`tokens` must be a parsed JSON object. The class validates this at runtime and
throws if the value is not object-like.

## Conversion Rules

- Themes are discovered from `$metadata.tokenSetOrder`.
- Only token sets prefixed with `Mapped/` are emitted as theme blocks.
- The first mapped theme shares the `:root` selector and its own
  `[data-theme="..."]` selector.
- Later mapped themes are emitted as `[data-theme="..."]` blocks.
- `Responsive/Desktop` and `Responsive/Mobile` are emitted in a shared `:root`
  responsive section.
- Token names are lowercased and joined into CSS custom-property names with
  hyphens.
- Figma label helper entries containing the skipped-label marker are ignored.

## Reference Resolution

Token references such as `{Colour.White.1000}` are resolved recursively. The
extractor searches, in order:

1. The current mapped theme, such as `Mapped/booker`.
2. The current alias colour set, such as `Alias colours/booker`.
3. `Primitives/Default`.

References can point to other references. The extractor tracks
`visitedReferences` during each resolution chain to prevent circular references
from recursing forever. It is primarily a correctness guard, not a broad cache:
each top-level token resolution gets a fresh set.

## Value Normalisation

- Known font weights are converted to CSS weight numbers.
- Known font families are converted to configured CSS font stacks.
- Unknown font families fall back to `"Family Name", sans-serif`.
- Numeric `number` tokens become `rem` values by default.
- Numeric values whose property name includes a configured pixel key stay in
  `px`.
- Numeric values whose property name includes a configured unitless key stay
  unitless.
- Unresolved references are emitted unchanged so missing token links are visible
  in generated CSS.

## Testing

Run the extractor tests:

```bash
npm test
```
