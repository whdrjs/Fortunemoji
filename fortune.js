'use strict';

// Each entry gives an emoji a concrete detail that can appear in the same scene.
const fortuneClues = [
  ['☕🍵🧋🍫', '손에 따뜻한 음료를 쥐고', '따뜻할 때 한 모금 마시라는', '음료 한 모금으로 잠깐 숨을 돌린다', '컵에 맺힌 온기가 한동안 손에 남는다', 'cafe'],
  ['🍰🧁🍪🥐🍩🍓', '먹음직스러운 디저트를 발견하고', '디저트를 반으로 나누자는', '마지막 한 입을 서로에게 미룬다', '다 먹고 나서도 그 맛을 얘기하게 된다', 'cafe'],
  ['🚌🚍🚏🚆🚇🚉', '다음 차를 기다리며', '어느 쪽으로 가야 하냐는', '급히 타려던 차 한 대를 그냥 보낸다', '돌아가는 길이 생각보다 짧게 느껴진다', 'bus'],
  ['🚗🚕🚲🛷', '평소와 다른 길로 가다가', '잠깐 멈춰 둘러보자는', '목적지까지 한 바퀴 돌아간다', '돌아온 길 쪽이 더 오래 기억에 남는다', 'bus'],
  ['🏠🏡🛋🛏🛌', '집에서 쉬려던 참에', '조금 더 편한 자리로 옮기자는', '편한 자리에 앉아 시간 가는 줄 모른다', '오늘 제일 편했던 시간이 바로 그때였다고 느낀다', 'home'],
  ['🍽', '밥만 먹고 바로 들어가려다가', '같이 밥 한 끼만 먹자는', '다 먹고도 아무도 자리에서 일어나지 않는다', '그날은 음식보다 식탁에서 터진 웃음이 먼저 생각난다'],
  ['🚪', '문을 막 닫으려던 참에', '문 앞에서 잠깐 보자는', '닫았던 문을 다시 열게 된다', '집에 바로 가려던 계획은 틀어진다', 'home'],
  ['🎄🎅🤶🦌🔔', '크리스마스 장식을 물끄러미 보다가', '장식에 불이 켜질 때까지 있자는', '불빛이 들어오는 순간을 같이 본다', '뒤늦게 오늘이 크리스마스였다는 실감이 난다', 'tree'],
  ['🎁💝', '아직 풀지 않은 선물을 곁에 두고', '선물을 지금 열어보자는', '포장지를 뜯다가 예상과 다른 물건에 웃는다', '선물 자체보다 건네던 표정이 오래 남는다', 'tree'],
  ['❄☃⛄🧣🧤', '찬 공기에 몸을 움츠리다가', '따뜻한 데로 들어가자는', '얼었던 손부터 녹인다', '추웠던 이야기만 하다 보니 마음은 좀 풀린다'],
  ['🫠😩😮‍💨😴🥱', '하루가 길어 좀 지친 채로', '오늘은 무리하지 말자는', '하던 걸 내려놓고 잠깐 쉬어 간다', '미뤄도 괜찮았던 일이 하나 떠오른다'],
  ['😩', '피곤한 티를 숨기려다가', '얼굴에 피곤한 티가 다 난다는', '결국 하던 일을 접고 한숨 돌린다', '한 번 쉬고 나니 못 할 일도 아니었다는 생각이 든다'],
  ['🙂😊🥰😁😄', '별일 없이 기분이 괜찮던 참에', '같이 있으면 편하다는', '별 얘기 없이 웃다가 시간을 보낸다', '무슨 얘기였는지는 잊고 표정만 기억한다'],
  ['😂🤣😆', '별것 아닌 일에 웃음이 터진 채로', '아까 그 얘기를 다시 해달라는', '같은 이야기로 두 번 더 웃는다', '헤어지고 나서도 그 대목이 떠올라 웃는다'],
  ['😭🥹😢', '괜히 마음이 울컥하던 참에', '괜찮은 척 안 해도 된다는', '미뤄 두었던 얘기를 조금 꺼낸다', '해결된 건 없어도 한결 가벼워진 채 돌아온다'],
  ['💬📱📞💌✉', '휴대폰을 뒤집어 두려던 참에', '지금 잠깐 볼 수 있냐는', '메시지 한 줄에 답하느라 걸음을 멈춘다', '평소라면 넘겼을 연락에 한마디 더 보낸다'],
  ['👀👁🤔', '눈에 밟히는 게 하나 있어 멈췄다가', '저쪽을 한번 봐보라는', '지나쳤던 것을 다시 보러 돌아선다', '처음엔 못 봤던 작은 디테일을 기억한다'],
  ['✨💫⭐🌟🌙', '저녁 불빛에 눈이 가던 참에', '고개를 들어 보라는', '잠시 서서 반짝이는 쪽을 바라본다', '별일 없던 저녁에 기억할 만한 풍경이 하나 생긴다'],
  ['❤💚💙💜🫶💕', '누군가가 문득 생각나던 참에', '며칠 전부터 생각났다는', '미루던 안부를 먼저 전한다', '답장에 있던 짧은 한마디를 몇 번 다시 읽는다'],
  ['🎧🎵🎶🎤', '듣던 노래의 마지막 소절을 따라가다가', '이 노래를 들어봤냐는', '같은 노래를 한 곡 더 튼다', '집에 와서도 그 멜로디가 자꾸 맴돈다'],
  ['🐶🐱🐾🐸🐙', '작은 동물 그림에 눈길을 주다가', '그 동물을 닮은 표정을 지었다는', '닮았다는 말에 표정을 한 번 더 지어 본다', '그 동물이 보일 때마다 오늘 일을 떠올린다'],
  ['🍀🎲🎯', '지나치기 아까운 우연을 만나고', '그냥 한번 해보자는', '동전 던지듯 작은 선택을 맡겨 본다', '고민했던 쪽보다 더 재미있는 결과를 만난다'],
  ['📷📸🎥', '사진 한 장을 찍으려 멈춘 참에', '지금 모습을 남겨 두자는', '평소엔 지나칠 풍경을 사진으로 남긴다', '사진 속 배경에 있던 사람이 뒤늦게 눈에 들어온다'],
  ['🍕🍜🍔🍗🍚🍣', '뭘 먹을지 생각하던 참에', '빈속으로 가지 말자는', '짧은 약속 끝에 결국 저녁까지 먹는다', '돌아가는 길엔 내일 먹을 메뉴까지 얘기한다'],
  ['🥂🍷🍺🍻', '한 잔 정도는 괜찮겠다고 생각하다가', '오늘을 기념하자는', '한 잔만 하기로 한 자리에서 이야기를 더 나눈다', '잔보다 이야기가 먼저 비워졌다는 생각이 든다', 'home'],
  ['🪐🚀🌌', '엉뚱한 상상에 잠겨 있다가', '평소 안 가던 곳에 가보자는', '낯선 쪽으로 길을 틀어 본다', '익숙한 동네에도 모르는 곳이 남아 있다는 걸 알게 된다'],
  ['😎', '아무렇지 않은 척하고 있다가', '태연한 척하는 거 다 안다는', '괜히 쿨한 척 한 발 물러난다', '그때 태연한 척했던 게 제일 티 났다는 소릴 듣는다'],
  ['💕', '요즘 마음이 가는 사람을 생각하다가', '너랑 있으면 자꾸 웃음이 난다는', '눈치 보다가 결국 마음을 티 낸다', '좋아하는 티를 서로 숨기고 있었다는 걸 안다'],
  ['😭', '아무렇지 않은 줄 알았는데 눈물이 나서', '울어도 되니까 숨기지만 말라는', '참고 있던 눈물이 결국 터진다', '실컷 울고 나니 웃음이 난다'],
  ['👻', '며칠째 연락 없던 사람을 잊어갈 때쯤', '한동안 잠수 탔던 사람이 다시 보자는', '사라졌던 사람이 아무 일도 없었다는 듯 나타난다', '먼저 연락해 온 쪽이 며칠째 잠수 타던 사람이라는 게 제일 어이없다'],
  ['😍🤩', '첫눈에 마음을 뺏길 만한 걸 보고', '눈이 반짝이는 게 다 보인다는', '한 번만 보기로 해놓고 세 번 더 본다', '돌아와서 찾아본 걸 또 찾아본다'],
  ['😘💋😚😙😗', '장난처럼 뽀뽀를 날리고', '아까 그 뽀뽀는 진심이었냐는', '뽀뽀 얘기에 농담하던 쪽이 먼저 당황한다', '끝까지 아무렇지 않은 척하다가 혼자 웃는다'],
  ['🙏🤲', '부탁 하나를 할까 말까 고민하다가', '이번 한 번만 도와달라는', '겸손하게 한 부탁이 생각보다 빨리 통한다', '오늘 손 모아 빌었던 일은 잘 풀린다'],
  ['👍👌', '일단 마음에 든다는 표시를 하고', '그거 괜찮으니 그대로 하자는', '미적대던 일에 한 번 시원하게 오케이한다', '괜히 길게 고민했던 게 좀 웃긴다'],
  ['🙈🫣', '민망해서 눈부터 가리고', '못 본 척해줄 테니 계속하라는', '손가락 사이로 보고는 결국 웃음이 난다', '못 본 척할수록 그 장면만 더 또렷하다'],
  ['🤦', '내가 왜 그랬나 싶어서 이마를 짚다가', '방금 한 말 다시 생각해보라는', '뒤늦게 뜻을 알아듣고 이마를 짚는다', '집에 와서도 이불을 한 번 찬다'],
  ['🤷', '나도 모르겠어서 어깨를 으쓱하고', '모르면 일단 가보자는', '될 대로 되라는 마음으로 그냥 해본다', '고민 그만두고 나서야 일이 풀렸다는 걸 깨닫는다'],
  ['😅😬', '민망한 걸 들켜 어색하게 웃고', '왜 웃냐는', '웃음으로 넘기려던 게 다 들킨다', '다음에 만나면 그 얘기부터 할 것 같다'],
  ['🙄😒', '어이없어서 눈을 슬쩍 굴리고', '표정에 다 쓰여 있다는', '한 번만 참으려다가 그냥 할 말 한다', '한마디 안 했으면 종일 억울했을 것 같다'],
  ['😏😉', '모르는 척하기에는 이미 눈치챈 상태라', '눈치챘으면 모른 척해달라는', '눈짓 한 번에 둘 다 같은 생각이었음을 안다', '굳이 말로 확인할 필요도 없었다 싶다'],
  ['💔', '마음 상한 티를 감추고 있다가', '서운했으면 그때 말하지 그랬냐는', '웃고 넘겼던 서운한 일을 결국 꺼낸다', '서운한 쪽도 이유가 있었다는 걸 안다'],
  ['😡😠🤬😤', '이미 속에서 한 번 열이 오른 상태로', '화났으면 차라리 바로 말하라는', '더 참으면 손해겠다 싶어서 바로 얘기한다', '화낸 이유보다 그 전에 참은 횟수가 더 기억난다'],
  ['🤭🤫🤐', '입 밖에 낼 뻔한 말을 삼키고', '이건 우리끼리만 알자는', '말 안 하기로 한 걸 표정으로 다 들킨다', '말한 건 한 줄인데 숨긴 얘기가 더 길다'],
  ['💀☠', '너무 어이없어서 잠깐 정신을 놓고', '웃겨서 진짜 죽겠다는', '다들 멀쩡한 척하다가 한꺼번에 터진다', '집에 돌아와서도 마지막 농담이 생각나 혼자 웃는다'],
  ['❤♥', '마음을 들킬까 봐 말수를 줄였더니', '아직도 많이 좋아한다는', '돌려 말하다 지쳐 그냥 좋아한다고 한다', '좋다고 말하는 데 왜 이렇게 오래 걸렸나 싶다'],
  ['👏', '생각보다 잘해서 박수부터 치고', '아까 박수 친 거 진심이었냐는', '조용히 있다가 제일 먼저 박수친다', '박수까지 칠 일은 아니었는데 또 하면 또 친다'],
  ['🔥', '이 정도면 한번 불붙어 보겠다 싶어서', '지금 분위기 제대로 불붙었다는', '할까 말까 하던 일에 갑자기 불붙는다', '한번 불붙으니 식은 줄 알았던 의욕이 돌아온다'],
  ['🎉🎊', '축하할 일이 하나 생겨서', '오늘은 제대로 축하하자는', '기쁜 소식을 감추다가 결국 동네방네 말한다', '축하받은 말 중 하나를 자꾸 다시 읽는다'],
  ['👋', '먼저 손을 흔들어 보고', '아까 저쪽에서 손 흔든 게 너였냐는', '그냥 지나칠 줄 알았는데 두 사람이 동시에 손을 흔든다', '마지막에 서로 손 흔들던 장면이 오래 남는다'],
  ['😱😨😲🤯', '예상 밖이라 말문이 막힌 채로', '진짜 몰랐냐는', '한 박자 늦게 뜻을 알아듣고 입이 벌어진다', '그때 내 표정부터 기억날 것 같다']
];

const clueSegmenter = new Intl.Segmenter('ko', {granularity: 'grapheme'});

function normalizeFortuneEmoji(emoji) {
  return emoji.replace(/[\uFE0E\uFE0F\p{Emoji_Modifier}]/gu, '');
}

const cluesByEmoji = new Map(fortuneClues.flatMap(clue =>
  Array.from(clueSegmenter.segment(clue[0]), ({segment}) => [normalizeFortuneEmoji(segment), clue])
));
const frequencyClues = new Map(Object.entries(priorityEmojiData).flatMap(([kind, names]) =>
  Object.entries(names).map(([emoji, name]) => [emoji, {kind, name}])
));
const koreanRegions = new Intl.DisplayNames(['ko'], {type: 'region'});
const regionNames = {UM: '미국령 군소 제도', CP: '클리퍼턴섬'};
// The older grouped clues also provide art hints. Ranked text uses a named detail
// when a shared clue would hide the difference between neighboring emoji.
const useCuratedText = new Set(Array.from(clueSegmenter.segment(
  '☕🚌🏠🍽🚪🎄🎁❄🫠😩🙂😊😁😄😂🤣😆😭💬👀✨🍀📷📸🥂🥹😢😎💕👻😍🤩😘💋😚😙😗🙏🤲👍👌🙈🫣🤦🤷😅😬🙄😒😏😉💔😡😠🤬😤🤭🤫🤐💀☠😱😨😲🤯❤♥👏🔥🎉🎊👋'
), ({segment}) => segment));

// Every ranked entry gets a concrete detail and a complete set of narrative roles.
const rankedRoles = {
  expression: name => [`${name} 짤을 보다가`, `표정이 딱 ${name} 같다는`, `표정이 다 말해주는 ${name} 짤 한 장으로 대답한다`, `그때 분위기는 ${name} 짤 한 장으로 요약된다`],
  gesture: name => [`${name} 동작을 따라 해보다가`, `아까 ${name} 동작 다시 해보라는`, `장난으로 시작한 ${name} 동작을 다들 따라 한다`, `${name} 동작 때문에 찍힌 사진이 제일 웃기다`],
  mood: name => [`화면에 뜬 ${name} 표시를 보고`, `아까 그 ${name} 표시에 무슨 뜻이 있냐는`, `${name} 표시 하나로 먼저 반응을 보낸다`, `길게 온 말보다 ${name} 표시 하나가 더 신경 쓰인다`],
  person: name => [`${name} 사진에 눈이 가서`, `아까 본 ${name} 사진 기억하냐는`, `${name} 사진 때문에 사진첩을 한참 뒤진다`, `결국 남은 건 같이 보고 웃은 ${name} 사진 한 장이다`],
  creature: name => [`${name} 사진을 슬쩍 흘려보다가`, `아까 그 ${name} 사진 좀 보내달라는`, `${name} 사진 하나로 대화가 다시 살아난다`, `한동안 ${name}만 봐도 그날 생각날 듯하다`],
  plant: name => [`${name} 앞에서 걸음을 멈추고`, `${name} 옆에서 사진 한 장 남기자는`, `지나쳤던 ${name} 쪽으로 다시 돌아간다`, `사진첩에 ${name} 사진이 생각보다 많이 남는다`],
  food: name => [`메뉴에서 ${name} 쪽에 눈이 가던 중`, `${name} 하나 시켜서 나눠 먹자는`, `고민 끝에 결국 ${name}부터 시킨다`, `집에 와서도 제일 또렷한 건 ${name} 맛이다`],
  drink: name => [`${name} 한 잔 놓고 쉬려던 참에`, `${name} 한 잔만 더 하자는`, `${name} 한 잔 놓고 결국 앉아서 얘기한다`, `나중에 ${name} 한 잔 보고 그때가 생각난다`],
  place: name => [`지도에서 ${name} 쪽을 훑어보다가`, `가던 길에 ${name} 쪽도 들러보자는`, `원래 가려던 길을 틀어 ${name} 쪽으로 간다`, `돌아보니 ${name} 쪽에서 보낸 시간이 제일 길다`],
  ride: name => [`지나가는 ${name} 쪽을 보고 있다가`, `${name} 타는 쪽에서 만나자는`, `기왕 나온 김에 ${name} 타는 곳까지 가본다`, `나중에 제일 많이 한 얘기는 ${name} 타러 가던 길 얘기다`],
  weather: name => [`날씨 앱에 뜬 ${name} 예보를 보다가`, `날씨 앱에 ${name} 떴으니 잠깐 기다리자는`, `${name} 예보 보고 출발 시간을 슬쩍 바꾼다`, `나가기 전 봤던 ${name} 예보 얘기를 나중에 또 한다`],
  sky: name => [`하늘에 ${name} 보이는 쪽으로 시선이 가다가`, `지금 ${name} 보이니 창밖 좀 보라는`, `${name} 안 놓치려고 하던 걸 잠깐 멈춘다`, `그날 얘기하면 하늘에 있던 ${name}부터 떠오른다`],
  occasion: name => [`${name} 사진을 정리하다가`, `${name} 사진 하나 남겨두자는`, `중간에 ${name} 사진 찍느라 잠깐 모인다`, `돌아보니 ${name} 사진에서 제일 신나 보인다`],
  activity: name => [`${name} 얘기에 귀가 솔깃해져서`, `${name} 한번 같이 해보자는`, `구경만 한다더니 결국 ${name}에도 끼어든다`, `${name} 얘기 나오면 다음번엔 먼저 끼어들 것 같다`],
  audio: name => [`${name} 소리가 나는 쪽을 보다 보니`, `아까 ${name} 소리 들었냐는`, `${name} 소리에 하던 얘기를 멈추고 귀를 기울인다`, `집에 와서도 ${name} 소리가 귓가에 남는다`],
  outfit: name => [`${name} 차림을 거울로 확인하다가`, `오늘 ${name} 자주 입는 거냐는`, `고민 끝에 ${name} 차림으로 그냥 나가기로 한다`, `사진을 보니 괜히 고민했던 ${name} 차림이 제일 잘 나온다`],
  message: name => [`${name} 알림이 와서`, `아까 ${name} 확인해봤냐는`, `미뤄둔 ${name} 쪽에 이제야 답한다`, `${name} 확인한 뒤로 그 얘기를 자꾸 다시 읽는다`],
  country: name => [`${name} 여행 사진을 넘기다가`, `다음에 ${name} 얘기도 좀 들려달라는`, `${name} 얘기에 홀려서 여행 사진을 한참 찾아본다`, `돌아와서 ${name} 가는 길부터 검색해 본다`],
  symbol: name => [`${name} 표시 앞에서 멈칫하고`, `아까 본 ${name} 표시가 무슨 뜻이냐는`, `${name} 표시가 뭔지 몰라 한 번 더 확인한다`, `별생각 없이 지나친 ${name} 표시가 나중에도 눈에 밟힌다`],
  object: name => [`${name} 쪽에 손이 가던 참에`, `아까 봤던 ${name} 어디 갔냐는`, `찾던 ${name} 때문에 왔던 길을 되짚는다`, `별거 아닌 ${name} 하나 때문에 기억에 남을 하루가 된다`]
};

function fortuneEmojiCandidates(emoji) {
  const normalized = normalizeFortuneEmoji(emoji);
  const ungendered = normalized.replace(/\u200D[♀♂]$/u, '');
  const activity = ungendered.replace(/\u200D[➡⬅]$/u, '');
  return [
    normalized, ungendered, activity,
    activity.replace(/^[👩👨🧑](?=\u200D)/u, '🧑'),
    activity.replace(/^[👩👨🧑](?=\u200D)/u, '👩'),
    activity.replace(/^[👩👨🧑](?=\u200D)/u, '👨')
  ];
}

function resolveFortuneClue(emoji) {
  const candidates = fortuneEmojiCandidates(emoji);
  const curatedKey = candidates.find(candidate => useCuratedText.has(candidate));
  if (curatedKey) return cluesByEmoji.get(curatedKey);
  const curated = candidates.map(candidate => cluesByEmoji.get(candidate)).find(Boolean);
  const rankedKey = candidates.find(candidate => frequencyClues.has(candidate));
  if (!rankedKey) return curated;

  const {kind, name} = frequencyClues.get(rankedKey);
  const label = kind === 'country'
    ? name.replace(/^깃발: /, '').replace(/^[A-Z]{2}$/, code => regionNames[code] || koreanRegions.of(code))
    : name;
  return [rankedKey, ...rankedRoles[kind](label), curated?.[5], rankedHooks[kind]];
}

const sceneLabels = {
  cafe: '문자로 그린 카페', bus: '문자로 그린 정류장',
  home: '문자로 그린 집', tree: '문자로 그린 크리스마스 트리',
  emojis: '입력한 이모지 네 개를 문자로 그린 장면'
};

const defaultFortuneDate = '2026-12-25';
function isFortuneDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T00:00:00Z');
  return Number.isFinite(+date) && date.toISOString().slice(0, 10) === value;
}
function fortuneDateLabel(value) {
  const [, month, day] = value.split('-').map(Number);
  return `${month}월 ${day}일`;
}

const rankedHooks = {
  expression: '표정 하나면 대답은 끝난다', gesture: '별생각 없이 한 동작이 유행한다',
  mood: '긴 메시지보다 작은 표시가 더 신경 쓰인다', person: '사진첩에서 뜻밖의 한 장을 건진다',
  creature: '대화는 엉뚱한 사진 한 장으로 살아난다', plant: '지나친 풍경을 한 번 더 보게 된다',
  food: '메뉴판 앞에서 첫 결정을 뒤집는다', drink: '한 잔만 하고 일어날 생각은 접어라',
  place: '오늘 가장 오래 머물 곳은 목적지 밖에 있다', ride: '가는 길 이야기가 더 오래 남는다',
  weather: '출발 시간은 한 번 바뀐다', sky: '하던 일은 잠깐 멈추고 고개를 들어라',
  occasion: '그날 가장 잘 나온 장면은 따로 있다', activity: '구경만 하겠다는 말은 취소다',
  audio: '그 소리 때문에 하던 말이 끊긴다', outfit: '한참 고민한 차림이 사진에 제일 잘 나온다',
  message: '미뤄둔 답장, 결국 보낸다', country: '여행 사진 한 장에 다음 행선지가 생긴다',
  symbol: '그 표시를 그냥 넘기기는 어렵다', object: '되돌아갈 이유는 생각보다 사소하다'
};

const emojiHooks = {
  '🍽': '밥만 먹고 헤어질 생각은 접어라',
  '☕': '커피 한 모금 마실 틈은 난다',
  '🚪': '닫은 문을 한 번 더 열게 된다',
  '😭': '참던 말이 먼저 나온다',
  '🥹': '참던 말이 먼저 나온다',
  '😢': '참던 말이 먼저 나온다',
  '💕': '이번엔 마음이 먼저 들킨다',
  '💬': '그 메시지는 걸음을 멈추게 한다',
  '👻': '연락이 끊겼던 사람이 다시 나타난다',
  '💀': '끝까지 진지한 척하기는 어렵다',
  '🚌': '서두르지 마라. 차 한 대는 보내도 된다',
  '🎁': '포장 안에는 예상과 다른 게 있다',
  '🎄': '불이 켜질 때까진 자리를 뜨지 마라',
  '🫠': '오늘 할 일 하나는 미뤄도 된다',
  '🔥': '식을 줄 알았던 일이 다시 달아오른다'
};

const storyTypes = [
  {id: 'twist', titles: ['마지막 일정은 바뀐다', '여기서 끝날 줄 알았지']},
  {id: 'dialogue', titles: ['“잠깐”이 제일 수상하다', '흘려들은 한마디가 발목을 잡는다']},
  {id: 'inner-thought', titles: ['겉으론 태연해도 마음은 바쁘다', '머릿속에서 먼저 대답한다']},
  {id: 'heads-up', titles: ['일정 하나는 비워둬라', '계획은 느슨하게 잡아라']},
  {id: 'small-win', titles: ['별일 없는 날에 하나 건진다', '기대가 적을수록 웃을 일이 는다']},
  {id: 'prediction', titles: ['그날의 변수는 사소하다', '이날 얘기는 나중에 한 번 더 한다']},
  {id: 'report', titles: ['계획표에 없는 일이 하나 생긴다', '기억에 남는 건 맨 마지막이다']},
  {id: 'afterthought', titles: ['돌아와서야 생각나는 순간이 있다', '별일 아닌 일이 오래 남는다']}
];

function makeFortune(emojis, date = defaultFortuneDate) {
  const normalized = emojis.map(normalizeFortuneEmoji);
  const [first, second, third, fourth] = normalized.map(resolveFortuneClue);
  const scene = third?.[5] || fourth?.[5] || second?.[5] || first?.[5] || 'emojis';
  const seed = Array.from([date, ...normalized].join('|')).reduce((hash, char) =>
    (Math.imul(hash, 31) + char.codePointAt(0)) >>> 0, 0);
  const setup = first ? first[1] : '여느 때처럼 하루를 보내다가';
  const message = second ? `${second[2]} 말을 듣는다` : '뜻밖의 연락을 받는다';
  const turn = third ? third[3] : ['잠깐 하려던 얘기가 길어진다', '별것 아닌 한마디에 기분이 풀린다', '헤어지기 직전에 한마디 더 보탠다'][(seed >>> 8) % 3];
  const ending = fourth ? fourth[4] : '집에 와서도 그때 들은 한마디가 생각난다';
  const type = storyTypes[seed % storyTypes.length];
  const title = emojiHooks[third?.[0]] || emojiHooks[normalized[2]] ||
    third?.[6] || type.titles[(seed >>> 6) % type.titles.length];
  return {
    date, emoji: emojis.join(' '), emojis, art: scene, artLabel: sceneLabels[scene],
    title, type: type.id,
    story: `${setup} ${message}.\n\n${turn}. ${ending}.`, product: ''
  };
}
