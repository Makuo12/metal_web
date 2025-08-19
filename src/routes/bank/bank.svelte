<script>
    import Sidebar from '$lib/sidebar.svelte';
import { Eye, EyeOff, Lock } from 'lucide-svelte'; // icons

    export let bank = {
        id: "28",
        user_id: "some-uuid",
        name: "TAJ BANK LIMITED",
        address: "Plot 72, Ahmadu Bello Way, Central Business District, Abuja",
        state: "ABUJA",
        private_apk_key: "sk_test_123456789abcdef",
        public_apk_key: "pk_test_987654321abcdef"
    };

    let showPrivate = false;
    let showPublic = false;
</script>

<div class="dashboard">
    <Sidebar />
    <div class="bank-card">
        <h2 class="bank-name">{bank.name}</h2>
        <p class="bank-address">{bank.address}</p>
        <p class="bank-state">{bank.state}</p>

        <div class="apk-key">
            <div class="label">
            <Lock size="16" />
            <span>Private APK Key</span>
            </div>
            <div class="key-row">
            <span>{showPrivate ? bank.private_apk_key : "••••••••••••••••••••••"}</span>
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
            <span>{showPublic ? bank.public_apk_key : "••••••••••••••••••••••"}</span>
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
