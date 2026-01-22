/**
 * OnTheDocket - Main JavaScript
 * Optimized for performance with requestAnimationFrame and passive listeners
 */

(function() {
    'use strict';

    // Cache DOM elements
    const DOM = {
        header: document.getElementById('header'),
        heroImage: document.getElementById('hero-image'),
        heroContainer: document.querySelector('.hero-container'),
        heroImageWrapper: document.getElementById('hero-image-wrapper'),
        heroImageContainer: document.getElementById('hero-image-container'),
        teamPhoto: document.getElementById('team-photo'),
        newsletterForm: document.getElementById('newsletter-form'),
        emailInput: document.getElementById('email-input'),
        emailError: document.getElementById('email-error'),
        formSuccess: document.getElementById('form-success')
    };

    // Shared state
    const state = {
        lastScrollY: 0,
        headerTicking: false,
        parallaxRafId: null,
        timelineRafId: null
    };

    // ==================== UTILITIES ====================

    const throttleRAF = (callback) => {
        let rafId = null;
        return () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                callback();
                rafId = null;
            });
        };
    };

    // ==================== HEADER ====================

    function initHeader() {
        if (!DOM.header) return;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            DOM.header.classList.toggle('header-hidden', currentScrollY > state.lastScrollY && currentScrollY > 100);
            state.lastScrollY = currentScrollY;
            state.headerTicking = false;
        };

        window.addEventListener('scroll', () => {
            if (!state.headerTicking) {
                requestAnimationFrame(updateHeader);
                state.headerTicking = true;
            }
        }, { passive: true });
    }

    // ==================== SCROLL TO SECTION ====================

    window.scrollToSection = function(sectionId) {
        const element = document.getElementById(sectionId);
        if (!element) return;

        const offset = 100;
        const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    // ==================== HERO PARALLAX ====================

    function initHeroParallax() {
        if (!DOM.heroContainer || !DOM.heroImage) return;

        const updateParallax = () => {
            const rect = DOM.heroContainer.getBoundingClientRect();
            const scrollProgress = Math.max(0, Math.min(1,
                -rect.top / (DOM.heroContainer.offsetHeight - window.innerHeight)
            ));
            const scale = 1 + scrollProgress * 2.5;
            DOM.heroImage.style.transform = `scale3d(${scale},${scale},1)`;
            state.parallaxRafId = null;
        };

        const adjustHeroForViewport = () => {
            if (!DOM.heroImageWrapper || !DOM.heroImageContainer) return;
            const isShort = window.innerHeight <= 900;
            DOM.heroImageWrapper.style.top = isShort ? 'calc(50% + 10px)' : '50%';
            DOM.heroImageContainer.style.maxWidth = isShort ? '1080px' : '1200px';
        };

        window.addEventListener('scroll', () => {
            if (state.parallaxRafId) cancelAnimationFrame(state.parallaxRafId);
            state.parallaxRafId = requestAnimationFrame(updateParallax);
        }, { passive: true });

        window.addEventListener('resize', throttleRAF(adjustHeroForViewport), { passive: true });

        updateParallax();
        adjustHeroForViewport();
    }

    // ==================== TIMELINE ====================

    function initTimeline() {
        const steps = document.querySelectorAll('.timeline-step');
        const dots = document.querySelectorAll('.timeline-dot');
        if (!steps.length) return;

        const checkSteps = () => {
            const vh = window.innerHeight;
            let activeIdx = -1;

            steps.forEach((step, i) => {
                const rect = step.getBoundingClientRect();
                if (rect.top < vh * 0.8) step.classList.add('visible');
                if (rect.top < vh * 0.6 && rect.bottom > vh * 0.4) activeIdx = i;
            });

            dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIdx));
            state.timelineRafId = null;
        };

        window.addEventListener('scroll', () => {
            if (state.timelineRafId) cancelAnimationFrame(state.timelineRafId);
            state.timelineRafId = requestAnimationFrame(checkSteps);
        }, { passive: true });

        checkSteps();
    }

    // ==================== ANCHOR LINKS ====================

    function initAnchorLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const top = target.getBoundingClientRect().top + window.pageYOffset - 100;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }

    // ==================== ACCORDION (CASES) ====================

    function initAccordion() {
        const items = document.querySelectorAll('[data-accordion]');
        if (!items.length) return;

        const ICONS = {
            plus: 'M12 6v12M6 12h12',
            close: 'M6 18L18 6M6 6l12 12'
        };

        items.forEach(item => {
            const trigger = item.querySelector('.accordion-trigger');
            const content = item.querySelector('.accordion-content');
            const icon = item.querySelector('.accordion-icon svg path');

            trigger.addEventListener('click', () => {
                const isOpen = content.classList.contains('open');

                // Close all others
                items.forEach(other => {
                    if (other === item) return;
                    const c = other.querySelector('.accordion-content');
                    const ic = other.querySelector('.accordion-icon svg path');
                    const t = other.querySelector('.accordion-trigger');
                    if (c.classList.contains('open')) {
                        c.classList.remove('open');
                        c.style.maxHeight = '0';
                        ic.setAttribute('d', ICONS.plus);
                        t.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current
                content.classList.toggle('open', !isOpen);
                content.style.maxHeight = isOpen ? '0' : content.scrollHeight + 'px';
                icon.setAttribute('d', isOpen ? ICONS.plus : ICONS.close);
                trigger.setAttribute('aria-expanded', !isOpen);
            });
        });
    }

    // ==================== TEAM ACCORDION ====================

    function initTeam() {
        const members = document.querySelectorAll('[data-team]');
        if (!members.length || !DOM.teamPhoto) return;

        const MEMBER_NAMES = {
            'assets/jerry.png': 'Jerry Goldman',
            'assets/tim.png': 'Tim Johnson',
            'assets/spooler.png': 'Spooler',
            'assets/idib.png': 'Idib Group'
        };

        members.forEach(member => {
            member.addEventListener('click', function() {
                const isActive = this.getAttribute('data-active') === 'true';
                const content = this.querySelector('.team-content');

                if (isActive) {
                    this.setAttribute('data-active', 'false');
                    content.style.maxHeight = '0';
                    content.style.paddingBottom = '0';
                    return;
                }

                const newImage = this.getAttribute('data-image');

                // Fade transition
                DOM.teamPhoto.style.opacity = '0';
                setTimeout(() => {
                    DOM.teamPhoto.src = newImage;
                    DOM.teamPhoto.alt = MEMBER_NAMES[newImage] || 'Team member';
                    DOM.teamPhoto.style.opacity = '1';
                }, 150);

                // Close all others
                members.forEach(m => {
                    m.setAttribute('data-active', 'false');
                    m.querySelector('.team-content').style.maxHeight = '0';
                    m.querySelector('.team-content').style.paddingBottom = '0';
                });

                // Open current
                this.setAttribute('data-active', 'true');
                content.style.maxHeight = '384px';
                content.style.paddingBottom = '24px';
            });
        });
    }

    // ==================== NEWSLETTER FORM ====================

    function initNewsletter() {
        if (!DOM.newsletterForm || !DOM.emailInput) return;

        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const showError = (msg) => {
            DOM.emailError.textContent = msg;
            DOM.emailError.classList.remove('hidden');
            DOM.emailInput.classList.add('border-red-500');
            DOM.emailInput.classList.remove('border-border-input');
            DOM.formSuccess.classList.add('hidden');
        };

        const hideError = () => {
            DOM.emailError.classList.add('hidden');
            DOM.emailInput.classList.remove('border-red-500');
            DOM.emailInput.classList.add('border-border-input');
        };

        const showSuccess = () => {
            DOM.formSuccess.classList.remove('hidden');
            DOM.emailInput.value = '';
            hideError();
            setTimeout(() => DOM.formSuccess.classList.add('hidden'), 3000);
        };

        const validate = (email) => EMAIL_REGEX.test(email.trim());

        DOM.emailInput.addEventListener('input', function() {
            const val = this.value.trim();
            if (val === '') hideError();
            else if (!validate(val)) showError('Please enter a valid email address');
            else hideError();
        });

        DOM.emailInput.addEventListener('blur', function() {
            if (this.value.trim() && !validate(this.value)) {
                showError('Please enter a valid email address');
            }
        });

        DOM.newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = DOM.emailInput.value.trim();

            if (!email) {
                showError('Email is required');
                DOM.emailInput.focus();
                return;
            }

            if (!validate(email)) {
                showError('Please enter a valid email address');
                DOM.emailInput.focus();
                return;
            }

            showSuccess();
        });
    }

    // ==================== INIT ====================

    function init() {
        initHeader();
        initHeroParallax();
        initTimeline();
        initAnchorLinks();
        initAccordion();
        initTeam();
        initNewsletter();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
