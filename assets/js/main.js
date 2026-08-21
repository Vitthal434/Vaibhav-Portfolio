/**
 * Vaibhav Pandey — Portfolio Main Script
 * Lightweight vanilla JavaScript (< 5KB)
 * Features: Mobile Nav, IntersectionObserver for Active Nav & Scroll Reveal, Accessible Web3Forms AJAX
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollObservers();
  initContactForm();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    navLinks.classList.toggle('mobile-open');
  });

  // Close mobile nav when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Intersection Observers for Active Nav Highlighting and Scroll Reveal
 */
function initScrollObservers() {
  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Scroll Reveal
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('revealed'));
    } else {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    }
  }

  // 2. Active Section Nav Highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length > 0 && navLinks.length > 0 && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      root: null,
      threshold: 0.3,
      rootMargin: '-64px 0px -50% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));
  }
}

/**
 * Accessible Web3Forms AJAX Contact Form Submission
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !statusDiv || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset status
    statusDiv.className = 'form-status';
    statusDiv.textContent = '';

    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    const honeypot = form.querySelector('input[name="botcheck"]');

    // Honeypot check
    if (honeypot && honeypot.checked) {
      // Bot detected - silently ignore
      return;
    }

    // Client-side validation
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Please provide a valid email address.', 'error');
      return;
    }

    // Check if access key is still placeholder
    const accessKeyInput = form.querySelector('input[name="access_key"]');
    const accessKey = accessKeyInput ? accessKeyInput.value.trim() : '';

    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      showStatus('Thank you for reaching out! The contact form access key is being configured. Please email me directly at vaibhavpandey1567@gmail.com', 'error');
      return;
    }

    // Set Loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending Message...';
    showStatus('Transmitting your message securely...', 'loading');

    const formData = new FormData(form);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (response.status === 200 && data.success) {
        showStatus('✓ Thank you! Your message has been sent successfully. I will get back to you shortly.', 'success');
        form.reset();
      } else {
        showStatus('Unable to deliver message via form right now. Please reach out directly to vaibhavpandey1567@gmail.com', 'error');
      }
    } catch (err) {
      showStatus('Network error while sending. Please reach out directly to vaibhavpandey1567@gmail.com', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });

  function showStatus(message, type) {
    statusDiv.className = `form-status ${type}`;
    statusDiv.textContent = message;
  }
}
