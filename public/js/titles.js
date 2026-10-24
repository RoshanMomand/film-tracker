const form = document.getElementById('title-form');
const list = document.getElementById('title-list');
const error = document.getElementById('error');
const apiUrl = form.dataset.apiUrl;
const method = form.dataset.method;
const searchInput = document.getElementById('search-title');
const filterButton = document.getElementById('filter-type');
let allTitles = [];


async function fetchTitles() {
    const response = await fetch(form.dataset.apiUrl);

    if (!response.ok) {
        const data = await response.json();
        error.textContent = data.detail;
        return;
    }

    const titles = await response.json();
    allTitles = titles;

    renderTitles(titles);
}

function renderTitles(titles) {
    list.innerHTML = '';

    for (const title of titles) {
        const row = list.insertRow();
        row.insertCell().textContent = title.name;
        row.insertCell().textContent = title.type;
        row.insertCell().textContent = title.year;
        row.insertCell().textContent = title.watched ? 'Gezien' : 'Niet gezien';

        const editLink = document.createElement('a');
        editLink.textContent = 'Bewerken';
        editLink.href = form.dataset.editUrl.replace('ID', title.id);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Verwijderen';
        deleteButton.addEventListener('click', () => deleteTitle(title.id));

        row.insertCell().append(editLink, ' ', deleteButton);
    }
}

function searchTitles(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    const filteredTitles = allTitles.filter(title => title.name.toLowerCase().includes(searchTerm));

    if (filteredTitles.length === 0) {
        renderTitles(allTitles);
        return;
    }

    renderTitles(filteredTitles);
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

if (searchInput) {
    searchInput.addEventListener('input', searchTitles);
}
if (filterButton) {
    filterButton.addEventListener('change', async event => {
        const selectedType = event.target.value;

        switch (selectedType) {
            case 'film':
            case 'serie':
                const filteredTitles = allTitles.filter(title => title.type === selectedType);
                renderTitles(filteredTitles);
                break;
            case 'watched':
                const watchedTitles = allTitles.filter(title => title.watched === true);
                renderTitles(watchedTitles);
                break;
            default:
                renderTitles(allTitles);
                break;
        }

    });
}

fetchTitles();
