<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
import { page } from '$app/stores';
  import type { Map } from "leaflet";
  import "leaflet/dist/leaflet.css";
import { goto } from '$app/navigation';
  
  const links = [
    { name: "Profile", href: "/profile" },
    { name: "Business", href: "/business" },
    { name: "Bank", href: "/bank" },
    { name: "Account", href: "/account" },
  ];

  function navigate(path: string) {
    goto(path);
  }
  type Device = {
    device_id: string;
    name: string;
    device_type: string;
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
        { device_id: "d1", name: "POS 1", device_type: "POS" },
        { device_id: "d2", name: "Scanner A", device_type: "Scanner" }
      ]
    },
    {
      name: "Jabi Lake Mall",
      location: "Jabi, Abuja",
      geolocation: [9.0667, 7.4833],
      devices: [{ device_id: "d3", name: "POS 2", device_type: "POS" }]
    }
  ];

  let map: Map;

  function toggleExpand(biz: Business) {
    biz.expanded = !biz.expanded;
    businesses = [...businesses]
    
  }

  function addDevice(biz: Business) {
    const id = "dev-" + Math.random().toString(36).slice(2, 7);
    biz.devices.push({ device_id: id, name: "New Device", device_type: "Unknown" });
  }

  function removeDevice(biz: Business, id: string) {
    biz.devices = biz.devices.filter(d => d.device_id !== id);
  }

  function addBusiness() {
    businesses.push({
      name: "New Business",
      location: "Somewhere in Nigeria",
      geolocation: [9.05785, 7.49508],
      devices: []
    });
  }

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
<nav class="navbar">
  {#each links as link}
    <button
      class="nav-btn { $page.url.pathname === link.href ? 'active' : '' }"
      on:click={() => navigate(link.href)}
    >
      {link.name}
    </button>
  {/each}
</nav>
<div class="page">
  <!-- Business List -->
  <div class="business-list">
    <div class="header">
      <h2>Businesses</h2>
      <button class="add-business" on:click={addBusiness}>+ Add Business</button>
    </div>
    <ul>
      {#each businesses as biz}
        <li class="business-card">
          <button class="business-header" on:click={() => toggleExpand(biz)}>
            <div>
              <strong>{biz.name}</strong>
              <div class="location">{biz.location}</div>
            </div>
            <span class="arrow">{biz.expanded ? "▲" : "▼"}</span>
          </button>

          <div class="dropdown {biz.expanded ? 'open' : ''}">
            <div class="devices">
              <h4>Devices</h4>
              <ul>
                {#each biz.devices as device}
                  <li class="device-item">
                    <span>{device.name} ({device.device_type})</span>
                    <button class="remove" on:click={() => removeDevice(biz, device.device_id)}>Remove</button>
                  </li>
                {/each}
              </ul>
              <button class="add-device" on:click={() => addDevice(biz)}>+ Add Device</button>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Map -->
  <div id="map"></div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
  .page {
    display: flex;
    height: 100vh;
  }

  .business-list {
    flex: 1;
    max-width: 420px;
    padding: 1rem;
    background: #f9fafb;
    overflow-y: auto;
    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .add-business {
    padding: 0.5rem 1rem;
    border: none;
    background: #2563eb;
    color: white;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .add-business:hover {
    background: #1e40af;
  }

  .business-card {
    background: white;
    margin-bottom: 0.75rem;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .business-header {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border: none;
    background: #f3f4f6;
    padding: 0.75rem;
    font-size: 1rem;
    text-align: left;
  }

  .business-header:hover {
    background: #e5e7eb;
  }

  .location {
    font-size: 0.85rem;
    color: #6b7280;
  }

  .arrow {
    font-size: 0.9rem;
    color: #374151;
  }

  .dropdown {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    background: #fff;
  }

  .dropdown.open {
    max-height: 500px; /* enough for devices */
    padding: 0.75rem;
  }

  .devices h4 {
    margin: 0.5rem 0;
    font-size: 0.95rem;
    color: #374151;
  }

  .device-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f1f5f9;
    padding: 0.4rem 0.6rem;
    border-radius: 5px;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .device-item .remove {
    background: #ef4444;
    border: none;
    color: white;
    padding: 0.3rem 0.6rem;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.8rem;
  }
  .device-item .remove:hover {
    background: #b91c1c;
  }

  .add-device {
    margin-top: 0.5rem;
    background: #10b981;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s;
  }
  .add-device:hover {
    background: #059669;
  }

  #map {
    flex: 2;
  }
.navbar {
    display: flex;
    justify-content: center;
    gap: 1rem;
    background: #222;
    padding: 0.5rem 1rem;
    color: white;
    flex-wrap: wrap;
  }

  .nav-btn {
    background: transparent;
    border: none;
    color: #bbb;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.2s;
  }

  .nav-btn.active {
    background: #2563eb;
    color: white;
  }

  .nav-btn:hover {
    background: #444;
    color: white;
  }

  /* Mobile: bottom navbar */
  @media (max-width: 768px) {
    .navbar {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      justify-content: space-around;
      padding: 0.5rem 0;
      z-index: 1000;
    }
  }
@media (max-width: 768px) {
    .page {
      flex-direction: column;
    }

    .business-list {
      max-width: 100%;
      height: 90vh;
      box-shadow: none;
    }

    #map {
      height: 10vh; /* your style */
      width: 100%;
    }
  }
</style>
