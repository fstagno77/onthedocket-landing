/**
 * OnTheDocket - Reusable Components
 * Universal components for header, newsletter, and footer
 */

(function() {
    'use strict';

    // ==================== COMPONENT TEMPLATES ====================

    const Components = {
        // Header component
        header: (options = {}) => {
            const isHome = options.isHome !== false;
            const logoLink = isHome ? '#hero' : 'index.html';
            const navPrefix = isHome ? '' : 'index.html';

            return `
            <header id="header" class="fixed top-0 left-0 right-0 z-50 bg-white header-transition ${isHome ? 'header-at-top' : ''}">
                <div class="max-w-container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
                    <div class="header-inner flex items-center justify-between py-4 md:py-6">
                        <a href="${logoLink}" class="h-8 md:h-10 block">
                            <picture>
                                <source srcset="assets/images/logo.webp" type="image/webp">
                                <img src="assets/images/logo.png" alt="ONTHEDOCKET" class="h-full w-auto" width="120" height="40" loading="eager">
                            </picture>
                        </a>
                        <nav class="header-nav hidden md:flex items-center gap-10">
                            ${isHome ? `
                            <button onclick="scrollToSection('mission')" class="text-[15px] font-normal text-text-primary hover:text-primary transition-colors">Mission</button>
                            <button onclick="scrollToSection('cases')" class="text-[15px] font-normal text-text-primary hover:text-primary transition-colors">Cases</button>
                            <button onclick="scrollToSection('team')" class="text-[15px] font-normal text-text-primary hover:text-primary transition-colors">Team</button>
                            ` : `
                            <a href="${navPrefix}#mission" class="text-[15px] font-normal text-text-primary hover:text-primary transition-colors">Mission</a>
                            <a href="${navPrefix}#cases" class="text-[15px] font-normal text-text-primary hover:text-primary transition-colors">Cases</a>
                            <a href="${navPrefix}#team" class="text-[15px] font-normal text-text-primary hover:text-primary transition-colors">Team</a>
                            `}
                        </nav>
                        <a href="https://www.youtube.com/@OnTheDocket-SCOTUS" target="_blank" rel="noopener noreferrer"
                           class="header-cta inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-2.5 bg-primary text-white text-xs sm:text-sm font-normal rounded-md hover:bg-primary-hover transition-colors whitespace-nowrap">
                            Watch on YouTube
                        </a>
                    </div>
                </div>
            </header>
            `;
        },

        // Newsletter component
        newsletter: () => `
            <section id="contact" class="py-16 sm:py-20 md:py-32 lg:py-40 bg-background-alternate">
                <div class="max-w-container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
                    <div class="max-w-2xl mx-auto text-center">
                        <span class="text-text-secondary text-xs md:text-sm tracking-[0.2em] uppercase mb-4 block">Join the community</span>
                        <h2 class="font-display text-[48px] sm:text-[72px] md:text-[96px] lg:text-[128px] leading-[0.9] text-text-primary mb-8 sm:mb-10 md:mb-12">LET'S CONNECT</h2>

                        <iframe name="mc_hidden_iframe" style="display:none;"></iframe>
                        <form id="newsletter-form" class="w-full" action="https://onthedocket.us5.list-manage.com/subscribe/post?u=8c75b0cc8cae0cf3c07c96b5c&id=ad82bba080&f_id=00948be0f0" method="post" target="mc_hidden_iframe" novalidate>
                            <input type="hidden" name="SOURCE" id="utm-source-field">
                            <div class="relative">
                                <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch">
                                    <div class="flex-1">
                                        <label for="email-input" class="sr-only">Email address</label>
                                        <input type="email" id="email-input" name="EMAIL" placeholder="Email" required aria-describedby="email-error"
                                               class="w-full px-4 sm:px-6 py-3 sm:py-4 bg-transparent border border-border-input rounded-md text-sm sm:text-base text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors">
                                    </div>
                                    <button type="submit" class="px-8 sm:px-10 py-3 sm:py-4 bg-primary text-white text-sm sm:text-base font-medium rounded-md hover:bg-primary-hover transition-colors whitespace-nowrap">Subscribe</button>
                                </div>
                                <p id="email-error" class="mt-2 sm:absolute sm:mt-0 sm:left-0 sm:top-full text-xs text-red-600 hidden text-left" role="alert">Please enter a valid email address</p>
                            </div>
                            <p id="form-success" class="mt-4 text-sm text-green-600 hidden" role="status" aria-live="polite">Thank you for subscribing!</p>
                        </form>

                        <p class="mt-4 sm:mt-6 text-text-tertiary text-xs">Subscribe to receive updates. Unsubscribe anytime.</p>
                    </div>
                </div>
            </section>
        `,

        // Footer component
        footer: () => `
            <footer class="bg-background-dark">
                <div class="max-w-container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-6 md:py-8">
                    <div class="flex items-center justify-between">
                        <a href="index.html" aria-label="On The Docket Home">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 331.7 92.8" class="h-5 md:h-8 w-auto" fill="white" aria-hidden="true">
                                <polygon points="83.8 0 72 0 67.6 0 55.8 0 55.8 4.5 67.6 4.5 67.6 92.7 72 92.7 72 4.5 83.8 4.5 83.8 0"/>
                                <polygon points="105.2 0 105.2 44.1 91.3 44.1 91.3 0 86.8 0 86.8 92.7 91.3 92.7 91.3 48.6 105.2 48.6 105.2 92.7 109.7 92.7 109.7 0 105.2 0"/>
                                <path d="M13.9,0C6.3,0,.2,6.2,.2,13.7v65.3c0,7.5,6.1,13.7,13.7,13.7s13.7-6.1,13.7-13.7V13.7C27.5,6.2,21.4,0,13.9,0ZM23.1,79.1c0,5.1-4.1,9.2-9.2,9.2s-9.2-4.1-9.2-9.2V13.8c0-5.1,4.1-9.2,9.2-9.2s9.2,4.1,9.2,9.2v65.3Z"/>
                                <polygon points="52.8 0 48.3 0 48.3 62 38 0 33.4 0 33.4 92.7 37.8 92.7 37.8 30.6 48.1 92.7 52.8 92.7 52.8 0"/>
                                <polygon points="132.8 5.1 132.8 0 119.9 0 116.2 0 115.5 0 115.5 92.7 116.2 92.7 119.9 92.7 132.8 92.7 132.8 87.6 119.9 87.6 119.9 48.8 129.4 48.8 129.4 43.7 119.9 43.7 119.9 5.1 132.8 5.1"/>
                                <path d="M156.8,0h-18.2v92.7h18.2c6.7,0,12.1-5.4,12.1-12.1V12.1c0-6.7-5.4-12.1-12.1-12.1ZM160,78.9c0,2.6-2.1,4.8-4.8,4.8h-7.7V8.9h7.7c2.6,0,4.8,2.1,4.8,4.8v65.2Z"/>
                                <path d="M189.9-.2c-8.4,0-15.2,6.8-15.2,15.2v62.3c0,8.4,6.8,15.2,15.2,15.2s15.2-6.8,15.2-15.2V15c0-8.4-6.8-15.2-15.2-15.2ZM196.1,77.3c0,3.4-2.8,6.2-6.2,6.2s-6.2-2.8-6.2-6.2V14.9c0-3.4,2.8-6.2,6.2-6.2s6.2,2.8,6.2,6.2v62.4Z"/>
                                <path d="M232.3,55.3v22.3c0,3.4-2.8,6.2-6.2,6.2s-6.2-2.8-6.2-6.2V15.2c0-3.4,2.8-6.2,6.2-6.2s6.2,2.8,6.2,6.2v22.2h8.9V15.2c0-8.4-6.8-15.2-15.2-15.2s-15.2,6.8-15.2,15.2v62.3c0,8.4,6.8,15.2,15.2,15.2s15.2-6.8,15.2-15.2v-22.2h-8.9Z"/>
                                <polygon points="331.7 0 322.2 0 313.2 0 303.7 0 303.7 8.9 313.2 8.9 313.2 92.7 322.2 92.7 322.2 8.9 331.7 8.9 331.7 0"/>
                                <polygon points="300.7 8.9 300.7 0 287.9 0 279 0 279 8.9 279 40.5 279 49.4 279 83.8 279 92.7 279 92.7 300.7 92.7 300.7 83.8 287.9 83.8 287.9 49.4 296.4 49.4 296.4 40.5 287.9 40.5 287.9 8.9 300.7 8.9"/>
                                <polygon points="273.2 0 264.6 0 255.9 46.3 255.9 0 247 0 247 92.7 255.9 92.7 255.9 46.3 264.6 92.7 273.2 92.7 264.6 46.3 273.2 0"/>
                            </svg>
                        </a>

                        <nav class="flex items-center gap-3 md:gap-8">
                            <a href="privacy.html" class="text-white text-xs sm:text-sm hover:text-primary transition-colors">Privacy Policy</a>
                            <a href="about.html" class="text-white text-xs sm:text-sm hover:text-primary transition-colors">About</a>
                        </nav>

                        <div class="flex items-center gap-3 md:gap-4">
                            <a href="mailto:contact@onthedocket.org" aria-label="Email" class="text-white hover:text-primary transition-colors">
                                <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                            </a>
                            <a href="https://www.youtube.com/@OnTheDocket-SCOTUS" target="_blank" rel="noopener noreferrer" aria-label="YouTube" class="text-white hover:text-primary transition-colors">
                                <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                    <rect x="2" y="4" width="20" height="16" rx="4" ry="4"/>
                                    <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/>
                                </svg>
                            </a>
                            <a href="https://www.tiktok.com/@onthedocket.scotus" target="_blank" rel="noopener noreferrer" aria-label="TikTok" class="text-white hover:text-primary transition-colors">
                                <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </a>
                            <a href="https://x.com/on_the_docket" target="_blank" rel="noopener noreferrer" aria-label="X" class="text-white hover:text-primary transition-colors">
                                <svg class="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
            <div class="bg-primary py-3 text-center">
                <a href="https://brown.oyez.org/" target="_blank" rel="noopener noreferrer" class="text-white text-xs sm:text-sm hover:underline px-4">
                    From the producers of <strong>Brown Revisited</strong><span class="hidden sm:inline"> — a landmark decision reimagined with AI-generated voices</span>
                </a>
            </div>
        `
    };

    // ==================== RENDER FUNCTIONS ====================

    function renderComponent(selector, html) {
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = html;
        }
    }

    function insertComponent(selector, html, position = 'beforeend') {
        const element = document.querySelector(selector);
        if (element) {
            element.insertAdjacentHTML(position, html);
        }
    }

    // ==================== NEWSLETTER FORM HANDLER ====================

    function initNewsletterForm() {
        const form = document.getElementById('newsletter-form');
        const emailInput = document.getElementById('email-input');
        const emailError = document.getElementById('email-error');
        const formSuccess = document.getElementById('form-success');
        const utmSourceField = document.getElementById('utm-source-field');

        if (!form || !emailInput) return;

        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const MAILCHIMP_URL = 'https://onthedocket.us5.list-manage.com/subscribe/post-json?u=8c75b0cc8cae0cf3c07c96b5c&id=ad82bba080&f_id=00948be0f0';

        // Get utm_source from URL
        const params = new URLSearchParams(window.location.search);
        const utmSource = params.get('utm_source') || '';

        const showError = (msg) => {
            emailError.textContent = msg;
            emailError.classList.remove('hidden');
            emailInput.classList.add('border-red-500');
            emailInput.classList.remove('border-border-input');
        };

        const hideError = () => {
            emailError.classList.add('hidden');
            emailInput.classList.remove('border-red-500');
            emailInput.classList.add('border-border-input');
        };

        const showSuccess = () => {
            formSuccess.classList.remove('hidden');
            emailInput.value = '';
            hideError();
            setTimeout(() => formSuccess.classList.add('hidden'), 5000);
        };

        const validate = (email) => EMAIL_REGEX.test(email.trim());

        const submitToMailchimp = (email) => {
            const callbackName = 'mc_callback_' + Date.now();
            const script = document.createElement('script');

            let url = `${MAILCHIMP_URL}&EMAIL=${encodeURIComponent(email)}&c=${callbackName}`;
            if (utmSource) {
                url += `&SOURCE=${encodeURIComponent(utmSource)}`;
            }

            window[callbackName] = function(response) {
                delete window[callbackName];
                if (script.parentNode) script.parentNode.removeChild(script);

                if (response.result === 'success') {
                    showSuccess();
                } else {
                    let errorMsg = response.msg || 'Subscription failed. Please try again.';
                    errorMsg = errorMsg.replace(/<[^>]*>/g, '').replace(/^\d+\s*-\s*/, '');

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

        emailInput.addEventListener('input', hideError);

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = emailInput.value.trim();

            if (!email) {
                showError('Email is required');
                emailInput.focus();
                return;
            }

            if (!validate(email)) {
                showError('Please enter a valid email address');
                emailInput.focus();
                return;
            }

            submitToMailchimp(email);
        });
    }

    // ==================== HEADER SCROLL (for non-home pages) ====================

    function initHeaderScroll() {
        const header = document.getElementById('header');
        if (!header) return;

        const SCROLL_THRESHOLD = 50;
        let lastScrollY = 0;
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            const isAtTop = currentScrollY < SCROLL_THRESHOLD;
            const isScrollingDown = currentScrollY > lastScrollY;
            const shouldHide = !isAtTop && isScrollingDown;

            header.classList.toggle('header-hidden', shouldHide);
            lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    // ==================== PUBLIC API ====================

    window.OTDComponents = {
        header: Components.header,
        newsletter: Components.newsletter,
        footer: Components.footer,
        render: renderComponent,
        insert: insertComponent,
        initNewsletter: initNewsletterForm,
        initHeaderScroll: initHeaderScroll
    };

})();
