<script lang="ts">
  import Sidebar from "$lib/sidebar.svelte";
  import { auth } from "$lib/stores/auth";
  import { get } from "svelte/store";
  import { fly, scale } from "svelte/transition";
  import { onMount } from "svelte";

  // Match Rust structs in TypeScript
  type PaymentResponse = {
    device_id: string;
    amount: number;
    bank_id: string;
    account_name: string;
    account_number: string;
    device_name: string;
    device_type: string;
    customer_first_name: string;
    customer_last_name: string;
  };

  type UserPaymentResponse = {
    list: PaymentResponse[];
  };

  let payments: PaymentResponse[] = [];

  // Format amount as Nigerian Naira
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);

  // Deep compare helper
  function isEqual(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  // Fetch payments from backend
  async function fetchPayments() {
    try {
      const token = get(auth).user?.access_token || "";
      const response = await fetch("https://ghost.flizzup-server.com/api/auth/payments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch payments");

      const data: UserPaymentResponse = await response.json();

      // Only update payments if data changed
      if (payments.length < data.list.length) {
        payments = data.list;
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  }

  onMount(() => {
    fetchPayments(); // initial load
    const interval = setInterval(fetchPayments, 2000); // every 2s
    return () => clearInterval(interval); // cleanup when component unmounts
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
  .container {
    flex: 1;
    padding: 1rem;
    background: #f0f4f8;
    border-radius: 1rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    max-height: calc(100vh - 4rem);
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
</style>

<div class="main-payment">
  <Sidebar loginType={get(auth).user?.login_type} />
  <div class="container">
    <h2>Payment List</h2>

    {#if payments.length === 0}
      <p style="text-align:center;color:#666;">No payments found</p>
    {/if}

    {#each payments as payment (payment.device_id)}
      <div
        class="payment-card"
        in:fly={{ y: 20, duration: 400 }}
        out:scale={{ duration: 300 }}
      >
        <div>
          <div class="label">Device Name</div>
          <div class="value">{payment.device_name}</div>
        </div>

        <div>
          <div class="label">Device Type</div>
          <div class="value">{payment.device_type}</div>
        </div>

        <div>
          <div class="label">Amount</div>
          <div class="value">{formatCurrency(payment.amount)}</div>
        </div>

        <div>
          <div class="label">Bank ID</div>
          <div class="value">{payment.bank_id}</div>
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
          <div class="label">Customer</div>
          <div class="value">{payment.customer_first_name} {payment.customer_last_name}</div>
        </div>
      </div>
    {/each}
  </div>
</div>
