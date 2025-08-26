<script lang="ts">
    import { browser } from '$app/environment';
    import * as THREE from 'three';
    import { onMount } from 'svelte';

    let containerElem: HTMLDivElement;
    let mainCircle: HTMLDivElement;
    let canvas: HTMLCanvasElement;
    let logoCanvas: HTMLCanvasElement;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let cube: THREE.Mesh;
    let showMobileMenu = false;
    let mouseX = 0, mouseY = 0;
    let scrollProgress = 0;
    let videoPlayed = false;
    let chip: THREE.Group | null = null;
    let caseGroup: THREE.Group | null = null;
    let caseTop: THREE.Mesh | null = null;
    let caseBottom: THREE.Mesh | null = null;
    let annotationsVisible = true;
    let controls: HTMLElement | null = null;
    let annotations: HTMLElement | null = null;
    let scrollIndicator: HTMLElement | null = null;
    let videoContainer: HTMLDivElement | null = null;
    let playVideo: HTMLIFrameElement | null = null;
    let videoOverlay: HTMLDivElement | null = null;
    const handleVideo = () => {
        if (playVideo) {
        playVideo
        }
    }
    const init = () => {
    // Scene setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        
        // Camera setup
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(8, 8, 12);
        camera.lookAt(0, 0, 0);
        
        // Renderer setup
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        //    renderer.physicallyCorrectLights = true; // Removed: property does not exist on WebGLRenderer
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        const containerElem = document.getElementById('container');
        if (containerElem) {
            containerElem.appendChild(renderer.domElement);
        } else {
            console.error("Container element with id 'container' not found.");
        }
        
        // Enhanced lighting for better visibility
        const ambientLight = new THREE.AmbientLight(0x808080, 1.2); // Much brighter ambient
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);
        
        // Additional lights for better structure visibility
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
        fillLight.position.set(-10, 5, -5);
        scene.add(fillLight);
        
        const topLight = new THREE.DirectionalLight(0xffffff, 0.6);
        topLight.position.set(0, 15, 0);
        scene.add(topLight);
        
        const pointLight = new THREE.PointLight(0x4444ff, 0.6, 100);
        pointLight.position.set(-5, 5, 5);
        scene.add(pointLight);
        
        const pointLight2 = new THREE.PointLight(0xff4444, 0.4, 100);
        pointLight2.position.set(5, -3, 3);
        scene.add(pointLight2);
        scrollProgress = 0; 
        videoPlayed = false;
        createChip();
        createCase();
        setupAnnotations();
        setupScrollHandler();
    };
    const setupAnnotations = () => {
        // Main circle around the object - larger size
        if (mainCircle) {
            mainCircle.style.width = '500px';
            mainCircle.style.height = '500px';
            mainCircle.style.left = 'calc(50% - 250px)';
            mainCircle.style.top = 'calc(50% - 250px)';
        }
        
        // Position feature labels around the larger circle
        const annotations = [
            { label: 'label1', x: '15%', y: '15%' },
            { label: 'label2', x: '75%', y: '10%' },
            { label: 'label3', x: '10%', y: '65%' },
            { label: 'label4', x: '80%', y: '70%' },
            { label: 'label5', x: '5%', y: '40%' },
            { label: 'label6', x: '75%', y: '35%' }
        ];
        
        annotations.forEach(ann => {
            const label = document.getElementById(ann.label);
            if (label) {
                label.style.left = ann.x;
                label.style.top = ann.y;
            }
        });
    }
    const createCase = () => {
        caseGroup = new THREE.Group();
    
        // Case materials - rougher and brighter
        const caseMaterial = new THREE.MeshLambertMaterial({
            color: 0xb8b8b8 // Brighter aluminum
        });
        
        const redAccentMaterial = new THREE.MeshLambertMaterial({
            color: 0xff3333 // Brighter red
        });
        
        // Bottom case
        const bottomGeometry = new THREE.BoxGeometry(3.5, 0.35, 2.8);
        caseBottom = new THREE.Mesh(bottomGeometry, caseMaterial);
        caseBottom.position.y = -0.35;
        caseBottom.castShadow = true;
        caseBottom.receiveShadow = true;
        caseGroup.add(caseBottom);
        
        // Top case
        const topGeometry = new THREE.BoxGeometry(3.3, 0.2, 2.6);
        caseTop = new THREE.Mesh(topGeometry, caseMaterial);
        caseTop.position.y = 0.35;
        caseTop.castShadow = true;
        caseTop.receiveShadow = true;
        caseGroup.add(caseTop);
        
        // Red accent strips
        const accentGeometry = new THREE.BoxGeometry(3.6, 0.07, 0.12);
        const accent1 = new THREE.Mesh(accentGeometry, redAccentMaterial);
        accent1.position.set(0, 0.38, 1.0);
        caseGroup.add(accent1);
        
        const accent2 = new THREE.Mesh(accentGeometry, redAccentMaterial);
        accent2.position.set(0, 0.38, -1.0);
        caseGroup.add(accent2);
        
        // Ventilation holes
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 6; j++) {
                const holeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.25, 8);
                const holeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
                const hole = new THREE.Mesh(holeGeometry, holeMaterial);
                hole.position.set(
                    (j - 2.5) * 0.3,
                    0.35,
                    (i - 0.5) * 0.6
                );
                hole.rotation.x = Math.PI / 2;
                caseGroup.add(hole);
            }
        }
        
        // METAL logo
        const logoCtx = logoCanvas.getContext('2d');
        if (logoCtx) {
            logoCtx.fillStyle = '#ffffff';
            logoCtx.font = 'bold 36px Arial';
            logoCtx.textAlign = 'center';
            logoCtx.fillText('METAL', 256, 80);
        }
        
        const logoTexture = new THREE.CanvasTexture(logoCanvas);
        const logoMaterial = new THREE.MeshBasicMaterial({ 
            map: logoTexture, 
            transparent: true 
        });
        const logoGeometry = new THREE.PlaneGeometry(1.5, 0.35);
        const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
        logoMesh.position.set(0, 0.36, 0);
        logoMesh.rotation.x = -Math.PI / 2;
        caseGroup.add(logoMesh);
        
        // Corner screws - brighter and more visible
        const screwGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.07, 8);
        const screwMaterial = new THREE.MeshLambertMaterial({
            color: 0xaaaaaa // Brighter gray
        });
        
        const screwPositions = [
            [-1.5, 0.38, -1.1],
            [1.5, 0.38, -1.1],
            [-1.5, 0.38, 1.1],
            [1.5, 0.38, 1.1]
        ];
        
        screwPositions.forEach(pos => {
            const screw = new THREE.Mesh(screwGeometry, screwMaterial);
            screw.position.set(pos[0], pos[1], pos[2]);
            if (caseGroup) {
                caseGroup.add(screw);
            }
        });
        
        scene.add(caseGroup);
    }
    const setupScrollHandler = () => {
        window.addEventListener('scroll', handleScroll);
    }
    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        scrollProgress = Math.min(scrollTop / (maxScroll * 0.3), 1); // Transition happens in first 30% of scroll
        
        // Fade out 3D scene and controls
        console.log('Scroll progress:', scrollProgress); 
        const opacity = 1 - scrollProgress;
        if (containerElem) {
            (containerElem as HTMLDivElement)?.style?.setProperty('opacity', opacity.toString());
        }
        if (controls) {
            (controls as HTMLElement).style.opacity = opacity.toString();
        }
        if (annotations) {
            (annotations as HTMLElement).style.opacity = opacity.toString();
        }
        
        // Show/hide scroll indicator
        if (scrollIndicator) {
            if (scrollProgress > 0.1) {
                (scrollIndicator as HTMLElement).classList.add('hide');
            } else {
                (scrollIndicator as HTMLElement).classList.remove('hide');
            }
        }
        
        // Show video when 3D scene is mostly faded
        if (scrollProgress > 0.7) {
            if (videoContainer) {
                videoContainer.classList.add('show');
            }
            
            // Play video once when it becomes visible
            if (!videoPlayed) {
                handleVideo();
            }
        } else {
            if (videoContainer) {
                videoContainer.classList.remove('show');
            }
            if (videoPlayed) {
                if (playVideo instanceof HTMLVideoElement) {
                    playVideo.pause();
                }
                videoPlayed = false;
            }
        }
        
        // Add some dynamic effects to the 3D scene based on scroll
        if (chip && scrollProgress < 1) {
            chip.rotation.y = scrollProgress * Math.PI * 2;
            // Make the chip grow bigger before fading away
            const scaleMultiplier = 1 + (scrollProgress * 2.5); // Grows up to 3.5x size
            chip.scale.setScalar(scaleMultiplier);
        }
    }
    const createChip = () => {
        const chipGroup = new THREE.Group();
        
        // Main chip substrate (green PCB) - rougher and brighter
        const chipGeometry = new THREE.BoxGeometry(2, 0.1, 2);
        const chipMaterial = new THREE.MeshLambertMaterial({
            color: 0x4a8a4a, // Brighter green
            transparent: false
        });
        const chipBase = new THREE.Mesh(chipGeometry, chipMaterial);
        chipBase.castShadow = true;
        chipBase.receiveShadow = true;
        chipGroup.add(chipBase);
        
        // CPU die (silicon chip) - matte finish
        const dieGeometry = new THREE.BoxGeometry(0.8, 0.03, 0.8);
        const dieMaterial = new THREE.MeshLambertMaterial({
            color: 0x505050 // Lighter gray
        });
        const die = new THREE.Mesh(dieGeometry, dieMaterial);
        die.position.y = 0.065;
        die.castShadow = true;
        chipGroup.add(die);
        
        // Circuit traces - brighter and more visible
        for (let i = 0; i < 15; i++) {
            const traceGeometry = new THREE.BoxGeometry(
                Math.random() * 0.5 + 0.1, 
                0.005, 
                0.01
            );
            const traceMaterial = new THREE.MeshLambertMaterial({
                color: 0xffdd44 // Brighter gold
            });
            const trace = new THREE.Mesh(traceGeometry, traceMaterial);
            trace.position.set(
                (Math.random() - 0.5) * 1.6,
                0.055,
                (Math.random() - 0.5) * 1.6
            );
            trace.rotation.y = Math.random() * Math.PI;
            chipGroup.add(trace);
        }
        
        // Capacitors and resistors - more visible colors
        for (let i = 0; i < 10; i++) {
            const componentGeometry = new THREE.BoxGeometry(0.06, 0.03, 0.03);
            const componentMaterial = new THREE.MeshLambertMaterial({
                color: Math.random() > 0.5 ? 0xcd853f : 0x333333 // Brighter brown and gray
            });
            const component = new THREE.Mesh(componentGeometry, componentMaterial);
            component.position.set(
                (Math.random() - 0.5) * 1.6,
                0.065,
                (Math.random() - 0.5) * 1.6
            );
            chipGroup.add(component);
        }
        
        // Pin connectors - brighter and more visible
        for (let i = 0; i < 32; i++) {
            const pinGeometry = new THREE.BoxGeometry(0.03, 0.12, 0.03);
            const pinMaterial = new THREE.MeshLambertMaterial({
                color: 0xe0e0e0 // Brighter silver
            });
            const pin = new THREE.Mesh(pinGeometry, pinMaterial);
            
            const side = Math.floor(i / 8);
            const pos = (i % 8) * 0.2 - 0.7;
            
            switch(side) {
                case 0: pin.position.set(pos, -0.11, 1.0); break;
                case 1: pin.position.set(1.0, -0.11, pos); break;
                case 2: pin.position.set(pos, -0.11, -1.0); break;
                case 3: pin.position.set(-1.0, -0.11, pos); break;
            }
            
            chipGroup.add(pin);
        }
        
        // RISC-V logo/text on the die
        const textGeometry = new THREE.PlaneGeometry(0.5, 0.12);
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('RISC-V', 128, 40);
        }
        
        const textTexture = new THREE.CanvasTexture(canvas);
        const textMaterial = new THREE.MeshBasicMaterial({ 
            map: textTexture, 
            transparent: true,
            opacity: 0.8
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 0.085, 0);
        textMesh.rotation.x = -Math.PI / 2;
        chipGroup.add(textMesh);
        
        chip = chipGroup;
        scene.add(chip);
    };
    const toggleMobileMenu = () => {
		showMobileMenu = !showMobileMenu;
	}
    function animate() {
        requestAnimationFrame(animate);
        
        // Smooth camera movement based on mouse
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
        
        // Subtle chip rotation (modified by scroll)
        if (chip && scrollProgress < 1) {
            chip.rotation.y += 0.005 * (1 - scrollProgress * 0.5); // Slower rotation as it grows
        }
        
        renderer.render(scene, camera);
    }

    onMount(() => {
        if (!browser) return;

        init();
        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = containerElem.clientWidth / containerElem.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerElem.clientWidth, containerElem.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });
</script>

<div class="home-body">
    <div bind:this={containerElem} id="container"></div>

    <div class="video-container" bind:this={videoContainer} class:show={videoPlayed}>
        <div class="video-overlay" bind:this={videoOverlay}>
            <p>Prototype for transmission</p>
        </div>
    <iframe 
        id="play-video" 
        bind:this={playVideo}
        src="https://www.youtube.com/embed/SFoCW7JcjtE?autoplay=1&mute=1&loop=1&playlist=SFoCW7JcjtE"
        title="YouTube video player"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
        class="w-full h-full">
    </iframe>
    </div>
    
    <div class="annotations" bind:this={annotations}>
        <!-- Main circle around the object -->
        <div class="circle-annotation" id="mainCircle" bind:this={mainCircle}></div>
        
        <!-- Feature labels with arrows -->
        <div class="feature-label" id="label1">METAL<br><small>Transmitter</small></div>
        <div class="arrow" id="arrow1"></div>
        
        <div class="feature-label" id="label2">Jinx<br><small>Priority Software</small></div>
        <div class="arrow" id="arrow2"></div>
        
        <div class="feature-label" id="label3">RISC-V Processor<br><small>Open Source</small></div>
        <div class="arrow" id="arrow3"></div>
        
        <div class="feature-label" id="label4">GPIO Pin Headers<br><small>31-Pin Interface</small></div>
        <div class="arrow" id="arrow4"></div>
        
        <div class="feature-label" id="label5">PCB Circuit Board<br><small>Green Substrate</small></div>
        <div class="arrow" id="arrow5"></div>
        
        <div class="feature-label" id="label6">Processor power<br><small>Low power energy</small></div>
        <div class="arrow" id="arrow6"></div>
    </div>
    
    <div class="controls">
    <div class="nav-brand">Metal Bare</div>
    
    <!-- Desktop Navigation -->
    <div class="nav-links">
        <a href="/register" class="auth-link signup-link">Login</a>
        <a href="/research" class="auth-link login-link">Research</a>
    </div>
    
    <!-- Hamburger Menu -->
    <button
        type="button"
        class="hamburger"
        class:active={showMobileMenu}
        on:click={toggleMobileMenu}
        aria-label="Toggle menu"
        aria-expanded={showMobileMenu}
    >
        <span></span>
        <span></span>
        <span></span>
    </button>
    </div>

    {#if showMobileMenu}
    <!-- Mobile Menu -->
    <div class="mobile-menu" id="mobileMenu">
        <a href="/register" class="auth-link signup-link" on:click={() => showMobileMenu = false}>Login</a>
        <a href="/research" class="auth-link login-link" on:click={() => showMobileMenu = false}>Research</a>
    </div>
    {/if}
    
    <div class="scroll-indicator" bind:this={scrollIndicator} class:hide={scrollProgress > 0.1}>
        <div>↓ Scroll down to see more ↓</div>
    </div>
    <canvas bind:this={canvas} width="256" height="64" style="display:none;"></canvas>
    <canvas bind:this={logoCanvas} width="512" height="128" style="display:none;"></canvas>

</div>
<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
        font-family: 'Arial', sans-serif;
        height: 300vh; /* Make page scrollable */
    }
    
    .home-body {
        height: 100vh;
        width: 100vw;
    }
    .video-overlay p {
        margin-top: 3em;
    } 
    #container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        transition: opacity 0.5s ease-out;
    }
   .nav-links {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .auth-link {
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
    }

    .signup-link {
        background-color: #007bff;
        color: white;
    }

    .login-link {
        border: 1px solid #007bff;
        color: #007bff;
    } 
    .video-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.9);
        opacity: 0;
        visibility: hidden;
        transition: all 0.8s ease-out;
        z-index: 200;
    }
    
    .video-container.show {
        opacity: 1;
        visibility: visible;
    }
    
    #play-video {
        width: 80%;
        max-width: 800px;
        height: auto;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }
    
    .video-overlay {
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        text-align: center;
        z-index: 201;
    }
    
    .video-overlay p {
        font-size: 1.2rem;
        opacity: 0.9;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
    }
    .controls {
        background: #fff;
        padding: 1rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
    }
    .nav-brand {
        font-size: 1.5rem;
        font-weight: bold;
        color: #000000;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .nav-links {
        display: flex;
        gap: 1rem;
        align-items: center;
    }
    .auth-link {
        text-decoration: none;
        padding: 0.6rem 1.2rem;
        border-radius: 6px;
        font-weight: 500;
        transition: all 0.3s ease;
        font-size: 0.9rem;
        display: inline-block;
    }

    .signup-link {
        background: linear-gradient(135deg, #03558BFF, #007acc);
        color: #000;
        border: none;
    }

    .signup-link:hover {
        background: linear-gradient(135deg, #03558BFF, #007acc);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3);
    }

    .login-link {
        border: 1px solid #007acc;
        color: #007acc;
        background: transparent;
    }

    .login-link:hover {
        background: #007acc;
        color: #000;
        transform: translateY(-1px);
    }
/* Hamburger Menu */
.hamburger {
    display: none;
    flex-direction: column;
    cursor: pointer;
    padding: 0.5rem;
    gap: 4px;
    background: transparent;
    border: none;
    outline: none;
}

.hamburger:focus {
    outline: 2px solid #007acc;
    outline-offset: 2px;
}

.hamburger span {
    width: 25px;
    height: 3px;
    background: #007acc;
    transition: all 0.3s ease;
    border-radius: 2px;
}

/* Alternative: Use hover effect instead of active state */
.hamburger:hover span {
    background: #007acc;
}

/* Or you can use this approach if you add the active class manually */
.hamburger[aria-expanded="true"] span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}

.hamburger[aria-expanded="true"] span:nth-child(2) {
    opacity: 0;
}

.hamburger[aria-expanded="true"] span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
}

/* Mobile Menu */
.mobile-menu {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background: #fff;
    backdrop-filter: blur(10px);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index: 999;
    animation: slideDown 0.3s ease;
    width: 100vw;
    box-sizing: border-box;
}
    iframe {
        height: 1000px;
        width: 400px;
        resize: both;
        overflow: auto;
    } 
    .annotations {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 50;
        transition: opacity 0.5s ease-out;
    }
    
    .feature-label {
        position: absolute;
        background: rgba(255, 255, 255, 0.95);
        color: #333;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        border: 2px solid #007acc;
        max-width: 150px;
        text-align: center;
    }
    
    .arrow {
        display: none;
    }
    
    .circle-annotation {
        position: absolute;
        border: 3px dashed #007acc;
        border-radius: 50%;
        pointer-events: none;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { opacity: 0.8; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.05); }
        100% { opacity: 0.8; transform: scale(1); }
    }
    
    .scroll-indicator {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        color: #666;
        text-align: center;
        z-index: 60;
        animation: bounce 2s infinite;
        transition: opacity 0.5s ease-out;
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
        40% { transform: translateX(-50%) translateY(-10px); }
        60% { transform: translateX(-50%) translateY(-5px); }
    }
    
    .scroll-indicator.hide {
        opacity: 0;
    }
        @media (max-width: 768px) {
            .video-container {
                margin: 1rem auto;
            }

            iframe {
                height: 250px;
            }

            .video-overlay h2 {
                font-size: 1.5rem;
            }

            .video-overlay p {
                font-size: 1rem;
            }
        }

        @media (max-width: 480px) {

            iframe {
                height: 200px;
            }
        }
        @keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.mobile-menu .auth-link {
    width: 100%;
    text-align: center;
    margin: 0.5rem 0;
    padding: 0.8rem 1rem;
    font-size: 1rem;
    box-sizing: border-box;
}

/* Focus styles for accessibility */
.auth-link:focus {
    outline: 2px solid #00ff88;
    outline-offset: 2px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .controls {
        padding: 1rem;
        height: 60px;
        box-sizing: border-box;
    }

    .nav-links {
        display: none !important;
    }

    .hamburger {
        display: flex !important;
    }

    .nav-brand {
        font-size: 1.2rem;
    }

    .mobile-menu {
        top: 60px;
        display: flex !important;
    }
}

@media (max-width: 480px) {
    .controls {
        padding: 0.8rem;
        height: 55px;
    }

    .nav-brand {
        font-size: 1rem;
    }

    .mobile-menu {
        padding: 1rem;
        top: 55px;
    }
}
</style>