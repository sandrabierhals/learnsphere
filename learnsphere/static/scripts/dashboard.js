import Api from '/scripts/utils/api.js';

(async () => {
    // Fetch the user data
    const user = await Api.get('/profile');

    [...document.querySelectorAll(`[data-user]`)].forEach((element) => {
        element.innerHTML = user[element.dataset.user];
    });

    // Fetch the languages data
    const languages = await Api.get('/languages');
    const userLanguages = await Api.get('/user/languages');
    const userLanguageIDs = userLanguages ? new Set(userLanguages.map((item) => item.id)) : [];
    const availableLanguages = languages.filter(item => !userLanguageIDs.has(item.id))
    const trigger = document.querySelector('a#list');

    if (!availableLanguages.length) {
        trigger.style.cursor = 'default';
        trigger.addEventListener('click', (event) => { event.preventDefault(); });
        trigger.querySelector('button').disabled = true;
    }

    const container = document.querySelector('.listing');

    container.innerHTML += `
        <p>
            You are currently enrolled in <strong>${userLanguages.length || 0}</strong> language${userLanguages.length === 1 ? '' : 's'}.
        </p>
    `;

    if (userLanguages.length) {
        userLanguages.forEach(language => {
            // Format dates
            language = Object.fromEntries(
                Object.entries(language).map(
                    ([key, value]) => key.includes('date')
                        ? [
                            key,
                            new Intl.DateTimeFormat('en-GB', {
                                hour: 'numeric',
                                minute: 'numeric'
                            }).format(new Date(value))
                        ]
                        : [key, value]
                )
            );

            // Create element
            const element = document.createElement('div');
            element.classList.add('language');

            // Add content to the element
            element.innerHTML = `
                <div class="mask">
                    <img src="/images/flags/${language.code}.svg" alt="Flag">
                </div>

                <a href="/language.html?lang=${language.id}" class="details">
                    <h2>${language.name}</h2>

                    <div class="timetable">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.5V12l3.5 2m5.5-2a9 9 0 1 1-18 0a9 9 0 0 1 18 0"/></svg>

                        ${language.schedule}, everyday
                    </div>

                    <div class="price">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"><path fill="currentColor" d="M15 18.5A6.48 6.48 0 0 1 9.24 15h5.14c.38 0 .73-.21.89-.55c.33-.66-.15-1.45-.89-1.45h-5.8c-.05-.33-.08-.66-.08-1s.03-.67.08-1h5.8c.38 0 .73-.21.89-.55A.994.994 0 0 0 14.38 9H9.24A6.49 6.49 0 0 1 15 5.5c1.25 0 2.42.36 3.42.97c.5.31 1.15.26 1.57-.16c.58-.58.45-1.53-.25-1.96A9.03 9.03 0 0 0 15 3c-3.92 0-7.24 2.51-8.48 6h-2.9c-.38 0-.73.21-.9.55c-.33.67.15 1.45.9 1.45h2.44a8.3 8.3 0 0 0 0 2H3.62c-.38 0-.73.21-.89.55c-.34.67.14 1.45.89 1.45h2.9c1.24 3.49 4.56 6 8.48 6c1.74 0 3.36-.49 4.74-1.35c.69-.43.82-1.39.24-1.97c-.42-.42-1.07-.47-1.57-.15c-.99.62-2.15.97-3.41.97"/></svg>

                        ${language.price}/mo
                    </div>
                </a>
            `;

            // Add element to the DOM
            container.appendChild(element);
        });
    } else {
        container.innerHTML += `
            <p>
                Please click the button below to see our available languages and enrol in the ones you are interested in.
            </p>
        `;
    }
})();