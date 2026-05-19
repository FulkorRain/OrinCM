document.querySelectorAll('.sidebar-btn').forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        
        document.querySelectorAll('.home-temp').forEach(element => {
            element.style.display = 'none';
        });
        

        document.querySelectorAll('.content-page').forEach(page => {
            page.style.display = 'none';
        });


        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            targetPage.style.display = 'block';
        }
    });
});