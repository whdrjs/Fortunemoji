'use strict';

window.GlyphArt = (() => {
  const width = 544;
  const height = 420;
  const columns = 96;
  const rows = 62;
  const cellWidth = width / columns;
  const cellHeight = height / rows;
  const resultColumns = 144;
  const resultRows = 96;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let motionOverride;
  const motionEnabled = () => motionOverride ?? !reduceMotion.matches;
  const motionChange = () => window.dispatchEvent(new Event('glyph-motion-change'));
  reduceMotion.addEventListener('change', motionChange);
  const flakes = Array.from({length: 105}, (_, index) => ({
    x: noise(index, 3) * width,
    y: noise(index, 7) * height,
    speed: 13 + noise(index, 29) * 46,
    phase: noise(index, 41) * Math.PI * 2,
    large: index % 7 === 0
  }));
  const lights = [[272,53],[248,123],[287,142],[231,164],[292,177],[257,204],
    [318,220],[204,232],[272,238],[229,265],[315,264],[347,285],[184,292],[251,308],[294,317]];
  const glyphs = '·:+×01*▯';
  const clamp = value => Math.max(0, Math.min(1, value));

  function noise(x, y, seed = 0) {
    const value = Math.sin(x * 127.1 + y * 311.7 + seed * 19.3) * 43758.5453;
    return value - Math.floor(value);
  }

  // Draw a tonal sketch offscreen. The visible canvas only receives characters.
  function makeScene(scene, emojis = [], detailed = false) {
    const sketch = document.createElement('canvas');
    sketch.width = width;
    sketch.height = height;
    const ctx = sketch.getContext('2d', {willReadFrequently: true});
    const blue = '#264463';
    const edge = '#6989a8';
    const ice = '#b6cbdb';
    const shadow = '#14243a';
    const amber = '#a15a28';
    const light = '#ffbd64';

    function polygon(color, points) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(...points[0]);
      for (const point of points.slice(1)) ctx.lineTo(...point);
      ctx.closePath();
      ctx.fill();
    }
    function rect(color, x, y, w, h) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }
    function glow(x, y, radius, color) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'transparent');
      rect(gradient, x - radius, y - radius, radius * 2, radius * 2);
    }
    function windowPane(x, y, w, h, warm) {
      rect(warm ? amber : blue, x, y, w, h);
      rect(warm ? light : ice, x + 4, y + 4, w - 8, h - 8);
      rect(shadow, x + w / 2 - 2, y, 4, h);
      rect(shadow, x, y + h / 2 - 2, w, 4);
    }

    function ellipse(color, x, y, rx, ry) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    function floor() {
      glow(272, 317, 251, '#294362');
      ellipse('#152641', 272, 371, 246, 29);
      for (let i = 0; i < 5; i++) {
        ellipse(i % 2 ? '#182945' : '#2e4667', 272 + i * 4, 355 + i * 10, 213 - i * 18, 2);
      }
    }
    function star(x, y, radius) {
      glow(x, y, radius * 2.5, '#906024');
      polygon('#ffd887', Array.from({length: 10}, (_, index) => {
        const angle = -Math.PI / 2 + index * Math.PI / 5;
        const distance = radius * (index % 2 ? .39 : 1);
        return [x + Math.cos(angle) * distance, y + Math.sin(angle) * distance];
      }));
    }
    function gift(x, y, w, h, box, ribbon) {
      rect(box, x, y, w, h);
      rect(box, x - 3, y - 4, w + 6, h * .25 + 2);
      rect(ribbon, x + w * .44, y - 6, w * .14, h + 6);
      rect(ribbon, x, y + h * .23, w, 4);
      ellipse(ribbon, x + w * .34, y - 9, w * .15, 5);
      ellipse(ribbon, x + w * .65, y - 9, w * .15, 5);
    }

    if (scene === 'tree') {
      floor();
      for (let i = 0; i < 15; i++) {
        const x = i * 37;
        const top = 241 + noise(i, 8) * 67;
        rect('#122038', x, top, 32, 349 - top);
        for (let y = top + 8; y < 338; y += 12) {
          for (let k = 0; k < 3; k++) {
            if (noise(x + k, y) > .56) rect('#726647', x + k * 9 + 3, y, 3, 5);
          }
        }
      }
      rect('#715040', 255, 311, 34, 48);
      const tiers = [
        [104, 337, 138, '#317d56'], [88, 303, 113, '#3b9363'],
        [71, 259, 92, '#408f63'], [55, 217, 72, '#479d69'],
        [53, 167, 48, '#519e71']
      ];
      for (const [top, bottom, wings, color] of tiers) {
        const branch = [[272,top],[272-wings*.30,bottom-49],[272-wings,bottom-6],
          [272-wings*.58,bottom],[272-wings*.31,bottom-4],[272,bottom+4],
          [272+wings*.32,bottom-5],[272+wings*.67,bottom],[272+wings,bottom-10],
          [272+wings*.35,bottom-54]];
        polygon(color, branch);
        polygon('#246947', [[272,top],[272+wings*.35,bottom-54],[272+wings,bottom-10],
          [272+wings*.67,bottom],[272+wings*.32,bottom-5],[272,bottom+4],[284,bottom-34]]);
        ctx.strokeStyle = '#bead62';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(272 - wings * .66, bottom - 26);
        ctx.quadraticCurveTo(263, bottom + 9, 272 + wings * .70, bottom - 26);
        ctx.stroke();
      }
      const ornaments = [[248,123],[287,142],[231,164],[292,177],[257,204],[318,220],
        [204,232],[272,238],[229,265],[315,264],[347,285],[184,292],[251,308],[294,317]];
      ornaments.forEach(([x, y], index) => {
        const gold = index % 3 === 1;
        const color = gold ? '#fff0aa' : '#f2676b';
        glow(x, y, 18, gold ? '#aa852f' : '#833846');
        ellipse(color, x, y, 6, 7);
      });
      for (let i = 0; i < 54; i++) {
        const y = 113 + noise(i, 12) * 220;
        const x = 272 + (noise(i, 52) - .5) * (y - 66) * .88;
        ellipse(i % 3 ? '#ddedd0' : '#ffd87e', x, y, 2.3, 2.3);
      }
      gift(172, 345, 33, 30, '#bf5356', '#efd075');
      gift(220, 351, 47, 39, '#be8144', '#f1c575');
      gift(296, 347, 33, 35, '#477cb0', '#f0cd83');
      gift(342, 351, 29, 25, '#ae4d58', '#f3cb6d');
      star(272, 53, 26);
    } else if (scene === 'bus') {
      floor();
      rect('#516883', 68, 170, 8, 180);
      rect('#516883', 220, 170, 8, 180);
      polygon(ice, [[55,171],[76,152],[219,152],[244,171],[235,181],[55,181]]);
      rect(blue, 81, 192, 133, 99);
      rect(shadow, 87, 200, 121, 81);
      rect(edge, 91, 286, 109, 10);
      rect(edge, 97, 298, 7, 28);
      rect(edge, 184, 298, 7, 28);
      rect(edge, 109, 196, 31, 55);
      rect(ice, 117, 205, 14, 5);
      rect(ice, 117, 218, 14, 3);
      polygon('#51769a', [[264,213],[485,213],[504,233],[504,332],[264,332]]);
      rect(amber, 275, 227, 206, 61);
      for (let x = 282; x < 477; x += 38) windowPane(x, 234, 35, 47, true);
      rect('#253e60', 270, 290, 230, 39);
      ellipse(shadow, 310, 333, 21, 20);
      ellipse(shadow, 460, 333, 21, 20);
      ellipse(ice, 310, 333, 8, 7);
      ellipse(ice, 460, 333, 8, 7);
      glow(500, 307, 31, '#977a30');
      rect('#ffe3a2', 488, 303, 13, 10);
    } else if (scene === 'home') {
      floor();
      glow(407, 154, 113, '#84604c');
      ellipse('#fab47d', 400, 157, 43, 39);
      polygon(shadow, [[98,204],[242,103],[382,204],[382,351],[98,351]]);
      polygon(blue, [[97,203],[242,108],[382,204],[382,345],[97,345]]);
      polygon(ice, [[71,208],[241,92],[404,207],[394,218],[241,112],[83,219]]);
      rect(blue, 313, 112, 28, 64);
      rect(ice, 308, 107, 38, 8);
      windowPane(216, 148, 48, 42, true);
      windowPane(128, 235, 70, 62, true);
      windowPane(282, 235, 72, 62, true);
      rect(amber, 221, 247, 46, 99);
      rect(light, 229, 254, 30, 47);
      rect(ice, 91, 344, 296, 7);
      polygon('#877057', [[224,350],[265,350],[301,401],[192,401]]);
    } else if (scene === 'emojis') {
      glow(272, 214, 243, '#223950');
      const centers = [[179,129],[365,129],[179,290],[365,290]];
      for (let i = 0; i < centers.length; i++) {
        const [x, y] = centers[i];
        glow(x, y, 82, i % 2 ? '#754b32' : '#254b7c');
        ellipse('#294467', x, y, 68, 62);
        ellipse('#0c1d34', x, y, 62, 56);
        ctx.font = '68px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
        ctx.fillStyle = '#e1eaff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emojis[i], x, y, 94);
      }
    } else {
      // A depth layer for the night, snow, and neighboring buildings.
      glow(271, 231, 265, '#1d3c5a');
      polygon(shadow, [[16,334],[16,179],[80,123],[126,159],[126,329]]);
      polygon(blue, [[19,181],[78,120],[131,159],[124,169],[78,133]]);
      windowPane(39, 207, 21, 29, false);
      windowPane(79, 181, 19, 29, false);
      polygon(shadow, [[424,338],[424,166],[482,138],[517,163],[517,339]]);
      polygon(blue, [[418,171],[481,132],[522,161],[516,173],[481,146]]);
      polygon(blue, [[4,362],[96,333],[421,324],[540,356],[540,382],[4,388]]);
      polygon(edge, [[8,363],[119,347],[408,341],[539,365],[453,366],[383,357],[135,360],[34,373]]);
      polygon(shadow, [[0,389],[115,374],[404,366],[544,379],[544,420],[0,420]]);
      polygon(blue, [[13,398],[121,386],[391,380],[534,393],[464,396],[346,390],[98,398],[30,407]]);

      // Gabled roof and two-story shop front.
      polygon(blue, [[105,141],[190,92],[409,49],[409,331],[105,347]]);
      polygon(shadow, [[409,49],[458,103],[458,324],[409,331]]);
      polygon(ice, [[89,143],[186,82],[411,39],[469,100],[458,109],[409,55],[190,98],[106,150]]);
      polygon(edge, [[94,151],[191,97],[408,53],[408,61],[193,108],[103,159]]);
      windowPane(166, 138, 28, 45, false);
      windowPane(227, 119, 34, 51, false);
      windowPane(300, 99, 35, 56, false);
      windowPane(365, 79, 28, 61, false);
      windowPane(425, 120, 20, 40, false);
      polygon(shadow, [[105,228],[409,181],[409,331],[105,347]]);
      polygon(ice, [[94,231],[127,196],[412,152],[459,184],[440,199],[409,187],[103,243]]);
      polygon(edge, [[96,234],[412,180],[443,195],[436,205],[103,247]]);
      for (let i = 0; i < 14; i++) {
        const x = 123 + i * 19;
        const y = 205 - i * 3.05;
        polygon(blue, [[x,y],[x + 6,y - 1],[x - 8,y + 23],[x - 14,y + 24]]);
      }
      windowPane(129, 250, 72, 65, true);
      windowPane(213, 235, 76, 72, true);
      windowPane(301, 222, 44, 79, true);
      rect(amber, 358, 211, 39, 124);
      rect(light, 365, 218, 25, 108);
      rect('#5b382b', 369, 264, 17, 45);
      rect(light, 382, 270, 5, 5);
      polygon(amber, [[354,330],[397,326],[422,351],[332,354]]);
      polygon('#7a623f', [[352,350],[412,346],[456,398],[273,398]]);

      // Posts, glowing sign-sized windows, and the lamp at the curb.
      rect(edge, 112, 243, 5, 100);
      rect(edge, 346, 211, 5, 124);
      rect(blue, 405, 197, 7, 138);
      polygon(ice, [[96,343],[411,325],[459,321],[453,331],[107,354]]);
      glow(477, 133, 65, '#80512d');
      rect(edge, 476, 141, 4, 200);
      rect(amber, 464, 130, 29, 12);
      polygon(light, [[464,130],[470,119],[486,119],[493,130],[486,142],[470,142]]);
      rect(ice, 468, 340, 19, 4);

    }

    const pixels = ctx.getImageData(0, 0, width, height).data;
    const cells = [];
    const gridColumns = detailed ? resultColumns : columns;
    const gridRows = detailed ? resultRows : rows;
    for (let row = 0; row < gridRows; row++) {
      for (let column = 0; column < gridColumns; column++) {
        const x = (column + .5) * width / gridColumns;
        const y = (row + .5) * height / gridRows;
        const offset = (Math.floor(y) * width + Math.floor(x)) * 4;
        const [red, green, blue, alpha] = pixels.subarray(offset, offset + 4);
        const intensity = Math.max(red, green, blue) * alpha / 65025;
        const snowThreshold = detailed ? .995 : scene === 'tree' ? .963 : .989;
        const snow = noise(column, row, 9) > snowThreshold && y < 55 * cellHeight;
        const foliage = scene === 'tree' && green > blue * 1.18 && green > red * 1.18;
        if (intensity < .07 && !snow) continue;
        const density = foliage ? .54 : detailed && intensity > .2 ? .36 : .25;
        if (noise(column, row, 1) > density + intensity * .94 && !snow) continue;
        const color = snow ? '#e1eaff' :
          red > blue * 1.16 ? (green < red * .60 && blue > green * .8 ? '#ff7181' : (intensity > .64 ? '#ffd178' : '#ca8949')) :
          green > blue * 1.16 ? (intensity > .72 ? '#d7f6b0' : '#78dda4') :
          intensity > .48 ? '#d7e7fb' : '#6aa8ef';
        const detail = noise(column, row, 2);
        cells.push({
          x, y, color,
          sparkle: snow || (scene === 'tree' && intensity > .8),
          opacity: snow ? .32 + detail * .50 : clamp(.16 + intensity * 1.05 + (foliage ? .11 + detail * .18 : 0)),
          glyph: snow ? (detail > .86 ? '+' : '·') :
            foliage ? '·:*+×'[Math.floor(detail * 5)] :
              glyphs[Math.min(glyphs.length - 1, Math.floor(detail * (2 + intensity * 6)))]
        });
      }
    }
    return cells;
  }

  const waveCells = [];
  for (let row = -25; row <= 25; row++) {
    for (let column = 0; column < columns; column++) {
      const chance = noise(column, row, 5);
      if (chance > .79 - Math.abs(row) * .012) continue;
      const x = (column + .5) * cellWidth;
      const edgeDistance = Math.abs(x / width - .5) * 2;
      const ribbon = .72 + .28 * Math.cos(row * .72);
      const strength = (.34 + .66 * Math.exp(-Math.abs(row) * .063)) * ribbon;
      const tone = noise(column, row, 6);
      waveCells.push({
        x, row, edgeDistance, strength,
        color: tone > .58 ? '#d7e9ff' : '#6aabff',
        opacity: (.45 + chance * .71) * strength,
        glyph: glyphs[Math.floor(noise(column, row, 7) * (tone > .5 ? 8 : 3))]
      });
    }
  }

  const scenes = new Map();
  function mount(canvas, mode, scene = 'cafe', emojis = []) {
    let cells;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let start;
    let elapsed = 0;
    let lastTick;
    let backdrop;
    let doorCells;
    let onScreen = mode !== 'about';
    let lastPaint = -Infinity;
    let active = false;
    let slot = 0;
    let progress = mode === 'reading' ? 1 : 0;
    const baseScene = mode === 'tree';
    const detailed = mode === 'result';

    const glyphFont = detailed ? '5.8px ui-monospace, monospace' : '8px ui-monospace, monospace';

    function sceneCells() {
      if (cells) return cells;
      const key = baseScene ? 'tree' : scene;
      if (key === 'emojis') return cells = makeScene(key, emojis, detailed);
      const cacheKey = detailed ? `${key}:detailed` : key;
      if (!scenes.has(cacheKey)) scenes.set(cacheKey, makeScene(key, [], detailed));
      return cells = scenes.get(cacheKey);
    }

    function paintCells(layer, sceneGlyphs) {
      layer.font = glyphFont;
      layer.textAlign = 'center';
      layer.textBaseline = 'middle';
      for (const cell of sceneGlyphs) {
        layer.fillStyle = cell.color;
        layer.globalAlpha = cell.opacity;
        layer.fillText(cell.glyph, cell.x, cell.y);
      }
    }

    function draw() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h || !ctx) return;
      const ratio = Math.min(devicePixelRatio || 1, detailed ? 3 : 2);
      if (canvas.width !== Math.round(w * ratio) || canvas.height !== Math.round(h * ratio)) {
        canvas.width = Math.round(w * ratio);
        canvas.height = Math.round(h * ratio);
        backdrop = undefined;
      }
      ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.font = glyphFont;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const pulse = mode === 'wave' ? Math.sin(progress * Math.PI) : 0;
      const reveal = mode === 'reading' ? progress : 0;
      if (mode === 'wave' || mode === 'reading') {
        for (const cell of waveCells) {
          const {x, row, edgeDistance} = cell;
          const distance = Math.abs(x / width - (slot + .5) / 4);
          const ripple = pulse * Math.exp(-distance * 5) * Math.sin(x * .068 - progress * 11 + row * .12);
          const spread = .105 + .94 * Math.pow(edgeDistance, 1.42);
          const y = height / 2 + row * cellHeight * spread + Math.sin(x * .014 + row * .24) * (1 + edgeDistance * 9) + ripple * 38;
          const drift = mode === 'reading' && motionEnabled() ?
            Math.sin(x * .025 + row * .22 - elapsed * 3) * (4 + edgeDistance * 8) : 0;
          ctx.fillStyle = cell.color;
          ctx.globalAlpha = clamp(cell.opacity * (1 - reveal * clamp((x / width - .24) * 1.42)) + Math.abs(ripple) * cell.strength * .5);
          ctx.fillText(cell.glyph, x, y + drift);
        }
      }

      if (mode !== 'wave') {
        const cells = sceneCells();
        if (mode === 'reading') {
          for (const cell of cells) {
            const fraction = cell.x / width;
            const visible = clamp((fraction + reveal * .87 - .84) * 3) * .88;
            if (visible <= 0) continue;
            ctx.fillStyle = cell.color;
            ctx.globalAlpha = cell.opacity * visible;
            ctx.fillText(cell.glyph, cell.x, cell.y);
          }
        } else {
          if (!backdrop) {
            backdrop = document.createElement('canvas');
            backdrop.width = canvas.width;
            backdrop.height = canvas.height;
            const layer = backdrop.getContext('2d');
            layer.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
            paintCells(layer, cells);
          }
          ctx.globalAlpha = 1;
          ctx.drawImage(backdrop, 0, 0, width, height);
        }
      }

      if (mode === 'about') {
        doorCells ??= cells.filter(({x, y, color}) =>
          (x > 357 && x < 400 && y > 210 && y < 332 ||
           x > 330 && x < 422 && y >= 332 && y < 371) && ['#ffd178', '#ca8949'].includes(color));
        ctx.fillStyle = '#ffe2a5';
        ctx.globalAlpha = motionEnabled() ? .10 + .24 * (1 - Math.cos(elapsed * Math.PI * 2 / 5)) / 2 : .19;
        for (const {x, y, glyph} of doorCells) ctx.fillText(glyph, x, y);
      }
      if (baseScene) drawSnow(flakes.length);
      if (baseScene) drawLights();
      ctx.globalAlpha = 1;
    }

    function drawSnow(count) {
      ctx.fillStyle = '#ebf4ff';
      for (let i = 0; i < count; i++) {
        const flake = flakes[i];
        const x = flake.x + Math.sin(elapsed * .9 + flake.phase) * (flake.large ? 20 : 12);
        const y = (flake.y + elapsed * flake.speed) % (height + 16) - 8;
        ctx.font = flake.large ? '14px monospace' : '11px monospace';
        ctx.globalAlpha = flake.large ? .72 : .29 + flake.speed / 155;
        ctx.fillText(flake.large ? '+' : '·', x, y);
      }
    }

    function drawLights() {
      const pulse = Math.sin(progress * Math.PI);
      lights.forEach(([x, y], index) => {
        const wave = (1 + Math.sin(elapsed * 3.7 - y * .05 + index * 1.2)) / 2;
        const nearSlot = Math.max(0, 1 - Math.abs(x / width - (slot + .5) / 4) * 3.5);
        const brightness = .15 + wave * .66 + pulse * nearSlot * .45;
        ctx.fillStyle = index % 4 === 2 ? '#ff8596' : '#ffe6a4';
        ctx.globalAlpha = clamp(brightness);
        ctx.font = index === 0 ? '20px monospace' : '13px monospace';
        ctx.fillText(wave > .75 ? '✦' : '+', x, y);
      });
    }

    function tick(now) {
      if (!active || !motionEnabled() || document.hidden) {
        animationFrame = undefined;
        lastTick = undefined;
        return;
      }
      elapsed += Math.min(now - (lastTick ?? now), 80) / 1000;
      lastTick = now;
      if (start !== undefined) progress = clamp((elapsed - start) / (mode === 'reading' ? 1.05 : .82));
      if (now - lastPaint >= 32) {
        draw();
        lastPaint = now;
      }
      animationFrame = requestAnimationFrame(tick);
    }

    function reconcileMotion() {
      if (motionEnabled() && !document.hidden && active && onScreen && mode !== 'result') {
        if (animationFrame === undefined) animationFrame = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(animationFrame);
        animationFrame = undefined;
        lastTick = undefined;
        if (!motionEnabled() && mode === 'reading') progress = 1;
        if (!motionEnabled() && baseScene) progress = 0;
        if (active) draw();
      }
    }

    function play(position = 0) {
      slot = position;
      start = elapsed;
      progress = 0;
      reconcileMotion();
    }

    const intersection = mode === 'about' ? new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      reconcileMotion();
    }) : null;
    const resize = new ResizeObserver(() => { if (active) draw(); });
    return {
      show() {
        active = true;
        resize.observe(canvas);
        intersection?.observe(canvas);
        window.addEventListener('glyph-motion-change', reconcileMotion);
        document.addEventListener('visibilitychange', reconcileMotion);
        if (mode === 'reading') play();
        else reconcileMotion();
        draw();
      },
      hide() {
        active = false;
        resize.disconnect();
        intersection?.disconnect();
        if (intersection) onScreen = false;
        window.removeEventListener('glyph-motion-change', reconcileMotion);
        document.removeEventListener('visibilitychange', reconcileMotion);
        reconcileMotion();
        progress = 0;
      },
      paintStill(target, x, y, w, h) {
        target.save();
        target.translate(x, y);
        target.scale(w / width, h / height);
        paintCells(target, sceneCells());
        target.restore();
      },
      play
    };
  }

  return {
    mount,
    motionEnabled,
    setMotion(enabled) {
      motionOverride = enabled;
      motionChange();
    }
  };
})();
