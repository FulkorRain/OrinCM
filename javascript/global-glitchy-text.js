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