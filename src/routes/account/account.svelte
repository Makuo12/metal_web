<script lang="ts">
	import Sidebar from "$lib/sidebar.svelte";

  type Account = {
    id: string;
    bank_name: string;
    account_name: string;
    account_number: string;
    created_at: string;
    updated_at: string;
  };

  // Dummy data
  let accounts: Account[] = [
    {
      id: "1",
      bank_name: "First Bank",
      account_name: "Uwa Christian",
      account_number: "1234567890",
      created_at: "2024-12-10T09:00:00Z",
      updated_at: "2025-02-01T10:30:00Z"
    },
    {
      id: "2",
      bank_name: "GT Bank",
      account_name: "Flizzup Tech",
      account_number: "9876543210",
      created_at: "2025-01-15T15:45:00Z",
      updated_at: "2025-02-05T12:20:00Z"
    },
    {
      id: "3",
      bank_name: "Zenith Bank",
      account_name: "Metal Pay",
      account_number: "1122334455",
      created_at: "2025-01-28T08:00:00Z",
      updated_at: "2025-02-10T14:00:00Z"
    }
  ];
</script>

<div class="main-account">
    <Sidebar />
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
