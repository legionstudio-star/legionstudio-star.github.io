/* Photograph + real-time paint mist; no generated can or raster animation. */
(() => {
  const intro=document.getElementById('intro'),stage=intro?.querySelector('.intro-stage'),logo=intro?.querySelector('.intro-logo');
  const rig=document.getElementById('sprayRig'),canvas=document.getElementById('sprayMist');
  if(!intro||!stage||!logo||!rig||!canvas||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const ctx=canvas.getContext('2d'); if(!ctx){logo.style.clipPath='inset(0)';return;}
  const padding=140,dpr=Math.min(devicePixelRatio||1,2),small=matchMedia('(max-width:600px)').matches;
  let width=0,height=0,logoHeight=0,particles=[],elapsed=0,last=0,start=0;
  const duration=1800,delay=200,maxParticles=small?420:700;
  // Match the existing logo reveal's cubic-bezier(.65,0,.35,1).
  function ease(x){let lo=0,hi=1,t=x;for(let i=0;i<14;i++){t=(lo+hi)/2;const a=1-t,px=3*a*a*t*.65+3*a*t*t*.35+t*t*t;if(px<x)lo=t;else hi=t;}return 3*(1-t)*t*t+t*t*t;}
  const sprite=document.createElement('canvas');sprite.width=sprite.height=48;
  const paint=sprite.getContext('2d'),gradient=paint.createRadialGradient(24,24,0,24,24,24);
  gradient.addColorStop(0,'rgba(235,239,229,.28)');gradient.addColorStop(.35,'rgba(225,233,217,.16)');gradient.addColorStop(.7,'rgba(215,225,205,.05)');gradient.addColorStop(1,'rgba(205,220,190,0)');paint.fillStyle=gradient;paint.fillRect(0,0,48,48);
  function measure(){const box=stage.getBoundingClientRect();width=box.width;height=box.height;logoHeight=logo.getBoundingClientRect().height;canvas.width=Math.ceil((width+padding*2)*dpr);canvas.height=Math.ceil((height+padding*2)*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
  function emit(x,y,count){for(let i=0;i<count&&particles.length<maxParticles;i++){
    const angle=Math.PI+(Math.random()-.5)*1.05,speed=240+Math.random()*380;
    particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-5,age:0,life:.16+Math.random()*.23,r:2+Math.random()*6,alpha:.14+Math.random()*.28,fine:Math.random()<.06});
  }}
  function frame(time){
    if(!intro.isConnected||intro.classList.contains('exit'))return;
    if(!start){start=time;last=time;measure();}
    const dt=Math.min((time-last)/1000,.035);last=time;elapsed=time-start;
    const progress=Math.max(0,Math.min(1,(elapsed-delay)/duration)),position=ease(progress);
    const x=position*width,y=logoHeight*.49+Math.sin(position*Math.PI*3)*4;
    logo.style.clipPath=`inset(0 ${(1-position)*100}% 0 0)`;
    rig.style.transform=`translate3d(${x}px,${y}px,0)`;
    const active=elapsed>=delay&&progress<.997;
    rig.style.opacity=progress<.97?Math.min(1,(elapsed-delay+100)/150):Math.max(0,(1-progress)/.03);
    rig.classList.toggle('spraying',active);
    const can=rig.firstElementChild;can.style.transform=`rotate(${18+Math.sin(position*Math.PI*2)*5}deg)`;
    if(active)emit(x+padding,y+padding,Math.ceil(dt*(small?1100:1700)));
    ctx.clearRect(0,0,width+padding*2,height+padding*2);
    ctx.globalCompositeOperation='screen';
    if(active){
      // A continuous, soft fan from the valve. Fine turbulent puffs break its edge.
      const px=x+padding,py=y+padding,length=small?90:120;
      const cone=ctx.createLinearGradient(px,py,px-length,py);
      cone.addColorStop(0,'rgba(235,239,229,.15)');cone.addColorStop(.18,'rgba(229,235,222,.105)');cone.addColorStop(.65,'rgba(221,231,209,.035)');cone.addColorStop(1,'rgba(215,227,200,0)');
      ctx.fillStyle=cone;ctx.filter='blur(3px)';ctx.beginPath();ctx.moveTo(px,py-1.4);ctx.quadraticCurveTo(px-length*.4,py-9,px-length,py-40);ctx.quadraticCurveTo(px-length-13,py,px-length,py+40);ctx.quadraticCurveTo(px-length*.4,py+9,px,py+1.4);ctx.closePath();ctx.fill();ctx.filter='none';
    }
    particles=particles.filter(p=>p.age<p.life);
    for(const p of particles){p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.24,dt);p.vy-=18*dt;
      const life=p.age/p.life,envelope=Math.sin(Math.min(1,life)*Math.PI),radius=p.r*(1+life*2.6);
      ctx.globalAlpha=p.alpha*envelope;
      if(p.fine){ctx.globalAlpha*=.5;ctx.fillStyle='#dce5d3';ctx.beginPath();ctx.arc(p.x,p.y,.25+p.r*.04,0,Math.PI*2);ctx.fill();}
      else ctx.drawImage(sprite,p.x-radius,p.y-radius,radius*2,radius*2);
    }
    ctx.globalAlpha=1;
    if(elapsed<duration+delay+400)requestAnimationFrame(frame);
    else {rig.style.opacity=0;logo.style.clipPath='inset(0)';ctx.clearRect(0,0,width+padding*2,height+padding*2);}
  }
  const image=rig.querySelector('img');
  const ready=image.complete?Promise.resolve():Promise.race([new Promise(resolve=>{image.onload=resolve;image.onerror=resolve;}),new Promise(resolve=>setTimeout(resolve,200))]);
  ready.then(()=>{if(intro.isConnected)requestAnimationFrame(frame);});
})();
