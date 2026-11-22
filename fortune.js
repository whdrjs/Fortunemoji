import {christmasEveDate, defaultFortuneDate, isFortuneDate, normalizeFortuneEmoji, sceneLabels} from './christmas.mjs';

const story = (title, first, last, art = 'emojis') => ({
  title, story: first + '\n\n' + last, art
});

// Complete scenes for combinations that recur in the preview and introduction.
const featuredScenes = [
  {
    emojis: '😂 ☕ 🐱 🎧',
    eve: story('이어폰을 빼자 커피가 두 잔 놓인다',
      '카페 창가에서 이어폰을 낀 채 커피를 기다린다. 바깥 난간을 지나던 고양이가 유리에 비친 자기 얼굴을 보고 뒤로 펄쩍 뛴다. 웃음이 터져 이어폰을 뺀다.',
      '옆에 선 사람이 같은 곳을 보고 웃는다. 카운터에서 이름을 부르자 둘 다 일어난다. 커피도, 주문할 때 댄 이름도 같다.', 'cafe'),
    day: story('커피가 식는 동안 고양이가 손님을 들인다',
      '아침 커피를 내려놓고 이어폰을 낀다. 창밖 고양이가 자꾸 입을 벌려서, 소리를 들으려고 한쪽을 뺀다. 그제야 현관 밖에서 웃는 소리가 들린다.',
      '문을 열었더니 친구가 쭈그리고 앉아 고양이에게 인사하는 중이다. “얘한테는 들렸는데 너는 왜 안 나와?” 커피 한 잔을 더 내린다.', 'home')
  },
  {
    emojis: '☕ 🫠 💬 🚪',
    eve: story('집에 다 왔는데 약속이 잡힌다',
      '현관 앞에서 비밀번호를 한 번 틀린다. 너무 피곤해서 저녁도 건너뛸 참인데 전화가 울린다. “커피 한 잔만?” 문을 열고 가방만 내려놓는다. 신발은 그대로 신고 있다.',
      '커피는 약속대로 한 잔만 마신다. 저녁을 어디서 먹을지는 그다음에 정한다.', 'cafe'),
    day: story('커피가 먼저 도착한다',
      '늦잠에서 깨 휴대폰을 켠다. “아직 자면 답장하지 마. 문 앞에 커피 두고 간다.” 현관문을 열자 종이컵 두 개가 놓여 있다.',
      '두 번째 컵을 들고 복도를 내다본다. 간다던 사람은 엘리베이터를 한 번 보내고 기다리고 있다.', 'home')
  },
  {
    emojis: '❤️ 😩 🍽️ 💀',
    eve: story('접시가 오기도 전에 다 먹는다',
      '퇴근하자마자 식당으로 간다. 맞은편 사람이 메뉴판을 넘기며 묻는다. “너 피곤하면 밥만 먹고 갈까?” 고개를 끄덕이자 바로 접시 하나를 더 달라고 한다.',
      '접시가 오기 전에 상대가 내 몫까지 먹는다. 미안하다며 빵 위에 남은 잼을 하트 모양으로 짜 놓는다. 어이가 없어서 웃다가 빵까지 집어 먹는다.', 'emojis'),
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
      '며칠째 연락 없던 사람이 아침에 영상을 보내온다. 작년 크리스마스에 둘이 찍은 영상이다. 울지 않았다는 말과 함께 선글라스 낀 사진을 한 장 보낸다.',
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

// Common chat reactions usually mean more than their literal shapes.
const reactionsByEmoji = new Map([
  ['❤', '보고 싶다는 말을 꺼내려다 입을 다문다.'],
  ['💕', '괜히 더 가까이 앉고 싶어진다.'],
  ['😂', '웃음을 못 참고 고개를 돌린다.'],
  ['🤣', '한 번 터진 웃음이 한참 동안 멎지 않는다.'],
  ['😍', '말을 잊고 한참 들여다본다.'],
  ['😭', '괜찮다고 하려는데 목소리가 먼저 잠긴다.'],
  ['🥹', '울컥하는 걸 감추려고 눈을 두 번 깜빡인다.'],
  ['😊', '말없이 입꼬리를 올린다.'],
  ['🙂', '괜찮다는 듯 살짝 웃는다.'],
  ['😬', '어색하게 웃고 시선을 피한다.'],
  ['🫠', '기운이 빠져 한동안 아무 말도 못 한다.'],
  ['😩', '힘이 풀려 어깨가 축 처진다.'],
  ['😴', '하품을 삼키며 눈을 비빈다.'],
  ['🙄', '한마디 하려다 눈만 굴린다.'],
  ['😤', '콧김부터 내쉬고 할 말을 고른다.'],
  ['🫨', '화들짝 놀라 들고 있던 걸 내려놓는다.'],
  ['💀', '어이가 없어 입을 다물었다가 피식 웃는다.'],
  ['💔', '섭섭하다는 말이 목 끝까지 올라온다.'],
  ['😎', '애써 태연한 척한다.'],
  ['🙏', '이번 한 번만이라며 두 손을 모은다.'],
  ['🔥', '별 기대 없이 왔다가 슬슬 진심이 된다.'],
  ['👀', '아무렇지 않은 척 곁눈질한다.'],
  ['👍', '고민은 그만하고 좋다고 대답한다.'],
  ['👏', '생각보다 잘 풀려 박수가 먼저 나온다.'],
  ['🤦', '뒤늦게 무슨 일이 벌어졌는지 알고 이마를 짚는다.'],
  ['🤷', '영문을 모르겠다는 듯 어깨를 으쓱한다.'],
  ['🙌', '잘됐다 싶어 양손을 든다.'],
  ['💯', '더 고칠 데가 없겠다 싶어 고개를 끄덕인다.']
]);

const momentsByEmoji = new Map([
  ['❄', '눈발이 잠깐 굵어진다.'],
  ['🌧', '손잡이에서 떨어지는 빗물을 털어낸다.'],
  ['🧣', '목도리를 턱 밑까지 끌어올린다.'],
  ['☕', '한 모금 남은 커피는 이미 식었다.'],
  ['🎧', '주변 소리를 들으려고 이어폰을 한쪽 뺀다.'],
  ['🐱', '근처에 있던 고양이가 발끝을 스치고 지나간다.'],
  ['🐶', '어디선가 강아지가 짧게 한 번 짖는다.'],
  ['🎄', '멀리 크리스마스트리 불빛이 깜빡인다.'],
  ['🎁', '구겨진 선물 포장지를 손바닥으로 편다.'],
  ['💬', '미처 마치지 못한 대화가 생각난다.'],
  ['👻', '한동안 잠수 탔던 사람 이름이 화면에 뜬다.'],
  ['🚪', '닫힌 문 너머에서 발소리가 들린다.'],
  ['🪾', '잎이 다 떨어진 나무 사이로 바람이 분다.']
]);

const countryLabels = new Intl.DisplayNames('ko', {type: 'region', fallback: 'none'});
const expressionBeats = [
  [/웃|미소|썩소|히죽/, '입꼬리가 올라가는 걸 숨기려고 고개를 돌린다.'],
  [/울|눈물|괴로|실망/, '입을 열었다가 아무 말 없이 숨을 고른다.'],
  [/불안|걱정|식은땀|두려/, '손에 땀이 차서 바지에 손바닥을 훔친다.'],
  [/피곤|졸/, '눈꺼풀이 자꾸 내려앉는다.'],
  [/화난|욕|뾰로통|찡/, '미간을 찌푸리고 할 말을 고른다.'],
  [/놀란|절규|입벌|입 벌|혼란|폭발/, '뭐라고 답할지 몰라 입만 벌린다.'],
  [/키스|포옹|반한|하트/, '한 걸음 더 가까이 가고 싶어진다.'],
  [/생각|덤덤|무표정|눈썹/, '한쪽 눈썹을 올리고 잠깐 생각한다.'],
  [/쉿|입을 잠|입을 가|입을 막/, '입술에 손가락을 대고 조용히 하라는 눈짓을 보낸다.'],
  [/혀를 내|메롱|윙크|괴짜/, '장난 섞인 눈짓을 한 번 보낸다.']
];

function interpretCue(cue) {
  const reaction = reactionsByEmoji.get(cue.key);
  if (reaction) return {reaction};
  const moment = momentsByEmoji.get(cue.key);
  if (moment) return {moment};
  const keycap = /^([0-9#*])\u20e3$/u.exec(cue.key);
  if (keycap) return {moment: `화면에서 ${keycap[1]} 표시가 눈에 들어온다.`};
  if (!cue.name) return {moment: '잘못 본 줄 알고 휴대폰 화면을 다시 켠다.'};

  if (cue.kind === 'country') {
    const place = /^[A-Z]{2}$/.test(cue.name)
      ? countryLabels.of(cue.name) || cue.name
      : cue.name.replace(/^깃발: /, '');
    return {moment: `예전에 저장해 둔 ${place} 사진이 문득 생각난다.`};
  }
  if (cue.kind === 'expression' || cue.kind === 'mood') {
    const beat = expressionBeats.find(([pattern]) => pattern.test(cue.name));
    if (beat) return {reaction: beat[1]};
  }
  if (cue.kind === 'weather' || cue.kind === 'sky') return {moment: `창밖으로 ${cue.name} 풍경이 보인다.`};
  return {object: cue.name};
}

function joinObjects(objects) {
  const last = objects.at(-1);
  return objects.length < 2 ? last : objects.slice(0, -1).join(', ') + ', 그리고 ' + last;
}

function weaveCues(scene, cues, isEve) {
  const items = (isEve ? cues : [...cues].reverse()).map(interpretCue);
  const unique = field => [...new Set(items.map(item => item[field]).filter(Boolean))];
  const moments = unique('moment');
  const props = unique('object');
  const reactions = unique('reaction');
  const [opening, ending] = scene.story.split('\n\n');
  const propLine = props.length ? `시선이 ${joinObjects(props)} 쪽에 잠깐 머문다.` : '';
  const first = [opening, ...moments, propLine].filter(Boolean).join(' ');
  const last = [...reactions, ending].join(' ');
  return {...scene, story: first + '\n\n' + last};
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

// When the inputs mostly describe feelings, the mix drives the whole scene.
const affectionCues = /^[❤♥💕💞💖💗💓💝💘🤗🥰😘😚😙😗😍😻🫶]$/u;
const uneasyCues = /^[😭😢😔😞😒😬😩💔😤🫠🙄😥😓😰😟]$/u;

const moodScenes = {
  affection: {
    eve: story('보고 싶다는 말을 농담으로 보낸다',
      '단톡방에 보낼 농담을 그 사람한테만 보낸다. 답장 기다리는 게 티 날까 봐 휴대폰을 뒤집어 둔다. 진동이 오자마자 다시 뒤집는다.',
      '“이거 나한테만 보낸 거지?”라는 말에 한참 뜸을 들인다. “응. 보고 싶다는 말은 너무 티 나잖아.” 보내고 나서야 더 티 나는 걸 안다.'),
    day: story('잘 나온 사진보다 웃긴 사진을 보낸다',
      '사진첩에서 둘이 잘 나온 사진을 골라 둔다. 막상 보내는 건 상대가 웃다가 눈을 감은 사진이다. “이거 보면 네 웃음소리 들리는 것 같아.”',
      '상대가 답장 대신 전화를 건다. 인사도 하기 전에 둘 다 웃음부터 터진다.')
  },
  humor: {
    eve: story('집 간다고 한 사람이 제일 늦게 간다',
      '가방을 메고 “난 진짜 간다”라고 한다. 문손잡이를 잡았는데 뒤에서 올해 제일 웃겼던 얘기가 나온다. 문을 반쯤 열고 “그래서 그다음엔?” 하고 묻는다.',
      '잠시 뒤 누가 막차 시간을 확인한다. 가방은 언제 내려놨는지 다시 의자 밑에 있다.'),
    day: story('그 얘기 안 하기로 한 사람이 제일 먼저 한다',
      '어제 해놓고 후회한 말이 있어 단톡방을 조용히 넘긴다. 다들 점심 메뉴 얘기만 한다. 아무도 기억 못 하는 줄 알고 내가 먼저 “근데 어제 그거…”라고 꺼낸다.',
      '답장이 동시에 세 개 온다. 셋 다 뒤에 무슨 말을 할지 이미 알고 있다.')
  },
  uneasy: {
    eve: story('괜찮다고 쓰다가 사실대로 보낸다',
      '약속이 밀렸다는 연락에 “괜찮아”라고 쓴다. 그 말을 한 번 보내면 또 혼자 기다릴 것 같아서 지운다. 이번에는 “사실 좀 서운해”라고 보낸다.',
      '상대는 변명 대신 언제부터 기다렸냐고 묻는다. 휴대폰을 내려놓으니 구겨질 만큼 쥐고 있던 영수증이 보인다.'),
    day: story('답장보다 먼저 전화가 온다',
      '어제 못 한 말이 아침까지 걸린다. 대화창을 열고 한 줄 썼다가 지운다. 세 번째로 다시 쓰는 사이 상대에게 전화가 온다.',
      '“아까부터 뭐 보내려는지 다 보여.” 그 말에 힘이 풀린다. 길게 써둔 설명은 지우고, 어제 제일 해주고 싶었던 말 하나만 한다.')
  }
};

function chooseMoodScene(cues) {
  if (cues.some(cue => affectionCues.test(cue.key) || (cue.kind === 'mood' && cue.key !== '💔' && cue.name.includes('하트')))) {
    return moodScenes.affection;
  }
  return cues.some(cue => uneasyCues.test(cue.key)) ? moodScenes.uneasy : moodScenes.humor;
}

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

export function makeFortune(emojis, date = defaultFortuneDate) {
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
      scene = weaveCues((isEve ? candidate.eve : candidate.day)(cue), supportingCues, isEve);
    } else {
      const feelings = cues.filter(cue => interpretCue(cue).reaction);
      if (feelings.length >= 3) {
        const variant = chooseMoodScene(feelings);
        scene = weaveCues(isEve ? variant.eve : variant.day, cues.filter(cue => !feelings.includes(cue)), isEve);
      } else {
        const variant = otherScenes[seed % otherScenes.length];
        scene = weaveCues(isEve ? variant.eve : variant.day, cues, isEve);
      }
    }
  }
  return {date, emojis, ...scene, artLabel: sceneLabels[scene.art]};
}
