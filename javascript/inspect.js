(function buildGutter() {
    const lines = document.querySelectorAll(".code-line");
    const gutter = document.getElementById("code-gutter");
    lines.forEach((line, i) => {
        const span = document.createElement("span");
        span.className = 'gutter-line';
        span.textContent = i + 1;
        if (line.classList.contains("vessel-line")) {
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

document.querySelectorAll('.editable-zone:not(#vessel-content)').forEach(zone => {
    zone.addEventListener('input', function () {
        markDirty();
        showToast('Edit Saved - Keep Looking', 2200);
    });

    zone.addEventListener('focus', function () {
        const line = this.closest('.code-line');
        if (line) {
            const lines = Array.from(document.querySelectorAll('.code-line'));
            const ln = lines = lines.indexOf(line) + 1;
            document.getElementById('sb-cursor').textContent = `Ln ${ln}, Col 1`;
        }
    });

    zone.addEventListener('keydown', function (e) {
        if (e.key == 'Enter') e.preventDefault();
    });
});

const SECRET_WORD = 'ANIMA';

const vesselEl = document.getElementById('vessel-content');
const vesselLine = document.getElementById('vessel-line');
const vesselComments = [
    'vessel-comment-1',
    'vessel-comment-2',
    'vessel-comment-3',
    'vessel-comment-4',
    'vessel-comment-5',
];

vesselEl.addEventListener('input', function () {
    markDirty();
    const val = vesselEl.textContent.trim().toUpperCase();

    if (this.textContent.trim().length > 0) {
        this.classList.add('has-text');
    } else {
        this.classList.remove('has-text');
    }

    vesselLine.classList.add('active');
    vesselComments.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
    });

    if (val === SECRET_WORD) {
        triggerSecret();
    } else if (val.length > 0) {
        if (SECRET_WORD.startsWith(val)) {

            showToast(`Something Stirs (${val.length}/${SECRET_WORD.length})`, 1500);
        } else {

            showToast('The vessel does not respond.', 1800);
        }
    } else {
        vesselLine.classList.remove('active');
        vesselComments.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        });
    }
});

vesselEl.addEventListener('keydown', function (e) {
    if (e.key == 'Enter') e.preventDefault();
});

let secretTriggered = false;
function triggerSecret() {
    if (secretTriggered) return;
    secretTriggered = true;

    document.getElementById('sb-hint').textContent = 'The vessel responds... The secret is revealed.';
    document.getElementById('sb-hint').classList.add('glow');

    setTimeout(() => {
        document.getElementById('secret-overlay').classList.add('reveal');
    }, 600);

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