// Wriggling balls of earwigs for the Spark page. Uses the same sprites as earwig.js.
const DIRECTIONS = [
    ['east', 'E'], ['south-east', 'SE'], ['south', 'S'], ['south-west', 'SW'],
    ['west', 'W'], ['north-west', 'NW'], ['north', 'N'], ['north-east', 'NE'],
];

const FRAMES = DIRECTIONS.map(([name, code]) => [1, 2, 3, 4].map(
    i => new URL(`../assets/images/earwig/${name}/earwig${i}_${code}.png`, import.meta.url).href
));

// where a ball can sit, as % across the page: always off-centre
const SLOTS = [[4, 14], [20, 30], [70, 80], [86, 96]];
const BALL_SIZE = 150;
const BUG_SIZE = 80;
const BUGS_MIN = 7;
const BUGS_MAX = 11;
const HUDDLE_RADIUS = 28;
const FRAME_MS = 110;
const TURN_MIN_MS = 300;
const TURN_MAX_MS = 1100;
const RUN_SPEED_MIN = 380; // px per second
const RUN_SPEED_MAX = 750;
const RUN_FRAME_MS = 55;

const rand = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));

function directionFor(angle) {
    return ((Math.round(angle / (Math.PI / 4)) % 8) + 8) % 8;
}

function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
}

function setFrame(bug) {
    const src = FRAMES[bug.direction][bug.frame];
    if (bug.img.getAttribute('src') !== src) bug.img.src = src;
}

function createBug(parent) {
    const img = document.createElement('img');
    img.alt = '';
    img.draggable = false;

    // stays put inside the ball, only legs and heading change
    const x = rand(-HUDDLE_RADIUS, HUDDLE_RADIUS);
    const y = rand(-HUDDLE_RADIUS, HUDDLE_RADIUS);
    img.style.transform = `translate(${x}px, ${y}px)`;

    const bug = { img, x, y, direction: randInt(0, 7), frame: randInt(0, 3), nextFrame: 0, nextTurn: 0 };
    setFrame(bug);
    parent.appendChild(img);
    return bug;
}

export function createEarwigBalls(zone, onClick) {
    FRAMES.flat().forEach(src => { new Image().src = src; });

    // usually one ball, sometimes two or three, somewhere new each visit
    const roll = Math.random();
    const count = roll < 0.6 ? 1 : roll < 0.9 ? 2 : 3;

    const balls = shuffle(SLOTS.slice()).slice(0, count).map(([from, to]) => {
        const element = document.createElement('button');
        element.type = 'button';
        element.className = 'earwig-ball';
        element.setAttribute('aria-label', 'Something is moving');
        element.setAttribute('data-effect-ui', '');
        // calc() keeps the whole ball inside the zone on narrow screens
        element.style.left = `calc((100% - ${BALL_SIZE}px) * ${rand(from, to) / 100})`;
        element.style.top = `${rand(0, zone.clientHeight - BALL_SIZE)}px`;
        element.addEventListener('click', onClick);
        zone.appendChild(element);

        const bugs = Array.from({ length: randInt(BUGS_MIN, BUGS_MAX) }, () => createBug(element));
        return { element, bugs };
    });

    let frameId = null;

    function wriggle(now) {
        balls.forEach(({ bugs }) => bugs.forEach(bug => {
            if (now >= bug.nextTurn) {
                bug.direction = (bug.direction + (Math.random() < 0.5 ? 1 : 7)) % 8;
                bug.nextTurn = now + rand(TURN_MIN_MS, TURN_MAX_MS);
            }
            if (now >= bug.nextFrame) {
                bug.frame = (bug.frame + 1) % 4;
                bug.nextFrame = now + FRAME_MS * rand(0.7, 1.3);
                setFrame(bug);
            }
        }));
        frameId = requestAnimationFrame(wriggle);
    }
    frameId = requestAnimationFrame(wriggle);

    function scatter() {
        cancelAnimationFrame(frameId);

        const start = balls.flatMap(({ element, bugs }) => {
            const box = element.getBoundingClientRect();
            return bugs.map(bug => ({
                x: box.left + (BALL_SIZE - BUG_SIZE) / 2 + bug.x,
                y: box.top + (BALL_SIZE - BUG_SIZE) / 2 + bug.y,
                frame: bug.frame,
            }));
        });
        balls.forEach(({ element }) => element.remove());

        // headings are spread evenly round the circle so they flee in all directions
        let runners = shuffle(start).map((from, i) => {
            const img = document.createElement('img');
            img.className = 'earwig-runner';
            img.alt = '';
            img.setAttribute('aria-hidden', 'true');
            img.setAttribute('data-effect-ui', '');
            const angle = (i / start.length) * Math.PI * 2 + rand(-0.25, 0.25);
            const runner = { ...from, img, angle, direction: directionFor(angle), speed: rand(RUN_SPEED_MIN, RUN_SPEED_MAX), nextFrame: 0 };
            img.style.transform = `translate3d(${runner.x}px, ${runner.y}px, 0)`;
            setFrame(runner);
            document.body.appendChild(img);
            return runner;
        });

        let last = null;

        function run(now) {
            const dt = last === null ? 0 : Math.min(0.05, (now - last) / 1000);
            last = now;

            runners = runners.filter(runner => {
                runner.x += Math.cos(runner.angle) * runner.speed * dt;
                runner.y += Math.sin(runner.angle) * runner.speed * dt;

                const gone = runner.x < -BUG_SIZE || runner.x > window.innerWidth ||
                    runner.y < -BUG_SIZE || runner.y > window.innerHeight;
                if (gone) {
                    runner.img.remove();
                    return false;
                }

                if (now >= runner.nextFrame) {
                    runner.frame = (runner.frame + 1) % 4;
                    runner.nextFrame = now + RUN_FRAME_MS;
                    setFrame(runner);
                }
                runner.img.style.transform = `translate3d(${runner.x}px, ${runner.y}px, 0)`;
                return true;
            });

            if (runners.length > 0) requestAnimationFrame(run);
        }
        requestAnimationFrame(run);
    }

    return { scatter };
}
