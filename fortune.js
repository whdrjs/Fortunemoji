'use strict';

const christmasEveDate = '2026-12-24';
const defaultFortuneDate = '2026-12-25';

function isFortuneDate(value) {
  return value === christmasEveDate || value === defaultFortuneDate;
}

function fortuneDateLabel(value) {
  const [, month, day] = value.split('-').map(Number);
  return `${month}월 ${day}일`;
}

function normalizeFortuneEmoji(emoji) {
  return emoji.replace(/[\uFE0E\uFE0F\p{Emoji_Modifier}]/gu, '');
}

const sceneLabels = {
  cafe: '문자로 그린 카페', bus: '문자로 그린 정류장',
  home: '문자로 그린 집', tree: '문자로 그린 크리스마스 트리',
  emojis: '입력한 이모지 네 개를 문자로 그린 장면'
};

const story = (title, first, last, art = 'emojis') => ({
  title, story: first + '\n\n' + last, art
});

// Complete scenes for combinations that recur in the preview and introduction.
const featuredScenes = [
  {
    emojis: '☕ 🫠 💬 🚪',
    eve: story('집에 다 왔는데 약속이 잡힌다',
      '현관 비밀번호를 누르는데 휴대폰이 울린다. “커피 한 잔만?” 문을 열고 가방만 내려놓는다. 신발은 그대로 신고 있다.',
      '커피는 약속대로 한 잔만 마신다. 저녁을 어디서 먹을지는 그다음에 정한다.', 'cafe'),
    day: story('커피가 먼저 도착한다',
      '늦잠에서 깨 휴대폰을 켠다. “아직 자면 답장하지 마. 문 앞에 커피 두고 간다.” 현관문을 열자 종이컵 두 개가 놓여 있다.',
      '두 번째 컵을 들고 복도를 내다본다. 간다던 사람은 엘리베이터를 한 번 보내고 기다리고 있다.', 'home')
  },
  {
    emojis: '❤️ 😩 🍽️ 💀',
    eve: story('접시가 오기도 전에 다 먹는다',
      '퇴근하자마자 식당으로 간다. 맞은편 사람이 메뉴판을 넘기며 묻는다. “너 피곤하면 밥만 먹고 갈까?” 고개를 끄덕이자 바로 접시 하나를 더 달라고 한다.',
      '접시가 오기 전에 둘이 한 접시를 다 비운다. 사진은 남았다. 상대가 마지막 한 입을 가져가는 순간이다. 거기에 하트를 눌러준다. 💀', 'emojis'),
    day: story('하트는 디저트에 보낸 거다',
      '늦은 점심 끝에 디저트 접시를 당긴다. “아까 하트, 나한테 보낸 거 아니었어?” 숟가락을 드는 것도 귀찮아 고개만 젓는다.',
      '아까 보낸 사진을 다시 보니 하트는 맞은편 사람 얼굴 바로 위에 붙어 있다. 설명은 됐고, 디저트부터 한 입 먹는다. 💀', 'emojis')
  },
  {
    emojis: '😎 💕 😭 👻',
    eve: story('잠수 탄 사람이 먼저 온다',
      '며칠째 답이 없던 사람이 약속 장소에 먼저 와 있다. 고개를 살짝 끄덕이고 주문부터 한다. 분명 태연하게 들어왔는데 상대가 웃자 눈이 먼저 젖는다.',
      '집에 가는 길에 둘이 찍은 사진을 받는다. 상대가 붙인 하트가 두 개다. 같은 사진을 이미 저장해 둔 걸, 두 번째로 저장하고서야 안다.'),
    day: story('안 울었다고 보낸 사진에 들킨다',
      '아침에 안부를 기다리던 사람이 보낸 영상이 도착한다. 작년 크리스마스에 둘이 찍은 영상이다. 울지 않았다는 말과 함께 선글라스 낀 사진을 한 장 보낸다.',
      '그 사람이 사진에 하트 두 개를 단다. 그리고 선글라스 아래 삐져나온 휴지 끝에 동그라미를 쳐서 돌려보낸다.')
  },
  {
    emojis: '🚌 ❄️ ☕ 🧣',
    eve: story('전광판의 1분이 두 번 지나간다',
      '눈 내리는 정류장에서 종이컵을 바꿔 든다. 따뜻한 쪽을 건네자 상대가 목도리를 풀어 내 목에 한 바퀴 감아준다.',
      '버스가 도착한다. 목도리를 돌려주는 사이 문이 닫힌다. 다음 차까지 7분인데, 상대는 커피를 아주 천천히 마신다.', 'bus'),
    day: story('목도리가 먼저 버스에 탄다',
      '눈 오는 아침, 정류장에서 커피 뚜껑을 닫다 버스를 놓친다. 막 떠난 버스 안을 보니 어제 빌려준 목도리가 창가에 보인다.',
      '곧 메시지가 온다. “다음 정류장에서 기다릴게.” 이번엔 컵을 한 손에 꼭 쥐고 탄다.', 'bus')
  },
  {
    emojis: '🏠 🥂 🛏️ 🌅',
    eve: story('막차 시간에 이불을 꺼낸다',
      '집에 모여 잔을 부딪친다. 자정에는 막차를 검색하고, 한 시에는 옷장에서 이불을 세 장 더 꺼낸다.',
      '창이 밝아질 때쯤 한 사람이 주방에서 묻는다. “라면 물 몇 개 잡아?” 이불 속에서 셋 다 대답한다.', 'home'),
    day: story('아침 햇빛에 어젯밤 잔이 걸린다',
      '침대까지 햇빛이 들어온다. 방문을 열고 나오자 식탁에 어젯밤 건배한 잔이 두 개 그대로 있다.',
      '물부터 마시려는데 거실에서 누가 기지개를 켠다. “오늘 설거지는 누가 할까?” 둘이 빈 잔을 집어 다시 부딪친다.', 'home')
  }
];

const featuredByKey = new Map(featuredScenes.map(scene =>
  [sceneKey(scene.emojis.split(' ')), scene]
));

function sceneKey(emojis) {
  return emojis.map(normalizeFortuneEmoji).sort().join('|');
}

const namedClues = new Map(Object.entries(priorityEmojiData).flatMap(([kind, names]) =>
  Object.entries(names).map(([emoji, name]) => [emoji, {kind, name}])
));

function findCue(emoji) {
  const key = normalizeFortuneEmoji(emoji);
  const base = key.replace(/\u200D[♀♂➡⬅]$/gu, '');
  const neutral = base.replace(/^[👩👨🧑](?=\u200D)/u, '🧑');
  return {emoji, key, ...(namedClues.get(key) || namedClues.get(base) || namedClues.get(neutral))};
}

// A primary cue gives the scene a setting or action. The remaining cues
// appear together in the exchange that changes what happens next.
const seasonalScenes = [
  {
    keys: new Set(['☕', '🍵', '🧋']),
    eve: ({key}, [a, b, c]) => story('테이크아웃 컵이 자리를 잡는다',
      `들고 갈 생각으로 카운터에 선다. 뒤따라오던 사람이 ${a} ${b}로 답장을 보내고, 창가 자리에 앉은 사진을 찍어 보낸다. 사진 구석에 ${c}가 붙어 있다.`,
      `${key === '☕' ? '커피를' : '음료를'} 받아 창가로 간다. 계산할 때는 포장이었는데 가게에서 코트까지 벗는다.`, 'cafe'),
    day: ({key}, [a, b, c]) => story('컵에 내 이름이 두 번 적혀 있다',
      `느지막이 도착한 카페에서 ${key === '☕' ? '커피를' : '음료를'} 받는다. 주문한 사람 이름에 내 이름이 적혀 있다. 옆에 놓인 두 번째 컵에도 같은 이름이 있다.`,
      `사진을 보내자 ${a} ${b} ${c} 순서로 답장이 온다. 잠시 뒤 문이 열리고 메시지를 보낸 사람이 들어와 두 번째 컵을 집는다.`, 'cafe')
  },
  {
    keys: new Set(['🍽', '🍴', '🥄']),
    kinds: new Set(['food']),
    eve: ({kind, name}, [a, b, c]) => story('한 입만 먹겠다고 숟가락을 든다',
      `${kind === 'food' ? `메뉴판의 ‘${name}’에 손가락을 올린다` : '막 놓인 접시를 식탁 가운데로 민다'}. 먼저 온 사진에는 ${a}가 붙어 있다. “나 한 입만.” 그리고 ${b} ${c}가 연달아 온다.`,
      '조금 뒤 문이 열리고 보낸 사람이 앉는다. 한 입이라는 말은 지켰다. 첫 숟가락이 생각보다 컸다.'),
    day: ({kind, name}, [a, b, c]) => story('늦은 점심에 접시가 하나 늘어난다',
      `${kind === 'food' ? `메뉴에서 ‘${name}’을 가리키며 주문한다` : '혼자 먹으려던 식탁에 빈 접시 하나를 더 놓는다'}. 어제는 못 온다던 사람이 오늘은 ${a} 하나만 보내고 주소를 묻는다.`,
      `올 수 있냐고 묻자 ${b} ${c}만 돌아온다. 답장을 기다리는 사이 맞은편 의자가 뒤로 밀린다.`)
  },
  {
    keys: new Set(['🚌', '🚍', '🚏']),
    eve: (_, [a, b, c]) => story('버스가 왔는데 한 사람만 내린다',
      `정류장에 서 있는데 “타지 마”라는 메시지가 온다. 그 뒤에 ${a} ${b}가 붙어 있다. 무슨 뜻인지 묻는 사이 버스가 선다.`,
      `문이 열리고 메시지를 보낸 사람이 내린다. “다음 정류장인 줄 알았지?” 화면을 보니 답장으로 ${c}까지 보내둔 참이다.`, 'bus'),
    day: (_, [a, b, c]) => story('세 정류장 전에 자리에서 일어난다',
      `버스 창밖 사진을 보낸다. 상대는 ${a} ${b}로 답하다가 마지막에 ${c}를 붙인다. 곧이어 창밖 사진이 한 장 더 온다. 방금 지난 간판이다.`,
      '내릴 정류장은 세 개 더 남았다. 하차 벨을 누르고 문 앞에서 기다린다.', 'bus')
  },
  {
    keys: new Set(['🎄', '🎅', '🤶', '🎁']),
    eve: ({key}, [a, b, c]) => story('사진 속에 먼저 도착한 사람이 있다',
      `${key === '🎁' ? '선물 봉투를 들고' : '트리 불이 켜지는 걸 보고'} 사진을 찍어 단톡방에 올린다. ${a} ${b}가 붙더니 ${c}와 함께 짧은 답장이 달린다. “왼쪽 봐.”`,
      '사진 왼쪽 구석에 아는 얼굴이 하나 찍혀 있다. 고개를 들 때는 바로 앞에 와 있다.', 'tree'),
    day: ({key}, [a, b, c]) => story('어제 사진의 구석부터 확대한다',
      `아침에 ${key === '🎁' ? '포장한 선물' : '장식 불빛'}이 찍힌 사진을 받는다. 보낸 사람은 설명을 쓰는 대신 ${a}와 ${b}를 붙여 뒀다.`,
      `사진 속에서 어제 두고 온 물건을 찾는다. “가져다줄까?”라는 말에 ${c}를 보내고 문 앞에 슬리퍼를 꺼내 놓는다.`, 'tree')
  },
  {
    keys: new Set(['🚪', '🏠', '🏡', '🛋', '🛏', '🛌']),
    eve: (_, [a, b, c]) => story('불을 끄고서야 벨이 울린다',
      `현관에 가방을 내려놓는다. “다 왔어?”에 ${a} 하나를 보내고 불을 끈다. 초인종이 울린다. 문으로 걸어가는 사이 뒤늦게 ${b} ${c}가 온다.`,
      '문 앞 사람이 편의점 봉투를 들어 보인다. “아래만 갔다 올 거라며.” 둘이 신발도 안 벗고 봉투부터 열어 본다.', 'home'),
    day: (_, [a, b, c]) => story('슬리퍼 그대로 한 층을 내려간다',
      `아침에 현관문을 열었더니 문 앞이 비어 있다. 휴대폰엔 아까 온 ${a} ${b}와 계단 사진 한 장이 떠 있다. 마지막에 ${c}가 붙어 있다.`,
      '사진을 확대하니 한 층 아래다. 계단을 내려가자 그 사람이 봉투를 들어 올린다. 우리 집인 줄 알고 옆집 문을 두드렸다고 한다.', 'home')
  }
];

const otherScenes = [
  {
    eve: ([a, b, c, d]) => story('나오라는 말이 사진보다 늦게 온다',
      `신발을 벗고 휴대폰을 확인한다. 단톡방에 ${a} ${b} ${c}가 달린 사진이 한 장 올라와 있다. 확대하니 아까 지나온 골목이다.`,
      `${d} 하나 달고 화면을 끈다. 그제야 “나와”가 온다. 신발 한 짝은 아직 발에 걸쳐 있다.`),
    day: ([a, b, c, d]) => story('단체 사진에 한 자리가 비어 있다',
      `늦잠을 자고 단톡방을 연다. ${a} ${b} ${c}가 달린 단체 사진에서 맨 끝 의자가 비어 있다. 누가 그 자리에 ${d}를 붙여 뒀다.`,
      '“나 빼고 찍었어?”라고 보내자 사진이 한 장 더 온다. 같은 자리, 같은 사람들이다. 이번에는 다들 문 쪽을 보고 있다.')
  },
  {
    eve: ([a, b, c, d]) => story('예약한 사람만 장소를 모른다',
      `주소를 다시 확인하려 단톡방을 연다. 마지막에 보낸 장소에 ${a} ${b} ${c}만 줄줄이 달려 있다. 맞냐고 묻자 또 ${d}가 달린다.`,
      '결국 전화를 건다. 전화기 너머랑 바로 뒷자리에서 같은 벨소리가 들린다. 다 왔으면 왔다고 할 것이지.'),
    day: ([a, b, c, d]) => story('어제 보낸 사진을 오늘도 찍는다',
      `어제 사진이 단톡방 맨 아래에 다시 올라온다. ${a} ${b} ${c}가 달리자 내 자리만 잘라 보내려다 실수로 ${d}를 붙여 보낸다.`,
      '친구가 “오늘은 여기 앉아”라며 같은 구도로 사진을 찍는다. 탁자 위에 컵이 하나 더 놓여 있다.')
  },
  {
    eve: ([a, b, c, d]) => story('다 보낸 줄 알았는데 한 장이 남았다',
      `사진을 고르고 단톡방에 올린다. ${a} ${b} ${c}가 차례로 달린다. 아무 반응 없는 마지막 사람에게 사진을 따로 보내자 ${d}가 돌아온다.`,
      '이어 찍힌 사진이 한 장 더 도착한다. 다들 카메라를 보고 있는 줄 알았는데 찍은 사람 빼고 아무도 같은 데를 안 보고 있다.'),
    day: ([a, b, c, d]) => story('알람을 끄자 답장이 쌓여 있다',
      `알람을 끄고 어제 보낸 마지막 메시지를 연다. “다음에 보자” 아래 ${a} ${b} ${c}가 쌓여 있다. 출발하냐는 말에 이불 안에서 ${d} 하나를 보낸다.`,
      '“지금 간다곤 안 했어.” 보내고 3분 뒤에 현관에서 양말을 신는다.')
  }
];

function makeFortune(emojis, date = defaultFortuneDate) {
  if (!isFortuneDate(date)) date = defaultFortuneDate;
  const isEve = date === christmasEveDate;
  const featured = featuredByKey.get(sceneKey(emojis));
  let scene;
  if (featured) {
    scene = isEve ? featured.eve : featured.day;
  } else {
    const cues = emojis.map(findCue);
    const seed = Array.from(cues.map(cue => cue.key).join('|')).reduce((hash, char) =>
      (Math.imul(hash, 31) + char.codePointAt(0)) >>> 0, 0);
    const matches = cues.flatMap((cue, index) => seasonalScenes
      .filter(candidate => candidate.keys.has(cue.key) || candidate.kinds?.has(cue.kind))
      .map(candidate => ({cue, index, candidate})));
    const match = matches[seed % matches.length];
    if (match) {
      const {cue, index, candidate} = match;
      const reactions = emojis.filter((_, i) => i !== index);
      if (!isEve) reactions.push(reactions.shift());
      scene = (isEve ? candidate.eve : candidate.day)(cue, reactions);
    } else {
      const variant = otherScenes[seed % otherScenes.length];
      const signals = isEve ? emojis : [emojis[2], emojis[3], emojis[0], emojis[1]];
      scene = (isEve ? variant.eve : variant.day)(signals);
    }
  }
  return {date, emoji: emojis.join(' '), emojis, ...scene, artLabel: sceneLabels[scene.art]};
}
