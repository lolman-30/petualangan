
/* ---------- Events ---------- */
function respawn(){P={x:24,y:GY,vx:0,vy:0,g:true,face:1,st:0,hp:20,inv:0,cd:0,at:0,fl:0,kb:0,hit:new Set()}}
const bind=(s,f)=>$(s).addEventListener('click',f);
bind('#bLanjut',continueRun);
bind('#bBaru',()=>loadSave()?openOv('dlg'):newGame());
bind('#dNo',closeOv);bind('#dYes',()=>{closeOv();try{localStorage.removeItem('pixel-s1')}catch(e){}newGame()});
document.querySelectorAll('.card').forEach(b=>b.addEventListener('click',()=>{selC=b.dataset.c;document.querySelectorAll('.card').forEach(x=>x.classList.toggle('on',x===b));$('#start').disabled=false}));
bind('#start',()=>{try{document.documentElement.requestFullscreen?.()?.catch?.(()=>{})}catch(e){}try{screen.orientation?.lock?.('landscape')?.catch?.(()=>{})}catch(e){}go(()=>{respawn();startRun()})});
$('#intro').addEventListener('click',e=>{if(busy)return;if(e.target.id==='skip'){clearInterval(ti);toWorld()}else introTap()});
bind('#lnext',()=>go(()=>{respawn();setupLevels();setLv('kota',60);show('play')}));
bind('#lmenu',showMenu);
bind('#cnext',()=>go(()=>{respawn();setLv('kota',740);show('play')}));
bind('#cmenu',showMenu);
bind('#pbtn',()=>{if(scn==='play'&&!ui&&!busy)openOv('pause')});
bind('#tasB',()=>{if(scn==='play'&&!ui&&!busy)openTas()});
bind('#resume',closeOv);
bind('#ptas',()=>{closeOv();openTas()});
bind('#pmenu',()=>{closeOv();showMenu()});
bind('#tclose',closeOv);
$('#tas').addEventListener('click',e=>{const s=e.target.closest('.sl[data-id]');if(s){tasSel=s.dataset.id;renderTas();return}if(e.target.id==='pakai')pakai()});
bind('#gstay',()=>{closeOv();P.x-=40});
bind('#ggo',()=>{closeOv();loadTo('f0',16,1)});
$('#shop').addEventListener('click',e=>{
 const t=e.target.closest('[data-tab],[data-id],#buy,#close');if(!t)return;
 if(t.dataset.tab){shopTab=t.dataset.tab;shopSel=null;renderShop()}
 else if(t.dataset.id){shopSel=t.dataset.id;renderShop()}
 else if(t.id==='buy')buy();else closeOv();
});
$('#popup').addEventListener('click',closePop);

/* ---------- Keyboard ---------- */
addEventListener('keydown',e=>{
 const k=e.key.toLowerCase();
 if(['arrowleft','arrowright','arrowup','arrowdown',' '].includes(k))e.preventDefault();
 KEY[k]=1;
 if(!e.repeat&&(k==='w'||k===' '||k==='arrowup')&&scn==='play'&&!ui&&!busy)jumpReq=true;
 if(k==='escape'){if(ui==='gate')closeOv(),P.x-=40;else if(ui)closeOv();else if(scn==='play'&&!busy)openOv('pause')}
 if(k==='tab'||k==='i'){e.preventDefault();if(ui==='tas')closeOv();else if(scn==='play'&&!ui&&!busy)openTas()}
 if(k==='1'&&scn==='play'&&!ui)eat();
 if(k==='2'&&scn==='play'&&!ui)drink();
});
addEventListener('keyup',e=>{KEY[e.key.toLowerCase()]=0});

/* ---------- Touch ---------- */
const jb=$('#joy'),kn=$('#knob');
jb.addEventListener('pointerdown',e=>{jb.setPointerCapture(e.pointerId);jset(e)});
jb.addEventListener('pointermove',e=>{if(e.buttons)jset(e)});
['pointerup','pointercancel'].forEach(t=>jb.addEventListener(t,()=>{JOY=0;kn.style.translate='0 0'}));
function jset(e){const r=jb.getBoundingClientRect();let dx=(e.clientX-(r.left+r.width/2))/(r.width/2);dx=Math.abs(dx)<.12?0:clamp(dx,-1,1);JOY=dx;kn.style.translate=`${dx*50}% 0`}
$('#atk').addEventListener('pointerdown',()=>TC.a=1);
['pointerup','pointercancel'].forEach(t=>$('#atk').addEventListener(t,()=>TC.a=0));
$('#jmp').addEventListener('pointerdown',()=>{if(scn==='play'&&!ui&&!busy)jumpReq=true});
$('#eat').addEventListener('pointerdown',eat);
$('#drk').addEventListener('pointerdown',drink);

/* ---------- Fit & loop ---------- */
function fit(){
 const vw=innerWidth,vh=innerHeight;
 document.documentElement.style.setProperty('--s',Math.max(.85,Math.min(1.5,vw/844,vh/390)));
 const k=TOUCH?vh/270:Math.max(1,Math.floor(Math.min(vw/480,vh/270)));
 cv.style.width=480*k+'px';cv.style.height=270*k+'px';
 rot=TOUCH&&vh>vw;$('#rot').classList.toggle('hide',!rot);
}
addEventListener('resize',fit);
let lt=0;
function frame(t){
 const dt=lt?Math.min(.05,(t-lt)/1000):0;lt=t;TM+=dt;
 if(scn==='play'&&!ui&&!busy&&!rot&&L)update(dt);
 draw();requestAnimationFrame(frame);
}
function previews(){for(const[id,k]of[['pv0','cewek'],['pv1','cowok']]){const c=$('#'+id).getContext('2d');c.clearRect(0,0,18,29);c.drawImage(IM[k],0,0,18,29,0,0,18,29)}}
respawn();setupLevels();previews();fit();showMenu();requestAnimationFrame(frame);
