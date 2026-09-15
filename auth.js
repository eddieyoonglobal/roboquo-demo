// RoboQuo v23 — real Supabase Auth (public client key only)
(() => {
  const copy={
    en:{login:'Sign in',signup:'Create account',name:'Name',email:'Email',password:'Password',passwordHint:'At least 8 characters',account:'My RoboQuo',signedIn:'Signed in',signout:'Sign out',create:'Create account',have:'Already have an account?',newq:'New to RoboQuo?',confirm:'Check your email to confirm your RoboQuo account.',welcome:'Welcome to RoboQuo.',failed:'Could not continue. Please check your details.',pw:'Please enter a password with at least 8 characters.',needLogin:'Sign in or create an account to continue.',member:'RoboQuo member',close:'Close'},
    ja:{login:'ログイン',signup:'アカウント作成',name:'お名前',email:'メールアドレス',password:'パスワード',passwordHint:'8文字以上',account:'My RoboQuo',signedIn:'ログイン中',signout:'ログアウト',create:'アカウントを作成',have:'アカウントをお持ちですか？',newq:'RoboQuoを初めて利用しますか？',confirm:'確認メールを送信しました。メール内のリンクから登録を完了してください。',welcome:'RoboQuoへようこそ。',failed:'処理できませんでした。入力内容をご確認ください。',pw:'パスワードは8文字以上で入力してください。',needLogin:'続けるにはログインまたはアカウント作成が必要です。',member:'RoboQuoメンバー',close:'閉じる'},
    ko:{login:'로그인',signup:'회원가입',name:'이름',email:'이메일',password:'비밀번호',passwordHint:'8자 이상',account:'내 RoboQuo',signedIn:'로그인 중',signout:'로그아웃',create:'계정 만들기',have:'이미 계정이 있나요?',newq:'RoboQuo가 처음인가요?',confirm:'확인 메일을 보냈습니다. 이메일의 링크를 눌러 가입을 완료하세요.',welcome:'RoboQuo에 로그인했습니다.',failed:'처리하지 못했습니다. 입력 내용을 확인하세요.',pw:'비밀번호는 8자 이상 입력하세요.',needLogin:'계속하려면 로그인 또는 회원가입이 필요합니다.',member:'RoboQuo 회원',close:'닫기'},
    zh:{login:'登录',signup:'注册',name:'姓名',email:'电子邮件',password:'密码',passwordHint:'至少8位',account:'我的 RoboQuo',signedIn:'已登录',signout:'退出登录',create:'创建账户',have:'已有账户？',newq:'第一次使用 RoboQuo？',confirm:'确认邮件已发送。请点击邮件中的链接完成注册。',welcome:'欢迎来到 RoboQuo。',failed:'操作失败，请检查输入信息。',pw:'密码至少需要8位。',needLogin:'请登录或注册后继续。',member:'RoboQuo 会员',close:'关闭'},
    de:{login:'Anmelden',signup:'Konto erstellen',name:'Name',email:'E-Mail',password:'Passwort',passwordHint:'Mindestens 8 Zeichen',account:'Mein RoboQuo',signedIn:'Angemeldet',signout:'Abmelden',create:'Konto erstellen',have:'Bereits registriert?',newq:'Neu bei RoboQuo?',confirm:'Bestätigungs-E-Mail wurde gesendet. Bitte den Link in der E-Mail öffnen.',welcome:'Willkommen bei RoboQuo.',failed:'Vorgang fehlgeschlagen. Bitte Eingaben prüfen.',pw:'Das Passwort muss mindestens 8 Zeichen lang sein.',needLogin:'Bitte anmelden oder ein Konto erstellen, um fortzufahren.',member:'RoboQuo Mitglied',close:'Schließen'},
    fr:{login:'Se connecter',signup:'Créer un compte',name:'Nom',email:'E-mail',password:'Mot de passe',passwordHint:'8 caractères minimum',account:'Mon RoboQuo',signedIn:'Connecté',signout:'Se déconnecter',create:'Créer un compte',have:'Vous avez déjà un compte ?',newq:'Nouveau sur RoboQuo ?',confirm:'Un e-mail de confirmation a été envoyé. Ouvrez le lien pour terminer l’inscription.',welcome:'Bienvenue sur RoboQuo.',failed:'Impossible de continuer. Vérifiez les informations saisies.',pw:'Le mot de passe doit contenir au moins 8 caractères.',needLogin:'Connectez-vous ou créez un compte pour continuer.',member:'Membre RoboQuo',close:'Fermer'},
    es:{login:'Iniciar sesión',signup:'Crear cuenta',name:'Nombre',email:'Correo electrónico',password:'Contraseña',passwordHint:'Mínimo 8 caracteres',account:'Mi RoboQuo',signedIn:'Sesión iniciada',signout:'Cerrar sesión',create:'Crear cuenta',have:'¿Ya tienes una cuenta?',newq:'¿Nuevo en RoboQuo?',confirm:'Se ha enviado un correo de confirmación. Abre el enlace para completar el registro.',welcome:'Bienvenido a RoboQuo.',failed:'No se pudo continuar. Revisa los datos.',pw:'La contraseña debe tener al menos 8 caracteres.',needLogin:'Inicia sesión o crea una cuenta para continuar.',member:'Miembro de RoboQuo',close:'Cerrar'},
    it:{login:'Accedi',signup:'Crea account',name:'Nome',email:'E-mail',password:'Password',passwordHint:'Almeno 8 caratteri',account:'Il mio RoboQuo',signedIn:'Accesso effettuato',signout:'Esci',create:'Crea account',have:'Hai già un account?',newq:'Nuovo su RoboQuo?',confirm:'È stata inviata un’e-mail di conferma. Apri il link per completare la registrazione.',welcome:'Benvenuto su RoboQuo.',failed:'Impossibile continuare. Controlla i dati inseriti.',pw:'La password deve contenere almeno 8 caratteri.',needLogin:'Accedi o crea un account per continuare.',member:'Membro RoboQuo',close:'Chiudi'},
    pt:{login:'Entrar',signup:'Criar conta',name:'Nome',email:'E-mail',password:'Senha',passwordHint:'Pelo menos 8 caracteres',account:'Meu RoboQuo',signedIn:'Conectado',signout:'Sair',create:'Criar conta',have:'Já tem uma conta?',newq:'Novo no RoboQuo?',confirm:'Enviamos um e-mail de confirmação. Abra o link para concluir o cadastro.',welcome:'Bem-vindo ao RoboQuo.',failed:'Não foi possível continuar. Verifique os dados.',pw:'A senha deve ter pelo menos 8 caracteres.',needLogin:'Entre ou crie uma conta para continuar.',member:'Membro RoboQuo',close:'Fechar'},
    vi:{login:'Đăng nhập',signup:'Tạo tài khoản',name:'Tên',email:'Email',password:'Mật khẩu',passwordHint:'Ít nhất 8 ký tự',account:'RoboQuo của tôi',signedIn:'Đã đăng nhập',signout:'Đăng xuất',create:'Tạo tài khoản',have:'Đã có tài khoản?',newq:'Mới dùng RoboQuo?',confirm:'Email xác nhận đã được gửi. Hãy mở liên kết trong email để hoàn tất đăng ký.',welcome:'Chào mừng đến với RoboQuo.',failed:'Không thể tiếp tục. Vui lòng kiểm tra thông tin.',pw:'Mật khẩu phải có ít nhất 8 ký tự.',needLogin:'Đăng nhập hoặc tạo tài khoản để tiếp tục.',member:'Thành viên RoboQuo',close:'Đóng'}
  };
  const errorCopy={
    en:{invalid:'Email or password is incorrect.',exists:'An account already exists for this email.',unconfirmed:'Confirm your email before signing in.',rate:'Too many attempts. Please wait and try again.',network:'Check your connection and try again.',disabled:'Account registration is currently unavailable.',email:'Enter a valid email address.',weak:'Use a stronger password with at least 8 characters.'},
    ja:{invalid:'メールアドレスまたはパスワードが正しくありません。',exists:'このメールアドレスのアカウントはすでに存在します。',unconfirmed:'メール確認を完了してからログインしてください。',rate:'試行回数が多すぎます。しばらく待ってから再度お試しください。',network:'通信状況を確認して再度お試しください。',disabled:'現在、アカウント登録を利用できません。',email:'有効なメールアドレスを入力してください。',weak:'8文字以上のより安全なパスワードを設定してください。'},
    ko:{invalid:'이메일 또는 비밀번호가 올바르지 않습니다.',exists:'이미 이 이메일로 만든 계정이 있습니다.',unconfirmed:'이메일 확인을 완료한 뒤 로그인해주세요.',rate:'시도 횟수가 많습니다. 잠시 후 다시 시도해주세요.',network:'인터넷 연결을 확인한 뒤 다시 시도해주세요.',disabled:'현재 회원가입을 이용할 수 없습니다.',email:'올바른 이메일 주소를 입력해주세요.',weak:'8자 이상의 더 안전한 비밀번호를 사용해주세요.'},
    zh:{invalid:'邮箱或密码不正确。',exists:'此邮箱已注册账户。',unconfirmed:'请先完成邮箱验证后再登录。',rate:'尝试次数过多，请稍后重试。',network:'请检查网络连接后重试。',disabled:'当前无法注册账户。',email:'请输入有效的邮箱地址。',weak:'请使用至少8位的更强密码。'},
    de:{invalid:'E-Mail oder Passwort ist falsch.',exists:'Für diese E-Mail besteht bereits ein Konto.',unconfirmed:'Bitte zuerst die E-Mail bestätigen.',rate:'Zu viele Versuche. Bitte später erneut versuchen.',network:'Verbindung prüfen und erneut versuchen.',disabled:'Die Registrierung ist derzeit nicht verfügbar.',email:'Bitte eine gültige E-Mail eingeben.',weak:'Bitte ein stärkeres Passwort mit mindestens 8 Zeichen verwenden.'},
    fr:{invalid:'L’adresse e-mail ou le mot de passe est incorrect.',exists:'Un compte existe déjà pour cette adresse.',unconfirmed:'Confirmez votre e-mail avant de vous connecter.',rate:'Trop de tentatives. Réessayez plus tard.',network:'Vérifiez votre connexion puis réessayez.',disabled:'La création de compte est indisponible.',email:'Saisissez une adresse e-mail valide.',weak:'Utilisez un mot de passe plus robuste d’au moins 8 caractères.'},
    es:{invalid:'El correo o la contraseña son incorrectos.',exists:'Ya existe una cuenta con este correo.',unconfirmed:'Confirma tu correo antes de iniciar sesión.',rate:'Demasiados intentos. Espera y vuelve a intentarlo.',network:'Comprueba la conexión y vuelve a intentarlo.',disabled:'El registro no está disponible actualmente.',email:'Introduce un correo válido.',weak:'Usa una contraseña más segura de al menos 8 caracteres.'},
    it:{invalid:'E-mail o password non corretti.',exists:'Esiste già un account per questa e-mail.',unconfirmed:'Conferma l’e-mail prima di accedere.',rate:'Troppi tentativi. Riprova più tardi.',network:'Controlla la connessione e riprova.',disabled:'La registrazione non è al momento disponibile.',email:'Inserisci un indirizzo e-mail valido.',weak:'Usa una password più sicura di almeno 8 caratteri.'},
    pt:{invalid:'E-mail ou senha incorretos.',exists:'Já existe uma conta para este e-mail.',unconfirmed:'Confirme o e-mail antes de entrar.',rate:'Muitas tentativas. Aguarde e tente novamente.',network:'Verifique a conexão e tente novamente.',disabled:'O cadastro está indisponível no momento.',email:'Digite um e-mail válido.',weak:'Use uma senha mais forte com pelo menos 8 caracteres.'},
    vi:{invalid:'Email hoặc mật khẩu không đúng.',exists:'Email này đã có tài khoản.',unconfirmed:'Hãy xác nhận email trước khi đăng nhập.',rate:'Quá nhiều lần thử. Vui lòng đợi rồi thử lại.',network:'Kiểm tra kết nối và thử lại.',disabled:'Hiện chưa thể đăng ký tài khoản.',email:'Nhập địa chỉ email hợp lệ.',weak:'Dùng mật khẩu mạnh hơn với ít nhất 8 ký tự.'}
  };
  const lang=()=>document.documentElement.lang||'en';
  const tx=k=>(copy[lang()]||copy.en)[k]||copy.en[k]||k;
  const PROD_ORIGIN='https://roboquo.com';
  const PENDING_KEY='rqPendingAuthV24';
  let client=null,session=null,pending=null;
  function pendingFromUrl(){try{return new URLSearchParams(location.search).get('resume')==='sell'?{type:'publishSell',target:'Sell a Robot'}:null}catch(_){return null}}
  function loadPending(){try{return JSON.parse(localStorage.getItem(PENDING_KEY)||'null')||pendingFromUrl()}catch(_){return pendingFromUrl()}}
  function clearResumeParam(){try{const url=new URL(location.href);if(!url.searchParams.has('resume'))return;url.searchParams.delete('resume');history.replaceState({},'',url.pathname+(url.search?url.search:'')+url.hash);}catch(_){}}
  function savePending(v){pending=v||null;if(v)localStorage.setItem(PENDING_KEY,JSON.stringify(v));else{localStorage.removeItem(PENDING_KEY);clearResumeParam();}}
  function authRedirectUrl(){const url=new URL(`${PROD_ORIGIN}/`);const p=pending||loadPending();if(p&&['sell','publishSell'].includes(p.type))url.searchParams.set('resume','sell');return url.toString();}
  window.rqAuthSession=null;
  function esc2(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function setSession(s){session=s||null;window.rqAuthSession=session;const b=document.getElementById('myRoboquoBtn');if(b&&session?.user?.email)b.title=session.user.email;document.dispatchEvent(new CustomEvent('rq:authchange',{detail:{signedIn:Boolean(session)}}));}
  function authModal(mode='login',type='generic',target='RoboQuo',savedEmail=''){
    savePending({type,target});
    const signup=mode==='signup';
    const seller=window.rqGetSellContact?.()||{};const email=savedEmail||seller.contactEmail||'';const name=seller.contactName||'';
    openModal(`<div class="kicker">${esc2(tx('account'))}</div><div class="auth-switch"><button class="${!signup?'active':''}" onclick="rqShowAuth('login')" type="button">${esc2(tx('login'))}</button><button class="${signup?'active':''}" onclick="rqShowAuth('signup')" type="button">${esc2(tx('signup'))}</button></div><h2>${esc2(signup?tx('signup'):tx('login'))}</h2><p>${esc2(tx('needLogin'))}</p><form onsubmit="event.preventDefault();rqSubmitAuth('${signup?'signup':'login'}')">${signup?`<label>${esc2(tx('name'))}<input id="rqAuthName" autocomplete="name" value="${esc2(name)}" required></label>`:''}<label>${esc2(tx('email'))}<input id="rqAuthEmail" type="email" autocomplete="email" inputmode="email" value="${esc2(email)}" placeholder="name@company.com" required></label><label>${esc2(tx('password'))}<input id="rqAuthPassword" type="password" autocomplete="${signup?'new-password':'current-password'}" minlength="8" placeholder="${esc2(tx('passwordHint'))}" required></label><div aria-live="assertive" id="rqAuthError" class="auth-error" role="alert"></div><div class="modal-actions"><button class="secondary" onclick="closeModal()" type="button">${esc2(tx('close'))}</button><button class="primary" type="submit">${esc2(signup?tx('create'):tx('login'))}</button></div></form>`);
  }
  window.rqShowAuth=(mode)=>authModal(mode,pending?.type||'generic',pending?.target||'RoboQuo',(document.getElementById('rqAuthEmail')?.value||'').trim());
  function errMsg(msg){const el=document.getElementById('rqAuthError');if(el)el.textContent=msg||tx('failed');}
  function authErrorMessage(error){const c=errorCopy[lang()]||errorCopy.en;const code=String(error?.code||'').toLowerCase();if(!navigator.onLine||code==='network_error')return c.network;if(['invalid_credentials','invalid_grant'].includes(code))return c.invalid;if(code==='email_not_confirmed')return c.unconfirmed;if(['user_already_exists','email_exists','identity_already_exists'].includes(code))return c.exists;if(['over_email_send_rate_limit','over_request_rate_limit','too_many_requests'].includes(code)||error?.status===429)return c.rate;if(code==='signup_disabled')return c.disabled;if(['email_address_invalid','validation_failed'].includes(code))return c.email;if(code==='weak_password')return c.weak;return tx('failed');}
  async function resume(){const p=pending||loadPending();savePending(null);closeModal();if(!p)return;if(p.type==='bid'&&window.openBid)return window.openBid(p.target);if((p.type==='sell'||p.type==='publishSell')&&window.rqStartSell)return window.rqStartSell();if(window.toast)toast(`${p.target}: ${tx('welcome')}`);}
  window.rqSubmitAuth=async(mode)=>{
    if(!client)return errMsg(tx('failed'));
    const email=(document.getElementById('rqAuthEmail')?.value||'').trim();
    const password=document.getElementById('rqAuthPassword')?.value||'';
    const name=(document.getElementById('rqAuthName')?.value||'').trim();
    if(!email.includes('@'))return errMsg((errorCopy[lang()]||errorCopy.en).email);
    if(password.length<8)return errMsg(tx('pw'));
    errMsg('');
    try{
      if(mode==='signup'){
        const seller=window.rqGetSellContact?.()||{};
        const {data,error}=await client.auth.signUp({email,password,options:{data:{display_name:name,language:lang(),company_name:seller.companyName||'',contact_name:seller.contactName||name,phone:seller.contactPhone||''},emailRedirectTo:authRedirectUrl()}});
        if(error)throw error;
        if(data.session){setSession(data.session);localStorage.removeItem('rqUserEmail');if(window.toast)toast(tx('welcome'));await resume();}
        else {errMsg(tx('confirm'));}
      }else{
        const {data,error}=await client.auth.signInWithPassword({email,password});if(error)throw error;setSession(data.session);localStorage.removeItem('rqUserEmail');if(window.toast)toast(tx('welcome'));await resume();
      }
    }catch(e){console.warn('RoboQuo auth',e?.code||e?.status||'error');errMsg(authErrorMessage(e));}
  };
  window.rqRequireAuth=(type='generic',target='RoboQuo')=>{if(session)return true;authModal('login',type,target);return false;};
  // Override the v22 email-only demo access modal.
  window.openAuth=(type,target)=>{if(session){savePending({type,target});return resume();}authModal('login',type,target);};
  window.rqOpenAccount=()=>{
    if(!session)return authModal('login','account','RoboQuo');
    const email=session.user.email||'';const meta=session.user.user_metadata||{};const name=meta.display_name||meta.contact_name||'';
    openModal(`<div class="kicker">${esc2(tx('account'))}</div><h2>${esc2(name||email||tx('member'))}</h2><p>${esc2(tx('signedIn'))}: ${esc2(email)}</p><div class="tag-row"><span>${esc2(tx('member'))}</span>${meta.company_name?`<span>${esc2(meta.company_name)}</span>`:''}</div><div id="rqSellerAccount" class="seller-account" aria-live="polite"></div><div class="modal-actions"><button class="secondary" onclick="closeModal()">${esc2(tx('close'))}</button><button class="primary" onclick="rqSignOut()">${esc2(tx('signout'))}</button></div>`);
    window.rqRenderSellerAccount?.(client,session);
  };
  window.rqSignOut=async()=>{if(client)await client.auth.signOut();setSession(null);closeModal();};
  async function init(){
    try{
      if(!window.supabase||!window.RQ_SUPABASE_URL||!window.RQ_SUPABASE_PUBLISHABLE_KEY){console.warn('RoboQuo Auth: Supabase config missing');return;}
      pending=loadPending();
      client=window.supabase.createClient(window.RQ_SUPABASE_URL,window.RQ_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
      window.rqSupabase=client;
      const {data}=await client.auth.getSession();setSession(data?.session||null);document.dispatchEvent(new CustomEvent('rq:authready'));
      if(data?.session&&pending)setTimeout(()=>resume(),120);
      client.auth.onAuthStateChange((event,s)=>{setSession(s);if(s&&(event==='SIGNED_IN'||event==='USER_UPDATED')&&loadPending()){pending=loadPending();setTimeout(()=>resume(),120);}});
    }catch(e){console.warn('RoboQuo Auth init',e);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
