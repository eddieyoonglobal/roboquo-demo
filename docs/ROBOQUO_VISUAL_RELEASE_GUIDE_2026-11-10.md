# RoboQuo — 시각화 업데이트 / 배포 전 확인 가이드
작성: 2026-11-10
상태: 개발 Preview / **roboquo.com 운영 미반영**

## 1. 실제 개발 반영 내용

| 위치 | 변경 | 확인 방법 |
|---|---|---|
| 첫 화면 (Marketplace) | 실제 로봇 사진, 장비 그림이 있는 상품 찾기/상품 팔기 카드 | 개발 사이트 첫 진입 |
| 사이트 로고 | RoboQuo 자체 디자인 시안 (SVG) | 헤더 왼쪽 |
| Home | 그림형 Robots / Grippers / Parts 카드 | 헤더 RoboQuo 로고 클릭 |
| Marketplace 필터 | 그림 카드를 누르면 실제 게시물 카테고리와 연결 | Home 그림 카드를 클릭한 뒤 선택 필터 확인 |
| Manufacturers | 제조사명과 일반 로봇/그리퍼 도식 | 상단 Manufacturers 메뉴 |
| Cobot comparison | 공식 사양 모델에 일반 도식 이미지 + 설명용 표시 | Manufacturers → Compare model specifications |
| 시연 가이드 | 사진·카테고리 3장·점검 체크리스트 | `/review.html` |

## 2. 링크

- 개발 미리보기: https://roboquo-demo-git-chatgpt-roboquo-classifieds-i1-e1e52b-robo-quo.vercel.app/
- 배포 전 검토 안내: https://roboquo-demo-git-chatgpt-roboquo-classifieds-i1-e1e52b-robo-quo.vercel.app/review.html
- 소스/변경 기록: https://github.com/eddieyoonglobal/roboquo-demo/pull/9

Vercel Authentication이 활성화되어 있어 접근 계정에 따라 로그인이 필요합니다. 링크는 운영 서비스의 공개 배포를 뜻하지 않습니다.

## 3. 수동 검수 순서

1. 개발 미리보기 주소를 열어 **첫 Marketplace 페이지**에서 사진, 로고, 검색창, 상품 찾기/상품 팔기 카드의 크기와 가독성을 확인
2. 왼쪽 위 **RoboQuo 로고**를 클릭하면 **Home**으로 이동하는지 확인
3. Home의 **Robots / Grippers / Parts** 그림을 순서대로 클릭하여 Marketplace에서 카테고리가 올바르게 선택되는지 확인
4. **Manufacturers** 메뉴에서 협동로봇 40개 브랜드와 국가별 필터, 참고 그림을 확인
5. **Compare model specifications**에서 모델 2~3개를 선택하고, 참고 사양 및 이미지가 설명용임을 확인
6. 일본어·한국어를 전환하고 모바일에서 로고, 로봇 사진, 카드가 잘리지 않고 겹치지 않는지 확인
7. `/review.html`의 6개 체크박스를 이용해 결과 정리

## 4. 이미지 출처 및 권리

- 사이트 로고 및 `assets/rq-robot.svg`, `assets/rq-gripper.svg`, `assets/rq-parts.svg`는 **RoboQuo 개발용 신규 SVG 시안**. 로봇의 실제 브랜드/모델 사진이 아니며 해당 제조사와의 제휴 또는 보증을 의미하지 않습니다.
- 로봇 사진: **Nenad Stojković (Shixart1985)**, Wikimedia Commons, **CC BY 2.0**, https://commons.wikimedia.org/wiki/File:Robot_arm_picks_up_cylindrical_objects_in_a_factory_setting.jpg
- 라이선스: https://creativecommons.org/licenses/by/2.0/
- 사진은 CSS 영역에서 **크롭하여 표시**하며 원본 파일 자체를 변경하지 않습니다. 저작자/라이선스 링크를 사진 근처에 표시했습니다.
- 실제 판매 상품 이미지에는 판매자가 올린 사진만 사용합니다. 설명용 로봇 그림은 실제 재고처럼 표시하지 않습니다.
- 공식 제조사 로고 및 모델별 사진은 권리·출처 확인 후 별도 추가합니다. 현재 브랜드 이름은 텍스트를 이용합니다.

## 5. 정식 운영 전 체크

**UI/브라우저 자동 테스트 통과는 실제 판매 운영 검증과 다릅니다.**

- 격리된 Supabase staging에 DB migration 006 적용 후 Auth/RLS/Storage 검증
- 구매자·판매자 실계정으로 사진 등록/조회/삭제, 거래 채팅·권한 검증
- 다국어·모바일 교차 브라우저 테스트 및 실제 사진의 로딩 성능
- 개인정보 처리·이용약관, 이미지 저작권, 공식 제휴 표기 검토
- Vercel 프로젝트 접근 권한 및 운영 도메인 연결 확인
- 운영 사이트 배포는 **별도 승인·검수 후 진행**; PR #9 개발/Preview에서 바로 production을 덮어쓰지 않음

## 6. 2026-11-10 — 마켓 첫 화면 개선 (추가)

- 첫 Marketplace 화면에 **로봇 / 그리퍼·EOAT / 부품·컨트롤러** 3개의 그림형 카테고리 버튼을 추가했습니다.
- 선택 시 `#categoryFilter`와 실제 매물 검색 조건이 동기화됩니다. 선택 카드의 강조 및 `aria-pressed` 상태도 반영했습니다.
- **전체 상품 보기** 버튼으로 검색어, 카테고리, 국가, 상품 상태 필터를 한 번에 초기화할 수 있습니다.
- 일본어·한국어 및 전체 10개 언어에서 카테고리 설명과 버튼 이름을 표시하며, 스마트폰 가로 넘침을 방지하도록 레이아웃을 조정했습니다.
- 자동 검사에서 발견된 `querySelector` / `querySelectorAll` 혼용 오류를 수정했습니다. 기존 Home 카드와 새로운 Marketplace 카드가 중복 선택되지 않도록 브라우저 테스트도 보완했습니다.
- 최종 브라우저·회귀·DB 스키마 자동 테스트 통과: https://github.com/eddieyoonglobal/roboquo-demo/actions/runs/42744765500
- 최종 커밋: `9852233dfe616444a80e3f4d9dc4d3a823002347`
- GitHub Vercel 배포 상태 **success** (개발 Preview). 운영 `main` 및 `roboquo.com` 미변경.

**검수 추가 항목:** RoboQuo 개발 사이트에 접속해 첫 화면의 세 그림 카드를 각각 클릭하고, 각 카테고리의 선택 및 전체 상품 보기 초기화가 동작하는지 확인하세요.
