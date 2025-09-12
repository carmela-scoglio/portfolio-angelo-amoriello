// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  
  // Mobile menu toggle
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      
      // Aggiungi animazione ARIA per accessibilità
      const isOpen = !mobileMenu.classList.contains('hidden');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Chiudi il menu mobile quando si clicca su un link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scrolling per i link di navigazione (fallback per browser che non supportano CSS scroll-behavior)
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        e.preventDefault();
        
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Contact form enhancement
  const contactForm = document.querySelector('form[name="contact"]');
  
  if (contactForm) {
    // Basic form validation enhancement
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      // Real-time validation feedback
      input.addEventListener('blur', function() {
        validateField(this);
      });

      input.addEventListener('input', function() {
        // Remove error styling when user starts typing
        if (this.classList.contains('error')) {
          this.classList.remove('error');
        }
      });
    });

    contactForm.addEventListener('submit', function(e) {
      let isValid = true;
      
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        e.preventDefault();
        
        // Focus sul primo campo con errore
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
          firstError.focus();
        }
      }
    });
  }

  // Function per validare i campi del form
  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remove previous error styling
    field.classList.remove('error');
    
    // Check required fields
    if (field.hasAttribute('required') && !value) {
      isValid = false;
    }
    
    // Check email format
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
      }
    }
    
    // Add error styling if invalid
    if (!isValid) {
      field.classList.add('error');
      field.style.borderColor = '#ef4444'; // red-500
    } else {
      field.style.borderColor = ''; // Reset to default
    }
    
    return isValid;
  }

  // Navbar background on scroll
  const navbar = document.querySelector('nav');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', function() {
    const currentScrollY = window.scrollY;
    
    if (navbar) {
      if (currentScrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      // // Optional: Hide/show navbar on scroll
      // if (currentScrollY > lastScrollY && currentScrollY > 100) {
      //   navbar.style.transform = 'translateY(-100%)';
      // } else {
      //   navbar.style.transform = 'translateY(0)';
      // }
    }
    
    lastScrollY = currentScrollY;
  });

  // Lazy loading per le immagini (se necessario)
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

  // Keyboard navigation enhancement
  document.addEventListener('keydown', function(e) {
    // ESC per chiudere il menu mobile
    if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.focus();
    }
  });

  // Performance optimization: Throttle scroll events
  let ticking = false;
  
  function updateOnScroll() {
    // Qui puoi aggiungere altre funzioni che devono essere eseguite durante lo scroll
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }
  
  // Uncomment if you need optimized scroll handling
  // window.addEventListener('scroll', requestTick);

});

// Utility function per debounce
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}