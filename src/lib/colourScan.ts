/**
 * Pure predicates the colour guard tests share (svgColorLiterals.test.ts, cssPalette.test.ts).
 * They find colours that bypass the design tokens: hex, rgb-function and hsl-function literals and CSS named colours.
 * Allowed everywhere: transparent, currentColor, inherit, none, unset, initial.
 */
const NAMED = [
  'white', 'black', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'gray', 'grey',
  'brown', 'cyan', 'magenta', 'silver', 'gold', 'navy', 'teal', 'lime', 'maroon', 'olive', 'aqua',
  'fuchsia', 'coral', 'crimson', 'indigo', 'violet', 'turquoise', 'salmon', 'khaki', 'tan', 'beige',
  'ivory', 'lavender', 'orchid', 'plum', 'tomato', 'wheat', 'snow', 'azure', 'darkgray', 'darkgrey',
  'lightgray', 'lightgrey', 'dimgray', 'darkblue', 'lightblue', 'darkgreen', 'lightgreen', 'darkred',
  'skyblue', 'steelblue', 'slategray', 'whitesmoke', 'gainsboro',
] as const
const NAME = NAMED.join('|')

/** Hex colour or functional-notation literal. */
export const colourLiterals = (src: string): string[] =>
  src.match(/#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b|\b(?:rgba?|hsla?)\(/g) ?? []

/** Named colours in colour-carrying attributes / style props of TS and TSX sources. */
export const namedColoursInSource = (src: string): string[] => {
  const re = new RegExp(
    `\\b(?:fill|stroke|stop-color|stopColor|color|backgroundColor|background|borderColor|outlineColor)\\s*[=:]\\s*\\{?\\s*[\`'"]\\s*(${NAME})\\b`,
    'gi',
  )
  return [...src.matchAll(re)].map((m) => m[1].toLowerCase())
}

/** Named colours inside colour-carrying CSS declarations (var(...) arguments are ignored). */
export const namedColoursInCss = (css: string): string[] => {
  const out: string[] = []
  const decl = /(?:^|[;{\s])((?:background|border|outline|box-shadow|text-shadow|fill|stroke|accent-color|caret-color|column-rule|text-decoration)[a-z-]*|color)\s*:\s*([^;}{]+)/gi
  const word = new RegExp(`(?:^|[^a-z-])(${NAME})(?![a-z-])`, 'gi')
  for (const m of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(decl)) {
    const value = m[2].replace(/var\([^)]*\)/g, '')
    for (const w of value.matchAll(word)) out.push(w[1].toLowerCase())
  }
  return out
}
