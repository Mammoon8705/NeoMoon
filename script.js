/* ── NAV SCROLL ── */
const nav = document.getElementById('mainNav');

let lastScroll = 0;

window.addEventListener('scroll', () => {

    const currentScroll = window.scrollY;

    nav.classList.toggle('scrolled', currentScroll > 60);

    if (currentScroll > 150) {

        if (currentScroll < lastScroll) {
            nav.classList.add('show');
        } else {
            nav.classList.remove('show');
        }

    } else {
        nav.classList.remove('show');
    }

    lastScroll = currentScroll;
});
/* ── HAMBURGER ── */
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileClose = document.querySelector(".mobile-close");
const overlay = document.querySelector(".overlay");

hamburger.addEventListener("click", () => {
    mobileMenu.classList.add("open");
    overlay.classList.add("show");

    document.body.classList.add("menu-open");
});

mobileClose.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

function closeMenu() {
    mobileMenu.classList.remove("open");
    overlay.classList.remove("show");

    document.body.classList.remove("menu-open");
}
/* ── SCROLL REVEAL ── */
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } });
}, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => io.observe(el));

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {

        const target = document.querySelector(this.getAttribute('href'));

        if (!target) return;

        e.preventDefault();

        const start = window.pageYOffset;
        const end = target.offsetTop;
        const distance = end - start;

        const duration = 500; // increase for slower scroll

        let startTime = null;

        function easeInOutCubic(t) {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function animation(currentTime) {

            if (!startTime) startTime = currentTime;

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            window.scrollTo(
                0,
                start + distance * easeInOutCubic(progress)
            );

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    });
});

/* ── HERO PARALLAX ── */
window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const hc = document.querySelector('.hero-content');
    if (hc && y < window.innerHeight) {
        hc.style.transform = `translateY(${y * .22}px)`;
        hc.style.opacity = 1 - (y / window.innerHeight) * 1.6;
    }
});

const heroBg = document.querySelector('.hero-bg');

window.addEventListener('mousemove', (e) => {

    const x = (window.innerWidth / 2 - e.clientX) / 40;
    const y = (window.innerHeight / 2 - e.clientY) / 40;

    heroBg.style.transform =
        `translate(${x}px, ${y}px) scale(1.08)`;

});
// Particles //
const particles = document.getElementById('particles');

for (let i = 0; i < 40; i++) {

    const p = document.createElement('span');

    p.classList.add('particle');

    p.style.left = Math.random() * 100 + '%';

    p.style.animationDelay =
        Math.random() * 10 + 's';

    p.style.animationDuration =
        (Math.random() * 10 + 10) + 's';

    particles.appendChild(p);
}

/* =========================================
   MOBILE SERVICES SWIPE
========================================= */

const servicesTrack = document.querySelector('.services-swipe');

if (servicesTrack) {

    const serviceCards =
        servicesTrack.querySelectorAll('.svc-card-link');

    function updateActiveService() {

        let closestCard = null;
        let closestDistance = Infinity;

        const screenCenter =
            window.innerWidth / 2;

        serviceCards.forEach(card => {

            const rect =
                card.getBoundingClientRect();

            const cardCenter =
                rect.left + rect.width / 2;

            const distance =
                Math.abs(cardCenter - screenCenter);

            if (distance < closestDistance) {

                closestDistance = distance;
                closestCard = card;

            }

        });

        serviceCards.forEach(card => {
            card.classList.remove('active');
        });

        if (closestCard) {
            closestCard.classList.add('active');
        }
    }


    /* Detect scrolling */
    servicesTrack.addEventListener(
        'scroll',
        updateActiveService,
        { passive: true }
    );


    /* Detect direct touch */
    serviceCards.forEach(card => {

        card.addEventListener('touchstart', () => {

            serviceCards.forEach(c => {
                c.classList.remove('active');
            });

            card.classList.add('active');

        }, { passive: true });

    });


    /* Initial state */
    updateActiveService();

}

/* ── CIRCULAR PROCESS ── */
(function () {
    const steps = [
        { num: '01', icon: '🎯', title: 'Requirement Gathering', desc: 'Understand your business goals, audience, and what your website needs to achieve.' },
        { num: '02', icon: '📅', title: 'Planning', desc: 'Create sitemap, structure, and choose the best technologies for your project.' },
        { num: '03', icon: '🎨', title: 'Design', desc: 'Wireframes and UI design focused on clarity, branding, and conversions.' },
        { num: '04', icon: '💻', title: 'Development', desc: 'Build fast, responsive, and scalable website with clean code.' },
        { num: '05', icon: '🧪', title: 'Testing', desc: 'Ensure everything works perfectly across devices and browsers.' },
        { num: '06', icon: '🚀', title: 'Launch', desc: 'Deploy your website live with final checks and optimisation.' },
        { num: '07', icon: '🛡️', title: 'Maintenance', desc: 'Ongoing updates, SEO improvements, and performance monitoring.' },
    ];

    const orbit = document.getElementById('processOrbit');
    if (!orbit) return;

    const cx = 350, cy = 350, radius = 280;
    steps.forEach((s, i) => {
        const angle = ((i / steps.length) * Math.PI * 2) - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;

        /* Tooltip position */
        const offset = 130;

        const tLeft = x < cx ? `-${offset}px` : 'auto';
        const tRight = x >= cx ? `-${offset}px` : 'auto';

        const node = document.createElement('div');
        node.className = 'step-node';
        node.style.cssText = `left:${x}px;top:${y}px;`;
        node.innerHTML = `
    <div class="step-circle">
        <div class="step-num">${s.num}</div>
        <div class="step-icon">${s.icon}</div>
    </div>
    <div class="step-tooltip" style="left:${tLeft};right:${tRight};top:50%;transform:translateY(-50%)">
        <div class="tooltip-title">${s.title}</div>
        <div class="tooltip-desc">${s.desc}</div>
    </div>`;
        orbit.appendChild(node);
    });
})();



const cards = document.querySelectorAll('.timeline-item');

cards.forEach(card => {

    card.addEventListener('touchstart', () => {

        cards.forEach(c => c.classList.remove('active'));

        card.classList.add('active');

    });

});

const processCards = document.querySelectorAll('.timeline-item');

function updateActiveCard() {

    processCards.forEach(card => {
        card.classList.remove('active');
    });

    let closest = processCards[0];
    let closestDistance = Infinity;

    processCards.forEach(card => {

        const rect = card.getBoundingClientRect();

        const center =
            rect.left + rect.width / 2;

        const distance =
            Math.abs(
                center - window.innerWidth / 2
            );

        if (distance < closestDistance) {
            closestDistance = distance;
            closest = card;
        }

    });

    closest.classList.add('active');

}

const timeline =
    document.querySelector('.process-timeline');

timeline.addEventListener(
    'scroll',
    updateActiveCard
);

updateActiveCard();

/* ── ANIMATED STATS ── */
function animateCount(el) {
    const target = +el.dataset.target;
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) { el.textContent = target + '+'; clearInterval(timer) }
        else el.textContent = Math.floor(current);
    }, 18);
}
const statsIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.stat-num').forEach(animateCount);
            statsIO.unobserve(e.target);
        }
    });
}, { threshold: .5 });
const statsEl = document.getElementById('stats');
if (statsEl) statsIO.observe(statsEl);

/* ── FORM SUBMIT ── */
const formBtn = document.getElementById('formSubmit');

if (formBtn) {
    formBtn.addEventListener('click', function () {
        const orig = this.textContent;

        this.textContent = "Sent! We'll be in touch ✓";
        this.style.background = 'rgba(0,200,255,.7)';

        setTimeout(() => {
            this.textContent = orig;
            this.style.background = '';
        }, 3000);
    });
};

function autoScrollRow(selector) {

    const row = document.querySelector(selector);

    if (!row || window.innerWidth > 768) return;

    let speed = 1;

    setInterval(() => {

        row.scrollLeft += speed;

        if (
            row.scrollLeft + row.clientWidth >= row.scrollWidth
        ) {
            row.scrollLeft = 0;
        }

    }, 30);

}

autoScrollRow('.services-grid');
autoScrollRow('.pricing-grid');
autoScrollRow('.testi-grid');

/* ---Portfolio--- */
if (document.querySelector(".portfolioSwiper")) {
    const portfolioSwiper = new Swiper(".portfolioSwiper", {

        loop: true,

        centeredSlides: true,

        slidesPerView: 1.3,

        spaceBetween: 30,

        grabCursor: true,

        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        speed: 800

    });

  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    var inner = item.querySelector('.faq-a-inner');
    q.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(openItem){
        if(openItem !== item){
          openItem.classList.remove('open');
          openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      if(isOpen){
        item.classList.remove('open');
        q.setAttribute('aria-expanded', 'false');
        a.style.maxHeight = null;
      } else {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
        a.style.maxHeight = inner.offsetHeight + 40 + 'px';
      }
    });
  });
};
