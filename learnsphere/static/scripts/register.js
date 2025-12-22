document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const response = await Api.post(
        '/register',
        Object.fromEntries([...new FormData(event.target)].filter(([k, v]) => v && [k, v]))
    );

    console.log(event, payload, response);
    debugger;

    if (response) {
        window.location.href = '/index.html';
    }
});