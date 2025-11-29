
const body = document.body;
const html = document.documentElement;
const starsContainer = document.getElementById('stars-container');

// Create stars
function createStars(count) {
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';

        // Random size (0.03-0.08rem)
        const size = Math.random() * 0.05 + 0.03;
        star.style.width = size + 'rem';
        star.style.height = size + 'rem';

        // Random animation delay
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = Math.random() * 120 + 30 + 's';

        starsContainer.appendChild(star);
    }
}

// Create 200 stars
createStars(200);

// Get the text content height
const container = document.querySelector('.container');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    // Get the bottom of the text content (excluding the padding-bottom)
    const textContentHeight = container.scrollHeight - window.innerHeight;
    const contentEnd = container.offsetTop + container.querySelector('.attribution').offsetTop + 200;

    // Calculate how far past the content we've scrolled
    const scrollPastContent = Math.max(0, scrollTop - contentEnd);
    const maxScroll = 800; // Distance to scroll for full night effect

    // Progress from 0 to 1
    const progress = Math.min(scrollPastContent / maxScroll, 1);

    if (progress > 0) {
        // Create gradient from day to night
        const dayColor = { r: 255, g: 253, b: 248 }; // #fffdf8
        const duskColor = { r: 25, g: 25, b: 60 };
        const nightColor = { r: 10, g: 10, b: 30 };

        let r, g, b;

        if (progress < 0.5) {
            // Day to dusk
            const t = progress * 2;
            r = Math.round(dayColor.r + (duskColor.r - dayColor.r) * t);
            g = Math.round(dayColor.g + (duskColor.g - dayColor.g) * t);
            b = Math.round(dayColor.b + (duskColor.b - dayColor.b) * t);
        } else {
            // Dusk to night
            const t = (progress - 0.5) * 2;
            r = Math.round(duskColor.r + (nightColor.r - duskColor.r) * t);
            g = Math.round(duskColor.g + (nightColor.g - duskColor.g) * t);
            b = Math.round(duskColor.b + (nightColor.b - duskColor.b) * t);
        }

        // Apply gradient background
        const gradient = `linear-gradient(to bottom,
            rgb(${r}, ${g}, ${b}) 0%,
            rgb(${Math.max(0, r - 5)}, ${Math.max(0, g - 5)}, ${Math.max(0, b + 20)}) 100%)`;

        body.style.background = gradient;
        body.style.backgroundAttachment = 'fixed';

        // Show stars when night falls (after 30% progress)
        if (progress > 0.3) {
            const starOpacity = (progress - 0.3) / 0.7;
            starsContainer.style.opacity = starOpacity;
        } else {
            starsContainer.style.opacity = 0;
        }
    } else {
        // Reset to day
        body.style.background = '#fffdf8';
        starsContainer.style.opacity = 0;
    }
});
