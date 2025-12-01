document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = Object.fromEntries([...new FormData(event.target)].filter(([k, v]) => v && [k, v]));
    const response = await Api.post('login/', payload);

    console.log(event, payload, response);
    debugger;

    if (response) {
        Storage.cookie.set('bearer', response.access_token);
        window.location.href = '/dashboard.html';
    }
    else {
        window.location.href = '/';
    }
});