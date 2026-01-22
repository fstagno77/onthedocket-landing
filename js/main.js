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
        teamPhotoSource: document.getElementById('team-photo-source'),
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

        const heroImageWrapper = DOM.heroImageWrapper;
        const heroSticky = document.querySelector('.hero-sticky');
        const heroImageBox = document.querySelector('.hero-image-box');
        const topTitle = document.querySelector('.hero-title-top');
        const bottomTitle = document.querySelector('.hero-title-bottom');

        if (!heroImageWrapper || !heroSticky) return;

        // Easing functions
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        const easeInQuad = (t) => t * t;
        const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        // Cache initial dimensions on load/resize
        let initialWidth, initialHeight, vw, vh;

        const cacheInitialDimensions = () => {
            vw = window.innerWidth;
            vh = window.innerHeight;
            // Initial image container size - smaller to not overlap titles
            const maxWidth = Math.min(800, vw - 100); // Smaller initial size
            initialWidth = maxWidth;
            // Calculate height based on image aspect ratio (2238:1222)
            initialHeight = initialWidth * (1222 / 2238);
        };

        cacheInitialDimensions();

        const updateParallax = () => {
            const rect = DOM.heroContainer.getBoundingClientRect();
            const totalScroll = DOM.heroContainer.offsetHeight - vh;
            const scrollProgress = Math.max(0, Math.min(1, -rect.top / totalScroll));

            /*
             * Two-phase animation:
             * Phase 1 (0-80%): Image expands from initial size to fullscreen
             * Phase 2 (80-100%): Hold at fullscreen, then sticky releases naturally
             */

            // For width: go beyond viewport to ensure cover
            const coverWidth = vh * (2238 / 1222);
            const targetWidth = Math.max(vw, coverWidth);
            const targetHeight = vh;

            let currentWidth, currentHeight, borderRadius;

            if (scrollProgress <= 0.8) {
                // Phase 1: Expand (0-80% → 0-1 for expansion)
                const expandProgress = scrollProgress / 0.8;
                const p = easeOutCubic(expandProgress);

                currentWidth = initialWidth + (targetWidth - initialWidth) * p;
                currentHeight = initialHeight + (targetHeight - initialHeight) * p;
                borderRadius = 8 * (1 - p);
            } else {
                // Phase 2: Hold at fullscreen
                currentWidth = targetWidth;
                currentHeight = targetHeight;
                borderRadius = 0;
            }

            // Apply size to wrapper
            heroImageWrapper.style.width = `${currentWidth}px`;
            heroImageWrapper.style.height = `${currentHeight}px`;
            heroImageWrapper.style.left = '50%';
            heroImageWrapper.style.top = '50%';
            heroImageWrapper.style.transform = 'translate(-50%, -50%)';

            // Remove border radius progressively
            if (heroImageBox) heroImageBox.style.borderRadius = `${borderRadius}px`;

            // Fade out titles during expansion
            const titleFadeProgress = Math.min(1, scrollProgress / 0.8);
            const titleOpacity = 1 - easeInQuad(titleFadeProgress);
            if (topTitle) topTitle.style.opacity = titleOpacity;
            if (bottomTitle) bottomTitle.style.opacity = titleOpacity;

            state.parallaxRafId = null;
        };

        window.addEventListener('scroll', () => {
            if (state.parallaxRafId) cancelAnimationFrame(state.parallaxRafId);
            state.parallaxRafId = requestAnimationFrame(updateParallax);
        }, { passive: true });

        window.addEventListener('resize', () => {
            cacheInitialDimensions();
            requestAnimationFrame(updateParallax);
        }, { passive: true });

        updateParallax();
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
            'assets/jerry': 'Jerry Goldman',
            'assets/tim': 'Tim Johnson',
            'assets/spooler': 'Spooler',
            'assets/idib': 'Idib Group'
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

                const newImageBase = this.getAttribute('data-image');

                // Fade transition with WebP support
                DOM.teamPhoto.style.opacity = '0';
                setTimeout(() => {
                    if (DOM.teamPhotoSource) {
                        DOM.teamPhotoSource.srcset = newImageBase + '.webp';
                    }
                    DOM.teamPhoto.src = newImageBase + '.png';
                    DOM.teamPhoto.alt = MEMBER_NAMES[newImageBase] || 'Team member';
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
