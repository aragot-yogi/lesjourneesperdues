
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

/** Return a range from 0 to 1 when t=min to t=max */
function calcProgress(t, min, max) {
    return Math.min(Math.max(0, (t - min) / (max - min)), 1);
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
    const maxScroll = document.body.clientHeight - contentEnd; // Distance to scroll for full night effect

    // Progress from 0 to 1
    const progress = Math.min(scrollPastContent / maxScroll, 1);
    console.log(progress);

    if (progress > 0) {
        // Create gradient from day to night
        const dayColor = rgb("#fffdf8");
        const nightColor = rgb("#020205");
        const duskColor = rgb("#0b0c2a");

        function mix(color1, color2, t) {
            return {
                r: Math.round(color1.r + (color2.r - color1.r) * t),
                g: Math.round(color1.g + (color2.g - color1.g) * t),
                b: Math.round(color1.b + (color2.b - color1.b) * t),
            }
        }

        let top, bottom;
        if (progress < 0.5) {
            // Day to dusk
            const t = calcProgress(progress, 0, .5);
            top = mix(dayColor, nightColor, t);
            bottom = mix(dayColor, nightColor, t);
        } else {
            // Dusk to night
            const t = calcProgress(progress, .5, .95);
            top = nightColor;
            bottom = mix(nightColor, duskColor, t);
        }

        const gradient = `linear-gradient(to bottom,
            rgb(${top.r}, ${top.g}, ${top.b}) 0%,
            rgb(${top.r}, ${top.g}, ${top.b}) 40%,
            rgb(${bottom.r}, ${bottom.g}, ${bottom.b}) 100%) fixed,
            rgb(2, 2, 5)`; // Set background color when they extra-pull the scroll

        body.style.background = gradient;

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
