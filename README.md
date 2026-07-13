<div align="center">

# Flujo Base

### Transformamos procesos. Impulsamos resultados.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)
![Make](https://img.shields.io/badge/Make-6D00CC?style=for-the-badge&logo=make&logoColor=white)

**Sitio web corporativo de Flujo Base** — Empresa de transformación digital especializada en Inteligencia Artificial, automatización y desarrollo de soluciones digitales.

[Ver Sitio en Vivo](https://davidcastanom.github.io/freelancer/) · [Reportar Bug](https://github.com/Davidcastanom/freelancer/issues) · [Contacto](https://davidcastanom.github.io/freelancer/contacto.html)

</div>

---

## Tabla de Contenidos

- [Vista Previa](#vista-previa)
- [Características](#características)
- [Seguridad](#seguridad)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Inicio Rápido](#inicio-rápido)
- [Integración con Notion (Blog)](#integración-con-notion-blog)
- [Configuración del Formulario de Contacto](#configuración-del-formulario-de-contacto)
- [Proxy Seguro con Cloudflare Worker](#proxy-seguro-con-cloudflare-worker)
- [Guía de Personalización](#guía-de-personalización)
- [Manual de Marca](#manual-de-marca)
- [Despliegue](#despliegue)
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
- Blog con búsqueda por keyword y filtro por fecha/categoría
- Modal popup para vista previa de artículos del blog
- Filtros de portfolio por tipo (imagen/video/enlace)
- Touch táctil para móvil en portfolio items
- Copyright dinámico (año actual automático)
- Skeleton loader mientras carga el blog

### Integraciones
- **Notion** — Blog conectado vía Make (Integromat) webhook
- **FormSubmit.co** — Formulario de contacto funcional
- **Make (Integromat)** — Webhook para enviar datos del formulario
- **Cloudflare Worker** — Proxy seguro para el webhook (opcional, gratis)
- **YouTube** — Videos embebidos en casos de éxito
- **Google Drive** — Videos embebidos con formato `/preview`

---

## Seguridad

El sitio implementa múltiples capas de protección:

### Cabeceras de Seguridad (6 archivos HTML)
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

### Integridad de Recursos (SRI)
- Font Awesome 6.4.0: `integrity="sha384-..."` + `crossorigin="anonymous"`
- DOMPurify 3.0.6: `integrity="sha384-..."` + `crossorigin="anonymous"`

### Protección del Formulario de Contacto
| Capa | Mecanismo | Dónde |
|------|-----------|-------|
| CAPTCHA | FormSubmit.co CAPTCHA habilitado | HTML |
| Honeypot | Campo invisible que atrapa bots | HTML + JS |
| Anti-bot por tiempo | Bloquea envíos < 3 segundos | JS |
| Rate limiting | Max 3 envíos/60 segundos (localStorage) | JS |
| Sanitización | Limpia tags HTML de inputs | JS |
| Maxlength | Limita longitud: name(100), email(150), message(2000) | HTML |
| Email ofuscado | data-attributes en vez de texto visible | HTML + JS |

### Protección del Blog (XSS)
- **DOMPurify**: Sanitiza todo el HTML inyectado desde Notion/Make
- **Fallback seguro**: Si DOMPurify no carga, construye el card con `createElement` + `textContent` (nunca innerHTML crudo)

### Proxy Seguro (Cloudflare Worker)
- Rate limiting server-side real por IP (no se puede saltar con JS)
- Validación server-side de campos
- Webhook de Make oculto del frontend
- Documentación completa en `script.js` (ver sección ниже)

### Puntuación de Seguridad

| Categoría | Antes | Después |
|-----------|-------|---------|
| XSS | 2/10 | 8/10 |
| Spam/Bots | 1/10 | 7/10 |
| Clickjacking | 0/10 | 9/10 |
| Integridad de recursos | 3/10 | 9/10 |
| **General** | **4/10** | **7.5/10** |

---

## SEO Técnico

| Archivo | Qué hace |
|---------|----------|
| `sitemap.xml` | Lista todas las páginas para motores de búsqueda |
| `robots.txt` | Instrucciones para crawlers (Google, Bing, etc.) |
| `404.html` | Página de error personalizada (noindex) |
| JSON-LD | Datos estructurados en cada página (Organization, Service, Blog, etc.) |
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
| Notion API | Base de datos del blog (vía Make) |
| Make (Integromat) | Webhooks para blog y formulario |
| FormSubmit.co | Envío de formularios por email |
| Cloudflare Workers | Proxy seguro para Make (opcional) |
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
├── styles.css                       # Estilos globales (~1900 líneas)
├── script.js                        # JavaScript principal (~940 líneas)
├── LICENSE                          # Licencia MIT
└── README.md                        # Este archivo
```

### Imágenes (Cloudinary CDN)

Las imágenes se sirven desde **Cloudinary** (no están en el repositorio). Cloudinary automaticamente:
- Convierte a WebP para navegadores compatibles
- Comprime y optimiza cada imagen
- Sirve desde CDN global (carga rápida)

| Imagen | URL Cloudinary |
|--------|---------------|
| Favicon | `https://res.cloudinary.com/dfn5g9ve3/image/upload/v1783820548/favicon1_qd0gtj.png` |
| Logo oficial | `https://res.cloudinary.com/dfn5g9ve3/image/upload/v1783820554/Logo_FLUJO_BASE_profesional_2_u3epyk.png` |
| Hero inicio | `https://res.cloudinary.com/dfn5g9ve3/image/upload/v1783820548/inicio_gjla3y.png` |
| Foto fundador | `https://res.cloudinary.com/dfn5g9ve3/image/upload/v1783820548/foto-perfil_zbgzvp.jpg` |
| BG global | `https://res.cloudinary.com/dfn5g9ve3/image/upload/v1783820549/bg-hero_ithl25.png` |

Para agregar imágenes de portfolio, guárdalas en `assets/img/portafolio/` (estas sí van en el repo).

---

## Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/Davidcastanom/freelancer.git
cd freelancer
```

### 2. Abrir en el navegador

Simplemente abre `index.html` en tu navegador. No se necesita servidor local.

### 3. Personalizar

Edita los archivos HTML directamente. Cada página tiene comentarios detallados con instrucciones paso a paso (marcados con ✋).

---

## Integración con Notion (Blog)

El blog se conecta automáticamente a una base de datos de Notion a través de Make (Integromat).

### Paso 1: Crear la base de datos en Notion

Crea una base de datos con estas columnas **exactas**:

| Propiedad | Tipo | Ejemplo |
|-----------|------|---------|
| Title | Title | "Cómo usar IA en tu negocio" |
| Excerpt | Rich text | "Descubre las herramientas..." |
| Cover | Files & media | (imagen de portada 16:9) |
| Date | Date | 10 de julio de 2026 |
| Category | Select | IA \| Automatización \| Desarrollo \| Datos \| Consultoría |
| Tags | Multi-select | productividad, herramientas |
| ContentURL | URL | https://notion.so/xxx |

### Paso 2: Configurar Make

1. Crea un nuevo Scenario en [make.com](https://make.com)
2. **Módulo 1**: Webhooks > Custom webhook → copia la URL
3. **Módulo 2**: Notion > List database pages → conecta tu cuenta
4. **Módulo 3**: Webhooks > Response → devuelve el JSON formateado
5. Activa el Scenario

### Paso 3: Conectar en el código

Abre `script.js` y pega la URL del webhook:

```javascript
const BLOG_WEBHOOK_URL = 'https://hook.us2.make.com/tu-url-aqui';
```

### Paso 4: Compartir páginas de Notion

Para que el modal muestre el contenido, cada página de Notion debe tener "Share to web" activado.

> **Mientras tanto**: El blog muestra 3 artículos de ejemplo. Edítalos en `script.js` buscando `FALLBACK_POSTS`.

---

## Configuración del Formulario de Contacto

El formulario usa **FormSubmit.co** para enviar emails y **Make** para enviar datos a tu CRM.

### Cambios manuales necesarios

En `contacto.html`:

1. **WhatsApp**: Cambia `573001234567` por tu número (código país + número)
2. **Email**: Configúralo en el dashboard de FormSubmit.co (no está en el código por seguridad)

### Configurar FormSubmit.co

1. Ve a [formsubmit.co](https://formsubmit.co)
2. Regístrate con `solucionesdigitalesflujobase@gmail.com`
3. En tu primer envío, recibirás un email de confirmación
4. Haz clic en el enlace para activar tu cuenta
5. En **Dashboard > Settings**, configura:
   - Email de destino
   - Asunto del email
   - Activar/desactivar CAPTCHA

### Configurar el webhook de Make

En `script.js`, busca la sección `✋ WEBHOOK DE MAKE`:

```javascript
// OPCIÓN A: Directo a Make (funciona ya)
const USE_PROXY = false;
const FETCH_URL_DIRECT = 'https://hook.us2.make.com/tu-url';

// OPCIÓN B: Proxy con Cloudflare Worker (recomendado)
const USE_PROXY = true;
const FETCH_URL_PROXY = 'https://tu-worker.tu-usuario.workers.dev';
```

---

## Proxy Seguro con Cloudflare Worker

### Por qué usar un proxy

El webhook de Make está expuesto en el JavaScript del sitio. Cualquiera puede inspeccionar el código y enviar spam a tu CRM. Un proxy server-side:

- **Oculta** tu webhook del público
- **Rate limiting real** por IP (no se puede saltar con JS)
- **Validación server-side** de campos
- **Gratis** en plan free (100,000 requests/día)

### Paso 1: Crear cuenta en Cloudflare

1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Crea cuenta **gratis** (sin tarjeta de crédito)

### Paso 2: Crear el Worker

1. Menú lateral → **Workers & Pages** → **Create Worker**
2. Nombre: `flujo-base-proxy`
3. Haz clic en **Create Worker**
4. Haz clic en **Edit code**
5. Borra todo el código que haya
6. Ve a `script.js` → busca `CÓDIGO DEL WORKER DE CLOUDFLARE` (al final del archivo)
7. Copia todo el código que está entre `INICIO DEL CÓDIGO DEL WORKER` y `FIN DEL CÓDIGO DEL WORKER`
8. Pégalo en el editor de Cloudflare
9. Haz clic en **Deploy**

### Paso 3: Conectar al sitio

1. Copia la URL del Worker (algo como: `flujo-base-proxy.tu-usuario.workers.dev`)
2. En `script.js`, busca `FETCH_URL_PROXY` y pega la URL
3. Cambia `USE_PROXY` a `true`

### Qué hace el Worker

```
Usuario → Formulario → Cloudflare Worker (valida/filtra) → Make Webhook
```

El Worker:
- Valida que sea POST
- Rate limiting por IP (5 req/min)
- Detecta honeypot
- Detecta envíos rápidos (< 3 segundos)
- Sanitiza todos los textos
- Limita longitudes de campos
- Valida formato de email
- Reenvía a Make (el webhook nunca se expone)

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

Las imágenes están en Cloudinary. Para cambiar la de fondo:

1. Sube tu imagen a [cloudinary.com](https://cloudinary.com) → copia la URL
2. En `styles.css`, busca `background-image` y reemplaza la URL de Cloudinary
3. Formato: `https://res.cloudinary.com/dfn5g9ve3/image/upload/v.../tu-imagen.png`

Ajusta la opacidad del overlay en `styles.css`:

```css
body::before {
    background-color: rgba(10, 10, 15, 0.88); /* 0.88 = 88% opaco */
}
```

### Cambiar imagen hero de inicio

1. Sube tu imagen a Cloudinary → copia la URL
2. En `index.html`, busca `inicio_gjla3y` y reemplaza la URL completa

### Agregar artículos al blog (sin Notion)

Edita `script.js` y modifica el array `FALLBACK_POSTS`:

```javascript
const FALLBACK_POSTS = [
    {
        id: 'mi-articulo-1',
        title: 'Título del artículo',
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

En `casos-exito.html`, copia un bloque `<div class="portfolio-item">` y editalo:

```html
<div class="portfolio-item fade-in" data-type="imagen">
    <div class="portfolio-img">
        <img src="assets/img/portafolio/mi-caso.png" alt="Descripción">
        <div class="portfolio-overlay">
            <div class="portfolio-info">
                <span class="category-pill cat-ia">IA</span>
                <h3>Nombre del Proyecto</h3>
                <p>Descripción del caso de éxito.</p>
                <p class="portfolio-metric"><i class="fas fa-chart-line"></i> <strong>Resultado:</strong> +40% en productividad</p>
                <a href="https://mi-proyecto.com" class="btn btn-sm portfolio-btn" target="_blank">Ver Proyecto</a>
            </div>
        </div>
    </div>
</div>
```

### Embeber videos de Google Drive

1. Comparte el video desde Google Drive (acceso: cualquier persona con el link)
2. Copia el ID del archivo de la URL: `https://drive.google.com/file/d/**ESTE_ID**/view`
3. Usa el formato embed: `https://drive.google.com/file/d/ESTE_ID/preview`

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
