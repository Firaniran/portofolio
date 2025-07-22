// ======================
// GLOBAL FUNCTIONS
// ======================
function animateOnScroll() {
    const elements = document.querySelectorAll('.scroll-animation');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('show');
        }
    });
}

function debounce(func, wait = 10, immediate = false) {
    let timeout;
    return function() {
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

// ======================
// DOM READY
// ======================
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }));
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.background = window.scrollY > 50 
                ? 'rgba(255, 248, 220, 0.98)' 
                : 'rgba(255, 248, 220, 0.95)';
            navbar.style.boxShadow = window.scrollY > 50 
                ? '0 2px 20px rgba(255, 140, 66, 0.1)' 
                : 'none';
        }
    });

    // Typing Animation
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = 'Halo, Saya';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                typingText.innerHTML = text.slice(0, i + 1) + '<span class="cursor">|</span>';
                i++;
                setTimeout(typeWriter, 150);
            } else {
                setTimeout(() => typingText.innerHTML = text, 1000);
            }
        }
        setTimeout(typeWriter, 1000);
    }

    // Skills Animation
    function animateSkillBars() {
        document.querySelectorAll('.skill-progress').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width') + '%';
        });
    }

    // Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            projectCards.forEach(card => {
                const shouldShow = filterValue === 'all' || 
                                  card.getAttribute('data-category') === filterValue;
                card.classList.toggle('hide', !shouldShow);
                card.style.display = shouldShow ? 'block' : 'none';
            });
        });
    });

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            
            if (!formData.get('name') || !formData.get('email') || 
                !formData.get('subject') || !formData.get('message')) {
                showNotification('Harap isi semua field!', 'error');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get('email'))) {
                showNotification('Format email tidak valid!', 'error');
                return;
            }

            showNotification('Pesan berhasil dikirim!', 'success');
            contactForm.reset();
        });
    }

    // Notification System
    function showNotification(message, type) {
        const existingNotification = document.querySelector('.notification');
        existingNotification?.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-btn">&times;</button>
        `;

        notification.querySelector('.close-btn').addEventListener('click', () => {
            notification.remove();
        });

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    // Initialize Animations
    function initAnimations() {
        // Mark elements for animation
        document.querySelectorAll('.section-title, .about-text, .skill-category, .project-card, .contact-info, .contact-form, .stat-item')
            .forEach(el => el.classList.add('scroll-animation'));

        // Counter Animation
        document.querySelectorAll('.stat-number').forEach(counter => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = +counter.textContent.replace(/\D/g, '');
                        const suffix = counter.textContent.replace(/\d/g, '');
                        let current = 0;
                        
                        const updateCounter = () => {
                            if (current < target) {
                                current += Math.ceil(target / 100);
                                counter.textContent = Math.min(current, target) + suffix;
                                requestAnimationFrame(updateCounter);
                            }
                        };
                        
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(counter);
        });
    }

    // Loader
    if (!document.querySelector('.loading')) {
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = '<div class="loader"></div>';
        document.body.prepend(loading);
        setTimeout(() => loading.remove(), 1000);
    }

    // Initial Calls
    initAnimations();
    animateOnScroll();
    animateSkillBars();

    // Optimized Scroll Listener
    window.addEventListener('scroll', debounce(() => {
        animateOnScroll();
        
        // Animate skills when section is visible
        const skillsSection = document.getElementById('skills');
        if (skillsSection?.getBoundingClientRect().top < window.innerHeight - 100) {
            animateSkillBars();
        }
    }));
});

// CSS Injection (optional)
const animationStyles = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .cursor { animation: blink 1s infinite; }
    @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
    .scroll-animation { opacity: 0; transform: translateY(20px); transition: all 0.6s ease; }
    .scroll-animation.show { opacity: 1; transform: translateY(0); }
`;
document.head.insertAdjacentHTML('beforeend', `<style>${animationStyles}</style>`);