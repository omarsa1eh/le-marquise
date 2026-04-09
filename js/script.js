/**
 * La Marquise - Facility Management
 * Main JavaScript File
 */

// ========================================
// Hero Slideshow
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.getElementById('heroSection');

    if (heroSection) {
        const slides = heroSection.querySelectorAll('.hero-slide');
        let currentSlide = 0;

        function nextSlide() {
            // Remove active class from current slide
            slides[currentSlide].classList.remove('active');

            // Move to next slide (loop back to 0 if at end)
            currentSlide = (currentSlide + 1) % slides.length;

            // Add active class to new current slide
            slides[currentSlide].classList.add('active');
        }

        // Change slide every 4 seconds
        setInterval(nextSlide, 4000);
    }
});

// ========================================
// Mobile Menu Toggle
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        // Initial ARIA state
        menuToggle.setAttribute('aria-controls', 'navMenu');
        menuToggle.setAttribute('aria-expanded', 'false');

        const setMenuOpen = (open) => {
            menuToggle.classList.toggle('active', open);
            navMenu.classList.toggle('active', open);
            menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            // Lock body scroll when mobile menu is open
            document.body.style.overflow = open ? 'hidden' : '';
        };

        menuToggle.addEventListener('click', function() {
            setMenuOpen(!navMenu.classList.contains('active'));
        });

        // Close menu when clicking a nav link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                setMenuOpen(false);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                setMenuOpen(false);
            }
        });

        // Escape key closes the menu
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                setMenuOpen(false);
                menuToggle.focus();
            }
        });
    }

    // ========================================
    // Services Dropdown Toggle
    // ========================================

    const servicesToggle = document.querySelector('.services-toggle');
    const navItemDropdown = document.querySelector('.nav-item-dropdown');

    if (servicesToggle && navItemDropdown) {
        // ARIA setup for screen reader support
        servicesToggle.setAttribute('aria-haspopup', 'true');
        servicesToggle.setAttribute('aria-expanded', 'false');

        const setExpanded = (expanded) => {
            navItemDropdown.classList.toggle('active', expanded);
            servicesToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        };

        // Detect if the device primarily uses touch input
        const isTouchPrimary = window.matchMedia('(hover: none), (pointer: coarse)').matches;

        if (isTouchPrimary) {
            // Touch / mobile: first tap opens dropdown, second tap navigates.
            servicesToggle.addEventListener('click', function(e) {
                if (!navItemDropdown.classList.contains('active')) {
                    e.preventDefault();
                    setExpanded(true);
                }
                // second tap when already open: let the link navigate.
            });
        } else {
            // Desktop: hover opens dropdown.
            navItemDropdown.addEventListener('mouseenter', () => setExpanded(true));
            navItemDropdown.addEventListener('mouseleave', () => setExpanded(false));

            // Keyboard support: open on focus
            servicesToggle.addEventListener('focus', () => setExpanded(true));
        }

        // Close on Escape regardless of input mode
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navItemDropdown.classList.contains('active')) {
                setExpanded(false);
                servicesToggle.focus();
            }
        });

        // Close dropdown when clicking outside (any input mode)
        document.addEventListener('click', function(event) {
            if (!navItemDropdown.contains(event.target)) {
                setExpanded(false);
            }
        });

        // Close dropdown when a service is selected
        const dropdownLinks = navItemDropdown.querySelectorAll('.dropdown-menu a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', () => setExpanded(false));
        });
    }

    // ========================================
    // Footer Services Link Handler
    // ========================================

    // Footer services links now navigate to services.html
    // No special handling needed - let them work normally

    // Check if page loaded with #services hash
    if (window.location.hash === '#services') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            if (navItemDropdown) {
                navItemDropdown.classList.add('active');
            }
        }, 300);
    }
});

// ========================================
// Navbar Scroll Effect
// ========================================

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// ========================================
// Intersection Observer for Reveal Animations
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all elements with the 'reveal' class
document.addEventListener('DOMContentLoaded', function() {
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(element => {
        observer.observe(element);
    });
});

// ========================================
// Contact Form Validation and Submission
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        const iframe         = document.getElementById('contactSubmitFrame');
        const subjectField   = document.getElementById('contactSubject');
        const submitButton   = contactForm.querySelector('button[type="submit"]');
        const originalLabel  = submitButton ? submitButton.textContent : '';
        let awaitingResponse = false;

        contactForm.addEventListener('submit', function(event) {
            // Clear previous errors
            clearErrors();

            // Get form values
            const firstName = document.getElementById('firstName').value.trim();
            const lastName  = document.getElementById('lastName').value.trim();
            const email     = document.getElementById('email').value.trim();
            const phone     = document.getElementById('phone').value.trim();
            const service   = document.getElementById('service').value;
            const message   = document.getElementById('message').value.trim();

            let isValid = true;

            // Validate First Name
            if (firstName === '') {
                showError('firstNameError', 'First name is required');
                isValid = false;
            }

            // Validate Last Name
            if (lastName === '') {
                showError('lastNameError', 'Last name is required');
                isValid = false;
            }

            // Validate Email
            if (email === '') {
                showError('emailError', 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('emailError', 'Please enter a valid email address');
                isValid = false;
            }

            // Validate Service Selection
            if (service === '') {
                showError('serviceError', 'Please select a service');
                isValid = false;
            }

            // Validate Message
            if (message === '') {
                showError('messageError', 'Message is required');
                isValid = false;
            } else if (message.length < 10) {
                showError('messageError', 'Message must be at least 10 characters');
                isValid = false;
            }

            if (!isValid) {
                event.preventDefault();
                return;
            }

            // Build a descriptive subject line dynamically.
            if (subjectField) {
                subjectField.value =
                    'Contact Message: ' + service + ' — ' + firstName + ' ' + lastName;
            }

            // Lock the button while we wait for the iframe to load.
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }
            awaitingResponse = true;

            // Do NOT preventDefault() — let the form submit naturally to the
            // hidden iframe via its target attribute, so FormSubmit receives
            // the multipart payload and emails it to finance@marquise.ae.
        });

        if (iframe) {
            iframe.addEventListener('load', function() {
                if (!awaitingResponse) return; // ignore initial blank load
                awaitingResponse = false;

                const successMessage = document.getElementById('formSuccess');
                if (successMessage) {
                    successMessage.classList.add('visible');
                    setTimeout(function() {
                        successMessage.classList.remove('visible');
                    }, 6000);
                }

                contactForm.reset();

                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalLabel;
                }
            });
        }

        // Real-time validation on blur
        const formInputs = contactForm.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            // Remove error styling on input
            input.addEventListener('input', function() {
                this.classList.remove('error');
                const errorElement = document.getElementById(this.id + 'Error');
                if (errorElement) {
                    errorElement.classList.remove('visible');
                }
            });
        });
    }
});

// Helper function to show errors
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');

        // Add error class to input
        const inputId = elementId.replace('Error', '');
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            inputElement.classList.add('error');
        }
    }
}

// Helper function to clear all errors
function clearErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(element => {
        element.classList.remove('visible');
    });

    const inputElements = document.querySelectorAll('.form-input');
    inputElements.forEach(element => {
        element.classList.remove('error');
    });
}

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    let isValid = true;

    switch(fieldId) {
        case 'firstName':
            if (value === '') {
                showError('firstNameError', 'First name is required');
                isValid = false;
            }
            break;

        case 'lastName':
            if (value === '') {
                showError('lastNameError', 'Last name is required');
                isValid = false;
            }
            break;

        case 'email':
            if (value === '') {
                showError('emailError', 'Email is required');
                isValid = false;
            } else if (!isValidEmail(value)) {
                showError('emailError', 'Please enter a valid email address');
                isValid = false;
            }
            break;

        case 'service':
            if (value === '') {
                showError('serviceError', 'Please select a service');
                isValid = false;
            }
            break;

        case 'message':
            if (value === '') {
                showError('messageError', 'Message is required');
                isValid = false;
            } else if (value.length < 10) {
                showError('messageError', 'Message must be at least 10 characters');
                isValid = false;
            }
            break;
    }

    return isValid;
}

// ========================================
// Smooth Scrolling for Anchor Links
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');

            // Only handle if it's a valid anchor (not just "#")
            if (href !== '#' && href.length > 1) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    event.preventDefault();

                    const navbarHeight = document.getElementById('navbar').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// ========================================
// Active Nav Link Based on Scroll Position
// ========================================

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ========================================
// Performance: Lazy Loading for Images
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// ========================================
// Accessibility: Focus Management
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Add skip to main content link functionality
    const skipLink = document.querySelector('a[href="#main-content"]');
    if (skipLink) {
        skipLink.addEventListener('click', function(event) {
            event.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.tabIndex = -1;
                mainContent.focus();
            }
        });
    }

    // Trap focus in mobile menu when open
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                menuToggle.focus();
            }
        });
    }
});

// ========================================
// Carousel System - Reusable Module
// ========================================
/**
 * makeCarousel - Creates a single-item carousel with left/right navigation
 * @param {HTMLElement} rootEl - The carousel container element
 * @param {Array} items - Array of data items to display
 * @param {Function} renderSlide - Function that renders each slide's HTML
 *
 * Usage:
 * makeCarousel(
 *   document.getElementById('myCarousel'),
 *   [{name: 'Item 1'}, {name: 'Item 2'}],
 *   (item) => `<div>${item.name}</div>`
 * );
 */
function makeCarousel(rootEl, items, renderSlide) {

    if (!rootEl || !items || items.length === 0) {
        console.error('Invalid carousel parameters', { rootEl, items });
        return;
    }

    const track = rootEl.querySelector('.track');
    const prevBtn = rootEl.querySelector('.arrow.prev');
    const nextBtn = rootEl.querySelector('.arrow.next');


    if (!track) {
        console.error('Track element not found in', rootEl);
        return;
    }

    let currentIndex = 0;

    // Initialize: render all slides
    function init() {
        track.innerHTML = '';
        items.forEach((item, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'slide';
            const html = renderSlide(item);
            slideDiv.innerHTML = html;
            track.appendChild(slideDiv);
        });
        render();
    }

    // Render current state
    function render() {
        const slides = track.querySelectorAll('.slide');
        const total = slides.length;


        slides.forEach((slide, i) => {
            // Calculate relative position
            const prevIndex = (currentIndex - 1 + total) % total;

            if (i === currentIndex) {
                // Active slide: center, fully visible
                slide.style.transform = 'translateX(0%)';
                slide.style.opacity = '1';
                slide.style.zIndex = '2';
            } else if (i === prevIndex) {
                // Previous slide: to the left, faded
                slide.style.transform = 'translateX(-100%)';
                slide.style.opacity = '0.35';
                slide.style.zIndex = '1';
            } else {
                // All others: off to the right, hidden
                slide.style.transform = 'translateX(100%)';
                slide.style.opacity = '0';
                slide.style.zIndex = '0';
            }
        });
    }

    // Navigate to next item
    function next() {
        currentIndex = (currentIndex + 1) % items.length;
        render();
    }

    // Navigate to previous item
    function prev() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        render();
    }

    // Attach event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prev();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            next();
        });
    }

    // Keyboard navigation
    rootEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            next();
        }
    });

    // Make carousel focusable for keyboard nav
    rootEl.setAttribute('tabindex', '0');

    init();

    return { next, prev, goto: (index) => { currentIndex = index; render(); } };
}

// ========================================
// Logo Carousel (Companies Section)
// ========================================

function initLogoCarousel({ root, items, autoplay = false, interval = 5000 }) {
    const rootEl = typeof root === 'string' ? document.querySelector(root) : root;
    if (!rootEl) {
        console.error('Logo carousel root not found:', root);
        return null;
    }

    const track = rootEl.querySelector('.carousel-track');
    const prevBtn = rootEl.querySelector('.carousel-arrow-prev');
    const nextBtn = rootEl.querySelector('.carousel-arrow-next');
    const paginationEl = document.getElementById('companiesPagination');
    const counterEl = document.getElementById('companiesCounter');

    let currentIndex = 0;
    let autoplayTimer = null;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    // Render all logo items
    function init() {
        track.innerHTML = items.map((item, i) => `
            <div class="carousel-logo-item" data-index="${i}">
                <a href="${item.link}" class="carousel-logo-link">
                    <div class="carousel-logo-box">
                        <img src="${item.img}" alt="${item.name}" />
                    </div>
                </a>
            </div>
        `).join('');

        // Render pagination dots
        if (paginationEl) {
            paginationEl.innerHTML = items.map((_, i) => `
                <button
                    class="carousel-dot ${i === 0 ? 'is-active' : ''}"
                    data-index="${i}"
                    role="tab"
                    aria-label="Go to company ${i + 1}"
                    aria-selected="${i === 0 ? 'true' : 'false'}"
                ></button>
            `).join('');

            // Add click handlers to pagination dots
            paginationEl.querySelectorAll('.carousel-dot').forEach(dot => {
                dot.addEventListener('click', () => {
                    const index = parseInt(dot.dataset.index);
                    goTo(index);
                });
            });
        }

        render();
        if (autoplay) startAutoplay();
    }

    // Calculate transform and apply scale/opacity based on position
    function render() {
        const logoItems = track.querySelectorAll('.carousel-logo-item');
        const viewportWidth = rootEl.querySelector('.carousel-viewport').offsetWidth;
        const logoWidth = parseFloat(getComputedStyle(rootEl).getPropertyValue('--logo-max-w')) || 360;
        const gap = parseFloat(getComputedStyle(rootEl).getPropertyValue('--gap')) || 32;
        const itemWidth = logoWidth + gap;

        // Determine how many items visible based on viewport
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

        // Calculate offset to center the current item
        const centerOffset = (viewportWidth / 2) - (logoWidth / 2);
        const translateX = centerOffset - (currentIndex * itemWidth);

        track.style.transform = `translateX(${translateX}px)`;

        // Apply scale and opacity to each item based on distance from center
        logoItems.forEach((item, i) => {
            const isCenter = i === currentIndex;

            // Calculate if this item is adjacent (wrapping around for infinite loop)
            const prevIndex = (currentIndex - 1 + items.length) % items.length;
            const nextIndex = (currentIndex + 1) % items.length;
            const isPrevSide = i === prevIndex;
            const isNextSide = i === nextIndex;
            const isSide = isPrevSide || isNextSide;

            const centerScale = parseFloat(getComputedStyle(rootEl).getPropertyValue('--center-scale')) || 1.0;
            const sideScale = parseFloat(getComputedStyle(rootEl).getPropertyValue('--side-scale')) || 0.85;
            const centerOpacity = parseFloat(getComputedStyle(rootEl).getPropertyValue('--center-opacity')) || 1;
            const sideOpacity = parseFloat(getComputedStyle(rootEl).getPropertyValue('--side-opacity')) || 0.35;

            if (isCenter) {
                item.style.transform = `scale(${centerScale})`;
                item.style.opacity = centerOpacity;
                item.style.zIndex = '10';
            } else if (isSide && !isMobile) {
                item.style.transform = `scale(${sideScale})`;
                item.style.opacity = sideOpacity;
                item.style.zIndex = '5';
            } else {
                item.style.transform = `scale(${sideScale})`;
                item.style.opacity = isMobile && (isPrevSide || isNextSide) ? sideOpacity : '0';
                item.style.zIndex = '1';
            }
        });

        // Update arrow disabled states
        updateArrows();

        // Update pagination
        updatePagination();

        // Update counter
        updateCounter();
    }

    function updateArrows() {
        // Always enabled for infinite loop
        if (prevBtn) {
            prevBtn.classList.remove('is-disabled');
            prevBtn.setAttribute('aria-disabled', 'false');
        }

        if (nextBtn) {
            nextBtn.classList.remove('is-disabled');
            nextBtn.setAttribute('aria-disabled', 'false');
        }
    }

    function updatePagination() {
        if (!paginationEl) return;

        paginationEl.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add('is-active');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.classList.remove('is-active');
                dot.setAttribute('aria-selected', 'false');
            }
        });
    }

    function updateCounter() {
        if (!counterEl) return;
        const current = String(currentIndex + 1).padStart(2, '0');
        const total = String(items.length).padStart(2, '0');
        counterEl.textContent = `${current}/${total}`;
    }

    function next() {
        currentIndex = (currentIndex + 1) % items.length;
        render();
        resetAutoplay();
    }

    function prev() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        render();
        resetAutoplay();
    }

    function goTo(index) {
        if (index >= 0 && index < items.length) {
            currentIndex = index;
            render();
            resetAutoplay();
        }
    }

    function startAutoplay() {
        if (!autoplay) return;
        autoplayTimer = setInterval(() => {
            next(); // Will automatically wrap around due to modulo
        }, interval);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function resetAutoplay() {
        if (autoplay) {
            stopAutoplay();
            startAutoplay();
        }
    }

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prev();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            next();
        });
    }

    // Keyboard navigation
    rootEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            next();
        }
    });

    // Drag/swipe support
    track.addEventListener('mousedown', handleDragStart);
    track.addEventListener('touchstart', handleDragStart, { passive: true });

    function handleDragStart(e) {
        isDragging = true;
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        currentX = startX;

        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('touchmove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchend', handleDragEnd);
    }

    function handleDragMove(e) {
        if (!isDragging) return;
        currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    }

    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;

        const diff = startX - currentX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                next();
            } else {
                prev();
            }
        }

        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchend', handleDragEnd);
    }

    // Pause autoplay on hover
    if (autoplay) {
        rootEl.addEventListener('mouseenter', stopAutoplay);
        rootEl.addEventListener('mouseleave', startAutoplay);
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            render();
        }, 150);
    });

    // Make focusable for keyboard nav
    rootEl.setAttribute('tabindex', '0');

    init();

    return { next, prev, goTo };
}

// ========================================
// Initialize Carousels on Page Load
// ========================================

document.addEventListener('DOMContentLoaded', function() {

    // Data: Why La Marquise points
    const whyPoints = [
        { number: '01', title: 'Excellence & Pride', text: 'We take pride in delivering exceptional service that reflects the prestige of your facility.' },
        { number: '02', title: 'Trust & Reliability', text: 'Consistent, dependable service backed by rigorous quality control and professional expertise.' },
        { number: '03', title: 'Safety & Assurance', text: 'Certified processes and trained personnel ensuring the highest safety and security standards.' },
        { number: '04', title: 'Peace of Mind', text: 'Dedicated account management and 24/7 support for complete confidence in your facility operations.' }
    ];

    // Data: Companies
    const companies = [
        { name: 'La Marquise Facilities Management', img: 'images/LM Facilities.png', link: 'company-lm-facilities.html' },
        { name: 'La Marquise Properties Management', img: 'images/LM Properties.png', link: 'company-lm-properties.html' },
        { name: 'Al Dahan Al Masi General Maintenance', img: 'images/AL_DAHAN_AL_MASI_logo_no_bg.png', link: 'company-dahan.html' },
        { name: 'Haven House General Contracting', img: 'images/HH Vertical_no_bg.png', link: 'company-haven-house.html' },
        { name: 'Off White Interior Design', img: 'images/OFF_WHITE_logo_transparent.png', link: 'company-off-white.html' },
        { name: 'ZEE Production House Real Estate Consultancy', img: 'images/ZEE_PH_logo_transparent.png', link: 'company-zee.html' }
    ];

    // Data: Services
    const services = [
        { title: 'Facilities Management', description: 'Comprehensive facility operations and maintenance for residential, commercial, and industrial properties.', link: 'service-facilities.html' },
        { title: 'Properties Management', description: 'Expert property portfolio management, leasing, and tenant relations services.', link: 'service-properties.html' },
        { title: 'Corporate Management', description: 'Strategic supervision and coordination of group operations across all subsidiaries.', link: 'service-corporate.html' },
        { title: 'Real Estate Consultancy', description: 'Feasibility studies, investment advisory, and development strategies aligned with market trends.', link: 'service-consultancy.html' },
        { title: 'Interior Design', description: 'Creative interior design solutions for homes and businesses.', link: 'service-interior.html' },
        { title: 'General Contracting', description: 'Quality construction and finishing solutions for residential and commercial projects.', link: 'service-contracting.html' },
        { title: 'Landscaping', description: 'Expert landscaping design and maintenance services.', link: 'service-landscaping.html' },
        { title: 'Cleaning Services', description: 'Professional cleaning solutions for all property types.', link: 'service-cleaning.html' },
        { title: 'Swimming Pool Management', description: 'Complete pool operation, maintenance, and water quality management services.', link: 'service-pool.html' },
        { title: 'Maintenance Services', description: 'Full-scale maintenance solutions including scheduled and emergency repairs, renovations, and technical support.', link: 'service-maintenance.html' }
    ];

    // Render function for Why carousel
    function renderWhySlide(item) {
        return `
            <div class="why-number">${item.number}</div>
            <h3>${item.title}</h3>
            <p>${item.text}</p>
        `;
    }

    // Render function for Companies carousel
    function renderCompanySlide(item) {
        return `
            <a href="${item.link}" class="company-logo-link">
                <div class="company-logo-box">
                    <img src="${item.img}" alt="${item.name}">
                </div>
            </a>
        `;
    }

    // Render function for Services carousel
    function renderServiceSlide(item) {
        return `
            <div class="service-slide">
                <a href="${item.link}" class="service-slide-title-link">
                    <h3 class="service-slide-title">${item.title}</h3>
                </a>
                <p class="service-slide-description">${item.description}</p>
            </div>
        `;
    }

    // Initialize all carousels

    // Why La Marquise is now a static grid (see index.html .why-grid).
    // The carousel data above is kept only as a fallback in case the
    // grid is replaced with a carousel again on another page.
    const whyCarousel = document.getElementById('whyCarousel');
    if (whyCarousel) {
        makeCarousel(whyCarousel, whyPoints, renderWhySlide);
    }

    const companiesCarousel = document.getElementById('companiesCarousel');
    if (companiesCarousel) {
        initLogoCarousel({
            root: '#companiesCarousel',
            items: companies,
            autoplay: false,
            interval: 5000
        });
    } else {
        console.error('companiesCarousel element not found!');
    }

    const servicesCarousel = document.getElementById('servicesCarousel');
    if (servicesCarousel) {
        makeCarousel(servicesCarousel, services, renderServiceSlide);
    } else {
        console.error('servicesCarousel element not found!');
    }

});

// ========================================
// Services Page Expandable List
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const serviceItems = document.querySelectorAll('.service-expandable-item');

    serviceItems.forEach(item => {
        const header = item.querySelector('.service-expandable-header');
        const toggle = item.querySelector('.service-expand-toggle');

        if (header && toggle) {
            // Initial ARIA state
            header.setAttribute('role', 'button');
            header.setAttribute('tabindex', '0');
            if (!header.hasAttribute('aria-expanded')) {
                header.setAttribute('aria-expanded', 'false');
            }

            const setExpanded = (expanded) => {
                header.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                if (toggle) toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            };

            header.addEventListener('click', function(e) {
                e.preventDefault();

                // Close other open items
                serviceItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherHeader = otherItem.querySelector('.service-expandable-header');
                        const otherToggle = otherItem.querySelector('.service-expand-toggle');
                        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
                        if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current item
                const willBeActive = !item.classList.contains('active');
                item.classList.toggle('active', willBeActive);
                setExpanded(willBeActive);
            });

            header.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    header.click();
                }
            });
        }
    });
});

// ========================================
// Job Listings Toggle (Careers Page)
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const jobItems = document.querySelectorAll('.job-item');

    jobItems.forEach(item => {
        const header = item.querySelector('.job-header');
        const toggle = item.querySelector('.job-toggle');

        if (header && toggle) {
            // Initial ARIA state
            header.setAttribute('role', 'button');
            header.setAttribute('tabindex', '0');
            if (!header.hasAttribute('aria-expanded')) {
                header.setAttribute('aria-expanded', 'false');
            }
            toggle.setAttribute('aria-expanded', 'false');

            const setExpanded = (expanded) => {
                header.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                toggle.setAttribute('aria-label', expanded ? 'Collapse job details' : 'Expand job details');
            };

            // Add click handler to entire header
            header.addEventListener('click', function(e) {
                e.preventDefault();

                // Close other open items
                jobItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherHeader = otherItem.querySelector('.job-header');
                        const otherToggle = otherItem.querySelector('.job-toggle');
                        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
                        if (otherToggle) {
                            otherToggle.setAttribute('aria-expanded', 'false');
                            otherToggle.setAttribute('aria-label', 'Expand job details');
                        }
                    }
                });

                // Toggle current item
                const willBeActive = !item.classList.contains('active');
                item.classList.toggle('active', willBeActive);
                setExpanded(willBeActive);
            });

            // Keyboard accessibility
            header.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    header.click();
                }
            });
        }
    });
});
