# Font Files

Place your P22 Mackinac Pro font files in this directory.

## Required Files

For the font to work properly, you'll need the following font files:

- `P22MackinacPro-Regular.woff2` (or `.woff` / `.ttf`)
- `P22MackinacPro-Bold.woff2` (or `.woff` / `.ttf`)

## Font Formats

The CSS is configured to support multiple formats in this order of preference:
1. WOFF2 (best compression, modern browsers)
2. WOFF (good compression, wider support)
3. TTF (fallback, universal support)

## Where to Get the Font

P22 Mackinac Pro is a commercial font. You can purchase it from:
- P22 Type Foundry: https://www.p22.com/
- Or your font licensing provider

## File Naming

Make sure the font files are named exactly as shown above. If your font files have different names, you'll need to update the `@font-face` declarations in `src/index.css`.



