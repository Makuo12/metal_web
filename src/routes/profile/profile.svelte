<script>
    import { goto } from '$app/navigation';
	import Sidebar from '$lib/sidebar.svelte';
    // Mock user data
    let user = {
        first_name: "Christian",
        last_name: "Uwa",
        email: "uwa@example.com"
    };

</script>

<div class="main-profile">
    <!-- Sidebar -->
    <Sidebar />
    <!-- Main Content -->
    <main class="main-content">
        <div class="profile-card">
            <h2>User Profile</h2>
            <div class="profile-details">
                <p><strong>First Name:</strong> {user.first_name}</p>
                <p><strong>Last Name:</strong> {user.last_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
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


/* Main content */
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

.profile-details p {
    font-size: 1rem;
    margin: 0.5rem 0;
    color: #475569;
}
</style>
