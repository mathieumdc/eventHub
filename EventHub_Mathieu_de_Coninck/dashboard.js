const API_URL = 'http://localhost:3000/events';
let events = [];

function updateTable(events) {
    const tableBody = document.getElementById('event-table');
    tableBody.innerHTML = '';
    events.forEach((event, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${event.title}</td>
            <td>${event.address}</td>
            <td>${event.date}</td>
            <td>${event.category}</td>
            <td>
                <button onclick="editEvent('${event.id}')">✏️ edit</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editEvent(id) {
    window.location.href = `edit-event.html?id=${id}`;
}

async function loadEvents() {
    try {
        const response = await fetch(API_URL);
        events = await response.json();
        updateTable(events);
    } catch (error) {
        console.error('Error loading events :', error);
    }
}


window.addEventListener('DOMContentLoaded', loadEvents);
