<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
import { page } from '$app/stores';
  import type { Map } from "leaflet";
  import "leaflet/dist/leaflet.css";
import { goto } from '$app/navigation';
	import Sidebar from "$lib/sidebar.svelte";
 let showMap = false; // state 
  const links = [
    { name: "Profile", href: "/profile" },
    { name: "Business", href: "/business" },
    { name: "Bank", href: "/bank" },
    { name: "Account", href: "/account" },
  ];
  function navigate(path: string) {
    goto(path);
  }
  // Popover state
  let showDevicePopover = false;
  let selectedDevice: Device | null = null;
  function viewDevice(device: Device) {
    selectedDevice = device;
    showDevicePopover = true;
  }

  function closeDevicePopover() {
    showDevicePopover = false;
    selectedDevice = null;
  }
  type Device = {
    device_id: string;
    name: string;
    device_type: string;
    active: boolean;
  };

  type Business = {
    name: string;
    location: string;
    geolocation: [number, number];
    devices: Device[];
    expanded?: boolean;
  };

  let businesses: Business[] = [
    {
      name: "Eko Hotel",
      location: "Victoria Island, Lagos",
      geolocation: [6.4281, 3.4216],
      devices: [
        { device_id: "d1", name: "POS 1", device_type: "POS", active: true },
        { device_id: "d2", name: "Scanner A", device_type: "Scanner", active: false }
      ]
    },
    {
      name: "Jabi Lake Mall5",
      location: "Jabi, Abuja",
      geolocation: [9.0667, 7.4833],
      devices: [{ device_id: "d3", name: "POS 2", device_type: "POS" , active: false}]
    },
    {
      name: "Jabi Lake Mall4",
      location: "Jabi, Abuja",
      geolocation: [9.0667, 7.4833],
      devices: [{ device_id: "d3", name: "POS 2", device_type: "POS", active: true}]
    }
  ];

  let map: Map;



  onMount(async () => {
    if (!browser) return;
    const L = await import("leaflet");

    map = L.map("map").setView([9.0667, 7.4833], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    businesses.forEach(biz => {
      L.marker(biz.geolocation)
        .addTo(map)
        .bindPopup(`<b>${biz.name}</b><br>${biz.location}`);
    });
    // ✅ Handle resize so map adjusts when CSS changes
    window.addEventListener("resize", () => {
      map.invalidateSize();
    });
  });
</script>
<!-- Navbar -->
<div class="page">
  <!-- Map (background layer) -->
  <div
    id="map"
    class="map-layer"
    style="opacity: {showMap ? 1 : 0}; pointer-events: {showMap ? 'auto' : 'none'}; transition: opacity 0.3s ease;">
  </div>

  <!-- Business List (overlay layer) -->
  <div
    class="business-list"
    style="opacity: {showMap ? 0 : 1}; pointer-events: {showMap ? 'none' : 'auto'}; transition: opacity 0.3s ease;">
    <div class="business-detail">
    <Sidebar />
<div class="business-view">
  <h2>Businesses</h2>

  <ul>
    {#each businesses as biz}
      <li class="business-card">
        <div class="business-header">
          <div>
            <strong>{biz.name}</strong>
            <div class="location">{biz.location}</div>
          </div>
        </div>

        <div class="devices">
          <h4>Devices</h4>
          <ul>
            {#each biz.devices as device}
              <li class="device-item">
                <span>{device.name}</span>
                <small>({device.device_type})</small>
                <button on:click={() => viewDevice(device)}>View</button>
              </li>
            {/each}
          </ul>
        </div>
      </li>
    {/each}
  </ul>

</div>
    </div>
  </div>
</div>
<!-- Toggle Floating Action Button -->
<button 
  class="fab" 
  on:click={() => showMap = !showMap}>
  {showMap ? "🏢" : "🗺️"}
</button>

<!-- Device Popover Overlay -->
{#if showDevicePopover && selectedDevice}
<!-- Overlay as a button (covers screen, closes popover) -->
<button 
  type="button"
  class="overlay"
  on:click={closeDevicePopover}
  aria-label="Close device details"
></button>

<div class="popover" role="dialog" aria-modal="true">
  <header class="popover-header">
    <h2>{selectedDevice.name}</h2>
    <button 
      type="button" 
      class="close-btn" 
      on:click={closeDevicePopover}
      aria-label="Close popover"
    >
      ✖
    </button>
  </header>

  <div class="popover-body">
    <p><strong>Type:</strong> {selectedDevice.device_type}</p>
    <p><strong>ID:</strong> {selectedDevice.device_id}</p>

    <div class="switch-row">
      <label class="switch">
        <input
          type="checkbox"
          bind:checked={selectedDevice.active}
        />
        <span class="slider"></span>
      </label>
      <span class="status-text">{selectedDevice.active ? "Active" : "Locked"}</span>
    </div>
  </div>
</div>

{/if}

<style>
.page {
  position: relative;
  width: 100%;
  height: 100vh; /* full viewport */
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Map sits in background */
.map-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* Business list overlays */
.business-detail {
  display: flex;
  flex: 1;              /* fill available height */
  overflow: hidden;      /* prevents extra scrollbars */
  font-family: system-ui, sans-serif;
}

.business-view {
  flex: 1;
  max-width: 800px;
  margin: 2rem auto;
  padding-right: 0.5rem;
  overflow-y: auto;      /* main scroll area */
}

/* Floating Add Business button */
/* Toggle FAB for switching map/list */
.fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  z-index: 20; /* stays above */
}

.fab:hover {
  background: #0056b3;
  transform: scale(1.05);
}

.fab:active {
  transform: scale(0.95);
}

/* Reset body */
:global(body) {
  margin: 0;
  padding: 0;
}

#map {
  height: 100%;
  width: 100%;
  opacity: 0;
}

/* Business Cards */
h2 {
  font-size: 1.8rem;
  margin: 1rem;
}

.business-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

.business-header strong {
  font-size: 1.2rem;
}

.location {
  font-size: 0.9rem;
  color: #666;
}

.devices h4 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.device-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
}
.business-view {
  height: 90vh;       /* full screen height */
  overflow-y: auto;    /* enable scrolling */
  
}
.device-item button {
  margin-left: auto;
  background: #0056b3;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
}

.device-item button:hover {
  background: #0056b3;
}
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  border: none;
  cursor: pointer;
  z-index: 90;
}

/* Popover container */
.popover {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 1rem;
  width: 360px;
  max-width: 90%;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  z-index: 100;
  font-family: system-ui, sans-serif;
  animation: fadeIn 0.25s ease-out;
}

/* Header */
.popover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.popover-header h2 {
  font-size: 1.25rem;
  margin: 0;
  font-weight: 600;
  color: #222;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #111;
}

/* Body */
.popover-body p {
  margin: 0.5rem 0;
  color: #444;
  font-size: 0.95rem;
}

/* Switch row */
.switch-row {
  display: flex;
  align-items: center;
  margin-top: 1.25rem;
  gap: 0.75rem;
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #ccc;
  border-radius: 24px;
  transition: 0.3s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

/* Checked state */
.switch input:checked + .slider {
  background-color: #4caf50;
}
.switch input:checked + .slider:before {
  transform: translateX(20px);
}

.status-text {
  font-size: 0.95rem;
  font-weight: 500;
  color: #222;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -48%); }
  to   { opacity: 1; transform: translate(-50%, -50%); }
}
</style>
