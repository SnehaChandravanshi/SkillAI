async function testLogin() {
    try {
        console.log("Testing Login endpoint...");
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: "test@example.com",
                password: "password123"
            })
        });

        console.log("Server Responded:", response.status);
        if (response.status === 400 || response.status === 401 || response.status === 404) {
            // 400/401 means auth logic ran. 404 means route not found (bad).
            if (response.status === 404) {
                console.log("FAILURE: Route not found.");
            } else {
                console.log("SUCCESS: Server is handling auth requests correctly.");
            }
        } else if (response.status === 200) {
            console.log("Login Success (unexpected for dummy user).");
        } else {
            console.log("FAILURE: Unexpected status code: " + response.status);
        }
    } catch (error) {
        console.log("FAILURE: Network Error or Server Down - " + error.message);
    }
}
testLogin();
