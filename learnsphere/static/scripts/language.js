// Get query string
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

(async () => {
    const language = await Api.get(`languages/${params.lang}/`);

    // Populate DOM variables
    [...document.querySelectorAll(`[data-language]`)].forEach((element) => {
        const tag = element.tagName.toLowerCase();
        const key = element.dataset.language;
        const currentModule = language.modules.find((module) => !module.grade);

        switch (key) {
            case 'flag': {
                element.src = `/static/images/flags/${language.code}.svg`;
                element.alt = `Flag for ${language.name} language`;

                break;
            }

            case 'current': {
                if (currentModule) {
                    element.innerHTML = currentModule.name.replace(/"/g, '');
                } else {
                    element.parentNode.style.display = 'none';
                }

                break;
            }

            case 'modules': {
                language[key].forEach((module) => {
                    if (module.grade) {
                        element.innerHTML += `<tr><td>${module.name.replace(/"/g, '')}</td><td>${module.grade}</td></tr>`;
                    }
                });

                break;
            }

            case 'completion': {
                element[tag === 'span' ? 'innerHTML' : 'value'] += currentModule ? currentModule.progress || 0 : 100;

                break;
            }

            default: {
                element.innerHTML = language[key];

                break;
            }
        }
    });
})();

document.querySelector('button#cancel').addEventListener('click', async () => {
    const response = await Api.delete(`languages/${params.lang}/unenroll/`);

    if (response) {
        window.location.href = '/dashboard.html';
    }
});
