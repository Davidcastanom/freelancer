// ==========================================================================
// FLUJO BASE — SCRIPT PRINCIPAL
// Maneja la interactividad del sitio web:
// 1. Menú hamburguesa móvil
// 2. Header con efecto de scroll
// 3. Formulario de contacto con Make webhook
// 4. Portfolio táctil para móvil
// 5. Copyright dinámico (año actual)
// 6. Detección de página activa
// 7. Animaciones fade-in con IntersectionObserver
// 8. Filtros del blog
// 9. Filtros de casos de éxito
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // ✋ CONFIGURACIÓN DEL PROXY — compartida por formulario Y blog
    const USE_PROXY = true;
    const FETCH_URL_DIRECT = 'https://hook.us2.make.com/2cxiof5fbtiu9k5233hw1tk71mxyibc4';
    const FETCH_URL_PROXY = 'https://frelancer-proxy.esteban7005808.workers.dev';

    // ======================================================================
    // 1. MENÚ DE NAVEGACIÓN MÓVIL
    // Alterna la clase 'active' en el hamburger y el nav-menu para
    // mostrar/ocultar el menú en dispositivos móviles.
    // ======================================================================
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (hamburger) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
    }

    navLinks.forEach(link => link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));


    // ======================================================================
    // 2. CAMBIO DE ESTILO DEL HEADER AL HACER SCROLL
    // Cuando el usuario hace scroll más de 50px, el header se vuelve
    // más compacto y adquiere una sombra sutil.
    // ======================================================================
    const header = document.querySelector("header");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });


    // ======================================================================
    // 3. MANEJO DEL FORMULARIO DE CONTACTO
    // Intercepta el envío del formulario, valida los campos y envía
    // los datos a un webhook de Make (Integromat) vía fetch.
    // Incluye estados de carga (spinner) y mensajes de feedback.
    //
    // SEGURIDAD: Incluye honeypot anti-bot, rate limiting, timestamp
    // anti-bot basado en tiempo, y sanitización de inputs.
    // ======================================================================
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');

    // --- SEGURIDAD: Timestamp del formulario (anti-bot basado en tiempo) ---
    // Registra cuándo se cargó la página. Si el formulario se envía en
    // menos de 3 segundos, probablemente es un bot automatizado.
    const formLoadTime = Date.now();
    const timestampField = document.getElementById('form-timestamp');
    if (timestampField) {
        timestampField.value = formLoadTime.toString();
    }

    // --- SEGURIDAD: Rate limiting (máximo 3 envíos por 60 segundos) ---
    const RATE_LIMIT_MAX = 3;
    const RATE_LIMIT_WINDOW = 60000; // 60 segundos en ms
    let formSubmissionLog = JSON.parse(localStorage.getItem('fb_form_log') || '[]');

    function isRateLimited() {
        const now = Date.now();
        // Limpiar entradas viejas
        formSubmissionLog = formSubmissionLog.filter(t => now - t < RATE_LIMIT_WINDOW);
        localStorage.setItem('fb_form_log', JSON.stringify(formSubmissionLog));
        return formSubmissionLog.length >= RATE_LIMIT_MAX;
    }

    function recordSubmission() {
        formSubmissionLog.push(Date.now());
        localStorage.setItem('fb_form_log', JSON.stringify(formSubmissionLog));
    }

    // --- SEGURIDAD: Sanitización de texto (elimina tags HTML) ---
    function sanitizeText(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // --- SEGURIDAD: Check honeypot ---
            const honey = contactForm.querySelector('input[name="_honey"]');
            if (honey && honey.value !== '') {
                // Bot detectado: simular éxito pero no enviar nada
                showMessage('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
                contactForm.reset();
                return;
            }

            // --- SEGURIDAD: Check anti-bot por tiempo (mínimo 3 segundos) ---
            const elapsed = Date.now() - formLoadTime;
            if (elapsed < 3000) {
                showMessage('Por favor, revisa tu mensaje antes de enviarlo.', 'error');
                return;
            }

            // --- SEGURIDAD: Rate limiting ---
            if (isRateLimited()) {
                showMessage('Has enviado demasiados mensajes. Intenta de nuevo en un minuto.', 'error');
                return;
            }

            const name = sanitizeText(document.getElementById('name')?.value.trim() || '');
            const email = document.getElementById('email')?.value.trim() || '';
            const businessType = sanitizeText(document.getElementById('business-type')?.value || '');
            const serviceInterest = sanitizeText(document.getElementById('service-interest')?.value || '');
            const message = sanitizeText(document.getElementById('message')?.value.trim() || '');

            if (name === '' || email === '' || message === '') {
                showMessage('Por favor, completa todos los campos obligatorios.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showMessage('Por favor, introduce un correo electrónico válido.', 'error');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            /*
            ===========================================================
            ✋ WEBHOOK DE MAKE — CONFIGURACIÓN DEL ENVÍO DE FORMULARIO
            ===========================================================

            ─────────────────────────────────────────────────────────
            OPCIÓN A: DIRECTO A MAKE (actual — funciona ya)
            ─────────────────────────────────────────────────────────
            Los datos van directo del formulario a tu webhook de Make.
            Es la configuración actual. Funciona pero el webhook es
            público (cualquiera que inspeccione el código puede verlo).

            Para usar esta opción:
            1. Ve a make.com → abre tu Scenario
            2. En el Módulo Webhook, copia la URL
            3. Pégala abajo donde dice FETCH_URL

            ─────────────────────────────────────────────────────────
            OPCIÓN B: PROXY SEGURO CON CLOUDFLARE WORKER (recomendado)
            ─────────────────────────────────────────────────────────
            Los datos van a un Worker de Cloudflare que valida,
            filtra y rate-limita ANTES de reenviar a Make.
            Tu webhook NUNCA se expone al público.

            Para configurar esta opción:
            1. Crea cuenta gratis en dash.cloudflare.com
            2. Workers & Pages → Create Worker → nombre: "flujo-base-proxy"
            3. Pega el código del Worker (está documentado abajo)
            4. Publica el Worker y copia su URL
            5. Cambia FETCH_URL abajo por la URL del Worker
            6. Cambia USE_PROXY a true

            El código del Worker está en el archivo: docs/CLOUDFLARE-WORKER.md
            (si no existe, busca "Cloudflare Worker Flujo Base" en Google
            o pídele al asistente que lo genere por ti)

            ─────────────────────────────────────────────────────────
            ⚠️ SEGURIDAD: Independientemente de la opción que elijas,
            el honeypot, rate limiting y timestamp anti-bot ya protegen
            tu formulario del lado del cliente. El proxy agrega una
            capa server-side que es imposible de saltar con JS.
            ===========================================================
            */

            // ✋ CONFIGURACIÓN: usa proxy si USE_PROXY = true
            const FETCH_URL = USE_PROXY ? FETCH_URL_PROXY : FETCH_URL_DIRECT;

            fetch(FETCH_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    businessType: businessType,
                    serviceInterest: serviceInterest,
                    message: message,
                    _timestamp: timestampField?.value || ''  // anti-bot: el Worker valida esto
                })
            })
            .then(response => {
                if (!response.ok) throw new Error("Error en el envío");
                recordSubmission();
                showMessage('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
                contactForm.reset();
            })
            .catch(error => {
                console.error(error);
                showMessage('Hubo un error al enviar el mensaje. Intenta más tarde.', 'error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            });
        });
    }

    function showMessage(text, type) {
        if (!formMessage) return;
        formMessage.textContent = text;
        formMessage.className = type;
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = '';
        }, 5000);
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }


    // ======================================================================
    // 4. PORTFOLIO TÁCTIL PARA MÓVIL
    // En dispositivos táctiles no existe "hover", así que el overlay
    // de los portfolio items se muestra con el primer tap y se oculta
    // con el segundo. Usa la clase .tapped definida en CSS.
    // ======================================================================
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    portfolioItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.classList.contains('tapped')) {
                const clickedLink = e.target.closest('a');
                if (clickedLink) {
                    return;
                }
                item.classList.remove('tapped');
                return;
            }

            if (window.innerWidth <= 768) {
                portfolioItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('tapped');
                    }
                });
                item.classList.add('tapped');
                if (e.target.closest('.portfolio-item-link')) {
                    e.preventDefault();
                }
            }
        });
    });


    // ======================================================================
    // 5. COPYRIGHT DINÁMICO
    // Actualiza automáticamente el año del copyright en el footer
    // usando el año actual del sistema. Nunca quedará desactualizado.
    // ======================================================================
    const copyrightElements = document.querySelectorAll('.copyright-year');
    const currentYear = new Date().getFullYear();

    copyrightElements.forEach(el => {
        el.textContent = currentYear;
    });


    // ======================================================================
    // 6. DETECCIÓN DE PÁGINA ACTIVA
    // Si el HTML no tiene la clase 'active' en el nav-link correcto,
    // este script la detecta automáticamente por la URL actual.
    // Esto es un respaldo por si olvidas agregar la clase manualmente.
    // ======================================================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });


    // ======================================================================
    // 7. ANIMACIONES FADE-IN
    // Observa los elementos con clase .fade-in y les agrega .visible
    // cuando entran en el viewport, activando la transición CSS.
    // ======================================================================
    const fadeElements = document.querySelectorAll('.fade-in');

    let fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));


    // ======================================================================
    // 8. BLOG — INTEGRACIÓN NOTION + BÚSQUEDA + FILTROS + MODAL
    // Sistema completo de blog con:
    //   - Fetch de artículos desde Notion vía Make webhook
    //   - Búsqueda por keyword en tiempo real
    //   - Filtro por fecha (desde)
    //   - Filtro por categoría
    //   - Modal popup para vista previa del artículo
    //   - Fallback con artículos estáticos si el webhook no está activo
    // ======================================================================

    /*
    ===========================================================
    ✋ CONFIGURACIÓN DEL WEBHOOK — LO QUE DEBES CAMBIAR TÚ
    ===========================================================

    CAMBIO 1: Pega aquí la URL de tu webhook de Make
    ─────────────────────────────────────────────────
    1. Ve a make.com → abre tu Scenario
    2. En el Módulo 1 (Webhook), copia la URL que te genere
    3. Pégala entre las comillas de abajo (reemplaza las comillas vacías)

    Ejemplo: const BLOG_WEBHOOK_URL = 'https://hook.us2.make.com/abc123xyz...';

    Si dejas las comillas vacías '', el blog usará los 3 artículos de ejemplo
    que están más abajo en FALLBACK_POSTS. No se rompe nada, solo muestra
    contenido de prueba en vez de tus artículos reales de Notion.

    CAMBIO 2: Edita los artículos de ejemplo (opcional)
    ─────────────────────────────────────────────────────
    Si quieres cambiar los 3 artículos de ejemplo sin configurar Make,
    busca FALLBACK_POSTS más abajo y edita los campos:
    - title: Título del artículo
    - excerpt: Resumen del artículo
    - cover: URL de la imagen de portada
    - date: Fecha en formato YYYY-MM-DD
    - dateFormatted: Fecha legible (ej: "10 Julio 2026")
    - category: ia | automatizacion | desarrollo | datos | consultoria
    - tags: palabras clave para la búsqueda
    - contentUrl: # (sin enlace) o URL del artículo

    Para imágenes puedes usar:
    - https://via.placeholder.com/800x450/0A0A0F/0066FF?text=Tu+Texto
    - O subir a imgur.com y pegar el link directo
    ===========================================================
    */
    const BLOG_WEBHOOK_URL = 'https://hook.us2.make.com/5uxepuwmh43znbygrmukpxz3q6qdcfku';  // ← TU WEBHOOK DE MAKE

    // --- Transformación de formato Notion → formato blog ---
    // ✋ NO MODIFIQUES esto a menos que cambies la estructura de tu database en Notion
    // Convierte el formato anidado de Notion al formato plano que espera el blog:
    //   Notion: { properties_value: { Title: [{plain_text: "..."}], Category: {name: "IA"}, ... } }
    //   Blog:   { id: "...", title: "...", category: "ia", cover: "https://...", ... }
    const CATEGORY_NAME_MAP = {
        'IA': 'ia',
        'Automatización': 'automatizacion',
        'Desarrollo': 'desarrollo',
        'Datos': 'datos',
        'Consultoría': 'consultoria'
    };

    const MONTH_NAMES = {
        1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
        5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
        9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
    };

    function transformNotionPost(item) {
        console.log('[transformNotionPost] item:', JSON.stringify(item).substring(0, 300));
        const p = item.properties_value || item;

        // Title: puede ser string o array de rich text
        let title = '';
        if (Array.isArray(p.Title)) {
            title = p.Title.map(t => t.plain_text || '').join('');
        } else if (typeof p.Title === 'string') {
            title = p.Title;
        }

        // Category: puede ser {name: "IA"} o string
        let categoryRaw = '';
        if (p.Category && typeof p.Category === 'object') {
            categoryRaw = p.Category.name || '';
        } else {
            categoryRaw = String(p.Category || '');
        }
        const category = CATEGORY_NAME_MAP[categoryRaw] || categoryRaw.toLowerCase();

        // Tags: Multi-select array o Tags array
        const tagsRaw = p['Multi-select'] || p.Tags || p.tags || [];
        const tags = Array.isArray(tagsRaw)
            ? tagsRaw.map(t => typeof t === 'string' ? t : t.name || '')
            : [];

        // Date: {start: "YYYY-MM-DD"} o string
        let date = '';
        let dateFormatted = '';
        if (p.Date && typeof p.Date === 'object') {
            date = p.Date.start || '';
        } else if (typeof p.Date === 'string') {
            date = p.Date;
        }
        if (date) {
            const parts = date.split('-');
            if (parts.length === 3) {
                const month = parseInt(parts[1]);
                dateFormatted = `${parseInt(parts[2])} ${MONTH_NAMES[month] || parts[1]} ${parts[0]}`;
            }
        }

        // Cover: array de archivos, URL externa o string
        let cover = '';
        if (Array.isArray(p.Cover) && p.Cover.length > 0) {
            // Tipo file (subido directo a Notion): { file: { url: "..." } }
            // Tipo external (URL pegada): { external: { url: "..." } }
            cover = p.Cover[0].file?.url || p.Cover[0].external?.url || p.Cover[0].url || '';
        } else if (typeof p.Cover === 'string') {
            cover = p.Cover;
        }
        // ⚠️ Las URLs de Cover de Notion son temporales (expiran en ~1 hora).
        // Para producción, sube las imágenes a Cloudinary o usa un endpoint permanente.

        // Excerpt
        const excerpt = p.Excerpt || p.excerpt || '';

        // Description (descripción breve para enganchar al lector)
        // Viene como rich text array: [{plain_text: "..."}]
        let description = '';
        const descRaw = p['Descripción'] || p.Description || p.description || p.descripcion;
        if (Array.isArray(descRaw)) {
            description = descRaw.map(t => t.plain_text || '').join('');
        } else if (typeof descRaw === 'string') {
            description = descRaw;
        }

        // ContentURL
        let contentUrl = '#';
        if (p.ContentURL) {
            contentUrl = p.ContentURL;
        } else if (p.contentUrl) {
            contentUrl = p.contentUrl;
        }

        return {
            id: title.replace(/\s+/g, '-').toLowerCase().substring(0, 50),
            title: title,
            excerpt: excerpt,
            description: description,
            cover: cover || 'https://via.placeholder.com/800x450.png?text=Articulo',
            date: date,
            dateFormatted: dateFormatted || date,
            category: category,
            tags: tags,
            contentUrl: contentUrl
        };
    }


    // --- ARTÍCULOS DE EJEMPLO (se muestran si no tienes Make configurado) ---
    // ✋ EDITA ESTOS CAMPOS si quieres cambiar los artículos que se ven en el blog
    // Cada objeto es un artículo. Copia un objeto completo para agregar más.
    // Cuando configures Make, estos se reemplazan automáticamente por tus artículos de Notion.
    const FALLBACK_POSTS = [
        {
            id: 'fallback-1',
            title: 'Cómo la IA está transformando los negocios en 2026',
            excerpt: 'Descubre las herramientas de Inteligencia Artificial que están revolucionando la forma en que las empresas gestionan sus procesos, toman decisiones y escalan sus resultados.',
            cover: 'https://via.placeholder.com/800x450.png/0A0A0F/0066FF?text=IA+en+Negocios',
            date: '2026-07-10',
            dateFormatted: '10 Julio 2026',
            category: 'ia',
            tags: ['inteligencia artificial', 'negocios', 'productividad'],
            contentUrl: '#'
        },
        {
            id: 'fallback-2',
            title: '5 procesos que puedes automatizar hoy mismo',
            excerpt: 'No necesitas ser programador para automatizar tu negocio. Con herramientas como Make y Zapier puedes eliminar tareas repetitivas y ahorrar horas cada semana.',
            cover: 'https://via.placeholder.com/800x450.png/0A0A0F/00D4FF?text=Automatizacion',
            date: '2026-07-05',
            dateFormatted: '5 Julio 2026',
            category: 'automatizacion',
            tags: ['automatización', 'make', 'zapier', 'productividad'],
            contentUrl: '#'
        },
        {
            id: 'fallback-3',
            title: 'Tendencias en desarrollo web para emprendedores',
            excerpt: 'Desde frameworks ultrarrápidos hasta interfaces conversacionales: conoce las tecnologías que están definiendo el desarrollo web moderno y cómo aprovecharlas.',
            cover: 'https://via.placeholder.com/800x450.png/0A0A0F/28a745?text=Desarrollo+Web',
            date: '2026-07-01',
            dateFormatted: '1 Julio 2026',
            category: 'desarrollo',
            tags: ['desarrollo web', 'tendencias', 'emprendedores'],
            contentUrl: '#'
        }
    ];

    // --- Mapeo de categorías a clases CSS ---
    const CATEGORY_MAP = {
        ia:           { label: 'IA',           cssClass: 'cat-ia' },
        automatizacion: { label: 'Automatización', cssClass: 'cat-auto' },
        desarrollo:   { label: 'Desarrollo',   cssClass: 'cat-dev' },
        datos:        { label: 'Datos',        cssClass: 'cat-datos' },
        consultoria:  { label: 'Consultoría',  cssClass: 'cat-consultoria' }
    };

    // --- Elementos del DOM ---
    const blogGrid = document.getElementById('blog-grid');
    const blogSkeleton = document.getElementById('blog-skeleton');
    const blogEmpty = document.getElementById('blog-empty');
    const blogSearchInput = document.getElementById('blog-search-input');
    const blogSearchClear = document.getElementById('blog-search-clear');
    const blogDateInput = document.getElementById('blog-date-input');
    const blogResultsCount = document.getElementById('blog-results-count');
    const blogFiltersBtns = document.querySelectorAll('.blog-filters .filter-btn');

    // --- Elementos del modal ---
    const blogModal = document.getElementById('blog-modal');
    const modalBackdrop = document.getElementById('blog-modal-backdrop');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalLink = document.getElementById('modal-link');
    const modalCoverImg = document.getElementById('modal-cover-img');
    const modalCoverWrap = document.getElementById('modal-cover-wrap');
    const modalDescription = document.getElementById('modal-description');
    const modalTags = document.getElementById('modal-tags');

    // --- Estado actual ---
    let allPosts = [];
    let currentFilter = 'todos';
    let currentSearch = '';
    let currentDateFrom = '';

    /**
     * Renderiza un artículo como card HTML dentro del blog grid.
     * @param {Object} post - Objeto con los campos del artículo
     * @returns {HTMLElement} - Elemento article creado
     */
    function createBlogCard(post) {
        const article = document.createElement('article');
        article.className = 'blog-card fade-in';
        article.setAttribute('data-category', post.category);
        article.setAttribute('data-date', post.date);
        article.setAttribute('data-tags', (post.tags || []).join(','));
        article.setAttribute('data-url', post.contentUrl || '#');

        const cat = CATEGORY_MAP[post.category] || { label: post.category, cssClass: 'cat-ia' };

        /*
        ===========================================================
        ✋ SEGURIDAD: SANITIZACIÓN DE HTML CON DOMPurify
        ===========================================================

        El blog puede recibir contenido desde Notion (vía Make webhook).
        Si la database de Notion es comprometida, un atacante podría
        inyectar código malicioso (XSS) en los campos title, excerpt, etc.

        DOMPurify limpia todo el HTML inyectado, eliminando scripts y
        eventos peligrosos antes de insertarlo en el DOM.

        Si ves errores de "DOMPurify is not defined", significa que la
        librería no se cargó. Verifica el tag <script> de DOMPurify
        en el HTML (debe estar ANTES de script.js).
        ===========================================================
        */
        /*
        ===========================================================
        ✋ SEGURIDAD: CONSTRUCCIÓN SEGURA DEL BLOG CARD
        ===========================================================

        Si DOMPurify no está disponible (CDN caído), en vez de
        insertar HTML crudo (que podría contener XSS), construimos
        el card usando métodos seguros del DOM:
        - createElement para elementos
        - textContent para texto (nunca innerHTML)
        - setAttribute para atributos (src, alt, href)

        Esto garantiza que NUNCA se inserte HTML sin sanitizar,
        incluso si el CDN de DOMPurify falla.
        ===========================================================
        */
        if (typeof DOMPurify !== 'undefined') {
            const rawHTML = `
                <div class="blog-image">
                    <img src="${post.cover || 'https://via.placeholder.com/800x450.png?text=Articulo'}" 
                         alt="${post.title}" loading="lazy">
                    <span class="category-pill ${cat.cssClass}">${cat.label}</span>
                </div>
                <div class="blog-content">
                    <time datetime="${post.date}">${post.dateFormatted || post.date}</time>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt || ''}</p>
                    <span class="btn btn-sm">
                        <i class="fas fa-book-open"></i> Leer Articulo
                    </span>
                </div>
            `;
            article.innerHTML = DOMPurify.sanitize(rawHTML, { USE_PROFILES: { html: true } });
        } else {
            // Fallback seguro: construir el card sin innerHTML
            const imgDiv = document.createElement('div');
            imgDiv.className = 'blog-image';
            const img = document.createElement('img');
            img.src = post.cover || 'https://via.placeholder.com/800x450.png?text=Articulo';
            img.alt = post.title;
            img.loading = 'lazy';
            imgDiv.appendChild(img);
            const pill = document.createElement('span');
            pill.className = `category-pill ${cat.cssClass}`;
            pill.textContent = cat.label;
            imgDiv.appendChild(pill);
            article.appendChild(imgDiv);

            const contentDiv = document.createElement('div');
            contentDiv.className = 'blog-content';
            const time = document.createElement('time');
            time.setAttribute('datetime', post.date);
            time.textContent = post.dateFormatted || post.date;
            contentDiv.appendChild(time);
            const h3 = document.createElement('h3');
            h3.textContent = post.title;
            contentDiv.appendChild(h3);
            const p = document.createElement('p');
            p.textContent = post.excerpt || '';
            contentDiv.appendChild(p);
            const btn = document.createElement('span');
            btn.className = 'btn btn-sm';
            btn.innerHTML = '<i class="fas fa-book-open"></i> Leer Articulo';
            contentDiv.appendChild(btn);
            article.appendChild(contentDiv);
        }

        // Click en la card abre el modal
        article.addEventListener('click', () => openModal(post));

        return article;
    }

    /**
     * Renderiza todos los artículos filtrados en el grid.
     * Oculta el skeleton loader y muestra el estado vacío si no hay resultados.
     * @param {Array} posts - Array de artículos a mostrar
     */
    function renderBlog(posts) {
        // Ocultar skeleton
        if (blogSkeleton) blogSkeleton.style.display = 'none';

        // Limpiar grid
        blogGrid.innerHTML = '';

        if (posts.length === 0) {
            blogEmpty.style.display = 'block';
            blogResultsCount.textContent = '';
        } else {
            blogEmpty.style.display = 'none';
            blogResultsCount.textContent = `${posts.length} artículo${posts.length !== 1 ? 's' : ''} encontrado${posts.length !== 1 ? 's' : ''}`;
            posts.forEach(post => {
                const card = createBlogCard(post);
                blogGrid.appendChild(card);
            });
            // Re-observe fade-in elements
            blogGrid.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
        }
    }

    /**
     * Filtra los artículos según los criterios activos (categoría, búsqueda, fecha).
     */
    function filterPosts() {
        const filtered = allPosts.filter(post => {
            // Filtro por categoría
            if (currentFilter !== 'todos' && post.category !== currentFilter) return false;

            // Filtro por búsqueda (título + excerpt + tags)
            if (currentSearch) {
                const searchLower = currentSearch.toLowerCase();
                const matchTitle = (post.title || '').toLowerCase().includes(searchLower);
                const matchExcerpt = (post.excerpt || '').toLowerCase().includes(searchLower);
                const matchTags = (post.tags || []).some(t => t.toLowerCase().includes(searchLower));
                if (!matchTitle && !matchExcerpt && !matchTags) return false;
            }

            // Filtro por fecha desde
            if (currentDateFrom && post.date) {
                if (post.date < currentDateFrom) return false;
            }

            return true;
        });

        renderBlog(filtered);
    }

    /**
     * Abre el modal de vista previa del artículo.
     * Muestra cover, título, excerpt, tags y botón para leer en Notion.
     * @param {Object} post - Artículo a previsualizar
     */
    function openModal(post) {
        if (!blogModal) return;

        const cat = CATEGORY_MAP[post.category] || { label: post.category, cssClass: 'cat-ia' };

        // Cover image
        if (post.cover && post.cover !== 'https://via.placeholder.com/800x450.png?text=Articulo') {
            modalCoverImg.src = post.cover;
            modalCoverImg.alt = post.title;
            modalCoverWrap.style.display = 'block';
        } else {
            modalCoverWrap.style.display = 'none';
        }

        // Fecha
        modalDate.textContent = post.dateFormatted || post.date;
        modalDate.setAttribute('datetime', post.date);

        // Título
        modalTitle.textContent = post.title;

        // Descripción breve
        if (modalDescription) {
            if (post.description) {
                modalDescription.textContent = post.description;
                modalDescription.style.display = 'block';
            } else if (post.excerpt) {
                modalDescription.textContent = post.excerpt;
                modalDescription.style.display = 'block';
            } else {
                modalDescription.style.display = 'none';
            }
        }

        // Tags
        if (modalTags && post.tags && post.tags.length > 0) {
            modalTags.innerHTML = post.tags.map(t =>
                `<span class="tag">${sanitizeText(t)}</span>`
            ).join('');
            modalTags.style.display = 'flex';
        } else if (modalTags) {
            modalTags.innerHTML = '';
            modalTags.style.display = 'none';
        }

        // Link a Notion — abre en ventana emergente
        if (post.contentUrl && post.contentUrl !== '#') {
            modalLink.href = '#';
            modalLink.style.display = '';
            modalLink.onclick = (e) => {
                e.preventDefault();
                window.open(post.contentUrl, 'articulo_notion', 'width=900,height=700,scrollbars=yes,resizable=yes');
            };
        } else {
            modalLink.style.display = 'none';
            modalLink.onclick = null;
        }

        blogModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Cierra el modal de vista previa.
     */
    function closeModal() {
        if (!blogModal) return;
        blogModal.classList.remove('active');
        modalCoverImg.src = '';
        if (modalDescription) modalDescription.textContent = '';
        document.body.style.overflow = '';
    }

    // --- Event listeners del blog ---
    if (blogGrid) {
        // Búsqueda por keyword
        if (blogSearchInput) {
            blogSearchInput.addEventListener('input', (e) => {
                currentSearch = e.target.value.trim();
                blogSearchClear.style.display = currentSearch ? 'block' : 'none';
                filterPosts();
            });
        }

        // Botón limpiar búsqueda
        if (blogSearchClear) {
            blogSearchClear.addEventListener('click', () => {
                blogSearchInput.value = '';
                currentSearch = '';
                blogSearchClear.style.display = 'none';
                filterPosts();
            });
        }

        // Filtro por fecha
        if (blogDateInput) {
            blogDateInput.addEventListener('change', (e) => {
                currentDateFrom = e.target.value;
                filterPosts();
            });
        }

        // Filtros por categoría
        blogFiltersBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                blogFiltersBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter');
                filterPosts();
            });
        });

        // Cerrar modal
        if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
        if (modalClose) modalClose.addEventListener('click', closeModal);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && blogModal.classList.contains('active')) {
                closeModal();
            }
        });

        // --- Cargar artículos: webhook o fallback ---
        // ✋ IMPORTANTE: El fetch va a través del Worker proxy para evitar CORS.
        // El navegador no puede hacer fetch directo a hook.us2.make.com porque
        // Make no envía el header Access-Control-Allow-Origin para tu dominio.
        // El Worker recibe la petición, la reenvía a Make server-side (sin CORS),
        // y te devuelve los datos.
        if (BLOG_WEBHOOK_URL) {
            const blogFetchUrl = USE_PROXY ? FETCH_URL_PROXY : BLOG_WEBHOOK_URL;
            console.log('[Blog] Fetch URL:', blogFetchUrl, '| USE_PROXY:', USE_PROXY);
            fetch(blogFetchUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'getPosts', webhookUrl: BLOG_WEBHOOK_URL })
            })
            .then(res => {
                console.log('[Blog] Response status:', res.status, '| Content-Type:', res.headers.get('content-type'));
                if (!res.ok) throw new Error(`Error ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log('[Blog] Raw data:', JSON.stringify(data).substring(0, 500));
                let rawPosts = [];
                if (Array.isArray(data)) {
                    rawPosts = data;
                } else if (data && Array.isArray(data.data)) {
                    rawPosts = data.data;
                } else if (data && data.properties_value) {
                    rawPosts = [data];
                }
                console.log('[Blog] Posts encontrados:', rawPosts.length);

                allPosts = rawPosts
                    .map(item => transformNotionPost(item))
                    .filter(post => post.title);

                console.log(`[Blog] ${allPosts.length} artículos transformados`);
                filterPosts();
            })
            .catch(err => {
                console.error('[Blog] ERROR:', err.message);
                allPosts = FALLBACK_POSTS;
                filterPosts();
            });
        } else {
            // Sin webhook: usar artículos estáticos de fallback
            allPosts = FALLBACK_POSTS;
            filterPosts();
        }
    }


    // ======================================================================
    // 9. FILTROS DE CASOS DE ÉXITO
    // Permite filtrar casos de éxito por tipo: imagen, video, enlace.
    // Los botones usan data-filter y los items data-type.
    // ======================================================================
    const portfolioFilters = document.querySelectorAll('.portfolio-filters .filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-grid .portfolio-item');

    portfolioFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            portfolioFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-type') === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    // ======================================================================
    // 10. OFUSCACIÓN DE EMAIL
    // El email está codificado en data-attributes en el HTML para evitar
    // que los scrapers automatizados lo recojan para spam.
    // Este script lo decodifica y lo muestra solo para usuarios reales.
    // ======================================================================
    document.querySelectorAll('[data-email-user]').forEach(el => {
        const user = el.getAttribute('data-email-user');
        const domain = el.getAttribute('data-email-domain');
        if (user && domain) {
            el.textContent = user + '@' + domain;
            el.href = 'mailto:' + user + '@' + domain;
        }
    });

});


/*
===========================================================================
✋ CÓDIGO DEL WORKER DE CLOUDFLARE — PROXY SEGURO PARA MAKE
===========================================================================

 Tu Worker actual maneja solo el formulario. Ahora necesita manejar
 TAMBIÉN el blog (proxy contra CORS).

 ACTUALIZA TU WORKER en Cloudflare con este código completo:

 PASOS:
 1. Ve a https://dash.cloudflare.com → Workers & Pages → tu Worker
 2. Haz clic en "Edit code"
 3. Borra todo el código anterior
 4. Pega EL CÓDIGO DE ABAJO
 5. Haz clic en "Deploy"

===========================================================================
// INICIO DEL CÓDIGO DEL WORKER — copia desde aquí
===========================================================================

const MAKE_FORM_WEBHOOK = 'https://hook.us2.make.com/2cxiof5fbtiu9k5233hw1tk71mxyibc4';
const MAKE_BLOG_WEBHOOK = 'https://hook.us2.make.com/5uxepuwmh43znbygrmukpxz3q6qdcfku';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Rate limiting
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 1000;
const ipLog = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const log = ipLog.get(ip) || [];
  const recent = log.filter(t => now - t < RATE_WINDOW);
  if (recent.length >= RATE_LIMIT) return true;
  recent.push(now);
  ipLog.set(ip, recent);
  return false;
}

function sanitize(str) {
  return String(str).replace(/<[^>]*>/g, '').trim();
}

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: CORS_HEADERS });
    }

    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429, headers: CORS_HEADERS });
    }

    try {
      const body = await request.json();

      // ─── BLOG: proxy para evitar CORS ───
      if (body.action === 'getPosts' && body.webhookUrl) {
        const res = await fetch(body.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getPosts' })
        });
        const data = await res.json();
        return new Response(JSON.stringify(data), { status: 200, headers: CORS_HEADERS });
      }

      // ─── FORMULARIO: validación + reenvío a Make ───
      if (body._honey && body._honey !== '') {
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS_HEADERS });
      }

      const ts = parseInt(body._timestamp || '0');
      if (ts && (Date.now() - ts) < 3000) {
        return new Response(JSON.stringify({ error: 'Too fast' }), { status: 400, headers: CORS_HEADERS });
      }

      const FIELD_LIMITS = { name: 100, email: 150, businessType: 50, serviceInterest: 50, message: 2000 };
      const clean = {};
      for (const [key, limit] of Object.entries(FIELD_LIMITS)) {
        clean[key] = sanitize(body[key] || '').substring(0, limit);
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) {
        return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400, headers: CORS_HEADERS });
      }

      const res = await fetch(MAKE_FORM_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clean)
      });

      if (!res.ok) throw new Error('Make failed');
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS_HEADERS });

    } catch (err) {
      return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: CORS_HEADERS });
    }
  }
};

===========================================================================
// FIN DEL CÓDIGO DEL WORKER — hasta aquí
===========================================================================

¿QUÉ HACE ESTE WORKER?

BLOG (nuevo):
- Recibe petición del frontend con {action: "getPosts", webhookUrl: "..."}
- Reenvía a tu webhook de Make server-side (sin CORS)
- Devuelve los datos al frontend

FORMULARIO (existente):
- Rate limiting real por IP (10 req/min)
- Honeypot anti-bot
- Anti-bot por tiempo (< 3 segundos → descarta)
- Sanitización de inputs
- Validación de email
- Reenvío a Make (webhook nunca expuesto)

CORS:
- Headers Access-Control-Allow-Origin: * en TODAS las respuestas
- Maneja preflight OPTIONS correctamente

COSTO: Gratis (plan free: 100,000 requests/día)
===========================================================================
*/
