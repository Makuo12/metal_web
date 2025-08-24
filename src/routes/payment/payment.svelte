<script>
  import Sidebar from "$lib/sidebar.svelte";
	import { auth } from "$lib/stores/auth";
	import { get } from "svelte/store";
import { fly, fade, scale } from "svelte/transition";

  // Dummy payment data
  let payments = [
    {
      device_name: "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14",
      amount: 12000,
      customer_id: "c123-abc-456-def",
      user_id: "u789-xyz-1011",
      bank_name: "First National Bank",
      account_name: "John Doe",
      account_number: "1234567890",
      created_at: "2025-08-18T12:30:00Z"
    },
    {
      device_name: "b2c3d4e5-f6g7-8h9i-10j11-k12l13m14n15",
      amount: 5500,
      customer_id: "c456-def-789-ghi",
      user_id: "u123-xyz-456",
      bank_name: "Global Bank",
      account_name: "Jane Smith",
      account_number: "0987654321",
      created_at: "2025-08-17T09:15:00Z"
    },
    {
      device_name: "c3d4e5f6-g7h8-9i10-11j12-k13l14m15n16",
      amount: 7600,
      customer_id: "c789-ghi-012-jkl",
      user_id: "u456-xyz-789",
      bank_name: "Unity Bank",
      account_name: "Alice Johnson",
      account_number: "1122334455",
      created_at: "2025-08-16T14:45:00Z"
    }
  ];
    /** @param {Number} amount */
// Format amount as Nigerian Naira
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
    
    /** @param {String} date */
  // Format date using Nigerian locale
  const formatDate = (date) =>
    new Date(date).toLocaleString("en-NG", { 
      dateStyle: "medium", 
      timeStyle: "short" 
    });
</script>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
  .main-payment {
    display: flex;
    font-family: system-ui, sans-serif;
    min-height: 100vh;
    background: #f8f9fb;
  }

  /* Sidebar stays fixed on the left */

  /* Content area */
  .container {
    flex: 1;
    padding: 1rem;
    background: #f0f4f8;
    border-radius: 1rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
  }

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }

  .payment-card {
    background: white;
    border-radius: 1rem;
    margin-bottom: 1rem;
    padding: 1rem 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    align-items: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }

  .payment-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .label {
    font-weight: bold;
    color: #555;
    font-size: 0.85rem;
  }

  .value {
    color: #111;
    font-size: 1rem;
    word-break: break-word;
  }

  /* Make payment list scrollable if long */
  .container {
    max-height: calc(100vh - 4rem);
  }
</style>

<div class="main-payment">
    <Sidebar loginType={get(auth).user?.login_type} />
  <div class="container">
    <h2>Payment List</h2>

    {#each payments as payment (payment.device_name)}
      <div
        class="payment-card"
        in:fly={{ y: 20, duration: 400 }}
        out:scale={{ duration: 300 }}
      >
        <div>
          <div class="label">Device</div>
          <div class="value">{payment.device_name}</div>
        </div>

        <div>
          <div class="label">Amount</div>
          <div class="value">{formatCurrency(payment.amount)}</div>
        </div>

        <div>
          <div class="label">Customer ID</div>
          <div class="value">{payment.customer_id}</div>
        </div>

        <div>
          <div class="label">Bank</div>
          <div class="value">{payment.bank_name}</div>
        </div>

        <div>
          <div class="label">Account Name</div>
          <div class="value">{payment.account_name}</div>
        </div>

        <div>
          <div class="label">Account Number</div>
          <div class="value">{payment.account_number}</div>
        </div>

        <div>
          <div class="label">Date</div>
          <div class="value">{formatDate(payment.created_at)}</div>
        </div>
      </div>
    {/each}
  </div>
</div>
