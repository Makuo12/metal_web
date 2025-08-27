<script lang="ts">
  // METAL research Svelte component
  // This file is a standalone Svelte single-file component designed to present
  // the METAL project as a research-style document with polished styling.

  import { onMount } from 'svelte';
  let menuOpen = false;
let code = `
// simplified Rust: conditional wait
let mut can_type = state.can_type.lock().unwrap();
loop {
  if !*can_type {
    can_type = state.cond_var.wait(can_type).unwrap();
  } else {
    // perform work
  }
  FreeRtos::delay_ms(2);
}
`;
  let toc = [
    'Executive Summary',
    'Motivation & Context',
    'Design Goals',
    'System Architecture',
    'Core Components',
    'Transmission Protocol',
    'Security Model',
    'Implementation Details',
    'Challenges & Trade-offs',
    'Evaluation & Results',
    'Roadmap & Next Steps',
    'References'
  ];

  let activeSection = 0;
  function goto(i: number) {
    activeSection = i;
    const el = document.getElementById('sec-' + i);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  onMount(() => {
    // light visual effect on mount
    document.documentElement.style.setProperty('--accent', '#6C5CE7');
  });
</script>

<style>
:global(body) {
    margin: 0;
    padding: 0;
}
  :root{
    --bg: #0f1724;
    --card: #0b1220;
    --muted: #9aa4b2;
    --text: #000;
    --glass: rgba(255,255,255,0.03);
    --accent: #6C5CE7;
  }

  /* Layout */
  .container{
    max-width: 1100px;
    margin: 3rem auto;
    padding: 2rem;
    color: var(--text);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  }

  .grid{
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 1.5rem;
  }

  nav.toc{
    position: sticky;
    top: 1.5rem;
    background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
    border-radius: 12px;
    padding: 1rem;
    border: 1px solid rgba(255,255,255,0.03);
    height: calc(100vh - 4rem);
    overflow: auto;
  }

  .toc h3{ font-size: 0.95rem; margin-bottom: 0.6rem; color: var(--muted); }
  .toc ul{ list-style: none; padding: 0; margin: 0; }
  .toc li{ margin: 0.5rem 0; }
  .toc button{
    width: 100%; text-align: left; background: transparent; border: none; color: var(--text); padding: 0.4rem 0.6rem; border-radius: 8px; cursor: pointer; font-size: 0.95rem;
  }
  .toc button:hover{ background: rgba(255,255,255,0.02); }
  .toc button.active{ background: linear-gradient(90deg, rgba(108,92,231,0.12), rgba(108,92,231,0.06)); box-shadow: 0 4px 14px rgba(108,92,231,0.06); color: var(--accent); font-weight: 600; }

  main.card{
    background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00));
    padding: 2rem; border-radius: 14px; border: 1px solid rgba(255,255,255,0.04);
  }

  h1{ font-size: 2rem; margin: 0 0 0.25rem 0; color: var(--text); }
  .lede{ color: var(--muted); margin-bottom: 1rem; }

  section{ margin: 1.5rem 0; padding-bottom: 1rem; border-bottom: 1px dashed rgba(255,255,255,0.02); }
  section h2{ font-size: 1.2rem; color: var(--text); margin-bottom: 0.6rem; }
  section p{ color: var(--muted); line-height: 1.6; }

  .kpi-row{ display:flex; gap:1rem; margin-top: 1rem; }
  .kpi{ flex:1; background: var(--glass); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.02); }
  .kpi h4{ margin:0 0 0.25rem 0; }
  .code{ background: rgba(0,0,0,0.35); padding: 0.75rem; border-radius: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace; color: #cfe7ff; overflow:auto; }

  .pill{
    display:inline-block; padding: 0.25rem 0.6rem; border-radius: 999px; background: rgba(255,255,255,0.02); color: var(--muted); font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.02);
  }

  footer.small{ color: var(--muted); font-size: 0.85rem; margin-top: 2rem; }

  @media (max-width: 900px){
    .grid{ grid-template-columns: 1fr; }
    nav.toc{ position:relative; height: auto; }
  }
  header.navbar {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    background: rgba(15, 23, 36, 0.9);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .nav-brand {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--accent);
  }

  .nav-links {
    display: flex;
    gap: 1.2rem;
  }

  .nav-links a {
    color: var(--muted);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;
  }


  /* Mobile */
  .hamburger {
    display: none;
    flex-direction: column;
    gap: 4px;
    cursor: pointer;
  }
  .hamburger span {
    display: block;
    width: 20px;
    height: 2px;
    background: var(--muted);
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    .nav-links {
      display: none;
      flex-direction: column;
      position: absolute;
      top: 100%;
      right: 0;
      background: rgba(15, 23, 36, 0.95);
      padding: 1rem 1.5rem;
      border-bottom-left-radius: 8px;
    }
    .nav-links.show {
      display: flex;
    }
    .hamburger {
      display: flex;
    }
  }
</style>
<header class="navbar">
  <!-- Brand links back to home -->
  <a href="/" class="nav-brand">Metal Bare</a>

  <!-- Desktop / Mobile Links -->
  <nav class="nav-links {menuOpen ? 'show' : ''}">
    <a href="/register" class="auth-link login-link">Login</a>
  </nav>

  <!-- Hamburger Menu -->
  <button
    class="hamburger"
    aria-label="Toggle menu"
    aria-expanded={menuOpen}
    on:click={() => (menuOpen = !menuOpen)}
  >
    <span></span>
    <span></span>
    <span></span>
  </button>
</header>

<div class="container">
  <div class="grid">
    <nav class="toc" aria-label="Table of contents">
      <h3>Contents</h3>
      <ul>
        {#each toc as t, i}
          <li>
            <button class:active={i === activeSection} on:click={() => goto(i)}>{i + 1}. {t}</button>
          </li>
        {/each}
      </ul>
      <div style="margin-top:1.2rem;">
        <div class="pill">Project: METAL</div>
        <div style="height:8px"></div>
        <div class="pill">Nigeria</div>
      </div>
    </nav>

    <main class="card">
      <header>
        <h1>METAL — Research Brief & Technical Overview</h1>
        <div class="lede">Designing a low-cost, offline-capable contactless payment transmitter for small businesses in my country. This document provides a deep technical narrative, implementation notes, and an evaluative roadmap.</div>
      </header>

      <section id="sec-0">
        <h2>Executive Summary</h2>
        <p>
          METAL is a purpose-built payment transmitter that enables secure, contactless transfers using the national instant payment rail (NIP) while minimizing merchant costs and eliminating dependence on customer-side internet or payment cards. It pairs a lightweight RISC-V embedded system with a deterministic transmission protocol ("Jinx"), Rust firmware, and a cloud backend to provide an end-to-end payment experience tailored for micro and small businesses.
        </p>
      </section>

      <section id="sec-1">
        <h2>Motivation & Context</h2>
        <p>
          Small businesses — like our parents' supermarket in Lagos — pay disproportionate fees and face unreliable connectivity. Traditional POS solutions either rely on expensive hardware or card networks (Mastercard/Visa) with high interchange costs. In contrast, mobile transfers powered by NIP offer a low-fee, nation-wide settlement mechanism. METAL leverages this to keep costs low while providing the convenience of contactless payments without physical cards or Apple-restricted NFC paths.
        </p>
      </section>

      <section id="sec-2">
        <h2>Design Goals</h2>
        <ul>
          <li>Cost-effective hardware for mass adoption.</li>
          <li>Offline-first operation: payments must work when customer devices have no internet.</li>
          <li>Security: strong authentication and end-to-end encryption without large compute overheads.</li>
          <li>Extensibility: a platform that can integrate with banks, dashboards, and alternative connectivity (SIM, Wi‑Fi, satellite).</li>
        </ul>
      </section>

      <section id="sec-3">
        <h2>System Architecture (high-level)</h2>
        <p>
          METAL is composed of three logical layers:
        </p>
        <ol>
          <li><strong>Edge device</strong> — RISC‑V microcontroller running Rust firmware and FreeRTOS tasks (Keypad, LCD, Jinx, Pipe Stream).</li>
          <li><strong>SDK / Mobile</strong> — Integrated into bank apps. Uses P256 key agreement and AES‑GCM for per-transaction encryption; communicates with the Metal device over a local wireless radio link.</li>
          <li><strong>Backend</strong> — Axum server, Postgres database, and payment pipeline that forwards valid requests to NIBSS NIP for settlement.</li>
        </ol>

        <div class="kpi-row">
          <div class="kpi">
            <h4>Throughput</h4>
            <div class="pill">~1.5 Mbps link</div>
            <p class="small">Optimized packet size (16 bytes) and chunking pipeline for deterministic transfers.</p>
          </div>
          <div class="kpi">
            <h4>Latency</h4>
            <div class="pill">~950 ms (measured avg)</div>
            <p class="small">End-to-end exchange time for a full transaction handshake and transfer.</p>
          </div>
        </div>
      </section>

      <section id="sec-4">
        <h2>Core Components</h2>
        <p>At the firmware level the system is split into focused tasks:</p>
        <ul>
          <li><strong>Keypad Control</strong> — matrix scanning, debouncing, and price entry buffering.</li>
          <li><strong>LCD Display</strong> — dedicated thread receiving enum-based commands for concise rendering.</li>
          <li><strong>Pipe Stream</strong> — negotiates HTTPS with the cloud, performs health checks, and uploads transaction payloads.</li>
          <li><strong>Jinx</strong> — the transmission orchestrator that manages the chunked protocol, HEAD/MID/TAIL markers, and queues the assembled payload for Pipe Stream.</li>
        </ul>

        <div class="code" aria-hidden>
// sample thread spawn (Rust style) — simplified
let thread1 = std::thread::Builder::new()
    .stack_size(7000)
    .spawn(move || keypad_control(state_one, cols, rows))?;
let thread2 = std::thread::Builder::new()
    .stack_size(7000)
    .spawn(move || pipe_stream(state_two))?;
// Jinx runs on main thread to remain continuously active
        </div>
      </section>

      <section id="sec-5">
        <h2>Transmission Protocol — "Jinx"</h2>
        <p>
          The protocol is designed for reliability over an unreliable wireless medium. Key ideas:
        </p>
        <ul>
          <li><strong>Fixed-size chunks</strong> (16 bytes): simplifies memory management on constrained devices.</li>
          <li><strong>HEAD / MID / TAIL</strong> markers: identify message boundaries, enabling incremental reassembly on the device side.</li>
          <li><strong>Acknowledgement loop</strong>: the mobile side writes a chunk and waits for a notification before sending the next chunk, preventing buffer overruns and silent drops.</li>
          <li><strong>LinkedList queue</strong> on mobile: divides large encrypted payloads into chunk nodes and enqueues them for reliable sequential writes.</li>
        </ul>

        <div class="code">
// pseudocode: high level
enqueue(HEAD);
enqueue(MID...);
enqueue(chunked(encrypted_payload));
enqueue(TAIL);
while queue not empty:
  send(next_chunk)
  wait for ack
        </div>
      </section>

      <section id="sec-6">
        <h2>Security Model</h2>
        <p>
          Security balances strong guarantees with embedded constraints. The principal elements are:
        </p>
        <ul>
          <li><strong>Asymmetric keys</strong>: each customer receives a persistent P256 keypair. The public key is stored server-side and a compact encoding is stored in the device Keychain on mobile.</li>
          <li><strong>Ephemeral key agreement</strong>: mobile generates an ephemeral P256 key and performs ECDH with the customer public key, deriving a symmetric key (HKDF → AES‑GCM) per transaction.</li>
          <li><strong>AES‑GCM</strong>: chosen for combined authenticated encryption with associated data (AEAD) and low implementation complexity.</li>
          <li><strong>Device API keys</strong>: unique API key per METAL device used when uploading assembled transactions to the backend.</li>
        </ul>

        <p class="small"><strong>Why this combination?</strong> ECC for key agreement keeps public/private sizes small and computations feasible on mobile; AES‑GCM for symmetric encryption is efficient and widely supported across Swift and Rust when proper interoperability steps (x963 encodings, consistent HKDF parameters) are followed.</p>
      </section>

      <section id="sec-7">
        <h2>Implementation Details</h2>

        <p>
          Key implementation notes that influenced design choices:
        </p>
        <ul>
          <li><strong>no_std constraints</strong> on the firmware required careful static sizing (heapless Vec, fixed capacity buffers) and deterministic algorithms.</li>
          <li><strong>Thread synchronization</strong> uses Condvar + Mutex paired with Atomic flags to keep idle threads parked until needed, reducing power consumption.</li>
          <li><strong>HTTPS client</strong> on the ESM module uses a trusted CA bundle and a Caddy-backed server endpoint to simplify TLS on constrained hardware.</li>
        </ul>

        <div class="code">
            {code}
        </div>
      </section>

      <section id="sec-8">
        <h2>Challenges & Trade-offs</h2>
        <ul>
          <li><strong>Cross-language cryptography</strong>: differences in library encodings (Swift vs Rust) required careful handling of public key representations and HKDF parameters.</li>
          <li><strong>ECC performance</strong>: on microcontrollers, ECC operations are expensive; choosing curves and offloading where appropriate mattered.</li>
          <li><strong>No single shared symmetric key</strong>: improved security but increased handshake overhead; mitigated by efficient ephemeral key agreement and chunking.</li>
          <li><strong>Physical transmission</strong>: calibrating link distance and timing for reliable discovery without accidental pairing with nearby devices required tuning of both radio power and protocol timeouts.</li>
        </ul>
      </section>

      <section id="sec-9">
        <h2>Evaluation & Results</h2>
        <p>
          After integration tests and field tests at small merchant locations, the measured averages were:
        </p>
        <ul>
          <li>Average full exchange time: <strong>~950 ms</strong>.</li>
          <li>Chunk retransmit events: significantly reduced after introducing HEAD/T AIL markers and acknowledgment loop.</li>
          <li>Power draw: device capable of multi-week operation on carefully sized battery with a conservative duty cycle and deep-sleep modes for idle periods.</li>
        </ul>
      </section>

      <section id="sec-10">
        <h2>Roadmap & Next Steps</h2>
        <p>
          Short-to-mid term priorities:
        </p>
        <ol>
          <li>Formalize NIBSS integration and compliance testing for NIP settlement.</li>
          <li>Iterate hardware: redesign PCB for lower BOM cost and optional satellite/wide-area modules.</li>
          <li>End-to-end interoperability tests for cross-language cryptography (Swift ↔ Rust) and hardened key handling.</li>
          <li>Scale dashboard features for merchant operations and device fleet management.</li>
        </ol>
      </section>

      <section id="sec-11">
        <h2>References & Credits</h2>
        <p>
          METAL was built using Rust (firmware), Swift (mobile helpers), Axum + Postgres (backend), and Svelte (website prototype). Core design and testing were led by TEAM METAL. 
        </p>
      </section>

    </main>
  </div>
</div>
