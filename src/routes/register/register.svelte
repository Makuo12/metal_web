<script>
    import { goto } from '$app/navigation';
    import { auth } from '$lib/stores/auth';
    let isLogin = true;
    let firstName = "";
    let lastName = "";
    let email = "";
    let password = "";
    let error = "";

    function goToSettings() {
        goto('/profile');
    }

        /** @param {Event} event */
    async function handleSubmit(event) {
            event.preventDefault();
            error = "";

            if (isLogin) {
                // 👇 LOGIN flow
                try {
                    const response = await fetch('http://localhost:8081/api/user/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            first_name: firstName,
                            last_name: lastName,
                            email,
                            hashed_password: password
                        })
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        throw new Error(data.message || 'Failed to login');
                    }

                    const data = await response.json();
                    
                    localStorage.setItem('auth', JSON.stringify(data));
                    // 👇 Save user + tokens to store (and localStorage via subscription)
                    auth.set({
                        user: { first_name: data.first_name, last_name: data.last_name, email: data.email, access_token: data.session.access_token, refresh_token: data.session.refresh_token }
                    });

                    goToSettings();
                } catch (err) {
                    console.error(err);
                    error = "Login failed";
                }
            } else {
                // 👇 REGISTER flow
                try {
                    const response = await fetch('http://localhost:8081/api/user/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            first_name: firstName,
                            last_name: lastName,
                            email,
                            hashed_password: password
                        })
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        throw new Error(data.message || 'Failed to register');
                    }

                    const data = await response.json();

                    // 👇 Store the user and access token in memory
                    auth.set({
                        user: { first_name: data.first_name, last_name: data.last_name, email: data.email, access_token: data.session.access_token, refresh_token: data.session.refresh_token }
                    });

                    goToSettings();
                } catch (err) {
                    console.error(err);
                    error = "Registration failed";
                }
            }
        }
</script>

<div class="auth-container">
    <div class="form-card">
        <h2>{isLogin ? "Welcome back" : "Join Metal Bare"}</h2>

        <form on:submit|preventDefault={handleSubmit}>
            {#if !isLogin}
                <div class="name-fields">
                    <div class="form-group">
                        <label for="firstName">First Name</label>
                        <input id="firstName" bind:value={firstName} placeholder="Enter first name" />
                    </div>
                    <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input id="lastName" bind:value={lastName} placeholder="Enter last name" />
                    </div>
                </div>
            {/if}

            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" type="email" bind:value={email} placeholder="Enter email" />
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input id="password" type="password" bind:value={password} placeholder="Enter password" />
            </div>

            {#if error}
                <p style="color: red; text-align:center">{error}</p>
            {/if}

            <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>

        <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <a href="#" on:click={() => (isLogin = !isLogin)}>
                {isLogin ? "Sign Up" : "Login"}
            </a>
        </p>
    </div>
</div>


<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
        font-family: 'Arial', sans-serif;
        height: 300vh; /* Make page scrollable */
    }
	.auth-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 1rem;
	}

	.form-card {
		width: 100%;
		max-width: 500px;
		background: white;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
	}

	h2 {
		text-align: center;
		margin-bottom: 1.5rem;
		font-size: 1.8rem;
		color: #333;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		margin-bottom: 1.2rem;
	}

	label {
		font-size: 0.9rem;
		margin-bottom: 0.4rem;
		color: #555;
	}

	input {
		padding: 0.8rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		font-size: 1rem;
	}

	.name-fields {
		display: flex;
		gap: 1.5rem; /* more spacing */
		margin-bottom: 1.2rem;
	}

	button {
		width: 100%;
		padding: 0.9rem;
		background: #0077ff;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	button:hover {
		background: #005fcc;
	}

	p {
		text-align: center;
		margin-top: 1rem;
		color: #555;
	}

	a {
		color: #0077ff;
		cursor: pointer;
		text-decoration: none;
		font-weight: 500;
	}

	/* On smaller screens stack first/last name */
	@media (max-width: 600px) {
		.name-fields {
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>
