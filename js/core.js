const $=s=>document.querySelector(s),cv=$('#c'),g=cv.getContext('2d');g.imageSmoothingEnabled=false;
const TOUCH=matchMedia('(pointer:coarse)').matches||'ontouchstart' in window;
document.body.classList.toggle('touch',TOUCH);
const GY=216,OY=48,GRAV=900,JV=345,SPD=70;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ov=(a,b,c,d,e,f,h,i)=>a<e+h&&a+c>e&&b<f+i&&b+d>f;
const on=(...k)=>k.some(x=>KEY[x])?1:0;
const TIER={C:{n:'Common',c:'#9AA0A6',b:1,w:1},R:{n:'Rare',c:'#4C8DFF',b:2,w:2},S:{n:'Super Rare',c:'#A66BFF',b:3,w:2},U:{n:'Uber Super Rare',c:'#FF9A3C',b:4,w:3},L:{n:'Legend',c:'#FFD23F',b:5,w:3},X:{n:'Special',c:'#FF4D5A',b:6,w:4}};
// Data placeholder (harga, efek, stat): menunggu PM
const WEP={pedang:{n:'Pedang',t:'C',lo:1,hi:10,miss:.20,sl:['arc',-60,40,14,'#FFFFFF',1]},tumpul:{n:'Pedang Tumpul',t:'C',lo:1,hi:10,miss:.20,sl:['arc',-40,20,12,'#B8B3D1',2]},kayu:{n:'Pedang Kayu',t:'C',lo:1,hi:10,miss:.20,sl:['arc',-80,0,13,'#C9A46A',1]},karat:{n:'Pedang Karat',t:'C',lo:1,hi:10,miss:.20,sl:['arc',-30,50,14,'#9AA0A6',1]},latihan:{n:'Pedang Latihan',t:'C',lo:1,hi:10,miss:.20,sl:['arc',-50,30,11,'#E0E0E0',2]},besi:{n:'Pedang Besi',t:'R',lo:10,hi:20,miss:.15,sl:['arc',-70,50,16,'#4C8DFF',2]},baja:{n:'Pedang Baja Ringan',t:'R',lo:10,hi:20,miss:.15,sl:['arc',-60,60,17,'#7FB2FF',1]},perunggu:{n:'Pedang Perunggu',t:'R',lo:10,hi:20,miss:.15,sl:['arc',-80,30,15,'#D9A35B',2]},berduri:{n:'Pedang Berduri',t:'R',lo:10,hi:20,miss:.15,sl:['thrust',0,0,22,'#8BC34A',2]},sabit:{n:'Pedang Sabit',t:'R',lo:10,hi:20,miss:.15,sl:['arc',-90,70,18,'#4C8DFF',1]},perak:{n:'Pedang Perak',t:'S',lo:20,hi:30,miss:.12,sl:['arc',-75,60,18,'#A66BFF',2]},kristal:{n:'Pedang Kristal',t:'S',lo:20,hi:30,miss:.12,sl:['double',-60,40,17,'#C9A6FF',1]},rune:{n:'Pedang Rune',t:'S',lo:20,hi:30,miss:.12,sl:['arc',-100,80,16,'#A66BFF',1]},bayangan:{n:'Pedang Bayangan',t:'S',lo:20,hi:30,miss:.12,sl:['thrust',0,0,24,'#6A3F8C',3]},naga:{n:'Pedang Naga',t:'U',lo:30,hi:40,miss:.10,sl:['arc',-90,90,20,'#FF9A3C',3]},petir:{n:'Pedang Petir',t:'U',lo:30,hi:40,miss:.10,sl:['double',-70,70,20,'#FFE066',1]},badai:{n:'Pedang Badai',t:'U',lo:30,hi:40,miss:.10,sl:['spin',0,360,18,'#FF9A3C',2]},raja:{n:'Pedang Taring Raja',t:'X',lo:50,hi:60,miss:.05,sl:['arc',-110,110,24,'#FF4D5A',4]},mahkota:{n:'Pedang Mahkota',t:'X',lo:50,hi:60,miss:.05,sl:['spin',0,720,20,'#FF4D5A',2]},bintang:{n:'Pedang Bintang',t:'L',lo:40,hi:50,miss:.08,sl:['spin',0,360,26,'#FFD23F',3]}};
const SWORD={R:'besi',S:'perak',U:'naga',L:'bintang',X:'raja'};
const ITEMS={roti:{n:'Roti',p:5,ic:'roti',hp:2,hun:15,k:'food'},daging:{n:'Roti Isi',p:12,ic:'roti',f:'hue-rotate(40deg) saturate(1.5)',hp:4,hun:25,k:'food'},air:{n:'Air Segar',p:3,ic:'minum',th:25,k:'drink'},teh:{n:'Minum Herbal',p:8,ic:'minum',f:'hue-rotate(120deg)',th:40,hp:1,k:'drink'}};
const IORD=Object.keys(ITEMS);
const EN={slime:{hp:25,g:[1,5],xp:2,d:1,ch:110,rng:20,cd:1.2,sp:22,ay:60,w:16,h:12},goblin:{hp:35,g:[3,8],xp:3,d:1,ch:120,rng:22,cd:1,sp:26,ay:60,w:12,h:21},bat:{hp:20,g:[2,6],xp:3,d:1,ch:110,rng:22,cd:1.2,sp:28,ay:66,w:20,h:11},skel:{hp:60,g:[5,12],xp:5,d:2,ch:90,rng:20,cd:1.4,sp:18,ay:60,w:12,h:27},wolf:{hp:40,g:[6,20],xp:5,d:2,ch:110,rng:24,cd:1,sp:56,ay:60,w:26,h:17}};
const KS=Object.keys(EN);
// Ukuran frame dari sprites-atlas.json
const SP={cewek:{fw:18,fh:29,n:4,ax:9,ay:27,c:640},cowok:{fw:18,fh:29,n:4,ax:9,ay:27,c:640},slime:{fw:20,fh:16,n:4,ax:10,ay:14,c:900},goblin:{fw:18,fh:23,n:2,ax:9,ay:21,c:500},bat:{fw:22,fh:13,n:2,ax:11,ay:11,c:280},skel:{fw:16,fh:29,n:2,ax:8,ay:27,c:600},wolf:{fw:30,fh:19,n:4,ax:15,ay:17,c:500},boss:{fw:46,fh:51,n:2,ax:23,ay:49,c:1400}};
const LVW={desa:960,kota:960,f0:960,f1:960,f2:960,f3:960,arena:480};
const TIPS=['Makanan dibeli di kota dan dibawa ke hutan.','Musuh baru muncul setiap 1 menit.','Lapar dan haus turun perlahan di hutan.','Raja Goblin punya dua pola serangan.'];
const IM={};for(const k in A){const i=new Image();i.src=A[k];IM[k]=i}

let G,P={},L=null,LV={},scn='menu',ui='',busy=false,rot=false,zone='',doorNear='',TM=0,KEY={},TC={a:0},JOY=0,jumpReq=false,selC=null,lastB=-9,popT,saveT,dSel=null,shopTab='food',shopSel='roti',tasSel=null;
const newRep=()=>({xp:0,g:0,k:{slime:0,goblin:0,bat:0,skel:0,wolf:0}});
const newG=()=>({ch:'cewek',gold:0,bag:{roti:5,air:5},weps:['pedang'],wpn:'pedang',spec:0,bossDown:0,hung:100,thirst:100,time:0,kills:0,spT:0,chest:0,lv:1,xp:0,rep:newRep()});
G=newG();

/* ---------- Level ---------- */
function setupLevels(){
 const mk=(id,bgk,tint)=>({id,bgk,w:LVW[id],tint,surf:[{x0:0,x1:LVW[id],y:GY}],en:[],wall:false});
 LV={desa:mk('desa','desa',''),kota:mk('kota','kota',''),f0:mk('f0','hutan',''),f1:mk('f1','hutan','rgba(20,19,42,.15)'),f2:mk('f2','hutan','rgba(10,40,30,.2)'),f3:mk('f3','hutan','rgba(20,19,42,.25)'),arena:mk('arena','arena','rgba(20,19,42,.2)')};
 for(const k of['f0','f1','f2','f3']){const l=LV[k];for(let p=0;p<2;p++)l.surf.push({x0:p*480+28,x1:p*480+108,y:168},{x0:p*480+338,x1:p*480+430,y:152});spawnE(l,6,200,l.w-80)}
 LV.arena.boss={x:360,y:GY,hp:250,max:250,act:0,dead:G.bossDown,st:'idle',cd:2,t:0,tt:0,jt:0,sx:0,tx:0,face:-1,pat:0,dir:-1,fl:0};
}
function spawnE(l,n,x0,x1){for(let i=0;i<n;i++){const k=KS[Math.random()*5|0],fly=k==='bat',x=x0+Math.random()*(x1-x0);l.en.push({k,x,ox:x,y:fly?GY-36:GY,vx:0,vy:0,hp:EN[k].hp,t:Math.random()*4,cd:0,fl:0,dir:Math.random()<.5?-1:1,face:1,h:1+Math.random(),dead:0,g:true})}}
function setLv(id,x){LVK=id;L=LV[id];P.x=x;P.y=GY;P.vy=0;P.g=true;zone='';doorNear='';if(id==='kota')save()}

/* ---------- Physics & AI ---------- */
function fall(o,dt,l){
 o.vy+=GRAV*dt;const pv=o.y;o.y+=o.vy*dt;o.g=false;
 if(o.vy>=0){let b=null;for(const s of l.surf)if(o.x>=s.x0&&o.x<=s.x1&&pv<=s.y+1&&o.y>=s.y&&(!b||s.y<b.y))b=s;if(b){o.y=b.y;o.vy=0;o.g=true}}
}
function hurt(n){if(P.inv>0||busy||scn!=='play')return;P.hp=Math.max(0,P.hp-n);P.inv=.8;P.kb=-P.face*40;if(P.hp<=0)die()}
function die(){busy=true;G.weps=G.weps.filter((id,i)=>WEP[id].t==='L'||(id==='pedang'&&G.weps.indexOf(id)===i));if(!G.weps.includes('pedang'))G.weps.unshift('pedang');if(!G.weps.includes(G.wpn))G.wpn='pedang';setTimeout(()=>go(()=>{save();show('lose');setBg('lose','hutan',.72)}),800)}
function updE(l,e,dt){
 const S=EN[e.k],dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy),ax=Math.abs(dx);
 e.t+=dt;e.cd-=dt;e.fl-=dt;
 let vx;
 if(d<S.ch){
  const dir=Math.sign(dx)||1;e.dir=dir;
  vx=ax>S.rng+2?dir*S.sp:ax<S.rng-6?-dir*S.sp*.6:0;
  if(e.cd<=0&&ax<=S.rng+4&&Math.abs(dy)<S.ay){hurt(S.d);e.cd=S.cd}
 }else{
  if(Math.abs(e.x-e.ox)>(e.k==='skel'?40:60))e.dir=-Math.sign(e.x-e.ox);
  vx=e.dir*(e.k==='skel'?18:14);
  if(e.k==='slime'&&e.g&&(e.h-=dt)<=0){e.vy=-150;e.h=1.4+Math.random()}
 }
 e.face=e.dir;
 if(e.k==='bat'){e.x+=vx*dt;e.y=GY-36+Math.sin(e.t*6)*8}
 else{e.x+=vx*dt;e.x=clamp(e.x,20,l.w-20);fall(e,dt,l)}
 for(const o of l.en)if(o!==e&&!o.dead&&Math.abs(o.x-e.x)<12&&Math.abs(o.y-e.y)<10)e.x+=Math.sign(e.x-o.x||1)*40*dt;
}
const DROP=.15;
function dropFood(){const id=Math.random()<.5?'roti':'air';showDrop(ITEMS[id].n,'C',ITEMS[id].ic,addItem(id,1))}
const need=()=>20*G.lv;
function gainXp(n){G.xp+=n;G.rep.xp+=n;while(G.xp>=need()){G.xp-=need();G.lv++;msg('Naik level! Lv '+G.lv)}}
function dropFood(){const id=Math.random()<.5?'roti':'air';showDrop(ITEMS[id].n,'C',ITEMS[id].ic,addItem(id,1))}
function killEn(l,e){
 e.dead=1;const [lo,hi]=EN[e.k].g,c=lo+(Math.random()*(hi-lo+1)|0);
 G.gold+=c;G.kills++;G.rep.g+=c;G.rep.k[e.k]++;gainXp(EN[e.k].xp);
 fx('+'+c+' G',e.x,e.y-EN[e.k].h-14,'#F5C84C');
 if(Math.random()<.3)dropFood();
 if(Math.random()<DROP)dropRoll();
}
const wAvg=id=>(WEP[id].lo+WEP[id].hi)/2;
let FX=[];
function fx(t,x,y,c){FX.push({t,x,y,c,a:.8})}
function rollHit(id){const w=WEP[id];return Math.random()<w.miss?null:w.lo+(Math.random()*(w.hi-w.lo+1)|0)}
// Area pukul = busur slash sesuai senjata (sudut a0..a1, radius r+20). Tinggi tangan ada di P.y-10.
function inSwing(x,y,pad){
 const w=WEP[G.wpn],[k,,,r]=w.sl,f=P.face,dx=(x-P.x)*f,dy=y-(P.y-10),R=r+20+pad;
 if(k==='thrust')return dx>=-4&&dx<=R&&Math.abs(dy)<=30+pad;
 if(k==='spin')return Math.abs(dx)<=R&&dy>=-56&&dy<=60+pad;
 return dx>=-6&&dx<=R&&dy>=-56&&dy<=60+pad;
}
function hitMine(l){
 for(const e of l.en){if(e.dead||P.hit.has(e))continue;const S=EN[e.k];if(inSwing(e.x,e.y-S.h/2,S.w/2)){P.hit.add(e);const d=rollHit(G.wpn);if(d===null){fx('MISS',e.x,e.y-S.h-4,'#F4EFE0');continue}e.hp-=d;e.fl=.15;fx(d,e.x,e.y-S.h-4,'#F5C84C');if(e.hp<=0)killEn(l,e)}}
 const b=l.boss;if(b&&b.act&&b.st!=='jump'&&!P.hit.has(b)&&inSwing(b.x,b.y-24,20)){P.hit.add(b);const d=rollHit(G.wpn);if(d===null)fx('MISS',b.x,b.y-52,'#F4EFE0');else{b.hp-=d;b.fl=.15;fx(d,b.x,b.y-52,'#F5C84C');if(b.hp<=0)bossDown(l)}}
}
function updB(l,dt){
 const b=l.boss;if(!b.act)return;
 b.t+=dt;b.fl-=dt;const dx=P.x-b.x;
 if(b.st==='idle'){
  if(Math.abs(dx)>70)b.x+=Math.sign(dx)*16*dt;b.x=clamp(b.x,50,430);b.face=Math.sign(dx)||b.face;
  if((b.cd-=dt)<=0){b.pat=Math.random()<.5?1:2;b.st='tele';b.tt=.6;b.tx=P.x;b.dir=Math.sign(dx)||1}
 }else if(b.st==='tele'){
  if((b.tt-=dt)<=0){
   if(b.pat===1){const a=Math.min(b.x,b.x+b.dir*56),c=Math.max(b.x,b.x+b.dir*56);if(P.x>=a&&P.x<=c&&P.y>GY-44)hurt(3);b.st='idle';b.cd=2;b.face=b.dir}
   else{b.st='jump';b.jt=0;b.sx=b.x}
  }
 }else{
  b.jt+=dt;const u=Math.min(1,b.jt/.7);b.x=b.sx+(b.tx-b.sx)*u;b.y=GY-288*u*(1-u);
  if(u>=1){b.y=GY;if(Math.abs(P.x-b.x)<30&&P.y>GY-30)hurt(3);b.st='idle';b.cd=2}
 }
}
function bossDown(l){const b=l.boss;b.act=0;b.dead=1;b.hp=0;G.bossDown=1;G.chest=1;gainXp(50);l.wall=false;const ok=giveWeapon('raja');if(ok&&wAvg('raja')>wAvg(G.wpn))G.wpn='raja';showDrop(WEP.raja.n,'X','pedang',ok);msg('Raja Goblin kalah. Jalan kembali ke kota terbuka.');save()}
const invCount=()=>G.weps.length+Object.keys(G.bag).length;
const addItem=(id,n)=>{if(!G.bag[id]&&invCount()>=18)return false;G.bag[id]=(G.bag[id]||0)+n;return true};
const giveWeapon=id=>{if(invCount()>=18)return false;G.weps.push(id);return true};
const WL={};for(const k in WEP)(WL[WEP[k].t]||(WL[WEP[k].t]=[])).push(k);
const TW={C:60.8,R:25,S:10,U:4,X:.2};// peluang tier per drop: makin langka makin kecil. Legend tidak pernah drop dari musuh (hanya lewat peti)
function rollTier(){let r=Math.random()*100;for(const t in TW){if((r-=TW[t])<0)return t}return 'C'}
const pickW=t=>WL[t][Math.random()*WL[t].length|0];
function dropRoll(){
 const t=rollTier();
 const id=pickW(t);showDrop(WEP[id].n,t,'pedang',giveWeapon(id));
}

function update(dt){
 FX.forEach(f=>{f.a-=dt;f.y-=14*dt});FX=FX.filter(f=>f.a>0);
 const l=L,lo=(l.id==='arena'&&l.boss.act)?10:6;
 G.time+=dt;P.inv-=dt;P.cd-=dt;P.at-=dt;P.fl-=dt;
 const ax=clamp(on('d','arrowright')-on('a','arrowleft')+JOY,-1,1);
 P.vx=ax*SPD;if(ax){P.face=ax>0?1:-1;P.st+=Math.abs(P.vx)*dt}
 P.kb*=Math.max(0,1-dt*6);
 P.x=clamp(P.x+(P.vx+P.kb)*dt,lo,l.w-6);
 if(jumpReq&&P.g){P.vy=-JV;P.g=false}jumpReq=false;
 if((KEY.j||TC.a)&&P.cd<=0){P.cd=.35;P.at=.16;P.hit=new Set()}
 if(P.at>0)hitMine(l);
 fall(P,dt,l);
 for(const e of l.en)if(!e.dead)updE(l,e,dt);
 l.en=l.en.filter(e=>!e.dead);
 if(l.boss)updB(l,dt);
 if(l.id[0]==='f'){G.hung=Math.max(0,G.hung-dt*.55);G.thirst=Math.max(0,G.thirst-dt*.67);l.spT=(l.spT||0)+dt;if(l.spT>=6){l.spT=0;if(l.en.length<10)spawnNear(l)}}
 edges();hud();
}

/* ---------- Transitions ---------- */
function edges(){
 const x=P.x,id=L.id;
 if(id==='desa'){if(x>L.w-8)go(()=>setLv('kota',16));return}
 if(id==='kota'){
  if(x<8)return go(()=>setLv('desa',LV.desa.w-16));
  if(x>L.w-8)return loadTo('f0',16,1);
  doorNear=Math.abs(x-200)<24?'shop':Math.abs(x-700)<24?'ser':'';
  return;
 }
 if(id==='arena'){const b=L.boss;const cz=G.chest&&Math.abs(x-CHX)<14;if(cz&&zone!=='chest'){zone='chest';openChest()}else if(!cz&&zone==='chest')zone='';if(!b.act&&!b.dead&&x>60){b.act=1;L.wall=true;msg('Raja Goblin muncul!')}if(b.dead)L.wall=false;if(x<8&&!b.act)return loadTo('f3',LV.f3.w-16,3)}
 if(id[0]==='f'){const i=+id[1];
  if(x<8){if(i>0)return loadTo('f'+(i-1),LV.f0.w-16,i);if(!G.bossDown){if(TM-lastB>2){lastB=TM;msg('Kamu tidak bisa kembali sebelum Boss kalah.')}P.x=16;return}return go(()=>setLv('kota',LV.kota.w-80))}
  if(x>L.w-8)return i<3?loadTo('f'+(i+1),16,i+2):loadTo('arena',24,4);
 }
}
function go(fn){busy=true;$('#fade').classList.add('on');setTimeout(()=>{fn();requestAnimationFrame(()=>$('#fade').classList.remove('on'));setTimeout(()=>busy=false,320)},320)}
function loadTo(id,x,a){
 busy=true;show('load');$('#ltit').textContent='Memuat area '+a+'/4';$('#ltip').textContent='Tip: '+TIPS[Math.random()*TIPS.length|0];
 $('#lbar').style.width='0';requestAnimationFrame(()=>requestAnimationFrame(()=>$('#lbar').style.width='100%'));
 setTimeout(()=>{setLv(id,x);show('play');busy=false},500);
}
function clearScreen(){
 show('clear');setBg('clear','kota',.72);
 $('#stats').innerHTML=`<div><span>Waktu</span><span>${String(G.time/60|0).padStart(2,'0')}:${String(G.time%60|0).padStart(2,'0')}</span></div><div><span>Gold</span><span>${G.gold} G</span></div><div><span>Musuh dikalahkan</span><span>${G.kills}</span></div>`;
}

/* ---------- Peti boss ---------- */
// Isi peti per stage: jumlah item per tier. Stage berikutnya bisa menaikkan angka ini.
const CHX=360,CHEST={1:{C:3,R:2,S:1,L:0}};
function openChest(){
 const plan=CHEST[1],rows=[];
 const add=(n,t,ic,ok)=>rows.push(`<div class="li"><span class="l"><img src="${ic}" alt="">${n}</span><span class="chip" style="--c:${TIER[t].c};--w:${TIER[t].w}px">${'<i></i>'.repeat(TIER[t].b)}${TIER[t].n}</span></div><small>${ok?'Masuk tas':'Tas penuh (hilang)'}</small>`);
 for(let i=0;i<plan.C;i++){if(Math.random()<.5){const id=Math.random()<.5?'roti':'air';add(ITEMS[id].n,'C',A[ITEMS[id].ic],addItem(id,1))}else{const id=pickW('C');add(WEP[id].n,'C',A.pedang,giveWeapon(id))}}
 for(let i=0;i<plan.R;i++){const id=pickW('R');add(WEP[id].n,'R',A.pedang,giveWeapon(id))}
 for(let i=0;i<plan.S;i++){const id=pickW('S');add(WEP[id].n,'S',A.pedang,giveWeapon(id))}
 for(let i=0;i<(plan.L||0);i++){const id=pickW('L');add(WEP[id].n,'L',A.pedang,giveWeapon(id))}
 G.chest=0;save();
 $('#chestList').innerHTML=rows.join('');
 openOv('chest');
}

// Spawn monster dekat pemain, tipe yang paling sedikit jumlahnya dulu
function spawnNear(l){
 const cnt={};for(const e of l.en)cnt[e.k]=(cnt[e.k]||0)+1;
 const k=KS.slice().sort((a,b)=>(cnt[a]||0)-(cnt[b]||0)||Math.random()-.5)[0];
 const side=Math.random()<.5?-1:1,x=clamp(P.x+side*(180+Math.random()*80),24,l.w-24),fly=k==='bat';
 l.en.push({k,x,ox:x,y:fly?GY-36:GY,vx:0,vy:0,hp:EN[k].hp,t:Math.random()*4,cd:0,fl:0,dir:-side,face:-side,h:1+Math.random(),dead:0,g:true});
}
// Laporan Serikat
const repHas=()=>G.rep.xp>0||G.rep.g>0||G.rep.kills>0||Object.values(G.rep.k).some(n=>n>0);
function resetRep(){G.rep=newRep()}
function enterDoor(){
 if(scn!=='play'||ui||busy||!L||L.id!=='kota'||!doorNear)return;
 if(doorNear==='shop')return openShop();
 if(G.bossDown||repHas())enterSer();else msg('Belum ada laporan untuk Serikat.');
}
function enterSer(){busy=true;save();go(()=>{show('ser');setBg('ser','kota',.6);busy=false;renderRep()})}
function renderRep(){
 const ks=Object.entries(G.rep.k).filter(([,n])=>n).map(([k,n])=>`${k} ${n}`).join(', ')||'-';
 $('#rep').innerHTML=`<div><span>Level</span><span>${G.lv} (XP ${G.xp}/${need()})</span></div><div><span>XP didapat</span><span>+${G.rep.xp}</span></div><div><span>Musuh dikalahkan</span><span>${ks}</span></div><div><span>Gold didapat</span><span>+${G.rep.g} G</span></div><div><span>Boss</span><span>${G.bossDown?'Sudah dikalahkan':'Belum'}</span></div>`;
 $('#serOk').textContent=G.bossDown?'Lanjut':'Kembali ke Kota';
}
function serOk(){
 if(G.bossDown){resetRep();return clearScreen()}
 resetRep();go(()=>{setLv('kota',740);show('play')});
}
