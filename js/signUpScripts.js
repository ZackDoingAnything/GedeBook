window.handleSignup = async () => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!username || !email || !password) {
        alert("Please fill out all fields.");
        return;
    }

    try {
        const response = await fetch('api.php?action=signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: username, 
                email: email, 
                password: password,
                fullname: username
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert(result.message);
            window.location.href = 'login.html';
        } else {
            alert(result.message || "Sign up failed. Check server status.");
        }

    } catch (error) {
        console.error("Signup API error:", error);
        alert("Could not connect to the server. Check XAMPP and api.php.");
    }
};