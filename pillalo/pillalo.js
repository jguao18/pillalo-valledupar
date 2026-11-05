/* Píllalo — mascota web sin dependencias. */
(() => {
  'use strict';
  if (window.Pillalo) return;
  const script = document.currentScript;
  const base = new URL('.', script.src);
  const image = new Image();
  image.src = new URL('assets/pillalo-sprites.png?v=anatomia2', base).href;
  const images = { base: image };
  for (const [key, file] of Object.entries({ movement:'pillalo-movimientos.png', gesture:'pillalo-gestos.png' })) {
    const asset = new Image();
    asset.src = new URL('assets/' + file + '?v=anatomia2', base).href;
    asset.addEventListener('load', () => { players.forEach(p => p.last=''); schedule(); });
    asset.addEventListener('error', () => { if(widget) widget.status.textContent='Falta un dibujo de Píllalo. Revisa la carpeta assets.'; });
    images[key] = asset;
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motions = {
    idle: { row: 0, frames: [0,0,0,0,0,0,0,0,0,0,1,2,1,0], ms: 240 },
    wave: { row: 1, frames: [0,1,2,3,2,1], ms: 190 },
    sniff: { row: 2, frames: [0,1,2,1], ms: 240 },
    celebrate: { row: 3, frames: [0,1,2,3,2,1], ms: 190 },
    wag: {sheet:'movement',row:0,frames:[0,1,2,3],ms:150},
    jump: {sheet:'movement',row:1,frames:[0,1,2,3],ms:180},
    stand: {sheet:'movement',row:2,frames:[0,1,2,3,3,3],ms:220},
    walk: {sheet:'movement',row:3,frames:[0,1,2,3],ms:200},
    tilt: {sheet:'gesture',row:0,frames:[0,1,1,2,3,3],ms:270},
    point: {sheet:'gesture',row:1,frames:[0,1,1,2,2,3],ms:230},
    sit: {sheet:'gesture',row:3,frames:[0,0,0,0,1,2,3,0],ms:380},
    sitDown: {sheet:'gesture',row:2,frames:[0,1,2,3],ms:260}
  };
  const messages = {
    welcome: ['stand', '¡Hola! Soy Píllalo. Te ayudo a descubrir negocios y servicios en Valledupar. ¿Qué estás buscando?', 'Explorar negocios', 'explore'],
    returning: ['wag', '¡Qué gusto verte por aquí! ¿Qué vamos a descubrir hoy?'],
    directory: ['point', 'Aquí empieza la búsqueda. Elige una categoría o escribe el producto, negocio o servicio que necesitas.'],
    search: ['walk', '¡Voy tras la pista! Estoy revisando las opciones de tu búsqueda.'],
    results: ['wag', '¡Pillé opciones para ti! Abre sus perfiles para conocer horarios, ubicación y formas de contacto.'],
    empty: ['tilt', 'Por aquí no encontré pistas. Prueba otra palabra o amplía los filtros.', 'Ver todos', 'reset-filters'],
    category: ['sniff', '¡Vamos por esa pista! Revisa los negocios de esta categoría.'],
    food: ['sniff', '¿Un antojito? Exploremos las opciones de comida. Revisa el horario y el menú de cada negocio.'],
    clothing: ['sniff', '¡Busquemos tu próximo favorito! En cada perfil puedes consultar tallas y disponibilidad.'],
    beauty: ['wave', 'Un espacio para consentirte. Consulta los servicios y agenda directamente con el negocio.'],
    technical: ['sniff', '¡Vamos a buscar ayuda! Revisa qué servicios ofrece cada técnico y consulta su disponibilidad.'],
    professional: ['idle', 'Encuentra profesionales por su especialidad y revisa la información de su perfil.'],
    neighborhood: ['sniff', 'Afinemos la búsqueda por barrio. Así puedes explorar las opciones de esa zona de Valledupar.'],
    budget: ['sniff', 'Busquemos dentro de tu presupuesto. Confirma el precio final directamente con el negocio.'],
    new: ['wave', '¡Conozcamos a los recién llegados! Descubre los negocios que se están sumando al directorio.'],
    established: ['idle', 'Por aquí puedes explorar negocios con trayectoria en Valledupar.'],
    profile: ['sit', '¡Mira esta pista de cerca! Revisa la descripción, el horario y las formas de contactar al negocio.'],
    contact: ['wave', 'Vas a contactar directamente al negocio. Puedes contarle que lo encontraste en Píllalo.'],
    map: ['sniff', 'Revisa la dirección y las indicaciones antes de salir. ¡Que encuentres el camino!'],
    closed: ['idle', 'El perfil indica que está cerrado. Revisa su próximo horario o consulta cuándo vuelve a atender.'],
    register: ['wave', '¿Tienes un negocio o prestas un servicio? ¡Vamos a hacer que te encuentren! Completa tu perfil.'],
    businessName: ['idle', 'Escribe el nombre por el que tus clientes conocen tu negocio o servicio.'],
    description: ['sit', 'Cuenta qué ofreces y qué te hace especial. Una descripción clara ayuda a que te conozcan.'],
    address: ['sniff', 'Indica tu dirección y barrio con claridad. Así será más fácil saber dónde encontrarte.'],
    whatsapp: ['idle', 'Revisa que el número sea correcto: será una de las formas de contactar a tu negocio.'],
    schedule: ['idle', 'Agrega tus días y horas de atención para que sepan cuándo pueden visitarte o escribirte.'],
    formError: ['tilt', 'Nos falta una pista. Revisa los campos señalados y vuelve a intentarlo.'],
    registered: ['jump', '¡Tu registro se completó! Ahora revisa que los datos de tu perfil hayan quedado correctos.'],
    jobs: ['sniff', '¡Busquemos oportunidades! Revisa los requisitos de cada vacante y contacta al negocio que la publicó.'],
    apply: ['wave', 'Lee los requisitos antes de postularte. El contacto y el proceso los gestiona el negocio.'],
    qr: ['idle', 'Elige tu negocio para preparar su código QR. Quien lo escanee podrá abrir su perfil.'],
    qrPrint: ['wave', 'Antes de imprimir, revisa tus datos y prueba el QR con tu celular.'],
    qrTest: ['sniff', 'Comprueba que el QR abra el perfil del negocio correcto. ¡Una pista bien puesta ayuda a encontrarte!'],
    share: ['wave', '¿Pillaste un negocio que te gustó? Comparte su perfil para que más personas lo conozcan.'],
    error: ['idle', 'Esta pista se nos complicó. Intenta de nuevo en un momento; tus opciones pueden seguir aquí.'],
    help: ['wave', 'Estoy para acompañarte. Puedes explorar negocios, filtrar por barrio o registrar tu emprendimiento.', 'Registrar negocio', 'register']
  };
  const labels = {
    welcome:'Bienvenida', returning:'Regreso', directory:'Directorio', search:'Buscando', results:'Con resultados', empty:'Sin resultados',
    category:'Categoría', food:'Comida', clothing:'Ropa y calzado', beauty:'Belleza', technical:'Servicios técnicos', professional:'Profesionales',
    neighborhood:'Filtro por barrio', budget:'Filtro por presupuesto', new:'Recién llegados', established:'Con trayectoria', profile:'Perfil de negocio',
    contact:'Contacto por WhatsApp', map:'Mapa', closed:'Negocio cerrado', register:'Registro de negocio', businessName:'Nombre del negocio',
    description:'Descripción', address:'Dirección', whatsapp:'Número de contacto', schedule:'Horario', formError:'Revisar formulario',
    registered:'Registro confirmado', jobs:'Vacantes', apply:'Postular a vacante', qr:'Sticker QR', qrPrint:'Antes de imprimir', qrTest:'Probar QR', share:'Compartir', error:'Error', help:'Ayuda'
  };
  const players = new Set();
  let raf = 0;
  let manualPause = false;
  class Player {
    constructor(canvas, motion = 'idle') {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.canvas.width = 384; this.canvas.height = 384;
      this.motion = motion; this.started = performance.now(); this.last = '';
      players.add(this); schedule();
    }
    set(motion) {
      this.motion = motions[motion] ? motion : 'idle';
      this.started = performance.now(); this.last = ''; schedule();
    }
    draw(now) {
      const motion = motions[this.motion] || motions.idle;
      const atlas = images[motion.sheet || 'base'];
      if (!atlas.complete || !atlas.naturalWidth || !this.ctx) return;
      const stopped = reduced.matches || manualPause;
      const frame = stopped ? 0 : motion.frames[Math.floor((now-this.started)/motion.ms) % motion.frames.length];
      const signature = this.motion + frame;
      if (signature === this.last) return;
      this.last = signature;
      const w = atlas.naturalWidth / 4, h = atlas.naturalHeight / 4;
      this.ctx.clearRect(0,0,384,384);
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
      this.ctx.drawImage(atlas,frame*w,motion.row*h,w,h,0,0,384,384);
    }
    destroy() { players.delete(this); }
  }
  function schedule() {
    if (raf || document.hidden) return;
    raf = requestAnimationFrame(tick);
  }
  function tick(now) {
    raf = 0;
    players.forEach(p => p.draw(now));
    if (players.size && !reduced.matches && !manualPause) schedule();
  }
  image.addEventListener('load', () => { players.forEach(p => p.last = ''); schedule(); });
  image.addEventListener('error', () => {
    if (widget) widget.status.textContent = 'No pude cargar mi dibujo. Revisa la carpeta assets de Píllalo.';
  });
  reduced.addEventListener('change', () => { players.forEach(p => p.last = ''); schedule(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else schedule();
  });
  let widget;
  let lastWelcomeTimer;
  let settleTimer;
  function mount(options = {}) {
    if (widget) return api;
    const host = document.createElement('div');
    host.id = 'pillalo-companion';
    host.style.cssText = 'position:fixed;right:12px;bottom:calc(72px + env(safe-area-inset-bottom, 0px));z-index:1000;pointer-events:none;';
    const shadow = host.attachShadow({ mode:'open' });
    const link = document.createElement('link'); link.rel='stylesheet'; link.href = new URL('pillalo.css',base).href;
    shadow.append(link);
    const dock = document.createElement('section');
    dock.className='dock'; dock.setAttribute('aria-label','Ayuda de Píllalo');
    dock.innerHTML = `<div class="bubble" hidden><header><span>Píllalo · tu compañero local</span><button class="close" type="button" aria-label="Cerrar mensaje">×</button></header><p class="message" role="status" aria-live="polite" aria-atomic="true"></p><button type="button" class="action" hidden></button></div><div class="controls"><button class="pause" type="button" aria-label="Pausar animación" title="Pausar animación">Ⅱ</button><button class="minimize" type="button" aria-label="Minimizar a Píllalo" title="Minimizar">−</button></div><button class="character" type="button" aria-label="Pedir ayuda a Píllalo" aria-expanded="false"><canvas aria-hidden="true"></canvas><span class="tag">¿Te ayudo?</span></button><button type="button" class="restore" hidden>🐾 Píllalo</button><p class="asset-status" role="status"></p>`;
    shadow.append(dock); document.body.append(host);
    const bubble = dock.querySelector('.bubble'), character = dock.querySelector('.character');
    widget = {host, dock, bubble, character, text:dock.querySelector('.message'), action:dock.querySelector('.action'), status:dock.querySelector('.asset-status'), player:new Player(dock.querySelector('canvas')), minimized:false};
    dock.querySelector('.close').addEventListener('click', () => { hide(); character.focus(); });
    character.addEventListener('click', () => {
      if (bubble.hidden) {
        let helpData = null;
        if (typeof window.getPillaloContextualHelp === 'function') {
          try { helpData = window.getPillaloContextualHelp(); } catch (err) { console.warn('Pillalo context error:', err); }
        }
        if (!helpData) {
          helpData = {
            text: '¡Hola! 🐾 ¿Buscas algo en Valledupar? Toca aquí para ver opciones o registrar tu negocio.',
            motion: 'wave',
            action: '🔍 Explorar directorio',
            actionId: 'focus-search'
          };
        }
        speak('help', helpData);
        // Auto-cierre suave a los 9 segundos si el usuario no interactúa
        clearTimeout(window.__pillaloAutoCloseTimer);
        window.__pillaloAutoCloseTimer = setTimeout(() => hide(), 9000);
      } else {
        hide();
      }
    });
    dock.querySelector('.minimize').addEventListener('click', () => {
      hide(); widget.minimized=true; dock.classList.add('minimized'); dock.querySelector('.restore').hidden=false;
      widget.player.destroy(); dock.querySelector('.restore').focus();
      try { sessionStorage.setItem('pillalo-minimized','1'); } catch (_) {}
    });
    dock.querySelector('.restore').addEventListener('click', () => {
      widget.minimized=false; dock.classList.remove('minimized'); dock.querySelector('.restore').hidden=true;
      players.add(widget.player); schedule(); speak('help'); character.focus();
      try { sessionStorage.removeItem('pillalo-minimized'); } catch (_) {}
    });
    dock.querySelector('.pause').addEventListener('click', e => {
      pause(!manualPause); e.currentTarget.textContent=manualPause?'▶':'Ⅱ';
      e.currentTarget.setAttribute('aria-label',manualPause?'Reanudar animación':'Pausar animación');
      e.currentTarget.title=manualPause?'Reanudar animación':'Pausar animación';
    });
    dock.addEventListener('keydown', e => { if(e.key==='Escape') { hide(); character.focus(); } });
    try {
      if(sessionStorage.getItem('pillalo-minimized')==='1') {
        widget.minimized=true; dock.classList.add('minimized'); dock.querySelector('.restore').hidden=false; widget.player.destroy();
      }
    } catch (_) {}
    if (false && options.welcome !== false) { // Desactivado popup automático para no invadir la pantalla
      let seen=false; try { seen=sessionStorage.getItem('pillalo-welcome')==='1'; } catch (_) {}
      if(!seen && !widget.minimized) {
        lastWelcomeTimer=setTimeout(() => {
          speak('welcome'); try {sessionStorage.setItem('pillalo-welcome','1');} catch (_) {}
        },1200);
      }
    }
    return api;
  }
  function hide() {
    if (!widget) return;
    clearTimeout(settleTimer);
    widget.bubble.hidden=true; widget.character.setAttribute('aria-expanded','false'); widget.player.set('sit');
  }
  function speak(event, details = {}) {
    if (!messages[event]) return false;
    if (!widget) mount({welcome:false});
    clearTimeout(lastWelcomeTimer);
    if(widget.minimized) return false;
    const item = messages[event];
    const motion = motions[details.motion] ? details.motion : item[0];
    clearTimeout(settleTimer);
    widget.player.set(motion); widget.text.textContent=details.text || item[1];
    // Las acciones llamativas se reproducen brevemente y luego espera sentado.
    const duration = {jump:1440,stand:2640,wave:2280,celebrate:2280,point:2760,tilt:3240,wag:2400,sitDown:1040}[motion];
    if(duration) settleTimer=setTimeout(() => { if(widget && !widget.minimized) widget.player.set('sit'); },duration);
    widget.bubble.hidden=false; widget.character.setAttribute('aria-expanded','true');
    const actionLabel = details.action !== undefined ? details.action : (item[2] || '');
    const actionId = details.actionId || item[3] || '';
    widget.action.hidden = !actionLabel;
    widget.action.textContent = actionLabel;
    widget.action.onclick = () => {
      if (typeof details.onAction === 'function') {
        details.onAction();
      } else {
        document.dispatchEvent(new CustomEvent('pillalo:action', { detail: { action: actionId, details } }));
      }
    };
    // El mensaje permanece hasta cerrarlo para que se pueda leer con calma.
    document.dispatchEvent(new CustomEvent('pillalo:shown',{detail:{event,motion}}));
    return true;
  }
  function pause(value=true) {
    manualPause=Boolean(value);
    players.forEach(p => p.last=''); schedule();
  }
  const api = {
    setMotion(motion) { if(widget && widget.player) widget.player.set(motion); },
    mount, speak, hide, pause, Player, messages, labels,
    animate(canvas,motion='idle') { return new Player(canvas,motion); },
    destroy() {
      clearTimeout(lastWelcomeTimer); clearTimeout(settleTimer);
      if(widget) { widget.player.destroy(); widget.host.remove(); widget=null; }
    }
  };
  window.Pillalo=api;
  document.addEventListener('pillalo:event',e => { if(e.detail) speak(e.detail.name,e.detail); });
  if(script.dataset.auto !== 'false') {
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',() => mount(),{once:true});
    else mount();
  }
})();
