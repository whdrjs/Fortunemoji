'use strict';

// Scene presets for the local design preview.
const samples = [
  {
    emoji: '☕ 👀 🛋️ 💬',
    title: '커피 한 잔 하자는 말에\n결국 집을 나섭니다.',
    story: '소파에 누워 있는데 메시지가 옵니다. “잠깐 커피?” 창밖은 어둡고, 오늘은 집에만 있을 생각이었는데. 어느새 코트를 입고 골목 끝 카페로 향하고 있네요.',
    art: 'cafe',
    artLabel: '푸른 문자 사이로 따뜻한 불빛이 새어 나오는 밤의 카페'
  },
  {
    emoji: '🚌 ❄️ ☕ 🧣', title: '버스 두 대를\n그냥 보냈다.',
    story: '눈 오는 정류장에서 목도리 하나를 둘이 나눠 맸다. 커피가 다 식을 때까지 둘 다 버스 오는 쪽을 안 봤다.',
    art: 'bus', artLabel: '문자로 그린 눈 내리는 버스 정류장'
  },
  {
    emoji: '🏠 🥂 🛏️ 🌅', title: '한 잔만 한다더니\n우리 집에서 해 뜸.',
    story: '자정에 막차 시간을 찾아봤고, 한 시엔 이불을 세 장 더 꺼냈다. 크리스마스 아침 메뉴는 만장일치로 라면.',
    art: 'home', artLabel: '문자로 그린 해 뜨는 크리스마스 아침의 집'
  }
];
const get = id => document.getElementById(id);
const input = get('emoji-entry');
const dateInput = get('fortune-date');
const startButton = get('start');
const picker = get('emoji-picker');
const pickerButton = get('picker-open');
const choices = [
  ['🎄','트리'], ['🎁','선물'], ['❄️','눈송이'], ['✨','반짝임'], ['☃️','눈사람'], ['🎅','산타'],
  ['☕','커피'], ['🍰','케이크'], ['🧣','목도리'], ['🚌','버스'], ['🏠','집'], ['🎧','헤드폰'],
  ['🌙','달'], ['💫','별'], ['💬','말풍선'], ['💌','편지'], ['❤️','하트'], ['😂','웃는 얼굴'],
  ['🥹','울먹이는 얼굴'], ['👀','눈'], ['🐱','고양이'], ['🐶','강아지'], ['🎵','음표'], ['🍀','네잎클로버']
];

function setPickerOpen(open) {
  picker.hidden = !open;
  pickerButton.setAttribute('aria-expanded', String(open));
  pickerButton.textContent = open ? '이모지 목록 닫기' : '이모지 고르기';
}
pickerButton.addEventListener('click', () => setPickerOpen(picker.hidden));
picker.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    setPickerOpen(false);
    pickerButton.focus();
  }
});
for (const [emoji, name] of choices) {
  const choice = document.createElement('button');
  choice.type = 'button';
  choice.textContent = emoji;
  choice.setAttribute('aria-label', name);
  choice.addEventListener('click', () => {
    applyInput(input.value + emoji);
    if (entered.length === 4) {
      setPickerOpen(false);
      (startButton.disabled ? input : startButton).focus();
    }
  });
  picker.append(choice);
}
const feedback = get('entry-hint');
const split = new Intl.Segmenter('ko', {granularity:'grapheme'});
const emojiCluster = /^(?:\p{Regional_Indicator}{2}|[#*0-9]\uFE0F?\u20E3|(?=[\s\S]*\p{Extended_Pictographic})[\p{Extended_Pictographic}\p{Emoji_Modifier}\uFE0E\uFE0F\u200D\u{E0020}-\u{E007F}]+)$/u;
let entered = [];
const views = ['home', 'waiting', 'result', 'about', 'privacy'];
// The layout preview keeps the waiting screen open and can use sample input.
const layoutPreview = new URLSearchParams(location.search).get('layout-preview') === '1';
const previewFortune = {emojis: ['❤️', '😩', '🍽️', '💀'], date: defaultFortuneDate};
const previewNav = get('layout-preview-nav');
const previewLinks = previewNav.querySelectorAll('a');
previewNav.hidden = !layoutPreview;
document.querySelectorAll('.monetization-slot').forEach(slot => { slot.hidden = !layoutPreview; });
const waitingProgress = get('waiting-progress');
const privacyLink = get('privacy-link');
const privacyReturn = get('privacy-return');
const inputArt = mountTextTree(get('input-signal'));
let readingArt;
let aboutArt;
let resultArt;

let transitionFrame;
const fortuneKey = 'fourmoji-last-fortune';
const maxInputLength = 4096;
const maxStoredLength = 4096;

function isSingleEmoji(value) {
  return typeof value === 'string' && value.length <= 64 && emojiCluster.test(value) &&
    split.segment(value).containing(0)?.segment === value;
}

function readLastFortune() {
  try {
    const raw = sessionStorage.getItem(fortuneKey);
    if (!raw || raw.length > maxStoredLength) return null;
    const saved = JSON.parse(raw);
    const emojis = Array.isArray(saved) ? saved : saved?.emojis;
    if (!Array.isArray(emojis) || emojis.length !== 4 || !emojis.every(isSingleEmoji)) return null;
    return {emojis, date: isFortuneDate(saved?.date) ? saved.date : defaultFortuneDate};
  } catch {
    return null;
  }
}
function hasDuplicateEmoji(emojis) {
  return new Set(emojis.map(normalizeFortuneEmoji)).size !== emojis.length;
}
function canStartFortune() {
  return entered.length === 4 && !hasDuplicateEmoji(entered) && isFortuneDate(dateInput.value);
}
const lastFortune = readLastFortune();
let submitted = lastFortune && !hasDuplicateEmoji(lastFortune.emojis) ? lastFortune : null;
function applyInput(value) {
  const oversized = value.length > maxInputLength;
  const parts = oversized ? [] : Array.from(split.segment(value), item => item.segment).filter(item => item.trim());
  const valid = oversized ? entered : parts.filter(isSingleEmoji);
  const previous = entered.join('');
  entered = valid.slice(0,4);
  const clean = entered.join('');
  if (clean !== previous) inputArt.play(Math.max(0, entered.length - 1));
  if (input.value !== clean) input.value = clean;
  feedback.textContent = oversized ? '붙여넣은 내용이 너무 길어요. 이모지 네 개만 넣어주세요.' :
    hasDuplicateEmoji(entered) ? '장난하냐? 같은 이모지가 있잖아. 겹친 거 빼고 네 개 다시 골라.' :
    valid.length > 4 ? '이모지 중 처음 네 개만 남겼어요.' :
    parts.length !== valid.length ? '이모지만 넣어주세요.' : '';
  input.setAttribute('aria-invalid', String(Boolean(feedback.textContent)));
  get('entry-wrap').classList.toggle('invalid', Boolean(feedback.textContent));
  get('counter').textContent = entered.length + ' / 4';
  get('clear').hidden = !entered.length;
  startButton.disabled = !canStartFortune();
  pickerButton.disabled = entered.length === 4;
  if (entered.length === 4) setPickerOpen(false);
}
function makeText(tag, classname, value) {
  const node = document.createElement(tag);
  node.className = classname;
  node.textContent = value;
  return node;
}
function paintCard(node, sample) {
  const art = document.createElement('div');
  art.className = 'art result-art';
  const canvas = document.createElement('canvas');
  if (sample.artLabel) {
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', sample.artLabel);
  } else {
    canvas.setAttribute('aria-hidden', 'true');
  }
  art.append(canvas);

  const content = document.createElement('div');
  content.className = 'stage-content result-copy';
  const meta = document.createElement('div');
  meta.className = 'result-meta';
  if (sample.date) {
    const date = makeText('time', 'result-date', fortuneDateLabel(sample.date));
    date.dateTime = sample.date;
    meta.append(date);
  }
  meta.append(makeText('p', 'post-emojis', sample.emoji));
  content.append(
    meta,
    makeText('h2', 'post-title', sample.title),
    makeText('p', 'story-body', sample.story)
  );
  node.replaceChildren(content, art);
  return GlyphArt.mount(canvas, 'result', sample.art, sample.emojis);
}
const shareStoryButton = get('share-story');
const saveStoryButton = get('save-story');
const shareNote = get('share-note');
const homeLinkField = get('home-link-value');
const homeLink = new URL('./', location.href).href;
let storyFile;
let sharePreparation;

function resetStoryShare() {
  sharePreparation = null;
  storyFile = null;
  shareStoryButton.disabled = true;
  saveStoryButton.disabled = true;
  shareNote.textContent = '';
  homeLinkField.hidden = true;
}

function prepareStoryShare(sample, art) {
  const preparation = makeStoryImage(sample, art.paintStill);
  sharePreparation = preparation;
  preparation.then(file => {
    if (sharePreparation !== preparation) return;
    storyFile = file;
    shareStoryButton.disabled = false;
    saveStoryButton.disabled = false;
  }).catch(() => {
    if (sharePreparation === preparation) {
      shareNote.textContent = '이미지를 만들지 못했어요. 결과를 새로고침해 주세요.';
    }
  });
}

function downloadStory(file) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

saveStoryButton.addEventListener('click', () => {
  if (storyFile) downloadStory(storyFile);
});
shareStoryButton.addEventListener('click', async () => {
  const file = storyFile;
  if (!file) return;
  const payload = {files: [file]};
  if (navigator.share && navigator.canShare?.(payload)) {
    shareNote.textContent = '공유 메뉴에서 Instagram 스토리를 찾아보세요.';
    try {
      await navigator.share(payload);
      return;
    } catch (error) {
      if (storyFile !== file) return;
      if (error.name === 'AbortError') {
        shareNote.textContent = '';
        return;
      }
    }
  }
  downloadStory(file);
  shareNote.textContent = '인스타그램 스토리에서 다운로드한 이미지를 골라 올려보세요.';
});
get('copy-home').addEventListener('click', async () => {
  const preparation = sharePreparation;
  try {
    await navigator.clipboard.writeText(homeLink);
    if (sharePreparation !== preparation) return;
    homeLinkField.hidden = true;
    shareNote.textContent = '메인 링크를 복사했어요. 스토리의 링크 스티커에 붙여넣으세요.';
  } catch {
    if (sharePreparation !== preparation) return;
    homeLinkField.value = homeLink;
    homeLinkField.hidden = false;
    homeLinkField.focus();
    homeLinkField.select();
    shareNote.textContent = '선택된 주소를 복사해 주세요.';
  }
});
const supportDialog = get('support-dialog');
get('support-open').addEventListener('click', () => supportDialog.showModal());

function renderRoute(change) {
  const hash = location.hash.slice(1);
  const card = /^card-([1-3])$/.exec(hash);
  cancelAnimationFrame(transitionFrame);
  resetStoryShare();
  if (supportDialog.open) supportDialog.close();
  const fortuneInput = submitted ?? (layoutPreview ? previewFortune : null);
  if ((hash === 'waiting' || hash === 'result') && !fortuneInput) {
    location.replace('#input');
    return;
  }
  const view = card ? 'result' : /^privacy-(?:result|card-[1-3])$/.test(hash) ? 'privacy' : views.includes(hash) ? hash : 'home';
  get('site-footer').hidden = view !== 'home' && view !== 'result';
  if (view === 'result') privacyLink.href = card ? '#privacy-card-' + card[1] : '#privacy-result';
  if (view === 'home') privacyLink.href = '#privacy';
  if (view === 'privacy') {
    const sampleRoute = hash.startsWith('privacy-card-');
    const fromResult = sampleRoute || (hash === 'privacy-result' && fortuneInput);
    privacyReturn.href = fromResult ? '#' + hash.slice('privacy-'.length) : '#home';
    privacyReturn.textContent = fromResult ? '점괘 결과로 돌아가기' : '메인으로 돌아가기';
  }
  previewLinks.forEach(link => {
    if (link.hash === '#' + view) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  inputArt.hide();
  readingArt?.hide();
  aboutArt?.hide();
  resultArt?.hide();
  views.forEach(key => get(key+'-view').hidden = key !== view);
  if (view === 'home') inputArt.show();
  if (view === 'about') {
    get('about-link').setAttribute('aria-current', 'page');
    aboutArt ??= GlyphArt.mount(get('about-cafe'), 'about', 'cafe');
    aboutArt.show();
  } else get('about-link').removeAttribute('aria-current');
  if (view === 'waiting') {
    const fortune = makeFortune(fortuneInput.emojis, fortuneInput.date);
    readingArt = GlyphArt.mount(get('reading-signal'), 'reading', fortune.art, fortune.emojis);
    readingArt.show();
    get('waiting-emojis').replaceChildren(...fortuneInput.emojis.map(emoji => makeText('span', 'signal-emoji', emoji)));
    waitingProgress.value = layoutPreview ? .6 : 0;
    if (!layoutPreview) {
      const started = performance.now();
      const duration = GlyphArt.motionEnabled() ? 1100 : 0;
      function advance(now) {
        if (location.hash !== '#waiting') return;
        if (now - started >= duration) {
          waitingProgress.value = 1;
          location.replace('#result');
        } else {
          waitingProgress.value = (now - started) / duration;
          transitionFrame = requestAnimationFrame(advance);
        }
      }
      transitionFrame = requestAnimationFrame(advance);
    }
  }
  if (view === 'result') {
    const sample = card ? samples[Number(card[1])-1] : makeFortune(fortuneInput.emojis, fortuneInput.date);
    resultArt = paintCard(get('story-card'), sample);
    resultArt.show();
    prepareStoryShare(sample, resultArt);
  }
  if(change) {
    const title = view === 'home' ? get('compose-title') : get(view+'-view').querySelector('h1, h2');
    title.setAttribute('tabindex','-1');
    title.focus({preventScroll:true});
    if (hash === 'input') title.scrollIntoView({block: 'start'});
    else window.scrollTo(0,0);
  }
}
input.addEventListener('input',event => { if(!event.isComposing) applyInput(input.value); });
input.addEventListener('compositionend',() => applyInput(input.value));
input.addEventListener('keydown',event => {if(event.key === 'Enter' && !startButton.disabled){ event.preventDefault();startButton.click(); }});
get('clear').addEventListener('click',() => { applyInput('');input.focus(); });
startButton.addEventListener('click', () => {
  if (!canStartFortune()) return;
  submitted = {emojis: entered.slice(), date: dateInput.value};
  try { sessionStorage.setItem(fortuneKey, JSON.stringify(submitted)); } catch {}
  location.hash = 'waiting';
});
const motionToggle = get('motion-toggle');
function updateMotionButton() {
  const enabled = GlyphArt.motionEnabled();
  const label = enabled ? '문자 그림 멈추기' : '문자 그림 움직이기';
  motionToggle.setAttribute('aria-label', label);
  motionToggle.title = label;
  get('motion-icon').setAttribute('d', enabled ? 'M9 5v14m6-14v14' : 'm9 5 10 7-10 7z');
}
motionToggle.addEventListener('click', () => GlyphArt.setMotion(!GlyphArt.motionEnabled()));
window.addEventListener('glyph-motion-change', updateMotionButton);
updateMotionButton();
get('help-open').addEventListener('click',() => get('guide').showModal());
get('help-close').addEventListener('click',() => get('guide').close());
get('guide').addEventListener('click',e => {
  if(e.target !== get('guide')) return;
  const r=get('guide').getBoundingClientRect();
  if(e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom) get('guide').close();
});
addEventListener('hashchange',() => renderRoute(true));
dateInput.value = lastFortune?.date || defaultFortuneDate;
dateInput.addEventListener('change', () => {
  startButton.disabled = !canStartFortune();
});
applyInput(lastFortune?.emojis.join('') || '');
renderRoute(false);
