# RoboQuo 운영자 LINE·카카오톡 신규 메시지 알림 준비

상태: **구현 준비 / 운영 연결 및 알림 미활성화** (2026-11-16)

## 목적
RoboQuo 자체 채팅은 그대로 유지합니다. `marketplace_messages`에 새로운 거래 문의/답변이 저장되면
사이트 운영자의 개인 LINE과 카카오톡으로 **알림만** 전달합니다. 개인 메신저로 고객 대화를 이전하거나
답장하는 양방향 기능은 포함하지 않습니다.

알림 예: '🔔 RoboQuo 새 거래 메시지 / 새 문의가 도착했습니다. / RoboQuo에 로그인해 내용을 확인하세요.'
고객 성명·전화번호·개인정보·대화 전문은 외부 메신저로 보내지 않습니다.

## 운영 연결 전에 필요한 두 서비스
1. **LINE (권장, 우선 연결)**
   - [LINE Official Account Manager](https://manager.line.biz/)에서 'RoboQuo' 공식 계정 생성
   - [LINE Developers](https://developers.line.biz/)에서 Messaging API 채널 활성화
   - 운영자 개인 LINE으로 공식 계정을 친구 추가
   - 채널 액세스 토큰과 수신할 개인 LINE 사용자 ID를 서버 환경설정에 등록
   - 구형 LINE Notify는 2025년 3월 종료. 사용하지 않음
   - 공식 문서: https://developers.line.biz/en/docs/messaging-api/sending-messages/
2. **카카오톡**
   - [카카오 디벨로퍼스](https://developers.kakao.com/console/app)에서 RoboQuo 앱 준비
   - 카카오 로그인 활성화, 등록 도메인 및 Redirect URI 설정
   - `talk_message` 동의항목 설정 후 운영자 본인에게 로그인 동의 요청
   - '나에게 보내기' API로 카카오톡 '나와의 채팅'에 알림 가능
   - **주의:** REST API 액세스 토큰은 보통 몇 시간 만에 만료되므로 서버에
     안전한 OAuth 토큰 갱신·저장 기능을 구현한 다음 운영 활성화.
     `KAKAO_OWNER_ACCESS_TOKEN` 단독 등록은 단기 시험용이며 운영 수단이 아님.
   - 공식 문서: https://developers.kakao.com/docs/ko/kakaotalk-message/rest-api

## GitHub 사전 코드
- `supabase/functions/roboquo-owner-alerts/index.ts`: Supabase Edge Function 수신기
- `supabase/functions/roboquo-owner-alerts/notifications.mjs`: LINE Messaging API Push, Kakao '나에게 보내기' 요청
- `tests/owner-notifications-regression.mjs`: 테스트용 가짜 수신 서버 검증
- `supabase/config.toml`: Edge webhook API JWT 확인 대신 32자 이상 공유 비밀로 인증

## 서버 환경변수 (Supabase Edge Function Secrets에서만 입력)
- `ROBOQUO_OWNER_ALERTS_ENABLED`: 최초 `false`, 연결 및 테스트를 마친 다음에만 `true`
- `ROBOQUO_OWNER_ALERT_WEBHOOK_SECRET`: 충분히 무작위인 32자 이상 문자열
- `LINE_OWNER_CHANNEL_ACCESS_TOKEN`: LINE 공식 계정 Messaging API 토큰
- `LINE_OWNER_USER_ID`: 운영자 개인 LINE의 `U...` 사용자 ID
- `KAKAO_OWNER_ACCESS_TOKEN`: 카카오 자기 계정 OAuth 인증 후 발행하는 *단기 시험용* 액세스 토큰. 
  실제 운영은 refresh token 자동 교체와 안전한 저장을 구현한 뒤 사용.

**비밀번호·토큰·개인 LINE ID를 GitHub 코드, 고객 브라우저, ChatGPT 메시지에 넣지 말 것.**
Supabase Vault 또는 Edge Function Secrets와 관리자만 접근하는 OAuth 화면을 사용하세요.

## DB 이벤트 연결 (운영자 승인과 테스트 후에만 수행)
Supabase Dashboard > Database > Webhooks에서 `public.marketplace_messages`의 `INSERT`를 대상으로
Edge Function `roboquo-owner-alerts`를 설정합니다. 웹훅 요청 헤더
`x-roboquo-owner-alert-secret`에 동일한 서버 비밀을 전달합니다.
정식 운용에서는 고객 메시지 본문 전체를 담은 기본 webhook보다 새 행의 `id`와
`conversation_id`만 보내는 최소 데이터 트리거를 권장합니다.

서명 없는 호출이나 허위 이벤트는 거부하며, 알림만 메신저로 나갑니다.
다른 고객의 구매/판매 대화를 운영자가 열람할 권한은 별도 서비스 정책·고객 고지가 필요합니다.

## 완료 전 확인 조건
- [x] 메시지 저장 테이블과 자체 채팅 소스 확인
- [x] LINE/Kakao 공식 API 방식 확인
- [x] 공유 비밀이 없으면 동작하지 않는 서버 코드 및 모의 테스트 마련
- [ ] 사용자 소유 LINE 공식 계정 승인 및 개인 LINE 친구 추가
- [ ] 카카오 개발자 앱·본인 OAuth 동의, 안전한 자동 토큰 갱신 구현
- [ ] 프로덕션 환경변수 안전하게 등록
- [ ] Webhook 연결 및 운영자 동의 확인
- [ ] 양 플랫폼별 본인 단말 실수신 확인
- [ ] 고객정보 보호, 알림 중복방지 및 장애 알림 검증

현재는 위 마지막 항목들이 완료되지 않았으므로 **알림이 실제 LINE 또는 카카오톡으로 오지 않습니다.**
