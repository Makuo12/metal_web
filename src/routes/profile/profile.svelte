<script lang="ts">
    import { goto } from '$app/navigation';
    import Sidebar from '$lib/sidebar.svelte';
    import { auth, type User } from '$lib/stores/auth';
    import { get } from 'svelte/store';

    let editing = false;
    let updatedUser: User | null = null;
    let error: string = "";

    // reactively mirror the auth.user into editable state
    $: updatedUser = $auth.user ? { ...$auth.user } : null;

    async function saveChanges() {
        if (!updatedUser) return;
        error = "";

        try {
            const token = get(auth).user?.access_token || "";
            const response = await fetch("http://localhost:8081/api/auth/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    first_name: updatedUser.first_name,
                    last_name: updatedUser.last_name,
                    email: updatedUser.email,
                    hashed_password: ""
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to update profile");
            } else {
                // Sync store with new values
                console.log("Profile updated successfully", data);
                auth.update((state) => ({
                    user: { first_name: data.first_name, last_name: data.last_name, email: data.email, access_token: data.session.access_token, refresh_token: data.session.refresh_token }
                }));
            }


            editing = false;
        } catch (err: any) {
            console.error(err);
            error = err.message;
        }
    }
</script>

<div class="main-profile">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="main-content">
        <div class="profile-card">
            <h2>User Profile</h2>

            {#if $auth.user}
                <div class="profile-details">
                {#if editing && updatedUser}
                    <div class="form-group">
                        <label>First Name</label>
                        <input bind:value={updatedUser.first_name} />
                    </div>
                    <div class="form-group">
                        <label>Last Name</label>
                        <input bind:value={updatedUser.last_name} />
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" bind:value={updatedUser.email} />
                    </div>

                    {#if error}
                        <p style="color:red;">{error}</p>
                    {/if}

                    <button on:click={saveChanges}>Save</button>
                    <button on:click={() => (editing = false)}>Cancel</button>
                {:else if !editing && $auth.user}
                    <p><strong>First Name:</strong> {$auth.user.first_name}</p>
                    <p><strong>Last Name:</strong> {$auth.user.last_name}</p>
                    <p><strong>Email:</strong> {$auth.user.email}</p>
                    <button on:click={() => (editing = true)}>Edit Profile</button>
                {/if}
                    </div>
                {:else}
                <p>No user data available. Please log in.</p>
            {/if}
        </div>
    </main>
</div>

<style>
:global(body) {
    margin: 0;
    padding: 0;
}
.main-profile {
    display: flex;
    min-height: 100vh;
    font-family: system-ui, sans-serif;
    background: #f8f9fb;
    margin: 0;
}
.main-content {
    flex: 1;
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}
.profile-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    width: 100%;
    max-width: 600px;
}
.profile-card h2 {
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
    color: #1e293b;
}
.profile-details p, .form-group {
    font-size: 1rem;
    margin: 0.5rem 0;
    color: #475569;
}
.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
}
input {
    padding: 0.6rem;
    border: 1px solid #ddd;
    border-radius: 6px;
}
button {
    margin-right: 0.5rem;
    margin-top: 1rem;
    padding: 0.7rem 1.2rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    background: #0077ff;
    color: white;
    transition: background 0.2s;
}
button:hover {
    background: #005fcc;
}
</style>
