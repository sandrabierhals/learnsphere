const CookieManager = {
    /**
    * Sets a cookie.
    * @param {string} name - The name of the cookie.
    * @param {string} value - The value of the cookie.
    * @param {number} [days=365] - The number of days until the cookie expires.
    * @param {string} [path="/"] - The path for the cookie.
    */
    set(name, value, days = 365, path = "/") {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=${path}`;
    },

    /**
    * Gets a cookie value by name.
    * @param {string} name - The name of the cookie to retrieve.
    * @returns {string|null} - The value of the cookie, or null if not found.
    */
    get(name) {
        const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
            const [key, val] = cookie.split("=");
            acc[key] = decodeURIComponent(val);
            return acc;
        }, {});
        return cookies[name] || null;
    },

    /**
    * Deletes a cookie by name.
    * @param {string} name - The name of the cookie to delete.
    * @param {string} [path="/"] - The path for the cookie.
    */
    delete(name, path = "/") {
        this.set(name, "", -1, path); // Set with a past expiration date to delete
    }
};

export default CookieManager;
