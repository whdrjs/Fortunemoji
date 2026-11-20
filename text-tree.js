'use strict';

function mountTextTree(output) {
  const width = 66;
  const height = 43;
  const center = 32;
  const rows = Array.from({length: height}, () => Array(width).fill(null));
  const moving = [];
  const snow = [];
  const noise = (x, y) => ((x * 97 + y * 137 + x * y * 31) % 101) / 101;

  function put(x, y, glyph, color, motion) {
    if (x >= 0 && x < width && y >= 0 && y < height) rows[y][x] = {glyph, color, motion};
  }

  // Draw the skyline and snowy ground with fixed-width characters.
  for (let x = 0; x < width; x++) {
    const building = Math.floor(x / 5);
    const roof = 25 + Math.floor(noise(building, 9) * 9);
    for (let y = roof; y < 38; y++) {
      const window = (x + 1) % 3 === 0 && y % 2 === 0;
      if (window && noise(x, y) > .47) put(x, y, ':', 'window');
      else if (y === roof || noise(x, y) > .59) put(x, y, y === roof ? '_' : '.', 'skyline');
    }
    for (let y = 38; y < 43; y++) {
      if (noise(x, y) > .23 + (y - 38) * .15) put(x, y, y % 2 ? '·' : '_', 'ground');
    }
  }

  const palette = ['pine-dark', 'pine', 'pine-light'];
  const needles = ['^', 'x', '+', ':', '*', 'v'];
  for (let y = 7; y <= 35; y++) {
    const depth = y - 7;
    const spread = Math.floor(depth * .77 + (depth % 7) * .56) + 1;
    for (let dx = -spread; dx <= spread; dx++) {
      const x = center + dx;
      const grain = noise(x, y);
      if (Math.abs(dx) > spread - 2 && grain < .36) continue;
      const shade = grain > .79 ? 2 : dx > spread * .38 && grain < .64 ? 0 : 1;
      put(x, y, needles[Math.floor(grain * needles.length)], palette[shade], 'needle');
    }
  }

  for (const [y, span] of [[13, 6], [20, 12], [27, 18], [33, 22]]) {
    for (let dx = -span; dx <= span; dx += 2) {
      const row = y + Math.round(2 * (1 - (dx / span) ** 2) + dx / span);
      put(center + dx, row, dx % 4 ? ':' : 'o', 'gold', 'light');
    }
  }
  for (const [x, y] of [[31, 10], [36, 16], [26, 17], [40, 22], [29, 23], [20, 25], [44, 28], [35, 30], [25, 31], [14, 33]]) {
    put(x, y, 'o', 'berry', 'light');
    put(x + 1, y, '*', 'berry', 'light');
  }
  ['  +  ', '  |  ', '--*--', ' /|\\ ', '  +  '].forEach((line, y) => {
    [...line].forEach((glyph, x) => {
      if (glyph !== ' ') put(center + x - 2, y + 2, glyph, 'gold', 'light');
    });
  });
  for (let y = 36; y <= 39; y++) {
    for (let x = center - 2; x <= center + 2; x++) put(x, y, '|', 'wood');
  }
  for (const [x, y, color] of [[18, 36, 'berry'], [26, 38, 'gold'], [37, 37, 'gift-blue'], [45, 36, 'berry']]) {
    const gift = ['  ><  ', '[==|=]', '[++|+]', '[__|_]'];
    gift.forEach((line, dy) => [...line].forEach((glyph, dx) => {
      if (glyph !== ' ') put(x + dx, y + dy, glyph, glyph === '|' || glyph === '>' || glyph === '<' ? 'gold' : color);
    }));
  }

  const fragment = document.createDocumentFragment();
  rows.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (!cell) {
        const air = document.createTextNode(' ');
        fragment.append(air);
        if (noise(x, y) > .28) snow.push({node: air, x, y});
        return;
      }
      const span = document.createElement('span');
      span.className = cell.color;
      span.textContent = cell.glyph;
      fragment.append(span);
      if (cell.motion) moving.push({...cell, span, x, y});
    });
    if (y < height - 1) fragment.append('\n');
  });
  output.replaceChildren(fragment);

  let timer;
  let active = false;
  let frame = 0;
  let inputPulse = 0;
  function draw() {
    for (const cell of moving) {
      const {span, x, y, motion, glyph} = cell;
      const phase = ((frame - (y + x) + 256) % 16 + 16) % 16;
      const lit = phase < (inputPulse ? 5 : 2);
      const next = motion === 'light' ? (lit ? '*' : glyph) :
        lit ? '*' : phase < 5 ? needles[(x + y + frame) % needles.length] : glyph;
      if (span.textContent !== next) span.textContent = next;
      span.classList.toggle('lit', lit);
    }
    for (const {node, x, y} of snow) {
      const offset = (y - Math.floor(frame / (x % 2 + 1)) + 4096) % 43;
      const next = noise(x, offset) > .955 ? (x % 6 ? '·' : '+') : ' ';
      if (node.data !== next) node.data = next;
    }
    frame++;
    if (inputPulse) inputPulse--;
  }
  function sync() {
    clearInterval(timer);
    if (active && !document.hidden && GlyphArt.motionEnabled()) timer = setInterval(draw, 90);
  }
  return {
    show() {
      active = true;
      if (frame === 0 && GlyphArt.motionEnabled()) draw();
      window.addEventListener('glyph-motion-change', sync);
      document.addEventListener('visibilitychange', sync);
      sync();
    },
    hide() {
      active = false;
      window.removeEventListener('glyph-motion-change', sync);
      document.removeEventListener('visibilitychange', sync);
      sync();
    },
    play() {
      inputPulse = 7;
    }
  };
}
