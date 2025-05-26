/**
 * Scene 2 - Advanced demonstration scene
 * Contains more complex geometry and different lighting
 */

class Scene2 {
    constructor() {
        this.scene = null;
        this.objects = [];
        this.isInitialized = false;
        this.animationMixers = [];
    }
    
    /**
     * Initialize Scene 2
     * @param {CameraManager} cameraManager - Camera manager instance
     * @param {LightsManager} lightsManager - Lights manager instance
     * @param {ModelLoader} modelLoader - Model loader instance
     */
    async init(cameraManager, lightsManager, modelLoader) {
        try {
            console.log('Initializing Scene 2...');
            
            // Create the scene
            this.scene = new THREE.Scene();
            this.scene.name = 'Scene2';
            
            // Set background
            this.setupBackground();
            
            // Add lights to scene (with different configuration)
            if (lightsManager) {
                lightsManager.addToScene(this.scene);
                // Apply night lighting preset
                lightsManager.applyPreset('night');
            }
            
            // Create environment
            this.createEnvironment();
            
            // Add complex geometry
            this.createAdvancedGeometry();
            
            // Add particle system
            this.createParticleSystem();
            
            // Add coordinate axes helper
            this.addAxesHelper();
            
            console.log('Scene 2 initialized successfully');
            this.isInitialized = true;
            
        } catch (error) {
            console.error('Failed to initialize Scene 2:', error);
            throw error;
        }
    }
    
    /**
     * Setup scene background
     */
    setupBackground() {
        // Create a night/space background
        this.scene.background = new THREE.Color(0x0f0f23); // Dark blue
        
        // Add fog for atmosphere
        this.scene.fog = new THREE.Fog(0x0f0f23, 10, 100);
        
        console.log('Scene 2 background setup complete');
    }
    
    /**
     * Create environment elements
     */
    createEnvironment() {
        // Create a metallic floor
        const floorGeometry = new THREE.PlaneGeometry(60, 60);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.8,
            roughness: 0.2,
            side: THREE.DoubleSide
        });
        
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;
        floor.name = 'Floor';
        
        this.scene.add(floor);
        this.objects.push(floor);
        
        // Create perimeter walls
        this.createWalls();
        
        console.log('Environment created');
    }
    
    /**
     * Create perimeter walls
     */
    createWalls() {
        const wallHeight = 8;
        const wallThickness = 0.5;
        const roomSize = 30;
        
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            metalness: 0.3,
            roughness: 0.7
        });
        
        // Front wall
        const frontWallGeometry = new THREE.BoxGeometry(roomSize, wallHeight, wallThickness);
        const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
        frontWall.position.set(0, wallHeight / 2, -roomSize / 2);
        frontWall.receiveShadow = true;
        frontWall.castShadow = true;
        frontWall.name = 'FrontWall';
        
        this.scene.add(frontWall);
        this.objects.push(frontWall);
        
        // Back wall
        const backWall = frontWall.clone();
        backWall.position.z = roomSize / 2;
        backWall.name = 'BackWall';
        
        this.scene.add(backWall);
        this.objects.push(backWall);
        
        // Left wall
        const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, roomSize);
        const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
        leftWall.position.set(-roomSize / 2, wallHeight / 2, 0);
        leftWall.receiveShadow = true;
        leftWall.castShadow = true;
        leftWall.name = 'LeftWall';
        
        this.scene.add(leftWall);
        this.objects.push(leftWall);
        
        // Right wall
        const rightWall = leftWall.clone();
        rightWall.position.x = roomSize / 2;
        rightWall.name = 'RightWall';
        
        this.scene.add(rightWall);
        this.objects.push(rightWall);
    }
    
    /**
     * Create advanced geometry objects
     */
    createAdvancedGeometry() {
        // Create a crystal formation
        this.createCrystalFormation();
        
        // Create floating platforms
        this.createFloatingPlatforms();
        
        // Create spiral structure
        this.createSpiralStructure();
        
        // Create glowing orbs
        this.createGlowingOrbs();
        
        console.log('Advanced geometry created');
    }
    
    /**
     * Create crystal formation
     */
    createCrystalFormation() {
        const crystalGroup = new THREE.Group();
        crystalGroup.name = 'CrystalFormation';
        
        for (let i = 0; i < 5; i++) {
            const height = 2 + Math.random() * 3;
            const crystalGeometry = new THREE.ConeGeometry(0.5, height, 6);
            const crystalMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.8, 0.6),
                transparent: true,
                opacity: 0.8,
                metalness: 0.1,
                roughness: 0.1
            });
            
            const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
            crystal.position.set(
                (Math.random() - 0.5) * 4,
                height / 2,
                -8 + (Math.random() - 0.5) * 4
            );
            crystal.rotation.y = Math.random() * Math.PI * 2;
            crystal.castShadow = true;
            crystal.receiveShadow = true;
            
            crystalGroup.add(crystal);
        }
        
        this.scene.add(crystalGroup);
        this.objects.push(crystalGroup);
    }
    
    /**
     * Create floating platforms
     */
    createFloatingPlatforms() {
        const platformGroup = new THREE.Group();
        platformGroup.name = 'FloatingPlatforms';
        
        for (let i = 0; i < 3; i++) {
            const platformGeometry = new THREE.CylinderGeometry(2, 2, 0.3, 8);
            const platformMaterial = new THREE.MeshStandardMaterial({
                color: 0x666666,
                metalness: 0.7,
                roughness: 0.3
            });
            
            const platform = new THREE.Mesh(platformGeometry, platformMaterial);
            platform.position.set(
                8 + i * 3,
                2 + i * 1.5,
                0
            );
            platform.castShadow = true;
            platform.receiveShadow = true;
            
            platformGroup.add(platform);
        }
        
        this.scene.add(platformGroup);
        this.objects.push(platformGroup);
    }
    
    /**
     * Create spiral structure
     */
    createSpiralStructure() {
        const spiralGroup = new THREE.Group();
        spiralGroup.name = 'SpiralStructure';
        
        const segmentCount = 20;
        const radius = 3;
        const height = 8;
        
        for (let i = 0; i < segmentCount; i++) {
            const angle = (i / segmentCount) * Math.PI * 4; // Two full rotations
            const y = (i / segmentCount) * height;
            
            const segmentGeometry = new THREE.BoxGeometry(0.3, 0.3, 1);
            const segmentMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(i / segmentCount, 1, 0.5),
                emissive: new THREE.Color().setHSL(i / segmentCount, 1, 0.1)
            });
            
            const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
            segment.position.set(
                Math.cos(angle) * radius,
                y,
                Math.sin(angle) * radius + 8
            );
            segment.lookAt(0, y, 8);
            segment.castShadow = true;
            
            spiralGroup.add(segment);
        }
        
        this.scene.add(spiralGroup);
        this.objects.push(spiralGroup);
    }
    
    /**
     * Create glowing orbs
     */
    createGlowingOrbs() {
        const orbGroup = new THREE.Group();
        orbGroup.name = 'GlowingOrbs';
        
        for (let i = 0; i < 6; i++) {
            const orbGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const orbMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: new THREE.Color().setHSL(Math.random(), 1, 0.3),
                transparent: true,
                opacity: 0.9
            });
            
            const orb = new THREE.Mesh(orbGeometry, orbMaterial);
            orb.position.set(
                (Math.random() - 0.5) * 20,
                1 + Math.random() * 4,
                (Math.random() - 0.5) * 20
            );
            
            // Add point light to each orb
            const light = new THREE.PointLight(orbMaterial.emissive.getHex(), 0.5, 10);
            orb.add(light);
            
            orbGroup.add(orb);
        }
        
        this.scene.add(orbGroup);
        this.objects.push(orbGroup);
    }
    
    /**
     * Create particle system
     */
    createParticleSystem() {
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 50;     // x
            positions[i + 1] = Math.random() * 20;          // y
            positions[i + 2] = (Math.random() - 0.5) * 50;  // z
        }
        
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.name = 'Particles';
        
        this.scene.add(particles);
        this.objects.push(particles);
        
        console.log('Particle system created');
    }
    
    /**
     * Add coordinate axes helper
     */
    addAxesHelper() {
        const axesHelper = new THREE.AxesHelper(3);
        axesHelper.name = 'AxesHelper';
        this.scene.add(axesHelper);
        
        console.log('Axes helper added');
    }
    
    /**
     * Load a 3D model into the scene
     * @param {ModelLoader} modelLoader - Model loader instance
     * @param {string} modelType - Type of model to load
     */
    async loadModel(modelLoader, modelType) {
        try {
            console.log(`Loading model '${modelType}' into Scene 2...`);
            
            let model;
            
            // Create different models based on type
            switch (modelType) {
                case 'cube':
                    model = this.createAdvancedCube();
                    break;
                case 'sphere':
                    model = this.createAdvancedSphere();
                    break;
                default:
                    console.warn(`Unknown model type: ${modelType}`);
                    return;
            }
            
            if (model) {
                // Position the model
                const existingObjects = this.objects.filter(obj => obj.userData.isLoadedModel);
                const xOffset = existingObjects.length * 4;
                model.position.set(xOffset - 10, 2, -5);
                
                // Mark as loaded model
                model.userData.isLoadedModel = true;
                model.userData.modelType = modelType;
                
                this.scene.add(model);
                this.objects.push(model);
                
                console.log(`Model '${modelType}' loaded successfully`);
            }
            
        } catch (error) {
            console.error(`Failed to load model '${modelType}':`, error);
            throw error;
        }
    }
    
    /**
     * Create an advanced cube model
     * @returns {THREE.Mesh}
     */
    createAdvancedCube() {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff3838,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x330000,
            transparent: true,
            opacity: 0.9
        });
        
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.name = 'LoadedAdvancedCube';
        
        return cube;
    }
    
    /**
     * Create an advanced sphere model
     * @returns {THREE.Mesh}
     */
    createAdvancedSphere() {
        const geometry = new THREE.SphereGeometry(1.2, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: 0x3838ff,
            metalness: 0.1,
            roughness: 0.1,
            emissive: 0x000033,
            transparent: true,
            opacity: 0.8
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        sphere.name = 'LoadedAdvancedSphere';
        
        return sphere;
    }
    
    /**
     * Update scene (called every frame)
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
        if (!this.isInitialized) return;
        
        // Animate objects
        this.animateObjects(deltaTime);
        
        // Update particle system
        this.updateParticles(deltaTime);
    }
    
    /**
     * Animate scene objects
     * @param {number} deltaTime - Time since last frame
     */
    animateObjects(deltaTime) {
        const time = Date.now() * 0.001;
        
        // Animate spiral structure
        const spiral = this.scene.getObjectByName('SpiralStructure');
        if (spiral) {
            spiral.rotation.y += 0.005;
        }
        
        // Animate floating platforms
        const platforms = this.scene.getObjectByName('FloatingPlatforms');
        if (platforms) {
            platforms.children.forEach((platform, index) => {
                platform.position.y = 2 + index * 1.5 + Math.sin(time + index) * 0.5;
                platform.rotation.y += 0.01;
            });
        }
        
        // Animate glowing orbs
        const orbs = this.scene.getObjectByName('GlowingOrbs');
        if (orbs) {
            orbs.children.forEach((orb, index) => {
                orb.position.y += Math.sin(time * 2 + index) * 0.01;
                orb.rotation.y += 0.02;
                
                // Pulse the emissive color
                const intensity = 0.3 + Math.sin(time * 3 + index) * 0.2;
                orb.material.emissive.setHSL(
                    (time * 0.1 + index * 0.1) % 1,
                    1,
                    intensity
                );
                
                // Update point light
                const light = orb.children[0];
                if (light) {
                    light.intensity = intensity;
                    light.color.copy(orb.material.emissive);
                }
            });
        }
        
        // Animate crystal formation
        const crystals = this.scene.getObjectByName('CrystalFormation');
        if (crystals) {
            crystals.children.forEach((crystal, index) => {
                crystal.rotation.y += 0.01;
                crystal.material.opacity = 0.8 + Math.sin(time * 2 + index) * 0.2;
            });
        }
    }
    
    /**
     * Update particle system
     * @param {number} deltaTime - Time since last frame
     */
    updateParticles(deltaTime) {
        const particles = this.scene.getObjectByName('Particles');
        if (particles) {
            particles.rotation.y += 0.001;
            
            // Update particle positions
            const positions = particles.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] += 0.01; // Move particles up
                
                // Reset particles that go too high
                if (positions[i] > 20) {
                    positions[i] = 0;
                }
            }
            particles.geometry.attributes.position.needsUpdate = true;
        }
    }
    
    /**
     * Get the Three.js scene object
     * @returns {THREE.Scene|null}
     */
    getScene() {
        return this.scene;
    }
    
    /**
     * Get count of loaded models
     * @returns {number}
     */
    getModelCount() {
        return this.objects.filter(obj => obj.userData.isLoadedModel).length;
    }
    
    /**
     * Remove a loaded model by type
     * @param {string} modelType - Type of model to remove
     */
    removeModel(modelType) {
        const modelIndex = this.objects.findIndex(obj => 
            obj.userData.isLoadedModel && obj.userData.modelType === modelType
        );
        
        if (modelIndex !== -1) {
            const model = this.objects[modelIndex];
            this.scene.remove(model);
            this.objects.splice(modelIndex, 1);
            
            // Dispose of geometry and material
            if (model.geometry) model.geometry.dispose();
            if (model.material) {
                if (Array.isArray(model.material)) {
                    model.material.forEach(mat => mat.dispose());
                } else {
                    model.material.dispose();
                }
            }
            
            console.log(`Model '${modelType}' removed from Scene 2`);
        }
    }
    
    /**
     * Clear all loaded models
     */
    clearModels() {
        const loadedModels = this.objects.filter(obj => obj.userData.isLoadedModel);
        
        loadedModels.forEach(model => {
            this.scene.remove(model);
            
            // Dispose of resources
            if (model.geometry) model.geometry.dispose();
            if (model.material) {
                if (Array.isArray(model.material)) {
                    model.material.forEach(mat => mat.dispose());
                } else {
                    model.material.dispose();
                }
            }
        });
        
        // Remove from objects array
        this.objects = this.objects.filter(obj => !obj.userData.isLoadedModel);
        
        console.log('All loaded models cleared from Scene 2');
    }
    
    /**
     * Dispose of scene resources
     */
    dispose() {
        if (this.scene) {
            // Dispose of all objects
            this.objects.forEach(obj => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach(mat => mat.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
            });
            
            // Dispose animation mixers
            this.animationMixers.forEach(mixer => {
                mixer.stopAllAction();
            });
            
            // Clear arrays
            this.objects = [];
            this.animationMixers = [];
            
            console.log('Scene 2 disposed');
            this.scene = null;
            this.isInitialized = false;
        }
    }
}
