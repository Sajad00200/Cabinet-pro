const R=x=>Math.round(x*10)/10,Cm=x=>R(x)/10,$=s=>document.querySelector(s);
/* همه مقادیر داخلی میلی‌متر هستند؛ ورودی و نمایش سانتی‌متر (۴.۹ = ۴۹ میلی‌متر) */
const D={t:16,fib:5,gd:8,fc:2,band:1,dband:1,bw:3,bh:3,hdL:30,hdU:30,we:20,ss:20,rd:32,dd:500,bd:45,pk:50,pkd:32,sw:2800,sh:2070,fsw:2800,fsh:2070,kerf:4,mg:10,rot:1,rl:{ball:26,tandem:42,body:26,three:26,custom:20},pr:{body:0,front:0,fiber:0,band:0,rail:0,prof:0}};
let S={ps:[],cur:null,set:{},tab:'projects',open:{},sopen:{},tpl:[]};
const DB=new Promise(r=>{try{const q=indexedDB.open('cabinetpro',1);q.onupgradeneeded=()=>q.result.createObjectStore('kv');q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}catch(e){r(null)}});
async function dbGet(){const d=await DB;if(!d)return null;return new Promise(r=>{try{const q=d.transaction('kv').objectStore('kv').get('state');q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}catch(e){r(null)}})}
function norm(){S.set=Object.assign(JSON.parse(JSON.stringify(D)),S.set);S.set.rl=Object.assign({},D.rl,S.set.rl);S.set.pr=Object.assign({},D.pr,S.set.pr);S.open=S.open||{};S.sopen=S.sopen||{};S.tpl=S.tpl||[];
 S.ps.forEach(p=>p.units.forEach(u=>{u.drs=Array.isArray(u.drs)?u.drs:[];u.cnt=u.cnt||1;u.o=u.o||{};u.ov=u.ov||{}}))}
norm();
function save(){clearTimeout(save.t);save.t=setTimeout(async()=>{const d=await DB,j=JSON.stringify(S);if(d){try{d.transaction('kv','readwrite').objectStore('kv').put(j,'state');return}catch(e){}}try{localStorage.cabinetPro=j}catch(e){}},0)}
async function boot(){let raw=await dbGet();if(!raw)try{raw=localStorage.cabinetPro}catch(e){}try{if(raw)Object.assign(S,JSON.parse(raw))}catch(e){}norm();view();try{navigator.storage.persist()}catch(e){}}
const P0=()=>S.ps.find(p=>p.id==S.cur),uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const KIND={modern:'مدرن',paint:'رنگ',neo:'نئوکلاسیک',classic:'کلاسیک',other:'سایر'},TY={floor:'زمینی',wall:'هوایی',tall:'کمد'},RT={ball:'ساچمه‌ای',tandem:'تاندم/مخفی',body:'بدنه‌دار',three:'سه‌تکه',custom:'دستی'},ET={t:'ب',b:'پ',l:'چ',r:'ر'};
const HND={L:'L',U:'U',LU:'L و U',none:'بدون'},HK=h=>h=='none'?'بدون':h.split('').join(' + ');
const isMod=p=>(p.kind||'modern')=='modern';
const hkOf=(u,p)=>(isMod(p)&&u.type=='floor')?(u.hnd||p.hnd||'L'):'none';

function eff(u){const s=Object.assign({},S.set,{rl:Object.assign({},S.set.rl)}),o=u.o||{};for(const k in o)if(o[k]!==''&&o[k]!=null&&!isNaN(o[k])){if(k=='lq')s.rl[u.rt]=+o[k];else s[k]=+o[k]}return s}

function calc(u,s){const t=s.t,W=u.w,H=u.h,Dp=u.d,iw=W-2*t,o=[],c=u.cnt||1;
 const P=(n,w,h,q,th,e,m)=>o.push({n,w:R(w),h:R(h),q:q*c,th,e:e||'',m:m||'MDF'});
 const fb=(w,h)=>P('فیبر پشت',w,h,1,s.fib,'','فیبر'),fw=iw+2*s.gd-s.fc;
 if(u.type=='floor'){
  P('بغل',Dp,H-t,2,t,'l');P('کف',Dp,W,1,t,'l');
  if(u.rails>0)P('قید بالا',u.rw,W-s.rd,u.rails,t,'l');
  if(u.sh>0)P('طبقه',Dp-s.fib-s.ss,iw,u.sh,t,'l');
  fb(fw,H-t+s.gd-s.fc)}
 else if(u.type=='wall'){
  P('بغل',Dp,H,2,t,'l');P('کف',Dp,iw,1,t,'l');P('سقف',Dp,iw,1,t,'l');
  if(u.sh>0)P('طبقه',Dp-s.fib-s.ss,iw,u.sh,t,'l');
  fb(fw,H-2*t+2*s.gd-s.fc)}
 else{
  P('بغل',Dp,H,2,t,'l');P('کف',Dp,iw,1,t,'l');P('سقف',Dp,iw,1,t,'l');
  if(u.div>0)P('تقسیم عمودی',Dp,H-2*t,u.div,t,'l');
  const cw=(iw-u.div*t)/(u.div+1);if(u.sh>0)P('طبقه',Dp-s.fib-s.ss,cw,u.sh*(u.div+1),t,'l');
  P('پاخور',+u.pk||s.pk,W-s.pkd,1,t,'l');
  fb(fw,H-2*t+2*s.gd-s.fc)}
 /* کشوها: هر کشو یک قوطی جدا + یک درب که به قوطی پیچ می‌شود (هوایی کشو ندارد) */
 const drs=u.type=='wall'?[]:(u.drs||[]),n=drs.length;
 drs.forEach((d,i)=>{const k=i+1,fh=(+d.h||(H-(s.hh||0))/n)-s.bh,bw=iw-s.rl[u.rt],dd=+d.dd||s.dd,bhh=+d.bh||fh-s.bd;
  P('درب کشو '+k,W-s.bw,fh,1,t,'tblr');
  P('بغل قوطی '+k,dd,bhh,2,t,'t');P('جلو/پشت قوطی '+k,bw-2*t,bhh,2,t,'t');
  P('کف قوطی '+k,dd-2*t+2*s.gd-s.fc,bw-2*t+2*s.gd-s.fc,1,s.fib,'','فیبر')});
 if(u.dn>0)P('درب',W/u.dn-s.bw,+u.dh||H+(s.ex||0)-s.bh-(s.hh||0),u.dn,t,'tblr');
 return o}

function rows(p){const out=[];
 for(const u of p.units){const s=eff(u),hk=hkOf(u,p);
  s.hh=(hk.includes('L')?s.hdL:0)+(hk.includes('U')?s.hdU:0);s.ex=(isMod(p)&&u.type=='wall')?s.we:0;u.hk=hk;let L;try{L=calc(u,s)}catch(e){L=[]}
  for(const r of L){const e=u.ov[r.n]!=null?u.ov[r.n]:r.e,g=/^درب/.test(r.n)?'front':'body',bt=r.m=='MDF'?(g=='front'?s.dband:s.band):0;
   const rw=r.w-(e.includes('l')?bt:0)-(e.includes('r')?bt:0),rh=r.h-(e.includes('t')?bt:0)-(e.includes('b')?bt:0);
   const bm=(((e.includes('t')?r.w:0)+(e.includes('b')?r.w:0)+(e.includes('l')?r.h:0)+(e.includes('r')?r.h:0))*r.q)/1000;
   out.push({u:u.name,uid:u.id,...r,e,bt,g,rw:R(rw),rh:R(rh),bm,bad:rw<=0||rh<=0||r.w<=0||r.h<=0,ed:r.m=='MDF'})}}
 out.forEach((x,i)=>x.no=i+1);return out}

function pack(items,s){const aw=s.sw-2*s.mg,ah=s.sh-2*s.mg,k=s.kerf;let best=null;
 const put=(sh,it)=>{const op=[[it.L,it.W,0]];if(s.rot&&it.L!=it.W)op.push([it.W,it.L,1]);
  for(const r of sh.rows)for(const[l,w,ro]of op)if(w<=r.h&&r.x+l<=aw){sh.p.push({...it,x:r.x,y:r.y,l,w,ro});r.x+=l+k;return 1}
  const lr=sh.rows[sh.rows.length-1],y=lr?lr.y+lr.h+k:0;
  for(const[l,w,ro]of op)if(l<=aw&&y+w<=ah){sh.rows.push({y,h:w,x:l+k});sh.p.push({...it,x:0,y,l,w,ro});return 1}return 0};
 for(const key of['W','L','A']){const arr=items.slice().sort((a,b)=>key=='A'?b.L*b.W-a.L*a.W:b[key]-a[key]),sheets=[];let fail=null;
  for(const it of arr){let ok=0;for(const sh of sheets)if(put(sh,it)){ok=1;break}
   if(!ok){const sh={rows:[],p:[]};if(put(sh,it))sheets.push(sh);else{fail=it;break}}}
  if(fail)return{err:fail};
  const free=sheets.length?sheets[sheets.length-1].p.reduce((a,p)=>a+p.l*p.w,0):0;
  if(!best||sheets.length<best.sheets.length||(sheets.length==best.sheets.length&&free<best.free))best={sheets,free,key}}
 return best}

const TABS={projects:'🗂 پروژه‌ها',units:'📦 یونیت‌ها',parts:'📋 قطعات',cut:'✂️ برش',report:'🖨 گزارش',set:'⚙️ تنظیمات'};
/* F: فیلد عددی. len=1 یعنی طول (نمایش سانتی‌متر، ذخیره میلی‌متر) */
const F=(l,a,v,len=1,t='number',ph='')=>`<div><label>${l}</label><input type="${t}" inputmode="${t=='number'?'decimal':'text'}" ${len?'data-len=1':''} ${a} placeholder="${ph}" value="${v===''||v==null?'':(len&&t=='number'?Cm(v):v)}"></div>`;
const SEL=(l,a,o,v)=>`<div><label>${l}</label><select ${a}>${Object.entries(o).map(([k,x])=>`<option value="${k}" ${k==v?'selected':''}>${x}</option>`).join('')}</select></div>`;
const DT=(k,title,body)=>`<details class="card" data-sk="${k}" ${S.sopen[k]?'open':''}><summary>${title}</summary>${body}</details>`;
const grp=x=>x.m=='فیبر'?'فیبر':x.g=='front'?'درب':'بدنه';

function warn(u,p){const s=S.set,t=s.t,m=[];if(u.w<2*t+50)m.push('عرض خیلی کم است');if(u.h<2*t+50)m.push('ارتفاع خیلی کم است');if(u.d<100)m.push('عمق خیلی کم است');
 if(u.type!='wall'){if(u.drs.some(d=>(+d.dd||s.dd)>u.d-s.fib))m.push('عمق یک قوطی از عمق یونیت بیشتر است');
  if(u.dn>0&&u.drs.length&&!u.dh)m.push('هم درب دارید هم کشو: ارتفاع درب را دستی وارد کنید');
  const tot=u.drs.reduce((a,d)=>a+(+d.h||0),0);if(tot>u.h)m.push('جمع ارتفاع درب کشوها از ارتفاع یونیت بیشتر است')}
 return m.length?`<p class="err">⚠ ${m.join(' · ')}</p>`:''}

function unitCard(u,p){const a=`data-u="${u.id}"`,s=S.set,mod=isMod(p),
 I=(k,l,ph='',len=1)=>F(l,a+` data-k="${k}"`,u[k],len,'number',ph);
 const n=rows({...p,units:[u]}).reduce((x,r)=>x+r.q,0),o=S.open[u.id],isW=u.type=='wall';
 let h=`<div class="card"><div class="uh" data-act="tog" data-id="${u.id}"><div><b>${u.name}</b>${u.cnt>1?' ×'+u.cnt:''}<div class="m">${TY[u.type]} · ${Cm(u.w)}×${Cm(u.h)}×${Cm(u.d)} سانتی‌متر · ${n} قطعه</div></div><span>${o?'▲':'▼'}</span></div>${warn(u,p)}`;
 if(!o)return h+'</div>';
 h+=prevSVG(u,p)+`<div class="g">${F('نام',a+' data-k=name',u.name,0,'text')}${I('cnt','تعداد یونیت مشابه','',0)}${I('w','عرض')}${I('h','ارتفاع')}${I('d','عمق')}${I('sh','تعداد طبقه','',0)}
 ${u.type=='floor'?I('rails','تعداد قید بالا','',0)+I('rw','عرض قید'):''}${u.type=='tall'?I('div','تقسیم عمودی','',0)+I('pk','ارتفاع پاخور',Cm(s.pk)):''}${I('dn','تعداد درب','',0)}${I('dh','ارتفاع درب (خالی=خودکار)')}</div>`;
 if(!isW){
  h+=`<h4>کشوها (هر کشو یک قوطی + یک درب)</h4>${u.drs.map((d,i)=>`<div class="dr"><b>${i+1}</b>${[['h','ارتفاع درب (خودکار)'],['bh','ارتفاع قوطی (خودکار)'],['dd','عمق قوطی ('+Cm(s.dd)+')']].map(([f,ph])=>`<input type="number" inputmode="decimal" data-len=1 data-dr="${u.id}|${i}|${f}" placeholder="${ph}" value="${d[f]===''||d[f]==null?'':Cm(d[f])}">`).join('')}<button data-act="deldr" data-id="${u.id}" data-i="${i}">✕</button></div>`).join('')}
  <button data-act="adddr" data-id="${u.id}">+ کشو</button>${u.drs.length?`<div class="g">${SEL('نوع ریل',a+' data-k=rt',RT,u.rt)}</div>`:''}`}
 if(mod&&u.type=='floor')h+=`<h4>دستگیره</h4><div class="g">${SEL('نوع دستگیره',a+' data-k=hnd',{'':'پیش‌فرض پروژه ('+HND[p.hnd||'L']+')',...HND},u.hnd||'')}${I('hl','طول پروفیل',Cm(u.w))}</div>`;
 const ov=[['t','ضخامت MDF'],['fib','ضخامت فیبر'],['gd','عمق شیار'],['bw','بادخور عرض درب'],['bh','بادخور ارتفاع درب'],['lq','لقی ریل'],['bd','کسر ارتفاع قوطی از درب'],['band','نوار بدنه'],['dband','نوار درب'],['hdL','جای دستگیره L'],['hdU','جای دستگیره U']];
 h+=`<details><summary>تنظیمات اختصاصی این یونیت (خالی = پیش‌فرض)</summary><div class="g">${ov.map(([k,l])=>`<div><label>${l}</label><input type="number" inputmode="decimal" data-len=1 data-u2="${u.id}" data-k2="${k}" placeholder="${Cm(k=='lq'?s.rl[u.rt]:s[k])}" value="${u.o[k]===undefined?'':Cm(u.o[k])}"></div>`).join('')}</div></details>
 <p><button data-act="savetpl" data-id="${u.id}">ذخیره الگو</button> <button data-act="dupu" data-id="${u.id}">کپی یونیت</button> <button data-act="delu" data-id="${u.id}">حذف یونیت</button></p></div>`;return h}

function bandHTML(p){const t={};rows(p).forEach(x=>{if(x.bm>0)t[x.bt]=(t[x.bt]||0)+x.bm});return `<div class="card"><h3>مصرف نوار PVC</h3>${Object.keys(t).map(k=>`نوار ${Cm(k)} سانتی‌متر (${k} میلی‌متر): <b>${t[k].toFixed(2)}</b> متر (با ۵٪ پرت: ${(t[k]*1.05).toFixed(2)})<br>`).join('')||'نواری انتخاب نشده'}</div>`}
let LC={body:0,front:0};
function cutHTML(p){LC={body:0,front:0};const r=rows(p),th={};let h='';r.filter(x=>x.m=='MDF'&&!x.bad).forEach(x=>{const k=x.g+'|'+x.th;for(let i=0;i<x.q;i++)(th[k]=th[k]||[]).push({n:x.u+'/'+x.n,L:x.rh,W:x.rw,no:x.no})});
 for(const k of Object.keys(th).sort()){const fr=k.startsWith('front'),s=fr?Object.assign({},S.set,{sw:S.set.fsw||S.set.sw,sh:S.set.fsh||S.set.sh}):S.set,res=pack(th[k],s),nm=fr?'درب':'بدنه (سفید)';
  if(res.err){h+=`<p class="err">قطعه «${res.err.n}» (${nm}) از ورق بزرگ‌تر است.</p>`;continue}
  LC[fr?'front':'body']+=res.sheets.length;const used=th[k].reduce((a,x)=>a+x.L*x.W,0),tot=res.sheets.length*s.sw*s.sh;
  h+=`<div class="card"><h3>${nm} — MDF ${Cm(k.split('|')[1])} سانتی‌متر: ${res.sheets.length} ورق (${Cm(s.sw)}×${Cm(s.sh)})</h3>مساحت مفید ${(used/1e6).toFixed(2)} م² · پرت ${((tot-used)/1e6).toFixed(2)} م² (${((1-used/tot)*100).toFixed(1)}٪)</div>`+
  res.sheets.map((sh,i)=>`<div class="card"><b>${nm} · ورق ${i+1}</b><svg viewBox="0 0 ${s.sw} ${s.sh}"><rect width="${s.sw}" height="${s.sh}" fill="none" stroke="#888" stroke-width="6"/>${sh.p.map(q=>`<rect x="${q.x+s.mg}" y="${q.y+s.mg}" width="${q.l}" height="${q.w}" fill="#c2570c" fill-opacity=".25" stroke="#c2570c" stroke-width="3"/><text x="${q.x+s.mg+q.l/2}" y="${q.y+s.mg+q.w/2}" font-size="30" text-anchor="middle" fill="currentColor">#${q.no} ${Cm(q.l)}×${Cm(q.w)}</text>`).join('')}</svg></div>`).join('')}
 const fa=r.filter(x=>x.m=='فیبر').reduce((a,x)=>a+x.w*x.h*x.q,0)/1e6;return h+`<div class="card">مساحت فیبر: ${fa.toFixed(2)} م²</div>`}

function setHTML(){const s=S.set,a='data-s=';
 return `<p class="m">همه اندازه‌ها به سانتی‌متر هستند (۰.۳ = ۳ میلی‌متر). هر بخش را با فلش باز و بسته کنید.</p>`+
 DT('body','ساخت بدنه',`<div class="g">${F('ضخامت MDF',a+'t',s.t)}${F('ضخامت فیبر',a+'fib',s.fib)}${F('عمق شیار',a+'gd',s.gd)}${F('لقی فیبر در شیار',a+'fc',s.fc)}${F('ضخامت نوار بدنه',a+'band',s.band)}${F('فاصله پشت طبقه',a+'ss',s.ss)}${F('کسر طول قید از عرض یونیت',a+'rd',s.rd)}</div>`)+
 DT('doors','درب‌ها',`<div class="g">${F('بادخور از عرض هر درب',a+'bw',s.bw)}${F('بادخور از ارتفاع هر درب',a+'bh',s.bh)}${F('ضخامت نوار درب',a+'dband',s.dband)}${F('جای دستگیره L (کسر از ارتفاع درب)',a+'hdL',s.hdL)}${F('جای دستگیره U (کسر از ارتفاع درب)',a+'hdU',s.hdU)}${F('پایین‌زدگی درب هوایی (کار مدرن)',a+'we',s.we)}</div><p class="m">ابعاد درب خودکار از ابعاد یونیت، بادخور و دستگیره محاسبه می‌شود. این بخش درب کشوها را هم شامل می‌شود.</p>`)+
 DT('drawer','کشو و ریل',`<div class="g">${F('عمق پیش‌فرض قوطی',a+'dd',s.dd)}${F('کسر ارتفاع قوطی از درب کشو',a+'bd',s.bd)}</div><h4>لقی ریل‌ها</h4><div class="g">${Object.keys(RT).map(k=>F(RT[k],'data-rl='+k,s.rl[k])).join('')}</div><p class="m">مقادیر پیش‌فرض تقریبی‌اند؛ با ریل خودتان تنظیم کنید.</p>`)+
 DT('kick','پاخور کمد',`<div class="g">${F('ارتفاع پاخور',a+'pk',s.pk)}${F('کسر طول پاخور از عرض کمد',a+'pkd',s.pkd)}</div><p class="m">پاخور بادخور ندارد و پیچ می‌شود.</p>`)+
 DT('price','قیمت‌ها (تومان)',`<div class="g">${F('هر ورق بدنه','data-pr=body',s.pr.body,0)}${F('هر ورق درب','data-pr=front',s.pr.front,0)}${F('هر متر نوار','data-pr=band',s.pr.band,0)}${F('هر م² فیبر','data-pr=fiber',s.pr.fiber,0)}${F('هر جفت ریل','data-pr=rail',s.pr.rail,0)}${F('هر متر پروفیل دستگیره','data-pr=prof',s.pr.prof,0)}</div>`)+
 DT('sheet','ورق',`<div class="g">${F('طول ورق بدنه (سفید)',a+'sw',s.sw)}${F('عرض ورق بدنه',a+'sh',s.sh)}${F('طول ورق درب',a+'fsw',s.fsw)}${F('عرض ورق درب',a+'fsh',s.fsh)}${F('تیغه برش',a+'kerf',s.kerf)}${F('فاصله از لبه',a+'mg',s.mg)}${SEL('چرخش قطعات',a+'rot',{1:'مجاز',0:'غیرمجاز (جهت رگه)'},s.rot)}</div>`)+
 DT('tpl',`الگوهای ذخیره‌شده (${S.tpl.length})`,S.tpl.map(t=>`<div>${t.name} <button data-act="deltpl" data-id="${t.id}">حذف</button></div>`).join('')||'<p class="m">در کارت یونیت «ذخیره الگو» را بزنید.</p>')+
 DT('bk','پشتیبان‌گیری','<button data-act="exp">ساخت متن پشتیبان</button> <button data-act="imp">بازیابی از متن</button><textarea id="bk" rows="8"></textarea><p class="m">متن را کپی و ذخیره کنید. بازیابی داده‌های فعلی را جایگزین می‌کند.</p>')+
 DT('help','راهنمای فرمول‌ها',`<p>اندازه‌ها سانتی‌متر هستند و میلی‌متر با ممیز نوشته می‌شود. ابعاد وارد‌شده نهایی هستند؛ خام = نهایی − نوار لبه‌های همان بُعد.</p><p>زمینی: کف زیر بغل‌ها، بدون سقف. قید بالا: پیش‌فرض ۳ عدد، عرض ۷؛ طول = عرض یونیت − ۳.۲.</p><p>هوایی: کف و سقف بین بغل‌ها، بدون کشو و بدون دستگیره L. در کار مدرن، درب به اندازه «پایین‌زدگی» پایین‌تر از باکس می‌آید: ارتفاع درب = ارتفاع + پایین‌زدگی − بادخور.</p><p>کمد: کف و سقف بین دو پهلو؛ بدون دستگیره L/U. پاخور: ارتفاع پیش‌فرض ۵، طول = عرض کمد − ۳.۲، بدون بادخور.</p><p>درب: عرض = عرض یونیت ÷ تعداد − بادخور عرض؛ ارتفاع = ارتفاع − بادخور ارتفاع − جای دستگیره (L و U هر کدام انتخاب شود کسر می‌شود).</p><p>کشو: هر کشو یک قوطی جدا (دو بغل، جلو و پشت، کف فیبر) و یک درب جدا که به قوطی پیچ می‌شود. عرض قوطی = عرض داخلی − لقی ریل. ارتفاع درب کشو خالی باشد، ارتفاع یونیت (منهای جای دستگیره) بین کشوها مساوی تقسیم می‌شود. ارتفاع قوطی خالی = ارتفاع درب − کسر قوطی (پیش‌فرض ۴.۵). مجموع ارتفاع درب کشوها (با بادخور) برابر درب یونیت‌های کناری می‌شود.</p><p>برش: بدنه (سفید) و درب جدا؛ ضخامت‌های مختلف جدا؛ تیغه و فاصله لبه لحاظ می‌شود.</p>`)}

function view(){const p=P0(),v=$('#v');$('#nav').innerHTML=Object.entries(TABS).map(([k,x])=>`<button class="${S.tab==k?'on':''}" data-tab="${k}">${x}</button>`).join('');
 if(!p&&!['projects','set'].includes(S.tab))S.tab='projects';let h='';
 if(S.tab=='projects')h=`<div class="card"><h3>پروژه جدید</h3><div class="g">${F('نام پروژه','id=pn','',0,'text')}${SEL('نوع کار','id=pk',KIND,'modern')}<div><label>&nbsp;</label><button class="p" data-act="newp">ساخت پروژه</button></div></div></div>`+
  (S.ps.map(x=>{const q=rows(x).reduce((a,r)=>a+r.q,0);return `<div class="card"><b>${x.name}</b> ${x.id==S.cur?'✓':''}<div class="m">${KIND[x.kind||'modern']} · ${new Date(x.date).toLocaleDateString('fa-IR')} · ${x.units.length} یونیت · ${q} قطعه</div><button class="p" data-act="open" data-id="${x.id}">باز کردن</button> <button data-act="dup" data-id="${x.id}">کپی</button> <button data-act="delp" data-id="${x.id}">حذف</button></div>`}).join('')||'<p class="m">هنوز پروژه‌ای ندارید؛ بالا یکی بسازید.</p>');
 else if(S.tab=='units')h=`<h3>${p.name}</h3><div class="card"><div class="g">${SEL('نوع کار','data-p=kind',KIND,p.kind||'modern')}${isMod(p)?SEL('دستگیره پیش‌فرض (زمینی)','data-p=hnd',HND,p.hnd||'L'):''}</div></div><div class="bar"><button class="p" data-act="addu" data-t="floor">+ زمینی</button><button class="p" data-act="addu" data-t="wall">+ هوایی</button><button class="p" data-act="addu" data-t="tall">+ کمد</button></div>${S.tpl.length?`<div class="card"><label>از الگوهای من</label><div class="bar" style="flex-wrap:wrap">${S.tpl.map(t=>`<button data-act="addtpl" data-id="${t.id}">+ ${t.name}</button>`).join('')}</div></div>`:''}`+p.units.map(u=>unitCard(u,p)).join('');
 else if(S.tab=='parts'){const r=rows(p);h=bandHTML(p)+`<button data-act="csv">کپی CSV</button><div class="card w"><table><tr><th>#</th><th>یونیت</th><th>قطعه</th><th>تعداد</th><th>نهایی (سانتی‌متر)</th><th>خام</th><th>ضخامت</th><th>گروه</th><th>لبه‌ها ب پ چ ر</th></tr>`+
  r.map(x=>`<tr class="${x.bad?'err':''}"><td>${x.no}</td><td>${x.u}</td><td>${x.n}</td><td>${x.q}</td><td>${Cm(x.h)}×${Cm(x.w)}</td><td>${Cm(x.rh)}×${Cm(x.rw)}</td><td>${Cm(x.th)}</td><td>${grp(x)}</td><td>${x.ed?['t','b','l','r'].map(c=>`<input type="checkbox" data-ov="${x.uid}|${x.n}|${c}" ${x.e.includes(c)?'checked':''}>`).join(' '):'—'}</td></tr>`).join('')+`</table></div>`+(r.some(x=>x.bad)?'<p class="err">ابعاد منفی یا صفر دارید؛ یونیت را اصلاح کنید.</p>':'')}
 else if(S.tab=='cut')h=cutHTML(p)+costHTML(p);
 else if(S.tab=='report'){const r=rows(p);h=`<button class="p np" data-act="print">چاپ / ذخیره PDF</button><div class="card"><h3>پروژه: ${p.name}</h3>نوع کار: ${KIND[p.kind||'modern']} · ${new Date(p.date).toLocaleDateString('fa-IR')} · ${p.units.length} یونیت (سانتی‌متر)<br>${p.units.map(u=>`${u.name}${u.cnt>1?' ×'+u.cnt:''}: ${TY[u.type]} ${Cm(u.w)}×${Cm(u.h)}×${Cm(u.d)}${u.hk&&u.hk!='none'?` · دستگیره ${HK(u.hk)} (طول پروفیل ${Cm(u.hl||u.w)})`:''}`).join('<br>')}</div>
  <div class="card w"><h3>لیست قطعات</h3><table><tr><th>#</th><th>یونیت</th><th>قطعه</th><th>تعداد</th><th>نهایی</th><th>خام</th><th>ضخامت</th><th>گروه</th><th>لبه‌ها</th></tr>${r.map(x=>`<tr><td>${x.no}</td><td>${x.u}</td><td>${x.n}</td><td>${x.q}</td><td>${Cm(x.h)}×${Cm(x.w)}</td><td>${Cm(x.rh)}×${Cm(x.rw)}</td><td>${Cm(x.th)}</td><td>${grp(x)}</td><td>${[...'tblr'].filter(c=>x.e.includes(c)).map(c=>ET[c]).join(' ')||'—'}</td></tr>`).join('')}</table></div>`+bandHTML(p)+cutHTML(p)+costHTML(p)+labelsHTML(p)}
 else h=setHTML();
 v.innerHTML=h}
const rerender=()=>{save();view()};
document.addEventListener('toggle',e=>{const k=e.target.dataset&&e.target.dataset.sk;if(k){S.sopen[k]=e.target.open;save()}},true);
document.addEventListener('click',e=>{const b=e.target.closest('[data-act],[data-tab]');if(!b)return;const d=b.dataset,p=P0(),U=()=>p.units.find(q=>q.id==d.id);
 if(d.tab){S.tab=d.tab;scrollTo(0,0);return rerender()}
 if(d.act=='newp'){const n=$('#pn').value.trim();if(!n)return alert('نام پروژه را وارد کنید');const x={id:uid(),name:n,date:Date.now(),kind:$('#pk').value,hnd:'L',units:[]};S.ps.push(x);S.cur=x.id;S.tab='units'}
 if(d.act=='open'){S.cur=d.id;S.tab='units'}
 if(d.act=='dup'){const x=JSON.parse(JSON.stringify(S.ps.find(q=>q.id==d.id)));x.id=uid();x.name+=' (کپی)';x.date=Date.now();S.ps.push(x)}
 if(d.act=='delp'&&confirm('پروژه حذف شود؟')){S.ps=S.ps.filter(q=>q.id!=d.id);if(S.cur==d.id)S.cur=null}
 if(d.act=='addu'){const T={floor:{w:600,h:720,d:560,sh:1,rails:3,rw:70,dn:2},wall:{w:600,h:720,d:320,sh:1,rails:0,rw:70,dn:2},tall:{w:600,h:2100,d:560,sh:3,rails:0,rw:70,dn:2}}[d.t],u={id:uid(),name:TY[d.t]+' '+(p.units.length+1),type:d.t,div:0,dh:'',pk:'',drs:[],rt:'ball',hnd:'',hl:'',cnt:1,o:{},ov:{},...T};p.units.push(u);S.open[u.id]=1}
 if(d.act=='tog')S.open[d.id]=!S.open[d.id];
 if(d.act=='dupu'){const x=JSON.parse(JSON.stringify(U()));x.id=uid();x.name+=' (کپی)';p.units.push(x);S.open[x.id]=1}
 if(d.act=='delu'&&confirm('یونیت حذف شود؟'))p.units=p.units.filter(q=>q.id!=d.id);
 if(d.act=='adddr'){const u=U(),l=u.drs[u.drs.length-1];u.drs.push({h:l?l.h:'',bh:'',dd:''})}
 if(d.act=='deldr')U().drs.splice(+d.i,1);
 if(d.act=='savetpl'){const nm=prompt('نام الگو؟');if(nm){const x=JSON.parse(JSON.stringify(U()));delete x.id;x.name=nm;S.tpl.push({id:uid(),name:nm,u:x})}}
 if(d.act=='addtpl'){const t=S.tpl.find(q=>q.id==d.id),x=JSON.parse(JSON.stringify(t.u));x.id=uid();p.units.push(x);S.open[x.id]=1}
 if(d.act=='deltpl')S.tpl=S.tpl.filter(q=>q.id!=d.id);
 if(d.act=='print')return window.print();
 if(d.act=='csv'){const c='یونیت,قطعه,تعداد,طول نهایی,عرض نهایی,طول خام,عرض خام,ضخامت,گروه,لبه‌ها,نوار متر\n'+rows(p).map(x=>[x.u,x.n,x.q,Cm(x.h),Cm(x.w),Cm(x.rh),Cm(x.rw),Cm(x.th),grp(x),x.e,x.bm.toFixed(2)].join(',')).join('\n');
  const t=document.createElement('textarea');t.value=c;document.body.appendChild(t);t.select();let ok=0;try{ok=document.execCommand('copy')}catch(_){}t.remove();return alert(ok?'CSV کپی شد؛ در Excel یا Notepad جای‌گذاری کنید.':'کپی ناموفق بود')}
 if(d.act=='exp')return void($('#bk').value=JSON.stringify({ps:S.ps,set:S.set,tpl:S.tpl}));
 if(d.act=='imp'){if(!confirm('داده‌های فعلی جایگزین شود؟'))return;try{const j=JSON.parse($('#bk').value);S.ps=j.ps||[];S.tpl=j.tpl||S.tpl;Object.assign(S.set,j.set||{});S.cur=null;S.tab='projects';norm()}catch(_){return alert('متن نامعتبر است')}}
 rerender()});
document.addEventListener('change',e=>{const t=e.target,d=t.dataset,p=P0(),U=id=>p.units.find(q=>q.id==id),n=()=>{const x=Math.max(0,+t.value||0);return d.len?R(x*10):x};
 if(d.u2){const u=U(d.u2);if(t.value==='')delete u.o[d.k2];else u.o[d.k2]=n()}
 else if(d.dr){const[id,i,f]=d.dr.split('|');U(id).drs[+i][f]=t.value===''?'':n()}
 else if(d.u){const u=U(d.u),k=d.k;u[k]=t.type=='text'||t.tagName=='SELECT'?t.value:(['hl','dh','pk'].includes(k)&&t.value===''?'':n());if(k=='cnt'&&!u.cnt)u.cnt=1}
 else if(d.ov){const[id,nm,c]=d.ov.split('|'),u=U(id),cur=rows(p).find(x=>x.uid==id&&x.n==nm).e;u.ov[nm]=t.checked?cur+c:cur.replace(c,'')}
 else if(d.p)p[d.p]=t.value
 else if(d.s)S.set[d.s]=d.s=='rot'?+t.value:n();
 else if(d.pr)S.set.pr[d.pr]=n();
 else if(d.rl)S.set.rl[d.rl]=n();
 else return;rerender()});

function costHTML(p){cutHTML(p);const r=rows(p),pr=S.set.pr,f=n=>Math.round(n).toLocaleString('fa-IR');
 const band=r.reduce((a,x)=>a+x.bm,0)*1.05,fib=r.filter(x=>x.m=='فیبر').reduce((a,x)=>a+x.w*x.h*x.q,0)/1e6;
 const rails=p.units.reduce((a,u)=>a+(u.type=='wall'?0:u.drs.length)*(u.cnt||1),0),prof=p.units.reduce((a,u)=>a+(u.hk&&u.hk!='none'?u.hk.length*(+u.hl||u.w)/1000*(u.cnt||1):0),0);
 const L=[['ورق بدنه',LC.body,pr.body,'ورق'],['ورق درب',LC.front,pr.front,'ورق'],['نوار PVC (با ۵٪ پرت)',band,pr.band,'متر'],['فیبر',fib,pr.fiber,'م²'],['ریل کشو',rails,pr.rail,'جفت'],['پروفیل دستگیره',prof,pr.prof,'متر']];
 const tot=L.reduce((a,x)=>a+x[1]*x[2],0);
 return `<div class="card w"><h3>برآورد هزینه</h3><table><tr><th>مورد</th><th>مقدار</th><th>قیمت واحد</th><th>جمع</th></tr>${L.map(x=>`<tr><td>${x[0]}</td><td>${x[1].toFixed(2)} ${x[3]}</td><td>${f(x[2])}</td><td>${f(x[1]*x[2])}</td></tr>`).join('')}<tr><th colspan="3">مجموع (تومان)</th><th>${f(tot)}</th></tr></table>${tot?'':'<p class="m">قیمت‌ها را در تنظیمات وارد کنید.</p>'}</div>`}
function labelsHTML(p){let h='';
 rows(p).filter(x=>x.m=='MDF'&&!x.bad).forEach(x=>{for(let i=1;i<=x.q;i++)h+=`<div class="lb"><b>#${x.no}</b> (${i}/${x.q})<br>${p.name} · ${x.u}<br>${x.n} — ${grp(x)}<br>نهایی ${Cm(x.h)}×${Cm(x.w)}<br>خام ${Cm(x.rh)}×${Cm(x.rw)}<br>لبه: ${[...'tblr'].filter(c=>x.e.includes(c)).map(c=>ET[c]).join(' ')||'—'}</div>`});
 return `<div class="card pb"><h3>برچسب قطعات</h3><div class="lbs">${h}</div></div>`}
function prevSVG(u,p){const s=eff(u),t=s.t,W=u.w,H=u.h,bw=s.bw,bh=s.bh,fs=Math.max(W,H)/26,e=fs/8,hk=hkOf(u,p),hh=(hk.includes('L')?s.hdL:0)+(hk.includes('U')?s.hdU:0),ex=(isMod(p)&&u.type=='wall')?s.we:0,m=fs*1.5;
 const R_=(x,y,w,h,c,o)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" fill-opacity="${o}" stroke="${c}" stroke-width="${e}"/>`,T=(x,y,tx)=>`<text x="${x}" y="${y}" font-size="${fs}" text-anchor="middle" fill="currentColor">${tx}</text>`,lab=(w,h)=>Cm(w)+'×'+Cm(h);
 let g=R_(0,0,W,H,'#888',0)+R_(0,0,t,H,'#888',.4)+R_(W-t,0,t,H,'#888',.4),n=u.sh||0;
 for(let i=1;i<=n;i++)g+=R_(t,H*i/(n+1),W-2*t,t,'#888',.4);
 if(u.type=='tall'){const pk=+u.pk||s.pk,pl=W-s.pkd;g+=R_((W-pl)/2,H-pk,pl,pk,'#2563eb',.25)+T(W/2,H-pk/2+fs/3,'پاخور '+lab(pl,pk))}
 const dr=u.type=='wall'?[]:(u.drs||[]),k=dr.length;let y=bh/2+hh;
 dr.forEach(d=>{const h=(+d.h||(H-hh)/k)-bh,w=W-bw;g+=R_((W-w)/2,y,w,h,'#c2570c',.3)+T(W/2,y+h/2+fs/3,lab(w,h));y+=h+bh});
 if(u.dn>0){const dw=W/u.dn-bw,dh=+u.dh||H+ex-bh-hh,y0=k?H-bh/2-dh:bh/2+hh;
  for(let i=0;i<u.dn;i++){const x=bw/2+i*W/u.dn;g+=R_(x,y0,dw,dh,'#c2570c',.3)+T(x+dw/2,y0+dh/2+fs/3,lab(dw,dh))}}
 if(hh)g+=`<rect x="0" y="${bh/2}" width="${W}" height="${hh}" fill="none" stroke="#2563eb" stroke-dasharray="${fs/2}" stroke-width="${e}"/>`+T(W/2,bh/2+hh/2+fs/3,'دستگیره '+HK(hk));
 return `<svg viewBox="${-m} ${-m} ${W+2*m} ${H+ex+2*m}" style="max-height:240px">${g}</svg>`}
boot();
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
