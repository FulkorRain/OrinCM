const RING_TEXT = 'THE FOURTH ESTATE';
const RADIUS_X = 260;
const RADIUS_Y = 80;
const ROTATE_SPEED = 20;
const FADE_START = 0.2;
const FADE_END = -0.2;
const CURVE_LETTERS = false;
const VERTICAL_OFFSET = 200;
const ARC_SPAN = 200;

const ring = document.getElementById('skullRing');
const chars = [...RING_TEXT];
const angleStep = ARC_SPAN / (chars.length - 1);

const fragment = document.createDocumentFragment();
const letters = chars.map((char, i) => {
    const element = document.createElement('span');
    element.className = 'ring-word';
    element.textContent = char;
    fragment.appendChild(element);
    return {element, baseAngle: -angleStep * i};
});
ring.appendChild(fragment);

function clamp (value, min, max) {
    return Math.min(max, Math.max(min, value));
}

let currentAngle = 0;
let lastTime = performance.now();

function animate(now) {
    const deltaSeconds = (now - lastTime) / 1000;
    lastTime = now;
    currentAngle = (currentAngle + ROTATE_SPEED * deltaSeconds) % 360;
    letters.forEach(({element, baseAngle}) => {
        const angleDegree = (baseAngle + currentAngle) % 360;
        const angleRadians = angleDegree * (Math.PI / 180);
        
        const x = Math.cos(angleRadians) * RADIUS_X
        const y = Math.sin(angleRadians) * RADIUS_Y + VERTICAL_OFFSET;

        const depth = Math.sin(angleRadians);
        const opacity = clamp((depth - FADE_END) / (FADE_START - FADE_END), 0, 1);

        let transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`;
        if (CURVE_LETTERS) transform += ` rotate(${angleDegree - 90}deg)`;

        element.style.transform = transform;
        element.style.opacity = opacity;
    }); 

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);