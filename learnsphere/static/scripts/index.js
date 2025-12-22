document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const response = await Api.post(
        'login/',
        Object.fromEntries([...new FormData(event.target)].filter(([k, v]) => v && [k, v]))
    );

    if (response) {
        Storage.cookie.set('bearer', response.access);
        Storage.cookie.set('refresh', response.refresh);
        window.location.href = '/dashboard.html';
    }
    else {
        window.location.href = '/index.html';
    }
});