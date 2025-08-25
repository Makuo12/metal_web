<script lang="ts">
	import Sidebar from "$lib/sidebar.svelte";
	import { auth } from "$lib/stores/auth";
	import { onMount } from "svelte";
	import { get } from "svelte/store";
    type UserAccountResponse = {
        list: AccountResponse[];
    }
  type Account = {
    id: string;
    bank_name: string;
    account_name: string;
    account_number: string;
    created_at: string;
    updated_at: string;
  };
  type AccountResponse = {
    bank_name: string;
    account_name: string;
    account_number: string;
    bank_id: string;
    created_at: string;
    updated_at: string;
}
    let accounts: Account[] = [];
    // Fetch bank info from server
    onMount(async () => {
        try {
            const token = get(auth).user?.access_token || "";
            const response = await fetch("https://ghost.flizzup-server.com/api/auth/account", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

        const data: UserAccountResponse = await response.json();
       accounts = data.list.map(acc => ({
            id: acc.bank_id, // Assuming bank_id is unique
            bank_name: acc.bank_name,
            account_name: acc.account_name,
            account_number: acc.account_number,
            created_at: acc.created_at,
            updated_at: acc.updated_at
        }));
    } catch (err) {
        console.error(err);
    }
    });
  // Dummy data
</script>

<div class="main-account">
    <Sidebar loginType={get(auth).user?.login_type} />
    <div class="accounts-view">
    <h2>Bank Accounts</h2>

    {#if accounts.length === 0}
        <p class="empty">No accounts available.</p>
    {:else}
        <div class="accounts-list">
        {#each accounts as account (account.id)}
            <div class="account-card">
            <div class="account-row">
                <span class="label">Bank:</span>
                <span class="value">{account.bank_name}</span>
            </div>

            <div class="account-row">
                <span class="label">Account Name:</span>
                <span class="value">{account.account_name}</span>
            </div>

            <div class="account-row">
                <span class="label">Account Number:</span>
                <span class="value">{account.account_number}</span>
            </div>

            <div class="account-row">
                <span class="label">Created At:</span>
                <span class="value">{new Date(account.created_at).toLocaleDateString()}</span>
            </div>

            <div class="account-row">
                <span class="label">Updated At:</span>
                <span class="value">{new Date(account.updated_at).toLocaleDateString()}</span>
            </div>
            </div>
        {/each}
        </div>
    {/if}
    </div>
</div>

<style>
:global(body) {
    margin: 0;
    padding: 0;
}
.main-account {
  display: flex;
  min-height: 100vh;
  font-family: system-ui, sans-serif;
  background: #f8f9fb;
  margin: 0;
}

.accounts-view {
  flex: 1; /* ✅ take up all space left of Sidebar */
  padding: 1.5rem;
  overflow-y: auto; /* optional: scroll if content grows */
}

.accounts-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
  .accounts-view h2 {
    font-size: 1.4rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .empty {
    color: #777;
    font-style: italic;
  }

  .accounts-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  .account-card {
    background: #fff;
    border-radius: 12px;
    padding: 1.25rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .account-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }

  .account-row {
    display: flex;
    justify-content: space-between;
    padding: 0.6rem 0;
    border-bottom: 1px solid #eee;
  }

  .account-row:last-child {
    border-bottom: none;
  }

  .label {
    font-weight: 600;
    color: #444;
  }

  .value {
    color: #222;
    font-family: monospace;
  }
</style>
