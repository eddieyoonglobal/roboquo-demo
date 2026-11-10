/* Official-source cobot reference comparator; no Auth/DB/commerce writes. */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const LANGS={"en":{"title":"Compare collaborative robot models","desc":"Manufacturer specifications only. No live inventory or seller availability is implied.","brand":"Manufacturer","all":"All manufacturers","min":"Minimum payload","any":"Any payload","sort":"Sort models","byBrand":"Brand","byPayload":"Highest payload","byReach":"Longest reach","count":"reference models","select":"Compare","remove":"Remove","source":"Official specifications","payload":"Payload","reach":"Reach","axes":"Axes","selected":"Select up to three models for side-by-side comparison","clear":"Clear selection","empty":"No reference models match this filter.","none":"Select 2 or 3 models to see a side-by-side comparison.","max":"Select no more than three models.","safety":"Compare nominal manufacturer specifications only. End-effector mass, load center, dynamic capacity, mounting and safety risk assessment must be checked for the exact configuration. Some models may have separate conditional payload limits.","notes":"Manufacturer notes","loading":"Loading manufacturer specifications…","failure":"Specifications are unavailable right now."},"ja":{"title":"協働ロボットの機種を比較","desc":"メーカー公式仕様の比較です。出品や在庫情報ではありません。","brand":"メーカー","all":"すべてのメーカー","min":"最小可搬重量","any":"すべての可搬重量","sort":"並べ替え","byBrand":"メーカー順","byPayload":"可搬重量の大きい順","byReach":"リーチの長い順","count":"参考機種","select":"比較に追加","remove":"比較から外す","source":"メーカー公式仕様","payload":"可搬重量","reach":"リーチ","axes":"軸数","selected":"最大3機種を選んで比較","clear":"選択を解除","empty":"条件に一致する機種はありません。","none":"2～3機種を選ぶと仕様を比較できます。","max":"比較できるのは最大3機種です。","safety":"メーカー記載の基本仕様のみを比較しています。実際の選定時はハンド質量、重心、姿勢、動作条件、安全リスクアセスメントを個別に確認してください。条件付き最大可搬重量のある機種もあります。","notes":"メーカー注記","loading":"公式仕様を読み込み中…","failure":"仕様を読み込めませんでした。"},"ko":{"title":"협동로봇 모델 사양 비교","desc":"제조사 공식 사양 기준입니다. 실제 판매 재고나 매물을 의미하지 않습니다.","brand":"제조사","all":"전체 제조사","min":"최소 가반하중","any":"전체 하중","sort":"정렬","byBrand":"브랜드순","byPayload":"가반하중 높은순","byReach":"작업반경 긴순","count":"개 비교 모델","select":"비교 추가","remove":"비교 제외","source":"제조사 공식 사양","payload":"가반하중","reach":"작업반경","axes":"축 수","selected":"최대 3개 모델을 선택해 비교","clear":"선택 초기화","empty":"조건에 맞는 비교 모델이 없습니다.","none":"모델 2~3개를 선택하면 사양을 나란히 비교합니다.","max":"비교는 최대 3개 모델까지 가능합니다.","safety":"제조사 기본 사양만 비교합니다. 실제 선정 시 그리퍼 무게, 무게중심, 동작조건, 장착자세 및 위험성 평가를 별도로 확인해야 합니다. 일부 모델에는 조건부 최대 하중이 있습니다.","notes":"제조사 주석","loading":"공식 사양을 읽는 중…","failure":"사양을 불러오지 못했습니다."},"zh":{"title":"协作机器人型号对比","desc":"仅比较制造商规格，不代表在售库存。","brand":"制造商","all":"全部制造商","min":"最小负载","any":"不限负载","sort":"排序","byBrand":"品牌","byPayload":"负载从高到低","byReach":"工作范围从大到小","count":"个参考型号","select":"加入对比","remove":"移除","source":"官方规格","payload":"负载","reach":"工作范围","axes":"轴数","selected":"最多比较三个型号","clear":"清除选择","empty":"没有符合条件的型号。","none":"选择两到三个型号进行对比。","max":"最多选择三个型号。","safety":"仅供规格参考。请确认夹具重量、重心和安全风险评估。","notes":"制造商备注","loading":"正在加载规格…","failure":"无法加载规格。"},"de":{"title":"Cobots vergleichen","desc":"Herstellerangaben, keine Lager- oder Angebotsdaten.","brand":"Hersteller","all":"Alle Hersteller","min":"Mindesttraglast","any":"Jede Traglast","sort":"Sortierung","byBrand":"Marke","byPayload":"Höchste Traglast","byReach":"Größte Reichweite","count":"Referenzmodelle","select":"Vergleichen","remove":"Entfernen","source":"Offizielle Daten","payload":"Traglast","reach":"Reichweite","axes":"Achsen","selected":"Bis zu 3 Modelle vergleichen","clear":"Auswahl löschen","empty":"Keine passenden Modelle.","none":"2–3 Modelle auswählen.","max":"Maximal 3 Modelle.","safety":"Angaben sind nominell. Werkzeuggewicht, Schwerpunkt und Risikobeurteilung separat prüfen.","notes":"Hinweise","loading":"Daten werden geladen…","failure":"Daten nicht verfügbar."},"fr":{"title":"Comparer les robots collaboratifs","desc":"Caractéristiques constructeur, pas de disponibilité commerciale.","brand":"Fabricant","all":"Tous les fabricants","min":"Charge minimum","any":"Toute charge","sort":"Tri","byBrand":"Marque","byPayload":"Charge maximale","byReach":"Portée maximale","count":"modèles de référence","select":"Comparer","remove":"Retirer","source":"Fiche officielle","payload":"Charge","reach":"Portée","axes":"Axes","selected":"Comparer jusqu’à 3 modèles","clear":"Effacer","empty":"Aucun modèle correspondant.","none":"Choisissez 2 à 3 modèles.","max":"Maximum 3 modèles.","safety":"Vérifier la masse de l’outil, le centre de gravité et l’évaluation des risques.","notes":"Remarques","loading":"Chargement…","failure":"Données indisponibles."},"es":{"title":"Comparar robots colaborativos","desc":"Especificaciones del fabricante, no inventario.","brand":"Fabricante","all":"Todos","min":"Carga mínima","any":"Cualquier carga","sort":"Ordenar","byBrand":"Marca","byPayload":"Mayor carga","byReach":"Mayor alcance","count":"modelos de referencia","select":"Comparar","remove":"Quitar","source":"Ficha oficial","payload":"Carga","reach":"Alcance","axes":"Ejes","selected":"Compara hasta 3 modelos","clear":"Borrar","empty":"Sin resultados.","none":"Elige 2 o 3 modelos.","max":"Máximo 3 modelos.","safety":"Verifique masa de herramientas, centro de gravedad y evaluación de riesgos.","notes":"Notas","loading":"Cargando…","failure":"Datos no disponibles."},"it":{"title":"Confronta robot collaborativi","desc":"Dati ufficiali, non disponibilità a magazzino.","brand":"Produttore","all":"Tutti","min":"Carico minimo","any":"Qualsiasi carico","sort":"Ordina","byBrand":"Marchio","byPayload":"Carico maggiore","byReach":"Sbraccio maggiore","count":"modelli di riferimento","select":"Confronta","remove":"Rimuovi","source":"Scheda ufficiale","payload":"Carico","reach":"Sbraccio","axes":"Assi","selected":"Confronta fino a 3 modelli","clear":"Azzera","empty":"Nessun modello.","none":"Seleziona 2 o 3 modelli.","max":"Massimo 3 modelli.","safety":"Verificare peso utensile, baricentro e valutazione dei rischi.","notes":"Note","loading":"Caricamento…","failure":"Dati non disponibili."},"pt":{"title":"Comparar robôs colaborativos","desc":"Especificações oficiais, não estoque.","brand":"Fabricante","all":"Todos","min":"Carga mínima","any":"Qualquer carga","sort":"Ordenar","byBrand":"Marca","byPayload":"Maior carga","byReach":"Maior alcance","count":"modelos de referência","select":"Comparar","remove":"Remover","source":"Especificação oficial","payload":"Carga","reach":"Alcance","axes":"Eixos","selected":"Compare até 3 modelos","clear":"Limpar","empty":"Nenhum modelo encontrado.","none":"Selecione 2 ou 3 modelos.","max":"Máximo de 3 modelos.","safety":"Verifique massa da ferramenta, centro de gravidade e análise de riscos.","notes":"Observações","loading":"Carregando…","failure":"Dados indisponíveis."},"vi":{"title":"So sánh robot cộng tác","desc":"Thông số hãng, không phải hàng đang bán.","brand":"Nhà sản xuất","all":"Tất cả","min":"Tải trọng tối thiểu","any":"Mọi tải trọng","sort":"Sắp xếp","byBrand":"Thương hiệu","byPayload":"Tải trọng lớn nhất","byReach":"Tầm với dài nhất","count":"mẫu tham khảo","select":"So sánh","remove":"Bỏ","source":"Thông số chính hãng","payload":"Tải trọng","reach":"Tầm với","axes":"Trục","selected":"So sánh tối đa 3 mẫu","clear":"Xóa chọn","empty":"Không có mẫu phù hợp.","none":"Chọn 2 đến 3 mẫu.","max":"Tối đa 3 mẫu.","safety":"Kiểm tra khối lượng dụng cụ, trọng tâm và đánh giá rủi ro.","notes":"Ghi chú","loading":"Đang tải…","failure":"Không thể tải thông số."}};
const JUMP_LABEL={en:"Compare verified model specs ↓",ja:"公式仕様で機種を比較 ↓",ko:"공식 사양으로 모델 비교 ↓",zh:"比较官方型号参数 ↓",de:"Modelldaten vergleichen ↓",fr:"Comparer les fiches modèles ↓",es:"Comparar modelos oficiales ↓",it:"Confronta i modelli ↓",pt:"Comparar modelos oficiais ↓",vi:"So sánh thông số hãng ↓"};
const PHOTO_LABELS={en:"Illustration · not a model photo",ja:"イメージ図・実機写真ではありません",ko:"설명용 그림 · 실제 모델 사진 아님",zh:"示意图 · 非实际型号照片",de:"Illustration · kein Modellfoto",fr:"Illustration · pas de photo du modèle",es:"Ilustración · no es una foto del modelo",it:"Illustrazione · non è una foto del modello",pt:"Ilustração · não é uma foto do modelo",vi:"Minh họa · không phải ảnh mẫu thực"};
const selected=new Set();
let models=[];
const txt=()=>LANGS[document.documentElement.lang]||LANGS.en;
function node(tag,cls,content){
 const e=document.createElement(tag);
 if(cls)e.className=cls;
 if(content!==undefined)e.textContent=String(content);
 return e;
}
function wipe(el){if(el)el.replaceChildren()}
function setting(select,items,value){
 const before=value===undefined?select.value:value;
 select.replaceChildren(...items.map(item=>{
  const option=node("option","",item[1]);
  option.value=item[0];
  return option;
 }));
 if(items.some(item=>item[0]===before))select.value=before;
}
function safeOfficial(url){
 try{const x=new URL(url);return x.protocol==="https:"?x.href:null}catch(_){return null}
}
function sourceLink(m,label){
 const a=node("a","rq-spec-source",label);
 const target=safeOfficial(m.sourceUrl);
 if(target){a.href=target;a.target="_blank";a.rel="noopener noreferrer"}
 else{a.removeAttribute("href")}
 return a;
}
function localize(){
 const t=txt();
 const jump=$("rqJumpCompare");if(jump)jump.textContent=JUMP_LABEL[document.documentElement.lang]||JUMP_LABEL.en;
 const ids={rqCompareTitle:"title",rqCompareDescription:"desc",rqCompareBrandLabel:"brand",
  rqComparePayloadLabel:"min",rqCompareSortLabel:"sort",rqCompareSelectionTitle:"selected",
  rqCompareClear:"clear",rqCompareDisclaimer:"safety"};
 for(const [id,key] of Object.entries(ids)){const x=$(id);if(x)x.textContent=t[key]}
 const brand=$("rqCompareBrand"),sort=$("rqCompareSort"),payload=$("rqComparePayload");
 if(brand)setting(brand,[["",t.all],...[...new Set(models.map(m=>m.maker))].sort().map(x=>[x,x])]);
 if(payload)setting(payload,[["0",t.any],["5","5 kg+"],["10","10 kg+"],["15","15 kg+"],["20","20 kg+"]]);
 if(sort)setting(sort,[["brand",t.byBrand],["payload-desc",t.byPayload],["reach-desc",t.byReach]]);
 render();
}
function render(){
 const wrap=$("rqCobotCompare");if(!wrap)return;
 const makerTab=document.querySelector('[data-maker-tab="robot"]');
 wrap.hidden=!!(makerTab&&!makerTab.classList.contains("active"));
 const t=txt(),brand=$("rqCompareBrand")?.value||"",min=Number($("rqComparePayload")?.value||0),
       sort=$("rqCompareSort")?.value||"brand";
 const filtered=models.filter(m=>(!brand||m.maker===brand)&&m.payloadKg>=min);
 filtered.sort((a,b)=>sort==="payload-desc"?b.payloadKg-a.payloadKg||a.maker.localeCompare(b.maker):
  sort==="reach-desc"?b.reachMm-a.reachMm||a.maker.localeCompare(b.maker):
  a.maker.localeCompare(b.maker)||a.model.localeCompare(b.model));
 const count=$("rqCompareCount");
 if(count)count.textContent=filtered.length+" "+t.count;
 const container=$("rqCompareModels");wipe(container);
 if(!filtered.length){container.append(node("p","rq-compare-empty",t.empty))}
 for(const m of filtered){
  const card=node("article","rq-spec-card");
  const top=node("div","rq-spec-top");
  top.append(node("span","rq-spec-maker",m.maker),node("h3","",m.model));
  const stats=node("dl","rq-spec-stats");
  for(const [label,value] of [[t.payload,m.payloadKg+" kg"],[t.reach,m.reachMm+" mm"],[t.axes,m.axes]]){
   const pair=node("div","");pair.append(node("dt","",label),node("dd","",value));stats.append(pair)
  }
  const bottom=node("div","rq-spec-actions");
  const b=node("button","rq-compare-toggle",selected.has(m.id)?t.remove:t.select);
  b.type="button";b.dataset.id=m.id;b.setAttribute("aria-pressed",String(selected.has(m.id)));
  if(selected.size>=3&&!selected.has(m.id))b.disabled=true;
  bottom.append(b,sourceLink(m,t.source));
  const graphic=node("figure","rq-model-figure");
  const picture=node("img","rq-model-photo");picture.src="./assets/rq-robot.svg";picture.alt="";picture.loading="lazy";picture.width=640;picture.height=440;
  graphic.append(picture,node("figcaption","rq-model-image-note",PHOTO_LABELS[document.documentElement.lang]||PHOTO_LABELS.en));
  card.append(top,graphic,stats,bottom);container.append(card);
 }
 renderTable();
}
function renderTable(){
 const target=$("rqCompareTableScroll");wipe(target);
 const t=txt(),chosen=models.filter(m=>selected.has(m.id));
 const head=$("rqCompareSelectionTitle");
 if(head)head.textContent=t.selected+" ("+selected.size+"/3)";
 if(chosen.length<2){target.append(node("p","rq-compare-empty",t.none));return}
 const table=node("table","rq-spec-table");
 const caption=node("caption","",t.title);table.append(caption);
 const thead=node("thead",""),heading=node("tr","");
 heading.append(node("th","",t.brand));
 for(const m of chosen){const th=node("th","",m.maker+" "+m.model);th.scope="col";heading.append(th)}
 thead.append(heading);table.append(thead);
 const body=node("tbody","");
 for(const [label,get] of [[t.payload,m=>m.payloadKg+" kg"],[t.reach,m=>m.reachMm+" mm"],[t.axes,m=>m.axes]]){
  const row=node("tr","");const th=node("th","",label);th.scope="row";row.append(th);
  for(const m of chosen)row.append(node("td","",get(m)));
  body.append(row);
 }
 const row=node("tr","");const th=node("th","",t.source);th.scope="row";row.append(th);
 for(const m of chosen){const td=node("td","");td.append(sourceLink(m,t.source));row.append(td)}
 body.append(row);table.append(body);target.append(table);
}
function connect(){
 for(const id of ["rqCompareBrand","rqComparePayload","rqCompareSort"])$(id)?.addEventListener("change",render);
 $("rqCompareModels")?.addEventListener("click",event=>{
  const button=event.target.closest("button[data-id]");if(!button)return;
  const id=button.dataset.id;
  if(selected.has(id))selected.delete(id);
  else if(selected.size<3)selected.add(id);
  else{const count=$("rqCompareCount");if(count)count.textContent=txt().max;return}
  render();
 });
 $("rqCompareClear")?.addEventListener("click",()=>{selected.clear();render()});
 $("rqJumpCompare")?.addEventListener("click",()=>$("rqCobotCompare")?.scrollIntoView({behavior:"smooth",block:"start"}));
 document.querySelectorAll("[data-maker-tab]").forEach(b=>b.addEventListener("click",render));
 document.addEventListener("rq:languagechange",localize);
}
async function start(){
 if(!$("rqCobotCompare"))return;
 connect();const count=$("rqCompareCount");if(count)count.textContent=txt().loading;
 try{
  const res=await fetch("./cobot-specs.json",{cache:"no-store"});if(!res.ok)throw new Error("HTTP "+res.status);
  const data=await res.json();if(!Array.isArray(data.models))throw new Error("Invalid source data");
  models=data.models.filter(m=>typeof m.id==="string"&&typeof m.maker==="string"&&
   typeof m.model==="string"&&Number.isFinite(m.payloadKg)&&Number.isFinite(m.reachMm)&&
   Number.isInteger(m.axes)&&safeOfficial(m.sourceUrl));
  localize();
 }catch(err){console.warn("RoboQuo cobot spec compare:",err);if(count)count.textContent=txt().failure}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
else start();
})();
