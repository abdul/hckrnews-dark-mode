const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const assert = require('node:assert/strict');
const test = require('node:test');

const css = readFileSync(join(__dirname, '../popup.css'), 'utf8');

function declarationsFor(selector) {
  const match = css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`));
  assert(match, `Missing ${selector} rule`);

  return Object.fromEntries(
    match[1]
      .split(';')
      .map((declaration) => declaration.trim())
      .filter(Boolean)
      .map((declaration) => {
        const separatorIndex = declaration.indexOf(':');
        return [
          declaration.slice(0, separatorIndex).trim(),
          declaration.slice(separatorIndex + 1).trim(),
        ];
      }),
  );
}

function cssLengthToPx(value, viewportWidth) {
  const px = value.match(/^(\d+(?:\.\d+)?)px$/);
  if (px) return Number(px[1]);

  const vw = value.match(/^(\d+(?:\.\d+)?)vw$/);
  if (vw) return (Number(vw[1]) / 100) * viewportWidth;

  const min = value.match(/^min\(([^,]+),\s*([^\)]+)\)$/);
  if (min) {
    return Math.min(
      cssLengthToPx(min[1].trim(), viewportWidth),
      cssLengthToPx(min[2].trim(), viewportWidth),
    );
  }

  const max = value.match(/^max\(([^,]+),\s*([^\)]+)\)$/);
  if (max) {
    return Math.max(
      cssLengthToPx(max[1].trim(), viewportWidth),
      cssLengthToPx(max[2].trim(), viewportWidth),
    );
  }

  throw new Error(`Unsupported length expression: ${value}`);
}

function usedPopupWidthAt(viewportWidth) {
  const body = declarationsFor('body');
  const width = body.width ? cssLengthToPx(body.width, viewportWidth) : viewportWidth;
  const minWidth = body['min-width'] ? cssLengthToPx(body['min-width'], viewportWidth) : 0;
  return Math.max(width, minWidth);
}

test('popup stays at least 320px wide in a narrow Chrome action popup viewport', () => {
  assert.ok(
    usedPopupWidthAt(323) >= 320,
    'viewport-relative popup sizing can shrink the settings UI below its usable minimum width',
  );
});
