import {
  christmasEveDate, defaultFortuneDate, fortuneDateLabel, hasDuplicateEmoji, hasWish,
  isFortuneDate, isSingleEmoji, readGeneratedScene, sceneLabels, wishes
} from './christmas-data.js';
import {makeChristmasPreview} from './christmas-preview.js?v=1';
import {makeStoryImage} from './story-share.js?v=5';

const get = id => document.getElementById(id);
const input = get('emoji-entry');
const dateInput = get('fortune-date');
const wishInput = get('christmas-wish');
for (const [id, {label}] of Object.entries(wishes)) {
  wishInput.add(new Option(label, id));
}
const localHost = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
const layoutPreview = localHost && new URLSearchParams(location.search).get('layout-preview') === '1';
get('ai-input-note').hidden = layoutPreview;
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
      const next = hasDuplicateEmoji(entered) ? input : hasWish(wishInput.value) ? startButton : wishInput;
      next.focus();
    }
  });
  picker.append(choice);
}
const feedback = get('entry-hint');
const split = new Intl.Segmenter('ko', {granularity:'grapheme'});
let entered = [];
const views = ['home', 'waiting', 'reading', 'result', 'about', 'privacy'];
// The layout preview keeps the waiting screen open and can use sample input.
const previewFortune = {emojis: ['☕', '🫠', '💬', '🚪'], date: defaultFortuneDate, wish: 'rest'};
const previewNav = get('layout-preview-nav');
const previewLinks = previewNav.querySelectorAll('a');
previewNav.hidden = !layoutPreview;
document.querySelectorAll('.monetization-slot > .slot-preview').forEach(preview => {
  preview.parentElement.hidden = !layoutPreview;
});
const waitingProgress = get('waiting-progress');
const privacyLink = get('privacy-link');
const privacyReturn = get('privacy-return');
const inputArt = mountTextTree(get('input-signal'));
let readingArt;
let aboutArt;
let resultArt;

let generationRequest;
const fortuneKey = 'fourmoji-last-fortune';
const maxInputLength = 4096;
const maxStoredLength = 4096;

function readLastFortune() {
  try {
    const raw = sessionStorage.getItem(fortuneKey);
    if (!raw || raw.length > maxStoredLength) return null;
    const saved = JSON.parse(raw);
    const emojis = Array.isArray(saved) ? saved : saved?.emojis;
    if (!Array.isArray(emojis) || emojis.length !== 4 ||
        !emojis.every(isSingleEmoji) || hasDuplicateEmoji(emojis)) return null;
    const date = isFortuneDate(saved?.date) ? saved.date : defaultFortuneDate;
    const wish = hasWish(saved?.wish) ? saved.wish : null;
    const input = {emojis, date, wish};
    const generated = wish ? readGeneratedScene(saved.generated, input) : null;
    return {...input, generated};
  } catch {
    return null;
  }
}
function canStartFortune() {
  return entered.length === 4 && !hasDuplicateEmoji(entered) && isFortuneDate(dateInput.value) && hasWish(wishInput.value);
}
let submitted = readLastFortune();
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
    hasDuplicateEmoji(entered) ? '같은 이모지가 있어요. 서로 다른 네 개를 넣어주세요.' :
    valid.length > 4 ? '처음 네 개만 남겼어요.' :
    parts.length !== valid.length ? '이모지만 입력할 수 있어요.' : '';
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
function generatedScene(input) {
  const result = input.generated;
  return {
    date: input.date, emojis: input.emojis, time: result.observed_at,
    title: result.headline, story: result.scene, wishLabel: wishes[input.wish].label,
    chance: result.wish_chance, chanceReason: result.chance_reason,
    art: result.art, artLabel: sceneLabels[result.art]
  };
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
    const clock = sample.time ? ` ${sample.time}` : '';
    const label = sample.isPreview ? '예시 장면' : '미래 기록';
    const date = makeText('time', 'result-date', `${label} · ${fortuneDateLabel(sample.date)}${clock}`);
    date.dateTime = sample.date + (sample.time ? `T${sample.time}` : '');
    meta.append(date);
  }
  content.append(
    meta,
    makeText('h2', 'post-title', sample.title),
    makeText('p', 'story-body', sample.story)
  );
  if (sample.wishLabel) {
    const wishResult = document.createElement('div');
    wishResult.className = 'wish-result';
    wishResult.append(
      makeText('p', 'wish-label', sample.wishLabel),
      makeText('p', 'wish-chance', `성사 확률 ${sample.chance}%`),
      makeText('p', 'wish-reason', sample.chanceReason),
      makeText('p', 'wish-basis', '포모지 시뮬레이션 기준')
    );
    content.append(wishResult);
  }
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
      shareNote.textContent = '이미지를 만들지 못했어요. 이 페이지를 새로고침해 주세요.';
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
    shareNote.textContent = '공유 메뉴에서 인스타그램 스토리를 선택하세요.';
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

function saveFortune() {
  try { sessionStorage.setItem(fortuneKey, JSON.stringify(submitted)); } catch {}
}

const waitingRetry = get('waiting-retry');
const waitingTitle = get('waiting-title');
const waitingStage = get('waiting-stage');

async function requestScene(input) {
  waitingTitle.textContent = `${fortuneDateLabel(input.date)}의 미래 장면을 만드는 중`;
  waitingStage.textContent = '최근 이모지 네 개에서 장면의 단서를 찾고 있어요.';
  waitingProgress.hidden = false;
  waitingProgress.removeAttribute('value');
  waitingRetry.hidden = true;

  const controller = new AbortController();
  generationRequest = controller;
  const timeout = setTimeout(() => controller.abort(), 15_000);
  let message = '장면을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';
  try {
    const response = await fetch('/api/fortune', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({date: input.date, wish: input.wish, emojis: input.emojis}),
      signal: controller.signal
    });
    if (response.ok) {
      const result = readGeneratedScene(await response.json(), input);
      if (result && generationRequest === controller && submitted === input && location.hash === '#waiting') {
        submitted = {...input, generated: result};
        saveFortune();
        generationRequest = null;
        location.replace('#reading');
        return;
      }
    } else if (response.status === 404 || response.status === 503) {
      message = '아직 미래 장면을 만들 수 없어요. 잠시 후 다시 들러주세요.';
    } else if (response.status === 429) {
      message = '잠깐 요청이 몰렸어요. 1분쯤 뒤에 다시 시도해 주세요.';
    }
  } catch {
    if (controller.signal.aborted) message = '응답이 오래 걸리고 있어요. 다시 시도해 주세요.';
  } finally {
    clearTimeout(timeout);
  }
  if (generationRequest !== controller || submitted !== input || location.hash !== '#waiting') return;
  generationRequest = null;
  waitingTitle.textContent = '미래 장면을 열지 못했어요';
  waitingStage.textContent = message;
  waitingProgress.hidden = true;
  waitingRetry.hidden = false;
}
waitingRetry.addEventListener('click', () => {
  if (submitted?.wish && !generationRequest) void requestScene(submitted);
});

const readingLines = get('reading-lines');
const readingNext = get('reading-next');
function revealBeat() {
  const beats = submitted.generated.beats;
  const index = readingLines.childElementCount;
  if (index === beats.length) {
    location.replace('#result');
    return;
  }
  readingLines.append(makeText('p', 'reading-line', beats[index]));
  readingNext.textContent = index + 1 === beats.length ? '내 예측 카드 보기' : '계속 듣기';
}
readingNext.addEventListener('click', revealBeat);

function renderRoute(change) {
  const hash = location.hash.slice(1);
  generationRequest?.abort();
  generationRequest = null;
  get('change-date').hidden = hash !== 'result' || layoutPreview;
  resetStoryShare();
  if (supportDialog.open) supportDialog.close();
  const fortuneInput = layoutPreview ? previewFortune : submitted;
  if ((hash === 'waiting' && !fortuneInput?.wish) ||
      (hash === 'reading' && !fortuneInput?.generated) ||
      (hash === 'result' && !layoutPreview && !fortuneInput?.generated) ||
      /^card-[1-3]$/.test(hash)) {
    location.replace('#input');
    return;
  }
  const view = /^privacy-(?:result|card-[1-3])$/.test(hash) ? 'privacy' : views.includes(hash) ? hash : 'home';
  get('site-footer').hidden = view !== 'home' && view !== 'result';
  if (view === 'result') privacyLink.href = '#privacy-result';
  if (view === 'home') privacyLink.href = '#privacy';
  if (view === 'privacy') {
    const fromResult = hash === 'privacy-result' && (layoutPreview || fortuneInput?.generated);
    privacyReturn.href = fromResult ? '#' + hash.slice('privacy-'.length) : '#home';
    privacyReturn.textContent = fromResult ? '미래 기록으로 돌아가기' : '메인으로 돌아가기';
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
    readingArt = GlyphArt.mount(get('reading-signal'), 'reading', 'emojis', fortuneInput.emojis);
    readingArt.show();
    get('waiting-emojis').replaceChildren(...fortuneInput.emojis.map(emoji => makeText('span', 'signal-emoji', emoji)));
    if (layoutPreview) {
      waitingTitle.textContent = '미래 장면 미리보기';
      waitingStage.textContent = '단서를 이어 사건을 구성하는 중';
      waitingProgress.hidden = false;
      waitingProgress.value = .6;
    } else if (fortuneInput.generated) {
      location.replace('#reading');
    } else {
      void requestScene(fortuneInput);
    }
  }
  if (view === 'reading') {
    readingLines.replaceChildren();
    revealBeat();
  }
  if (view === 'result') {
    const sample = layoutPreview ? makeChristmasPreview(fortuneInput) : generatedScene(fortuneInput);
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
  if (layoutPreview) {
    location.hash = 'result';
    return;
  }
  showFortune(entered, dateInput.value, wishInput.value);
});
get('change-date').addEventListener('click', () => {
  if (!submitted) return;
  const date = submitted.date === christmasEveDate ? defaultFortuneDate : christmasEveDate;
  dateInput.value = date;
  wishInput.value = submitted.wish || '';
  applyInput(submitted.emojis.join(''));
  showFortune(submitted.emojis, date, submitted.wish);
});
function showFortune(emojis, date, wish) {
  submitted = {emojis: emojis.slice(), date, wish};
  saveFortune();
  location.hash = 'waiting';
}
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
dateInput.value = submitted?.date || defaultFortuneDate;
wishInput.value = submitted?.wish || '';
for (const select of [dateInput, wishInput]) {
  select.addEventListener('change', () => {
    startButton.disabled = !canStartFortune();
  });
}
applyInput(submitted?.emojis.join('') || '');
renderRoute(false);
