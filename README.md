# Píllalo Valledupar 🐾🇨🇴

**Directorio Comunitario, Visual e Interactivo del Comercio y Talento Local de Valledupar (Cesar).**

Plataforma web rápida, moderna y responsiva donde emprendedores, empresas registradas y profesionales independientes conectan directamente con sus clientes por WhatsApp, Instagram y llamadas sin intermediarios ni comisiones.

---

## 🌟 Características Principales

- **Vitrina Interactiva y Bento Grid**: Presentación visual inspirada en las mejores vitrinas digitales.
- **Conexión Directa en 1 Clic**: Enlaces directos a WhatsApp oficial, Instagram, TikTok, llamadas y Google Maps.
- **Algoritmo Solidario**:
  - Perfiles recién llegados (< 15 días) obtienen impulso de arranque prioritario.
  - El directorio rota determinísticamente para que todos los comercios reciban visibilidad justa (orden de menor a mayor contacto en 30 días, desempate diario).
- **Insignias Verificadas Diferenciadas**:
  - 🐾 **Emprendedor Verificado**: Para negocios locales de trato directo con el dueño.
  - 🏛️ **Empresa Registrada**: Para sociedades constituidas con NIT y Cámara de Comercio.
  - 👤 **Profesional Independiente**: Para servicios calificados a domicilio o presenciales.
- **Modalidades Flexibles**: Local comercial físico, cocina oculta (domicilios) y servicio virtual/a domicilio sin exponer la dirección residencial.
- **Vacantes de Empleo Local**: Bolsa de oportunidades laborales de Valledupar.
- **Mascota Oficial Asistente (Píllalo)**: Acompaña, guía y anima la experiencia del usuario con gestos y mensajes cálidos.
- **Marco Legal Completo**: 8 páginas de políticas transparentes (datos habeas data, orden solidario, términos, suscripciones y verificación).

---

## 🚀 Arquitectura Técnica

- **Frontend**: HTML5 Semántico + Tailwind CSS CDN + JavaScript Vanilla (ES6+ reactivo y ultra ligero).
- **Backend / Base de Datos**: Supabase (PostgreSQL 15 + Row Level Security + Stored Procedures / RPC).
- **Seguridad**:
  - Cero consultas `UPDATE` o `DELETE` desde el cliente.
  - Cero políticas con `true` permisivo.
  - Todas las operaciones sensibles se realizan mediante funciones RPC con validaciones estrictas (`registrar_perfil`, `crear_pqr`, `contactos_30d`, `candidatos_impulso_solidario`).

---

## 📁 Estructura del Repositorio

```text
├── index.html                 # Página principal y vitrina interactiva
├── pillalo/                   # Núcleo del asistente interactivo
│   ├── pillalo.js             # Lógica del avatar y widget flotante
│   ├── pillalo.css            # Animaciones y estilos del asistente
│   ├── adaptador-sitio.js     # Integración entre el asistente y el directorio
│   └── assets/                # Emociones, sprites y logotipos oficiales
├── legal/                     # Páginas legales obligatorias
│   ├── como-ordenamos.html
│   ├── politica-de-datos.html
│   ├── publicidad.html
│   ├── suscripciones-y-pagos.html
│   ├── terminos-y-condiciones.html
│   ├── vacantes.html
│   ├── valoraciones.html
│   └── verificacion.html
└── README.md                  # Documentación del proyecto
```

---

*Desarrollado con orgullo para impulsar el comercio vallenato en Valledupar, Cesar · 2026.*
