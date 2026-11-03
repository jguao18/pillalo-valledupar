/* Conexiones con los controles reales del sitio Píllalo Valledupar.
   No registra negocios por su cuenta, no cambia datos, no llama a WhatsApp ni supone éxito antes de guardar. */
(() => {
  'use strict';
  if (window.__pillaloAdapter) return;
  window.__pillaloAdapter = true;

  const say = (key, details) => window.Pillalo?.speak(key, details);
  const text = el => (el.textContent || '').replace(/\s+/g, ' ').trim();

  const navKey = label => {
    if (/Registrar Negocio|Sumar mi Negocio/i.test(label)) return 'register';
    if (/Recién Llegados/i.test(label)) return 'new';
    if (/Con Trayectoria/i.test(label)) return 'established';
    if (/Vacantes/i.test(label)) return 'jobs';
    if (/Sticker.*QR|\bQR\b/i.test(label)) return 'qr';
    if (/Explorar Directorio|Volver al Directorio|\bDirectorio\b/i.test(label)) return 'directory';
    if (/Imprimir.*Sticker/i.test(label)) return 'qrPrint';
    return null;
  };

  document.addEventListener('click', e => {
    if (e.composedPath().some(n => n && n.id === 'pillalo-companion')) return;
    const control = e.target.closest('button,a');
    if (!control) return;

    // Los controles conectados directamente desde las funciones reales del sitio usan data-pillalo-direct o #categoryDock
    if (control.closest('#categoryDock')) return;
    if (control.hasAttribute('data-pillalo-direct')) return;

    const label = text(control);
    if (/Ver Todos|Mostrar Todos/i.test(label)) {
      say('directory');
      return;
    }

    const key = navKey(label);
    if (key) {
      say(key);
      return;
    }

    if (control.tagName === 'A' && control.href) {
      try {
        const u = new URL(control.href, window.location.href);
        if (/(^|\/)(wa\.me|api\.whatsapp\.com)(\/|$)/i.test(u.hostname + '/')) {
          if (/Postular/i.test(label)) say('apply');
          else say('contact');
        } else if (u.protocol === 'mailto:' || u.protocol === 'tel:') {
          say('contact');
        }
      } catch (_) {}
    }
  });

  // Ayuda contextual al enfocar los campos del formulario de registro de negocios
  const focusHelp = {
    regName: 'businessName',
    regBio: 'description',
    regAddress: 'address',
    regPhone: 'whatsapp',
    regSchedule: 'schedule'
  };
  let lastFocusId = '';
  let lastFocusTime = 0;

  document.addEventListener('focusin', e => {
    const id = e.target && e.target.id;
    const key = focusHelp[id];
    if (key) {
      const now = Date.now();
      if (id !== lastFocusId || now - lastFocusTime > 4000) {
        say(key);
        lastFocusId = id;
        lastFocusTime = now;
      }
    }
  });

  // Validación nativa fallida en el formulario de registro
  document.addEventListener('invalid', e => {
    if (e.target && e.target.closest && e.target.closest('#tab-register')) {
      say('formError');
    }
  }, true);

  // Acciones de los botones dentro del globo de Píllalo
  document.addEventListener('pillalo:action', e => {
    const action = e.detail?.action;
    if (action === 'register' && typeof window.switchTab === 'function') {
      window.switchTab('tab-register');
      say('register');
    } else if (action === 'explore' && typeof window.switchTab === 'function') {
      window.switchTab('tab-explore');
      const searchEl = document.getElementById('searchInput');
      if (searchEl) searchEl.focus();
      say('directory');
    } else if (action === 'reset-filters' && typeof window.resetAllFilters === 'function') {
      window.resetAllFilters();
    }
  });
})();
