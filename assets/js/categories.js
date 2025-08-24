document.addEventListener('DOMContentLoaded', () => {


  const modal = document.getElementById("pdfFormModal");
  const closeBtn = document.getElementById("closeForm");
  const form = document.getElementById("pdfForm");
  let currentPdf = null;

  // Check if user already submitted today
  function hasSubmittedToday() {
    const lastSubmit = localStorage.getItem("pdfFormSubmitTime");
    if (!lastSubmit) return false;

    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in ms

    return now - parseInt(lastSubmit, 10) < oneDay;
  }

  // Attach click to PDF buttons
  document.querySelectorAll(".pdfBtn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      currentPdf = btn.dataset.pdf;

      if (hasSubmittedToday()) {
        // ✅ Already submitted today → open directly
        window.open(currentPdf, "_blank");
      } else {
        // ❌ Not submitted yet → show form
        modal.style.display = "flex";
      }
    });
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Form validation + FormSubmit + PDF open
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // Patterns
    const namePattern = /^[A-Za-z\s]+$/;           // Only letters and spaces
    const phonePattern = /^[6-9][0-9]{9}$/;        // 10 digits starting with 6-9
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; // Basic email format

    // Validate name
    if (!name.match(namePattern) || name.length < 3) {
      alert("Please enter a valid full name (letters only).");
      return;
    }

    // Validate phone
    if (!phone.match(phonePattern)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    // Validate email only if entered
    if (email.length > 0 && !email.match(emailPattern)) {
      alert("Please enter a valid email address.");
      return;
    }


    // ✅ Send to FormSubmit
    fetch("https://formsubmit.co/archedge.pro@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, phone })
    })
      .then(res => {


        // ✅ Save submission timestamp
        localStorage.setItem("pdfFormSubmitTime", new Date().getTime());

        // ✅ Open PDF after sending
        if (currentPdf) {
          window.open(currentPdf, "_blank");
        }

        modal.style.display = "none";
        form.reset();
      })
      .catch(err => {
        console.error("❌ Error:", err);
        alert("Something went wrong. Please try again.");
      });
  });


  // Intersection Observer for reveal animations and product categories
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const category = entry.target.closest('.product-category');
      if (category && entry.isIntersecting) {
        category.classList.add('animated');
      }
    });
  }, { threshold: 0.2 });

  const elementsToObserve = document.querySelectorAll(
    '.products-hero, .feature-card, .about-section,  .product-category, .hero-subtitle'
  );
  elementsToObserve.forEach(el => observer.observe(el));

  // Scroll down indicator
  document.querySelector('.scroll-down-indicator')?.addEventListener('click', () => {
    const nextSection = document.querySelector('.products-section'); // change if needed
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Header and hero section animation interval
  const header = document.getElementById('heroHeader');
  setInterval(() => {
    if (window.scrollY <= 150) {
      header.style.transform = 'translateY(-30px)';
      setTimeout(() => {
        header.style.transform = 'translateY(0)';
      }, 500);
    }
  }, 3500);

  // Animated hero title letters
  const title = document.querySelector(".hero-title");
  if (title) {
    const text = title.getAttribute("data-text");
    title.innerHTML = "";
    [...text].forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.animationDelay = `${i * 0.03}s`;
      title.appendChild(span);
    });
  }

  // Scroll progress indicator
  window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = scrollPercent + '%';
    }
  });

  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // Parallax effect for hero section background
  window.addEventListener('scroll', () => {
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
      const scrolled = window.pageYOffset;
      parallaxBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });

  // Enhanced Intersection Observer for reveal animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .scale-reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Floating particles
  const particlesContainer = document.querySelector('.particles');
  if (particlesContainer) {
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = Math.random() * 4 + 2 + 'px';
      particle.style.height = particle.style.width;
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
      particlesContainer.appendChild(particle);
    }
  }

  // Parallax Effect Engine
  class ParallaxEngine {
    constructor() {
      this.elements = [];
      this.isScrolling = false;
      this.init();
    }

    init() {
      this.findElements();
      this.bindEvents();
      this.animate();
    }

    findElements() {
      const elements = document.querySelectorAll('[data-speed]');
      elements.forEach(el => {
        this.elements.push({
          element: el,
          speed: parseFloat(el.dataset.speed) || 0.5,
          initialY: el.offsetTop
        });
      });
    }

    bindEvents() {
      window.addEventListener('scroll', () => {
        if (!this.isScrolling) {
          requestAnimationFrame(() => {
            this.updateParallax();
            this.isScrolling = false;
          });
          this.isScrolling = true;
        }
      });

      
    }

    updateParallax() {
      const scrollTop = window.pageYOffset;
      this.elements.forEach(item => {
        const { element, speed } = item;
        element.style.transform = `translateY(${-scrollTop * speed}px)`;
      });

      const floatElements = document.querySelectorAll('.float-element');
      floatElements.forEach((el, index) => {
        const speed = 0.2 + (index * 0.1);
        const yPos = -(scrollTop * speed);
        const xPos = Math.sin(scrollTop * 0.001 + index) * 20;
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
      });
    }

   

    animate() {
      this.updateParallax();
      requestAnimationFrame(() => this.animate());
    }
  }

  new ParallaxEngine();
});
