document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        console.log("Tentative de login avec:", { email, password });

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            console.log("Réponse du serveur:", response);

            const data = await response.json();
            console.log("Données reçues:", data);

            if (response.ok) {
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                window.location.href = 'dashboard.html';
            } else {
                throw new Error(data.error || 'Login failed');
            }
        } catch (err) {
            console.error('Complete error:', err);
            errorMessage.textContent = err.message;
            errorMessage.style.display = 'block';
        }
    });
});