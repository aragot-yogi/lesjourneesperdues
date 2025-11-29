
const body = document.body;
const html = document.documentElement;
const starsContainer = document.getElementById('stars-container');

function rgb(hex) {
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
    };
}


// Create stars
function createStars(count) {
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';

        // Random size (0.03-0.08rem)
        const size = Math.random() * 0.02 + 0.003;
        star.style.width = size + 'rem';
        star.style.height = size + 'rem';

        // Random animation delay
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = Math.random() * 60 + 30 + 's';

        starsContainer.appendChild(star);
    }
}

// Create 200 stars
createStars(90);

// Get the text content height
const container = document.querySelector('.container');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    // Get the bottom of the text content (excluding the padding-bottom)
    const textContentHeight = container.scrollHeight - window.innerHeight;
    const contentEnd = container.offsetTop + container.querySelector('.attribution').offsetTop + 1000;

    // Calculate how far past the content we've scrolled
    const scrollPastContent = Math.max(0, scrollTop - contentEnd);
    const maxScroll = 5000; // Distance to scroll for full night effect

    // Progress from 0 to 1
    const progress = Math.min(scrollPastContent / maxScroll, 1);

    if (progress > 0) {
        // Create gradient from day to night
        const dayColor = rgb("#fffdf8");
        const duskColor = rgb("#0b0205");
        const nightColor = rgb("#02020F");

        let r, g, b;
        function mix(color1, color2, t) {
            return {
                r: Math.round(color1.r + (color2.r - color1.r) * t),
                g: Math.round(color1.g + (color2.g - color1.g) * t),
                b: Math.round(color1.b + (color2.b - color1.b) * t),
            }
        }

        let result;
        if (progress < 0.5) {
            // Day to dusk
            const t = progress * 2;
            result = mix(dayColor, duskColor, t);
        } else {
            // Dusk to night
            const t = (progress - 0.5) * 2;
            result = mix(duskColor, nightColor, t);
        }

        const gradient = `linear-gradient(to bottom,
            rgb(${result.r}, ${result.g}, ${result.b}) 0%,
            rgb(${Math.max(0, result.r - 5)}, ${Math.max(0, result.g - 5)}, ${Math.max(0, result.b - 5)}) 100%)`;

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
