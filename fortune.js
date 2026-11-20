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
      '접시가 오기 전에 둘이 한 접시를 다 비운다. 사진은 남았다. 상대가 마지막 한 입을 가져가는 순간이다. 그걸 보낸 사람도 마지막 한 입을 가져간 사람이다.', 'emojis'),
    day: story('하트는 디저트에 보낸 거다',
      '늦은 점심 끝에 디저트 접시를 당긴다. “아까 하트, 나한테 보낸 거 아니었어?” 숟가락을 드는 것도 귀찮아 고개만 젓는다.',
      '아까 보낸 사진을 다시 보니 하트는 맞은편 사람 얼굴 바로 위에 붙어 있다. 웃음이 나서 숟가락을 내려놓는다. 그사이 마지막 한 입이 사라진다.', 'emojis')
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
  return {key, ...(namedClues.get(key) || namedClues.get(base) || namedClues.get(neutral))};
}

// Details are standalone so they can fit more than one setting.
const sceneDetails = new Map([
  ['❄', '밖에는 눈이 내린다.'],
  ['🌧', '젖은 우산을 한 손에서 다른 손으로 옮긴다.'],
  ['🧣', '목도리를 턱 밑까지 끌어올린다.'],
  ['😎', '선글라스를 머리 위로 올린다.'],
  ['🫠', '화면을 보다가 눈을 한 번 꾹 감는다.'],
  ['😩', '한숨부터 나온다.'],
  ['😴', '하품이 나와 화면을 잠깐 덮는다.'],
  ['😂', '화면을 보다 소리 내서 웃는다.'],
  ['🤣', '웃다가 휴대폰을 떨어뜨릴 뻔한다.'],
  ['🥹', '화면이 흐려져 눈을 두 번 깜빡인다.'],
  ['☕', '커피에서 김이 나지 않는다.'],
  ['🎧', '이어폰을 한쪽만 뺀다.'],
  ['🐱', '방금 받은 고양이 사진이 화면에 떠 있다.'],
  ['🐶', '강아지 사진을 받은 지 몇 초도 안 됐다.']
]);

function withDetail(scene, cues, isEve) {
  const order = isEve ? cues : [...cues].reverse();
  const detail = order.map(cue => sceneDetails.get(cue.key)).find(Boolean);
  return detail ? {...scene, story: detail + ' ' + scene.story} : scene;
}

const seasonalScenes = [
  {
    keys: new Set(['☕', '🍵', '🧋']),
    eve: ({key}) => story('포장 주문인데 코트부터 벗는다',
      '들고 갈 생각으로 카운터에 선다. 뒤따라오던 사람이 창가 사진을 찍어 보낸다. 빈 의자에 자기 가방이 놓여 있다.',
      `${key === '☕' ? '커피를' : '음료를'} 받아 창가로 간다. 가방을 치워 달라고 말하기도 전에 상대가 의자를 빼준다.`, 'cafe'),
    day: ({key}) => story('컵에 내 이름이 두 번 적혀 있다',
      `느지막이 도착한 카페에서 ${key === '☕' ? '커피를' : '음료를'} 받는다. 옆에 놓인 두 번째 컵에도 내 이름이 적혀 있다.`,
      '컵 두 개를 찍어 보낸다. 잠시 뒤 문이 열리고 아까부터 답장이 없던 사람이 들어와 두 번째 컵을 집는다.', 'cafe')
  },
  {
    keys: new Set(['🍽', '🍴', '🥄']),
    kinds: new Set(['food']),
    eve: ({kind, name}) => story('한 입만 먹겠다고 숟가락을 든다',
      `${kind === 'food' ? `메뉴판의 ‘${name}’에 손가락을 올린다` : '막 놓인 접시를 식탁 가운데로 민다'}. 먼저 집에 간다던 사람한테서 연락이 온다. “나 한 입만.”`,
      '조금 뒤 문이 열리고 그 사람이 맞은편에 앉는다. 한 입이라는 말은 지켰다. 첫 숟가락이 생각보다 컸다.'),
    day: ({kind, name}) => story('늦은 점심에 접시가 하나 늘어난다',
      `${kind === 'food' ? `메뉴에서 ‘${name}’을 가리키며 주문한다` : '식탁에 빈 접시 하나를 더 놓는다'}. 어제 못 온다던 사람이 오늘은 주소를 묻는다.`,
      '몇 분 걸리냐고 물어본다. 한참 답이 없다. 전화를 걸려는데 맞은편 의자가 뒤로 밀린다.')
  },
  {
    keys: new Set(['🚌', '🚍', '🚏']),
    eve: () => story('버스가 왔는데 한 사람만 내린다',
      '정류장에 서 있는데 “타지 마”라는 메시지가 온다. 무슨 뜻인지 묻는 사이 버스가 선다.',
      '문이 열리고 메시지를 보낸 사람이 내린다. 답장은 아직 안 읽었다. 일단 내리고 보자는 얼굴이다.', 'bus'),
    day: () => story('세 정류장 전에 자리에서 일어난다',
      '버스 창밖 사진을 보낸다. 잠시 뒤 창밖 사진이 한 장 더 온다. 다른 각도에서 찍힌, 방금 지난 간판이다.',
      '내릴 정류장은 세 개 더 남았다. 그래도 하차 벨을 누르고 문 앞에서 기다린다.', 'bus')
  },
  {
    keys: new Set(['🎄', '🎅', '🤶', '🎁']),
    eve: ({key}) => story('사진 속에 먼저 도착한 사람이 있다',
      `${key === '🎁' ? '선물 봉투를 들고' : '트리 불이 켜지는 걸 보고'} 사진을 찍어 단톡방에 올린다. 짧은 답장이 달린다. “왼쪽 봐.”`,
      '사진 왼쪽 구석에 아는 얼굴이 하나 찍혀 있다. 고개를 들 때는 바로 앞에 와 있다.', 'tree'),
    day: ({key}) => story('어제 사진의 구석부터 확대한다',
      `아침에 ${key === '🎁' ? '포장한 선물' : '장식 불빛'}이 찍힌 사진을 받는다. 사진 끝에 어제 두고 온 물건이 반쯤 찍혀 있다.`,
      '“가져다줄까?”라는 말에 몇 시쯤 오냐고 묻는다. 이어 “문 열어”가 온다.', 'tree')
  },
  {
    keys: new Set(['🚪', '🏠', '🏡', '🛋', '🛏', '🛌']),
    eve: () => story('불을 끄고서야 벨이 울린다',
      '현관에 가방을 내려놓고 불을 끈다. 기다리던 답장 대신 초인종이 울린다.',
      '문 앞 사람이 편의점 봉투를 들어 보인다. “아래만 갔다 올 거라며.” 둘이 신발도 안 벗고 봉투부터 열어 본다.', 'home'),
    day: () => story('슬리퍼 그대로 한 층을 내려간다',
      '아침에 현관문을 열었더니 문 앞이 비어 있다. 휴대폰에는 아까 도착했다는 메시지와 계단 사진 한 장이 떠 있다.',
      '사진을 확대하니 한 층 아래다. 계단을 내려가자 그 사람이 봉투를 들어 올린다. 우리 집인 줄 알고 옆집 문을 두드렸다고 한다.', 'home')
  }
];

const otherScenes = [
  {
    eve: story('나오라는 말이 사진보다 늦게 온다',
      '신발 한 짝을 벗고 휴대폰을 확인한다. 단톡방에 사진이 한 장 올라와 있다. 확대하니 아까 지나온 골목이다.',
      '화면을 끄려는데 그제야 “나와”가 온다. 바닥에 벗어 둔 신발을 발끝으로 당긴다.'),
    day: story('단체 사진에 한 자리가 비어 있다',
      '늦잠을 자고 단톡방을 연다. 단체 사진 맨 끝에 의자가 하나 비어 있다. 그 위에 내 코트가 걸려 있다.',
      '“나 빼고 찍었어?”라고 보내자 사진이 한 장 더 온다. 같은 자리, 같은 사람들이다. 이번에는 다들 문 쪽을 보고 있다.')
  },
  {
    eve: story('예약한 사람만 장소를 모른다',
      '주소를 다시 확인하려 단톡방을 연다. 지도 캡처 아래에 “여기 아닌데”라는 답이 달려 있다. 고개를 들어 가게 간판을 다시 본다.',
      '결국 전화를 건다. 전화기 너머랑 바로 뒷자리에서 같은 벨소리가 들린다. 다 왔으면 왔다고 할 것이지.'),
    day: story('어제 보낸 사진을 오늘도 찍는다',
      '어제 사진이 단톡방 맨 아래에 다시 올라온다. 맨 끝에서 얼굴이 반쯤 잘린 사람이 나다.',
      '친구가 “오늘은 여기 앉아”라며 같은 구도로 사진을 찍는다. 탁자 위에 컵이 하나 더 놓여 있다.')
  },
  {
    eve: story('다 보낸 줄 알았는데 한 장이 남았다',
      '사진을 골라 단톡방에 올린다. 답장이 없는 사람에게 사진을 따로 보낸다. 잠시 뒤 “이건 왜 뺐어?”라는 말이 돌아온다.',
      '사진이 한 장 더 도착한다. 다들 카메라를 보고 있는 줄 알았는데 찍는 사람 빼고 아무도 같은 데를 안 보고 있다.'),
    day: story('알람을 끄자 답장이 쌓여 있다',
      '알람을 끄고 어제 보낸 마지막 메시지를 연다. “다음에 보자” 아래에 주소와 시간이 와 있다. 오늘이다.',
      '출발했냐는 말에 “지금 간다곤 안 했어”라고 답한다. 3분 뒤 현관에서 양말을 신는다.')
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
      const supportingCues = cues.filter((_, i) => i !== index);
      scene = withDetail((isEve ? candidate.eve : candidate.day)(cue), supportingCues, isEve);
    } else {
      const variant = otherScenes[seed % otherScenes.length];
      scene = withDetail(isEve ? variant.eve : variant.day, cues, isEve);
    }
  }
  return {date, emoji: emojis.join(' '), emojis, ...scene, artLabel: sceneLabels[scene.art]};
}
