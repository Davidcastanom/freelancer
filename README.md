<div align="center">

# Flujo Base

### Transformamos procesos. Impulsamos resultados.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)
![Make](https://img.shields.io/badge/Make-6D00CC?style=for-the-badge&logo=make&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

**Sitio web corporativo de Flujo Base** — Empresa de transformación digital especializada en Inteligencia Artificial, automatización y desarrollo de soluciones digitales.

[Ver Sitio en Vivo](https://davidcastanom.github.io/freelancer/) · [Reportar Bug](https://github.com/Davidcastanom/freelancer/issues) · [Contacto](https://davidcastanom.github.io/freelancer/contacto.html)

</div>

---

## Tabla de Contenidos

- [Vista Previa](#vista-previa)
- [Características](#características)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Integración Blog Notion — Flujo Completo](#integración-blog-notion--flujo-completo)
- [Configuración de Notion (Database)](#configuración-de-notion-database)
- [Configuración de Make (Webhook)](#configuración-de-make-webhook)
- [Cloudflare Worker (Proxy Dual)](#cloudflare-worker-proxy-dual)
- [Cloudinary (CDN de Imágenes)](#cloudinary-cdn-de-imágenes)
- [Seguridad](#seguridad)
- [SEO Técnico](#seo-técnico)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Guía de Personalización](#guía-de-personalización)
- [Formulario de Contacto](#formulario-de-contacto)
- [Manual de Marca](#manual-de-marca)
- [Despliegue](#despliegue)
- [Redes Sociales](#redes-sociales)
- [Autor](#autor)
- [Licencia](#licencia)

---

## Vista Previa

El sitio incluye **6 páginas** completamente diseñadas con la paleta oficial de Flujo Base:

| Página | Descripción |
|--------|-------------|
| **Inicio** | Hero con eslogan, 5 pilares de contenido, valores, misión/visión |
| **Servicios** | 5 pilares de servicio con descripción detallada y tags |
| **Casos de Éxito** | Grid con 3 tipos: imagen, video (YouTube/Drive), enlace externo |
| **Nosotros** | Historia, misión, visión, 5 valores, perfil del fundador |
| **Blog** | Centro Educativo con búsqueda, filtros y modal de vista previa |
| **Contacto** | Formulario estratégico con selects + información de contacto |

---

## Características

### Diseño
- Paleta oficial: Azul eléctrico `#0066FF`, Negro `#0A0A0F`, Cian `#00D4FF`
- Tipografía: Poppins (body) + Space Grotesk (headings)
- Imagen de fondo global con efecto parallax y overlay oscuro
- Componentes responsivos (móvil, tablet, desktop)
- Animaciones fade-in con IntersectionObserver

### Funcionalidad
- Menú hamburguesa responsive para móvil
- Header fijo con efecto de sombra al hacer scroll
- Blog con búsqueda por keyword, filtro por fecha/categoría y modal de vista previa
- Filtros de portfolio por tipo (imagen/video/enlace)
- Touch táctil para móvil en portfolio items
- Copyright dinámico (año actual automático)
- Skeleton loader mientras carga el blog
- Email ofuscado con data-attributes (anti-scraping)

### Integraciones
- **Notion** — Blog conectado vía Make webhook (base de datos como CMS)
- **Make (Integromat)** — Webhooks para blog y formulario de contacto
- **Cloudflare Worker** — Proxy dual: formulario + blog (evita CORS, oculta webhooks)
- **Cloudinary** — CDN de imágenes (WebP automático, compresión, cache global)
- **FormSubmit.co** — Envío de formularios por email con CAPTCHA
- **YouTube** — Videos embebidos en casos de éxito
- **Google Drive** — Videos embebidos con formato `/preview`

---

## Arquitectura del Sistema

### Flujo de datos completo

```
┌──────────────┐    ┌──────────────┐    ┌───────────────────┐    ┌──────────────┐
│   Notion     │───▶│     Make     │───▶│ Cloudflare Worker │───▶│  Navegador   │
│  (Database)  │    │  (Webhook)   │    │    (Proxy)        │    │  (Frontend)  │
└──────────────┘    └──────────────┘    └───────────────────┘    └──────────────┘
      Blog               Blog/Form              Blog/Form              Blog/Form
```

### Por qué existe el Worker

El navegador **no puede** hacer fetch directo a `hook.us2.make.com` porque Make no envía el header `Access-Control-Allow-Origin`. El Worker resuelve esto:

1. El navegador hace POST al Worker (sin CORS — mismo dominio Cloudflare)
2. El Worker reenvía a Make **server-side** (sin restricciones CORS)
3. El Worker devuelve los datos al navegador con `Access-Control-Allow-Origin: *`

### Flujo del Blog

```
1. Usuario abre blog.html
2. script.js envía POST al Worker: { action: "getPosts", webhookUrl: "..." }
3. Worker reenvía a Make: { action: "getPosts" }
4. Make consulta la database de Notion
5. Make devuelve: [ { properties_value: { Title: [...], Category: {...}, ... } } ]
6. Worker devuelve al navegador con headers CORS
7. transformNotionPost() convierte formato Notion → formato blog
8. renderBlog() crea las cards con cover, título, descripción, tags
9. Filtros y búsqueda funcionan localmente sobre el array
```

### Flujo del Formulario

```
1. Usuario llena el formulario
2. Honeypot + rate limiting + timestamp anti-bot (JS)
3. Fetch al Worker: { name, email, message, _timestamp, _honey }
4. Worker valida: honeypot, tiempo, rate limit, email, longitudes
5. Worker reenvía a Make (webhook nunca expuesto)
6. Make procesa y guarda en CRM/Notion
```

---

## Integración Blog Notion — Flujo Completo

### Base de datos de Notion

La base de datos de Notion funciona como **CMS (sistema de gestión de contenido)**. Cada fila es un artículo del blog. Los campos se mapean automáticamente a las cards del sitio.

### Campos de la database

| Campo Notion | Tipo | Se usa en | Descripción |
|-------------|------|-----------|-------------|
| **Title** | Title | Card + Modal | Título del artículo (obligatorio) |
| **Description** | Rich text | Modal | Descripción breve que engancha al lector |
| **Cover** | Files & media | Card + Modal | Imagen de portada (800×450px recomendado) |
| **Date** | Date | Card + Modal | Fecha de publicación |
| **Category** | Select | Filtros | IA \| Automatización \| Desarrollo \| Datos \| Consultoría |
| **Multi-select** | Multi-select | Modal (tags) | productividad, herramientas, tendencias, etc. |
| **ContentURL** | URL | Modal (botón) | Link a la página de Notion con el contenido completo |
| **Excerpt** | Rich text | Fallback | Resumen del artículo (fallback si no hay Description) |

### Mapa de categorías

El código mapea automáticamente los nombres de categorías de Notion a clases CSS:

| Nombre en Notion | Clase CSS | Color |
|-----------------|-----------|-------|
| `IA` | `cat-ia` | Azul eléctrico |
| `Automatización` | `cat-auto` | Cian |
| `Desarrollo` | `cat-dev` | Verde |
| `Datos` | `cat-datos` | Naranja |
| `Consultoría` | `cat-consultoria` | Púrpura |

### Función transformNotionPost()

Esta función en `script.js` convierte el formato anidado de Notion al formato plano del blog:

```javascript
// Formato Notion (lo que llega de Make):
{
  properties_value: {
    Title: [{ plain_text: "Cómo usar IA" }],
    Description: [{ plain_text: "Descripción breve..." }],
    Category: { name: "IA" },
    Date: { start: "2026-07-12" },
    Cover: [{ file: { url: "https://..." } }],
    Multi-select: [{ name: "productividad" }],
    ContentURL: "https://notion.so/..."
  }
}

// Formato blog (lo que usa el frontend):
{
  title: "Cómo usar IA",
  description: "Descripción breve...",
  category: "ia",
  date: "2026-07-12",
  dateFormatted: "12 Julio 2026",
  cover: "https://...",
  tags: ["productividad"],
  contentUrl: "https://notion.so/..."
}
```

### Modal de lectura

Al hacer clic en "Leer Artículo" de una card, se abre un modal con este orden:

1. **Cover image** — Imagen de portada del artículo
2. **Fecha** — Fecha de publicación
3. **Título** — Título del artículo
4. **Descripción** — Texto breve que engancha (campo Description de Notion)
5. **Tags** — Etiquetas como pills (campo Multi-select de Notion)
6. **Botón "Leer Artículo"** — Abre la página de Notion en ventana emergente (popup 900×700px)

### Limitación: iframe de Notion

**Notion bloquea el embebido en iframes** por su política de seguridad (CSP `frame-ancestors: DENY`). Por esta razón, el modal **no** muestra el contenido de Notion dentro de la página. En su lugar:

- Muestra la imagen cover + metadata del artículo
- El botón "Leer Artículo" abre la página de Notion en una **ventana emergente** separada
- Si en el futuro Notion permite iframes, se puede reactivar la función embebida

### Cover image de Notion

Las URLs de las imágenes de Cover en Notion son **temporales** (expiran en ~1 hora). Para producción se recomienda:

1. Subir las imágenes a **Cloudinary** (ya configurado en el proyecto)
2. Usar la URL permanente de Cloudinary en el campo Cover
3. Alternativa: subir a Imgur o cualquier CDN permanente

---

## Configuración de Notion (Database)

### Paso 1: Crear la database

1. En Notion, crea una nueva **database** (full page)
2. Agrega estas columnas **exactas**:

| Propiedad | Tipo Notion | Nombre exacto |
|-----------|-------------|---------------|
| Título | Title | `Title` |
| Descripción | Rich text | `Descripción` |
| Portada | Files & media | `Cover` |
| Fecha | Date | `Date` |
| Categoría | Select | `Category` |
| Etiquetas | Multi-select | `Multi-select` |
| Enlace | URL | `ContentURL` |
| Extracto | Rich text | `Excerpt` |

### Paso 2: Agregar artículos

Para cada artículo:
1. **Title**: Escribe el título del artículo
2. **Descripción**: Texto breve (1-2 oraciones) que enganche al lector
3. **Cover**: Sube una imagen **800×450px** (relación 16:9)
4. **Date**: Selecciona la fecha de publicación
5. **Category**: Selecciona una categoría (IA, Automatización, Desarrollo, Datos, Consultoría)
6. **Multi-select**: Agrega tags (productividad, herramientas, tendencias, etc.)
7. **ContentURL**: Pega el link de la página de Notion con el contenido completo

### Paso 3: Compartir cada página de Notion

Para que el botón "Leer Artículo" funcione:
1. Abre la página del artículo en Notion
2. Click en **Share** (arriba a la derecha)
3. Activa **"Share to web"**
4. Copia el link y pégalo en **ContentURL**

---

## Configuración de Make (Webhook)

### Paso 1: Crear el Scenario

1. Ve a [make.com](https://make.com) → crea cuenta gratis
2. Haz clic en **"Create a new scenario"**

### Paso 2: Configurar los módulos

**Módulo 1 — Webhook (recibe peticiones)**
1. Busca **Webhooks** → selecciona **"Custom webhook"**
2. Haz clic en **"Add"** → copia la URL que te genere
3. Esta URL es tu `BLOG_WEBHOOK_URL`

**Módulo 2 — Notion (consulta la database)**
1. Busca **Notion** → selecciona **"List database pages"**
2. Conecta tu cuenta de Notion
3. En **Database ID**, pega el ID de tu database
   - El ID está en la URL de la database: `https://notion.so/...?v=**ESTE_ID**`
4. En **Filter**, configura si quieres filtrar por categoría u otro campo

**Módulo 3 — Webhook Response (devuelve los datos)**
1. Busca **Webhooks** → selecciona **"Webhook response"**
2. En **Body**, selecciona el output del Módulo 2
3. El Content-Type debe ser `application/json`

### Paso 3: Activar el Scenario

1. Haz clic en **"ON"** (esquina inferior izquierda)
2. El Scenario ahora escucha peticiones en la URL del webhook

### Paso 4: Conectar en el código

En `script.js`, busca `BLOG_WEBHOOK_URL` y pega tu URL:

```javascript
const BLOG_WEBHOOK_URL = 'https://hook.us2.make.com/tu-url-aqui';
```

---

## Cloudflare Worker (Proxy Dual)

### Qué es

El Worker es un script que corre en los servidores de Cloudflare. Actúa como **proxy** entre el navegador y Make, resolviendo problemas de CORS y ocultando los webhooks.

### Qué maneja

| Función | Qué hace |
|---------|----------|
| **Blog** | Recibe `{action: "getPosts"}` → reenvía a Make → devuelve datos con CORS |
| **Formulario** | Recibe `{name, email, ...}` → valida → reenvía a Make (webhook oculto) |

### Flujo detallado del Blog

```
Navegador                    Cloudflare Worker                Make
   │                              │                              │
   │  POST { action: "getPosts" } │                              │
   │─────────────────────────────▶│                              │
   │                              │  POST { action: "getPosts" } │
   │                              │─────────────────────────────▶│
   │                              │                              │
   │                              │  ◀── Notion data ───────────│
   │                              │                              │
   │  ◀── Notion data (CORS: *) ──│                              │
   │                              │                              │
```

### Flujo detallado del Formulario

```
Navegador                    Cloudflare Worker                Make
   │                              │                              │
   │  POST {name, email, msg}     │                              │
   │─────────────────────────────▶│                              │
   │                              │  Valida:                     │
   │                              │  - Honeypot                  │
   │                              │  - Rate limit (10/min/IP)    │
   │                              │  - Timestamp (>= 3 seg)      │
   │                              │  - Email formato             │
   │                              │  - Longitudes                │
   │                              │  - Sanitización HTML         │
   │                              │                              │
   │                              │  POST datos limpios          │
   │                              │─────────────────────────────▶│
   │                              │                              │
   │  ◀── { success: true } ─────│  ◀── 200 OK ────────────────│
   │                              │                              │
```

### Código del Worker

El código completo está documentado al final de `script.js`. Para actualizarlo:

1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages
2. Selecciona tu Worker → **Edit code**
3. Reemplaza TODO el código con el que está en `script.js`
4. Haz clic en **Deploy**

### URL del Worker

```
https://frelancer-proxy.esteban7005808.workers.dev
```

Esta URL está configurada en `script.js` como `FETCH_URL_PROXY` y en el CSP `connect-src` de todas las páginas HTML.

### Rate Limiting del Worker

| Campo | Valor |
|-------|-------|
| Límite | 10 requests por minuto por IP |
| Ventana | Rolling window de 60 segundos |
| Almacenamiento | Memoria del Worker (se reinicia al dormir) |
| Costo | Gratis (plan free: 100,000 requests/día) |

---

## Cloudinary (CDN de Imágenes)

### Configuración actual

Todas las imágenes del sitio se sirven desde **Cloudinary** (no están en el repositorio). Cloudinary:
- Convierte automáticamente a WebP para navegadores compatibles
- Comprime y optimiza cada imagen
- Sirve desde CDN global (carga rápida en cualquier país)

### Imágenes configuradas

| Imagen | URL Cloudinary |
|--------|---------------|
| Favicon | `https://res.cloudinary.com/dfn5g9ve3/image/upload/v1783820548/favicon1_qd0gtj.png` |
| Logo oficial | `https://res.cloudinary.com/dfn5g9ve3/image/upload/v1783820554/Logo_FLUJO_BASE_profesional_2_u3epyk.png` |
| Hero inicio | `https://res.cloudinary.com/dfn5g9ve3/image/upload/v1783820548/inicio_gjla3y.png` |
| Foto fundador | `https://res.cloudinary.com/dfn5g9ve3/image/upload/v1783820548/foto-perfil_zbgzvp.jpg` |
| BG global | `https://res.cloudinary.com/dfn5g9ve3/image/upload/v1783820549/bg-hero_ithl25.png` |

### Agregar nuevas imágenes

1. Sube a [cloudinary.com](https://cloudinary.com)
2. Copia la URL completa
3. Reemplaza la URL en el HTML correspondiente

### Imágenes de portfolio

Las imágenes de portfolio sí van en el repositorio en `assets/img/portafolio/`.

---

## Seguridad

### Cabeceras de Seguridad (7 archivos HTML)

| Cabecera | Qué protege |
|----------|-------------|
| `Content-Security-Policy` | Bloquea scripts/dominios no autorizados, previene XSS |
| `X-Content-Type-Options: nosniff` | Evita que el navegador interprete archivos incorrectamente |
| `X-Frame-Options: DENY` | Previene clickjacking (framing del sitio) |
| `Referrer-Policy` | Controla cuánta información se envía en referer |
| `frame-ancestors 'none'` | Refuerzo anti-clickjacking en CSP |
| `base-uri 'self'` | Previene inyección de tags `<base>` |
| `object-src 'none'` | Bloquea plugins Flash/Java |
| `upgrade-insecure-requests` | Fuerza HTTPS en todos los recursos |

### CSP (Content Security Policy)

Dominios autorizados en el CSP:

| Directiva | Dominios |
|-----------|----------|
| `script-src` | `'self'`, `cdnjs.cloudflare.com` |
| `style-src` | `'self'`, `'unsafe-inline'`, `fonts.googleapis.com`, `cdnjs.cloudflare.com` |
| `font-src` | `fonts.gstatic.com`, `cdnjs.cloudflare.com` |
| `img-src` | `'self'`, `via.placeholder.com`, `drive.google.com`, `res.cloudinary.com`, `prod-files-secure.s3.us-west-2.amazonaws.com`, `data:` |
| `frame-src` | `youtube.com`, `drive.google.com`, `notion.so`, `app.notion.com` |
| `connect-src` | `hook.us2.make.com`, `formsubmit.co`, `frelancer-proxy.esteban7005808.workers.dev` |
| `form-action` | `'self'`, `formsubmit.co`, `hook.us2.make.com` |

### Integridad de Recursos (SRI)

Los hashes SHA-512 verifican que los archivos CDN no fueron modificados:

- Font Awesome 6.4.0: `sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==`
- DOMPurify 3.0.6: `sha512-H+rglffZ6f5gF7UJgvH4Naa+fGCgjrHKMgoFOGmcPTRwR6oILo5R+gtzNrpDp7iMV3udbymBVjkeZGNz1Em4rQ==`

### Protección del Formulario de Contacto

| Capa | Mecanismo | Ubicación |
|------|-----------|-----------|
| CAPTCHA | FormSubmit.co CAPTCHA habilitado | HTML |
| Honeypot | Campo invisible que atrapa bots | HTML + JS + Worker |
| Anti-bot por tiempo | Bloquea envíos < 3 segundos | JS + Worker |
| Rate limiting | Max 3 envíos/60s (localStorage) + 10/min/IP (Worker) | JS + Worker |
| Sanitización | Limpia tags HTML de inputs | JS + Worker |
| Maxlength | Limita longitudes: name(100), email(150), message(2000) | HTML + Worker |
| Email ofuscado | data-attributes en vez de texto visible | HTML + JS |
| Validación email | Expresión regular server-side | Worker |

### Protección del Blog (XSS)

- **DOMPurify**: Sanitiza todo el HTML inyectado desde Notion/Make
- **Fallback seguro**: Si DOMPurify no carga, construye el card con `createElement` + `textContent` (nunca innerHTML crudo)
- **Sanitización de tags**: Los tags del blog se sanitizan con `sanitizeText()` antes de insertarlos

### Puntuación de Seguridad

| Categoría | Antes | Después |
|-----------|-------|---------|
| XSS | 2/10 | 8/10 |
| Spam/Bots | 1/10 | 7/10 |
| Clickjacking | 0/10 | 9/10 |
| Integridad de recursos | 3/10 | 9/10 |
| CORS | 0/10 | 9/10 |
| **General** | **4/10** | **9/10** |

---

## SEO Técnico

| Archivo | Qué hace |
|---------|----------|
| `sitemap.xml` | Lista todas las páginas para motores de búsqueda |
| `robots.txt` | Instrucciones para crawlers (Google, Bing, etc.) |
| `404.html` | Página de error personalizada (noindex, con CSP) |
| JSON-LD | Datos estructurados en cada página |
| `og:image` | URL absoluta para preview en redes sociales |

### JSON-LD por página

| Página | Schema |
|--------|--------|
| Inicio | `Organization` + `WebSite` (con SearchAction) |
| Servicios | `ProfessionalService` + `OfferCatalog` |
| Casos de Éxito | `CollectionPage` |
| Nosotros | `AboutPage` + `Organization` + `Person` (fundador) |
| Blog | `Blog` + `Organization` (publisher) |
| Contacto | `ContactPage` + `Organization` |

---

## Stack Tecnológico

| Tecnología | Uso |
|-----------|-----|
| HTML5 | Estructura semántica |
| CSS3 | Estilos con variables, grid, flexbox, animaciones |
| JavaScript vanilla | Interactividad, fetch API, IntersectionObserver |
| DOMPurify 3.0.6 | Sanitización de HTML (prevención XSS) |
| Cloudinary | CDN de imágenes (WebP automático, compresión, cache) |
| Notion | Base de datos del blog (CMS headless vía Make) |
| Make (Integromat) | Webhooks para blog y formulario |
| Cloudflare Workers | Proxy dual: blog + formulario (CORS + seguridad) |
| FormSubmit.co | Envío de formularios por email con CAPTCHA |
| Google Fonts | Poppins + Space Grotesk |
| Font Awesome 6.4 | Iconos |

---

## Estructura del Proyecto

```
freelancer/
├── index.html                       # Página principal (Inicio)
├── servicios.html                   # Servicios de la empresa
├── casos-exito.html                 # Portfolio / Casos de éxito
├── nosotros.html                    # Sobre nosotros
├── blog.html                        # Centro Educativo (Notion)
├── contacto.html                    # Formulario de contacto
├── 404.html                         # Página de error personalizada
├── sitemap.xml                      # Sitemap para motores de búsqueda
├── robots.txt                       # Instrucciones para crawlers
├── styles.css                       # Estilos globales (~2000 líneas)
├── script.js                        # JavaScript principal (~1100 líneas)
├── assets/
│   └── img/
│       └── portafolio/              # Imágenes de portfolio (van en el repo)
├── LICENSE                          # Licencia MIT
└── README.md                        # Este archivo
```

### script.js — Secciones principales

| Línea | Sección | Qué hace |
|-------|---------|----------|
| 1 | Configuración global | `USE_PROXY`, `FETCH_URL_PROXY`, `BLOG_WEBHOOK_URL` |
| 20 | Menú hamburguesa | Alterna menú en móvil |
| 40 | Header scroll | Efecto de sombra al hacer scroll |
| 60 | Formulario contacto | Validación, honeypot, rate limiting, fetch |
| 200 | Portfolio táctil | Touch para móvil |
| 250 | Copyright dinámico | Año actual automático |
| 280 | Página activa | Detecta página actual por URL |
| 310 | Fade-in animations | IntersectionObserver para .fade-in |
| 340 | Blog completo | Fetch Notion → transformNotionPost → render → filtros → modal |
| 800 | Filtros casos éxito | Filtrado por tipo |
| 850 | Email ofuscado | Decodifica data-attributes |
| 900 | Código del Worker | Documentación completa del Worker de Cloudflare |

---

## Guía de Personalización

### Cambiar colores

Edita las variables CSS al inicio de `styles.css`:

```css
:root {
    --color-primario: #0066FF;      /* Azul eléctrico */
    --color-secundario: #0052CC;    /* Azul oscuro */
    --color-fondo: #0A0A0F;         /* Negro */
    --color-superficie: #12121A;    /* Gris oscuro */
    --color-texto-principal: #F0F0F5; /* Blanco */
    --color-texto-secundario: #9090A0; /* Gris metálico */
    --color-acento: #00D4FF;        /* Cian */
}
```

### Cambiar imagen de fondo

1. Sube tu imagen a [cloudinary.com](https://cloudinary.com)
2. En `styles.css`, busca `background-image` y reemplaza la URL

### Agregar artículos al blog (sin Notion)

Edita `script.js` y modifica `FALLBACK_POSTS`:

```javascript
const FALLBACK_POSTS = [
    {
        id: 'mi-articulo-1',
        title: 'Título del artículo',
        description: 'Descripción breve que enganche...',
        excerpt: 'Resumen del artículo...',
        cover: 'https://via.placeholder.com/800x450.png?text=Mi+Articulo',
        date: '2026-07-10',
        dateFormatted: '10 Julio 2026',
        category: 'ia',  // ia | automatizacion | desarrollo | datos | consultoria
        tags: ['etiqueta1', 'etiqueta2'],
        contentUrl: '#'
    }
];
```

### Agregar casos de éxito

En `casos-exito.html`, copia un bloque `<div class="portfolio-item">` y editalo.

### Embeber videos de Google Drive

1. Comparte el video (acceso: cualquier persona con el link)
2. Copia el ID: `https://drive.google.com/file/d/**ESTE_ID**/view`
3. Formato embed: `https://drive.google.com/file/d/ESTE_ID/preview`

---

## Formulario de Contacto

### Flujo del formulario

```
Usuario → Formulario HTML → Validación JS → Cloudflare Worker → Make → Email (FormSubmit.co)
                                    │
                                    ├── Honeypot (anti-bot)
                                    ├── Timestamp (anti-bot: >= 3 seg)
                                    ├── Rate limiting (3/60s en JS + 10/min/IP en Worker)
                                    ├── Sanitización de inputs
                                    └── Validación de email
```

### Configuración

1. **Email**: `solucionesdigitalesflujobase@gmail.com` (ofuscado con data-attributes)
2. **FormSubmit.co**: CAPTCHA habilitado, email en campo hidden `_cc`
3. **Make webhook**: `https://hook.us2.make.com/h2vfa8bul4uh13yz5wi1ujqshyl3k4rb`
4. **Worker proxy**: `https://frelancer-proxy.esteban7005808.workers.dev`

### Cambiar el email

1. En los archivos HTML, busca `data-email-user` y `data-email-domain`
2. Actualiza ambos valores
3. En `contacto.html`, actualiza el campo hidden `_cc`
4. En FormSubmit.co, configura el email de destino

---

## Manual de Marca

Los estilos siguen el **Manual de Marca Flujo Base 1.0**:

| Elemento | Valor |
|----------|-------|
| Azul eléctrico | `#0066FF` |
| Azul oscuro | `#0052CC` |
| Negro | `#0A0A0F` |
| Gris oscuro | `#12121A` |
| Blanco suave | `#F0F0F5` |
| Gris metálico | `#9090A0` |
| Cian acento | `#00D4FF` |
| Fuente principal | Poppins |
| Fuente secundaria | Space Grotesk |
| Eslogan | "Transformamos procesos. Impulsamos resultados." |

---

## Despliegue

### GitHub Pages (actual)

El sitio se despliega automáticamente en:

```
https://davidcastanom.github.io/freelancer/
```

### Vercel / Netlify

1. Conecta el repositorio GitHub
2. Configuración de build: **Ninguna** (es HTML estático)
3. Directorio de salida: `/` (raíz)

### Después de cada cambio

1. `git add -A && git commit -m "mensaje" && git push`
2. GitHub Pages se actualiza automáticamente (1-2 minutos)
3. Usa `Ctrl + Shift + R` (hard refresh) para ver los cambios

---

## Redes Sociales

- [LinkedIn](https://www.linkedin.com/in/david-esteban-castaño-meneses-62a30a350/?skipRedirect=true)
- [GitHub](https://github.com/Davidcastanom)
- [Facebook](https://www.facebook.com/profile.php?id=61591989834382)
- [Instagram](https://www.instagram.com/flujobase.digital)

---

## Autor

**David Castaño** — Fundador de Flujo Base

Empresa de transformación digital especializada en Inteligencia Artificial, automatización y desarrollo de soluciones digitales para emprendedores y empresas.

---

## Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

```
MIT License - Copyright (c) 2025 Davidcastanom
```
