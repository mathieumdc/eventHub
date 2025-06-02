const API_URL = 'http://localhost:3000/events';
const form = document.getElementById('edit-form');

const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

if (!eventId) {
    alert('Aucun identifiant d’événement fourni dans l’URL.');
    throw new Error('Missing event ID');
}

if (isNaN(eventId)) {
    alert('Identifiant invalide.');
    throw new Error('Event ID must be a number');
}

const numericEventId = Number(eventId);

async function loadEventData() {
    try {
        const response = await fetch(`${API_URL}/${numericEventId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const event = await response.json();
        console.log("📦 Event fetched from backend:", event);
        console.log("📝 Description value:", event.description);

        // Remplissage des champs
        document.getElementById('title').value = event.title || '';
        document.getElementById('category').value = event.category || '';
        document.getElementById('address').value = event.address || '';
        document.getElementById('date').value = event.date || '';

        // Vérification supplémentaire : description
        const descField = document.getElementById('description');

        if (event.description !== undefined && event.description !== null) {
            descField.value = event.description;
        } else {
            descField.value = '';
            console.warn("⚠️ Description is undefined or null");
        }

    } catch (error) {
        console.error('Error loading event:', error);
        alert('Unable to load event data.');
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedEvent = {
        title: document.getElementById('title').value.trim(),
        category: document.getElementById('category').value.trim(),
        address: document.getElementById('address').value.trim(),
        date: document.getElementById('date').value,
        description: document.getElementById('description').value.trim()
    };

    console.log("📤 Updating event with data:", updatedEvent);

    try {
        const response = await fetch(`${API_URL}/${numericEventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedEvent)
        });

        if (response.ok) {
            alert('Event successfully updated!');
            window.location.href = 'dashboard.html';
        } else {
            const errText = await response.text();
            console.error('Erreur serveur:', errText);
            alert('Error updating event.');
        }
    } catch (error) {
        console.error('Update error:', error);
        alert('An error has occurred.');
    }
});

loadEventData();
