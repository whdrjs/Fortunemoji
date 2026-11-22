import {fortuneDateLabel} from './christmas.mjs';

const storyFont = 'system-ui, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans CJK KR", sans-serif';
const storyGraphemes = new Intl.Segmenter('ko', {granularity: 'grapheme'});

function wrapStoryText(ctx, text, maxWidth) {
  const lines = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (const word of paragraph.trim().split(/\s+/)) {
      const next = line ? line + ' ' + word : word;
      if (ctx.measureText(next).width <= maxWidth) {
        line = next;
        continue;
      }
      if (line) lines.push(line);
      line = '';
      for (const {segment} of storyGraphemes.segment(word)) {
        if (line && ctx.measureText(line + segment).width > maxWidth) {
          lines.push(line);
          line = '';
        }
        line += segment;
      }
    }
    lines.push(line);
  }
  return lines;
}

export async function makeStoryImage(sample, paintArt) {
  await document.fonts?.ready;
  const card = document.createElement('canvas');
  card.width = 1080;
  card.height = 1920;
  const ctx = card.getContext('2d');
  const left = 92;
  const innerWidth = card.width - left * 2;
  const background = '#080d18';
  const ink = '#ecf3fc';
  const secondary = '#bacbdd';
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, card.width, card.height);
  ctx.textBaseline = 'top';

  // Keep the card content between the Story header and reply controls.
  function text(value, x, y, font, color) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(value, x, y);
  }
  text('Formoji', left, 236, `800 48px ${storyFont}`, ink);
  ctx.fillStyle = '#344256';
  ctx.fillRect(left, 309, innerWidth, 2);
  const label = sample.isPreview ? '예시 장면' : '미래 기록';
  const clock = sample.time ? ` ${sample.time}` : '';
  const date = sample.date ? `${label} · ${fortuneDateLabel(sample.date)}${clock}` : label;
  const metaFont = `500 36px ${storyFont}`;
  text(date, left, 343, metaFont, secondary);

  function layout(value, size, weight, color, availableHeight) {
    let rows;
    let lineHeight;
    let font;
    do {
      font = `${weight} ${size}px ${storyFont}`;
      ctx.font = font;
      rows = wrapStoryText(ctx, value, innerWidth);
      lineHeight = Math.ceil(size * 1.48);
      size -= 2;
    } while (rows.length * lineHeight > availableHeight && size >= 24);
    return {
      height: rows.length * lineHeight,
      draw(y) { rows.forEach((row, i) => text(row, left, y + i * lineHeight, font, color)); }
    };
  }

  const title = layout(sample.title, 72, 800, ink, 224);
  const story = layout(sample.story, 42, 500, secondary, sample.wishLabel ? 360 : 475);
  const titleY = 424;
  const storyY = titleY + title.height + 16;
  title.draw(titleY);
  story.draw(storyY);
  let artTop = storyY + story.height + 20;
  if (sample.wishLabel) {
    const wish = layout(sample.wishLabel, 36, 600, ink, 106);
    wish.draw(artTop);
    artTop += wish.height + 4;
    text(`성사 확률 ${sample.chance}% · 포모지 시뮬레이션 기준`, left, artTop, `600 32px ${storyFont}`, '#8cc3ff');
    artTop += 64;
  }
  const artHeight = Math.max(0, Math.min(innerWidth * 420 / 544, 1570 - artTop));
  const artWidth = artHeight * 544 / 420;
  if (artHeight) paintArt(ctx, (card.width - artWidth) / 2, artTop, artWidth, artHeight);

  ctx.fillStyle = '#344256';
  ctx.fillRect(left, 1590, innerWidth, 2);
  text('이모지 네 개로 보는 미래 장면', left, 1614, `500 36px ${storyFont}`, secondary);

  return new Promise((resolve, reject) => {
    card.toBlob(blob => {
      if (blob) resolve(new File([blob], `formoji-${sample.date || 'story'}.png`, {type:'image/png'}));
      else reject(new Error('PNG export failed'));
    }, 'image/png');
  });
}
