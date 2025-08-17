<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { writable } from 'svelte/store';

    let links = [
        { name: "Profile", href: "/profile" },
        { name: "Business", href: "/business" },
        { name: "Bank", href: "/bank" },
        { name: "Account", href: "/account" }
    ];

    /** @param {String} path */
    function goTo(path) {
        if (path === "/profile" && $page.url.pathname === path) {
            // If navigating to profile, ensure we have the latest user data
            // This could be an API call to fetch user data
            showLogoutConfirm.set(true);
        } else {
            goto(path);
        }
    }

    // Store for controlling logout popup
    const showLogoutConfirm = writable(false);

    function handleLogout() {
        // if on /profile, show confirmation
        if ($page.url.pathname === '/profile') {
            showLogoutConfirm.set(true);
        } else {
            goto('/');
        }
    }

    function confirmLogout() {
        showLogoutConfirm.set(false);
        goto('/');
    }

    function cancelLogout() {
        showLogoutConfirm.set(false);
    }
</script>

<aside class="sidebar">
    <h2 class="logo">My Dashboard</h2>
    <nav>
        {#each links as link}
            <button
                on:click={() => goTo(link.href)}
                class="nav-link { $page.url.pathname === link.href ? 'active' : '' }">
                {link.name}
            </button>
        {/each}
    </nav>

    <button class="logout-btn" on:click={handleLogout}>
        Logout
    </button>
</aside>

{#if $showLogoutConfirm}
    <div class="popup-backdrop">
        <div class="popup">
            <p>Are you sure you want to logout?</p>
            <div class="popup-buttons">
                <button class="confirm" on:click={confirmLogout}>Yes</button>
                <button class="cancel" on:click={cancelLogout}>Cancel</button>
            </div>
        </div>
    </div>
{/if}

<style>
/* Default sidebar styling */
.sidebar {
    display: flex;
    flex-direction: column;
    width: 220px;
    background: #222;
    color: #fff;
    padding: 1rem;
}

.logo {
    margin-bottom: 2rem;
    font-size: 1.2rem;
    text-align: center;
}

nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
}

.nav-link {
    background: transparent;
    border: none;
    color: #bbb;
    padding: 0.8rem 1rem;
    text-align: left;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.2s;
}

.nav-link.active {
    background: #444;
    color: #fff;
}

.logout-btn {
    background: crimson;
    border: none;
    padding: 0.8rem;
    cursor: pointer;
    color: white;
    border-radius: 6px;
    margin-top: auto;
}

/* Mobile sidebar -> bottom navbar */
@media (max-width: 768px) {
    .sidebar {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60px;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        padding: 0.5rem;
        background: #222;
        z-index: 1000;
    }

    .logo {
        display: none;
    }

    nav {
        flex-direction: row;
        flex: 1;
        justify-content: space-evenly;
        gap: 0;
    }

    .nav-link {
        flex: 1;
        text-align: center;
        padding: 0.5rem;
        font-size: 0.9rem;
    }

    .logout-btn {
        display: none;
    }
}

/* Logout popup */
.popup-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right:0;
    bottom:0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.popup {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    width: 90%;
    max-width: 320px;
    text-align: center;
}

.popup-buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 1rem;
}

.popup-buttons button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.popup-buttons .confirm {
    background: crimson;
    color: white;
}

.popup-buttons .cancel {
    background: #ccc;
}
</style>
