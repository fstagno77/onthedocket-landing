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
        formSuccess: document.getElementById('form-success'),
        utmSourceField: document.getElementById('utm-source-field'),
        successModal: document.getElementById('success-modal'),
        modalOverlay: document.getElementById('modal-overlay'),
        modalContent: document.getElementById('modal-content'),
        modalCloseBtn: document.getElementById('modal-close-btn')
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

    // Media query for mobile detection (avoids forced reflow from window.innerWidth)
    const mobileMediaQuery = window.matchMedia('(max-width: 767px)');

    function initHeroParallax() {
        // Skip parallax on mobile (< 768px) - mobile has static layout
        if (mobileMediaQuery.matches) return;

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
            const aspectRatio = 2238 / 1222; // ~1.83

            // Limit by viewport width (with padding)
            const widthFromViewport = vw - 80;

            // Always limit by height to keep space for titles
            // Use different percentages based on screen height
            let maxHeightPercent;
            if (vh > 1000) {
                maxHeightPercent = 0.65; // Tall screens (large monitors)
            } else {
                maxHeightPercent = 0.58; // Normal screens (MacBook etc)
            }
            const maxHeight = vh * maxHeightPercent;
            const widthFromHeight = maxHeight * aspectRatio;

            initialWidth = Math.max(300, Math.min(widthFromViewport, widthFromHeight));
            initialHeight = initialWidth / aspectRatio;
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

            // Start slightly lower, move to center as it expands
            const verticalOffset = 15 * (1 - (scrollProgress / 0.8)); // 15px offset that reduces to 0
            const topOffset = Math.max(0, verticalOffset);
            heroImageWrapper.style.top = `calc(50% + ${topOffset}px)`;
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

        const ICONS = {
            plus: 'M12 6v12M6 12h12',
            close: 'M6 18L18 6M6 6l12 12'
        };

        const MEMBER_NAMES = {
            'assets/images/jerry': 'Jerry Goldman',
            'assets/images/tim': 'Tim Johnson',
            'assets/images/ryan': 'Ryan Black',
            'assets/images/spooler': 'Spooler',
            'assets/images/idib': 'Idib Group'
        };

        members.forEach(member => {
            member.addEventListener('click', function() {
                const isActive = this.getAttribute('data-active') === 'true';
                const content = this.querySelector('.team-content');
                const icon = this.querySelector('.team-icon svg path');

                if (isActive) {
                    this.setAttribute('data-active', 'false');
                    content.style.maxHeight = '0';
                    content.style.paddingBottom = '0';
                    if (icon) icon.setAttribute('d', ICONS.plus);
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
                    const otherIcon = m.querySelector('.team-icon svg path');
                    if (otherIcon) otherIcon.setAttribute('d', ICONS.plus);
                });

                // Open current
                this.setAttribute('data-active', 'true');
                content.style.maxHeight = '384px';
                content.style.paddingBottom = '24px';
                if (icon) icon.setAttribute('d', ICONS.close);
            });
        });
    }

    // ==================== NEWSLETTER FORM ====================

    function initNewsletter() {
        if (!DOM.newsletterForm || !DOM.emailInput) return;

        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const MAILCHIMP_URL = 'https://onthedocket.us5.list-manage.com/subscribe/post-json?u=8c75b0cc8cae0cf3c07c96b5c&id=ad82bba080&f_id=00948be0f0';

        // Get utm_source from URL, default to 'direct' if not present
        const params = new URLSearchParams(window.location.search);
        const utmSource = params.get('utm_source') || 'direct';

        const showError = (msg) => {
            DOM.emailError.textContent = msg;
            DOM.emailError.classList.remove('hidden');
            DOM.emailInput.classList.add('border-red-500');
            DOM.emailInput.classList.remove('border-border-input');
        };

        const hideError = () => {
            DOM.emailError.classList.add('hidden');
            DOM.emailInput.classList.remove('border-red-500');
            DOM.emailInput.classList.add('border-border-input');
        };

        const openModal = () => {
            const modal = document.getElementById('success-modal');
            const content = document.getElementById('modal-content');
            if (!modal || !content) return;
            modal.style.display = 'block';
            // Trigger animation after display
            requestAnimationFrame(() => {
                modal.style.opacity = '1';
                content.style.transform = 'translateY(0)';
                content.style.opacity = '1';
            });
        };

        const closeModal = () => {
            const modal = document.getElementById('success-modal');
            const content = document.getElementById('modal-content');
            if (!modal || !content) return;
            modal.style.opacity = '0';
            content.style.transform = 'translateY(100px)';
            content.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        };

        // Close X button
        const closeX = document.getElementById('modal-close-x');
        if (closeX) {
            closeX.addEventListener('click', closeModal);
        }

        const showSuccess = () => {
            DOM.emailInput.value = '';
            hideError();
            openModal();
        };

        // Modal close events
        if (DOM.modalCloseBtn) {
            DOM.modalCloseBtn.addEventListener('click', closeModal);
        }
        if (DOM.modalOverlay) {
            DOM.modalOverlay.addEventListener('click', closeModal);
        }

        const validate = (email) => EMAIL_REGEX.test(email.trim());

        const submitToMailchimp = (email) => {
            const callbackName = 'mc_callback_' + Date.now();
            const script = document.createElement('script');

            // Build URL with EMAIL and SOURCE
            const url = `${MAILCHIMP_URL}&EMAIL=${encodeURIComponent(email)}&c=${callbackName}&SOURCE=${encodeURIComponent(utmSource)}`;

            window[callbackName] = function(response) {
                delete window[callbackName];
                if (script.parentNode) script.parentNode.removeChild(script);

                if (response.result === 'success') {
                    showSuccess();
                } else {
                    // Clean up Mailchimp error messages
                    let errorMsg = response.msg || 'Subscription failed. Please try again.';

                    // Remove HTML tags and "0 -" prefix
                    errorMsg = errorMsg.replace(/<[^>]*>/g, '').replace(/^\d+\s*-\s*/, '');

                    // Translate common errors
                    if (errorMsg.toLowerCase().includes('already subscribed')) {
                        errorMsg = 'This email is already subscribed.';
                    } else if (errorMsg.toLowerCase().includes('invalid') || errorMsg.toLowerCase().includes('looks fake')) {
                        errorMsg = 'Please enter a valid email address.';
                    } else if (errorMsg.toLowerCase().includes('too many')) {
                        errorMsg = 'Too many attempts. Please try again later.';
                    }

                    showError(errorMsg);
                }
            };

            script.src = url;
            script.onerror = function() {
                delete window[callbackName];
                if (script.parentNode) script.parentNode.removeChild(script);
                showError('Connection error. Please try again.');
            };

            document.body.appendChild(script);
        };

        DOM.emailInput.addEventListener('input', hideError);

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

            submitToMailchimp(email);
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
