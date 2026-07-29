(function buildGutter() {
    const lines = document.querySelectorAll(".code-line");
    const gutter = document.getElementById("code-gutter");
    lines.forEach((line, i) => {
        const span = document.createElement("span");
        span.className = 'gutter-line';
        span.textContent = i + 1;
        if (line.classList.contains("seal-line")) {
            span.classList.add("h1");
        }
        gutter.appendChild(span);
    })
})();

let isDirty = false;
function markDirty() {
    if (isDirty) return;
    isDirty = true;
    document.getElementById("tab-dirty-dot").classList.add('visible');
    document.getElementById('sb-modified').classList.add('show');
}

document.getElementById('code-scroll').addEventListener('click', function (e) {
    const line = e.target.closest('.code-line');
    if (!line) return;
    const lines = Array.from(document.querySelectorAll('.code-line'));
    const ln = lines.indexOf(line) + 1;
    document.getElementById('sb-cursor').textContent = `Ln ${ln}, Col 1`;
});

let toastTimer;

function showToast(msg, duration) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), duration || 2500);
}

document.querySelectorAll('.editable-zone:not(#seal-content)').forEach(zone => {
    zone.addEventListener('input', function () {
        markDirty();
        showToast('Edit Saved - Keep Looking', 2200);
    });

    zone.addEventListener('focus', function () {
        const line = this.closest('.code-line');
        if (line) {
            const lines = Array.from(document.querySelectorAll('.code-line'));
            const ln =  lines.indexOf(line) + 1;
            document.getElementById('sb-cursor').textContent = `Ln ${ln}, Col 1`;
        }
    });

    zone.addEventListener('keydown', function (e) {
        if (e.key == 'Enter') e.preventDefault();
    });
});

const SEAL_TEXT = 'corrupted';

const sealElement = document.getElementById('seal-content');
const sealLine = document.getElementById('seal-line');

if (sealElement && sealLine) {

    sealElement.addEventListener('input', function() {
        markDirty();
        const value = this.textContent.trim();
    
        if (value.length === 0) {
            sealLine.classList.add('broken');
            triggerSecret();
        } else if (value.length < SEAL_TEXT.length) {
            showToast('The seal is weakening...', 1500);
            sealLine.classList.add('broken');
        } else {
            sealLine.classList.remove('broken');
            showToast('Something is locked here.', 1800);
        }
    });
    
    sealElement.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') e.preventDefault();
    });
    
    let secretTriggered = false;
    function triggerSecret() {
        if (secretTriggered) return;
        secretTriggered = true;
    
        document.getElementById('sb-hint').textContent = 'seal broken';
        document.getElementById('sb-hint').classList.add('glow');
    
        setTimeout(() => {
            document.getElementById('secret-overlay').classList.add('reveal');
        }, 600);
    
    }
}


function closeSecret() {
    document.getElementById('secret-overlay').classList.remove('reveal');
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeSecret();
    }
});

document.getElementById('code-scroll').addEventListener('scroll', function () {
    document.getElementById('code-gutter').scrollTop = this.scrollTop;
});

document.querySelectorAll('.ft-item').forEach(item => {
    item.addEventListener('click', function () {
        if (this.classList.contains('active')) return;
        showToast('File not available in inspector mode.', 2000);
    });
});