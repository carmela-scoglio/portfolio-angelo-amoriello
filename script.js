document.addEventListener('DOMContentLoaded', function() {
  // --------------------------
  // Mobile menu toggle
  // --------------------------
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      const isOpen = !mobileMenu.classList.contains('hidden');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------
  // Smooth scrolling
  // --------------------------
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  // --------------------------
  // Contact form
  // --------------------------
  const contactForm = document.querySelector('form[name="contact"]');
  const successBox = document.getElementById('form-success');

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    field.classList.remove('error');
    field.style.borderColor = '';

    if (field.required && !value) isValid = false;
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) isValid = false;
    }

    if (!isValid) {
      field.classList.add('error');
      field.style.borderColor = '#ef4444';
    }
    return isValid;
  }

  if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea');

    // Validazione in tempo reale
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });
      input.addEventListener('input', function() {
        if (this.classList.contains('error')) this.classList.remove('error');
      });
    });

    // Submit form con fetch e popup
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      let isValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) isValid = false;
      });

      if (!isValid) {
        const firstError = contactForm.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      // Invio dati a Netlify
      const formData = new FormData(contactForm);
      fetch('/', { method: 'POST', body: formData })
        .then(() => {
          contactForm.reset();
          successBox.classList.remove('hidden');
        })
        .catch(err => console.error(err));
    });

    // Chiudi popup cliccando fuori
    successBox.addEventListener('click', function(e) {
      if (e.target === successBox) successBox.classList.add('hidden');
    });
  }

  // --------------------------
  // Navbar background on scroll
  // --------------------------
  const navbar = document.querySelector('nav');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', function() {
    const currentScrollY = window.scrollY;
    if (navbar) {
      if (currentScrollY > 100) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
    lastScrollY = currentScrollY;
  });

  // --------------------------
  // Lazy loading immagini
  // --------------------------
  const images = document.querySelectorAll('img[data-src]');
  if (images.length > 0) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    images.forEach(img => imageObserver.observe(img));
  }

  // --------------------------
  // Keyboard navigation
  // --------------------------
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.focus();
    }
  });

  // --------------------------
  // Performance scroll throttle
  // --------------------------
  let ticking = false;
  function updateOnScroll() { ticking = false; }
  function requestTick() { if (!ticking) { requestAnimationFrame(updateOnScroll); ticking = true; } }
});
