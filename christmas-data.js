export const christmasEveDate = '2026-12-24';
export const defaultFortuneDate = '2026-12-25';

export const wishes = Object.freeze({
  invitation: {category: '관계', label: '그 사람이 먼저 만나자고 했으면', event: '마음에 둔 사람이 먼저 만나자고 제안한다'},
  reunion: {category: '재회', label: '뜸했던 사람이랑 다시 연락이 닿았으면', event: '한동안 뜸했던 사람과 안부를 주고받는다'},
  friends: {category: '친구', label: '친구들이랑 두고두고 써먹을 얘기 하나 생겼으면', event: '친구들과 나중에도 꺼내 말할 사건이 생긴다'},
  rest: {category: '휴식', label: '아무도 안 부르고 집에서 실컷 쉬었으면', event: '집에서 보낼 시간을 마련하고 새 약속이나 방해 없이 쉰다'},
  outing: {category: '외출', label: '크리스마스답게 제대로 놀러 갔으면', event: '평소와 다른 크리스마스 외출을 실제로 한다'},
  gift: {category: '뜻밖의 행운', label: '예상도 못 한 선물 하나 받았으면', event: '기대하지 않았던 선물이나 호의를 실제로 받는다'}
});

export const sceneLabels = {
  cafe: '문자로 그린 카페', bus: '문자로 그린 정류장',
  home: '문자로 그린 집', tree: '문자로 그린 크리스마스 트리',
  emojis: '입력한 이모지 네 개를 문자로 그린 장면'
};

const split = new Intl.Segmenter('ko', {granularity: 'grapheme'});
const emojiCluster = /^(?:\p{Regional_Indicator}{2}|[#*0-9]\uFE0F?\u20E3|(?=[\s\S]*\p{Extended_Pictographic})[\p{Extended_Pictographic}\p{Emoji_Modifier}\uFE0E\uFE0F\u200D\u{E0020}-\u{E007F}]+)$/u;
const emojiInText = /\p{Extended_Pictographic}|\p{Regional_Indicator}|\p{Emoji_Modifier}|\u20E3/u;

export function isFortuneDate(value) {
  return value === christmasEveDate || value === defaultFortuneDate;
}

export function fortuneDateLabel(value) {
  const [, month, day] = value.split('-').map(Number);
  return `${month}월 ${day}일`;
}

export function normalizeFortuneEmoji(emoji) {
  return emoji.replace(/[\uFE0E\uFE0F\p{Emoji_Modifier}]/gu, '');
}

export function isSingleEmoji(value) {
  return typeof value === 'string' && value.length <= 64 && emojiCluster.test(value) &&
    split.segment(value).containing(0)?.segment === value;
}

export function hasDuplicateEmoji(emojis) {
  return new Set(emojis.map(normalizeFortuneEmoji)).size !== emojis.length;
}

export function hasWish(id) {
  return typeof id === 'string' && Object.hasOwn(wishes, id);
}

export function isFortuneInput(input) {
  return isFortuneDate(input?.date) && hasWish(input.wish) && Array.isArray(input.emojis) &&
    input.emojis.length === 4 && input.emojis.every(isSingleEmoji) && !hasDuplicateEmoji(input.emojis);
}

export function wishChance({date, wish, emojis}) {
  const key = [date, wish, ...emojis.map(normalizeFortuneEmoji).sort()].join('|');
  let hash = 2166136261;
  for (const char of key) hash = Math.imul(hash ^ char.codePointAt(0), 16777619);
  return 29 + (hash >>> 0) % 65;
}

export function chanceTier(chance) {
  if (chance >= 70) return 'high';
  return chance >= 50 ? 'medium' : 'low';
}

function cleanText(value, max) {
  if (typeof value !== 'string' || !value.trim() || value.length > max || emojiInText.test(value)) return null;
  return value.trim().replace(/\s+/g, ' ');
}

export function readGeneratedScene(value, input) {
  const headline = cleanText(value?.headline, 58);
  const scene = cleanText(value?.scene, 260);
  const reason = cleanText(value?.chance_reason, 90);
  const visualCue = cleanText(value?.visual_cue, 80);
  const time = value?.observed_at;
  if (!headline || !scene || !reason || !visualCue ||
      typeof time !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time) ||
      value.wish_chance !== wishChance(input) ||
      typeof value.art !== 'string' || !Object.hasOwn(sceneLabels, value.art)) return null;

  const sentences = scene.split(/[.!?。！？]+/).map(line => line.replace(/[“”"'\s]/g, ''))
    .filter(Boolean);
  if (new Set(sentences).size !== sentences.length) return null;

  return {
    headline, scene, observed_at: time, wish_chance: value.wish_chance,
    chance_reason: reason, art: value.art, visual_cue: visualCue
  };
}
