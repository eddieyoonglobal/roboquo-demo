// RoboQuo v24.5 — authenticated seller listings, private contacts and owner deletion
(() => {
  const BUCKET='listing-photos';
  const copy={
    en:{title:'My listings',loading:'Loading your listings…',empty:'You have no submitted listings yet.',pending:'Pending review',draft:'Draft',published:'Published',rejected:'Needs changes',sold:'Sold',remove:'Delete',confirm:'Delete this listing and its uploaded photos? This cannot be undone.',deleted:'Listing deleted.',failed:'Could not load your listings.',setup:'Seller database update is not installed yet.',deleteFailed:'Could not delete the listing. Please try again.'},
    ja:{title:'出品管理',loading:'出品を読み込んでいます…',empty:'提出済みの出品はまだありません。',pending:'審査中',draft:'下書き',published:'公開中',rejected:'修正が必要',sold:'売却済み',remove:'削除',confirm:'この出品とアップロード済み写真を削除しますか？元に戻せません。',deleted:'出品を削除しました。',failed:'出品を読み込めませんでした。',setup:'販売用データベースの更新がまだ適用されていません。',deleteFailed:'出品を削除できませんでした。もう一度お試しください。'},
    ko:{title:'내 매물',loading:'매물을 불러오는 중…',empty:'아직 검수 요청한 매물이 없습니다.',pending:'검수 대기',draft:'임시 저장',published:'공개 중',rejected:'수정 필요',sold:'판매 완료',remove:'삭제',confirm:'이 매물과 업로드된 사진을 삭제할까요? 삭제 후에는 복구할 수 없습니다.',deleted:'매물을 삭제했습니다.',failed:'매물을 불러오지 못했습니다.',setup:'판매용 데이터베이스 업데이트가 아직 적용되지 않았습니다.',deleteFailed:'매물을 삭제하지 못했습니다. 다시 시도해주세요.'},
    zh:{title:'我的商品',loading:'正在加载商品…',empty:'尚无已提交商品。',pending:'待审核',draft:'草稿',published:'已发布',rejected:'需要修改',sold:'已售出',remove:'删除',confirm:'删除此商品及已上传照片？此操作无法撤销。',deleted:'商品已删除。',failed:'无法加载商品。',setup:'卖家数据库更新尚未安装。',deleteFailed:'无法删除商品，请重试。'},
    de:{title:'Meine Inserate',loading:'Inserate werden geladen…',empty:'Noch keine eingereichten Inserate.',pending:'In Prüfung',draft:'Entwurf',published:'Veröffentlicht',rejected:'Änderungen nötig',sold:'Verkauft',remove:'Löschen',confirm:'Inserat und hochgeladene Fotos unwiderruflich löschen?',deleted:'Inserat gelöscht.',failed:'Inserate konnten nicht geladen werden.',setup:'Das Verkäufer-Datenbankupdate ist noch nicht installiert.',deleteFailed:'Inserat konnte nicht gelöscht werden.'},
    fr:{title:'Mes annonces',loading:'Chargement des annonces…',empty:'Aucune annonce soumise.',pending:'En attente de validation',draft:'Brouillon',published:'Publiée',rejected:'Modifications requises',sold:'Vendue',remove:'Supprimer',confirm:'Supprimer cette annonce et ses photos ? Cette action est irréversible.',deleted:'Annonce supprimée.',failed:'Impossible de charger les annonces.',setup:'La mise à jour de la base vendeur n’est pas installée.',deleteFailed:'Impossible de supprimer l’annonce.'},
    es:{title:'Mis anuncios',loading:'Cargando anuncios…',empty:'Aún no hay anuncios enviados.',pending:'Pendiente de revisión',draft:'Borrador',published:'Publicado',rejected:'Necesita cambios',sold:'Vendido',remove:'Eliminar',confirm:'¿Eliminar el anuncio y las fotos subidas? No se puede deshacer.',deleted:'Anuncio eliminado.',failed:'No se pudieron cargar los anuncios.',setup:'La actualización de base de datos del vendedor no está instalada.',deleteFailed:'No se pudo eliminar el anuncio.'},
    it:{title:'I miei annunci',loading:'Caricamento annunci…',empty:'Nessun annuncio inviato.',pending:'In revisione',draft:'Bozza',published:'Pubblicato',rejected:'Modifiche richieste',sold:'Venduto',remove:'Elimina',confirm:'Eliminare annuncio e foto caricate? L’operazione è irreversibile.',deleted:'Annuncio eliminato.',failed:'Impossibile caricare gli annunci.',setup:'L’aggiornamento database venditori non è installato.',deleteFailed:'Impossibile eliminare l’annuncio.'},
    pt:{title:'Meus anúncios',loading:'Carregando anúncios…',empty:'Nenhum anúncio enviado.',pending:'Em análise',draft:'Rascunho',published:'Publicado',rejected:'Precisa de ajustes',sold:'Vendido',remove:'Excluir',confirm:'Excluir anúncio e fotos enviadas? Não é possível desfazer.',deleted:'Anúncio excluído.',failed:'Não foi possível carregar os anúncios.',setup:'A atualização do banco de vendedores ainda não foi instalada.',deleteFailed:'Não foi possível excluir o anúncio.'},
    vi:{title:'Tin của tôi',loading:'Đang tải tin…',empty:'Chưa có tin nào được gửi.',pending:'Chờ xét duyệt',draft:'Bản nháp',published:'Đã đăng',rejected:'Cần chỉnh sửa',sold:'Đã bán',remove:'Xóa',confirm:'Xóa tin và ảnh đã tải lên? Không thể hoàn tác.',deleted:'Đã xóa tin.',failed:'Không thể tải tin.',setup:'Chưa cài đặt cập nhật cơ sở dữ liệu người bán.',deleteFailed:'Không thể xóa tin.'}
  };
  const lang=()=>document.documentElement.lang||'en';
  const tx=k=>(copy[lang()]||copy.en)[k]||copy.en[k]||k;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const client=()=>window.rqSupabase||null;
  const user=()=>window.rqAuthSession?.user||null;
  const missingSchema=e=>['PGRST205','42P01'].includes(String(e?.code||''))||/seller_listings|schema cache|does not exist/i.test(String(e?.message||''));
  const numberOrNull=v=>{const n=Number(String(v??'').replace(/[^0-9.-]/g,''));return Number.isFinite(n)&&String(v??'').trim()!==''?n:null;};
  const statusLabel=s=>tx(['draft','pending','published','rejected','sold'].includes(s)?s:'draft');
  const extension=record=>{const fromName=String(record.name||'').match(/\.[a-zA-Z0-9]{2,5}$/)?.[0]?.toLowerCase();if(fromName)return fromName;const byType={'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','image/heic':'.heic','image/heif':'.heif'};return byType[record.type]||'.jpg';};

  function listingPayload(draft,ownerId){
    const year=numberOrNull(draft.year);const price=numberOrNull(draft.price);
    return {
      owner_id:ownerId,
      manufacturer:String(draft.maker||'').trim()||null,
      model:String(draft.model||'').trim()||null,
      manufacture_year:year&&year>=1900&&year<=2100?Math.round(year):null,
      serial_number:String(draft.serial||'').trim()||null,
      country:String(draft.country||'Japan').trim(),
      location_text:String(draft.location||'').trim()||String(draft.country||'Japan').trim(),
      operating_hours_text:String(draft.hours||'').trim()||null,
      operating_status:String(draft.working||'unknown'),
      usage_notes:String(draft.usage||'').trim()||null,
      service_history:String(draft.serviceHistory||'').trim()||null,
      accessories:Array.isArray(draft.accessories)?draft.accessories:[],
      accessory_notes:String(draft.accessoryNote||'').trim()||null,
      dismantling_required:Boolean(draft.dismantle),
      lifting_required:Boolean(draft.forklift),
      export_available:Boolean(draft.export),
      shipping_mode:String(draft.shipping||'seller'),
      price:price!==null&&price>=0?price:null,
      currency:'JPY',
      listing_type:draft.sale==='bid'?'private_offer':'fixed',
      seller_company_name:String(draft.companyName||'').trim(),
      declaration_accepted:Boolean(draft.declared),
      status:'draft'
    };
  }

  function contactPayload(draft,listingId,ownerId){
    return {
      listing_id:listingId,
      owner_id:ownerId,
      company_name:String(draft.companyName||'').trim(),
      contact_name:String(draft.contactName||'').trim(),
      business_email:String(draft.contactEmail||'').trim().toLowerCase(),
      phone:String(draft.contactPhone||'').trim(),
      job_title:String(draft.jobTitle||'').trim()||null,
      company_website:String(draft.companyWebsite||'').trim()||null,
      preferred_contact:['email','phone','whatsapp'].includes(draft.preferredContact)?draft.preferredContact:'email'
    };
  }

  window.rqSubmitSellerListing=async draft=>{
    const api=client(),account=user();if(!api||!account)throw Object.assign(new Error('Authentication required'),{code:'AUTH_REQUIRED'});
    let listingId='';const uploaded=[];
    try{
      const created=await api.from('seller_listings').insert(listingPayload(draft,account.id)).select('id').single();
      if(created.error)throw created.error;listingId=created.data.id;
      const contact=await api.from('seller_listing_contacts').insert(contactPayload(draft,listingId,account.id));
      if(contact.error)throw contact.error;
      const photos=await window.rqGetSellerPhotoRecords?.()||[];
      if(!photos.length)throw Object.assign(new Error('At least one photo is required'),{code:'PHOTO_REQUIRED'});
      for(let i=0;i<photos.length;i++){
        const record=photos[i];const path=`${account.id}/${listingId}/${String(i+1).padStart(2,'0')}-${record.slot}${extension(record)}`;
        const uploadedPhoto=await api.storage.from(BUCKET).upload(path,record.blob,{cacheControl:'3600',contentType:record.type||'image/jpeg',upsert:false});
        if(uploadedPhoto.error)throw uploadedPhoto.error;uploaded.push(path);
        const photoRow=await api.from('seller_listing_photos').insert({listing_id:listingId,owner_id:account.id,slot:record.slot,storage_path:path,file_name:record.name||null,mime_type:record.type||null,file_size:record.size||null,sort_order:i});
        if(photoRow.error)throw photoRow.error;
      }
      const submitted=await api.from('seller_listings').update({status:'pending',submitted_at:new Date().toISOString()}).eq('id',listingId).eq('owner_id',account.id);
      if(submitted.error)throw submitted.error;
      return {id:listingId,status:'pending'};
    }catch(error){
      if(listingId)await api.from('seller_listings').delete().eq('id',listingId).eq('owner_id',account.id);
      if(uploaded.length)await api.storage.from(BUCKET).remove(uploaded);
      throw error;
    }
  };

  async function signedPhotoUrls(api,photos){
    const result={};
    for(const photo of photos||[]){const signed=await api.storage.from(BUCKET).createSignedUrl(photo.storage_path,3600);if(!signed.error&&signed.data?.signedUrl)result[photo.slot]=signed.data.signedUrl;}
    return result;
  }

  async function loadPublished(){
    const api=client();if(!api)return;
    const query=await api.from('seller_listings').select('id,manufacturer,model,manufacture_year,country,location_text,operating_hours_text,price,currency,listing_type,seller_company_name,status,published_at,seller_listing_photos(slot,storage_path,sort_order)').eq('status','published').order('published_at',{ascending:false});
    if(query.error){if(!missingSchema(query.error))console.warn('RoboQuo published seller listings',query.error.code||query.error.message);window.rqSetSellerLiveListings?.([]);return;}
    const mapped=[];
    for(const row of query.data||[]){const photos=[...(row.seller_listing_photos||[])].sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));const urls=await signedPhotoUrls(api,photos);const preferred=['overall','nameplate','ctrlOutside','side','pendant'];const first=preferred.find(k=>urls[k])||Object.keys(urls)[0];mapped.push({id:`seller:${row.id}`,backendId:row.id,brand:row.manufacturer||'Robot',model:row.model||'Used Robot',year:row.manufacture_year||'',payload:'—',country:row.country||'',location:row.location_text||row.country||'',price:Number(row.price||0),currency:row.currency||'JPY',sale:row.listing_type==='private_offer'?'bid':'fixed',cat:'industrial',apps:[],hours:row.operating_hours_text||'',sellerCompany:row.seller_company_name||'',verified:false,media:{nameplate:Boolean(urls.nameplate),controller:Boolean(urls.ctrlOutside),video:false},photoUrl:first?urls[first]:'',photoUrls:urls,photoCount:Object.keys(urls).length,demo:false,_source:'seller-supabase'});}
    window.rqSetSellerLiveListings?.(mapped);
  }

  function accountHtml(rows){
    if(!rows.length)return `<div class="seller-account-head"><h3>${esc(tx('title'))}</h3><p>${esc(tx('empty'))}</p></div>`;
    return `<div class="seller-account-head"><h3>${esc(tx('title'))}</h3><span>${rows.length}</span></div><div class="seller-account-list">${rows.map(row=>`<article><div><strong>${esc([row.manufacturer,row.model].filter(Boolean).join(' ')||'Robot')}</strong><small>${esc(row.seller_company_name||'')} · ${esc(statusLabel(row.status))}</small></div><button class="danger-button" type="button" onclick="rqDeleteSellerListing('${esc(row.id)}')">${esc(tx('remove'))}</button></article>`).join('')}</div>`;
  }

  window.rqRenderSellerAccount=async()=>{
    const mount=document.getElementById('rqSellerAccount'),api=client(),account=user();if(!mount||!api||!account)return;
    mount.innerHTML=`<p>${esc(tx('loading'))}</p>`;
    const result=await api.from('seller_listings').select('id,manufacturer,model,seller_company_name,status,created_at').eq('owner_id',account.id).order('created_at',{ascending:false});
    if(result.error){mount.innerHTML=`<div class="seller-account-error">${esc(missingSchema(result.error)?tx('setup'):tx('failed'))}</div>`;return;}
    mount.innerHTML=accountHtml(result.data||[]);
  };

  window.rqDeleteSellerListing=async listingId=>{
    if(!window.confirm(tx('confirm')))return;
    const api=client(),account=user();if(!api||!account)return;
    const photoResult=await api.from('seller_listing_photos').select('storage_path').eq('listing_id',listingId).eq('owner_id',account.id);
    const removed=await api.from('seller_listings').delete().eq('id',listingId).eq('owner_id',account.id).select('id').maybeSingle();
    if(removed.error||!removed.data){window.toast?.(tx('deleteFailed'));return;}
    const paths=(photoResult.data||[]).map(x=>x.storage_path).filter(Boolean);if(paths.length)await api.storage.from(BUCKET).remove(paths);
    window.toast?.(tx('deleted'));await Promise.all([loadPublished(),window.rqRenderSellerAccount?.()]);
  };

  function init(){if(client())loadPublished();else setTimeout(()=>client()&&loadPublished(),500);}
  document.addEventListener('rq:authready',loadPublished);
  document.addEventListener('rq:authchange',()=>{loadPublished();if(document.getElementById('rqSellerAccount'))window.rqRenderSellerAccount();});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
