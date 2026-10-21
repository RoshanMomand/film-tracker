const form = document.getElementById('title-form');
const list = document.getElementById('title-list');
const error = document.getElementById('error');
const apiUrl = form.dataset.apiUrl;
const method = form.dataset.method;

async function fetchTitles() {
    const response = await fetch(form.dataset.apiUrl);

    if (!response.ok) {
        const data = await response.json();
        error.textContent = data.detail;
        return;
    }

    const titles = await response.json();
    console.log(titles);

    list.innerHTML = '';
    for (const title of titles) {
        const item = document.createElement('li');
        item.textContent = `${title.name} (${title.year}) - ${title.type} - ${title.watched ? 'Gezien' : 'Niet gezien'} `;

        const editLink = document.createElement('a');
        editLink.textContent = 'Bewerken';
        editLink.href = form.dataset.editUrl.replace('ID', title.id);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Verwijderen';
        deleteButton.addEventListener('click', () => deleteTitle(title.id));

        item.append(editLink, ' ', deleteButton);
        list.append(item);
    }
}

async function deleteTitle(id) {
    await fetch(`${apiUrl}/${id}`, {method: 'DELETE'});
    fetchTitles();
}

form.addEventListener('submit', async event => {
    event.preventDefault();

    const response = await fetch(form.dataset.apiUrl, {
        method: method || 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
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

    form.reset();
    error.textContent = '';
    fetchTitles();
});

fetchTitles();
