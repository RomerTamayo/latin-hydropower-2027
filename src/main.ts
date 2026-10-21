// ===== MENÚ MÓVIL =====
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Prevenir scroll cuando el menú está abierto
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

// ===== CAMBIO DE ESTILO DEL NAVBAR AL HACER SCROLL =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== ANIMACIONES AL HACER SCROLL =====
const observerOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos para animar
document.querySelectorAll<HTMLElement>('.theme-card, .date-item, .speaker-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Añadir clase para animación
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    </style>
`);

// ===== FORMULARIO DE NEWSLETTER =====
const newsletterForm = document.querySelector<HTMLFormElement>('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector<HTMLInputElement>('input[type="email"]')?.value ?? '';

        // Aquí iría la lógica para enviar el email a un servidor
        alert(`¡Gracias por suscribirte! Te enviaremos novedades a: ${email}`);
        newsletterForm.reset();
    });
}

// ===== CERRAR MENÚ AL HACER CLICK EN UN ENLACE =====
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (menuToggle && navMenu && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ===== SUAVIZAR SCROLL PARA ENLACES INTERNOS =====
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const target = href && href.length > 1 ? document.querySelector(href) : null;
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
