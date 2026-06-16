import {stateManager} from "./managers/state-manager.js";
import {screenShake} from "./effects/screen-shake.js";
import {corruptText} from "./effects/text-corruption.js";
import {flicker} from "./effects/flicker.js";
import {imageWarp} from "./effects/image-warp.js";
import { pictureDecay } from "./effects/pixel-decay.js";
import {screenDecay} from  "./effects/screen-decay.js";


const effectRegistry = [
    {
        id: 'text-corruption',
        title: 'Text Corruption',
        description: 'Ancient glyphs bleed through written word.',
        crackClass: '',
        type: 'toggle',
        buildContent(sectionElement) {
            const p = document.createElement('p');
            p.className = 'corruptable-text';
            p.textContent = 'The system is functioning normally. All processes stable. No anomalies detected.';
            sectionElement.querySelector('.section-content').appendChild(p);
        },
        run(sectionElement) {
            return corruptText(sectionElement);
        }
    },
    {
        id: 'screen-distortion',
        title: 'Screen Distortion',
        description: 'The ground shifts. Something stirs beneath',
        crackClass: 'clay-crack-2',
        type: 'toggle',
        buildContent(sectionElement) {
            const p = document.createElement('p');
            p.className = 'section-desc';
            p.textContent = 'Environmental instability detected. Seismic readings off the chart.';
            sectionElement.querySelector('.section-content').appendChild(p);
        },
        run() {
            return screenShake();
        }
    },
    {
        id: 'light-flicker',
        title: 'Light Flicker',
        description: 'The lights know you are watching.',
        crackClass: '',
        type: 'toggle',
        buildContent(sectionElement) {
            const p = document.createElement('p');
            p.className = 'section-desc';
            p.textContent = 'Electrical fluctuations present. The bulbs remember the dark.';
            sectionElement.querySelector('.section-content').appendChild(p);
        },
        run() {
            return flicker();
        }
    },
    {
        id: 'image-corruption',
        title: 'Image Corruption',
        description: 'What the eye sees, the mind distorts',
        crackClass: '',
        type: 'toggle',
        buildContent(sectionElement) {
            const img = document.createElement('img');
            img.className = 'corruptable-image';
            img.src = 'https://picsum.photos/seed/golem/400/220';
            img.alt = 'Corruptable Image';
            sectionElement.querySelector('.section-content').appendChild(img);
        },
        run(sectionElement) {
            return imageWarp(sectionElement);
        }
    },
    {
        id: 'picture-decay',
        title: 'Picture Decay',
        description: 'The image remembers nothing. Darkness takes it cell by cell.',
        crackClass: 'clay-crack-2',
        type: 'toggle',
        buildContent(sectionElement) {
            const canvas = document.createElement('canvas');
            canvas.className = 'decay-canvas';
            canvas.width = 400;
            canvas.height = 200;
            canvas.dataset.src = 'https://picsum.photos/seed/decay/400/220';
            sectionElement.querySelector('.section-content').appendChild(canvas);
        },
        run(sectionElement) {
            return pictureDecay(sectionElement);
        }
    },
    {
        id: 'screen-decay',
        title: 'Section Decay',
        description: 'The clay remembers nothing. It crumbles, cell by cell.',
        crackClass: 'clay-crack-3',
        type: 'toggle',
        buildContent(sectionElement) {
            const p = document.createElement('p');
            p.className = 'section-desc';
            p.textContent = 'Structural integrity falling. The golem forgets its shape.'
            sectionElement.querySelector('.section-content').appendChild(p);
        },
        run(sectionElement) {
            return screenDecay(sectionElement);
        }
    },

]

function buildPage() {
    const container = document.getElementById('sections-container');

    effectRegistry.forEach(effect => {
       const section = document.createElement('section');
       section.className = 'effect-section';
       section.id = effect.id;

       section.innerHTML = `
       <span class="active-badge">Active</span>
       <h2 class="section-title">${effect.title}</h2>
       <p class="section-desc">${effect.description}</p>
       <div class="section-content"></div>
       <button class="clay-btn ${effect.crackClass}" data-effect="${effect.id}">
            <span>Activate</span>
        </button>
       `;

       effect.buildContent(section);
       const btn = section.querySelector('.clay-btn');
       btn.addEventListener('click', () => {
        const isNowActive = effect.run(section, btn);

        if (isNowActive) {
            btn.querySelector('span').textContent = 'Deactivate';
            btn.classList.add('btn-active');
            section.classList.add('is-active');
        } else {
            btn.querySelector('span').textContent = 'Activate';
            btn.classList.remove('btn-active');
            section.classList.remove('is-active');
        }
       });

       container.appendChild(section);
    });
}

function initIntensityUI() {
    const valueElement = document.getElementById('intensity-value');

    function refresh() {
        valueElement.textContent = stateManager.getIntensity();
        valueElement.classList.remove('bump');
        void valueElement.offsetWidth;
        valueElement.classList.add('bump');
        setTimeout(() => valueElement.classList.remove('bump'), 150);
    }

    document.getElementById('increase').addEventListener('click', () => {
        stateManager.increaseIntensity();
        refresh();
    });

    document.getElementById('decrease').addEventListener('click', () => {
        stateManager.decreaseIntensity();
        refresh();
    });

    refresh();
}

buildPage();
initIntensityUI();