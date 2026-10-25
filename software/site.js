/* RoboQuo Software: static, search-indexable pages with EN / JA / KO content. */
(() => {
  const translations = {
    en: {
      market:"Marketplace",software:"Software",preview:"Product preview",developed:"Developed by RoboQuo", learn:"Explore product", inquire:"Request information", inquireTrial:"Ask about trial access",
      homeEyebrow:"ROBOQUO SOFTWARE",homeTitle:"Tools for better robot applications.",homeLead:"Independent desktop tools for gripper analysis and force/torque diagnostics. Explore the products being prepared by RoboQuo.",
      homeSubtitle:"Two focused tools. One robotics workspace.",homeSublead:"Practical software for engineers, automation teams and technical support professionals.",
      smartTag:"Gripper control & analysis",hexTag:"Force/torque diagnostics",
      smartCard:"Explore gripper control, automated test routines and grasp analysis with a focus on finding suitable gripping settings.",
      hexCard:"Record and review force/torque data, zeroing activity and diagnostic events for investigation and reporting.",
      processTitle:"From product information to access",processLead:"Trial and licensing are being prepared. No online purchase or automatic license delivery is available yet.",
      step1:"Review",step1d:"Check capabilities and your robot / hardware configuration.",step2:"Contact",step2d:"Request compatibility confirmation and trial details.",step3:"Evaluate",step3d:"Test the approved build before any commercial licensing decision.",
      independence:"Independently developed software. RoboQuo is not affiliated with, sponsored by or endorsed by OnRobot. OnRobot and its product names are trademarks of their respective owners. Compatibility and availability require confirmation.",
      smartLead:"Analyze gripping behavior. Tune with greater confidence.",smartBody:"Smart Grip Studio is a RoboQuo-developed independent application intended for studying and controlling compatible OnRobot grippers through supported interfaces. Features and model coverage are being validated.",
      smartF1:"Gripper operation",smartF1d:"Manual open / close commands and guided test cycles for a supported setup.",
      smartF2:"Grip-force exploration",smartF2d:"Review how different gripping-force settings behave during controlled evaluations.",
      smartF3:"Contact & width",smartF3d:"Visualize measured width, contact behavior and related grasp information.",
      smartF4:"Flexible configurations",smartF4d:"Design targets include single and dual gripper arrangements; each combination must be checked.",
      smartF5:"Session records",smartF5d:"Planned operator-controlled log capture for test reviews and comparisons.",
      smartF6:"Multilingual workflow",smartF6d:"Japanese and Korean interface options are part of the planned user experience.",
      hexLead:"Turn force/torque signals into useful diagnostic evidence.",hexBody:"HEX Diagnostic Studio is an independently developed RoboQuo tool for reviewing signals and preparing diagnostics with compatible OnRobot HEX hardware. Hardware and connection requirements must be confirmed.",
      hexF1:"Live signal overview",hexF1d:"Visualize available force and torque channels to support troubleshooting.",
      hexF2:"Zeroing support",hexF2d:"Support controlled zeroing and observe relevant device states where available.",
      hexF3:"Event capture",hexF3d:"Record notable incidents and operator observations for later review.",
      hexF4:"Exportable reports",hexF4d:"PDF and spreadsheet-style report export is included in the development scope.",
      hexF5:"Diagnostic sessions",hexF5d:"Capture bounded sessions rather than permanently recording everything.",
      hexF6:"Technical support",hexF6d:"Organize information useful for investigation, maintenance and escalation.",
      compatibility:"Compatibility and requirements",compatLead:"Software behavior depends on hardware, Compute Box, cabling, protocol, firmware, and operating environment. Verify your exact setup before use.",
      availability:"Preview only — prices, downloads and licensing are not active.",visualNote:"Illustrative interface only · Not a screenshot of the software",onrobotDesc:"Independent software intended for compatible OnRobot hardware",questions:"Interested in evaluating a product?",questionsDesc:"Contact RoboQuo with your device model, robot/controller, connection method and intended application.",getInTouch:"Contact RoboQuo",
      smartCompat1:"Target product families",smartCompat2:"Setup validation",smartCompat3:"Availability",smartCompat1v:"RG2 / RG6 / 2FG7 (under validation)",smartCompat2v:"Configuration-dependent",smartCompat3v:"Inquiry / preview",
      hexCompat1:"Hardware",hexCompat2:"Connections",hexCompat3:"Availability",hexCompat1v:"Compatible OnRobot HEX hardware",hexCompat2v:"Compute Box / protocol to verify",hexCompat3v:"Inquiry / preview",
      footer:"RoboQuo Software — independent tools for robotics workflows"
    },
    ja: {
      market:"ロボット市場",software:"ソフトウェア",preview:"製品プレビュー",developed:"RoboQuoが独自開発",learn:"製品を見る",inquire:"お問い合わせ",inquireTrial:"トライアルについて問い合わせ",
      homeEyebrow:"ROBOQUO SOFTWARE",homeTitle:"ロボット活用を支える専門ツール。",homeLead:"グリッパーの解析と力・トルク診断を支援する独立開発のデスクトップソフトウェア。RoboQuoが準備中の製品をご紹介します。",
      homeSubtitle:"2つの専門ツールを、1つのプラットフォームに。",homeSublead:"エンジニア、システムインテグレーター、技術サポート担当者向けの実務ソフトウェア。",
      smartTag:"グリッパー制御・解析",hexTag:"力・トルク診断",
      smartCard:"グリッパー制御、試験サイクル、把持状態の解析を通じて、適切な把持条件の検討を支援します。",
      hexCard:"力・トルクデータ、ゼロ点調整、診断イベントを記録・確認し、調査やレポート作成に活用します。",
      processTitle:"製品確認から利用開始まで",processLead:"トライアルとライセンス制度は準備中です。オンライン決済やライセンスの自動発行はまだ利用できません。",
      step1:"仕様確認",step1d:"機能とロボット・周辺機器の構成を確認。",step2:"お問い合わせ",step2d:"互換性とトライアル条件を確認。",step3:"評価",step3d:"承認されたビルドを検証したうえで導入を判断。",
      independence:"本ソフトウェアはRoboQuoが独立して開発したもので、OnRobot社との提携・後援・公式認証を示すものではありません。OnRobotおよび各製品名は各権利者の商標です。互換性と提供時期は個別に確認が必要です。",
      smartLead:"把持状態を解析し、設定をより確実に。",smartBody:"Smart Grip StudioはRoboQuoが独自開発しているソフトウェアです。対応インターフェースを通じたOnRobot製グリッパーの制御・評価を目的としており、機能と対応機種を検証中です。",
      smartF1:"グリッパー操作",smartF1d:"対応構成での開閉操作とガイド付き試験サイクル。",
      smartF2:"把持力の検討",smartF2d:"試験中の把持力設定ごとの挙動を比較。",
      smartF3:"接触・開口幅",smartF3d:"開口幅や接触挙動などの把持情報を可視化。",
      smartF4:"構成の柔軟性",smartF4d:"シングル／デュアル構成を開発対象とし、組合せごとの検証が必要です。",
      smartF5:"試験ログ",smartF5d:"必要時に開始・停止できるログ記録を検討中です。",
      smartF6:"多言語操作",smartF6d:"日本語・韓国語の操作画面を開発対象としています。",
      hexLead:"力・トルク信号を診断に役立つ情報へ。",hexBody:"HEX Diagnostic Studioは、対応するOnRobot HEXハードウェアの信号確認と診断情報作成を目的とした、RoboQuo独立開発ツールです。接続構成の確認が必要です。",
      hexF1:"信号の可視化",hexF1d:"利用可能な力・トルク信号を表示し、トラブル調査を支援。",
      hexF2:"ゼロ点調整",hexF2d:"対応環境でのゼロ点調整と状態確認を支援。",
      hexF3:"イベント記録",hexF3d:"異常や作業者の所見を記録して後で確認。",
      hexF4:"レポート出力",hexF4d:"PDF・表計算形式の出力を開発対象に含みます。",
      hexF5:"診断セッション",hexF5d:"常時記録ではなく、区切ったセッションでデータを取得。",
      hexF6:"技術サポート",hexF6d:"調査・保守・エスカレーションに役立つ情報を整理。",
      compatibility:"互換性と動作条件",compatLead:"ハードウェア、Compute Box、配線、通信方式、ファームウェア、PC環境によって動作条件が異なります。実機構成を事前にご確認ください。",
      availability:"プレビュー段階 — 価格・ダウンロード・ライセンス販売は未公開です。",visualNote:"画面はイメージです。実際のソフトウェア画面ではありません。",onrobotDesc:"対応するOnRobot製機器向けの独立開発ソフトウェア",questions:"評価をご希望ですか？",questionsDesc:"製品型式、ロボット／コントローラ、接続方法、用途を添えてお問い合わせください。",getInTouch:"RoboQuoに問い合わせる",
      smartCompat1:"対象製品",smartCompat2:"構成",smartCompat3:"提供状況",smartCompat1v:"RG2 / RG6 / 2FG7（検証中）",smartCompat2v:"構成ごとに確認",smartCompat3v:"お問い合わせ／プレビュー",
      hexCompat1:"対象機器",hexCompat2:"接続",hexCompat3:"提供状況",hexCompat1v:"対応するOnRobot HEX機器",hexCompat2v:"Compute Box／通信方式の確認が必要",hexCompat3v:"お問い合わせ／プレビュー",
      footer:"RoboQuo Software — ロボット活用のための独立開発ツール"
    },
    ko: {
      market:"로봇 마켓",software:"소프트웨어",preview:"제품 미리보기",developed:"RoboQuo 독립 개발",learn:"제품 자세히 보기",inquire:"문의하기",inquireTrial:"체험판 문의",
      homeEyebrow:"ROBOQUO SOFTWARE",homeTitle:"로봇 활용을 위한 전문 소프트웨어.",homeLead:"그리퍼 분석과 힘·토크 진단을 지원하는 독립 개발 데스크톱 소프트웨어입니다. RoboQuo가 준비 중인 제품을 소개합니다.",
      homeSubtitle:"두 가지 전문 도구, 하나의 플랫폼.",homeSublead:"엔지니어와 자동화 담당자, 기술지원 전문가를 위한 실무 도구입니다.",
      smartTag:"그리퍼 제어 및 분석",hexTag:"힘·토크 진단",
      smartCard:"그리퍼 제어, 자동 테스트 루틴, 파지 상태 분석을 통해 적절한 파지 조건을 검토하도록 돕습니다.",
      hexCard:"힘·토크 신호, 영점 설정, 진단 이벤트를 기록하고 분석 및 보고서에 활용합니다.",
      processTitle:"제품 확인부터 사용까지",processLead:"체험판과 라이선스는 준비 중이며 온라인 결제 및 라이선스 자동 발급은 아직 지원하지 않습니다.",
      step1:"사양 확인",step1d:"기능과 로봇·하드웨어 구성을 확인합니다.",step2:"문의",step2d:"호환성과 체험판 제공 조건을 확인합니다.",step3:"평가",step3d:"검증된 빌드를 평가한 후 도입을 판단합니다.",
      independence:"RoboQuo가 독립 개발한 소프트웨어로 OnRobot의 공식 제품, 제휴 또는 인증 제품이 아닙니다. OnRobot과 해당 제품명은 각 권리자의 상표입니다. 호환성과 제공 가능 여부는 별도 확인이 필요합니다.",
      smartLead:"파지 상태를 분석하고 설정을 더 정확하게.",smartBody:"Smart Grip Studio는 RoboQuo가 독립 개발 중인 소프트웨어입니다. 지원 인터페이스를 통해 호환 가능한 OnRobot 그리퍼의 제어와 평가를 수행하기 위한 것으로 기능과 모델 범위를 검증하고 있습니다.",
      smartF1:"그리퍼 조작",smartF1d:"지원 환경에서 수동 개폐 및 단계별 시험 동작.",
      smartF2:"파지력 탐색",smartF2d:"파지력 설정에 따른 동작을 제어된 시험에서 비교.",
      smartF3:"접촉 및 폭",smartF3d:"개폐 폭과 접촉 상태 등 파지 정보를 시각화.",
      smartF4:"구성 확장",smartF4d:"싱글 및 듀얼 그리퍼 구성을 검토 중이며 조합별 검증이 필요합니다.",
      smartF5:"시험 기록",smartF5d:"사용자가 시작·정지하는 기록 기능을 개발 대상으로 검토 중.",
      smartF6:"다국어",smartF6d:"일본어·한국어 인터페이스를 개발 목표에 포함.",
      hexLead:"힘·토크 데이터를 진단에 필요한 근거로.",hexBody:"HEX Diagnostic Studio는 호환 가능한 OnRobot HEX 하드웨어의 신호 확인과 진단 정보 작성을 위한 RoboQuo 독립 개발 도구입니다. 하드웨어 및 연결 조건 확인이 필요합니다.",
      hexF1:"실시간 신호",hexF1d:"사용 가능한 힘·토크 신호를 표시해 문제 분석을 지원.",
      hexF2:"영점 조정",hexF2d:"지원 환경에서 영점 조정과 상태 확인을 지원.",
      hexF3:"이벤트 기록",hexF3d:"이상 증상과 작업자 관찰 내용을 기록·검토.",
      hexF4:"보고서 출력",hexF4d:"PDF 및 스프레드시트 형식의 보고서 출력을 개발 범위에 포함.",
      hexF5:"진단 세션",hexF5d:"상시 기록보다 구간별 데이터를 선택해 기록.",
      hexF6:"기술지원",hexF6d:"원인 분석, 유지보수, 본사 문의에 필요한 정보를 정리.",
      compatibility:"호환성과 동작 조건",compatLead:"제품, Compute Box, 배선, 통신, 펌웨어, PC 환경에 따라 동작 조건이 다릅니다. 실제 구성에 대해 사전 확인이 필요합니다.",
      availability:"제품 미리보기 단계 — 가격·다운로드·라이선스 판매는 아직 제공하지 않습니다.",visualNote:"화면은 설명용 이미지이며 실제 소프트웨어 스크린샷이 아닙니다.",onrobotDesc:"호환 가능한 OnRobot 제품을 위한 독립 개발 소프트웨어",questions:"제품 평가를 원하시나요?",questionsDesc:"제품 모델, 로봇/컨트롤러, 연결 방식과 사용 목적을 기재해 문의해 주세요.",getInTouch:"RoboQuo에 문의",
      smartCompat1:"대상 제품",smartCompat2:"구성 검증",smartCompat3:"상태",smartCompat1v:"RG2 / RG6 / 2FG7 (검증 중)",smartCompat2v:"구성별 확인 필요",smartCompat3v:"문의 / 미리보기",
      hexCompat1:"하드웨어",hexCompat2:"연결",hexCompat3:"상태",hexCompat1v:"호환 OnRobot HEX 하드웨어",hexCompat2v:"Compute Box / 프로토콜 확인 필요",hexCompat3v:"문의 / 미리보기",
      footer:"RoboQuo Software — 로봇 작업을 위한 독립 개발 도구"
    }
  };
  const select=document.querySelector('[data-language]');
  const allowed=['en','ja','ko'];
  const query=new URLSearchParams(location.search).get('lang');
  const saved=(()=>{try{return localStorage.getItem('rqSoftwareLanguage')}catch(e){return null}})();
  let language=allowed.includes(query)?query:allowed.includes(saved)?saved:(allowed.includes(navigator.language.slice(0,2))?navigator.language.slice(0,2):'en');
  const apply=()=>{
    document.documentElement.lang=language;
    if(select)select.value=language;
    document.querySelectorAll('[data-i18n]').forEach(element=>{
      const value=translations[language][element.dataset.i18n]||translations.en[element.dataset.i18n];
      if(value)element.textContent=value;
    });
    document.querySelectorAll('a[data-site-link]').forEach(a=>{
      const base=a.dataset.baseHref||a.getAttribute('href');
      a.dataset.baseHref=base;
      a.setAttribute('href',base+'?lang='+language);
    });
  };
  if(select)select.addEventListener('change',()=>{
    language=select.value;
    try{localStorage.setItem('rqSoftwareLanguage',language)}catch(e){}
    const url=new URL(location.href);
    url.searchParams.set('lang',language);
    history.replaceState(null,'',url.pathname+url.search+url.hash);
    apply();
  });
  apply();
})();
