(async () => {
    const trigger = document.querySelector('button#book');
    const selected = [];
    const payload = {};

    // Fetch the data
    const languages = await Api.get('languages/');
    const userLanguages = await Api.get('languages/enrolled/');
    const userLanguageIDs = new Set(userLanguages.map((item) => item.id));
    const availableLanguages = languages.filter(item => !userLanguageIDs.has(item.id))

    if (!availableLanguages.length) {
        window.location.href = '/dashboard.html';
        return false;
    }

    availableLanguages.forEach(language => {
        // Create element
        const element = document.createElement('label');
        element.setAttribute('for', `lang-${language.code}`);
        element.classList.add('language');
        element.dataset.code = language.code;

        // Add content to the element
        element.innerHTML = `
            <div class="mask">
                <img src="/static/images/flags/${language.code}.svg" alt="Flag">
            </div>

            <div class="details">
                <h2>${language.name}</h2>

                <div class="timetable">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.5V12l3.5 2m5.5-2a9 9 0 1 1-18 0a9 9 0 0 1 18 0"/></svg>

                    ${language.schedule}, everyday
                </div>

                <div class="price">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"><path fill="currentColor" d="M15 18.5A6.48 6.48 0 0 1 9.24 15h5.14c.38 0 .73-.21.89-.55c.33-.66-.15-1.45-.89-1.45h-5.8c-.05-.33-.08-.66-.08-1s.03-.67.08-1h5.8c.38 0 .73-.21.89-.55A.994.994 0 0 0 14.38 9H9.24A6.49 6.49 0 0 1 15 5.5c1.25 0 2.42.36 3.42.97c.5.31 1.15.26 1.57-.16c.58-.58.45-1.53-.25-1.96A9.03 9.03 0 0 0 15 3c-3.92 0-7.24 2.51-8.48 6h-2.9c-.38 0-.73.21-.9.55c-.33.67.15 1.45.9 1.45h2.44a8.3 8.3 0 0 0 0 2H3.62c-.38 0-.73.21-.89.55c-.34.67.14 1.45.89 1.45h2.9c1.24 3.49 4.56 6 8.48 6c1.74 0 3.36-.49 4.74-1.35c.69-.43.82-1.39.24-1.97c-.42-.42-1.07-.47-1.57-.15c-.99.62-2.15.97-3.41.97"/></svg>

                    ${language.price}/mo
                </div>
            </div>

            <div class="input-box">
                <input id="lang-${language.code}" type="checkbox">
            </div>
        `;

        // Add element to the DOM
        document.querySelector('.listing').appendChild(element);

        // Attach events to checkboxes
        document.querySelector(`input#lang-${language.code}`).addEventListener('change', (event) => {
            if (event.currentTarget.checked) {
                const found = languages.find(obj => obj.code === language.code);
                selected.push(found);
            } else {
                let i = selected.findIndex(obj => obj.code === language.code);
                if (i !== -1) { selected.splice(i, 1); }
            }

            payload.languages = selected.map((obj) => obj.id);
            payload.quantity = selected.length;
            payload.total = selected.reduce((sum, obj) => sum + parseFloat(obj.price), 0).toFixed(2);

            trigger.innerHTML = selected.length ? `Enroll in ${payload.quantity} - €${payload.total}` : 'Enroll';
            trigger.disabled = !selected.length;
        });
    });

    trigger.addEventListener('click', async () => {
        const response = await Api.post('languages/enroll/', { 'language_id': payload.languages[0] });

        if (response) {
            window.location.href = '/payment.html';
        }
    });
})();