
/* ---------- Render ---------- */
const fr=k=>Math.floor(TM*1000/SP[k].c*SP[k].n)%SP[k].n;
function spr(k,f,x,y,flip){
 const s=SP[k],im=IM[k],X=Math.round(x-s.ax),Y=Math.round(y-s.ay);
 g.save();
 if(flip){g.translate(X+s.fw,Y);g.scale(-1,1);g.drawImage(im,f*s.fw,0,s.fw,s.fh,0,0,s.fw,s.fh)}
 else g.drawImage(im,f*s.fw,0,s.fw,s.fh,X,Y,s.fw,s.fh);
 g.restore();
}
function door(x,t,c){
 g.fillStyle=c;g.fillRect(x-10,GY-34,20,34);g.fillStyle='#F5C84C';g.fillRect(x+5,GY-18,2,2);
 g.fillStyle='#24213F';g.fillRect(x-30,GY-48,60,10);g.fillStyle='#F4EFE0';g.font="7px 'Press Start 2P'";g.textAlign='center';g.fillText(t,x,GY-40);g.textAlign='left';
}
function draw(){
 g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.fillStyle='#14132A';g.fillRect(0,0,480,270);
 if(scn!=='play'||!L)return;
 const l=L,cx=Math.round(clamp(P.x-240,0,l.w-480)),bg=IM['bg_'+l.bgk];
 if(bg.complete)for(let k=Math.floor(cx/480);k*480<cx+480;k++){const x=k*480-cx;g.drawImage(bg,0,0,240,1,x,0,480,OY);g.drawImage(bg,0,0,240,111,x,OY,480,222)}
 if(l.tint){g.fillStyle=l.tint;g.fillRect(0,0,480,270)}
 if(l.id==='kota'){door(200-cx,'TOKO','#8A5A2B');door(700-cx,'SERIKAT','#6A3F8C')}
 if(l.wall){g.fillStyle='#5A5470';g.fillRect(0,GY-120,8,120)}
 if(l.id==='arena'&&G.chest){g.fillStyle='#6B4A2B';g.fillRect(CHX-8-cx,GY-10,16,10);g.fillStyle='#F5C84C';g.fillRect(CHX-8-cx,GY-7,16,2);g.fillStyle='#3A2A1A';g.fillRect(CHX-1-cx,GY-8,2,3)}
 const b=l.boss;
 if(b&&b.act&&b.st==='tele'){
  g.fillStyle=`rgba(229,72,77,${.3+.25*Math.sin(TM*8)})`;
  if(b.pat===1)g.fillRect(Math.min(b.x,b.x+b.dir*56)-cx,GY-44,56,44);
  else{g.beginPath();g.ellipse(b.tx-cx,GY,30,6,0,0,6.283);g.fill()}
 }
 for(const e of l.en){if(e.fl>0&&Math.floor(TM*30)%2)continue;spr(e.k,fr(e.k),e.x-cx,e.y,e.face<0)}
 if(b&&b.act){const lift=b.st==='jump'?0:0;spr('boss',fr('boss'),b.x-cx,b.y,b.face<0)}
 const pf=P.at>0?0:(P.g&&P.vx?Math.floor(P.st/6)%4:0);
 if(!(P.inv>0&&Math.floor(P.inv*12)%2))spr(G.ch,pf,P.x-cx,P.y,P.face<0);
 if(P.at>0)swingDraw();
 g.font="8px 'Press Start 2P'";g.textAlign='center';for(const f of FX){g.globalAlpha=Math.min(1,f.a*1.5);g.fillStyle=f.c;g.fillText(String(f.t),f.x-cx,f.y)}g.globalAlpha=1;g.textAlign='left';
}

/* ---------- HUD ---------- */
function hud(){
 $('#hpf').style.width=P.hp*5+'%';$('#hpt').textContent=P.hp+'/20';$('#hpf').parentNode.parentNode.classList.toggle('blink',P.inv>.5);
 $('#gv').textContent=G.gold+' G';$('#lvn').textContent=G.lv;$('#xpf').style.width=G.xp/need()*100+'%';
 $('#hungf').style.width=G.hung+'%';$('#thf').style.width=G.thirst+'%';
 $('#hungf').parentNode.parentNode.classList.toggle('blink',G.hung<25);$('#thf').parentNode.parentNode.classList.toggle('blink',G.thirst<25);
 $('#eatc').textContent=IORD.filter(k=>ITEMS[k].k==='food').reduce((s,k)=>s+(G.bag[k]||0),0);
 $('#drkc').textContent=IORD.filter(k=>ITEMS[k].k==='drink').reduce((s,k)=>s+(G.bag[k]||0),0);
 const c=TIER[WEP[G.wpn].t].c;$('#slot').style.setProperty('--c',c);$('#slotimg').src=A.pedang;
 const eb=$('#enter'),dn=scn==='play'&&!ui&&!busy&&L&&L.id==='kota'?doorNear:'';
 eb.classList.toggle('hide',!dn);if(dn)eb.firstChild.textContent=dn==='shop'?'Masuk Toko':'Masuk Serikat';
 const b=L&&L.boss,bo=!!(b&&b.act);$('#boss').classList.toggle('hide',!bo);if(bo)$('#bossf').style.width=b.hp/b.max*100+'%';
}

/* ---------- Screens & overlays ---------- */
function show(id){
 scn=id;
 document.querySelectorAll('.scr').forEach(e=>e.classList.toggle('hide',e.id!==id));
 $('#hud').classList.toggle('hide',id!=='play');cv.classList.toggle('hide',id!=='play');
}
function setBg(id,k,a){const e=$('#'+id);e.style.backgroundImage=(a?`linear-gradient(rgba(20,19,42,${a}),rgba(20,19,42,${a})),`:'')+`url(${A['bg_'+k]})`;e.style.backgroundSize='cover';e.style.backgroundRepeat='no-repeat';e.style.backgroundPosition='center';e.style.imageRendering='pixelated'}
function openOv(id){ui=id;$('#'+id).classList.remove('hide');const f={dlg:'#dNo',chest:'#cclose'}[id];if(f)$(f).focus()}
function closeOv(){ui='';['#shop','#pause','#tas','#dlg','#chest'].forEach(s=>$(s).classList.add('hide'));closePop()}
function msg(t){toast(`<span>${t}</span>`)}
function toast(h){const d=document.createElement('div');d.className='toast';d.innerHTML=h;const b=$('#toasts');b.prepend(d);while(b.children.length>3)b.lastChild.remove();setTimeout(()=>d.remove(),2500)}
function showDrop(n,t,ic,ok=true){if(!ok)n+=' (tas penuh, hilang)';
 const T_=TIER[t],chip=`<span class="chip" style="--c:${T_.c};--w:${T_.w}px">${'<i></i>'.repeat(T_.b)}${T_.n}</span>`,im=A[ic];
 if(t==='C'||t==='R')return toast(`<img class="ic" src="${im}" alt=""><span>${n}</span>${chip}`);
 const p=$('#popup');p.style.setProperty('--c',T_.c);$('#pimg').src=im;$('#pnm').textContent=n;$('#pchip').innerHTML=chip;
 p.classList.remove('hide','glow');void p.offsetWidth;p.classList.add('glow');ui='popup';clearTimeout(popT);popT=setTimeout(closePop,2500);
}
function closePop(){clearTimeout(popT);$('#popup').classList.add('hide');if(ui==='popup')ui=''}
function save(){
 try{localStorage.setItem('pixel-s1',JSON.stringify({t:Date.now(),ch:G.ch,gold:G.gold,bag:G.bag,wpn:G.wpn,spec:G.spec,boss:G.bossDown,chest:G.chest,weps:G.weps,lv:G.lv,xp:G.xp,rep:G.rep}))}catch(e){}
 const s=$('#saveT');s.classList.add('on');clearTimeout(saveT);saveT=setTimeout(()=>s.classList.remove('on'),2000);
}
const loadSave=()=>{try{return JSON.parse(localStorage.getItem('pixel-s1'))}catch(e){return null}};

/* ---------- Shop ---------- */
function openShop(){openOv('shop');renderShop()}
function renderShop(){
 $('#sg').textContent='Gold: '+G.gold+' G';
 document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('pri',b.dataset.tab===shopTab));
 const ids=IORD.filter(k=>ITEMS[k].k===shopTab);if(!ids.includes(shopSel))shopSel=ids[0];
 $('#list').innerHTML=ids.map(k=>`<button class="li${k===shopSel?' on':''}" data-id="${k}"><span class="l"><img src="${A[ITEMS[k].ic]}" style="filter:${ITEMS[k].f||'none'}" alt="">${ITEMS[k].n}</span><span>x${G.bag[k]||0} · ${ITEMS[k].p} G</span></button>`).join('');
 const it=ITEMS[shopSel],eff=(it.hp?`Pulihkan ${it.hp} HP · `:'')+(it.hun?`Lapar +${it.hun}`:`Haus +${it.th}`);
 $('#det').innerHTML=`<img src="${A[it.ic]}" style="filter:${it.f||'none'}" alt=""><b>${it.n}</b><small>${eff}</small><button id="buy" class="pri" ${G.gold<it.p?'disabled':''}>${G.gold>=it.p?`Beli · ${it.p} G`:'Gold tidak cukup'}</button>`;
}
function buy(){const it=ITEMS[shopSel];if(!it||G.gold<it.p)return;if(!addItem(shopSel,1))return msg('Tas penuh');G.gold-=it.p;renderShop();save()}

/* ---------- Makan, minum, tas ---------- */
function useItem(id){
 const it=ITEMS[id];if(!it||!G.bag[id])return false;
 if(it.hp)P.hp=Math.min(20,P.hp+it.hp);if(it.hun)G.hung=Math.min(100,G.hung+it.hun);if(it.th)G.thirst=Math.min(100,G.thirst+it.th);
 if(--G.bag[id]<=0)delete G.bag[id];return true;
}
const firstOf=k=>IORD.find(i=>ITEMS[i].k===k&&G.bag[i]);
function eat(){if(scn!=='play'||ui||busy)return;const id=firstOf('food');if(!id)return msg('Tidak punya makanan.');useItem(id)}
function drink(){if(scn!=='play'||ui||busy)return;const id=firstOf('drink');if(!id)return msg('Tidak punya minuman.');useItem(id)}
function openTas(){openOv('tas');tasSel=IORD.find(k=>G.bag[k])||null;renderTas();drawPortrait()}
function drawPortrait(){const c=$('#tcv').getContext('2d');c.clearRect(0,0,18,29);const s=SP[G.ch];c.drawImage(IM[G.ch],0,0,s.fw,s.fh,0,0,s.fw,s.fh)}
function barHtml(cur,max,pv){const p=pv?Math.min(max,cur+pv):cur;return {cur:cur/max*100,pv:p/max*100}}
function renderTas(){
 const isW=!!tasSel&&tasSel[0]==='w',sel=tasSel&&!isW?ITEMS[tasSel]:null;
 const bars=[['Hp',P.hp,20,sel&&sel.hp,'tHp','pHp','tHpT',`${P.hp}/20`],['Hun',G.hung,100,sel&&sel.hun,'tHun','pHun','tHunT',`${Math.round(G.hung)}%`],['Th',G.thirst,100,sel&&sel.th,'tTh','pTh','tThT',`${Math.round(G.thirst)}%`]];
 for(const [,cur,max,pv,id,pid,tid,txt] of bars){const b=barHtml(cur,max,pv);$('#'+id).style.width=b.cur+'%';const p=$('#'+pid);p.style.left=b.cur+'%';p.style.width=(b.pv-b.cur)+'%';p.style.display=pv?'block':'none';$('#'+tid).textContent=txt}
 const wt=WEP[G.wpn].t;$('#wbox').style.setProperty('--c',TIER[wt].c);$('#wimg').src=A.pedang;$('#wnm').textContent=WEP[G.wpn].n;
 $('#wchip').innerHTML=`<span class="chip" style="--c:${TIER[wt].c};--w:${TIER[wt].w}px">${'<i></i>'.repeat(TIER[wt].b)}${TIER[wt].n}</span>`;
 const cells=[...G.weps.map((id,i)=>({k:'w'+i,ic:A.pedang,f:'none',c:TIER[WEP[id].t].c,e:G.wpn===id})),...IORD.filter(k=>G.bag[k]).map(k=>({k,ic:A[ITEMS[k].ic],f:ITEMS[k].f||'none',c:'',n:G.bag[k]}))];
 $('#slots').innerHTML=Array.from({length:18},(_,i)=>{const c=cells[i];if(!c)return '<button class="sl em" disabled></button>';return `<button class="sl${c.k===tasSel?' on':''}" data-id="${c.k}"${c.c?` style="border-color:${c.c}"`:''}><img src="${c.ic}" style="filter:${c.f}" alt="">${c.n?`<em>${c.n}</em>`:''}${c.e?'<b class="ac">A</b>':''}</button>`}).join('');
 $('#tcount').textContent=`Penyimpanan ${cells.length}/18 · seret item keluar dari tas untuk membuang`;
 if(isW){
  const id=G.weps[+tasSel.slice(1)];if(id===undefined){tasSel=null;return renderTas()}
  const w=WEP[id],eq=G.wpn===id,T_=TIER[w.t];
  $('#det2').innerHTML=`<img src="${A.pedang}" style="width:calc(56px*var(--s));height:calc(56px*var(--s));image-rendering:pixelated" alt=""><b>${w.n}</b><span class="chip" style="--c:${T_.c};--w:2px">${'<i></i>'.repeat(T_.b)}${T_.n}</span><small>Damage ${w.lo}–${w.hi}</small><small>Peluang miss ${Math.round(w.miss*100)}%</small><button id="pakai" class="pri" style="width:100%;margin-top:auto" ${eq?'disabled':''}>${eq?'Aktif':'Pasang'}</button>`;
  return;
 }
 if(!sel){$('#det2').innerHTML='<small>Pilih item di slot untuk melihat detail.</small>';return}
 const full=(!sel.hp||P.hp>=20)&&(!sel.hun||G.hung>=100)&&(!sel.th||G.thirst>=100);
 const efx=[sel.hp?`+${sel.hp} HP`:'',sel.hun?`+${sel.hun} Lapar`:'',sel.th?`+${sel.th} Haus`:''].filter(Boolean).join(', ');
 $('#det2').innerHTML=`<img src="${A[sel.ic]}" style="width:calc(56px*var(--s));height:calc(56px*var(--s));image-rendering:pixelated;filter:${sel.f||'none'}" alt=""><b>${sel.n}</b><span class="chip" style="--c:var(--food);--w:2px">${sel.k==='food'?'Makanan':'Minuman'}</span><small>Efek: ${efx}</small><small>Jumlah: ${G.bag[tasSel]}</small><button id="pakai" class="pri" style="width:100%;margin-top:auto" ${full?'disabled':''}>Pakai</button>`;
}
function pakai(){
 if(!tasSel)return;
 if(tasSel[0]==='w'){const id=G.weps[+tasSel.slice(1)];if(id)G.wpn=id;return renderTas()}
 if(!useItem(tasSel))return;tasSel=IORD.find(k=>G.bag[k])||null;renderTas();
}

/* Buang item/senjata dari Tas (dipanggil saat item diseret keluar panel penyimpanan) */
function buang(id){
 if(id[0]==='w'){
  const i=+id.slice(1),w=G.weps[i];if(w===undefined)return;
  if(G.weps.length<=1)return msg('Minimal bawa satu senjata');
  G.weps.splice(i,1);
  if(!G.weps.includes(G.wpn))G.wpn=G.weps.reduce((a,b)=>wAvg(b)>wAvg(a)?b:a);
  msg(`${WEP[w].n} dibuang`);
 }else{
  const it=ITEMS[id],n=G.bag[id];if(!it||!n)return;
  delete G.bag[id];msg(`${it.n} x${n} dibuang`);
 }
 tasSel=null;save();renderTas();
}

/* ---------- Menu, karakter, intro ---------- */
function showMenu(){
 show('menu');setBg('menu','desa',.45);closeOv();
 const sv=loadSave(),b=$('#bLanjut');
 b.classList.toggle('hide',!sv);$('#bBaru').classList.toggle('pri',!sv);
 if(sv){$('#sInfo').textContent=`Stage 1 · ${sv.gold} G · ${new Date(sv.t).toLocaleDateString('id-ID',{day:'numeric',month:'short'})}`;b.focus()}else $('#bBaru').focus();
}
function newGame(){G=newG();setupLevels();selC=null;$('#start').disabled=true;document.querySelectorAll('.card').forEach(x=>x.classList.remove('on'));show('sel')}
function startRun(){
 G.ch=selC;setupLevels();show('intro');li=0;lineShow();
}
let li=0,ti;
const LINES=['Kau lahir di desa kecil di kaki bukit.','Hari ini, untuk pertama kalinya, kau meninggalkan rumah menuju kota besar.','Di sana, Serikat Petualang menunggu siapa pun yang berani.'];
function lineShow(){
 if(li>=LINES.length)return toWorld();
 const p=document.createElement('p');p.dataset.f=LINES[li];$('#itxt').replaceChildren(p);let k=0;clearInterval(ti);
 ti=setInterval(()=>{p.textContent=p.dataset.f.slice(0,++k);if(k>=p.dataset.f.length)clearInterval(ti)},35);
}
function introTap(){const p=$('#itxt p');if(p&&p.textContent!==p.dataset.f){clearInterval(ti);p.textContent=p.dataset.f;return}li++;lineShow()}
function toWorld(){clearInterval(ti);busy=true;go(()=>{setLv('desa',24);show('play');busy=false})}
function continueRun(){
 const sv=loadSave();if(!sv)return showMenu();
 G=newG();Object.assign(G,{ch:sv.ch||'cewek',gold:sv.gold||0,bag:sv.bag||{},wpn:sv.wpn||'pedang',spec:sv.spec||0,bossDown:sv.boss||0,chest:sv.chest||0});G.weps=sv.weps||['pedang'];G.lv=sv.lv||1;G.xp=sv.xp||0;G.rep=sv.rep||newRep();
 setupLevels();respawn();go(()=>{setLv('kota',60);show('play')});
}

/* Slash animasi unik per senjata: sl = [gaya, sudut awal, sudut akhir, radius, warna, tebal] */
function swingDraw(){
 const w=WEP[G.wpn],[k,a0,a1,r,c,lw]=w.sl,f=P.face,u=1-P.at/.16,cx=Math.round(clamp(P.x-240,0,L.w-480));
 const X=P.x-cx,Y=P.y-14,rad=d=>(f>0?d:180-d)*Math.PI/180;
 g.save();g.strokeStyle=c;g.lineWidth=lw;g.lineCap='round';
 if(k==='thrust'){const p=Math.sin(u*Math.PI)*r;g.beginPath();g.moveTo(X+f*4,Y);g.lineTo(X+f*(4+p),Y);g.stroke();g.translate(X+f*(4+p),Y);g.scale(f,1);g.drawImage(IM.pedang,-4,-15,16,17)}
 else{
  const ang=a0+(a1-a0)*u,n=k==='double'?2:1;
  for(let i=0;i<n;i++){const s=i?-12:0,x1=rad(a0+s),x2=rad(ang+s);g.beginPath();g.arc(X,Y,r-i*3,Math.min(x1,x2),Math.max(x1,x2));g.stroke()}
  g.translate(X,Y);g.rotate(rad(ang));g.drawImage(IM.pedang,r-8,-8,16,17);
 }
 g.restore();
}
