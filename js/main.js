
/* =====================================
   NUMORA ACADEMY - HEADER JAVASCRIPT
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const body = document.body;

    // Set the active state from the current URL for both desktop and mobile navs.
    const currentPath = normalizePath(window.location.pathname);

    function normalizePath(path) {
        const normalized = decodeURIComponent(path).replace(/\\/g, "/").toLowerCase();
        const withoutIndex = normalized.replace(/\/index\.html$/, "");
        return withoutIndex.replace(/\/+$/, "") || "/";
    }

    const navigationLinks = document.querySelectorAll(
        ".desktop-nav a[href], .mobile-nav a[href]"
    );

    document.querySelectorAll(".desktop-nav .active, .mobile-nav .active").forEach(function (item) {
        item.classList.remove("active");
        item.removeAttribute("aria-current");
    });

    navigationLinks.forEach(function (link) {
        const href = link.getAttribute("href");
        if (!href || href.trim().startsWith("#")) return;

        const target = new URL(link.href, window.location.href);
        if (target.origin === window.location.origin && normalizePath(target.pathname) === currentPath) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");

            const dropdown = link.closest(".nav-dropdown, .mobile-nav-dropdown");
            if (dropdown) {
                dropdown.classList.add("active");
                const parentLink = dropdown.querySelector(
                    dropdown.classList.contains("mobile-nav-dropdown")
                        ? ":scope > .mobile-nav-parent"
                        : ":scope > .nav-link"
                );
                if (parentLink) {
                    parentLink.classList.add("active");
                }
            }
        }
    });

    document.querySelectorAll(".mobile-nav-parent").forEach(function (button) {
        button.addEventListener("click", function () {
            const isExpanded = button.getAttribute("aria-expanded") === "true";
            button.setAttribute("aria-expanded", String(!isExpanded));
            button.closest(".mobile-nav-dropdown").classList.toggle("expanded", !isExpanded);
        });
    });

    // MENU ELEMENTS
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    // OPEN MOBILE MENU
    function openMenu() {
        mobileMenu.classList.add("active");
        body.classList.add("menu-open");
        mobileMenu.setAttribute("aria-hidden", "false");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
    }

    // CLOSE MOBILE MENU
    function closeMobileMenu() {
        mobileMenu.classList.remove("active");
        body.classList.remove("menu-open");
        mobileMenu.setAttribute("aria-hidden", "true");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    // MENU TOGGLE
    menuToggle.addEventListener("click", function () {

        if (mobileMenu.classList.contains("active")) {
            closeMobileMenu();
        } else {
            openMenu();
        }

    });

    // Close when the user clicks outside the canvas and its toggle.
    document.addEventListener("click", function (event) {
        if (mobileMenu.classList.contains("active") &&
            !mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMobileMenu();
        }
    });

    // CLOSE AFTER CLICKING A MENU LINK
    document.querySelectorAll(".mobile-nav a.mobile-nav-link").forEach(function (link) {

        link.addEventListener("click", closeMobileMenu);

    });

    // ESCAPE KEY
    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeMobileMenu();
        }

    });

    // CLOSE MENU WHEN DESKTOP VIEW IS RESTORED
    window.addEventListener("resize", function () {

        if (window.innerWidth > 1024) {
            closeMobileMenu();
        }

    });
});


/* =========================================
   NUMORA - TESTIMONIAL SLIDER
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const slider = document.querySelector(".testimonial-slider");

    if (!slider) return;

    const slides = slider.querySelectorAll(".testimonial-slide");

    const prevButton = document.querySelector(".testimonial-prev");
    const nextButton = document.querySelector(".testimonial-next");

    const dots = document.querySelectorAll(".testimonial-dot");

    let currentSlide = 0;

    const totalSlides = slides.length;


    // SHOW SELECTED SLIDE
    function showTestimonial(index) {

        // Keep slide index within range
        currentSlide = (index + totalSlides) % totalSlides;

        // Update slides
        slides.forEach((slide, i) => {

            slide.classList.toggle(
                "active",
                i === currentSlide
            );

            slide.setAttribute(
                "aria-hidden",
                i !== currentSlide
            );

        });


        // Update pagination dots
        dots.forEach((dot, i) => {

            const isActive = i === currentSlide;

            dot.classList.toggle("active", isActive);

            if (isActive) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }

        });

    }


    // NEXT SLIDE
    nextButton.addEventListener("click", function () {

        showTestimonial(currentSlide + 1);

    });


    // PREVIOUS SLIDE
    prevButton.addEventListener("click", function () {

        showTestimonial(currentSlide - 1);

    });


    // DOT NAVIGATION
    dots.forEach((dot, index) => {

        dot.addEventListener("click", function () {

            showTestimonial(index);

        });

    });


    // INITIAL SLIDE
    showTestimonial(0);

});


/* =========================================
   HOME 2 - BRAIN CHALLENGE INTERACTION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const quizOptions = document.querySelectorAll(
        ".home2-quiz-option"
    );

    const feedback = document.querySelector(
        ".home2-quiz-feedback"
    );

    const resetButton = document.querySelector(
        ".home2-quiz-reset"
    );

    if (!quizOptions.length || !feedback || !resetButton) {
        return;
    }

    const correctAnswer = "42";

    quizOptions.forEach(function (option) {

        option.addEventListener("click", function () {

            if (option.disabled) return;

            const selectedAnswer = option.dataset.answer;

            quizOptions.forEach(function (button) {
                button.disabled = true;

                if (button.dataset.answer === correctAnswer) {
                    button.classList.add("correct");
                }
            });

            if (selectedAnswer === correctAnswer) {

                feedback.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <span>Excellent! That's the correct answer. Great job!</span>
                `;

            } else {

                option.classList.add("incorrect");

                feedback.innerHTML = `
                    <i class="fas fa-lightbulb"></i>
                    <span>Not quite! The correct answer is 42. Keep practising!</span>
                `;
            }
        });
    });

    resetButton.addEventListener("click", function () {

        quizOptions.forEach(function (option) {
            option.disabled = false;
            option.classList.remove("correct", "incorrect");
        });

        feedback.innerHTML = `
            <i class="fas fa-lightbulb"></i>
            <span>Select your answer to see the result!</span>
        `;
    });

});


/* =====================================
   PROGRAMS PAGE - FAQ ACCORDION
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const faqItems = document.querySelectorAll(
        ".programs-faq-item"
    );

    faqItems.forEach(function (item) {

        const question = item.querySelector(
            ".programs-faq-question"
        );

        question.addEventListener("click", function () {

            const isAlreadyOpen = item.classList.contains("active");

            // Close all FAQ items
            faqItems.forEach(function (faqItem) {

                faqItem.classList.remove("active");

                const faqButton = faqItem.querySelector(
                    ".programs-faq-question"
                );

                faqButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

            // Open clicked item if it was previously closed
            if (!isAlreadyOpen) {

                item.classList.add("active");

                question.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        });

    });

});
