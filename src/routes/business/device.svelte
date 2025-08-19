
<script lang="ts">

  interface Device {
    device_id: string;
    name: string;
    device_type: string;
    user_id: string;
    active: boolean;
    transactions: number;
  }


  // Dummy data
  let devices: Device[] = [
    {
      device_id: "dev-101",
      name: "POS Terminal A",
      device_type: "POS",
      user_id: "user-1",
      active: true,
      transactions: 120
    },
    {
      device_id: "dev-102",
      name: "POS Terminal B",
      device_type: "POS",
      user_id: "user-1",
      active: false,
      transactions: 45
    },
    {
      device_id: "dev-103",
      name: "Kiosk Device",
      device_type: "Kiosk",
      user_id: "user-1",
      active: true,
      transactions: 310
    }
  ];

  let selectedDevice: Device | null = null;

  function toggleLock(device: Device) {
    device.active = !device.active;
    selectedDevice = { ...device };
  }

  function closePopover() {
  }
</script>
<div class="popover">
  <header class="flex justify-between items-center">
    <h2 class="text-lg font-bold">Device Details</h2>
    <button on:click={closePopover}>✖</button>
  </header>
  {#if selectedDevice}
    <div class="details">
      <h3 class="font-semibold">{selectedDevice.name}</h3>
      <p><strong>Type:</strong> {selectedDevice.device_type}</p>
      <p><strong>Status:</strong> {selectedDevice.active ? "Active" : "Locked"}</p>
      <p><strong>Transactions:</strong> {selectedDevice.transactions}</p>
      <button
        class="mt-2 px-4 py-2 rounded bg-blue-600 text-white"
      >
        {selectedDevice.active ? "Lock Device" : "Unlock Device"}
      </button>
    </div>
  {/if}
</div>

<style>
  .popover {
    position: absolute;
    top: 20%;
    right: 20%;
    width: 400px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    padding: 16px;
    z-index: 1000;
  }
  .device-list {
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 1rem;
  }
  .device-item {
    padding: 8px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
  }
  .device-item:hover {
    background: #f5f5f5;
  }
  .details {
    margin-top: 1rem;
  }
</style>