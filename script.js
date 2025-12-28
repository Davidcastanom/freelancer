// Espera a que todo el contenido de la página se cargue
document.addEventListener('DOMContentLoaded', () => {

    // --- MENÚ DE NAVEGACIÓN MÓVIL ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    // Al hacer clic en el ícono de hamburguesa, alterna la clase 'active' para mostrar/ocultar el menú
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Al hacer clic en un enlace del menú, se cierra el menú móvil
    navLinks.forEach(link => link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));


    // --- CAMBIO DE ESTILO DEL HEADER AL HACER SCROLL ---
    const header = document.querySelector("header");

    window.addEventListener("scroll", () => {
        // Si la posición de scroll es mayor a 50px, añade la clase 'scrolled' al header
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
    // --- MANEJO DEL FORMULARIO DE CONTACTO ---
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) { // Verificamos que el formulario exista para evitar errores
        contactForm.addEventListener('submit', function(event) {
            // Previene el envío tradicional del formulario para manejarlo con JavaScript
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
            // --- ENVÍO REAL DEL FORMULARIO A MAKE ---
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
            });
        });
    }

    // Función para mostrar mensajes de éxito o error
    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = type; // Añade la clase 'success' o 'error'
        
        // Oculta el mensaje después de 5 segundos
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = '';
        }, 5000);
    }

    // Función simple para validar el formato del email
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }


});


