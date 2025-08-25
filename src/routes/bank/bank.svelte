<script lang="ts">
    import Sidebar from '$lib/sidebar.svelte';
    import { auth } from '$lib/stores/auth';
    import { Eye, EyeOff, Lock } from 'lucide-svelte';
    import { get } from 'svelte/store';
    import { onMount } from 'svelte';
    // Local state
    let bank: {
        id: string,
        user_id: string,
        bank_name: string,
        location: string,
        state: string,
        apk_key: string
    } | null = null;

    let showPrivate = false;
    let showPublic = false;

    // Fetch bank info from server
    onMount(async () => {
        try {
            const token = get(auth).user?.access_token || "";
            const response = await fetch("https://ghost.flizzup-server.com/api/auth/bank", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });


        const data: {
            id: string,
            user_id: string,
            apk_key: string,
            bank_name: string,
            location: string,
            state: string
        } = await response.json();

        // Map server response to local bank object
        bank = {
            id: data.id,
            user_id: data.user_id,
            bank_name: data.bank_name,
            location: data.location,
            state: data.state,
            apk_key: data.apk_key
        };
        } catch (err) {
        console.error(err);
        }
    });
</script>

<div class="dashboard">
  <Sidebar loginType={get(auth).user?.login_type} />

  {#if bank}
    <div class="bank-card">
      <h2 class="bank-name">{bank.bank_name}</h2>
      <p class="bank-address">{bank.location}</p>
      <p class="bank-state">{bank.state}</p>

      <div class="apk-key">
        <div class="label">
          <Lock size="16" />
          <span>Private APK Key</span>
        </div>
        <div class="key-row">
          <span>{showPrivate ? bank.apk_key : "••••••••••••••••••••••"}</span>
          <button on:click={() => (showPrivate = !showPrivate)}>
            {#if showPrivate}
              <EyeOff size="18" />
            {:else}
              <Eye size="18" />
            {/if}
          </button>
        </div>
      </div>

      <div class="apk-key">
        <div class="label">
          <Lock size="16" />
          <span>Public APK Key</span>
        </div>
        <div class="key-row">
          <span>{showPublic ? bank.apk_key : "••••••••••••••••••••••"}</span>
          <button on:click={() => (showPublic = !showPublic)}>
            {#if showPublic}
              <EyeOff size="18" />
            {:else}
              <Eye size="18" />
            {/if}
          </button>
        </div>
      </div>
    </div>
  {:else}
    <p>Loading bank info...</p>
  {/if}
</div>


<style>
    :global(body) {
    margin: 0;
    padding: 0;
    }
.dashboard {
    display: flex;
    min-height: 100vh;
    font-family: system-ui, sans-serif;
    background: #f8f9fb;
    margin: 0;
}
  .bank-card {
    max-width: 600px;
    margin: 1rem auto;
    padding: 1.5rem;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-family: system-ui, sans-serif;
  }

  .bank-name {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0;
  }

  .bank-address,
  .bank-state {
    font-size: 0.9rem;
    color: #666;
    margin: 0;
  }

  .apk-key {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.8rem;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    background: #fafafa;
  }

  .label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: #444;
  }

  .key-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: monospace;
    font-size: 0.9rem;
    background: #fff;
    padding: 0.5rem 0.8rem;
    border-radius: 6px;
    border: 1px solid #ddd;
  }

  .key-row button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.2rem;
    display: flex;
    align-items: center;
    color: #444;
  }

  .key-row button:hover {
    color: #000;
  }
</style>
