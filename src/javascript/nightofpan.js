document.querySelectorAll('.sidebar-btn').forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        

        document.querySelectorAll('.content-page').forEach(page => {
            page.style.display = 'none';
        });


        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            targetPage.style.display = 'block';
        }
    });
});

const audio = document.getElementById('music-track');
const button = document.getElementById('music-player');

button.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
})

audio.addEventListener('play', () => {
    button.src = "../assets/images/music_button_on.png";
})

audio.addEventListener('pause', () => {
    button.src = "../assets/images/music_button_pause.png";
})