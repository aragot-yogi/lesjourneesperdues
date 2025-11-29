
const body = document.body;
const html = document.documentElement;
const starsContainer = document.getElementById('stars-container');
let pageLoadTime = new Date().getTime();

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

function calculateBackground() {
    let scrollTop = window.scrollY;

    // Get the bottom of the text content (excluding the padding-bottom)
    let contentEnd = container.offsetTop + container.querySelector('.attribution').offsetTop + 1000;

    // Calculate how far past the content we've scrolled
    let scrollPastContent = Math.max(0, scrollTop - contentEnd);
    let maxScroll = document.body.clientHeight - contentEnd; // Distance to scroll for full night effect

    // Progress in scroll from 0 to 1
    let progress = Math.min(scrollPastContent / maxScroll, 1);
    // Progress in time from 0 to 1 (0 = first 5 minutes = night, 1 = next 2 minutes = sunrise)
    let sunriseDuration = 3 * 60;
    let sunriseStart = 5 * 60;
    let timeProgress = calcProgress(new Date().getTime() - pageLoadTime, sunriseStart * 1000, (sunriseStart + sunriseDuration) * 1000);
    console.log(progress);

    if (progress > 0) {
        // Create gradient from day to night. But with time, the night color becomes a sunrise.
        const dayColor = rgb("#fffdf8");
        const nightColor = rgb("#020205");
        const duskColor = rgb("#0b0c2a");
        const sunriseSkyColor = rgb("#c62805");
        const sunriseGroundColor = rgb("#f3c910");
        const skyColor = mix(nightColor, sunriseSkyColor, timeProgress);
        const groundColor = mix(duskColor, sunriseGroundColor, timeProgress);

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
            let t = calcProgress(progress, 0, .5);
            top = mix(dayColor, skyColor, t);
            bottom = mix(dayColor, skyColor, t);
        } else {
            // Dusk to night
            let t = calcProgress(progress, .5, .95);
            top = skyColor;
            bottom = mix(skyColor, groundColor, t);
        }

        let gradient = `linear-gradient(to bottom,
        rgb(${top.r}, ${top.g}, ${top.b}) 0%,
        rgb(${top.r}, ${top.g}, ${top.b}) 40%,
        rgb(${bottom.r}, ${bottom.g}, ${bottom.b}) 100%) fixed,
        rgb(2, 2, 5)`; // Set background color when they extra-pull the scroll

        body.style.background = gradient;

        // Show stars when night falls (after 30% progress)
        if (progress > 0.3) {
            let starOpacity = (progress - 0.3) / 0.7;
            starsContainer.style.opacity = starOpacity;
        } else {
            starsContainer.style.opacity = 0;
        }
    } else {
        // Reset to day
        body.style.background = '#fffdf8';
        starsContainer.style.opacity = 0;
    }
}

window.addEventListener('scroll', calculateBackground);
window.setInterval(calculateBackground,  1000);
