document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const response = await Api.post(
        '/register',
        Object.fromEntries([...new FormData(event.target)].filter(([k, v]) => v && [k, v]))
    );

    if (response) {
        window.location.href = '/';
    }
});