/* Conexiones con los controles reales del sitio Píllalo Valledupar.
   No registra negocios por su cuenta, no cambia datos, no llama a WhatsApp ni supone éxito antes de guardar. */
(() => {
  'use strict';
  if (window.__pillaloAdapter) return;
  window.__pillaloAdapter = true;

  // En modo discreto, las navegaciones animan la mascota sutilmente sin abrir bocadillos molestos
  const say = (key, details) => {
    // Si es error de formulario, sí mostrar mensaje de ayuda
    if (key === 'formError') {
      window.Pillalo?.speak(key, details);
    } else {
      window.Pillalo?.setMotion?.('sniff');
    }
  };
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

  // =========================================================================
  // ASISTENTE INTELIGENTE CONTEXTUAL (Píllalo sabe dónde estás y qué buscas)
  // =========================================================================
  window.getPillaloContextualHelp = function() {
    // 1. Modales prioritarios (detectar ventanas emergentes antes que el fondo)
    // Modal: Entrar a mi Perfil de Negocio
    const ownerLogin = document.getElementById('ownerLoginModal');
    if (ownerLogin && !ownerLogin.classList.contains('hidden') && ownerLogin.style.display !== 'none') {
      return {
        motion: 'stand',
        text: 'Estás en el ingreso a tu Perfil de Negocio 🔐 Escribe tu correo o celular registrado y contraseña para gestionar tu emprendimiento.',
        action: '🔑 Escribir credenciales',
        actionId: 'focus-login-input'
      };
    }

    // Modal: Acceso Privado Administradores PIN
    const ownerPin = document.getElementById('ownerPinModal');
    if (ownerPin && !ownerPin.classList.contains('hidden') && ownerPin.style.display !== 'none') {
      return {
        motion: 'stand',
        text: 'Acceso privado de administración 🔐 Ingresa la clave maestra para gestionar la plataforma.',
        action: '🔑 Ingresar clave',
        actionId: 'focus-pin-input'
      };
    }

    // Modal: Editar Canales y Modalidad
    const editChannels = document.getElementById('modalEditBizChannels');
    if (editChannels && !editChannels.classList.contains('hidden') && editChannels.style.display !== 'none') {
      return {
        motion: 'point',
        text: 'Estás configurando los canales de atención de tu negocio ⚙️ Actualiza tus números de WhatsApp, redes o llamadas.',
        action: 'Cerrar ventana',
        actionId: 'close-modal'
      };
    }

    const imageLightbox = document.getElementById('imageLightboxModal');
    if (imageLightbox && imageLightbox.style.display !== 'none' && !imageLightbox.classList.contains('hidden')) {
      return {
        motion: 'idle',
        text: 'Estás viendo la galería de fotos en pantalla completa 📸 Toca la ✕ para regresar.',
        action: 'Cerrar visor',
        actionId: 'close-lightbox'
      };
    }

    const certModal = document.getElementById('certificateModal');
    if (certModal && certModal.style.display !== 'none' && !certModal.classList.contains('hidden')) {
      return {
        motion: 'celebrate',
        text: '¡Aquí tienes el Certificado Oficial de Registro con código QR! 📜 Puedes imprimirlo o guardarlo.',
        action: 'Cerrar certificado',
        actionId: 'close-modal'
      };
    }

    const shareModal = document.getElementById('shareBizModal');
    if (shareModal && shareModal.style.display !== 'none' && !shareModal.classList.contains('hidden')) {
      return {
        motion: 'wave',
        text: '¡Comparte este emprendimiento! 📢 Puedes enviarlo por WhatsApp o copiar el enlace para apoyarlo.',
        action: 'Cerrar ventana',
        actionId: 'close-modal'
      };
    }

    // 2. Determinar la sección / pestaña activa
    const tabIds = ['tab-company-profile', 'tab-register', 'tab-jobs', 'tab-nuevos', 'tab-certificate', 'tab-my-biz', 'tab-analytics', 'tab-explore', 'tab-welcome'];
    let activeTab = 'tab-explore';
    for (const tid of tabIds) {
      const el = document.getElementById(tid);
      if (el && !el.classList.contains('hidden')) {
        activeTab = tid;
        break;
      }
    }

    // Pestaña: Perfil de un negocio específico
    if (activeTab === 'tab-company-profile') {
      const nameEl = document.querySelector('#companyProfileContainer h1, #companyProfileContainer h2');
      const bizName = nameEl ? nameEl.textContent.trim() : 'este negocio';
      return {
        motion: 'wag',
        text: `Estás viendo el perfil de "${bizName}" 📍 Puedes consultar sus horarios, ver su vitrina de fotos o chatear directo al WhatsApp.`,
        action: '💬 Escribir al WhatsApp',
        actionId: 'contact-biz-wa'
      };
    }

    // Pestaña: Registro de negocio
    if (activeTab === 'tab-register') {
      return {
        motion: 'stand',
        text: '¡Estás registrando tu negocio! 📝 Llena el nombre, categoría y WhatsApp. Recuerda activar la Vitrina Visual para subir hasta 4 fotos y atraer más clientes.',
        action: '📝 Ir al formulario',
        actionId: 'focus-register'
      };
    }

    // Pestaña: Vacantes y Empleos
    if (activeTab === 'tab-jobs') {
      return {
        motion: 'sniff',
        text: 'Estás en Vacantes y Empleos 💼 ¿Buscas trabajo en Valledupar? Explora las ofertas laborales y postúlate directo por WhatsApp.',
        action: '💼 Ver vacantes',
        actionId: 'scroll-jobs'
      };
    }

    // Pestaña: Recién Llegados / Novedades
    if (activeTab === 'tab-nuevos') {
      return {
        motion: 'wave',
        text: '¡Aquí están los nuevos emprendimientos de Valledupar! 🌱 Apoya a los recién llegados y conoce sus productos y promociones.',
        action: '🌱 Ver novedades',
        actionId: 'scroll-nuevos'
      };
    }

    // Pestaña: Certificados
    if (activeTab === 'tab-certificate') {
      return {
        motion: 'point',
        text: 'Estás en Certificados Oficiales 📜 Consulta y descarga el certificado de registro emitido por Píllalo para cualquier negocio.',
        action: '📜 Consultar certificado',
        actionId: 'focus-cert'
      };
    }

    // Pestaña: Mi Negocio
    if (activeTab === 'tab-my-biz') {
      return {
        motion: 'tilt',
        text: 'Este es tu panel de Mi Negocio 🏪 Administra tus datos, revisa tus visitas y descarga tu sticker con código QR para tu local.',
        action: '📲 Ver mi sticker QR',
        actionId: 'scroll-my-biz'
      };
    }

    // Pestaña: Directorio (tab-explore)
    if (activeTab === 'tab-explore') {
      const catSelect = document.getElementById('categoryFilterSelect');
      const subSelect = document.getElementById('subCategoryFilterSelect');
      const searchInput = document.getElementById('searchInput');

      const catVal = catSelect?.value || 'all';
      const subVal = subSelect?.value || 'all';
      const query = searchInput?.value?.trim() || '';

      // Obtener texto limpio de la categoría
      let catText = '';
      if (catVal !== 'all' && catSelect?.selectedOptions?.length) {
        catText = catSelect.selectedOptions[0].text.replace(/^[^\wáéíóúÁÉÍÓÚñÑ]+/, '').trim();
      }

      // Obtener texto limpio de la subcategoría
      let subText = '';
      if (subVal !== 'all' && subSelect?.selectedOptions?.length) {
        subText = subSelect.selectedOptions[0].text.replace(/^[^\wáéíóúÁÉÍÓÚñÑ]+/, '').trim();
      }

      // Caso 1: Si hay texto en el buscador
      if (query) {
        return {
          motion: 'sniff',
          text: `Estás buscando "${query}" en Valledupar 🔍 Toca cualquier negocio para ver su WhatsApp, fotos y ubicación.`,
          action: '🔍 Afinar búsqueda',
          actionId: 'focus-search'
        };
      }

      // Caso 2: Si hay subcategoría (especialidad) seleccionada
      if (catVal !== 'all' && subVal !== 'all') {
        const subShort = subText.split('/')[0].split(',')[0].trim();
        return {
          motion: 'point',
          text: `Estás explorando ${subShort} en ${catText} 🎯 ¿Buscas un negocio o taller específico? Dime qué necesitas o escribe arriba.`,
          action: `🔍 Buscar en ${subShort}`,
          actionId: 'focus-search'
        };
      }

      // Caso 3: Categoría seleccionada (ej. Industrial, Gastronomía, Automotriz, etc.)
      if (catVal !== 'all') {
        const catShort = catText.split(',')[0].trim();

        // A) Industria, Talleres, Fábricas, Servicios Técnicos
        if (/industrial|fábrica|técnico|reparaci|herramienta|taller|oficio/i.test(catVal + ' ' + catText)) {
          return {
            motion: 'point',
            text: `Estás en ${catText} 🏭 ¿Buscas algún taller, maquinaria, proveedor o servicio técnico en Valledupar? Escribe aquí para buscar.`,
            action: `🔍 Buscar en ${catShort}`,
            actionId: 'focus-search'
          };
        }
        // B) Gastronomía y Alimentos
        if (/gastronom|alimento|comida|restaurante|café/i.test(catVal + ' ' + catText)) {
          return {
            motion: 'sniff',
            text: `Estás en ${catText} 🍽️ ¿Un antojito en Valledupar? Busca por restaurantes, platos o filtra por especialidad arriba.`,
            action: `🔍 Buscar en ${catShort}`,
            actionId: 'focus-search'
          };
        }
        // C) Automotriz y Vehículos
        if (/automotriz|vehículo|carro|moto|repuesto|cda/i.test(catVal + ' ' + catText)) {
          return {
            motion: 'point',
            text: `Estás en el sector Automotriz 🚗 ¿Buscas talleres, repuestos, lavaderos o CDA en Valledupar? Escribe o filtra arriba.`,
            action: `🔍 Buscar en Automotriz`,
            actionId: 'focus-search'
          };
        }
        // D) Inmobiliaria y Construcción
        if (/inmobiliaria|construcci|arriendo/i.test(catVal + ' ' + catText)) {
          return {
            motion: 'point',
            text: `Estás en Inmobiliaria y Construcción 🏢 ¿Buscas arriendos, contratistas, ferreterías o materiales en la ciudad?`,
            action: `🔍 Buscar en Construcción`,
            actionId: 'focus-search'
          };
        }
        // E) Salud y Bienestar
        if (/salud|medicina|bienestar/i.test(catVal + ' ' + catText)) {
          return {
            motion: 'wave',
            text: `Estás en Salud y Bienestar 🩺 ¿Buscas clínicas, especialistas, odontología, ópticas o droguerías en Valledupar?`,
            action: `🔍 Buscar en Salud`,
            actionId: 'focus-search'
          };
        }
        // F) Belleza y Cuidado Personal
        if (/belleza|barber|estética|spa|uña/i.test(catVal + ' ' + catText)) {
          return {
            motion: 'wave',
            text: `Estás en Belleza y Cuidado Personal 💅 ¿Buscas barberías, peluquerías, spas o estética? Encuentra las mejores opciones.`,
            action: `🔍 Buscar en Belleza`,
            actionId: 'focus-search'
          };
        }
        // G) Agro y Campo
        if (/agro|ganader|campo/i.test(catVal + ' ' + catText)) {
          return {
            motion: 'sniff',
            text: `Estás en Agro, Ganadería y Campo 🌾 ¿Buscas insumos agrícolas, veterinarias, maquinaria o asesoría técnica?`,
            action: `🔍 Buscar en Agro`,
            actionId: 'focus-search'
          };
        }

        // H) Cualquier otra de las 23 categorías
        return {
          motion: 'point',
          text: `Estás explorando ${catText} ✨ ¿Buscas algún negocio, servicio o marca? Puedes buscarlo por nombre o barrio.`,
          action: `🔍 Buscar en ${catShort}`,
          actionId: 'focus-search'
        };
      }

      // Caso 4: Directorio general sin filtros
      return {
        motion: 'wave',
        text: '¡Estás en el Directorio de Valledupar! 🐾 ¿Buscas algún negocio, servicio o barrio? Explora las 23 categorías o escribe lo que necesitas arriba.',
        action: '🔍 Buscar un negocio',
        actionId: 'focus-search'
      };
    }

    // Fallback
    return {
      motion: 'wave',
      text: '¡Hola! 🐾 ¿Buscas algo en Valledupar o quieres registrar tu negocio? Dime en qué te ayudo.',
      action: '🔍 Explorar directorio',
      actionId: 'focus-search'
    };
  };

  // Acciones de los botones dentro del globo de Píllalo
  document.addEventListener('pillalo:action', e => {
    const action = e.detail?.action;
    if (action === 'focus-search') {
      if (typeof window.switchTab === 'function') window.switchTab('tab-explore');
      const searchEl = document.getElementById('searchInput');
      if (searchEl) {
        searchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => searchEl.focus(), 300);
      }
      window.Pillalo?.speak('search', {
        text: '¡Escribe aquí el nombre, producto o barrio que necesitas! 🐾',
        motion: 'sniff',
        action: ''
      });
      setTimeout(() => window.Pillalo?.hide(), 4000);
    } else if (action === 'focus-login-input') {
      const userInp = document.getElementById('loginUser');
      if (userInp) {
        userInp.focus();
        window.Pillalo?.speak('welcome', {
          text: '¡Ingresa tu correo o teléfono para acceder a tu perfil! 🔑',
          motion: 'sniff',
          action: ''
        });
        setTimeout(() => window.Pillalo?.hide(), 4000);
      }
    } else if (action === 'focus-pin-input') {
      const pinInp = document.getElementById('ownerPinInput');
      if (pinInp) {
        pinInp.focus();
        window.Pillalo?.speak('welcome', {
          text: '¡Escribe aquí tu clave de administrador! 🔐',
          motion: 'sniff',
          action: ''
        });
        setTimeout(() => window.Pillalo?.hide(), 4000);
      }
    } else if (action === 'focus-register' || action === 'register') {
      if (typeof window.switchTab === 'function') window.switchTab('tab-register');
      const regInput = document.getElementById('regName') || document.getElementById('tab-register');
      if (regInput) {
        regInput.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => regInput.focus?.(), 300);
      }
      window.Pillalo?.speak('register', {
        text: '¡Empieza escribiendo el nombre de tu emprendimiento! 📝',
        motion: 'wave',
        action: ''
      });
      setTimeout(() => window.Pillalo?.hide(), 4000);
    } else if (action === 'contact-biz-wa') {
      const waBtn = document.querySelector('#companyProfileContainer a[href*="wa.me"], #companyProfileContainer a[href*="whatsapp"]');
      if (waBtn) waBtn.click();
      window.Pillalo?.hide();
    } else if (action === 'close-lightbox') {
      if (typeof window.closeImageLightbox === 'function') window.closeImageLightbox();
      window.Pillalo?.hide();
    } else if (action === 'close-modal') {
      ['certificateModal', 'shareBizModal', 'modalEditBizChannels'].forEach(id => {
        const m = document.getElementById(id);
        if (m) m.classList.add('hidden');
      });
      window.Pillalo?.hide();
    } else if (action === 'scroll-jobs') {
      if (typeof window.switchTab === 'function') window.switchTab('tab-jobs');
      const jobs = document.getElementById('vacanciesContainer') || document.getElementById('tab-jobs');
      if (jobs) jobs.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.Pillalo?.hide();
    } else if (action === 'scroll-nuevos') {
      if (typeof window.switchTab === 'function') window.switchTab('tab-nuevos');
      const n = document.getElementById('nuevosContainer') || document.getElementById('tab-nuevos');
      if (n) n.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.Pillalo?.hide();
    } else if (action === 'scroll-my-biz') {
      if (typeof window.switchTab === 'function') window.switchTab('tab-my-biz');
      const b = document.getElementById('tab-my-biz');
      if (b) b.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.Pillalo?.hide();
    } else if (action === 'focus-cert') {
      if (typeof window.switchTab === 'function') window.switchTab('tab-certificate');
      const cert = document.getElementById('certInput') || document.getElementById('tab-certificate');
      if (cert) {
        cert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => cert.focus?.(), 300);
      }
      window.Pillalo?.hide();
    } else if (action === 'explore' && typeof window.switchTab === 'function') {
      window.switchTab('tab-explore');
      const searchEl = document.getElementById('searchInput');
      if (searchEl) searchEl.focus();
    } else if (action === 'reset-filters' && typeof window.resetAllFilters === 'function') {
      window.resetAllFilters();
      window.Pillalo?.hide();
    }
  });
})();
