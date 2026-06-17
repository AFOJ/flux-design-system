import fs from 'node:fs'
import { styleText } from 'node:util'

import { FigmaTokenExtractor } from './FigmaTokenExtractor.ts'

const INPUT_PATH = './scripts/figma-tokens.json'
const OUTPUT_PATH = './scripts/tokens.css'

try {
  const figmaTokens = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf8')) as unknown
  const extractor = new FigmaTokenExtractor(figmaTokens)

  fs.writeFileSync(OUTPUT_PATH, extractor.generateCSS())
  console.log(
    styleText(['bold', 'green'], `Tokens extracted to ${OUTPUT_PATH}`),
  )
} catch (ex: unknown) {
  console.error(styleText(['bold', 'red'], 'Failed to extract Figma tokens.'))

  if (ex instanceof Error) {
    console.error(styleText('red', ex.message))
  } else {
    console.error(styleText('red', String(ex)))
  }

  process.exitCode = 1
}
