// ==========================================================================
// FLUJO BASE — SCRIPT PRINCIPAL
// Maneja la interactividad del sitio web:
// 1. Menú hamburguesa móvil
// 2. Header con efecto de scroll
// 3. Formulario de contacto con estado de carga
// 4. Portfolio táctil para móvil
// 5. Copyright dinámico (año actual)
// 6. Detección de página activa
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

    // Al hacer clic en el ícono de hamburguesa, alterna la clase 'active'
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Al hacer clic en un enlace del menú, se cierra el menú móvil
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
            // Previene el envío tradicional del formulario
            event.preventDefault();
            
            // Obtiene los valores de los campos del formulario
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            // --- VALIDACIÓN BÁSICA ---
            if (name === '' || email === '' || message === '') {
                showMessage('Por favor, completa todos los campos obligatorios.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showMessage('Por favor, introduce un correo electrónico válido.', 'error');
                return;
            }

            // --- ESTADO DE CARGA ---
            // Deshabilita el botón y muestra spinner mientras se envía
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            // --- ENVÍO DEL FORMULARIO A MAKE ---
            fetch("https://hook.us2.make.com/h2vfa8bul4uh13yz5wi1ujqshyl3k4rb", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    message: message
                })
            })
            .then(response => {
                if (!response.ok) throw new Error("Error en el envío");
    
                showMessage('¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.', 'success');
                contactForm.reset();
            })
            .catch(error => {
                console.error(error);
                showMessage('Hubo un error al enviar el mensaje. Intenta más tarde.', 'error');
            })
            .finally(() => {
                // Restaura el botón después del envío (éxito o error)
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            });
        });
    }

    /**
     * Muestra un mensaje de éxito o error en el formulario.
     * Se oculta automáticamente después de 5 segundos.
     * @param {string} text - Texto del mensaje
     * @param {string} type - 'success' o 'error'
     */
    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = type;
        
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = '';
        }, 5000);
    }

    /**
     * Valida el formato de un correo electrónico usando regex.
     * @param {string} email - Correo a validar
     * @returns {boolean} true si es válido, false si no
     */
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
            // En móvil, si el item ya tiene la clase 'tapped' y el clic
            // es en el overlay, deja que el enlace funcione normalmente
            if (item.classList.contains('tapped')) {
                // Si el clic fue en un enlace dentro del overlay, permitir la navegación
                const clickedLink = e.target.closest('a');
                if (clickedLink) {
                    return; // Permite que el enlace funcione
                }
                // Si no fue en un enlace, remove la clase tapped
                item.classList.remove('tapped');
                return;
            }

            // Solo aplicar en pantallas táctiles (ancho <= 768px)
            if (window.innerWidth <= 768) {
                // Primero, quitar tapped de todos los demás items
                portfolioItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('tapped');
                    }
                });
                // Aplicar tapped al item clickeado
                item.classList.add('tapped');
                // Prevenir la navegación del enlace en el primer tap
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

});
