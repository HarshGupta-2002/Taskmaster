document.addEventListener("DOMContentLoaded", function () {
    const themeButton = document.getElementById('theme-icon');
    const dropdown = document.getElementById('theme-dropdown');

    // Function to set the theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('selectedTheme', theme);
    }

    // Check local storage for a saved theme
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    }

    themeButton.addEventListener('click', function (event) {
        event.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    dropdown.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            const theme = this.getAttribute('data-status');
            setTheme(theme);
            dropdown.style.display = 'none';
        });
    });

    window.addEventListener('click', function (event) {
        if (!event.target.matches('.theme-button') &&
            !event.target.matches('#theme-dropdown') &&
            !event.target.matches('#theme-dropdown a')) {
            dropdown.style.display = 'none';
        }
    });
});