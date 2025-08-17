import * as THREE from "three";

/** @type {THREE.Scene} */
let scene;
/** @type {THREE.PerspectiveCamera} */
let camera;
/** @type {THREE.WebGLRenderer} */
let renderer;
/** @type {THREE.Group} */
let chip;
/** @type {THREE.Group} */
let caseGroup;
/** @type {THREE.Mesh} */
let caseTop;
/** @type {THREE.Mesh} */
let caseBottom;
let mouseX = 0, mouseY = 0;
let caseOpen = false;
// let annotationsVisible = true;
let scrollProgress = 0;
let videoPlayed = false;
let annotationsVisible = true;

export async function init() {
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
    
    createChip();
    createCase();
    setupAnnotations();
    setupScrollHandler();
    
    // Mouse controls
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
    
    animate();
}
export function toggleAnnotations() {
    annotationsVisible = !annotationsVisible;
    const annotations = document.querySelector('.annotations');
    if (annotations instanceof HTMLElement) {
        annotations.style.display = annotationsVisible ? 'block' : 'none';
    }
}
function setupScrollHandler() {
    window.addEventListener('scroll', handleScroll);
}

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    scrollProgress = Math.min(scrollTop / (maxScroll * 0.3), 1); // Transition happens in first 30% of scroll
    
    // Fade out 3D scene and controls
    const container = document.getElementById('container');
    const controls = document.querySelector('.controls');
    const annotations = document.querySelector('.annotations');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const videoContainer = document.getElementById('video-container');
    const video = document.getElementById('demo-video');
    
    const opacity = 1 - scrollProgress;
    if (container) {
        container.style.opacity = opacity.toString();
    }
    if (controls instanceof HTMLElement) {
        controls.style.opacity = opacity.toString();
    }
    if (annotations instanceof HTMLElement) {
        annotations.style.opacity = opacity.toString();
    }
    
    // Show/hide scroll indicator
    if (scrollIndicator) {
        if (scrollProgress > 0.1) {
            scrollIndicator.classList.add('hide');
        } else {
            scrollIndicator.classList.remove('hide');
        }
    }
    
    // Show video when 3D scene is mostly faded
    if (scrollProgress > 0.7) {
        if (videoContainer) {
            videoContainer.classList.add('show');
        }
        
        // Play video once when it becomes visible
        if (!videoPlayed) {
            if (video instanceof HTMLVideoElement) {
                video.play().catch(e => {
                    console.log('Video autoplay failed:', e);
                    // Create a play button if autoplay fails
                    createPlayButton();
                });
                videoPlayed = true;
            }
        }
    } else {
        if (videoContainer) {
            videoContainer.classList.remove('show');
        }
        if (videoPlayed) {
            if (video instanceof HTMLVideoElement) {
                video.pause();
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

function createPlayButton() {
    const playBtn = document.createElement('button');
    playBtn.innerHTML = '▶ Play Video';
    playBtn.style.cssText = `
        position: absolute;
        top: 60%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.9);
        border: none;
        padding: 15px 30px;
        font-size: 18px;
        border-radius: 8px;
        cursor: pointer;
        z-index: 202;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    playBtn.onclick = () => {
        const videoElem = document.getElementById('demo-video');
        if (videoElem instanceof HTMLVideoElement) {
            videoElem.play();
        }
        playBtn.remove();
    };
    
    const videoContainerElem = document.getElementById('video-container');
    if (videoContainerElem) {
        videoContainerElem.appendChild(playBtn);
    } else {
        console.error("Element with id 'video-container' not found.");
    }
}

function createChip() {
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
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
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
}

function createCase() {
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
    const logoCanvas = document.createElement('canvas');
    logoCanvas.width = 512;
    logoCanvas.height = 128;
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
        caseGroup.add(screw);
    });
    
    scene.add(caseGroup);
}

function setupAnnotations() {
    // Main circle around the object - larger size
    const mainCircle = document.getElementById('mainCircle');
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


export function toggleCase() {
    caseOpen = !caseOpen;
    
    if (caseOpen) {
        // Animate case opening
        gsap.to(caseTop.position, { duration: 1, y: 2, ease: "power2.out" });
        gsap.to(caseTop.rotation, { duration: 1, x: -Math.PI / 6, ease: "power2.out" });
    } else {
        // Animate case closing
        gsap.to(caseTop.position, { duration: 1, y: 0.5, ease: "power2.out" });
        gsap.to(caseTop.rotation, { duration: 1, x: 0, ease: "power2.out" });
    }
}

// Example usage: connect toggleCase to a button with id 'toggle-case-btn'
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-case-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleCase);
    }
});

export function resetView() {
    camera.position.set(8, 8, 12);
    camera.lookAt(0, 0, 0);
    window.scrollTo(0, 0);
}

/**
 * @param {{ clientX: number; clientY: number; }} event
 */
function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    setupAnnotations(); // Reposition annotations on resize
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

// Simple animation library substitute
const gsap = {
    to: function(
        /** @type {{ [x: string]: any; }} */ target,
        /** @type {{ [x: string]: any; duration: number; ease: string; }} */ options
    ) {
        const start = Date.now();
        const duration = options.duration * 1000;
        /** @type {Record<string, number>} */
        const startValues = {};
        /** @type {Record<string, number>} */
        const targetValues = {};

        // Extract start and target values
        for (let prop in options) {
            if (prop !== 'duration' && prop !== 'ease') {
                startValues[prop] = typeof target[prop] === "number" ? target[prop] : 0; // Default to 0 if not set
                targetValues[prop] = options[prop];
            }
        }

        function animate() {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);

            // Simple easing
            const eased = options.ease === "power2.out"
                ? 1 - Math.pow(1 - progress, 2)
                : progress;

            for (let prop in targetValues) {
                target[prop] = startValues[prop] +
                    (targetValues[prop] - startValues[prop]) * eased;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        animate();
    }
};
