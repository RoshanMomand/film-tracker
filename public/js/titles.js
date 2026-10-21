const form = document.getElementById('title-form');
const list = document.getElementById('title-list');
const error = document.getElementById('error');
const apiUrl = form.dataset.apiUrl;
async function fetchTitles() {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const titles = await response.json();

        list.innerHTML = '';
        for (const title of titles) {
            const item = document.createElement('li');
            item.textContent = `${title.name} (${title.year}) - ${title.type} - ${title.watched ? 'Gezien' : 'Niet gezien'}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Verwijderen';
            deleteButton.addEventListener('click', () => deleteTitles(title.id));

            item.appendChild(deleteButton);
            list.append(item);
        }

    } catch (err) {
        error.textContent = `Error fetching titles: ${err.message}`;
    }
}

async function deleteTitles(id) {
    await fetch(`${apiUrl}/${id}`, {method: 'DELETE'});
    fetchTitles();
}

form.addEventListener('submit', async event => {
    event.preventDefault();
    error.textContent = '';

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({
            name: form.name.value,
            type: form.type.value,
            year: Number(form.year.value),
            watched: Boolean(form.watched.checked),
        }),
    });
    if (!response.ok) {
        const data = await response.json();
        error.textContent = data.detail || 'Er is een fout opgetreden';
        return;
    }

    form.reset();
    fetchTitles();
});

fetchTitles();
