if (document.querySelector('aside')) {
    const aside = document.querySelector('aside');

    // Set aside position based on header and footer height
    aside.style.top = h ? `${h.clientHeight}px` : '0';

    // Inject aside elements
    aside.innerHTML = `
        <div class="drawer">
            <div class="menu">
                <a href="/dashboard.html">Dashboard</a>
                <a href="/languages.html">Enroll</a>
                <a href="/profile.html">Profile</a>
                <a id="logout" href="#">Logout</a>
            </div>

            <div class="legal">
                <a href="/terms.html">Terms and Conditions</a>
                <a href="/privacy.html">Privacy Policy</a>
                <a href="/cookie.html">Cookie Policy</a>
            </div>
        </div>
    `;

    const toggle = document.querySelector('.drawer-toggle');

    toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="36px" height="36px" viewBox="0 0 16 16"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.75 12.25h10.5m-10.5-4h10.5m-10.5-4h10.5"/></svg>';

    const drawerToggle = () => {
        if (!aside.classList.contains('animating')) {
            document.querySelector('header').classList.toggle('active');
            aside.classList.toggle('active');

            if (aside.classList.contains('active')) {
                toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="36px" height="36px" viewBox="0 0 24 24"><path fill="currentColor" d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4"/></svg>';

                aside.classList.add('visible');
            } else {
                toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="36px" height="36px" viewBox="0 0 16 16"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.75 12.25h10.5m-10.5-4h10.5m-10.5-4h10.5"/></svg>';

                setTimeout(() => {
                    aside.classList.remove('visible');
                }, 500);
            }

            aside.classList.add('animating');
            setTimeout(() => {
                aside.classList.remove('animating');
            }, 500);
        }
    };

    toggle.addEventListener('click', drawerToggle);

    aside.addEventListener('click', (event) => {
        if (event.target === this) {
            console.log('Click was on the parent element.');
        } else {
            console.log('Click was on a child element.');
            drawerToggle();
        }
    });

    // Logout
    document.querySelector('#logout').addEventListener('click', async () => {
        const response = await Api.get('/logout');

        if (response) {
            Storage.cookie.delete('bearer');
            window.location.href = '/';
        }
    });
}