(function(){
 'use strict';
 const intro=document.getElementById('brandIntro'),video=document.getElementById('campaignVideo'),hero=document.querySelector('.cinema-hero');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let introTimer,removed=false;
 function finishIntro(){if(removed)return;removed=true;clearTimeout(introTimer);intro.classList.add('leaving');setTimeout(()=>{intro.hidden=true;},reduced?0:900);try{sessionStorage.setItem('mocet_intro_v2','seen');}catch{}}
 let seen=false;try{seen=sessionStorage.getItem('mocet_intro_v2')==='seen';}catch{}
 if(!seen&&!reduced){intro.hidden=false;introTimer=setTimeout(finishIntro,2800);document.getElementById('skipIntro').addEventListener('click',finishIntro);document.addEventListener('keydown',e=>{if(e.key==='Escape')finishIntro();});}else{intro.hidden=true;removed=true;}
 const toggle=document.getElementById('filmToggle'),label=document.getElementById('filmToggleLabel'),icon=document.getElementById('filmToggleIcon');
 const mobile=matchMedia('(max-width:650px)').matches;
 video.src=mobile?'assets/mocet-editorial-mobile.mp4':'assets/mocet-editorial-wide.mp4';
 video.poster=mobile?'assets/mocet-poster-mobile.jpg':'assets/mocet-poster-wide.jpg';video.muted=true;
 function sync(){const active=!video.paused&&!video.ended;hero.classList.toggle('is-playing',active);toggle.setAttribute('aria-label',active?'Pausar video editorial':'Reproducir video editorial');toggle.setAttribute('aria-pressed',String(active));label.textContent=active?'PAUSAR EDITORIAL':'VER EDITORIAL';icon.textContent=active?'Ⅱ':'▶';}
 video.addEventListener('playing',()=>{video.classList.add('playing');sync();});video.addEventListener('pause',sync);video.addEventListener('error',()=>{video.classList.remove('playing');label.textContent='VIDEO NO DISPONIBLE';toggle.disabled=true;});
 video.addEventListener('timeupdate',()=>{const t=video.currentTime||0;document.querySelectorAll('.film-progress i').forEach((bar,i)=>bar.style.setProperty('--progress',String(Math.max(0,Math.min(1,(t-i*4.45)/4.45)))));const index=hero.querySelector('.film-index b');if(index)index.textContent='0'+Math.min(4,Math.floor(t/4.45)+1)+' — 04';});
 toggle.addEventListener('click',async()=>{if(video.paused){try{await video.play();}catch{label.textContent='INTENTA DE NUEVO';}}else video.pause();sync();});
 const saveData=navigator.connection?.saveData;
 if(!reduced&&!saveData){video.play().catch(sync);}
 let pauseOnHide=false;document.addEventListener('visibilitychange',()=>{if(document.hidden){pauseOnHide=!video.paused;video.pause();}else if(pauseOnHide&&!reduced){video.play().catch(sync);pauseOnHide=false;}});
 if('IntersectionObserver' in window&&!reduced){const reveal=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');reveal.unobserve(e.target);}});},{threshold:.08});document.querySelectorAll('.section-top,.category-card,.steps article,.statement').forEach((el,i)=>{el.classList.add('reveal-ready');el.style.transitionDelay=(i%4)*65+'ms';reveal.observe(el);});const mediaWatch=new IntersectionObserver(entries=>{const visible=entries[0].isIntersecting;if(!visible&&!video.paused){video.dataset.resume='yes';video.pause();}else if(visible&&video.dataset.resume==='yes'&&!document.hidden){video.play().catch(sync);delete video.dataset.resume;}},{threshold:.05});mediaWatch.observe(hero);}
 const count=document.getElementById('bagCount');if('MutationObserver' in window){new MutationObserver(()=>{count.classList.remove('bump');requestAnimationFrame(()=>count.classList.add('bump'));}).observe(count,{childList:true});}
})();
