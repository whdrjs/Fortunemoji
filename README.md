# 포모지 (Formoji)

바라는 크리스마스를 하나 고르고, 최근에 쓴 이모지 네 개로 그날의 한 장면을 미리 봅니다. 결과에 소원 성사 확률과 움직이는 문자 그림을 담아요.

## 사용 방법

1. 12월 24일 크리스마스이브와 12월 25일 크리스마스 중 하루를 고르세요.
2. 이번 크리스마스에 바라는 일을 하나 고르고 최근 이모지 네 개를 넣으세요.
3. **미래 장면 보기**를 누르면 장면과 소원 성사 확률이 나옵니다.
4. 마음에 드는 장면은 이미지로 저장하거나 스토리에 공유할 수 있어요.

## 로컬 미리보기

저장소 루트에서 `python3 -m http.server 8000`을 실행하고 `http://localhost:8000/?layout-preview=1#result`를 엽니다. 미리보기 화면에는 명시적으로 예시 장면이 표시됩니다. 일반 결과는 API에서 검증된 장면으로 생성됩니다. 성사 확률은 날짜, 소원, 이모지 조합으로 계산한 포모지 시뮬레이션 값입니다.

## 운영 API 배포

정적 사이트와 같은 도메인의 `POST /api/fortune` 요청을 Cloudflare Worker가 받습니다. 서버는 날짜, 소원 ID, 이모지 네 개와 `server/fortune-prompt.mjs`의 프롬프트로 OpenAI Responses API를 호출합니다. 응답을 검증한 뒤 미래 장면, 시각, 확률과 문자 그림 종류를 반환합니다.

1. Cloudflare 계정 권한으로 `npx wrangler deploy --config wrangler.fortune.toml`을 실행합니다. 설정은 `4moji.702studio.xyz/api/fortune`에만 Worker를 연결하며 모델은 기본값 `gpt-5.4-mini`를 사용합니다.
2. `npx wrangler secret put OPENAI_API_KEY --config wrangler.fortune.toml`을 실행하고 프롬프트에서 키를 입력합니다. Cloudflare의 Worker 설정에서 `OPENAI_API_KEY`를 Secret으로 추가해도 됩니다.
3. 운영 사이트에서 날짜, 소원, 이모지 네 개를 넣고 생성 결과를 확인합니다. 결과에 이모지가 섞인 응답이나 생성 실패·시간 초과는 재시도 안내로 처리합니다.

응답의 `art`는 기존 문자 그림을 선택하고, `visual_cue`는 이후 장면별 문자 그림 제작에 사용할 사물과 움직임을 담습니다.
