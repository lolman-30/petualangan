
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
 if(l.id==='kota'){door(200-cx,'TOKO','#8A5A2B');door(700-cx,'SERIKAT','#6A3F8C');g.fillStyle='#24213F';g.fillRect(l.w-40-cx,GY-64,36,64);g.fillStyle='#14132A';g.fillRect(l.w-34-cx,GY-50,24,50)}
 if(l.wall){g.fillStyle='#5A5470';g.fillRect(0,GY-120,8,120)}
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
 if(P.at>0){const u=1-P.at/.16,a=(-35+65*u)*Math.PI/180*P.face;g.save();g.translate(Math.round(P.x-cx+P.face*5),Math.round(P.y-14));g.rotate(a);g.scale(P.face,1);g.drawImage(IM.pedang,-8,-15,16,17);g.restore()}
}

/* ---------- HUD ---------- */
function hud(){
 $('#hpf').style.width=P.hp*5+'%';$('#hpt').textContent=P.hp+'/20';$('#hpf').parentNode.parentNode.classList.toggle('blink',P.inv>.5);
 $('#gv').textContent=G.gold+' G';
 $('#hungf').style.width=G.hung+'%';$('#thf').style.width=G.thirst+'%';
 $('#hungf').parentNode.parentNode.classList.toggle('blink',G.hung<25);$('#thf').parentNode.parentNode.classList.toggle('blink',G.thirst<25);
 $('#eatc').textContent=IORD.filter(k=>ITEMS[k].k==='food').reduce((s,k)=>s+(G.bag[k]||0),0);
 $('#drkc').textContent=IORD.filter(k=>ITEMS[k].k==='drink').reduce((s,k)=>s+(G.bag[k]||0),0);
 const c=TIER[WEP[G.wpn].t].c;$('#slot').style.setProperty('--c',c);$('#slotimg').src=A.pedang;
 const b=L&&L.boss,bo=!!(b&&b.act);$('#boss').classList.toggle('hide',!bo);if(bo)$('#bossf').style.width=b.hp/b.max*100+'%';
}

/* ---------- Screens & overlays ---------- */
function show(id){
 scn=id;
 document.querySelectorAll('.scr').forEach(e=>e.classList.toggle('hide',e.id!==id));
 $('#hud').classList.toggle('hide',id!=='play');cv.classList.toggle('hide',id!=='play');
}
function setBg(id,k,a){const e=$('#'+id);e.style.backgroundImage=(a?`linear-gradient(rgba(20,19,42,${a}),rgba(20,19,42,${a})),`:'')+`url(${A['bg_'+k]})`;e.style.backgroundSize='cover';e.style.backgroundRepeat='no-repeat';e.style.backgroundPosition='center';e.style.imageRendering='pixelated'}
function openOv(id){ui=id;$('#'+id).classList.remove('hide');const f={gate:'#gstay',dlg:'#dNo'}[id];if(f)$(f).focus()}
function closeOv(){ui='';['#shop','#gate','#pause','#tas','#dlg'].forEach(s=>$(s).classList.add('hide'));closePop()}
function msg(t){toast(`<span>${t}</span>`)}
function toast(h){const d=document.createElement('div');d.className='toast';d.innerHTML=h;const b=$('#toasts');b.prepend(d);while(b.children.length>3)b.lastChild.remove();setTimeout(()=>d.remove(),2500)}
function showDrop(n,t,ic){
 const T_=TIER[t],chip=`<span class="chip" style="--c:${T_.c};--w:${T_.w}px">${'<i></i>'.repeat(T_.b)}${T_.n}</span>`,im=A[ic];
 if(t==='C'||t==='R')return toast(`<img class="ic" src="${im}" alt=""><span>${n}</span>${chip}`);
 const p=$('#popup');p.style.setProperty('--c',T_.c);$('#pimg').src=im;$('#pnm').textContent=n;$('#pchip').innerHTML=chip;
 p.classList.remove('hide','glow');void p.offsetWidth;p.classList.add('glow');ui='popup';clearTimeout(popT);popT=setTimeout(closePop,2500);
}
function closePop(){clearTimeout(popT);$('#popup').classList.add('hide');if(ui==='popup')ui=''}
function save(){
 try{localStorage.setItem('pixel-s1',JSON.stringify({t:Date.now(),ch:G.ch,gold:G.gold,bag:G.bag,wpn:G.wpn,spec:G.spec,boss:G.bossDown}))}catch(e){}
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
function buy(){const it=ITEMS[shopSel];if(!it||G.gold<it.p)return;G.gold-=it.p;addItem(shopSel,1);renderShop();save()}

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
 const sel=tasSel?ITEMS[tasSel]:null;
 const bars=[['Hp',P.hp,20,sel&&sel.hp,'tHp','pHp','tHpT',`${P.hp}/20`],['Hun',G.hung,100,sel&&sel.hun,'tHun','pHun','tHunT',`${Math.round(G.hung)}%`],['Th',G.thirst,100,sel&&sel.th,'tTh','pTh','tThT',`${Math.round(G.thirst)}%`]];
 for(const [,cur,max,pv,id,pid,tid,txt] of bars){const b=barHtml(cur,max,pv);$('#'+id).style.width=b.cur+'%';const p=$('#'+pid);p.style.left=b.cur+'%';p.style.width=(b.pv-b.cur)+'%';p.style.display=pv?'block':'none';$('#'+tid).textContent=txt}
 const wt=WEP[G.wpn].t;$('#wbox').style.setProperty('--c',TIER[wt].c);$('#wimg').src=A.pedang;$('#wnm').textContent=WEP[G.wpn].n;
 $('#wchip').innerHTML=`<span class="chip" style="--c:${TIER[wt].c};--w:${TIER[wt].w}px">${'<i></i>'.repeat(TIER[wt].b)}${TIER[wt].n}</span>`;
 const ids=IORD.filter(k=>G.bag[k]);
 $('#slots').innerHTML=Array.from({length:18},(_,i)=>{const k=ids[i];if(!k)return '<button class="sl em" disabled></button>';return `<button class="sl${k===tasSel?' on':''}" data-id="${k}"><img src="${A[ITEMS[k].ic]}" style="filter:${ITEMS[k].f||'none'}" alt=""><em>${G.bag[k]}</em></button>`}).join('');
 if(!sel){$('#det2').innerHTML='<small>Pilih item di slot untuk melihat detail.</small>';return}
 const full=(!sel.hp||P.hp>=20)&&(!sel.hun||G.hung>=100)&&(!sel.th||G.thirst>=100);
 const efx=[sel.hp?`+${sel.hp} HP`:'',sel.hun?`+${sel.hun} Lapar`:'',sel.th?`+${sel.th} Haus`:''].filter(Boolean).join(', ');
 $('#det2').innerHTML=`<img src="${A[sel.ic]}" style="width:calc(56px*var(--s));height:calc(56px*var(--s));image-rendering:pixelated;filter:${sel.f||'none'}" alt=""><b>${sel.n}</b><span class="chip" style="--c:var(--food);--w:2px">${sel.k==='food'?'Makanan':'Minuman'}</span><small>Efek: ${efx}</small><small>Jumlah: ${G.bag[tasSel]}</small><button id="pakai" class="pri" style="width:100%;margin-top:auto" ${full?'disabled':''}>Pakai</button>`;
}
function pakai(){if(!tasSel||!useItem(tasSel))return;tasSel=IORD.find(k=>G.bag[k])||null;renderTas()}

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
 G=newG();Object.assign(G,{ch:sv.ch||'cewek',gold:sv.gold||0,bag:sv.bag||{},wpn:sv.wpn||'pedang',spec:sv.spec||0,bossDown:sv.boss||0});
 setupLevels();respawn();go(()=>{setLv('kota',60);show('play')});
}
