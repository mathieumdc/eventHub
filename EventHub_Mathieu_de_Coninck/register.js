document.addEventListener('DOMContentLoaded', () => {
    const registerBtn = document.getElementById('registerBtn');
    const messageDiv = document.getElementById('message');

    registerBtn.addEventListener('click', async () => {
        // 1. Récupération des données
        const user = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            birthdate: document.getElementById('birthdate').value,
            locality: document.getElementById('locality').value
        };

        // 2. Validation
        if (user.password !== user.confirmPassword) {
            showMessage("Les mots de passe ne correspondent pas", "error");
            return;
        }

        // 3. Envoi au serveur
        try {
            registerBtn.disabled = true; // Désactive le bouton pendant la requête
            registerBtn.textContent = "Registration...";

            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Error server");
            }

            // Redirection après succès
            showMessage("Account created successfully! Redirection...", "success");
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            showMessage(error.message, "error");
            console.error("Erreur:", error);
        } finally {
            registerBtn.disabled = false;
            registerBtn.textContent = "Register";
        }
    });

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
    }
});