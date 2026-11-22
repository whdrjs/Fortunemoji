# 포모지 (Formoji)

바라는 크리스마스를 하나 고르고, 최근에 쓴 이모지 네 개로 그날의 한 장면을 미리 봅니다. 결과에 소원 성사 확률과 움직이는 문자 그림을 담아요.

## 사용 방법

1. 12월 24일 크리스마스이브와 12월 25일 크리스마스 중 하루를 고르세요.
2. 이번 크리스마스에 바라는 일을 하나 고르고 최근 이모지 네 개를 넣으세요.
3. **미래 장면 보기**를 누르면 장면과 소원 성사 확률이 나옵니다.
4. 마음에 드는 장면은 이미지로 저장하거나 스토리에 공유할 수 있어요.

## 키 없이 미리보기

저장소 루트에서 `python3 -m http.server 8000`을 실행한 뒤 `http://localhost:8000`을 엽니다. AI 모드는 기본값이 꺼짐이며, 입력에 따라 여섯 소원별 예시 장면을 보여줍니다. 확률은 날짜, 소원 ID, 정규화한 이모지 조합으로 정하는 포모지 시뮬레이션 수치입니다. 같은 조합을 다시 넣거나 이모지만 순서를 바꾸면 같은 숫자가 나옵니다.

## AI 연결

정적 페이지와 같은 도메인의 `POST /api/fortune`만 Cloudflare Worker에 연결합니다. 클라이언트는 날짜, 소원 ID, 이모지 네 개를 보내고 서버는 `server/fortune-prompt.mjs`의 프롬프트와 응답 스키마를 사용합니다. API가 실패하거나 늦어지면 예시 장면을 보여줍니다.

1. 연결할 때만 Cloudflare Worker를 구성합니다. `wrangler.fortune.toml`은 `4moji.702studio.xyz/api/fortune` 경로로만 라우팅하며, Worker는 IP별 분당 5회 제한을 적용합니다. 다른 호스트를 쓰는 경우 해당 파일의 도메인을 바꿉니다.
2. Worker의 `OPENAI_API_KEY`를 Secret으로 등록하고 `OPENAI_MODEL`을 Structured Outputs를 지원하는 모델 ID로 설정합니다. Wrangler 4.36 이상에서 `npx wrangler deploy --config wrangler.fortune.toml`로 Worker를 배포합니다.
3. Worker 응답을 확인한 뒤 `index.html`의 `formoji-ai` 메타 값을 `on`으로 바꾸고 정적 페이지를 배포합니다. 홈과 개인정보처리방침에는 AI 모드에서의 입력값 전송 안내가 표시됩니다.

응답의 `art` 값은 기존 문자 그림을 선택합니다. `visual_cue`에는 이후 새 문자 그림을 만들 때 쓸 장면의 사물과 움직임을 기록합니다.
