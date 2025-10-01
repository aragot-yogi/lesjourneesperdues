
const body = document.body;
const html = document.documentElement;

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || html.scrollTop;
    const docHeight = html.scrollHeight - window.innerHeight;
    const begin = .29;
    const scrollFraction = scrollTop / docHeight; // 0 at top, 1 at bottom
    const scrollAdjusted = Math.max(scrollFraction - begin, 0) / (1 - begin);

    // Map fraction to darkness (0 = no darkening, 50 = half dark)
    const opacity = scrollAdjusted * 100; // adjust max darkness in %
    const opacityMaxPosition = .2;
    const opacityAdjusted = Math.max(Math.min(opacity / opacityMaxPosition, 100), 0);
    // We turn the background color to blue instead of yellow when we reach 100% darkness
    const backgroundColor = opacityAdjusted === 100 ? "rgb(2, 2, 5)" : "#fffdf8" ;
    const coverageDarkNight = Math.min(50 + Math.max(0, opacity - 35), 85);
    let css = `background: linear-gradient(to bottom,
                      rgba(2, 2, 5, ${opacityAdjusted}%) 0%,
                      rgba(2, 2, 9, ${opacityAdjusted}%) ${coverageDarkNight}%,
                      rgba(11, 12, 42, ${opacityAdjusted}%) 100%),
                      ${backgroundColor};
                      background-attachment: fixed;`;
    body.style = css;
    //console.log(scrollFraction, scrollAdjusted, opacity, css);
});
