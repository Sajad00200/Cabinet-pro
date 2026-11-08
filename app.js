const R=x=>Math.round(x*10)/10,Cm=x=>R(x)/10,$=s=>document.querySelector(s);
/* همه مقادیر داخلی میلی‌متر هستند؛ ورودی و نمایش سانتی‌متر (۴.۹ = ۴۹ میلی‌متر) */
const D={t:16,fib:5,gd:8,fc:2,band:1,dband:1,bw:3,bh:3,hdL:30,hdU:30,we:20,ss:20,rd:32,dd:500,bd:40,pk:50,pkd:32,hr:130,mc:20,fo:100,
 sw:2800,sh:2070,fsw:2800,fsh:2070,fbw:2800,fbh:2070,psw:2440,psh:1220,kerf:4,mg:10,rot:1,
 rl:{ball:90,tandem:84,body:90,custom:90},
 pr:{body:0,front:0,pvc:0,fiber:0,band:0,rail:0,prof:0},lab:{sink:0,hood:0,gas:0,mf:0,mw:0}};
let S={ps:[],cur:null,set:{},tab:'projects',open:{},sopen:{},tpl:[]};
const DB=new Promise(r=>{try{const q=indexedDB.open('cabinetpro',1);q.onupgradeneeded=()=>q.result.createObjectStore('kv');q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}catch(e){r(null)}});
async function dbGet(){const d=await DB;if(!d)return null;return new Promise(r=>{try{const q=d.transaction('kv').objectStore('kv').get('state');q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}catch(e){r(null)}})}
function norm(){const old=S.set||{},mig=!old.v2;S.set=Object.assign(JSON.parse(JSON.stringify(D)),old);
 if(mig){S.set.bd=D.bd;S.set.rl=JSON.parse(JSON.stringify(D.rl));S.set.pr=Object.assign({},old.pr,{fiber:0})}
 S.set.v2=2;S.set.rl=Object.assign({},D.rl,S.set.rl);delete S.set.rl.three;S.set.pr=Object.assign({},D.pr,S.set.pr);S.set.lab=Object.assign({},D.lab,S.set.lab);
 S.open=S.open||{};S.sopen=S.sopen||{};S.tpl=S.tpl||[];
 S.ps.forEach(p=>{p.fronts=p.fronts||[];p.lab=Object.assign({sink:'',hood:'',gas:''},p.lab);p.units.forEach(u=>{u.drs=Array.isArray(u.drs)?u.drs:[];u.cnt=u.cnt||1;u.o=u.o||{};u.ov=u.ov||{};if(u.rt=='three')u.rt='ball';if(mig)delete u.o.lq})})}
norm();
function save(){clearTimeout(save.t);save.t=setTimeout(async()=>{const d=await DB,j=JSON.stringify(S);if(d){try{d.transaction('kv','readwrite').objectStore('kv').put(j,'state');return}catch(e){}}try{localStorage.cabinetPro=j}catch(e){}},0)}
async function boot(){let raw=await dbGet();if(!raw)try{raw=localStorage.cabinetPro}catch(e){}try{if(raw)Object.assign(S,JSON.parse(raw))}catch(e){}norm();view();try{navigator.storage.persist()}catch(e){}}
const P0=()=>S.ps.find(p=>p.id==S.cur),uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const KIND={modern:'مدرن',paint:'رنگ',neo:'نئوکلاسیک',classic:'کلاسیک',other:'سایر'},
 TY={floor:'زمینی',wall:'هوایی',tall:'کمد',vit:'ویترین',oven:'فر و ماکروفر',hood:'هود',fridge:'یخچال',sink:'زیر سینک (PVC)',drain:'آبچکان'},
 CM=['floor','wall','tall'],DRT=['floor','tall'],HS=['floor','wall','tall','vit','fridge'],
 RT={ball:'ساچمه‌ای',tandem:'تاندم/مخفی',body:'بدنه‌دار',custom:'دستی'},ET={t:'ب',b:'پ',l:'چ',r:'ر'};
const HND={L:'L',U:'U',LU:'L و U',none:'بدون'},HK=h=>h=='none'?'بدون':h.split('').join(' + ');
const isMod=p=>(p.kind||'modern')=='modern';
const hkOf=(u,p)=>(isMod(p)&&u.type=='floor')?(u.hnd||p.hnd||'L'):'none';
function DR(u){if(DRT.includes(u.type))return u.drs||[];if(u.type=='oven')return Array.from({length:u.dc>0?+u.dc:2},()=>({}));return[]}
const ovRem=u=>u.h-(+u.zd||0)-(+u.zo||0)-(+u.zm||0)-4*S.set.t;

function eff(u){const s=Object.assign({},S.set,{rl:Object.assign({},S.set.rl)}),o=u.o||{};for(const k in o)if(o[k]!==''&&o[k]!=null&&!isNaN(o[k])){if(k=='lq')s.rl[u.rt]=+o[k];else s[k]=+o[k]}return s}

function calc(u,s){const t=s.t,W=u.w,H=u.h,Dp=u.d,iw=W-2*t,o=[],c=u.cnt||1,ty=u.type;
 const P=(n,w,h,q,th,e,m,g)=>o.push({n,w:R(w),h:R(h),q:q*c,th,e:e||'',m:m||'MDF',g});
 const fb=(w,h)=>P('فیبر پشت',w,h,1,s.fib,'','فیبر'),fw=iw+2*s.gd-s.fc,shd=Dp-s.fib-s.ss,fh2=H-2*t+2*s.gd-s.fc;
 const mid=()=>{P('طبقه وسط',Dp-s.mc,iw,1,t,'l');P('قید زیر طبقه وسط',u.rw||70,iw,1,t,'l')};
 if(ty=='sink'){P('بغل',Dp,H-t,2,t,'','PVC','pvc');P('کف',Dp,W,1,t,'','PVC','pvc');if(u.rails>0)P('قید',u.rw||70,W-s.rd,+u.rails,t,'','PVC','pvc')}
 else if(ty=='floor'){P('بغل',Dp,H-t,2,t,'l');P('کف',Dp,W,1,t,'l');
  if(u.rails>0)P('قید بالا',u.rw,W-s.rd,u.rails,t,'l');
  if(u.sh>0)P('طبقه',shd,iw,u.sh,t,'l');fb(fw,H-t+s.gd-s.fc)}
 else if(ty=='wall'||ty=='fridge'){P('بغل',Dp,H,2,t,'l');P('کف',Dp,iw,1,t,'l');P('سقف',Dp,iw,1,t,'l');
  if(u.sh>0)P('طبقه',shd-(ty=='fridge'?s.fo:0),iw,u.sh,t,'l');fb(fw,fh2)}
 else if(ty=='hood'){P('بغل',Dp,H,2,t,'l');P('سقف',Dp,iw,1,t,'l');P('کف',Dp,iw,1,t,'l');mid();fb(fw,fh2)}
 else if(ty=='drain'){P('بغل',Dp,H,2,t,'l');P('سقف',Dp,iw,1,t,'l');mid();fb(fw,fh2)}
 else if(ty=='oven'){P('بغل',Dp,H,2,t,'l');P('کف',Dp,iw,1,t,'l');P('سقف',Dp,iw,1,t,'l');P('جداکننده',Dp-s.fib,iw,3,t,'l');fb(fw,fh2)}
 else{P('بغل',Dp,H,2,t,'l');P('کف',Dp,iw,1,t,'l');P('سقف',Dp,iw,1,t,'l');
  if(u.div>0)P('تقسیم عمودی',Dp,H-2*t,u.div,t,'l');
  const cw=(iw-u.div*t)/(u.div+1);if(u.sh>0)P('طبقه',shd,cw,u.sh*(u.div+1),t,'l');
  P('پاخور',+u.pk||s.pk,W-s.pkd,1,t,'l');fb(fw,fh2)}
 /* کشوها: هر کشو یک قوطی جدا؛ قید جلو/پشت = عرض یونیت − کسر ریل، دو پهلو به آن پیچ می‌شود */
 const drs=DR(u),n=drs.length,zone=ty=='oven'?(+u.zd||0):(H-(s.hh||0));
 drs.forEach((d,i)=>{const k=i+1,fh=(+d.h||zone/n)-s.bh,fbw=W-s.rl[u.rt],dd=+d.dd||s.dd,bhh=+d.bh||fh-s.bd;
  if(CM.includes(ty))P('درب کشو '+k,W-s.bw,fh,1,t,'tblr');
  P('بغل قوطی '+k,dd,bhh,2,t,'t');P('جلو/پشت قوطی '+k,fbw,bhh,2,t,'t');
  P('کف قوطی '+k,dd-2*t+2*s.gd-s.fc,fbw+2*s.gd-s.fc,1,s.fib,'','فیبر')});
 if(CM.includes(ty)&&u.dn>0)P('درب',W/u.dn-s.bw,+u.dh||H+(s.ex||0)-s.bh-(s.hh||0),u.dn,t,'tblr');
 return o}

function rows(p){const out=[];
 const add=(un,id,L,s,ov,ed)=>{for(const r of L){const e=ov&&ov[r.n]!=null?ov[r.n]:r.e,g=r.g||(r.m=='فیبر'?'fiber':/^(درب|نما)/.test(r.n)?'front':'body'),bt=r.m=='MDF'?(g=='front'?s.dband:s.band):0;
   const rw=r.w-(e.includes('l')?bt:0)-(e.includes('r')?bt:0),rh=r.h-(e.includes('t')?bt:0)-(e.includes('b')?bt:0);
   const bm=(((e.includes('t')?r.w:0)+(e.includes('b')?r.w:0)+(e.includes('l')?r.h:0)+(e.includes('r')?r.h:0))*r.q)/1000;
   out.push({u:un,uid:id,...r,e,bt,g,rw:R(rw),rh:R(rh),bm,bad:rw<=0||rh<=0||r.w<=0||r.h<=0,ed:ed&&r.m=='MDF'})}};
 for(const u of p.units){const s=eff(u),hk=hkOf(u,p);
  s.hh=(hk.includes('L')?s.hdL:0)+(hk.includes('U')?s.hdU:0);s.ex=(isMod(p)&&u.type=='wall')?s.we:0;u.hk=hk;let L;try{L=calc(u,s)}catch(e){L=[]}
  add(u.name,u.id,L,s,u.ov,true)}
 for(const f of p.fronts||[])add('نماها','fr'+f.id,[{n:'نما: '+(f.name||'—'),w:R(+f.w||0),h:R(+f.h||0),q:+f.q||1,th:S.set.t,e:'tblr',m:'MDF'}],S.set,null,false);
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

const TABS={projects:['🗂','پروژه'],units:['📦','یونیت'],fronts:['🚪','نما'],parts:['📋','قطعات'],cut:['✂️','برش'],report:['🖨','گزارش'],labor:['🛠','اجرت'],set:['⚙️','تنظیمات']};
const F=(l,a,v,len=1,t='number',ph='')=>`<div><label>${l}</label><input type="${t}" inputmode="${t=='number'?'decimal':'text'}" ${len?'data-len=1':''} ${a} placeholder="${ph}" value="${v===''||v==null?'':(len&&t=='number'?Cm(v):v)}"></div>`;
const SEL=(l,a,o,v)=>`<div><label>${l}</label><select ${a}>${Object.entries(o).map(([k,x])=>`<option value="${k}" ${k==v?'selected':''}>${x}</option>`).join('')}</select></div>`;
const DT=(k,title,body)=>`<details class="card" data-sk="${k}" ${S.sopen[k]?'open':''}><summary>${title}</summary>${body}</details>`;
const grp=x=>x.g=='fiber'?'فیبر':x.g=='pvc'?'PVC':x.g=='front'?'درب':'بدنه';
const fm=n=>Math.round(n).toLocaleString('fa-IR');

function warn(u,p){const s=S.set,t=s.t,m=[],ty=u.type;if(u.w<2*t+50)m.push('عرض خیلی کم است');if(u.h<2*t+50)m.push('ارتفاع خیلی کم است');if(u.d<100)m.push('عمق خیلی کم است');
 if(DR(u).some(d=>(+d.dd||s.dd)>u.d-s.fib))m.push('عمق یک قوطی از عمق یونیت بیشتر است');
 if(CM.includes(ty)&&ty!='wall'){if(u.dn>0&&u.drs.length&&!u.dh)m.push('هم درب دارید هم کشو: ارتفاع درب را دستی وارد کنید');
  if(u.drs.reduce((a,d)=>a+(+d.h||0),0)>u.h)m.push('جمع ارتفاع درب کشوها از ارتفاع یونیت بیشتر است')}
 if(ty=='oven'&&ovRem(u)<=0)m.push('جمع ارتفاع قسمت‌ها از ارتفاع یونیت بیشتر است');
 return m.length?`<p class="err">⚠ ${m.join(' · ')}</p>`:''}

function unitCard(u,p){const a=`data-u="${u.id}"`,s=S.set,mod=isMod(p),ty=u.type,cm=CM.includes(ty),
 I=(k,l,ph='',len=1)=>F(l,a+` data-k="${k}"`,u[k],len,'number',ph);
 const n=rows({...p,units:[u],fronts:[]}).reduce((x,r)=>x+r.q,0),o=S.open[u.id];
 let h=`<div class="card unit"><div class="uh" data-act="tog" data-id="${u.id}"><div><b>${u.name}</b>${u.cnt>1?' ×'+u.cnt:''} <span class="chip">${TY[ty]}</span><div class="m">${Cm(u.w)}×${Cm(u.h)}×${Cm(u.d)} سانتی‌متر · ${n} قطعه</div></div><span class="ar">${o?'▲':'▼'}</span></div>${warn(u,p)}`;
 if(!o)return h+'</div>';
 const rwL=ty=='floor'||ty=='sink'?'عرض قید':'عرض قید زیر طبقه وسط';
 h+=prevSVG(u,p)+`<div class="g">${F('نام',a+' data-k=name',u.name,0,'text')}${I('cnt','تعداد یونیت مشابه','',0)}${I('w','عرض')}${I('h','ارتفاع')}${I('d','عمق')}
 ${HS.includes(ty)?I('sh','تعداد طبقه','',0):''}${ty=='floor'||ty=='sink'?I('rails','تعداد قید','',0):''}${['floor','sink','hood','drain'].includes(ty)?I('rw',rwL):''}
 ${ty=='tall'||ty=='vit'?I('div','تقسیم عمودی','',0)+I('pk','ارتفاع پاخور',Cm(s.pk)):''}${cm?I('dn','تعداد درب','',0)+I('dh','ارتفاع درب (خالی=خودکار)'):''}</div>`;
 if(ty=='oven')h+=`<h4>قسمت‌ها از پایین</h4><div class="g">${I('dc','تعداد کشو','',0)}${I('zd','ارتفاع قسمت کشوها')}${I('zo','ارتفاع جای فر')}${I('zm','ارتفاع جای ماکروفر')}</div><p class="m">قسمت باقی‌مانده بالا: ${Cm(ovRem(u))} سانتی‌متر (نمای آن را در تب «نما» وارد کنید).</p>`;
 if(DR(u).length||DRT.includes(ty)){
  if(DRT.includes(ty))h+=`<h4>کشوها (هر کشو یک قوطی + یک درب)</h4>${u.drs.map((d,i)=>`<div class="dr"><b>${i+1}</b>${[['h','ارتفاع درب (خودکار)'],['bh','ارتفاع قوطی (خودکار)'],['dd','عمق قوطی ('+Cm(s.dd)+')']].map(([f,ph])=>`<input type="number" inputmode="decimal" data-len=1 data-dr="${u.id}|${i}|${f}" placeholder="${ph}" value="${d[f]===''||d[f]==null?'':Cm(d[f])}">`).join('')}<button data-act="deldr" data-id="${u.id}" data-i="${i}">✕</button></div>`).join('')}<button data-act="adddr" data-id="${u.id}">+ کشو</button>`;
  if(DR(u).length)h+=`<div class="g">${SEL('نوع ریل',a+' data-k=rt',RT,u.rt)}</div>`}
 if(mod&&ty=='floor')h+=`<h4>دستگیره</h4><div class="g">${SEL('نوع دستگیره',a+' data-k=hnd',{'':'پیش‌فرض پروژه ('+HND[p.hnd||'L']+')',...HND},u.hnd||'')}${I('hl','طول پروفیل',Cm(u.w))}</div>`;
 const ov=[['t','ضخامت MDF'],['fib','ضخامت فیبر'],['gd','عمق شیار'],['bw','بادخور عرض درب'],['bh','بادخور ارتفاع درب'],['lq','کسر عرض قوطی (ریل)'],['bd','کسر ارتفاع قوطی از درب'],['band','نوار بدنه'],['dband','نوار درب'],['hdL','جای دستگیره L'],['hdU','جای دستگیره U']];
 h+=`<details><summary>تنظیمات اختصاصی این یونیت (خالی = پیش‌فرض)</summary><div class="g">${ov.map(([k,l])=>`<div><label>${l}</label><input type="number" inputmode="decimal" data-len=1 data-u2="${u.id}" data-k2="${k}" placeholder="${Cm(k=='lq'?s.rl[u.rt]:s[k])}" value="${u.o[k]===undefined?'':Cm(u.o[k])}"></div>`).join('')}</div></details>
 <p class="acts"><button data-act="savetpl" data-id="${u.id}">ذخیره الگو</button><button data-act="dupu" data-id="${u.id}">کپی</button><button data-act="delu" data-id="${u.id}">حذف</button></p></div>`;return h}

function frontsHTML(p){const f=p.fronts||[];
 return `<p class="m">نماهای یخچال، فر و ماکروفر، ویترین و هر نمای جدای دیگر را اینجا ثبت کنید. ابعاد را نهایی وارد کنید؛ در برش «درب و نما» می‌آیند.</p><div class="card">`+
 (f.length?`<div class="fr hd"><span>نام</span><span>ارتفاع</span><span>عرض</span><span>تعداد</span><span></span></div>`:'<p class="m">هنوز نمایی ثبت نشده.</p>')+
 f.map(x=>`<div class="fr"><input type="text" data-fr="${x.id}|name" placeholder="نام نما" value="${x.name||''}"><input type="number" inputmode="decimal" data-len=1 data-fr="${x.id}|h" value="${x.h===''||x.h==null?'':Cm(x.h)}"><input type="number" inputmode="decimal" data-len=1 data-fr="${x.id}|w" value="${x.w===''||x.w==null?'':Cm(x.w)}"><input type="number" inputmode="numeric" data-fr="${x.id}|q" value="${x.q||1}"><button data-act="delfr" data-id="${x.id}">✕</button></div>`).join('')+
 `<button class="p" data-act="addfr">+ نما</button></div>`}

function laborCalc(p){const l=S.set.lab,pl=p.lab||{},cnt=t=>p.units.filter(u=>u.type==t).reduce((a,u)=>a+(u.cnt||1),0),
 mt=ts=>p.units.filter(u=>ts.includes(u.type)).reduce((a,u)=>a+u.w*(u.cnt||1),0)/1000,pv=(v,d)=>v===''||v==null?d:+v;
 const q={sink:pv(pl.sink,cnt('sink')),hood:pv(pl.hood,cnt('hood')),gas:pv(pl.gas,0)};
 const L=[['برش سینک',q.sink,l.sink,'عدد'],['برش هود',q.hood,l.hood,'عدد'],['برش گاز',q.gas,l.gas,'عدد'],['نصب کابینت زمینی',mt(['floor','sink']),l.mf,'متر'],['نصب کابینت هوایی',mt(['wall','hood','drain','fridge']),l.mw,'متر']];
 return{L,tot:L.reduce((a,x)=>a+x[1]*x[2],0),auto:{sink:cnt('sink'),hood:cnt('hood')}}}
function laborHTML(p,edit){const c=laborCalc(p),l=S.set.lab,pl=p.lab;
 const tb=`<div class="card w"><h3>اجرت نصب</h3><table><tr><th>مورد</th><th>مقدار</th><th>قیمت واحد</th><th>جمع</th></tr>${c.L.map(x=>`<tr><td>${x[0]}</td><td>${(+x[1]).toFixed(2)} ${x[3]}</td><td>${fm(x[2])}</td><td>${fm(x[1]*x[2])}</td></tr>`).join('')}<tr><th colspan="3">مجموع (تومان)</th><th>${fm(c.tot)}</th></tr></table></div>`;
 if(!edit)return tb;
 return `<div class="card"><h3>قیمت‌ها (تومان)</h3><div class="g">${F('برش سینک','data-lab=sink',l.sink,0)}${F('برش هود','data-lab=hood',l.hood,0)}${F('برش گاز','data-lab=gas',l.gas,0)}${F('نصب هر متر زمینی','data-lab=mf',l.mf,0)}${F('نصب هر متر هوایی','data-lab=mw',l.mw,0)}</div></div>
 <div class="card"><h3>تعداد در این پروژه</h3><div class="g">${F('تعداد برش سینک','data-pl=sink',pl.sink,0,'number',c.auto.sink)}${F('تعداد برش هود','data-pl=hood',pl.hood,0,'number',c.auto.hood)}${F('تعداد برش گاز','data-pl=gas',pl.gas,0,'number','0')}</div><p class="m">خالی بماند، تعداد سینک و هود از یونیت‌ها شمرده می‌شود. متراژ از عرض یونیت‌ها حساب می‌شود (زمینی + زیر سینک، هوایی + هود + آبچکان + یخچال). فرمول دقیق را بعداً تنظیم می‌کنیم.</p></div>`+tb}

function bandHTML(p){const t={};rows(p).forEach(x=>{if(x.bm>0)t[x.bt]=(t[x.bt]||0)+x.bm});return `<div class="card"><h3>مصرف نوار لبه</h3>${Object.keys(t).map(k=>`نوار ${Cm(k)} سانتی‌متر (${k} میلی‌متر): <b>${t[k].toFixed(2)}</b> متر (با ۵٪ پرت: ${(t[k]*1.05).toFixed(2)})<br>`).join('')||'نواری انتخاب نشده'}</div>`}
let LC={body:0,front:0,fiber:0,pvc:0};
const GN={body:'بدنه (سفید)',front:'درب و نما',fiber:'فیبر',pvc:'PVC'};
function sheetOf(g){const s=S.set,m={body:[s.sw,s.sh],front:[s.fsw,s.fsh],fiber:[s.fbw,s.fbh],pvc:[s.psw,s.psh]}[g];return Object.assign({},s,{sw:m[0]||s.sw,sh:m[1]||s.sh})}
function cutHTML(p){LC={body:0,front:0,fiber:0,pvc:0};const r=rows(p),th={};let h='';
 r.filter(x=>!x.bad).forEach(x=>{const k=x.g+'|'+x.th;for(let i=0;i<x.q;i++)(th[k]=th[k]||[]).push({n:x.u+'/'+x.n,L:x.rh,W:x.rw,no:x.no})});
 for(const k of Object.keys(th).sort()){const g=k.split('|')[0],s=sheetOf(g),res=pack(th[k],s),nm=GN[g];
  if(res.err){h+=`<p class="err">قطعه «${res.err.n}» (${nm}) از ورق بزرگ‌تر است.</p>`;continue}
  LC[g]+=res.sheets.length;const used=th[k].reduce((a,x)=>a+x.L*x.W,0),tot=res.sheets.length*s.sw*s.sh;
  h+=`<div class="card"><h3>${nm} — ضخامت ${Cm(k.split('|')[1])} سانتی‌متر: ${res.sheets.length} ورق (${Cm(s.sw)}×${Cm(s.sh)})</h3>مساحت مفید ${(used/1e6).toFixed(2)} م² · پرت ${((tot-used)/1e6).toFixed(2)} م² (${((1-used/tot)*100).toFixed(1)}٪)</div>`+
  res.sheets.map((sh,i)=>`<div class="card"><b>${nm} · ورق ${i+1}</b><svg viewBox="0 0 ${s.sw} ${s.sh}"><rect width="${s.sw}" height="${s.sh}" fill="none" stroke="#888" stroke-width="6"/>${sh.p.map(q=>`<rect x="${q.x+s.mg}" y="${q.y+s.mg}" width="${q.l}" height="${q.w}" fill="#c2570c" fill-opacity=".25" stroke="#c2570c" stroke-width="3"/><text x="${q.x+s.mg+q.l/2}" y="${q.y+s.mg+q.w/2}" font-size="30" text-anchor="middle" fill="currentColor">#${q.no} ${Cm(q.l)}×${Cm(q.w)}</text>`).join('')}</svg></div>`).join('')}
 return h}

function setHTML(){const s=S.set,a='data-s=';
 return `<p class="m">همه اندازه‌ها به سانتی‌متر هستند (۰.۳ = ۳ میلی‌متر). هر بخش را با فلش باز و بسته کنید.</p>`+
 DT('body','ساخت بدنه',`<div class="g">${F('ضخامت MDF',a+'t',s.t)}${F('ضخامت فیبر',a+'fib',s.fib)}${F('عمق شیار',a+'gd',s.gd)}${F('لقی فیبر در شیار',a+'fc',s.fc)}${F('ضخامت نوار بدنه',a+'band',s.band)}${F('فاصله پشت طبقه',a+'ss',s.ss)}${F('کسر طول قید از عرض یونیت',a+'rd',s.rd)}</div>`)+
 DT('doors','درب‌ها',`<div class="g">${F('بادخور از عرض هر درب',a+'bw',s.bw)}${F('بادخور از ارتفاع هر درب',a+'bh',s.bh)}${F('ضخامت نوار درب',a+'dband',s.dband)}${F('جای دستگیره L (کسر از ارتفاع درب)',a+'hdL',s.hdL)}${F('جای دستگیره U (کسر از ارتفاع درب)',a+'hdU',s.hdU)}${F('پایین‌زدگی درب هوایی (کار مدرن)',a+'we',s.we)}</div><p class="m">ابعاد درب خودکار از ابعاد یونیت، بادخور و دستگیره محاسبه می‌شود. این بخش درب کشوها را هم شامل می‌شود.</p>`)+
 DT('drawer','کشو و ریل',`<div class="g">${F('عمق پیش‌فرض قوطی',a+'dd',s.dd)}${F('کسر ارتفاع قوطی از درب کشو',a+'bd',s.bd)}</div><h4>کسر از عرض یونیت برای قید جلو/پشت قوطی</h4><div class="g">${Object.keys(RT).map(k=>F(RT[k],'data-rl='+k,s.rl[k])).join('')}</div><p class="m">ساچمه‌ای: یونیت ۵۰ ← قید جلو/پشت ۴۱ (کسر ۹) و با دو پهلو عرض قوطی ۴۴.۲. تاندم: ۱ سانتی‌متر لقی هر طرف از داخل یونیت (کسر ۸.۴). مقادیر را با ریل خودتان تنظیم کنید.</p>`)+
 DT('special','یونیت‌های ویژه',`<div class="g">${F('ارتفاع کف هود از پایین',a+'hr',s.hr)}${F('کوچک‌تر بودن طبقه وسط از عمق (هود، آبچکان)',a+'mc',s.mc)}${F('جلوتر بودن فیبر یخچال',a+'fo',s.fo)}</div>`)+
 DT('price','قیمت‌ها (تومان)',`<div class="g">${F('هر ورق بدنه','data-pr=body',s.pr.body,0)}${F('هر ورق درب و نما','data-pr=front',s.pr.front,0)}${F('هر ورق PVC','data-pr=pvc',s.pr.pvc,0)}${F('هر ورق فیبر','data-pr=fiber',s.pr.fiber,0)}${F('هر متر نوار','data-pr=band',s.pr.band,0)}${F('هر جفت ریل','data-pr=rail',s.pr.rail,0)}${F('هر متر پروفیل دستگیره','data-pr=prof',s.pr.prof,0)}</div>`)+
 DT('sheet','ورق',`<div class="g">${F('طول ورق بدنه (سفید)',a+'sw',s.sw)}${F('عرض ورق بدنه',a+'sh',s.sh)}${F('طول ورق درب و نما',a+'fsw',s.fsw)}${F('عرض ورق درب و نما',a+'fsh',s.fsh)}${F('طول ورق فیبر',a+'fbw',s.fbw)}${F('عرض ورق فیبر',a+'fbh',s.fbh)}${F('طول ورق PVC (زیر سینک)',a+'psw',s.psw)}${F('عرض ورق PVC',a+'psh',s.psh)}${F('تیغه برش',a+'kerf',s.kerf)}${F('فاصله از لبه',a+'mg',s.mg)}${SEL('چرخش قطعات',a+'rot',{1:'مجاز',0:'غیرمجاز (جهت رگه)'},s.rot)}</div>`)+
 DT('tpl',`الگوهای ذخیره‌شده (${S.tpl.length})`,S.tpl.map(t=>`<div>${t.name} <button data-act="deltpl" data-id="${t.id}">حذف</button></div>`).join('')||'<p class="m">در کارت یونیت «ذخیره الگو» را بزنید.</p>')+
 DT('bk','پشتیبان‌گیری','<button data-act="exp">ساخت متن پشتیبان</button> <button data-act="imp">بازیابی از متن</button><textarea id="bk" rows="8"></textarea><p class="m">متن را کپی و ذخیره کنید. بازیابی داده‌های فعلی را جایگزین می‌کند.</p>')+
 DT('help','راهنمای فرمول‌ها',`<p>اندازه‌ها سانتی‌متر هستند و میلی‌متر با ممیز نوشته می‌شود. ابعاد وارد‌شده نهایی هستند؛ خام = نهایی − نوار لبه‌های همان بُعد.</p><p>زمینی: کف زیر بغل‌ها، بدون سقف. قید بالا: پیش‌فرض ۳ عدد، عرض ۷؛ طول = عرض یونیت − ۳.۲.</p><p>هوایی: کف و سقف بین بغل‌ها، بدون کشو. در کار مدرن ارتفاع درب = ارتفاع + پایین‌زدگی − بادخور. کمد: کف و سقف بین دو پهلو، با پاخور (ارتفاع ۵، طول = عرض − ۳.۲، بدون بادخور).</p><p>درب: عرض = عرض یونیت ÷ تعداد − بادخور عرض؛ ارتفاع = ارتفاع − بادخور ارتفاع − جای دستگیره.</p><p>کشو: هر کشو یک قوطی جدا و یک درب جدا. قید جلو/پشت = عرض یونیت − کسر ریل (ساچمه‌ای ۹)، عرض کل قوطی = آن + دو پهلو. ارتفاع درب خالی باشد، ارتفاع یونیت (منهای جای دستگیره) بین کشوها مساوی تقسیم می‌شود. ارتفاع قوطی = ارتفاع درب − ۴.</p><p>ویترین: مثل کمد بدون درب. فر و ماکروفر: کشوها، جای فر، جای ماکروفر و باقی‌مانده با سه جداکننده؛ نماها در تب «نما». هود: کف بالاتر، یک طبقه وسط (۲ کوچک‌تر از عمق) و قید ۷ زیر آن. آبچکان: هوایی بدون کف با طبقه وسط. یخچال: یونیت بالای یخچال با فیبر ۱۰ جلوتر. زیر سینک: PVC، فقط بغل و کف و قید، بدون فیبر و درب.</p><p>برش: بدنه، درب و نما، فیبر و PVC جدا؛ ضخامت‌های مختلف جدا؛ تیغه و فاصله لبه لحاظ می‌شود.</p>`)}

function view(){const p=P0(),v=$('#v');$('#nav').innerHTML=Object.entries(TABS).map(([k,x])=>`<button class="${S.tab==k?'on':''}" data-tab="${k}"><span class="i">${x[0]}</span>${x[1]}</button>`).join('');
 if(!p&&!['projects','set'].includes(S.tab))S.tab='projects';let h='';
 if(S.tab=='projects')h=`<div class="card"><h3>پروژه جدید</h3><div class="g">${F('نام پروژه','id=pn','',0,'text')}${SEL('نوع کار','id=pk',KIND,'modern')}<div><label>&nbsp;</label><button class="p" data-act="newp">ساخت پروژه</button></div></div></div>`+
  (S.ps.map(x=>{const q=rows(x).reduce((a,r)=>a+r.q,0);return `<div class="card"><b>${x.name}</b> ${x.id==S.cur?'✓':''}<div class="m">${KIND[x.kind||'modern']} · ${new Date(x.date).toLocaleDateString('fa-IR')} · ${x.units.length} یونیت · ${q} قطعه</div><p class="acts"><button class="p" data-act="open" data-id="${x.id}">باز کردن</button><button data-act="dup" data-id="${x.id}">کپی</button><button data-act="delp" data-id="${x.id}">حذف</button></p></div>`}).join('')||'<p class="m">هنوز پروژه‌ای ندارید؛ بالا یکی بسازید.</p>');
 else if(S.tab=='units')h=`<h3>${p.name}</h3><div class="card"><div class="g">${SEL('نوع کار','data-p=kind',KIND,p.kind||'modern')}${isMod(p)?SEL('دستگیره پیش‌فرض (زمینی)','data-p=hnd',HND,p.hnd||'L'):''}</div></div><div class="bar"><button class="p" data-act="addu" data-t="floor">+ زمینی</button><button class="p" data-act="addu" data-t="wall">+ هوایی</button><button class="p" data-act="addu" data-t="tall">+ کمد</button></div><div class="chips">${['vit','oven','hood','fridge','sink','drain'].map(k=>`<button data-act="addu" data-t="${k}">+ ${TY[k]}</button>`).join('')}</div>${S.tpl.length?`<div class="card"><label>از الگوهای من</label><div class="chips">${S.tpl.map(t=>`<button data-act="addtpl" data-id="${t.id}">+ ${t.name}</button>`).join('')}</div></div>`:''}`+p.units.map(u=>unitCard(u,p)).join('');
 else if(S.tab=='fronts')h=frontsHTML(p);
 else if(S.tab=='parts'){const r=rows(p);h=bandHTML(p)+`<button data-act="csv">کپی CSV</button><div class="card w"><table><tr><th>#</th><th>یونیت</th><th>قطعه</th><th>تعداد</th><th>نهایی (سانتی‌متر)</th><th>خام</th><th>ضخامت</th><th>گروه</th><th>لبه‌ها ب پ چ ر</th></tr>`+
  r.map(x=>`<tr class="${x.bad?'err':''}"><td>${x.no}</td><td>${x.u}</td><td>${x.n}</td><td>${x.q}</td><td>${Cm(x.h)}×${Cm(x.w)}</td><td>${Cm(x.rh)}×${Cm(x.rw)}</td><td>${Cm(x.th)}</td><td>${grp(x)}</td><td>${x.ed?['t','b','l','r'].map(c=>`<input type="checkbox" data-ov="${x.uid}|${x.n}|${c}" ${x.e.includes(c)?'checked':''}>`).join(' '):'—'}</td></tr>`).join('')+`</table></div>`+(r.some(x=>x.bad)?'<p class="err">ابعاد منفی یا صفر دارید؛ یونیت را اصلاح کنید.</p>':'')}
 else if(S.tab=='cut')h=cutHTML(p)+costHTML(p);
 else if(S.tab=='labor')h=laborHTML(p,true);
 else if(S.tab=='report'){const r=rows(p);h=`<button class="p np" data-act="print">چاپ / ذخیره PDF</button><div class="card"><h3>پروژه: ${p.name}</h3>نوع کار: ${KIND[p.kind||'modern']} · ${new Date(p.date).toLocaleDateString('fa-IR')} · ${p.units.length} یونیت (سانتی‌متر)<br>${p.units.map(u=>`${u.name}${u.cnt>1?' ×'+u.cnt:''}: ${TY[u.type]} ${Cm(u.w)}×${Cm(u.h)}×${Cm(u.d)}${u.hk&&u.hk!='none'?` · دستگیره ${HK(u.hk)} (طول پروفیل ${Cm(u.hl||u.w)})`:''}`).join('<br>')}</div>
  <div class="card w"><h3>لیست قطعات</h3><table><tr><th>#</th><th>یونیت</th><th>قطعه</th><th>تعداد</th><th>نهایی</th><th>خام</th><th>ضخامت</th><th>گروه</th><th>لبه‌ها</th></tr>${r.map(x=>`<tr><td>${x.no}</td><td>${x.u}</td><td>${x.n}</td><td>${x.q}</td><td>${Cm(x.h)}×${Cm(x.w)}</td><td>${Cm(x.rh)}×${Cm(x.rw)}</td><td>${Cm(x.th)}</td><td>${grp(x)}</td><td>${[...'tblr'].filter(c=>x.e.includes(c)).map(c=>ET[c]).join(' ')||'—'}</td></tr>`).join('')}</table></div>`+bandHTML(p)+cutHTML(p)+costHTML(p)+laborHTML(p,false)+labelsHTML(p)}
 else h=setHTML();
 v.innerHTML=h}
const rerender=()=>{save();view()};
document.addEventListener('toggle',e=>{const k=e.target.dataset&&e.target.dataset.sk;if(k){S.sopen[k]=e.target.open;save()}},true);
document.addEventListener('click',e=>{const b=e.target.closest('[data-act],[data-tab]');if(!b)return;const d=b.dataset,p=P0(),U=()=>p.units.find(q=>q.id==d.id);
 if(d.tab){S.tab=d.tab;scrollTo(0,0);return rerender()}
 if(d.act=='newp'){const n=$('#pn').value.trim();if(!n)return alert('نام پروژه را وارد کنید');const x={id:uid(),name:n,date:Date.now(),kind:$('#pk').value,hnd:'L',units:[],fronts:[],lab:{sink:'',hood:'',gas:''}};S.ps.push(x);S.cur=x.id;S.tab='units'}
 if(d.act=='open'){S.cur=d.id;S.tab='units'}
 if(d.act=='dup'){const x=JSON.parse(JSON.stringify(S.ps.find(q=>q.id==d.id)));x.id=uid();x.name+=' (کپی)';x.date=Date.now();S.ps.push(x)}
 if(d.act=='delp'&&confirm('پروژه حذف شود؟')){S.ps=S.ps.filter(q=>q.id!=d.id);if(S.cur==d.id)S.cur=null}
 if(d.act=='addu'){const T={floor:{w:600,h:720,d:560,sh:1,rails:3,rw:70,dn:2},wall:{w:600,h:720,d:320,sh:1,dn:2},tall:{w:600,h:2100,d:560,sh:3,dn:2},
   vit:{w:600,h:2100,d:350,sh:4},oven:{w:600,h:2260,d:600,dc:2,zd:400,zo:815,zm:615},hood:{w:600,h:720,d:320},fridge:{w:600,h:600,d:600,sh:1},sink:{w:800,h:720,d:560,rails:4},drain:{w:800,h:720,d:320}}[d.t],
   u={id:uid(),name:TY[d.t]+' '+(p.units.length+1),type:d.t,div:0,dh:'',pk:'',drs:[],rt:'ball',hnd:'',hl:'',cnt:1,o:{},ov:{},dn:0,sh:0,rails:0,rw:70,...T};p.units.push(u);S.open[u.id]=1}
 if(d.act=='tog')S.open[d.id]=!S.open[d.id];
 if(d.act=='dupu'){const x=JSON.parse(JSON.stringify(U()));x.id=uid();x.name+=' (کپی)';p.units.push(x);S.open[x.id]=1}
 if(d.act=='delu'&&confirm('یونیت حذف شود؟'))p.units=p.units.filter(q=>q.id!=d.id);
 if(d.act=='adddr'){const u=U(),l=u.drs[u.drs.length-1];u.drs.push({h:l?l.h:'',bh:'',dd:''})}
 if(d.act=='deldr')U().drs.splice(+d.i,1);
 if(d.act=='addfr')p.fronts.push({id:uid(),name:'',h:'',w:'',q:1});
 if(d.act=='delfr')p.fronts=p.fronts.filter(q=>q.id!=d.id);
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
 else if(d.fr){const[id,f]=d.fr.split('|'),x=p.fronts.find(q=>q.id==id);x[f]=f=='name'?t.value:f=='q'?Math.max(1,Math.round(+t.value||1)):(t.value===''?'':n())}
 else if(d.u){const u=U(d.u),k=d.k;u[k]=t.type=='text'||t.tagName=='SELECT'?t.value:(['hl','dh','pk'].includes(k)&&t.value===''?'':n());if(k=='cnt'&&!u.cnt)u.cnt=1}
 else if(d.ov){const[id,nm,c]=d.ov.split('|'),u=U(id),cur=rows(p).find(x=>x.uid==id&&x.n==nm).e;u.ov[nm]=t.checked?cur+c:cur.replace(c,'')}
 else if(d.p)p[d.p]=t.value
 else if(d.pl)p.lab[d.pl]=t.value===''?'':n();
 else if(d.lab)S.set.lab[d.lab]=n();
 else if(d.s)S.set[d.s]=d.s=='rot'?+t.value:n();
 else if(d.pr)S.set.pr[d.pr]=n();
 else if(d.rl)S.set.rl[d.rl]=n();
 else return;rerender()});

function costHTML(p){cutHTML(p);const r=rows(p),pr=S.set.pr;
 const band=r.reduce((a,x)=>a+x.bm,0)*1.05;
 const rails=p.units.reduce((a,u)=>a+DR(u).length*(u.cnt||1),0),prof=p.units.reduce((a,u)=>a+(u.hk&&u.hk!='none'?u.hk.length*(+u.hl||u.w)/1000*(u.cnt||1):0),0);
 const L=[['ورق بدنه',LC.body,pr.body,'ورق'],['ورق درب و نما',LC.front,pr.front,'ورق'],['ورق PVC',LC.pvc,pr.pvc,'ورق'],['ورق فیبر',LC.fiber,pr.fiber,'ورق'],['نوار لبه (با ۵٪ پرت)',band,pr.band,'متر'],['ریل کشو',rails,pr.rail,'جفت'],['پروفیل دستگیره',prof,pr.prof,'متر']];
 const tot=L.reduce((a,x)=>a+x[1]*x[2],0);
 return `<div class="card w"><h3>برآورد هزینه</h3><table><tr><th>مورد</th><th>مقدار</th><th>قیمت واحد</th><th>جمع</th></tr>${L.map(x=>`<tr><td>${x[0]}</td><td>${(+x[1]).toFixed(2)} ${x[3]}</td><td>${fm(x[2])}</td><td>${fm(x[1]*x[2])}</td></tr>`).join('')}<tr><th colspan="3">مجموع (تومان)</th><th>${fm(tot)}</th></tr></table>${tot?'':'<p class="m">قیمت‌ها را در تنظیمات وارد کنید.</p>'}</div>`}
function labelsHTML(p){let h='';
 rows(p).filter(x=>x.ed||x.g=='pvc'||x.g=='front').filter(x=>!x.bad).forEach(x=>{for(let i=1;i<=x.q;i++)h+=`<div class="lb"><b>#${x.no}</b> ${p.name} · ${x.u} · ${x.n}${x.q>1?' ('+i+'/'+x.q+')':''}<br>${Cm(x.h)}×${Cm(x.w)} · خام ${Cm(x.rh)}×${Cm(x.rw)} · ${[...'tblr'].filter(c=>x.e.includes(c)).map(c=>ET[c]).join('')||'—'}</div>`});
 return `<div class="card"><h3>برچسب قطعات</h3><div class="lbs">${h}</div></div>`}

/* پیش‌نمایش شبه‌سه‌بعدی: نمای روبه‌رو + سطح بالا و پهلو برای نشان دادن عمق */
function prevSVG(u,p){const s=eff(u),t=s.t,W=u.w,H=u.h,Dp=u.d,ty=u.type,cm=CM.includes(ty),bw=s.bw,bh=s.bh,fs=Math.max(W,H)/24,e=fs/10,hk=hkOf(u,p),hh=(hk.includes('L')?s.hdL:0)+(hk.includes('U')?s.hdU:0),ex=(isMod(p)&&ty=='wall')?s.we:0,m=fs*1.2,dx=Dp*.32,dy=Dp*.18,Y=y=>y+dy;
 const R_=(x,y,w,h,c,o,d)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" fill-opacity="${o}" stroke="${c}" stroke-width="${e}"${d?` stroke-dasharray="${fs/2}"`:''}/>`,
 T=(x,y,tx)=>`<text x="${x}" y="${y}" font-size="${fs}" text-anchor="middle" fill="currentColor">${tx}</text>`,lab=(w,h)=>Cm(w)+'×'+Cm(h),
 poly=(pts,c,o)=>`<polygon points="${pts}" fill="${c}" fill-opacity="${o}" stroke="${c}" stroke-width="${e}" stroke-linejoin="round"/>`;
 let g=poly(`0,${dy} ${dx},0 ${W+dx},0 ${W},${dy}`,'#888',.3)+poly(`${W},${dy} ${W+dx},0 ${W+dx},${H} ${W},${H+dy}`,'#888',.5)+R_(0,dy,W,H,'#888',.07)+R_(0,dy,t,H,'#888',.35)+R_(W-t,dy,t,H,'#888',.35);
 const n=u.sh||0;if(HS.includes(ty))for(let i=1;i<=n;i++)g+=R_(t,Y(H*i/(n+1)),W-2*t,t,'#888',.45);
 if(ty=='tall'||ty=='vit'){const pk=+u.pk||s.pk,pl=W-s.pkd;g+=R_((W-pl)/2,Y(H-pk),pl,pk,'#2563eb',.25)}
 if(ty=='hood'){const fy=H-s.hr;g+=R_(t,Y(fy-t),W-2*t,t,'#2563eb',.45)+R_(t,Y(fy/2),W-2*t,t,'#888',.45)+T(W/2,Y(H-s.hr/2)+fs/3,'کف هود '+Cm(s.hr)+' بالاتر')}
 if(ty=='drain')g+=R_(t,Y(H/2),W-2*t,t,'#888',.45)+T(W/2,Y(H/4)+fs/3,'آبچکان')
 if(ty=='sink')g+=R_(t,Y(0),W-2*t,Math.min(70,H/6),'#2563eb',.25)+T(W/2,Y(H/2),'PVC')
 if(ty=='fridge')g+=T(W/2,Y(H/2)+fs/3,'فیبر '+Cm(s.fo)+' جلوتر')
 if(ty=='vit')g+=T(W/2,Y(H/2),'ویترین (بدون درب)');
 if(ty=='oven'){const zd=+u.zd||0,zo=+u.zo||0,zm=+u.zm||0,rem=ovRem(u),dc=DR(u).length||1;let yb=H-zd;
  for(let i=0;i<dc;i++){const h=zd/dc;g+=R_(bw/2,Y(yb+i*h)+bh/2,W-bw,h-bh,'#c2570c',.3)+T(W/2,Y(yb+i*h+h/2)+fs/3,'کشو '+(i+1))}
  yb-=t;g+=R_(t,Y(yb),W-2*t,t,'#888',.45);yb-=zo;g+=R_(t,Y(yb),W-2*t,zo,'#2563eb',.18)+T(W/2,Y(yb+zo/2)+fs/3,'فر '+Cm(zo));
  yb-=t;g+=R_(t,Y(yb),W-2*t,t,'#888',.45);yb-=zm;g+=R_(t,Y(yb),W-2*t,zm,'#2563eb',.18)+T(W/2,Y(yb+zm/2)+fs/3,'ماکروفر '+Cm(zm));
  yb-=t;g+=R_(t,Y(yb),W-2*t,t,'#888',.45);g+=R_(t,Y(t),W-2*t,rem,'#888',.1,1)+T(W/2,Y(t+rem/2)+fs/3,'باقی‌مانده '+Cm(rem))}
 const dl=cm?DR(u):[],k=dl.length;let y=bh/2+hh;
 dl.forEach(d=>{const h=(+d.h||(H-hh)/k)-bh,w=W-bw;g+=R_((W-w)/2,Y(y),w,h,'#c2570c',.3)+T(W/2,Y(y+h/2)+fs/3,lab(w,h));y+=h+bh});
 if(cm&&u.dn>0){const dw=W/u.dn-bw,dh=+u.dh||H+ex-bh-hh,y0=k?H-bh/2-dh:bh/2+hh;
  for(let i=0;i<u.dn;i++){const x=bw/2+i*W/u.dn;g+=R_(x,Y(y0),dw,dh,'#c2570c',.3)+T(x+dw/2,Y(y0+dh/2)+fs/3,lab(dw,dh))}}
 if(hh)g+=R_(0,Y(bh/2),W,hh,'#2563eb',0,1)+T(W/2,Y(bh/2+hh/2)+fs/3,'دستگیره '+HK(hk));
 g+=T(W/2,Y(H+ex)+fs*1.5,'عرض '+Cm(W))+T(W+dx/2,Y(H+ex)+fs*1.5,'عمق '+Cm(Dp))+`<text x="${-fs*.6}" y="${Y(H/2)}" transform="rotate(-90 ${-fs*.6} ${Y(H/2)})" font-size="${fs}" text-anchor="middle" fill="currentColor">ارتفاع ${Cm(H)}</text>`;
 return `<svg viewBox="${-m*1.5} ${-m} ${W+dx+m*2.5} ${H+ex+dy+m*2+fs*1.5}" style="max-height:300px">${g}</svg>`}
boot();
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
