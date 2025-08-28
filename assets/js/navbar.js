document.addEventListener('DOMContentLoaded', function () {

  const whatsappButton = document.createElement('button');
  whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
  whatsappButton.className = 'whatsapp-button';
  whatsappButton.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    background: #25D366;
    color: white;
    border: none;
    border-radius: 50%;
    width: 70px;
    height: 70px;
    cursor: pointer;
    opacity: 1;
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: pulse 2s infinite;
  `;

  // Create small blinking chat dot
  const chatDot = document.createElement('span');
  chatDot.style.cssText = `
    position: absolute;
    top: 8px;
    right: 8px;
    width: 12px;
    height: 12px;
    background: #FF3B30;
    border-radius: 50%;
    animation: blink 1s infinite;
  `;
  whatsappButton.appendChild(chatDot);

  // WhatsApp pre-filled message
  const phone = "919063021489";
  const message =  "Hi! ARCHEDGE.\n \nI am interested in getting more information regarding your services.";
  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  whatsappButton.addEventListener('click', () => {
    window.open(whatsappLink, "_blank");
  });

  document.body.appendChild(whatsappButton);

  // Hover effect
  whatsappButton.addEventListener('mouseover', () => {
    whatsappButton.style.transform = 'scale(1.2)';
  });
  whatsappButton.addEventListener('mouseout', () => {
    whatsappButton.style.transform = 'scale(1)';
  });

  // Add keyframes for pulse and blink dynamically
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    @keyframes blink {
      0%, 50%, 100% { opacity: 1; }
      25%, 75% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // Back to top button
  const backToTopButton = document.createElement('button');
  backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopButton.className = 'back-to-top';
  backToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
        font-size: 18px;
    `;

  document.body.appendChild(backToTopButton);


  backToTopButton.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
      backToTopButton.style.opacity = '1';
    } else {
      backToTopButton.style.opacity = '0';
    }
  });

  // Run modal logic safely after delay
  setTimeout(() => {
    const autoModal = document.getElementById("autoFormModal");
    const autoCloseBtn = document.getElementById("closeAutoForm");
    const autoForm = document.getElementById("autoForm");
    const loader = document.getElementById("loader");

    // Only proceed if modal exists
    if (!autoModal) return;



    // Check if user already submitted today
    function hasSubmittedAutoToday() {
      const lastSubmit = localStorage.getItem("pdfFormSubmitTime");
      if (!lastSubmit) return false;

      const now = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in ms

      return now - parseInt(lastSubmit, 10) < oneDay;
    }

    // Auto open modal if not submitted today
    const modal = document.getElementById("pdfFormModal");

    const isModalHidden = modal && window.getComputedStyle(modal).display === "none";

    if ((modal && isModalHidden || !modal) && !hasSubmittedAutoToday()) {
      autoModal.style.display = "flex";
    }

    // Close modal
    if (autoCloseBtn) {
      autoCloseBtn.addEventListener("click", () => {
        autoModal.style.display = "none";
      });
    }

    // Close modal if click outside
    window.addEventListener("click", (e) => {
      if (e.target === autoModal) {
        autoModal.style.display = "none";
      }
    });

    // Form submission
    if (autoForm) {
      autoForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("autoName").value.trim();
        const email = document.getElementById("autoEmail").value.trim();
        const phone = document.getElementById("autoPhone").value.trim();

        const namePattern = /^[A-Za-z\s]+$/;
        const phonePattern = /^[6-9][0-9]{9}$/;
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

        if (!name.match(namePattern) || name.length < 3) {
          alert("Please enter a valid full name (letters only).");
          return;
        }

        if (!phone.match(phonePattern)) {
          alert("Please enter a valid 10-digit phone number");
          return;
        }

        if (!email.match(emailPattern)) {
          alert("Please enter a valid email address.");
          return;
        }

        if (loader) loader.style.display = "flex";

        const loaderText = loader?.querySelector(".loader-content");
        if (loaderText) {
          loaderText.textContent =
            "🛍️  Your visit means a lot! Check out our premium products and enjoy browsing…";
        }

        fetch(
          "https://script.google.com/macros/s/AKfycbz8SJRBA73R77PFd4JM-IkFE_YExR5GzQ3tH-n_ssRM3ur2dAZE2naMqD_BkJOKC3Pq/exec",
          {
            method: "POST",
            body: JSON.stringify({
              name,
              email,
              phone,
              sheetName: "product-seen-clients",
            }),
          }
        )
          .then((response) => {
            localStorage.setItem("pdfFormSubmitTime", new Date().getTime());
            autoModal.style.display = "none";
            if (loader) loader.style.display = "none";
            autoForm.reset();
          })
          .catch((err) => {
            console.error("Error:", err);
            if (loader) loader.style.display = "none";
            alert("Something went wrong. Please try again.");
          });
      });
    }
  }, 4000); // 4 sec delay




  const header = document.querySelector('.header');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');

  const navMenu = document.querySelector('.nav-menu');
  const navItems = document.querySelectorAll('.nav-item');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile Hamburger Menu Toggle
  mobileMenuToggle.addEventListener('click', function (e) {
    console.log("menu click")
    e.stopPropagation();
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!header.contains(e.target) && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Mobile dropdown handling - Fix for immediate close issue
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.brands-dropdown, .categories-dropdown');

    if (dropdown) {
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 821) {
          e.preventDefault();
          e.stopPropagation();

          // Close other dropdowns
          document.querySelectorAll('.brands-dropdown.open, .categories-dropdown.open').forEach(openDropdown => {
            if (openDropdown !== dropdown) {
              openDropdown.classList.remove('open');
            }
          });

          // Toggle current dropdown
          dropdown.classList.toggle('open');
        }
      });
    }
  });

  // Close dropdown when clicking on menu items without dropdown
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      const hasDropdown = this.nextElementSibling &&
        (this.nextElementSibling.classList.contains('brands-dropdown') ||
          this.nextElementSibling.classList.contains('categories-dropdown'));

      if (!hasDropdown) {
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
          document.body.style.overflow = '';
        }

        // Handle smooth scroll for internal links
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetSection = document.querySelector(href);
          if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          }
        }
      }
    });
  });

  // Close mobile menu on window resize
  window.addEventListener('resize', function () {
    if (window.innerWidth > 820) {
      navMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      document.body.style.overflow = '';

      // Close all dropdowns on desktop
      document.querySelectorAll('.brands-dropdown.open, .categories-dropdown.open').forEach(dropdown => {
        dropdown.classList.remove('open');
      });
    }
  });

  // Header scroll effect
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
});
