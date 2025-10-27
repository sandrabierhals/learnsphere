import Api from '/scripts/utils/api.js';
import CookieManager from '/scripts/utils/cookie-manager.js';

(async () => {
    // Fetch the data
    const user = await Api.get('/profile');

    [...document.querySelectorAll(`[data-user]`)].forEach((element) => {
        const key = element.dataset.user;
        let value = user[key];

        if (key === 'password') {
            value = value.replace(/./g, '*');
        }

        element.innerHTML = value;
    });
})();

document.querySelector('button#delete').addEventListener('click', async () => {
    const response = await Api.delete(`/profile`);

    if (response) {
        CookieManager.delete('bearer');
        window.location.href = '/';
    }
});