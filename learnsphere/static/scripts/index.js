import Api from '/scripts/utils/api.js';
import CookieManager from '/scripts/utils/cookie-manager.js';

document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const response = await Api.post(
        'login/',
        Object.fromEntries([...new FormData(event.target)].filter(([k, v]) => v && [k, v]))
    );

    if (response) {
        CookieManager.set('bearer', response.access_token);
        window.location.href = '/dashboard.html';
    }
});