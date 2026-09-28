#!/usr/bin/env bash
# Regenerates src/fonts/ (run: pnpm fonts:subset). The output is committed; builds don't run this.
# Each face = Fontsource's "latin" file cut down to the characters Hungarian text uses
# + a tiny "hu" supplement with Ő ő Ű ű cut from "latin-ext". Keep TEXT_UNICODES in sync with
# the unicode-range values in src/styles/tokens.css.
set -euo pipefail

FONTTOOLS="fonttools==4.65.0"
BROTLI="brotli==1.2.0"
TEXT_UNICODES="U+0020-007E,U+00A0-00FF,U+2010-2027,U+2030-203A,U+20AC"
HU_UNICODES="U+0150,U+0151,U+0170,U+0171"
FEATURES="kern,liga,lnum,pnum,tnum"
OUT=src/fonts
rm -f "$OUT"/*.woff2
mkdir -p "$OUT"

faces=(
  "cormorant-garamond:500-normal"
  "cormorant-garamond:500-italic"
  "source-sans-3:400-normal"
  "source-sans-3:600-normal"
)

for face in "${faces[@]}"; do
  family="${face%%:*}"
  style="${face##*:}"
  src="node_modules/@fontsource/${family}/files"
  uvx --from "$FONTTOOLS" --with "$BROTLI" pyftsubset "${src}/${family}-latin-${style}.woff2" \
    --unicodes="$TEXT_UNICODES" --flavor=woff2 --layout-features="$FEATURES" \
    --output-file="${OUT}/${family}-latin-${style}.woff2"
  uvx --from "$FONTTOOLS" --with "$BROTLI" pyftsubset "${src}/${family}-latin-ext-${style}.woff2" \
    --unicodes="$HU_UNICODES" --flavor=woff2 --layout-features="$FEATURES" \
    --output-file="${OUT}/${family}-hu-${style}.woff2"
done

cp node_modules/@fontsource/cormorant-garamond/LICENSE "${OUT}/LICENSE-cormorant-garamond.txt"
cp node_modules/@fontsource/source-sans-3/LICENSE "${OUT}/LICENSE-source-sans-3.txt"
ls -l "$OUT"
