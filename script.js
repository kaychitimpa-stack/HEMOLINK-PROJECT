/* ==========================
   HAMBURGER DROPDOWN MENU
   (mobile nav, toggled by the .menu-icon)
========================== */

function toggleMenu() {
    document.getElementById('dropdownMenu').classList.toggle('show');
}

// Close the dropdown when clicking anywhere outside it
document.addEventListener('click', function (event) {
    const menu = document.getElementById('dropdownMenu');
    const icon = document.querySelector('.menu-icon');

    if (!menu.classList.contains('show')) return;
    if (menu.contains(event.target) || icon.contains(event.target)) return;

    menu.classList.remove('show');
});

// Close the dropdown after tapping any of its links
document.querySelectorAll('.dropdown-menu a').forEach(function (link) {
    link.addEventListener('click', function () {
        document.getElementById('dropdownMenu').classList.remove('show');
    });
});


/* ==========================
   LOGIN POPOVER
   (click the Login button to choose
   "Already have an account?" or "Want to create an account?")
========================== */

function toggleLoginMenu(event) {
    event.preventDefault(); // the Login link shouldn't jump to "#"
    document.getElementById('loginMenu').classList.toggle('show');
}

// Close the popover when clicking anywhere outside it
document.addEventListener('click', function (event) {
    const menu = document.getElementById('loginMenu');
    const trigger = document.querySelector('.login-btn');

    if (!menu || !menu.classList.contains('show')) return;
    if (menu.contains(event.target) || trigger.contains(event.target)) return;

    menu.classList.remove('show');
});

// Close the popover after picking either option
document.querySelectorAll('.login-menu a').forEach(function (link) {
    link.addEventListener('click', function () {
        document.getElementById('loginMenu').classList.remove('show');
    });
});


/* ==========================
   STATISTICS COUNT-UP
   (animates each .stat-card number
   from 0 to its target when scrolled into view)
========================== */

// Animates a single number element from 0 to its data-target value
function animateStatNumber(el, duration) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix;
    const start = performance.now();

    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString('en-US') + suffix;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = target.toLocaleString('en-US') + suffix;
        }
    }

    requestAnimationFrame(step);
}

// Reads the starting number/suffix off each stat card, resets it to 0,
// then watches for it to scroll into view before animating it up
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-card h2');
    if (!statNumbers.length) return;

    statNumbers.forEach(function (el) {
        const match = el.textContent.trim().match(/^([\d,]+)(.*)$/);
        if (!match) return;

        el.dataset.target = match[1].replace(/,/g, '');
        el.dataset.suffix = match[2];
        el.textContent = '0' + match[2];
    });

    // Older browsers without IntersectionObserver just show the final numbers
    if (!('IntersectionObserver' in window)) {
        statNumbers.forEach(function (el) {
            el.textContent = Number(el.dataset.target).toLocaleString('en-US') + el.dataset.suffix;
        });
        return;
    }

    const observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target, 1800);
                obs.unobserve(entry.target); // only animate once
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
        observer.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', initStatCounters);


/* ==========================
   FAQ ACCORDION
   (click a question to expand its answer;
   opening one closes any other that's open)
========================== */

function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function () {
            const isActive = item.classList.contains('active');

            faqItems.forEach(function (other) {
                other.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initFaqAccordion);
