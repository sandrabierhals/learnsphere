(async () => {
    // Fetch the data
    const user = await Api.get('profile/');

    [...document.querySelectorAll(`input`)].forEach((element) => {
        if (element.name !== 'password') {
            element.value = user[element.name];
        }
    });
})();

document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const response = await Api.put(
        'profile/',
        Object.fromEntries([...new FormData(event.target)].filter(([k, v]) => v && [k, v]))
    );

    if (response) {
        window.location.href = '/profile.html';
    }
});