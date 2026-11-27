const $=s=>document.querySelector(s),cv=$('#c'),g=cv.getContext('2d');g.imageSmoothingEnabled=false;
const TOUCH=matchMedia('(pointer:coarse)').matches||'ontouchstart' in window;
document.body.classList.toggle('touch',TOUCH);
const GY=216,OY=48,GRAV=900,JV=345,SPD=70;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ov=(a,b,c,d,e,f,h,i)=>a<e+h&&a+c>e&&b<f+i&&b+d>f;
const on=(...k)=>k.some(x=>KEY[x])?1:0;
const TIER={C:{n:'Common',c:'#9AA0A6',b:1,w:1},R:{n:'Rare',c:'#4C8DFF',b:2,w:2},S:{n:'Super Rare',c:'#A66BFF',b:3,w:2},U:{n:'Uber Super Rare',c:'#FF9A3C',b:4,w:3},L:{n:'Legend',c:'#FFD23F',b:5,w:3},X:{n:'Special',c:'#FF4D5A',b:6,w:4}};
// Data placeholder (harga, efek, stat): menunggu PM
const WEP={pedang:{n:'Pedang',t:'C',d:2},besi:{n:'Pedang Besi',t:'R',d:3},perak:{n:'Pedang Perak',t:'S',d:4},naga:{n:'Pedang Naga',t:'U',d:5},bintang:{n:'Pedang Bintang',t:'L',d:6},raja:{n:'Pedang Taring Raja',t:'X',d:8}};
const SWORD={R:'besi',S:'perak',U:'naga',L:'bintang',X:'raja'};
const ITEMS={roti:{n:'Roti',p:5,ic:'roti',hp:4,hun:25,k:'food'},daging:{n:'Roti Isi',p:12,ic:'roti',f:'hue-rotate(40deg) saturate(1.5)',hp:8,hun:50,k:'food'},air:{n:'Air Segar',p:3,ic:'minum',th:40,k:'drink'},teh:{n:'Minum Herbal',p:8,ic:'minum',f:'hue-rotate(120deg)',th:70,hp:2,k:'drink'}};
const IORD=Object.keys(ITEMS);
const EN={slime:{hp:3,g:2,d:1,ch:110,w:16,h:12},goblin:{hp:4,g:3,d:1,ch:120,w:12,h:21},bat:{hp:2,g:4,d:1,ch:110,w:20,h:11},skel:{hp:6,g:5,d:2,ch:0,w:12,h:27},wolf:{hp:6,g:6,d:2,ch:110,w:26,h:17}};
const KS=Object.keys(EN);
// Ukuran frame dari sprites-atlas.json
const SP={cewek:{fw:18,fh:29,n:4,ax:9,ay:27,c:640},cowok:{fw:18,fh:29,n:4,ax:9,ay:27,c:640},slime:{fw:20,fh:16,n:4,ax:10,ay:14,c:900},goblin:{fw:18,fh:23,n:2,ax:9,ay:21,c:500},bat:{fw:22,fh:13,n:2,ax:11,ay:11,c:280},skel:{fw:16,fh:29,n:2,ax:8,ay:27,c:600},wolf:{fw:30,fh:19,n:4,ax:15,ay:17,c:500},boss:{fw:46,fh:51,n:2,ax:23,ay:49,c:1400}};
const LVW={desa:960,kota:960,f0:960,f1:960,f2:960,f3:960,arena:480};
const TIPS=['Makanan dibeli di kota dan dibawa ke hutan.','Musuh baru muncul setiap 1 menit.','Lapar dan haus turun perlahan di hutan.','Raja Goblin punya dua pola serangan.'];
const IM={};for(const k in A){const i=new Image();i.src=A[k];IM[k]=i}

let G,P={},L=null,LV={},scn='menu',ui='',busy=false,rot=false,zone='',TM=0,KEY={},TC={a:0},JOY=0,jumpReq=false,selC=null,lastB=-9,popT,saveT,dSel=null,shopTab='food',shopSel='roti',tasSel=null;
const newG=()=>({ch:'cewek',gold:0,bag:{},wpn:'pedang',spec:0,bossDown:0,hung:100,thirst:100,time:0,kills:0,spT:0});
G=newG();

/* ---------- Level ---------- */
function setupLevels(){
 const mk=(id,bgk,tint)=>({id,bgk,w:LVW[id],tint,surf:[{x0:0,x1:LVW[id],y:GY}],en:[],wall:false});
 LV={desa:mk('desa','desa',''),kota:mk('kota','kota',''),f0:mk('f0','hutan',''),f1:mk('f1','hutan','rgba(20,19,42,.15)'),f2:mk('f2','hutan','rgba(10,40,30,.2)'),f3:mk('f3','hutan','rgba(20,19,42,.25)'),arena:mk('arena','arena','rgba(20,19,42,.2)')};
 for(const k of['f0','f1','f2','f3']){const l=LV[k];for(let p=0;p<2;p++)l.surf.push({x0:p*480+28,x1:p*480+108,y:168},{x0:p*480+338,x1:p*480+430,y:152});spawnE(l,4,200,l.w-80)}
 LV.arena.boss={x:360,y:GY,hp:36,max:36,act:0,dead:G.bossDown,st:'idle',cd:2,t:0,tt:0,jt:0,sx:0,tx:0,face:-1,pat:0,dir:-1,fl:0};
}
function spawnE(l,n,x0,x1){for(let i=0;i<n;i++){const k=KS[Math.random()*5|0],fly=k==='bat',x=x0+Math.random()*(x1-x0);l.en.push({k,x,ox:x,y:fly?GY-50:GY,vx:0,vy:0,hp:EN[k].hp,t:Math.random()*4,cd:0,fl:0,dir:Math.random()<.5?-1:1,face:1,h:1+Math.random(),dead:0,g:true})}}
function setLv(id,x){LVK=id;L=LV[id];P.x=x;P.y=GY;P.vy=0;P.g=true;zone='';if(id==='kota')save()}

/* ---------- Physics & AI ---------- */
function fall(o,dt,l){
 o.vy+=GRAV*dt;const pv=o.y;o.y+=o.vy*dt;o.g=false;
 if(o.vy>=0){let b=null;for(const s of l.surf)if(o.x>=s.x0&&o.x<=s.x1&&pv<=s.y+1&&o.y>=s.y&&(!b||s.y<b.y))b=s;if(b){o.y=b.y;o.vy=0;o.g=true}}
}
function hurt(n){if(P.inv>0||busy||scn!=='play')return;P.hp=Math.max(0,P.hp-n);P.inv=.8;P.kb=-P.face*40;if(P.hp<=0)die()}
function die(){busy=true;setTimeout(()=>go(()=>{save();show('lose');setBg('lose','hutan',.72)}),800)}
function updE(l,e,dt){
 const S=EN[e.k],dx=P.x-e.x,d=Math.abs(dx),hw=S.w/2;
 e.t+=dt;e.cd-=dt;e.fl-=dt;
 if(e.k==='bat'){const c=d<S.ch,tx=c?P.x:e.ox;e.x+=Math.sign(tx-e.x)*(c?26:14)*dt;e.y=GY-50+Math.sin(e.t*6)*12;e.face=Math.sign(tx-e.x)||e.face}
 else{
  const c=S.ch&&d<S.ch;
  if(c)e.dir=Math.sign(dx)||e.dir;else if(Math.abs(e.x-e.ox)>(e.k==='skel'?40:60))e.dir=-Math.sign(e.x-e.ox);
  if(e.k==='slime'){if(e.g&&(e.h-=dt)<=0){e.vy=-150;e.vx=(c?Math.sign(dx):e.dir)*28;e.h=1.4+Math.random()}if(e.g)e.vx*=.85}
  else e.vx=e.dir*(c?(e.k==='wolf'?58:26):(e.k==='skel'?18:14));
  e.x+=e.vx*dt;e.x=clamp(e.x,20,l.w-20);fall(e,dt,l);e.face=e.dir;
 }
 if(ov(P.x-5,P.y-24,10,24,e.x-hw,e.y-S.h,S.w,S.h)&&e.cd<=0){hurt(S.d);e.cd=1}
}
function killEn(l,e){e.dead=1;G.gold+=EN[e.k].g;G.kills++;if(Math.random()<.35)dropRoll()}
function hitMine(l){
 const f=P.face,bx=f>0?P.x+2:P.x-18,by=P.y-22,dmg=WEP[G.wpn].d;
 for(const e of l.en){if(e.dead||P.hit.has(e))continue;const S=EN[e.k];if(ov(bx,by,16,16,e.x-S.w/2,e.y-S.h,S.w,S.h)){P.hit.add(e);e.hp-=dmg;e.fl=.15;if(e.hp<=0)killEn(l,e)}}
 const b=l.boss;if(b&&b.act&&b.st!=='jump'&&!P.hit.has(b)&&ov(bx,by,16,16,b.x-20,b.y-48,40,48)){P.hit.add(b);b.hp-=dmg;b.fl=.15;if(b.hp<=0)bossDown(l)}
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
function bossDown(l){const b=l.boss;b.act=0;b.dead=1;b.hp=0;G.bossDown=1;l.wall=false;if(!G.spec){G.spec=1;G.wpn='raja';showDrop(WEP.raja.n,'X','pedang')}msg('Raja Goblin kalah. Jalan kembali ke kota terbuka.');save()}
function dropRoll(){
 const r=Math.random(),t=r<.55?'C':r<.8?'R':r<.92?'S':r<.98?'U':'L';
 if(t==='C'){const id=Math.random()<.5?'roti':'air';addItem(id,1);return showDrop(ITEMS[id].n,'C',ITEMS[id].ic)}
 const id=SWORD[t];if(WEP[id].d>WEP[G.wpn].d)G.wpn=id;showDrop(WEP[id].n,t,'pedang');
}
const addItem=(id,n)=>G.bag[id]=(G.bag[id]||0)+n;

function update(dt){
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
 if(l.id[0]==='f'){G.hung=Math.max(0,G.hung-dt*.55);G.thirst=Math.max(0,G.thirst-dt*.67);if((G.spT+=dt)>=60){G.spT=0;spawnE(l,1,200,l.w-60)}}
 edges();hud();
}

/* ---------- Transitions ---------- */
function edges(){
 const x=P.x,id=L.id;
 if(id==='desa'){if(x>L.w-8)go(()=>setLv('kota',16));return}
 if(id==='kota'){
  if(x<8)return go(()=>setLv('desa',LV.desa.w-16));
  const z=Math.abs(x-200)<12?'shop':Math.abs(x-700)<12?'ser':x>L.w-44?'gate':'';
  if(z!==zone){zone=z;if(z==='shop')openShop();else if(z==='gate')openOv('gate');else if(z==='ser')enterSer()}
  return;
 }
 if(id==='arena'){const b=L.boss;if(!b.act&&!b.dead&&x>60){b.act=1;L.wall=true;msg('Raja Goblin muncul!')}if(b.dead)L.wall=false;if(x<8&&!b.act)return loadTo('f3',LV.f3.w-16,3)}
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
function enterSer(){if(!G.bossDown)return msg('Kalahkan Raja Goblin dulu.');busy=true;save();go(()=>{show('ser');setBg('ser','kota');busy=false;setTimeout(()=>go(clearScreen),2000)})}
function clearScreen(){
 show('clear');setBg('clear','kota',.72);
 $('#stats').innerHTML=`<div><span>Waktu</span><span>${String(G.time/60|0).padStart(2,'0')}:${String(G.time%60|0).padStart(2,'0')}</span></div><div><span>Gold</span><span>${G.gold} G</span></div><div><span>Musuh dikalahkan</span><span>${G.kills}</span></div>`;
}
