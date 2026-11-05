(() => {
  const P=window.Pillalo;
  P.mount({welcome:false});
  P.animate(document.querySelector('#hero-puppy'),'wave');
  document.querySelectorAll('[data-motion]').forEach(button => {
    P.animate(button.querySelector('canvas'),button.dataset.motion);
    button.addEventListener('click',() => {
      document.querySelectorAll('[data-motion]').forEach(b => b.setAttribute('aria-pressed',String(b===button)));
      play(button.dataset.event);
    });
  });
  const picker=document.querySelector('#event-picker');
  Object.entries(P.labels).forEach(([key,label]) => { const opt=document.createElement('option'); opt.value=key;opt.textContent=label;picker.append(opt); });
  function play(event) {
    picker.value=event;P.speak(event);
    document.querySelector('#event-name').textContent=P.labels[event];
    document.querySelector('#event-text').textContent=P.messages[event][1];
  }
  document.querySelector('#play-event').addEventListener('click',() => play(picker.value));
  picker.addEventListener('change',() => play(picker.value));
  document.querySelector('#next-event').addEventListener('click',() => {picker.selectedIndex=(picker.selectedIndex+1)%picker.options.length;play(picker.value);});
  document.querySelectorAll('[data-scenario]').forEach(b => b.addEventListener('click',() => play(b.dataset.scenario)));
  document.querySelector('#demo-neighborhood').addEventListener('change',() => play('neighborhood'));
  document.querySelector('#demo-budget').addEventListener('change',() => play('budget'));
  document.querySelector('#demo-search').addEventListener('keydown',e => {if(e.key==='Enter') play('search');});
  document.querySelector('#pause-all').addEventListener('click',e => {const paused=e.currentTarget.getAttribute('aria-pressed')!=='true';P.pause(paused);e.currentTarget.setAttribute('aria-pressed',String(paused));e.currentTarget.textContent=paused?'Reanudar movimientos':'Pausar movimientos';});
  document.addEventListener('pillalo:action',e => {
    if(e.detail.action==='explore') {document.querySelector('#demo-search').focus();play('directory');}
    if(e.detail.action==='register') play('register');
    if(e.detail.action==='reset-filters') {document.querySelector('#demo-search').value='';document.querySelector('#demo-neighborhood').selectedIndex=0;document.querySelector('#demo-budget').selectedIndex=0;play('directory');}
  });
  play('welcome');
})();
