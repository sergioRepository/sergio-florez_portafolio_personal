/**
 * ==========================================================================
 * PORTAFOLIO PROFESIONAL - SERGIO DANIEL FLOREZ LOPEZ
 * JavaScript Vanilla Modular
 * Funcionalidades:
 * 1. Alternador de Tema Claro / Oscuro con persistencia en localStorage
 * 2. Menú de Navegación Móvil accesible (ARIA + Teclado)
 * 3. Validación y feedback del Formulario de Contacto en tiempo real
 * 4. Resaltado de navegación activa (Scroll Spy con IntersectionObserver)
 * 5. Desplazamiento suave y accesibilidad
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     01. GESTIÓN DEL TEMA (LIGHT / DARK)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Comprobar preferencia guardada o preferencia del sistema
  const getPreferredTheme = () => {
    const storedTheme = localStorage.getItem('sdf_portfolio_theme');
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Aplicar tema al DOM
  const setTheme = (theme) => {
    rootElement.setAttribute('data-theme', theme);
    localStorage.setItem('sdf_portfolio_theme', theme);
    
    if (themeToggleBtn) {
      const isDark = theme === 'dark';
      themeToggleBtn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      themeToggleBtn.setAttribute('title', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
    }
  };

  // Inicializar tema
  setTheme(getPreferredTheme());

  // Evento click para alternar
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(nextTheme);
    });
  }

  // Sincronizar si cambia la preferencia del sistema operativo
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('sdf_portfolio_theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });


  /* ==========================================================================
     02. MENÚ MÓVIL ACCESIBLE
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const openMobileNav = () => {
    if (!mobileNavDrawer || !mobileMenuBtn) return;
    mobileNavDrawer.classList.add('is-open');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    if (mobileNavBackdrop) {
      mobileNavBackdrop.classList.add('is-visible');
      mobileNavBackdrop.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo
    mobileNavClose?.focus();
  };

  const closeMobileNav = () => {
    if (!mobileNavDrawer || !mobileMenuBtn) return;
    mobileNavDrawer.classList.remove('is-open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    if (mobileNavBackdrop) {
      mobileNavBackdrop.classList.remove('is-visible');
      mobileNavBackdrop.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = ''; // Restaurar scroll
    mobileMenuBtn.focus();
  };

  const toggleMobileNav = () => {
    const isOpen = mobileNavDrawer?.classList.contains('is-open');
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileNav);
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', closeMobileNav);
  }

  // Cerrar al pulsar cualquier enlace del menú móvil
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavDrawer?.classList.contains('is-open')) {
      closeMobileNav();
    }
  });


  /* ==========================================================================
     03. SCROLL SPY (RESALTAR SECCIÓN ACTIVA EN NAVEGACIÓN)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.main-nav .nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          desktopNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }


  /* ==========================================================================
     04. VALIDACIÓN DEL FORMULARIO DE CONTACTO
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    const inputs = {
      nombre: document.getElementById('nombre'),
      email: document.getElementById('email'),
      motivo: document.getElementById('motivo'),
      mensaje: document.getElementById('mensaje')
    };

    const errors = {
      nombre: document.getElementById('nombre-error'),
      email: document.getElementById('email-error'),
      motivo: document.getElementById('motivo-error'),
      mensaje: document.getElementById('mensaje-error')
    };

    // Reglas de validación
    const validateField = (fieldKey) => {
      const field = inputs[fieldKey];
      const errorElem = errors[fieldKey];
      if (!field || !errorElem) return true;

      let isValid = true;
      let errorMessage = '';

      const value = field.value.trim();

      switch (fieldKey) {
        case 'nombre':
          if (!value) {
            isValid = false;
            errorMessage = 'Por favor, ingresa tu nombre completo.';
          } else if (value.length < 2) {
            isValid = false;
            errorMessage = 'El nombre debe contener al menos 2 caracteres.';
          }
          break;

        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value) {
            isValid = false;
            errorMessage = 'Por favor, ingresa un correo electrónico.';
          } else if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Formato de correo no válido (ej. usuario@dominio.com).';
          }
          break;

        case 'motivo':
          if (!value) {
            isValid = false;
            errorMessage = 'Selecciona el área o motivo de tu consulta.';
          }
          break;

        case 'mensaje':
          if (!value) {
            isValid = false;
            errorMessage = 'Por favor, describe los detalles de tu consulta.';
          } else if (value.length < 10) {
            isValid = false;
            errorMessage = 'El mensaje debe tener al menos 10 caracteres explicativos.';
          }
          break;
      }

      // Renderizar feedback de error
      if (!isValid) {
        field.classList.add('is-invalid');
        field.setAttribute('aria-invalid', 'true');
        errorElem.textContent = errorMessage;
        errorElem.classList.add('is-visible');
      } else {
        field.classList.remove('is-invalid');
        field.setAttribute('aria-invalid', 'false');
        errorElem.textContent = '';
        errorElem.classList.remove('is-visible');
      }

      return isValid;
    };

    // Validación interactiva en evento blur e input
    Object.keys(inputs).forEach(key => {
      const el = inputs[key];
      if (el) {
        el.addEventListener('blur', () => validateField(key));
        el.addEventListener('input', () => {
          if (el.classList.contains('is-invalid')) {
            validateField(key);
          }
        });
      }
    });

    // Envío del formulario
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let formIsValid = true;
      Object.keys(inputs).forEach(key => {
        const fieldValid = validateField(key);
        if (!fieldValid) formIsValid = false;
      });

      if (!formIsValid) {
        // Enfocar el primer elemento inválido
        const firstInvalid = contactForm.querySelector('.is-invalid');
        firstInvalid?.focus();

        if (formFeedback) {
          formFeedback.textContent = 'Hay campos pendientes de corrección antes de enviar.';
          formFeedback.className = 'form-feedback is-error';
        }
        return;
      }

      // Estado de envío en curso
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Procesando...</span>`;
      }

      if (formFeedback) {
        formFeedback.textContent = 'Validando y encriptando parámetros de consulta...';
        formFeedback.className = 'form-feedback';
        formFeedback.style.display = 'block';
      }

      // Simulación de envío exitoso (Vanilla JS)
      setTimeout(() => {
        if (formFeedback) {
          formFeedback.textContent = '✓ Mensaje enviado con éxito. Sergio Daniel Florez Lopez responderá en menos de 24 horas.';
          formFeedback.className = 'form-feedback is-success';
        }

        contactForm.reset();

        // Limpiar clases de validación
        Object.values(inputs).forEach(input => {
          input.classList.remove('is-invalid');
          input.removeAttribute('aria-invalid');
        });

        // Restaurar botón de envío
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Enviar mensaje</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          `;
        }
      }, 750);
    });
  }


  /* ==========================================================================
     05. BOTÓN VOLVER ARRIBA
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     06. CONSOLE STAMP (REGISTRO TÉCNICO EN HERRAMIENTAS DE DESARROLLADOR)
     ========================================================================== */
  console.log(
    "%c[SERGIO DANIEL FLOREZ LOPEZ]%c // BACKEND & DEFENSIVE CYBERSECURITY // SYSTEMS READY",
    "background: #145CFF; color: #FFFFFF; font-weight: bold; padding: 4px 8px; border: 2px solid #111111;",
    "background: #FFF8E7; color: #111111; font-weight: bold; padding: 4px 8px; border: 2px solid #111111;"
  );

});
