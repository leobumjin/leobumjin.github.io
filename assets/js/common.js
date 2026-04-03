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

    if (menuToggle && menuShell) {
        menuToggle.addEventListener('click', function() {
            const isOpen = menuShell.classList.toggle('is-open');
            menuToggle.classList.toggle('is-open', isOpen);
            if (navShell) {
                navShell.classList.toggle('nav-menu-open', isOpen);
            }
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }
});
