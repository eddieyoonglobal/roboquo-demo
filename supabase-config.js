// RoboQuo public Supabase configuration.
// This publishable key is designed for browser use. Never put secret/service-role keys here.
window.RQ_SUPABASE_URL = 'https://vlwaoawklpxvhbteikwj.supabase.co';
window.RQ_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_lKLzd-RDXX8A3faJqlAEYw_s97SFwYO';

/* The current public configuration points at the operating Supabase database.
   A non-production site may browse it, but should not accidentally create
   users, listings or uploads there while testing. This is a browser UX guard,
   not a substitute for Supabase RLS or isolated staging credentials. */
window.rqCanWriteSupabase=()=>{
  try{
    const productionDb=new URL(window.RQ_SUPABASE_URL).hostname==='vlwaoawklpxvhbteikwj.supabase.co';
    const host=window.location.hostname.toLowerCase();
    return !productionDb||host==='roboquo.com'||host==='www.roboquo.com';
  }catch(_){return false}
};
window.rqPreviewReadOnlyMessage=()=>{
  const copy={
    en:'This Preview uses the live database. Registration and listing submission are disabled until a separate test database is connected.',
    ja:'このプレビューは本番データベースを参照しています。テスト用データベースを接続するまで、会員登録と出品はできません。',
    ko:'이 Preview는 운영 DB를 참조합니다. 별도 테스트 DB를 연결하기 전까지 회원가입과 상품 등록을 제한합니다.',
    zh:'此预览连接正式数据库。接入独立测试数据库之前，暂不允许注册和发布商品。',
    de:'Diese Vorschau nutzt die Live-Datenbank. Registrierung und Inserate sind bis zur Einrichtung einer Testdatenbank gesperrt.',
    fr:'Cet aperçu utilise la base en production. Inscription et annonces sont bloquées sans base de test distincte.',
    es:'Esta vista previa usa la base de datos real. El registro y la publicación se bloquean hasta conectar una base de pruebas.',
    it:'Questa anteprima usa il database attivo. Registrazione e annunci sono bloccati finché manca un database di test.',
    pt:'Esta prévia usa o banco de produção. Cadastros e anúncios ficam bloqueados até conectar um banco de teste.',
    vi:'Bản xem trước đang dùng cơ sở dữ liệu thật. Đăng ký và đăng bán bị chặn đến khi có cơ sở dữ liệu thử nghiệm.'
  };
  return copy[document.documentElement.lang]||copy.en;
};
