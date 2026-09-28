/* URBAN CRUST — SHARED FX: popups, cursor glow, magnetic buttons, icon bursts */
(function(){
  // ---- popup / lightbox ----
  const ov=document.createElement('div');ov.className='pop-ov';
  ov.innerHTML='<div class="pop-card" id="popCard"><button class="pop-x" aria-label="Close"><i class="fas fa-xmark"></i></button>'+
   '<button class="pop-nav prev" aria-label="Previous"><i class="fas fa-chevron-left"></i></button><button class="pop-nav next" aria-label="Next"><i class="fas fa-chevron-right"></i></button>'+
   '<div class="pop-img"><img alt=""><span class="pop-count"></span></div>'+
   '<div class="pop-body"><span class="kick"><i class="fas fa-fire"></i><span id="popKick">Urban Crust</span></span><h3 id="popTitle"></h3><p id="popDesc"></p><div class="pop-acts" id="popActs"></div></div></div>';
  document.body.appendChild(ov);
  const img=ov.querySelector('.pop-img img'),cnt=ov.querySelector('.pop-count');
  let list=[],idx=0;
  function render(){
    const el=list[idx];if(!el)return;
    img.src=el.dataset.pop;img.alt=el.dataset.title||'';
    ov.querySelector('#popTitle').textContent=el.dataset.title||'Fresh from Urban Crust';
    ov.querySelector('#popDesc').textContent=el.dataset.desc||'Made fresh and delivered hot. Order in under two minutes.';
    ov.querySelector('#popKick').textContent=el.dataset.kick||'Urban Crust';
    const wa=el.dataset.wa||'923369226600',msg=encodeURIComponent('Hi! I saw '+(el.dataset.title||'this')+' on your website and I want to order.');
    ov.querySelector('#popActs').innerHTML='<a class="btn btn-primary shine" href="'+(el.dataset.href||'urban-menu.html')+'"><i class="fas fa-utensils"></i> View Menu</a>'+
      '<a class="btn btn-whatsapp shine" target="_blank" href="https://wa.me/'+wa+'?text='+msg+'"><i class="fab fa-whatsapp"></i> Order</a>';
    cnt.textContent=(idx+1)+' / '+list.length;
    ov.querySelectorAll('.pop-nav').forEach(b=>b.style.display=list.length>1?'':'none');
  }
  function open(el){
    const g=el.dataset.group;list=[...document.querySelectorAll('[data-pop]'+(g?'[data-group="'+g+'"]':''))].filter(e=>!e.closest('[aria-hidden="true"]')||e===el);
    idx=Math.max(0,list.indexOf(el));document.getElementById('popCard').classList.remove('promo');render();ov.classList.add('show');document.body.style.overflow='hidden';
  }
  function close(){ov.classList.remove('show');document.body.style.overflow=''}
  function step(d){idx=(idx+d+list.length)%list.length;render()}
  document.addEventListener('click',e=>{const t=e.target.closest('[data-pop]');if(t&&!e.target.closest('a,button.no-pop')){e.preventDefault();open(t)}});
  ov.addEventListener('click',e=>{if(e.target===ov||e.target.closest('.pop-x'))close();else if(e.target.closest('.prev'))step(-1);else if(e.target.closest('.next'))step(1)});
  addEventListener('keydown',e=>{if(!ov.classList.contains('show'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});
  let sx=0;ov.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
  ov.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>60)step(d<0?1:-1)});
  window.ucPopup=function(o){ // custom promo popup
    const c=document.getElementById('popCard');c.classList.add('promo');
    ov.querySelector('.pop-img').style.display='none';ov.querySelectorAll('.pop-nav').forEach(b=>b.style.display='none');
    ov.querySelector('#popKick').textContent=o.kick;ov.querySelector('#popTitle').textContent=o.title;ov.querySelector('#popDesc').textContent=o.desc;
    ov.querySelector('#popActs').innerHTML=o.actions;ov.classList.add('show');
    const restore=()=>{ov.querySelector('.pop-img').style.display='';c.classList.remove('promo');ov.removeEventListener('transitionend',chk)};
    const chk=()=>{if(!ov.classList.contains('show'))restore()};ov.addEventListener('transitionend',chk);
  };

  // ---- cursor glow ----
  if(matchMedia('(pointer:fine)').matches){
    const g=document.createElement('div');g.className='cursor-glow';document.body.appendChild(g);
    let x=innerWidth/2,y=innerHeight/2,tx=x,ty=y;
    addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY},{passive:true});
    (function loop(){x+=(tx-x)*.12;y+=(ty-y)*.12;g.style.transform='translate('+x+'px,'+y+'px)';requestAnimationFrame(loop)})();
    // magnetic buttons
    document.querySelectorAll('.btn,.fab,.cat,.nav-cta').forEach(b=>{
      b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.18)+'px '+((e.clientY-r.top-r.height/2)*.28)+'px'});
      b.addEventListener('mouseleave',()=>{b.style.translate=''});
    });
  }

  // ---- icon burst ----
  window.ucBurst=function(x,y,icons){
    icons=icons||['fa-pizza-slice','fa-burger','fa-drumstick-bite','fa-star','fa-fire','fa-ice-cream'];
    for(let i=0;i<12;i++){const s=document.createElement('i');s.className='fx-burst fas '+icons[i%icons.length];
      s.style.left=x+'px';s.style.top=y+'px';document.body.appendChild(s);
      requestAnimationFrame(()=>{s.style.transform='translate('+((Math.random()-.5)*300)+'px,'+(-70-Math.random()*220)+'px) rotate('+(Math.random()*540)+'deg) scale('+(.6+Math.random())+')';s.style.opacity=0});
      setTimeout(()=>s.remove(),1050)}
  };
  document.querySelectorAll('[data-burst]').forEach(b=>b.addEventListener('click',e=>ucBurst(e.clientX,e.clientY)));
})();
