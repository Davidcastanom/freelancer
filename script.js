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
    // 8. FILTROS DEL BLOG
    // Permite filtrar artículos del blog por categoría.
    // Los botones usan data-filter y los artículos data-category.
    // ======================================================================
    const blogFilters = document.querySelectorAll('.blog-filters .filter-btn');
    const blogCards = document.querySelectorAll('.blog-grid .blog-card');

    blogFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar botón activo
            blogFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            blogCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


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
