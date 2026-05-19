document.querySelectorAll('.sidebar-btn').forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');

        
        // lowkey this is not efficient but idc
        document.querySelectorAll('.home-temp').forEach(element => {
            element.style.display = 'none';
            if (button.getAttribute('data-target') === 'home-content'){
                element.style.display = 'block';
            };
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