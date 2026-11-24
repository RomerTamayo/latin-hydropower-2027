document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initReveal();
    initCountdown();
    initProgramTabs();
    initContactForm();
    initHeroSlides();
    initGallery();
});

/**
 * Menú móvil y estilo del navbar al hacer scroll
 */
function initNavbar(): void {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        const setOpen = (open: boolean): void => {
            navMenu.classList.toggle('active', open);
            menuToggle.classList.toggle('active', open);
            menuToggle.setAttribute('aria-expanded', String(open));
            menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
            document.body.style.overflow = open ? 'hidden' : '';
        };

        menuToggle.addEventListener('click', () => setOpen(!navMenu.classList.contains('active')));
        navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1100) setOpen(false);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setOpen(false);
        });
    }

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const onScroll = (): void => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
}

/**
 * Animación de entrada de elementos al hacer scroll
 */
function initReveal(): void {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => observer.observe(el));
}

/**
 * Cuenta regresiva hasta el 7 de junio de 2027 (hora de La Paz)
 */
function initCountdown(): void {
    const days = document.getElementById('countDays');
    const hours = document.getElementById('countHours');
    const mins = document.getElementById('countMins');
    if (!days || !hours || !mins) return;

    const target = new Date('2027-06-07T09:00:00-04:00').getTime();

    const update = (): void => {
        const diff = Math.max(0, target - Date.now());
        days.textContent = String(Math.floor(diff / 86400000));
        hours.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
        mins.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    };

    update();
    setInterval(update, 30000);
}

/**
 * Pestañas por día en la página de programa
 */
function initProgramTabs(): void {
    const buttons = document.querySelectorAll<HTMLButtonElement>('.tab-btn');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => {
                b.classList.toggle('active', b === btn);
                b.setAttribute('aria-selected', String(b === btn));
            });
            document.querySelectorAll('.schedule-day').forEach(day => {
                day.classList.toggle('active', day.id === btn.dataset.day);
            });
        });
    });
}

/**
 * Formulario de contacto (el envío en línea aún no está habilitado)
 */
function initContactForm(): void {
    const form = document.getElementById('contactForm') as HTMLFormElement | null;
    const feedback = document.getElementById('contactFeedback');
    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        feedback.hidden = false;
        feedback.textContent = 'Gracias por tu interés. El envío de mensajes en línea se habilitará próximamente; mientras tanto, guarda tu consulta y vuelve a intentarlo más adelante.';
    });
}

/**
 * Fondo de bienvenida: las imágenes cambian automáticamente cada 5 segundos
 */
function initHeroSlides(): void {
    const slides = Array.from(document.querySelectorAll<HTMLElement>('.hero-slide'));
    if (slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let current = 0;
    const start = (): void => {
        setInterval(() => {
            if (document.hidden) return;
            const next = (current + 1) % slides.length;
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === next);
                slide.classList.toggle('previous', i === current);
            });
            current = next;
        }, 5000);
    };

    // Espera a que carguen las imágenes para evitar parpadeos
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start);
}

/**
 * Galería de represas a pantalla completa
 */
function initGallery(): void {
    const dialog = document.getElementById('gallery') as HTMLDialogElement | null;
    const opener = document.getElementById('galleryOpen');
    const track = dialog?.querySelector<HTMLElement>('.gallery-track');
    const counter = dialog?.querySelector('.gallery-count');
    if (!dialog || !opener || !track || !counter) return;

    const thumbs = Array.from(dialog.querySelectorAll<HTMLButtonElement>('.gallery-thumb'));
    const count = thumbs.length;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0;

    const render = (): void => {
        counter.textContent = `${current + 1} / ${count}`;
        thumbs.forEach((thumb, i) => thumb.setAttribute('aria-current', String(i === current)));
    };

    const goTo = (index: number, smooth = true): void => {
        const target = (index + count) % count;
        track.scrollTo({ left: target * track.clientWidth, behavior: smooth && !reduced ? 'smooth' : 'instant' });
    };

    track.addEventListener('scroll', () => {
        if (!track.clientWidth) return;
        current = Math.round(track.scrollLeft / track.clientWidth);
        render();
    }, { passive: true });

    opener.addEventListener('click', () => {
        dialog.showModal();
        goTo(0, false);
    });

    dialog.querySelector('.gallery-close')?.addEventListener('click', () => dialog.close());
    dialog.querySelector('.gallery-prev')?.addEventListener('click', () => goTo(current - 1));
    dialog.querySelector('.gallery-next')?.addEventListener('click', () => goTo(current + 1));
    thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => goTo(i)));

    // Un clic en el espacio vacío alrededor de la foto cierra la galería
    track.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).classList.contains('gallery-slide')) dialog.close();
    });

    dialog.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            goTo(current + (e.key === 'ArrowRight' ? 1 : -1));
        }
    });

    render();
}
