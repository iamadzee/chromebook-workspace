(function () {
    const storageKey = 'chromebook-tools-theme';
    const root = document.documentElement;
    const themeColor = document.querySelector('meta[name="theme-color"]');

    function getSavedTheme() {
        try {
            return localStorage.getItem(storageKey) === 'light' ? 'light' : 'dark';
        } catch {
            return 'dark';
        }
    }

    function applyTheme(theme) {
        const isLight = theme === 'light';
        root.dataset.theme = isLight ? 'light' : 'dark';
        if (themeColor) {
            themeColor.content = isLight ? '#f4f7ff' : '#0b1020';
        }

        const button = document.getElementById('themeToggle');
        if (button) {
            button.textContent = isLight ? 'Switch to dark theme' : 'Switch to light theme';
            button.setAttribute('aria-pressed', String(isLight));
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(storageKey, theme);
        } catch {
            const button = document.getElementById('themeToggle');
            if (button) {
                button.title = 'Theme changed, but the preference could not be saved.';
            }
        }
        applyTheme(theme);
    }

    applyTheme(getSavedTheme());

    window.addEventListener('storage', event => {
        if (event.key === storageKey) {
            applyTheme(event.newValue === 'light' ? 'light' : 'dark');
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        let button = document.getElementById('themeToggle');
        if (!button) {
            button = document.createElement('button');
            button.id = 'themeToggle';
            button.className = 'theme-toggle';
            button.type = 'button';
            button.setAttribute('aria-pressed', String(root.dataset.theme === 'light'));
            button.textContent = root.dataset.theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
            document.body.appendChild(button);
        }

        button.addEventListener('click', () => {
            saveTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
        });
    });
})();
