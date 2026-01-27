// DOM Elements
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const tiltCard = document.getElementById('tiltCard');
const particlesContainer = document.getElementById('particles');
const accordionItems = document.querySelectorAll('.accordion-item');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initParticles();
  initTiltCard();
  initAccordion();
  initScrollAnimations();
  initSkillBars();
});

// Navigation
function initNavigation() {
  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      const link = navLinks.querySelector(`a[href="#${sectionId}"]`);
      
      if (link) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link.style.color = 'var(--accent-primary)';
        } else {
          link.style.color = '';
        }
      }
    });
  });
}

// Particles Animation
function initParticles() {
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    createParticle();
  }
}

function createParticle() {
  const particle = document.createElement('div');
  particle.classList.add('particle');
  
  // Random position
  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = Math.random() * 100 + '%';
  
  // Random drift direction
  particle.style.setProperty('--drift-x', (Math.random() - 0.5) * 200 + 'px');
  particle.style.setProperty('--drift-y', (Math.random() - 0.5) * 200 + 'px');
  
  // Random delay
  particle.style.animationDelay = Math.random() * 6 + 's';
  
  // Random duration variation
  particle.style.animationDuration = (4 + Math.random() * 4) + 's';
  
  particlesContainer.appendChild(particle);
  
  // Remove and recreate particle when animation ends
  particle.addEventListener('animationend', () => {
    particle.remove();
    createParticle();
  });
}

// 3D Tilt Card
function initTiltCard() {
  if (!tiltCard) return;
  
  const cardInner = tiltCard.querySelector('.tilt-card-inner');
  
  tiltCard.addEventListener('mousemove', (e) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    tiltCard.style.animation = 'none';
    tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
    // Move glow with cursor
    const glow = cardInner.querySelector('.card-glow');
    if (glow) {
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      glow.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(0, 255, 136, 0.2), transparent 60%)`;
    }
  });
  
  tiltCard.addEventListener('mouseleave', () => {
    tiltCard.style.animation = '';
    tiltCard.style.transform = '';
    
    const glow = cardInner.querySelector('.card-glow');
    if (glow) {
      glow.style.background = '';
    }
  });
}

// Accordion
function initAccordion() {
  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all items
      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.accordion-content').style.maxHeight = '0';
        otherItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      });
      
      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// Scroll Animations
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        
        // Add delay if specified
        const delay = entry.target.dataset.aosDelay;
        if (delay) {
          entry.target.style.transitionDelay = delay + 'ms';
        }
      }
    });
  }, observerOptions);
  
  // Observe all elements with data-aos attribute
  document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
  });
  
  // Also animate elements that don't have data-aos but should animate
  const animateOnScroll = document.querySelectorAll('.skill-card, .project-card, .statement-card, .timeline-item');
  animateOnScroll.forEach((el, index) => {
    if (!el.hasAttribute('data-aos')) {
      el.setAttribute('data-aos', 'fade-up');
      el.dataset.aosDelay = (index % 4) * 100;
      observer.observe(el);
    }
  });
}

// Skill Bars Animation
function initSkillBars() {
  const skillCards = document.querySelectorAll('.skill-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const levelBar = entry.target.querySelector('.level-bar');
        if (levelBar) {
          // Trigger animation by forcing reflow
          levelBar.style.width = '0';
          setTimeout(() => {
            levelBar.style.width = '';
          }, 100);
        }
      }
    });
  }, { threshold: 0.5 });
  
  skillCards.forEach(card => observer.observe(card));
}

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Add typing effect to code block (optional enhancement)
function initTypingEffect() {
  const codeBlock = document.querySelector('.code-block code');
  if (!codeBlock) return;
  
  const originalHTML = codeBlock.innerHTML;
  codeBlock.innerHTML = '';
  
  let i = 0;
  const text = originalHTML;
  
  function typeWriter() {
    if (i < text.length) {
      codeBlock.innerHTML = text.substring(0, i + 1);
      i++;
      setTimeout(typeWriter, 20);
    }
  }
  
  // Start typing when card is in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        typeWriter();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  observer.observe(tiltCard);
}

// Initialize typing effect after a short delay
setTimeout(initTypingEffect, 1000);
