document.addEventListener('DOMContentLoaded', function () {

    
  const autoModal = document.getElementById("autoFormModal");
  const autoCloseBtn = document.getElementById("closeAutoForm");
  const autoForm = document.getElementById("autoForm");

  // Check if user already submitted today
  function hasSubmittedAutoToday() {
    const lastSubmit = localStorage.getItem("pdfFormSubmitTime");
    if (!lastSubmit) return false;

    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in ms

    return now - parseInt(lastSubmit, 10) < oneDay;
  }

  // Auto open after 1 sec if no submission today
  window.addEventListener("load", () => {
    setTimeout(() => {
      
      if (autoModal && !hasSubmittedAutoToday()) {
        autoModal.style.display = "flex";
      }
    }, 4000);
  });

  // Close modal
  autoCloseBtn.addEventListener("click", () => {
    autoModal.style.display = "none";
  });

  // Close modal if click outside the box
  window.addEventListener("click", (e) => {
    if (e.target === autoModal) {
      autoModal.style.display = "none";
    }
  });

  // Form submission
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

    document.getElementById("loader").style.display = "flex"; // show loader if exists

    // ✅ Send to Google Sheets (adjust sheet name if needed)
    fetch("https://script.google.com/macros/s/AKfycbz8SJRBA73R77PFd4JM-IkFE_YExR5GzQ3tH-n_ssRM3ur2dAZE2naMqD_BkJOKC3Pq/exec", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        phone,
        sheetName: "product-seen-clients" // 👈 NEW sheet tab
      })
    })
    .then(response => {
      localStorage.setItem("pdfFormSubmitTime", new Date().getTime());

      autoModal.style.display = "none";
      document.getElementById("loader").style.display = "none"; // hide loader
      autoForm.reset();
    })
    .catch(err => {
      console.error("Error:", err);
      document.getElementById("loader").style.display = "none"; // hide loader
      alert("Something went wrong. Please try again.");
    });
  });



  
    const header = document.querySelector('.header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile Hamburger Menu Toggle
    mobileMenuToggle.addEventListener('click', function (e) {
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
                if (window.innerWidth <= 768) {
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
        if (window.innerWidth > 768) {
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
