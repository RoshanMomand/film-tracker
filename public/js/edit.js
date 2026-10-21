const form = document.getElementById('edit-form');
const error = document.getElementById('error');
const method = form.dataset.method;
const apiUrl = form.dataset.apiUrl;


form.addEventListener('submit', async event => {
    event.preventDefault();
    const response = await fetch(apiUrl, {
        method: method || 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: form.name.value,
            type: form.type.value,
            year: Number(form.year.value),
            watched: form.watched.checked,
        }),
    });
    if (!response.ok) {
        const data = await response.json();
        error.textContent = data.detail;
        return;
    }


    window.location.href = form.dataset.homeUrl;
});
