const ADMIN_EMAIL = 'admin@gede.book';
const ADMIN_PASSWORD = 'gebukinadmin';

const saveUserSession = (user) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userName', user.username);
    
    if (user.role === 'admin') {
        localStorage.setItem('isAdmin', 'true');
    } else {
        localStorage.removeItem('isAdmin');
    }
    window.location.href = 'index.html';
};

window.handleLogin = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }
    
    try {
        const response = await fetch('api.php?action=login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            saveUserSession(result.user);
        } else {
            alert(result.message || "Login failed. Check server status.");
        }

    } catch (error) {
        console.error("Login API error:", error);
        alert("Could not connect to the server. Check XAMPP and api.php.");
    }
};

window.handleAdminPromptLogin = async () => {
    const passwordAttempt = prompt("Enter Admin Password:");
    
    if (passwordAttempt === null || passwordAttempt === "") return;
    
    try {
        const response = await fetch('api.php?action=login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: ADMIN_EMAIL, 
                password: passwordAttempt 
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            saveUserSession(result.user);
        } else {
            alert(result.message || "Incorrect password.");
        }

    } catch (error) {
        console.error("Admin Login API error:", error);
        alert("Could not connect to the server.");
    }
};