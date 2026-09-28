// menu page extras: seamless reel + burst on add-to-cart
(function(){document.querySelectorAll('.reel-track').forEach(t=>{[...t.children].forEach(c=>{const k=c.cloneNode(true);k.setAttribute('aria-hidden','true');t.appendChild(k)})});
document.addEventListener('click',e=>{if(e.target.closest('.add-btn,.add-to-cart,[onclick*="addToCart"]')&&window.ucBurst)ucBurst(e.clientX,e.clientY)});})();
