const BASE_URL = 'http://localhost:8000/api/';

const call = async (url, payload = null, method = 'GET') => {
    const config = {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: payload ? JSON.stringify(payload) : null,
    };

    try {
        const bearer = await Storage.cookie.get('bearer');

        // Kick back to login if bearer cookie doesn't exist
        const ignoredRoutes = ['login', 'register'];

        if (!ignoredRoutes.some((item) => url.includes(item)) && !bearer) {
            window.location.href = '/';
            return false;
        }

        // Attach bearer token to request only if it's a remote url
        if (!url.includes('data')) {
            config.headers.Authorization = `Bearer ${bearer}`;
        }

        let response = await fetch(`${BASE_URL}${url}`, config);

        // Kick back to login if expired token
        if (response.status === 401) {
            window.location.href = '/';
            return false;
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        return data;
    } catch (error) {
        const message = `API Error: ${error.message}`;

        console.error(message);
        alert(message);

        return null;
    }
};

const Api = {
    get: (url) => call(url),
    post: (url, payload) => call(url, payload, 'POST'),
    put: (url, payload) => call(url, payload, 'PUT'),
    delete: (url, payload) => call(url, payload, 'DELETE'),
};
