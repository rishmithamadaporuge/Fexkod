$(function () {

    // Dynamic Copyright Year
    const copyrightYear = document.getElementById("copyrightYear");
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // Header Scroll
    $(window).scroll(function () {
        if ($(window).scrollTop() >= 60) {
            $("header").addClass("fixed-header");
        } else {
            $("header").removeClass("fixed-header");
        }
    });


    // Featured Owl Carousel
    $('.featured-projects-slider .owl-carousel').owlCarousel({
        center: true,
        loop: true,
        margin: 30,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    })

    // Count When Section Is In View
    const statsSection = document.querySelector('.stats-facts');
    const statsCounters = Array.from(document.querySelectorAll('.count'));
    let hasAnimatedStats = false;

    function animateCounter(counter) {
        const startValue = Number(counter.dataset.start ?? 0);
        const targetValue = Number(counter.dataset.target ?? counter.textContent);
        const duration = 1200;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const currentValue = startValue + ((targetValue - startValue) * progress);
            const roundedValue = targetValue >= startValue
                ? Math.ceil(currentValue)
                : Math.floor(currentValue);

            counter.textContent = roundedValue;

            if (progress < 1) {
                window.requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = targetValue;
            }
        }

        counter.textContent = startValue;
        window.requestAnimationFrame(updateCounter);
    }

    function animateStatsCounters() {
        if (hasAnimatedStats) {
            return;
        }

        hasAnimatedStats = true;
        statsCounters.forEach(animateCounter);
    }

    function isStatsSectionVisible() {
        if (!statsSection) {
            return false;
        }

        const rect = statsSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        return rect.top <= viewportHeight * 0.85 && rect.bottom >= viewportHeight * 0.2;
    }

    function handleStatsVisibility() {
        if (isStatsSectionVisible()) {
            animateStatsCounters();
            window.removeEventListener('scroll', handleStatsVisibility);
            window.removeEventListener('resize', handleStatsVisibility);
            window.removeEventListener('load', handleStatsVisibility);
        }
    }

    statsCounters.forEach((counter) => {
        counter.textContent = counter.dataset.start ?? counter.textContent;
    });

    if (statsSection && statsCounters.length) {
        window.addEventListener('scroll', handleStatsVisibility);
        window.addEventListener('resize', handleStatsVisibility);
        window.addEventListener('load', handleStatsVisibility);
        handleStatsVisibility();
    }


    // ScrollToTop
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const btn = document.getElementById("scrollToTopBtn");
    btn.addEventListener("click", scrollToTop);

    window.onscroll = function () {
        const btn = document.getElementById("scrollToTopBtn");
        if (document.documentElement.scrollTop > 100 || document.body.scrollTop > 100) {
            btn.style.display = "flex";
        } else {
            btn.style.display = "none";
        }
    };

    // Services Tabs Autoplay
    const serviceButtons = Array.from(document.querySelectorAll('.services-tab .nav-link[data-bs-toggle="tab"]'));
    const serviceItems = Array.from(document.querySelectorAll('.services-tab .service-nav-item'));
    let servicesInterval;

    function syncActiveService(targetButton) {
        serviceItems.forEach((item) => item.classList.remove('active'));

        const activeItem = targetButton.closest('.service-nav-item');
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    function startServicesAutoplay() {
        if (serviceButtons.length < 2 || !window.bootstrap || !bootstrap.Tab) {
            return;
        }

        clearInterval(servicesInterval);

        servicesInterval = setInterval(() => {
            const currentIndex = serviceButtons.findIndex((button) => button.classList.contains('active'));
            const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % serviceButtons.length : 0;
            bootstrap.Tab.getOrCreateInstance(serviceButtons[nextIndex]).show();
        }, 4000);
    }

    serviceButtons.forEach((button) => {
        button.addEventListener('shown.bs.tab', function () {
            syncActiveService(button);
            startServicesAutoplay();
        });
    });

    if (serviceButtons.length) {
        const initialButton = serviceButtons.find((button) => button.classList.contains('active')) || serviceButtons[0];
        syncActiveService(initialButton);
        startServicesAutoplay();
    }


    // Aos
	AOS.init({
		once: true,
	});

});

