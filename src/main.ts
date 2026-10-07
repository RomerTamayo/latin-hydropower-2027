// Los estilos se enlazan desde cada HTML (<link rel="stylesheet">) para evitar el parpadeo sin estilos.

const pageLoadTime = Date.now();
const ADMIN_EMAIL = 'florestromer768@gmail.com';
const LAHS_WHATSAPP = '59170000000'; // Número de referencia del comité organizador UMSA

// URL de Google Apps Script para LAHS 2027
const GOOGLE_SCRIPT_LAHS_URL = (window as unknown as { GOOGLE_SHEETS_ENDPOINT?: string }).GOOGLE_SHEETS_ENDPOINT || '';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCountdown();
  initRegistrationForm();
  initAbstractForm();
});

/**
 * Navbar móvil y scroll
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
    };

    menuToggle.addEventListener('click', () => {
      setOpen(!navMenu.classList.contains('active'));
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setOpen(false));
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
 * Contador regresivo para 7 de Junio de 2027
 */
function initCountdown(): void {
  const countDays = document.getElementById('countDays');
  const countHours = document.getElementById('countHours');
  const countMins = document.getElementById('countMins');

  if (!countDays) return;

  const targetDate = new Date('2027-06-07T09:00:00-04:00').getTime();

  function update(): void {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (countDays) countDays.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (countDays) countDays.textContent = String(days);
    if (countHours) countHours.textContent = String(hours).padStart(2, '0');
    if (countMins) countMins.textContent = String(mins).padStart(2, '0');
  }

  update();
  setInterval(update, 60000);
}

/**
 * Formulario de Inscripciones (Registro de Participantes)
 */
function initRegistrationForm(): void {
  const form = document.getElementById('registrationForm') as HTMLFormElement | null;
  const feedback = document.getElementById('registrationFeedback');
  const submitBtn = document.getElementById('btnSubmitReg') as HTMLButtonElement | null;

  if (!form || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Anti-spam check (Honeypot + Time-gate)
    const honeypot = (document.getElementById('regHoneypot') as HTMLInputElement)?.value;
    const duracionMs = Date.now() - pageLoadTime;

    if ((honeypot && honeypot.trim().length > 0) || duracionMs < 2000) {
      feedback.className = 'form-feedback success';
      feedback.textContent = '¡Inscripción registrada correctamente!';
      form.reset();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Procesando inscripción...';
    }

    const nombre = (document.getElementById('firstname') as HTMLInputElement)?.value || '';
    const apellido = (document.getElementById('lastname') as HTMLInputElement)?.value || '';
    const email = (document.getElementById('email') as HTMLInputElement)?.value || '';
    const telefono = (document.getElementById('phone') as HTMLInputElement)?.value || '';
    const pais = (document.getElementById('country') as HTMLSelectElement)?.value || '';
    const institucion = (document.getElementById('institution') as HTMLInputElement)?.value || '';
    const categoria = (document.getElementById('category') as HTMLSelectElement)?.value || '';
    const comentarios = (document.getElementById('comments') as HTMLTextAreaElement)?.value || '';

    // Enviar a Google Apps Script si está configurado
    if (GOOGLE_SCRIPT_LAHS_URL) {
      try {
        const payload = new URLSearchParams();
        payload.append('tipo', 'inscripcion');
        payload.append('nombre', `${nombre} ${apellido}`);
        payload.append('email', email);
        payload.append('telefono', telefono);
        payload.append('pais', pais);
        payload.append('institucion', institucion);
        payload.append('categoria', categoria);
        payload.append('comentarios', comentarios);
        payload.append('notifEmail', ADMIN_EMAIL);

        await fetch(GOOGLE_SCRIPT_LAHS_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: payload
        });
      } catch (err) {
        console.error('Error enviando registro LAHS a Google Sheets:', err);
      }
    }

    // Enlace a WhatsApp de confirmación
    const waText = `*Inscripción LAHS 2027 (La Paz, Bolivia)*\n` +
      `👤 *Participante:* ${nombre} ${apellido}\n` +
      `📧 *Email:* ${email}\n` +
      `🏢 *Institución:* ${institucion}\n` +
      `🌎 *País:* ${pais}\n` +
      `🏷️ *Categoría:* ${categoria}\n` +
      `💬 *Detalles:* ${comentarios || 'Ninguno'}`;

    const waUrl = `https://wa.me/${LAHS_WHATSAPP}?text=${encodeURIComponent(waText)}`;

    feedback.className = 'form-feedback success';
    feedback.innerHTML = `
      <p><strong>¡Registro recibido con éxito, ${nombre}!</strong> Se ha añadido tu preinscripción a la lista del congreso.</p>
      <p style="margin-top: 8px;">
        Hemos notificado a la coordinación (${ADMIN_EMAIL}). Si deseas confirmar de inmediato por WhatsApp, 
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="font-weight: 700; text-decoration: underline; color: #0284c7;">
          haz clic aquí
        </a>.
      </p>
    `;

    form.reset();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Completar Inscripción';
    }
  });
}

/**
 * Formulario de Envío de Resúmenes (Call for Papers)
 */
function initAbstractForm(): void {
  const form = document.getElementById('abstractForm') as HTMLFormElement | null;
  const feedback = document.getElementById('abstractFeedback');
  const submitBtn = document.getElementById('btnSubmitAbstract') as HTMLButtonElement | null;

  if (!form || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Anti-spam check
    const honeypot = (document.getElementById('absHoneypot') as HTMLInputElement)?.value;
    const duracionMs = Date.now() - pageLoadTime;

    if ((honeypot && honeypot.trim().length > 0) || duracionMs < 2000) {
      feedback.className = 'form-feedback success';
      feedback.textContent = '¡Resumen recibido correctamente!';
      form.reset();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando resumen...';
    }

    const title = (document.getElementById('title') as HTMLInputElement)?.value || '';
    const authors = (document.getElementById('authors') as HTMLInputElement)?.value || '';
    const email = (document.getElementById('email') as HTMLInputElement)?.value || '';
    const theme = (document.getElementById('theme') as HTMLSelectElement)?.value || '';
    const abstractText = (document.getElementById('abstract') as HTMLTextAreaElement)?.value || '';

    // Enviar a Google Apps Script
    if (GOOGLE_SCRIPT_LAHS_URL) {
      try {
        const payload = new URLSearchParams();
        payload.append('tipo', 'resumen');
        payload.append('titulo', title);
        payload.append('autores', authors);
        payload.append('email', email);
        payload.append('ejeTematico', theme);
        payload.append('resumen', abstractText);
        payload.append('notifEmail', ADMIN_EMAIL);

        await fetch(GOOGLE_SCRIPT_LAHS_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: payload
        });
      } catch (err) {
        console.error('Error enviando resumen LAHS a Google Sheets:', err);
      }
    }

    feedback.className = 'form-feedback success';
    feedback.innerHTML = `
      <p><strong>¡Resumen recibido con éxito!</strong></p>
      <p>El trabajo <em>"${title}"</em> ha sido remitido al Comité Científico de LAHS 2027. Recibirás la notificación de evaluación en tu correo (${email}).</p>
    `;

    form.reset();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Resumen Científico';
    }
  });
}
