$(document).ready(function() {
    $('a.abstract').click(function() {
        $(this).parent().parent().find(".abstract.hidden").toggleClass('open');
    });
    $('a.bibtex').click(function() {
        $(this).parent().parent().find(".bibtex.hidden").toggleClass('open');
    });
    $('.navbar-nav').find('a').removeClass('waves-effect waves-light');

    const menuToggle = document.getElementById('nav-menu-toggle');
    const menuShell = document.getElementById('navMenuShell');
    const navShell = document.querySelector('.nav-shell');
    const NAV_MENU_STATE_KEY = 'navMenuOpen';

    if (menuToggle && menuShell) {
        const applyMenuState = function(isOpen) {
            menuShell.classList.toggle('is-open', isOpen);
            menuToggle.classList.toggle('is-open', isOpen);
            if (navShell) {
                navShell.classList.toggle('nav-menu-open', isOpen);
            }
            document.documentElement.setAttribute('data-nav-open', isOpen ? 'true' : 'false');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        };

        // Restore menu state across page navigations.
        try {
            const persisted = window.localStorage.getItem(NAV_MENU_STATE_KEY) === 'true';
            applyMenuState(persisted);
        } catch (e) {
            applyMenuState(false);
        }

        menuToggle.addEventListener('click', function() {
            menuShell.classList.add('is-animating');
            if (navShell) {
                navShell.classList.add('nav-animate');
            }
            const isOpen = !menuShell.classList.contains('is-open');
            applyMenuState(isOpen);
            try {
                window.localStorage.setItem(NAV_MENU_STATE_KEY, String(isOpen));
            } catch (e) {
                // Ignore storage errors (private mode, quota, etc.).
            }
        });
    }
});
