(async () => {
    // Fetch the data
    const user = await Api.get('profile/');

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
    const response = await Api.delete(`profile`);

    if (response) {
        Storage.cookie.delete('bearer');
        window.location.href = '/';
    }
});