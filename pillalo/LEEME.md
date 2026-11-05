# Píllalo en movimiento

Primera versión animada para el directorio de Valledupar. Conserva el perrito aprobado de la opción 2: pelaje blanco, orejas café, manchita alrededor del ojo, gorra verde y mochila amarilla.

## Para verlo sin programar

1. Abre `index.html` con Chrome o Edge. Funciona sin instalar nada y sin internet.
2. Toca los cuatro movimientos o selecciona uno de los 36 ejemplos.
3. Mira la mascota de la esquina. Puedes cerrar su mensaje, pausar el movimiento o minimizarla. Si la minimizas, pulsa «Píllalo» para recuperarla.
4. Copia el contenido de `PARA-GEMINI.txt` en Antigravity y comparte esta carpeta completa.

No se ha modificado la página publicada. La demostración no registra negocios, consulta datos reales ni envía mensajes.

## Qué contiene

- `index.html` y `demo.js`: demostración local interactiva.
- `pillalo.js`: reproductor de las cuatro animaciones, 36 mensajes y mascota flotante.
- `pillalo.css`: apariencia de la mascota y el globo, aislada en Shadow DOM.
- `adaptador-sitio.js`: conexiones iniciales con controles observados en tu página.
- `assets/pillalo-sprites.png`: dibujo con 16 fotogramas, cuadrícula de 4 × 4, transparencia real, 1254 × 1254 píxeles.
- `PARA-GEMINI.txt`: encargo listo para copiar.
- `PROMPTS.txt`: procedencia y prompt del recurso visual.

Esta entrega es una animación web de fotogramas, no un video ni un GIF. Los cuatro movimientos funcionan en el navegador y no necesitan servicios de pago ni inteligencia artificial durante su reproducción. Es una primera versión de cuatro fotogramas por acción: el movimiento es sencillo y puede pulirse con más cuadros en una siguiente versión. No contiene narración ni sincronización de boca.

## Lo que observé en tu sitio

Referencia: https://jguao18.github.io/pillalo-valledupar/

Directorio visual, categorías de negocios, búsqueda, filtros de presupuesto y barrio, recién llegados, negocios con trayectoria, perfiles, vacantes, registro de negocios y generación de stickers QR. El recorrido de registro observado es para negocios y profesionales, por eso los mensajes no suponen que exista registro de consumidores. Tampoco se promete GPS, distancias exactas, empleo garantizado ni registro gratuito.

## Instalación en una página HTML

Copia `pillalo.js`, `pillalo.css`, `adaptador-sitio.js` y la carpeta `assets` dentro de una carpeta llamada `pillalo` al lado del HTML principal de tu sitio. Conserva la estructura.

Antes de cerrar `</body>`:

```html
<script src="./pillalo/pillalo.js" defer></script>
<script src="./pillalo/adaptador-sitio.js" defer></script>
```

Las rutas son relativas para funcionar también bajo `/pillalo-valledupar/` en GitHub Pages. `pillalo.js` resuelve sus recursos a partir de su propia ubicación. No requiere bibliotecas, claves API ni compilación. Debe cargarse como script clásico (no con `type="module"` ni mediante `import`). Si usas React, Vue o Vite, Gemini debe colocar la carpeta en `public` y cargar el script clásico respetando la ruta base del despliegue.

## Conectar las situaciones reales

El adaptador ya orienta al pulsar Directorio, Registrar Negocio, Recién Llegados, Vacantes, Sticker QR, categorías y los filtros con los identificadores observados. No intercepta formularios ni realiza cambios de datos. Necesita verificarse en la copia local del sitio: no se ha instalado ni probado contra su código fuente completo.

Gemini debe añadir estas llamadas dentro de la lógica existente, en el momento real correspondiente:

```js
// Cuando realmente se inicia una consulta asíncrona:
window.Pillalo?.speak('search');

// Después de obtener los resultados reales, sin inventarlos:
window.Pillalo?.speak(resultados.length ? 'results' : 'empty');

// Solo después de que el guardado del registro haya terminado con éxito:
window.Pillalo?.speak('registered');

// Si falla la validación o el guardado:
window.Pillalo?.speak('formError');
window.Pillalo?.speak('error');
```

El nombre `resultados` es un ejemplo; Gemini debe usar la variable real del proyecto. No mostrar «registered» al hacer clic en enviar si aún no se ha guardado.

También se puede usar un evento sin depender directamente del objeto global:

```js
document.dispatchEvent(new CustomEvent('pillalo:event', {
  detail: { name: 'profile' }
}));
```

Personalización opcional, siempre con texto plano:

```js
window.Pillalo?.speak('results', {
  text: '¡Pillé 3 opciones en Los Cortijos! Revisa sus perfiles.'
});
```

Ese número y barrio deben proceder de los filtros y resultados reales.

## Catálogo de 36 situaciones

| Clave | Momento |
|---|---|
| welcome | Primera bienvenida |
| returning | Regreso, si el sitio puede identificarlo sin inventarlo |
| directory | Directorio |
| search | Búsqueda en curso / orientación al buscar |
| results | Resultados reales |
| empty | Sin coincidencias reales |
| category | Categoría general |
| food | Comida |
| clothing | Ropa y calzado |
| beauty | Belleza |
| technical | Servicios técnicos |
| professional | Profesionales |
| neighborhood | Filtrar por barrio |
| budget | Filtrar por presupuesto |
| new | Recién llegados |
| established | Negocios con trayectoria |
| profile | Perfil del negocio |
| contact | Contacto directo |
| map | Consultar dirección |
| closed | Negocio cerrado, solo si el estado es real |
| register | Invitación a registrar un negocio |
| businessName | Ayuda con el nombre |
| description | Ayuda con la descripción |
| address | Ayuda con dirección y barrio |
| whatsapp | Ayuda con el teléfono |
| schedule | Ayuda con el horario |
| formError | Revisar campos |
| registered | Registro confirmado |
| jobs | Vacantes |
| apply | Antes de contactar por una vacante |
| qr | Preparar QR |
| qrPrint | Antes de imprimir |
| qrTest | Probar QR |
| share | Compartir perfil |
| error | Error real |
| help | Ayuda general |

Los textos exactos pueden probarse en el selector de la demostración y editarse en el objeto `messages` de `pillalo.js`.

## Comportamiento y cuidado de la experiencia

- Sin sonido automático y sin bloquear la navegación.
- Cierre del mensaje con botón o Escape; acceso por teclado.
- Pausa y minimización. Recuerda la minimización solo durante la sesión del navegador.
- Bienvenida automática como máximo una vez por sesión.
- Respeta la preferencia del sistema de reducir movimiento y detiene la reproducción en pestañas ocultas.
- Los mensajes se anuncian de forma discreta a lectores de pantalla; el dibujo decorativo no se repite en su lectura.
- Se oculta al imprimir. No debe aparecer en el sticker QR.
- En móvil debe verificarse que no tape botones, formularios, menús o el teclado. Si la página ya usa una barra fija inferior, ajustar la posición inferior del contenedor.
- No incluye chat inteligente, voz, geolocalización ni acceso a datos privados.

## Para imprimir

Este paquete es para movimiento en la web. Para impresión usa las láminas originales de ángulos y emociones; para gran formato conviene preparar una versión vectorial del diseño elegido.
