import { stateManager, EVENT_INTENSITY_CHANGED } from './managers/state-manager.js';
import { isEffectsEnabled } from './managers/targets.js';
import { HIGH_INFECTION, SHELF_SEEN_KEY } from './scare-settings.js';

const MISSING_DOLLS = [
    { upTo: 2, chance: 0.2, min: 1, max: 1 },
    { upTo: 4, chance: 0.4, min: 1, max: 2 },
    { upTo: HIGH_INFECTION - 1, chance: 0.6, min: 2, max: 3 },
];

const shelf = document.querySelector('.doll-shelf');
const dolls = Array.from(shelf.querySelectorAll('img'));
const petrolPage = document.getElementById('petrol-content');
const homePage = document.getElementById('home-content');

function hideDolls(list) {
    list.forEach(doll => { doll.style.visibility = 'hidden'; });
}

function hideSomeDolls(level) {
    const row = MISSING_DOLLS.find(entry => level <= entry.upTo);
    if (!row || Math.random() >= row.chance) return;

    const count = row.min + Math.floor(Math.random() * (row.max - row.min + 1));
    const pool = dolls.slice();
    const gone = [];
    while (gone.length < count && pool.length > 1) {
        gone.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    hideDolls(gone);
}

function watchForEmptyShelf() {
    const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.intersectionRatio >= 0.5)) return;
        if (dolls.some(doll => doll.style.visibility !== 'hidden')) return;
        try {
            localStorage.setItem(SHELF_SEEN_KEY, '1');
        } catch (error) {
            console.warn('Could not save the shelf visit', error);
        }
    }, { threshold: 0.5 });
    observer.observe(shelf);
}

function resumeEffects() {
    document.body.removeAttribute('data-effects-skip');
}

const level = isEffectsEnabled() ? stateManager.getIntensity() : 0;

if (level >= HIGH_INFECTION) {
    homePage.style.display = 'none';
    petrolPage.style.display = 'block';
    hideDolls(dolls);
    watchForEmptyShelf();

    document.body.setAttribute('data-effects-skip', 'all');
    document.querySelectorAll('.sidebar-btn').forEach(link => link.addEventListener('click', resumeEffects));
} else if (level > 0) {
    hideSomeDolls(level);
}

document.addEventListener(EVENT_INTENSITY_CHANGED, event => {
    if (event.detail.intensity !== 0) return;
    dolls.forEach(doll => { doll.style.visibility = ''; });
    if (petrolPage.style.display !== 'none') {
        petrolPage.style.display = 'none';
        homePage.style.display = 'block';
    }
    resumeEffects();
});
