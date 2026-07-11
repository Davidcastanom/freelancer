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
    // ======================================================================
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = document.getElementById('name')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const businessType = document.getElementById('business-type')?.value || '';
            const serviceInterest = document.getElementById('service-interest')?.value || '';
            const message = document.getElementById('message')?.value.trim() || '';

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

            fetch("https://hook.us2.make.com/h2vfa8bul4uh13yz5wi1ujqshyl3k4rb", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    businessType: businessType,
                    serviceInterest: serviceInterest,
                    message: message
                })
            })
            .then(response => {
                if (!response.ok) throw new Error("Error en el envío");
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

    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
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
    }


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
    CONFIGURACIÓN DEL WEBHOOK DE NOTION
    ===========================================================
    Cambia esta URL por la URL de tu webhook en Make (Integromat).
    
    PASOS EN MAKE:
    1. Crea un nuevo Scenario
    2. Módulo 1: Webhooks > Custom webhook → copia la URL aquí
    3. Módulo 2: Notion > List database pages
       - Database ID: obtén el ID de tu base de datos de Notion
         (está en la URL: notion.so/<workspace>/<DATABASE_ID?v=...)
    4. Módulo 3: Webhooks > Response → devuelve JSON con los campos:
       id, title, excerpt, cover, date, dateFormatted, category, tags, contentUrl
    5. Activa el Scenario
    ===========================================================
    */
    const BLOG_WEBHOOK_URL = '';  // ← PON AQUÍ TU URL DE MAKE CUANDO LA TENGAS


    // --- Artículos de fallback (se muestran si el webhook no está configurado) ---
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
    const modalIframe = document.getElementById('modal-iframe');
    const modalTitle = document.getElementById('modal-title');
    const modalExcerpt = document.getElementById('modal-excerpt');
    const modalDate = document.getElementById('modal-date');
    const modalCategory = document.getElementById('modal-category');
    const modalLink = document.getElementById('modal-link');

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

        article.innerHTML = `
            <div class="blog-image">
                <img src="${post.cover || 'https://via.placeholder.com/800x450.png?text=Artículo'}" 
                     alt="${post.title}" loading="lazy">
                <span class="category-pill ${cat.cssClass}">${cat.label}</span>
            </div>
            <div class="blog-content">
                <time datetime="${post.date}">${post.dateFormatted || post.date}</time>
                <h3>${post.title}</h3>
                <p>${post.excerpt || ''}</p>
                <span class="btn btn-sm">
                    <i class="fas fa-book-open"></i> Leer Artículo
                </span>
            </div>
        `;

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
     * Carga la URL de Notion en un iframe para vista embebida.
     * @param {Object} post - Artículo a previsualizar
     */
    function openModal(post) {
        if (!blogModal) return;

        const cat = CATEGORY_MAP[post.category] || { label: post.category, cssClass: 'cat-ia' };

        modalTitle.textContent = post.title;
        modalExcerpt.textContent = post.excerpt || '';
        modalDate.textContent = post.dateFormatted || post.date;
        modalDate.setAttribute('datetime', post.date);
        modalCategory.textContent = cat.label;
        modalCategory.className = `category-pill ${cat.cssClass}`;

        if (post.contentUrl && post.contentUrl !== '#') {
            modalIframe.src = post.contentUrl;
            modalIframe.style.display = 'block';
            modalLink.href = post.contentUrl;
            modalLink.style.display = '';
        } else {
            modalIframe.style.display = 'none';
            modalLink.style.display = 'none';
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
        modalIframe.src = '';
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
        if (BLOG_WEBHOOK_URL) {
            // Fetch desde Make → Notion
            fetch(BLOG_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'getPosts' })
            })
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar artículos');
                return res.json();
            })
            .then(posts => {
                allPosts = Array.isArray(posts) ? posts : [];
                filterPosts();
            })
            .catch(err => {
                console.warn('Blog: webhook no disponible, usando artículos de fallback.', err);
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

});
