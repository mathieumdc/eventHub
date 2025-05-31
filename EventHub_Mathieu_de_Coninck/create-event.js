const API_URL = 'http://localhost:3000/events';
const form = document.getElementById('create-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newEvent = {
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        address: document.getElementById('address').value,
        date: document.getElementById('date').value,
        description: document.getElementById('description').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEvent)
        });

        if (response.ok) {
            alert('Événement créé avec succès !');
            window.location.href = 'dashboard.html';
        } else {
            alert('Erreur lors de la création de l’événement.');
        }
    } catch (error) {
        console.error('Erreur lors de la création :', error);
        alert('Une erreur est survenue.');
    }
});
