const API_URL = 'http://localhost:3000/events';
const form = document.getElementById('edit-form');

// 🔎 Récupérer l'ID depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

// Vérification de l'ID
if (!eventId) {
    alert('Aucun identifiant d’événement fourni dans l’URL.');
    throw new Error('Missing event ID');
}

if (isNaN(eventId)) {
    alert('Identifiant invalide.');
    throw new Error('Event ID must be a number');
}

const numericEventId = Number(eventId);

// 📥 Charger les données de l'événement
async function loadEventData() {
    try {
        const response = await fetch(`${API_URL}/${numericEventId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const event = await response.json();

        // Remplir le formulaire avec les données existantes
        document.getElementById('title').value = event.title || '';
        document.getElementById('category').value = event.category || '';
        document.getElementById('address').value = event.address || '';
        document.getElementById('date').value = event.date || '';
        document.getElementById('description').value = event.description || '';
    } catch (error) {
        console.error('Erreur lors du chargement de l’événement :', error);
        alert('Impossible de charger les données de l’événement.');
    }
}

// 💾 Sauvegarder les modifications
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedEvent = {
        title: document.getElementById('title').value.trim(),
        category: document.getElementById('category').value.trim(),
        address: document.getElementById('address').value.trim(),
        date: document.getElementById('date').value,
        description: document.getElementById('description').value.trim()
    };

    try {
        const response = await fetch(`${API_URL}/${numericEventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedEvent)
        });

        if (response.ok) {
            alert('Événement mis à jour avec succès !');
            window.location.href = 'dashboard.html';
        } else {
            const errText = await response.text();
            console.error('Erreur serveur:', errText);
            alert('Erreur lors de la mise à jour de l’événement.');
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour :', error);
        alert('Une erreur est survenue.');
    }
});

// 🚀 Lancement
loadEventData();
