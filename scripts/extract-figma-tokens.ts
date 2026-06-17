import fs from 'node:fs'

import { FigmaTokenExtractor } from './FigmaTokenExtractor.ts'

const INPUT_PATH = './scripts/figma-tokens.json'
const OUTPUT_PATH = './scripts/tokens.css'

const figmaTokens = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf8')) as unknown
const extractor = new FigmaTokenExtractor(figmaTokens)

fs.writeFileSync(OUTPUT_PATH, extractor.generateCSS())
console.log(`Tokens extracted to ${OUTPUT_PATH}`)
