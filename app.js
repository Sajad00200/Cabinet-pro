const R=x=>Math.round(x*10)/10,$=s=>document.querySelector(s);
const D={t:16,fib:5,gd:8,fc:2,band:1,sw:2800,sh:2070,kerf:4,mg:10,rot:1,ss:20,rv:3,dd:500,bd:30,hd:30,fsw:2800,fsh:2070,rl:{ball:26,tandem:42,body:26,three:26,custom:20},pr:{body:0,front:0,fiber:0,band:0,rail:0,prof:0}};
let S={ps:[],cur:null,set:{},tab:'projects',open:{},tpl:[]};
const DB=new Promise(r=>{try{const q=indexedDB.open('cabinetpro',1);q.onupgradeneeded=()=>q.result.createObjectStore('kv');q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}catch(e){r(null)}});
async function dbGet(){const d=await DB;if(!d)return null;return new Promise(r=>{try{const q=d.transaction('kv').objectStore('kv').get('state');q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}catch(e){r(null)}})}
function norm(){S.set=Object.assign(JSON.parse(JSON.stringify(D)),S.set);S.set.rl=Object.assign({},D.rl,S.set.rl);S.set.pr=Object.assign({},D.pr,S.set.pr);S.open=S.open||{};S.tpl=S.tpl||[];
 S.ps.forEach(p=>p.units.forEach(u=>{if(!u.drs)u.drs=(u.dfs||'').split(',').map(Number).filter(x=>x>0).map(h=>({h:h-3,w:'',bh:''}));u.cnt=u.cnt||1;u.o=u.o||{};u.ov=u.ov||{}}))}
norm();
function save(){clearTimeout(save.t);save.t=setTimeout(async()=>{const d=await DB,j=JSON.stringify(S);if(d){try{d.transaction('kv','readwrite').objectStore('kv').put(j,'state');return}catch(e){}}try{localStorage.cabinetPro=j}catch(e){}},0)}
async function boot(){let raw=await dbGet();if(!raw)raw=localStorage.cabinetPro;try{if(raw)Object.assign(S,JSON.parse(raw))}catch(e){}norm();view();try{navigator.storage.persist()}catch(e){}}
const P0=()=>S.ps.find(p=>p.id==S.cur),uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const KIND={modern:'مدرن',paint:'رنگ',neo:'نئوکلاسیک',classic:'کلاسیک',other:'سایر'},TY={floor:'زمینی',wall:'هوایی',tall:'کمدی/ایستاده'},RT={ball:'ساچمه‌ای',tandem:'تاندم/مخفی',body:'بدنه‌دار',three:'سه‌تکه',custom:'دستی'},ET={t:'ب',b:'پ',l:'چ',r:'ر'};
const isMod=p=>(p.kind||'modern')=='modern';

function eff(u){const s=Object.assign({},S.set,{rl:Object.assign({},S.set.rl)}),o=u.o||{};for(const k in o)if(o[k]!==''&&o[k]!=null&&!isNaN(o[k])){if(k=='lq')s.rl[u.rt]=+o[k];else s[k]=+o[k]}return s}
function calc(u,s){const t=s.t,W=u.w,H=u.h,Dp=u.d,iw=W-2*t,o=[],c=u.cnt||1;
 const P=(n,w,h,q,th,e,m)=>o.push({n,w:R(w),h:R(h),q:q*c,th,e:e||'',m:m||'MDF'});
 const fb=(w,h)=>P('فیبر پشت',w,h,1,s.fib,'','فیبر'),fw=iw+2*s.gd-s.fc;
 if(u.type=='floor'){P('بغل',Dp,H-t,2,t,'l');P('کف',Dp,W,1,t,'l');if(u.rails>0)P('قید بالا',u.rw,iw,u.rails,t,'l');
  if(u.sh>0)P('طبقه',Dp-s.fib-s.ss,iw,u.sh,t,'l');fb(fw,H-t+s.gd-s.fc)}
 else if(u.type=='wall'){P('بغل',Dp,H,2,t,'l');P('کف',Dp,iw,1,t,'l');P('سقف',Dp,iw,1,t,'l');
  if(u.sh>0)P('طبقه',Dp-s.fib-s.ss,iw,u.sh,t,'l');fb(fw,H-2*t+2*s.gd-s.fc)}
 else{P('بغل',Dp,H,2,t,'l');P('کف',Dp,iw,1,t,'l');P('سقف',Dp,iw,1,t,'l');if(u.div>0)P('تقسیم عمودی',Dp,H-2*t,u.div,t,'l');
  const cw=(iw-u.div*t)/(u.div+1);if(u.sh>0)P('طبقه',Dp-s.fib-s.ss,cw,u.sh*(u.div+1),t,'l');fb(fw,H-2*t+2*s.gd-s.fc)}
 const rv=s.rv;
 (u.drs||[]).forEach((d,i)=>{const n=i+1,fh=+d.h||0,bw=iw-s.rl[u.rt],dd=u.dd||s.dd;
  P('نمای کشو '+n,fh,+d.w||W-rv,1,t,'tblr');
  if(+u.box){const bh=+d.bh||fh-s.bd;P('بغل کشو '+n,bh,dd,2,t,'l');P('جلو/پشت کشو '+n,bh,bw-2*t,2,t,'l');
   P('کف کشو '+n,dd-2*t+2*s.gd-s.fc,bw-2*t+2*s.gd-s.fc,1,s.fib,'','فیبر')}});
 if(u.dn>0)P('درب',W/u.dn-rv,+u.dh||H-rv-(s.hh||0),u.dn,t,'tblr');
 return o}

function rows(p){const out=[];
 for(const u of p.units){const s=eff(u),hk=isMod(p)?(u.hnd||p.hnd||'L'):'none';
  s.hh=hk=='none'?0:(u.hh!==''&&u.hh!=null?+u.hh:s.hd);u.hk=hk;let L;try{L=calc(u,s)}catch(e){L=[]}
  for(const r of L){const e=u.ov[r.n]!=null?u.ov[r.n]:r.e,bt=r.m=='MDF'?s.band:0;
   const rw=r.w-(e.includes('l')?bt:0)-(e.includes('r')?bt:0),rh=r.h-(e.includes('t')?bt:0)-(e.includes('b')?bt:0);
   const bm=(((e.includes('t')?r.w:0)+(e.includes('b')?r.w:0)+(e.includes('l')?r.h:0)+(e.includes('r')?r.h:0))*r.q)/1000;
   out.push({u:u.name,uid:u.id,...r,e,bt,g:/^(درب|نمای)/.test(r.n)?'front':'body',rw:R(rw),rh:R(rh),bm,bad:rw<=0||rh<=0||r.w<=0||r.h<=0,ed:r.m=='MDF'})}}
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
const F=(l,a,v,t='number')=>`<div><label>${l}</label><input type="${t}" inputmode="${t=='number'?'decimal':'text'}" ${a} value="${v}"></div>`;
const SEL=(l,a,o,v)=>`<div><label>${l}</label><select ${a}>${Object.entries(o).map(([k,x])=>`<option value="${k}" ${k==v?'selected':''}>${x}</option>`).join('')}</select></div>`;
const grp=x=>x.m=='فیبر'?'فیبر':x.g=='front'?'در/نما':'بدنه';

function warn(u,p){const t=S.set.t,m=[];if(u.w<2*t+50)m.push('عرض خیلی کم است');if(u.h<2*t+50)m.push('ارتفاع خیلی کم است');if(u.d<100)m.push('عمق خیلی کم است');
 if(+u.box&&u.drs.length&&(u.dd||S.set.dd)>u.d-S.set.fib)m.push('عمق کشو از عمق یونیت بیشتر است');if(u.dn>0&&u.drs.length&&!u.dh)m.push('هم درب دارید هم کشو: ارتفاع درب را دستی وارد کنید');
 if(u.drs.some(d=>!+d.h))m.push('ارتفاع نمای یک کشو خالی است');return m.length?`<p class="err">⚠ ${m.join(' · ')}</p>`:''}

function unitCard(u,p){const a=`data-u="${u.id}"`,I=(k,l,ph='')=>`<div><label>${l}</label><input type="number" inputmode="decimal" ${a} data-k="${k}" placeholder="${ph}" value="${u[k]??''}"></div>`;
 const n=rows({...p,units:[u]}).reduce((x,r)=>x+r.q,0),o=S.open[u.id],mod=isMod(p),s=S.set;
 let h=`<div class="card"><div class="uh" data-act="tog" data-id="${u.id}"><div><b>${u.name}</b>${u.cnt>1?' ×'+u.cnt:''}<div class="m">${TY[u.type]} · ${u.w}×${u.h}×${u.d} · ${n} قطعه</div></div><span>${o?'▲':'▼'}</span></div>${warn(u,p)}`;
 if(!o)return h+'</div>';
 h+=prevSVG(u,p)+`<div class="g">${F('نام',a+' data-k=name',u.name,'text')}${I('cnt','تعداد یونیت مشابه')}${I('w','عرض')}${I('h','ارتفاع')}${I('d','عمق')}${I('sh','تعداد طبقه')}
 ${u.type=='floor'?I('rails','تعداد قید بالا')+I('rw','عرض قید'):''}${u.type=='tall'?I('div','تقسیم عمودی'):''}${I('dn','تعداد درب')}${I('dh','ارتفاع درب (خالی=خودکار)')}</div>
 <h4>کشوها</h4>${u.drs.map((d,i)=>`<div class="dr"><b>${i+1}</b>${['h','w','bh'].map((f,j)=>`<input type="number" inputmode="decimal" data-dr="${u.id}|${i}|${f}" placeholder="${['ارتفاع نما','عرض نما (خودکار)','ارتفاع بدنه (خودکار)'][j]}" value="${d[f]||''}">`).join('')}<button data-act="deldr" data-id="${u.id}" data-i="${i}">✕</button></div>`).join('')}
 <button data-act="adddr" data-id="${u.id}">+ کشو</button>
 ${u.drs.length?`<div class="g">${SEL('باکس کشو',a+' data-k=box',{1:'دارد',0:'ندارد (فقط نما)'},+u.box?1:0)}${I('dd','عمق کشو',s.dd)}${SEL('نوع ریل',a+' data-k=rt',RT,u.rt)}</div>`:''}
 ${mod?`<h4>دستگیره مخفی</h4><div class="g">${SEL('نوع',a+' data-k=hnd',{'':'پیش‌فرض پروژه ('+(p.hnd||'L')+')',L:'L',U:'U',none:'بدون'},u.hnd||'')}${I('hh','ارتفاع جای دستگیره (کسر از درب)',s.hd)}${I('hl','طول پروفیل',u.w)}</div>`:''}
 <details><summary>تنظیمات اختصاصی این یونیت (خالی = پیش‌فرض)</summary><div class="g">${[['t','ضخامت MDF'],['fib','ضخامت فیبر'],['gd','عمق شیار'],['rv','بادخور'],['lq','لقی ریل'],['bd','کسر ارتفاع بدنه کشو'],['band','ضخامت نوار']].map(([k,l])=>`<div><label>${l}</label><input type="number" inputmode="decimal" data-u2="${u.id}" data-k2="${k}" placeholder="${k=='lq'?s.rl[u.rt]:s[k]}" value="${u.o[k]??''}"></div>`).join('')}</div></details>
 <p><button data-act="savetpl" data-id="${u.id}">ذخیره الگو</button> <button data-act="dupu" data-id="${u.id}">کپی یونیت</button> <button data-act="delu" data-id="${u.id}">حذف یونیت</button></p></div>`;return h}

function bandHTML(p){const t={};rows(p).forEach(x=>{if(x.bm>0)t[x.bt]=(t[x.bt]||0)+x.bm});return `<div class="card"><h3>مصرف نوار PVC</h3>${Object.keys(t).map(k=>`نوار ${k} میلی‌متر: <b>${t[k].toFixed(2)}</b> متر (با ۵٪ پرت: ${(t[k]*1.05).toFixed(2)})<br>`).join('')||'نواری انتخاب نشده'}</div>`}
let LC={body:0,front:0};
function cutHTML(p){LC={body:0,front:0};const r=rows(p),th={};let h='';r.filter(x=>x.m=='MDF'&&!x.bad).forEach(x=>{const k=x.g+'|'+x.th;for(let i=0;i<x.q;i++)(th[k]=th[k]||[]).push({n:x.u+'/'+x.n,L:x.rh,W:x.rw,no:x.no})});
 for(const k of Object.keys(th).sort()){const fr=k.startsWith('front'),s=fr?Object.assign({},S.set,{sw:S.set.fsw||S.set.sw,sh:S.set.fsh||S.set.sh}):S.set,res=pack(th[k],s),nm=fr?'در و نما':'بدنه (سفید)';
  if(res.err){h+=`<p class="err">قطعه «${res.err.n}» (${nm}) از ورق بزرگ‌تر است.</p>`;continue}
  LC[fr?'front':'body']+=res.sheets.length;const used=th[k].reduce((a,x)=>a+x.L*x.W,0),tot=res.sheets.length*s.sw*s.sh;
  h+=`<div class="card"><h3>${nm} — MDF ${k.split('|')[1]} میلی‌متر: ${res.sheets.length} ورق (${s.sw}×${s.sh})</h3>مساحت مفید ${(used/1e6).toFixed(2)} م² · پرت ${((tot-used)/1e6).toFixed(2)} م² (${((1-used/tot)*100).toFixed(1)}٪)</div>`+
  res.sheets.map((sh,i)=>`<div class="card"><b>${nm} · ورق ${i+1}</b><svg viewBox="0 0 ${s.sw} ${s.sh}"><rect width="${s.sw}" height="${s.sh}" fill="none" stroke="#888" stroke-width="6"/>${sh.p.map(q=>`<rect x="${q.x+s.mg}" y="${q.y+s.mg}" width="${q.l}" height="${q.w}" fill="#c2570c" fill-opacity=".25" stroke="#c2570c" stroke-width="3"/><text x="${q.x+s.mg+q.l/2}" y="${q.y+s.mg+q.w/2}" font-size="30" text-anchor="middle" fill="currentColor">#${q.no} ${q.l}×${q.w}</text>`).join('')}</svg></div>`).join('')}
 const fa=r.filter(x=>x.m=='فیبر').reduce((a,x)=>a+x.w*x.h*x.q,0)/1e6;return h+`<div class="card">مساحت فیبر: ${fa.toFixed(2)} م²</div>`}

function setHTML(){const s=S.set,a='data-s=';
 return `<div class="card"><h3>تنظیمات عمومی (میلی‌متر)</h3><div class="g">${F('ضخامت MDF',a+'t',s.t)}${F('ضخامت فیبر',a+'fib',s.fib)}${F('عمق شیار',a+'gd',s.gd)}${F('لقی فیبر در شیار',a+'fc',s.fc)}${F('ضخامت نوار',a+'band',s.band)}${F('فاصله پشت طبقه',a+'ss',s.ss)}${F('بادخور هر درب/نما',a+'rv',s.rv)}${F('کسر ارتفاع درب برای دستگیره مخفی',a+'hd',s.hd)}${F('عمق پیش‌فرض کشو',a+'dd',s.dd)}${F('کسر ارتفاع بدنه کشو از نما',a+'bd',s.bd)}</div></div>
 <div class="card"><h3>لقی ریل‌ها</h3><div class="g">${Object.keys(RT).map(k=>F(RT[k],'data-rl='+k,s.rl[k])).join('')}</div><p class="m">مقادیر پیش‌فرض تقریبی‌اند؛ با ریل خودتان تنظیم کنید.</p></div>
 <div class="card"><h3>قیمت‌ها (تومان)</h3><div class="g">${F('هر ورق بدنه','data-pr=body',s.pr.body)}${F('هر ورق در/نما','data-pr=front',s.pr.front)}${F('هر متر نوار','data-pr=band',s.pr.band)}${F('هر م² فیبر','data-pr=fiber',s.pr.fiber)}${F('هر جفت ریل','data-pr=rail',s.pr.rail)}${F('هر متر پروفیل دستگیره','data-pr=prof',s.pr.prof)}</div></div>
 <div class="card"><h3>ورق</h3><div class="g">${F('طول ورق بدنه (سفید)',a+'sw',s.sw)}${F('عرض ورق بدنه',a+'sh',s.sh)}${F('طول ورق در/نما',a+'fsw',s.fsw)}${F('عرض ورق در/نما',a+'fsh',s.fsh)}${F('تیغه برش',a+'kerf',s.kerf)}${F('فاصله از لبه',a+'mg',s.mg)}${SEL('چرخش قطعات',a+'rot',{1:'مجاز',0:'غیرمجاز (جهت رگه)'},s.rot)}</div></div>
 <details class="card"><summary>الگوهای ذخیره‌شده (${S.tpl.length})</summary>${S.tpl.map(t=>`<div>${t.name} <button data-act="deltpl" data-id="${t.id}">حذف</button></div>`).join('')||'<p class="m">در کارت یونیت «ذخیره الگو» را بزنید.</p>'}</details>
 <details class="card"><summary>پشتیبان‌گیری</summary><button data-act="exp">ساخت متن پشتیبان</button> <button data-act="imp">بازیابی از متن</button><textarea id="bk" rows="8"></textarea><p class="m">متن را کپی و ذخیره کنید. بازیابی داده‌های فعلی را جایگزین می‌کند.</p></details>
 <details class="card"><summary>راهنمای فرمول‌ها</summary><p>ابعاد وارد‌شده نهایی هستند؛ خام = نهایی − نوار دو طرف همان بُعد.</p><p>زمینی: کف زیر بغل‌ها، بدون سقف، با قید. هوایی/کمدی: کف و سقف بین بغل‌ها.</p><p>فیبر در شیار: عرض داخلی + ۲×عمق شیار − لقی.</p><p>درب (فقط روکار): عرض = عرض کل ÷ تعداد − بادخور؛ ارتفاع = ارتفاع − بادخور − جای دستگیره (کار مدرن).</p><p>کشو: ابعاد نما را خودتان وارد می‌کنید (نهایی، بدون کسر). عرض بدنه = عرض داخلی − لقی ریل؛ ارتفاع بدنه خالی = ارتفاع نما − کسر بدنه.</p><p>برش: بدنه (سفید) و در/نما جدا؛ ضخامت‌های مختلف جدا؛ تیغه و فاصله لبه لحاظ می‌شود.</p></details>`}

function view(){const p=P0(),v=$('#v');$('#nav').innerHTML=Object.entries(TABS).map(([k,x])=>`<button class="${S.tab==k?'on':''}" data-tab="${k}">${x}</button>`).join('');
 if(!p&&!['projects','set'].includes(S.tab))S.tab='projects';let h='';
 if(S.tab=='projects')h=`<div class="card"><h3>پروژه جدید</h3><div class="g">${F('نام پروژه','id=pn','','text')}${SEL('نوع کار','id=pk',KIND,'modern')}<div><label>&nbsp;</label><button class="p" data-act="newp">ساخت پروژه</button></div></div></div>`+
  (S.ps.map(x=>{const q=rows(x).reduce((a,r)=>a+r.q,0);return `<div class="card"><b>${x.name}</b> ${x.id==S.cur?'✓':''}<div class="m">${KIND[x.kind||'modern']} · ${new Date(x.date).toLocaleDateString('fa-IR')} · ${x.units.length} یونیت · ${q} قطعه</div><button class="p" data-act="open" data-id="${x.id}">باز کردن</button> <button data-act="dup" data-id="${x.id}">کپی</button> <button data-act="delp" data-id="${x.id}">حذف</button></div>`}).join('')||'<p class="m">هنوز پروژه‌ای ندارید؛ بالا یکی بسازید.</p>');
 else if(S.tab=='units')h=`<h3>${p.name}</h3><div class="card"><div class="g">${SEL('نوع کار','data-p=kind',KIND,p.kind||'modern')}${isMod(p)?SEL('دستگیره پیش‌فرض','data-p=hnd',{L:'L',U:'U',none:'بدون'},p.hnd||'L'):''}</div></div><div class="bar"><button class="p" data-act="addu" data-t="floor">+ زمینی</button><button class="p" data-act="addu" data-t="wall">+ هوایی</button><button class="p" data-act="addu" data-t="tall">+ کمدی</button></div>${S.tpl.length?`<div class="card"><label>از الگوهای من</label><div class="bar" style="flex-wrap:wrap">${S.tpl.map(t=>`<button data-act="addtpl" data-id="${t.id}">+ ${t.name}</button>`).join('')}</div></div>`:''}`+p.units.map(u=>unitCard(u,p)).join('');
 else if(S.tab=='parts'){const r=rows(p);h=bandHTML(p)+`<button data-act="csv">کپی CSV</button><div class="card w"><table><tr><th>#</th><th>یونیت</th><th>قطعه</th><th>تعداد</th><th>نهایی (طول×عرض)</th><th>خام</th><th>ضخامت</th><th>گروه</th><th>لبه‌ها ب پ چ ر</th></tr>`+
  r.map(x=>`<tr class="${x.bad?'err':''}"><td>${x.no}</td><td>${x.u}</td><td>${x.n}</td><td>${x.q}</td><td>${x.h}×${x.w}</td><td>${x.rh}×${x.rw}</td><td>${x.th}</td><td>${grp(x)}</td><td>${x.ed?['t','b','l','r'].map(c=>`<input type="checkbox" data-ov="${x.uid}|${x.n}|${c}" ${x.e.includes(c)?'checked':''}>`).join(' '):'—'}</td></tr>`).join('')+`</table></div>`+(r.some(x=>x.bad)?'<p class="err">ابعاد منفی یا صفر دارید؛ یونیت را اصلاح کنید.</p>':'')}
 else if(S.tab=='cut')h=cutHTML(p)+costHTML(p);
 else if(S.tab=='report'){const r=rows(p);h=`<button class="p np" data-act="print">چاپ / ذخیره PDF</button><div class="card"><h3>پروژه: ${p.name}</h3>نوع کار: ${KIND[p.kind||'modern']} · ${new Date(p.date).toLocaleDateString('fa-IR')} · ${p.units.length} یونیت<br>${p.units.map(u=>`${u.name}${u.cnt>1?' ×'+u.cnt:''}: ${TY[u.type]} ${u.w}×${u.h}×${u.d}${u.hk&&u.hk!='none'?` · دستگیره ${u.hk} (ارتفاع ${u.hh!==''&&u.hh!=null?u.hh:S.set.hd}، طول ${u.hl||u.w})`:''}`).join('<br>')}</div>
  <div class="card w"><h3>لیست قطعات</h3><table><tr><th>#</th><th>یونیت</th><th>قطعه</th><th>تعداد</th><th>نهایی</th><th>خام</th><th>ضخامت</th><th>گروه</th><th>لبه‌ها</th></tr>${r.map(x=>`<tr><td>${x.no}</td><td>${x.u}</td><td>${x.n}</td><td>${x.q}</td><td>${x.h}×${x.w}</td><td>${x.rh}×${x.rw}</td><td>${x.th}</td><td>${grp(x)}</td><td>${[...'tblr'].filter(c=>x.e.includes(c)).map(c=>ET[c]).join(' ')||'—'}</td></tr>`).join('')}</table></div>`+bandHTML(p)+cutHTML(p)+costHTML(p)+labelsHTML(p)}
 else h=setHTML();
 v.innerHTML=h}
const rerender=()=>{save();view()};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act],[data-tab]');if(!b)return;const d=b.dataset,p=P0(),U=()=>p.units.find(q=>q.id==d.id);
 if(d.tab){S.tab=d.tab;scrollTo(0,0);return rerender()}
 if(d.act=='newp'){const n=$('#pn').value.trim();if(!n)return alert('نام پروژه را وارد کنید');const x={id:uid(),name:n,date:Date.now(),kind:$('#pk').value,hnd:'L',units:[]};S.ps.push(x);S.cur=x.id;S.tab='units'}
 if(d.act=='open'){S.cur=d.id;S.tab='units'}
 if(d.act=='dup'){const x=JSON.parse(JSON.stringify(S.ps.find(q=>q.id==d.id)));x.id=uid();x.name+=' (کپی)';x.date=Date.now();S.ps.push(x)}
 if(d.act=='delp'&&confirm('پروژه حذف شود؟')){S.ps=S.ps.filter(q=>q.id!=d.id);if(S.cur==d.id)S.cur=null}
 if(d.act=='addu'){const T={floor:{w:600,h:720,d:560,sh:1,rails:2,rw:80,dn:2},wall:{w:600,h:720,d:320,sh:1,rails:0,rw:80,dn:2},tall:{w:600,h:2100,d:560,sh:3,rails:0,rw:80,dn:2}}[d.t],u={id:uid(),name:TY[d.t]+' '+(p.units.length+1),type:d.t,div:0,dh:'',box:1,dd:0,drs:[],rt:'ball',hnd:'',hh:'',hl:'',cnt:1,o:{},ov:{},...T};p.units.push(u);S.open[u.id]=1}
 if(d.act=='tog')S.open[d.id]=!S.open[d.id];
 if(d.act=='dupu'){const x=JSON.parse(JSON.stringify(U()));x.id=uid();x.name+=' (کپی)';p.units.push(x);S.open[x.id]=1}
 if(d.act=='delu'&&confirm('یونیت حذف شود؟'))p.units=p.units.filter(q=>q.id!=d.id);
 if(d.act=='adddr'){const u=U(),l=u.drs[u.drs.length-1];u.drs.push({h:l?l.h:'',w:'',bh:''})}
 if(d.act=='deldr')U().drs.splice(+d.i,1);
 if(d.act=='savetpl'){const nm=prompt('نام الگو؟');if(nm){const x=JSON.parse(JSON.stringify(U()));delete x.id;x.name=nm;S.tpl.push({id:uid(),name:nm,u:x})}}
 if(d.act=='addtpl'){const t=S.tpl.find(q=>q.id==d.id),x=JSON.parse(JSON.stringify(t.u));x.id=uid();p.units.push(x);S.open[x.id]=1}
 if(d.act=='deltpl')S.tpl=S.tpl.filter(q=>q.id!=d.id);
 if(d.act=='print')return window.print();
 if(d.act=='csv'){const c='یونیت,قطعه,تعداد,طول نهایی,عرض نهایی,طول خام,عرض خام,ضخامت,گروه,لبه‌ها,نوار متر\n'+rows(p).map(x=>[x.u,x.n,x.q,x.h,x.w,x.rh,x.rw,x.th,grp(x),x.e,x.bm.toFixed(2)].join(',')).join('\n');
  const t=document.createElement('textarea');t.value=c;document.body.appendChild(t);t.select();let ok=0;try{ok=document.execCommand('copy')}catch(_){}t.remove();return alert(ok?'CSV کپی شد؛ در Excel یا Notepad جای‌گذاری کنید.':'کپی ناموفق بود')}
 if(d.act=='exp')return void($('#bk').value=JSON.stringify({ps:S.ps,set:S.set,tpl:S.tpl}));
 if(d.act=='imp'){if(!confirm('داده‌های فعلی جایگزین شود؟'))return;try{const j=JSON.parse($('#bk').value);S.ps=j.ps||[];S.tpl=j.tpl||S.tpl;Object.assign(S.set,j.set||{});S.cur=null;S.tab='projects'}catch(_){return alert('متن نامعتبر است')}}
 rerender()});
document.addEventListener('change',e=>{const t=e.target,d=t.dataset,p=P0(),U=id=>p.units.find(q=>q.id==id),n=()=>Math.max(0,+t.value||0);
 if(d.u2){const u=U(d.u2);if(t.value==='')delete u.o[d.k2];else u.o[d.k2]=+t.value}
 else if(d.dr){const[id,i,f]=d.dr.split('|');U(id).drs[+i][f]=t.value===''?'':n()}
 else if(d.u){const u=U(d.u),k=d.k;u[k]=t.type=='text'||t.tagName=='SELECT'?t.value:(['hh','dh'].includes(k)&&t.value===''?'':n());if(k=='box')u.box=+t.value;if(k=='cnt'&&!u.cnt)u.cnt=1}
 else if(d.ov){const[id,nm,c]=d.ov.split('|'),u=U(id),cur=rows(p).find(x=>x.uid==id&&x.n==nm).e;u.ov[nm]=t.checked?cur+c:cur.replace(c,'')}
 else if(d.p)p[d.p]=t.value
 else if(d.s)S.set[d.s]=d.s=='rot'?+t.value:n();
 else if(d.pr)S.set.pr[d.pr]=n();
 else if(d.rl)S.set.rl[d.rl]=n();
 else return;rerender()});

function costHTML(p){cutHTML(p);const r=rows(p),pr=S.set.pr,f=n=>Math.round(n).toLocaleString('fa-IR');
 const band=r.reduce((a,x)=>a+x.bm,0)*1.05,fib=r.filter(x=>x.m=='فیبر').reduce((a,x)=>a+x.w*x.h*x.q,0)/1e6;
 const rails=p.units.reduce((a,u)=>a+(+u.box?u.drs.length:0)*(u.cnt||1),0),prof=p.units.reduce((a,u)=>a+(u.hk&&u.hk!='none'?(+u.hl||u.w)/1000*(u.cnt||1):0),0);
 const L=[['ورق بدنه',LC.body,pr.body,'ورق'],['ورق در/نما',LC.front,pr.front,'ورق'],['نوار PVC (با ۵٪ پرت)',band,pr.band,'متر'],['فیبر',fib,pr.fiber,'م²'],['ریل کشو',rails,pr.rail,'جفت'],['پروفیل دستگیره',prof,pr.prof,'متر']];
 const tot=L.reduce((a,x)=>a+x[1]*x[2],0);
 return `<div class="card w"><h3>برآورد هزینه</h3><table><tr><th>مورد</th><th>مقدار</th><th>قیمت واحد</th><th>جمع</th></tr>${L.map(x=>`<tr><td>${x[0]}</td><td>${x[1].toFixed(2)} ${x[3]}</td><td>${f(x[2])}</td><td>${f(x[1]*x[2])}</td></tr>`).join('')}<tr><th colspan="3">مجموع (تومان)</th><th>${f(tot)}</th></tr></table>${tot?'':'<p class="m">قیمت‌ها را در تنظیمات وارد کنید.</p>'}</div>`}
function labelsHTML(p){let h='';const E={t:'ب',b:'پ',l:'چ',r:'ر'};
 rows(p).filter(x=>x.m=='MDF'&&!x.bad).forEach(x=>{for(let i=1;i<=x.q;i++)h+=`<div class="lb"><b>#${x.no}</b> (${i}/${x.q})<br>${p.name} · ${x.u}<br>${x.n} — ${grp(x)}<br>نهایی ${x.h}×${x.w}<br>خام ${x.rh}×${x.rw}<br>لبه: ${[...'tblr'].filter(c=>x.e.includes(c)).map(c=>E[c]).join(' ')||'—'}</div>`});
 return `<div class="card pb"><h3>برچسب قطعات</h3><div class="lbs">${h}</div></div>`}
function prevSVG(u,p){const s=eff(u),t=s.t,W=u.w,H=u.h,rv=s.rv,fs=Math.max(W,H)/26,e=fs/8,m=fs,hk=isMod(p)?(u.hnd||p.hnd||'L'):'none',hh=hk=='none'?0:(u.hh!==''&&u.hh!=null?+u.hh:s.hd);
 const R_=(x,y,w,h,c,o)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" fill-opacity="${o}" stroke="${c}" stroke-width="${e}"/>`,T=(x,y,tx)=>`<text x="${x}" y="${y}" font-size="${fs}" text-anchor="middle" fill="currentColor">${tx}</text>`;
 let g=R_(0,0,W,H,'#888',0)+R_(0,0,t,H,'#888',.4)+R_(W-t,0,t,H,'#888',.4),n=u.sh||0;
 for(let i=1;i<=n;i++)g+=R_(t,H*i/(n+1),W-2*t,t,'#888',.4);
 let y=rv/2;(u.drs||[]).forEach(d=>{const h=+d.h||0,w=+d.w||W-rv;g+=R_((W-w)/2,y,w,h,'#c2570c',.3)+T(W/2,y+h/2+fs/3,w+'×'+h);y+=h+rv});
 if(u.dn>0){const dw=W/u.dn-rv,dh=+u.dh||H-rv-hh,y0=u.drs.length?H-rv/2-dh:rv/2+(hh?hh:0);
  for(let i=0;i<u.dn;i++){const x=rv/2+i*W/u.dn;g+=R_(x,y0,dw,dh,'#c2570c',.3)+T(x+dw/2,y0+dh/2+fs/3,dw.toFixed(0)+'×'+dh.toFixed(0))}
  if(hh)g+=`<rect x="0" y="${rv/2}" width="${W}" height="${hh}" fill="none" stroke="#2563eb" stroke-dasharray="${fs/2}" stroke-width="${e}"/>`+T(W/2,rv/2+hh/2+fs/3,'دستگیره '+hk)}
 return `<svg viewBox="${-m} ${-m} ${W+2*m} ${H+2*m}" style="max-height:240px">${g}</svg>`}
boot();
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
