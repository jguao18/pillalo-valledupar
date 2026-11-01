-- ============================================================================
-- ESTRUCTURA DE BASE DE DATOS: PÍLLALO VALLEDUPAR (PostgreSQL / Supabase)
-- Proyecto Activo en Supabase: ehcmmhxkkdncrsjtujhf
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.emprendimientos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    tipo_registro VARCHAR(30) NOT NULL DEFAULT 'Emprendimiento',
    categoria VARCHAR(50) NOT NULL,
    subcategoria VARCHAR(80),
    eslogan VARCHAR(140),
    descripcion TEXT,
    foto_portada_url TEXT,
    logo_url TEXT,
    icono_emoji VARCHAR(10) DEFAULT '🏪',
    etiqueta_rango_precio VARCHAR(120) NOT NULL,
    precio_minimo INTEGER NOT NULL DEFAULT 0,
    precio_maximo INTEGER NOT NULL DEFAULT 0,
    categoria_presupuesto VARCHAR(20) NOT NULL DEFAULT 'economico',
    ciudad VARCHAR(60) NOT NULL DEFAULT 'Valledupar',
    barrio VARCHAR(80) NOT NULL,
    direccion VARCHAR(160) NOT NULL,
    coordenadas_maps_url TEXT,
    horario_texto VARCHAR(100) NOT NULL,
    abierto_ahora BOOLEAN DEFAULT TRUE,
    whatsapp VARCHAR(25) NOT NULL,
    telefono_llamada VARCHAR(25),
    instagram_usuario VARCHAR(60),
    tiktok_usuario VARCHAR(60),
    correo_electronico VARCHAR(120),
    es_nuevo BOOLEAN DEFAULT TRUE,
    destacado_publicidad BOOLEAN DEFAULT FALSE,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    plan_actual VARCHAR(30) DEFAULT 'prueba_gratis',
    verificado BOOLEAN DEFAULT TRUE,
    vistas_perfil INTEGER DEFAULT 0,
    clics_whatsapp INTEGER DEFAULT 0,
    clics_instagram INTEGER DEFAULT 0,
    clics_tiktok INTEGER DEFAULT 0,
    clics_maps INTEGER DEFAULT 0,
    clics_llamada INTEGER DEFAULT 0,
    total_clics_recibidos INTEGER DEFAULT 0,
    calificacion_promedio NUMERIC(3,2) DEFAULT 5.00,
    total_valoraciones INTEGER DEFAULT 1,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.valoraciones_rapidas (
    id SERIAL PRIMARY KEY,
    emprendimiento_id INTEGER REFERENCES public.emprendimientos(id) ON DELETE CASCADE,
    nombre_negocio VARCHAR(120),
    canal_tocado VARCHAR(30) NOT NULL,
    estrellas INTEGER NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
    etiqueta_opinion VARCHAR(60) DEFAULT 'Calificación rápida',
    fecha_valoracion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.registro_clics (
    id SERIAL PRIMARY KEY,
    emprendimiento_id INTEGER REFERENCES public.emprendimientos(id) ON DELETE CASCADE,
    nombre_negocio VARCHAR(120),
    canal VARCHAR(40) NOT NULL,
    dispositivo VARCHAR(30) DEFAULT 'Web/Móvil',
    fecha_clic TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.vacantes (
    id SERIAL PRIMARY KEY,
    emprendimiento_id INTEGER REFERENCES public.emprendimientos(id) ON DELETE SET NULL,
    empresa_nombre VARCHAR(120) NOT NULL,
    cargo_titulo VARCHAR(120) NOT NULL,
    modalidad_horario VARCHAR(100) NOT NULL,
    barrio_ubicacion VARCHAR(80) NOT NULL,
    salario_ofrecido VARCHAR(100) NOT NULL,
    requisitos_etiquetas TEXT,
    whatsapp_postulacion VARCHAR(25) NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    fecha_publicacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.espacios_publicitarios (
    id SERIAL PRIMARY KEY,
    titulo_campana VARCHAR(140) NOT NULL,
    anunciante VARCHAR(120) NOT NULL,
    tipo_espacio VARCHAR(50) NOT NULL DEFAULT 'Impulso Solidario Gratis',
    etiqueta_badge VARCHAR(60) DEFAULT '🌟 DESTACADO DE LA SEMANA',
    descripcion_corta TEXT,
    texto_boton VARCHAR(50) DEFAULT 'Contactar por WhatsApp',
    whatsapp_destino VARCHAR(25) NOT NULL,
    valor_cobrado INTEGER DEFAULT 0,
    clics_anuncio INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
