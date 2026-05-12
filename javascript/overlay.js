class OverlayManager {
    constructor() {
        this.overlay = document.getElementById('modular-overlay');
        this.content = document.getElementById('app-root');
        this.button = document.getElementById('overlay-button');
        
        if (this.overlay && this.content && this.button) {
            this.init();
        }
    }

    init() {
        const version = this.overlay.getAttribute('data-version');
        
        if (version === 'v1') {
            this.button.addEventListener('click', () => this.unlock());
        }
    }

    unlock() {
        this.overlay.style.display = 'none';
        this.content.classList.remove('content-hidden');
        document.body.classList.remove('no-scroll');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new OverlayManager();
});