// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-section'); // Add base class if needed
    observer.observe(section);
});

// Sticky Scroll CTA Logic (New Implementation)
const stickyCTA = document.querySelector('.sticky-mobile-cta');
const triggerSection = document.querySelector('.horizontal-showcase'); // "Fits Naturally" section
const faqSection = document.querySelector('.faq-accordion'); // "Frequently Asked Questions" section

if (stickyCTA && triggerSection && faqSection) {
    const handleScroll = () => {
        const triggerRect = triggerSection.getBoundingClientRect();
        const faqRect = faqSection.getBoundingClientRect();

        // Show CTA when Trigger section (Fits Naturally) has exited the top of the viewport
        const isPastTrigger = triggerRect.bottom < 0;

        // Hide CTA when FAQ section HAS exited the viewport
        const isPastFAQ = faqRect.bottom < 0;

        // Visibility Logic
        if (isPastTrigger && !isPastFAQ) {
            stickyCTA.classList.add('visible');
        } else {
            stickyCTA.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load
    handleScroll();
}

// Cleanup: Removed broken stickyObserver usage
// Cleanup: Removed leftover comments

// Smooth Scroll for Anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Interiors Carousel Logic (Legacy - keep for reference or cleanup later)
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.getElementById('interiors-carousel');
    if (carouselContainer) {
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        const indicators = carouselContainer.querySelectorAll('.indicator');
        let currentSlide = 0;
        const totalSlides = slides.length;
        const intervalTime = 5000; // 5 seconds

        function showSlide(index) {
            // Remove active class from all
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(ind => ind.classList.remove('active'));

            // Add active class to current
            slides[index].classList.add('active');
            indicators[index].classList.add('active');

            currentSlide = index;
        }

        function nextSlide() {
            let nextIndex = (currentSlide + 1) % totalSlides;
            showSlide(nextIndex);
        }

        // Auto play
        let slideInterval = setInterval(nextSlide, intervalTime);

        // Click indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                clearInterval(slideInterval); // Reset timer on manual interaction
                showSlide(index);
                slideInterval = setInterval(nextSlide, intervalTime);
            });
        });
    }
});

// Interactive Feature List Logic
// Interactive Feature List Logic REMOVED to avoid conflict with Pinned Scroll
// (Features now only activate via scroll)

// Horizontal Scroll Focus & Auto-Loop Effect
document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.horizontal-scroll-container');
    const scrollItems = document.querySelectorAll('.scroll-item');

    if (scrollContainer && scrollItems.length > 0) {
        // Removed pause on hover/touch logic as per user request

        const updateFocus = () => {
            const containerRect = scrollContainer.getBoundingClientRect();
            const containerCenterOnScreen = containerRect.left + containerRect.width / 2;

            let closestItem = null;
            let minDistance = Infinity;

            scrollItems.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.left + itemRect.width / 2;
                const distance = Math.abs(containerCenterOnScreen - itemCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestItem = item;
                }
            });

            scrollItems.forEach(item => {
                if (item === closestItem) {
                    item.classList.add('focused');
                } else {
                    item.classList.remove('focused');
                }
            });
        };

        // Auto-Scroll Logic
        const speed = 0.5; // Pixels per frame

        const animate = () => {
            // Always scroll
            scrollContainer.scrollLeft += speed;

            // Check for loop reset
            // If we've scrolled past the first set of items (5 items * approx width + gap)
            // Ideally we calculate this dynamically, but for now we check if we are near end
            // A simpler seamless loop: if scrollLeft + clientWidth >= scrollWidth - small_epsilon, reset
            // But we created 3 sets. We like to reset when we hit the middle of 2nd set to start of 2nd set?
            // Easiest seamless loop: When scrollLeft reaches (totalScrollWidth / 3), reset to 0 (if sets are identical)
            // Wait, we need to be careful not to jump.
            // Let's assume 3 identical sets. When we reach the start of the 2nd set, we are visually identical to start of 1st.
            // The scrollWidth represents 3 sets.
            // One set width = scrollContainer.scrollWidth / 3.

            const singleSetWidth = scrollContainer.scrollWidth / 3;

            // If we have scrolled past the first set completely
            if (scrollContainer.scrollLeft >= singleSetWidth) {
                scrollContainer.scrollLeft -= singleSetWidth;
            }

            updateFocus();
            requestAnimationFrame(animate);
        };

        // Initial Start
        requestAnimationFrame(animate);
    }
});

// Pinned Scroll Logic for Benefits
document.addEventListener('scroll', () => {
    const benefitsSection = document.querySelector('.benefits');
    const featureItems = document.querySelectorAll('.feature-item');
    const featureImage = document.getElementById('feature-image');

    if (benefitsSection && featureItems.length > 0) {
        const rect = benefitsSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate progress through the section (0 to 1)
        // We are interested when the top of the section hits the top of viewport (0) 
        // until the bottom of the section hits the bottom of viewport (or top, depending on desired dwell)

        // Actually, since we set height to 300vh and content is sticky top:0 for 100vh:
        // The content stays fixed for 200vh of scrolling.

        // Start: rect.top <= 0
        // End: rect.bottom <= viewportHeight

        if (rect.top <= 0 && rect.bottom >= viewportHeight) {
            const totalScrollableHeight = rect.height - viewportHeight;
            const scrolled = Math.abs(rect.top);
            const progress = scrolled / totalScrollableHeight;

            // Allow a bit of buffer
            const safeProgress = Math.min(Math.max(progress, 0), 0.99);

            // Map progress to item index (0 to length-1)
            const index = Math.floor(safeProgress * featureItems.length);

            // Activate Only the current index
            featureItems.forEach((item, i) => {
                if (i === index) {
                    if (!item.classList.contains('active')) {
                        item.classList.add('active');
                        // Change Image
                        const newSrc = item.getAttribute('data-image');
                        if (newSrc && featureImage.src !== newSrc) {
                            featureImage.style.opacity = '0'; // Quick fade
                            setTimeout(() => {
                                featureImage.src = newSrc;
                                featureImage.onload = () => featureImage.style.opacity = '1';
                            }, 150);
                        }
                    }
                } else {
                    item.classList.remove('active');
                }
            });
        }
    }
});
