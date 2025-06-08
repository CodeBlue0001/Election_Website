// Load header
fetch('header.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;

        // Bind toggle menu functionality AFTER header is injected
        const toggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('.navbar');
        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                nav.classList.toggle('active');
            });
        }
    });

// Load footer
fetch('footer.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('footer-container').innerHTML = data;
    });
