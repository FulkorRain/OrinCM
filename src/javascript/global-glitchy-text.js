const nun404SwitchMinMs = 200;
const nun404SwitchMaxMs = 600;

const originalText = '404';
const jumpscareText = 'NUN';

let nun404TimeoutId = null;

function glitchText() {
    let result = "";
    for (let i = 0; i < originalText.length; i++) {
        result += Math.random() < 0.5 ? originalText[i] : jumpscareText[i];
    }

    return result;
}

function scheduleNextNun404Switch(element) {
    const delay = nun404SwitchMinMs + Math.random() * (nun404SwitchMaxMs - nun404SwitchMinMs);
    nun404TimeoutId = setTimeout(() => {
        const nextText = glitchText();
        element.textContent = nextText;
        element.dataset.text = nextText;
        scheduleNextNun404Switch(element);
    }, delay);
}

function stopNun404Switch() {
    if (nun404TimeoutId !== null) {
        clearTimeout(nun404TimeoutId);
        nun404TimeoutId = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const nun404Element = document.querySelector('.nun');
    if (nun404Element) {
        scheduleNextNun404Switch(nun404Element);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const glitchElements = document.querySelectorAll('.glitch');
    const cyberGlyphs = 'XΔ🛑█▓░░■☠️01⚙️🤖⏳µ§@#$¥%';
        const hieroGlyphs = '𓀀 𓁐 𓅱 𓆓 𓇯 𓈖 𓊹 𓊺 𓏏 𓏤';

    glitchElements.forEach(element => {
        const originalText = element.innerText.trim();
        element.setAttribute('data-text', originalText);
        
        const isHiero = element.classList.contains('hieroglyphics');
        const glyphs = isHiero ? hieroGlyphs : cyberGlyphs;

        function triggerLetterGlitch() {
            if (Math.random() > 0.4) return;

            let textArray = originalText.split('');
            const randomIndex = Math.floor(Math.random() * textArray.length);
            const randomGlyph = [...glyphs][Math.floor(Math.random() * [...glyphs].length)];
            
            textArray[randomIndex] = randomGlyph;
            const glitchedStr = textArray.join('');

            element.innerText = glitchedStr;
            element.setAttribute('data-text', glitchedStr);

            const delay = isHiero 
                ? Math.floor(Math.random() * 300) + 250  
                : Math.floor(Math.random() * 150) + 75;  

            setTimeout(() => {
                element.innerText = originalText;
                element.setAttribute('data-text', originalText);
            }, delay);
        }

        setInterval(triggerLetterGlitch, 750);
    });
});