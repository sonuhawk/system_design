/**
 * Scene 1 - Default demonstration scene
 * Contains basic geometry and sample objects
 */

class Scene1 {
    constructor() {
        this.scene = null;
        this.objects = [];
        this.isInitialized = false;
    }
    
    /**
     * Initialize Scene 1
     * @param {CameraManager} cameraManager - Camera manager instance
     * @param {LightsManager} lightsManager - Lights manager instance
     * @param {ModelLoader} modelLoader - Model loader instance
     */
    async init(cameraManager, lightsManager, modelLoader) {
        try {
            console.log('Initializing Scene 1...');
            
            // Create the scene
            this.scene = new THREE.Scene();
            this.scene.name = 'Scene1';
            
            // Set background
            this.setupBackground();
            
            // Add lights to scene
            if (lightsManager) {
                lightsManager.addToScene(this.scene);
            }
            
            // Create ground plane
            this.createGround();
            
            // Add sample geometry
            this.createSampleGeometry();
            
            // Add coordinate axes helper
            this.addAxesHelper();
            
            // Add grid helper
            this.addGridHelper();
            
            console.log('Scene 1 initialized successfully');
            this.isInitialized = true;
            
        } catch (error) {
            console.error('Failed to initialize Scene 1:', error);
            throw error;
        }
    }
    
    /**
     * Setup scene background
     */
    setupBackground() {
        // Create gradient background
        this.scene.background = new THREE.Color(0x87ceeb); // Sky blue
        
        // Alternative: Create a skybox with gradient
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        
        const context = canvas.getContext('2d');
        const gradient = context.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#87ceeb'); // Light blue
        gradient.addColorStop(1, '#ffffff'); // White
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 512, 512);
        
        const texture = new THREE.CanvasTexture(canvas);
        this.scene.background = texture;
        
        console.log('Scene 1 background setup complete');
    }
    
    /**
     * Create ground plane
     */
    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x90EE90,
            side: THREE.DoubleSide 
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        ground.position.y = 0;
        ground.receiveShadow = true;
        ground.name = 'Ground';
        
        this.scene.add(ground);
        this.objects.push(ground);
        
        console.log('Ground plane created');
    }
    
    /**
     * Create sample geometry objects
     */
    createSampleGeometry() {
        // Create a cube
        const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
        const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-3, 1, 0);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.name = 'Cube';
        
        this.scene.add(cube);
        this.objects.push(cube);
        
        // Create a sphere
        const sphereGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x4ecdc4 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 1.2, 0);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        sphere.name = 'Sphere';
        
        this.scene.add(sphere);
        this.objects.push(sphere);
        
        // Create a cylinder
        const cylinderGeometry = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
        const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xffe66d });
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.position.set(3, 1.5, 0);
        cylinder.castShadow = true;
        cylinder.receiveShadow = true;
        cylinder.name = 'Cylinder';
        
        this.scene.add(cylinder);
        this.objects.push(cylinder);
        
        // Create a torus
        const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
        const torusMaterial = new THREE.MeshPhongMaterial({ color: 0xf06292 });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.position.set(0, 2, -3);
        torus.castShadow = true;
        torus.receiveShadow = true;
        torus.name = 'Torus';
        
        this.scene.add(torus);
        this.objects.push(torus);
        
        // Create a cone
        const coneGeometry = new THREE.ConeGeometry(1, 2.5, 32);
        const coneMaterial = new THREE.MeshPhongMaterial({ color: 0x9c88ff });
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.position.set(-3, 1.25, -3);
        cone.castShadow = true;
        cone.receiveShadow = true;
        cone.name = 'Cone';
        
        this.scene.add(cone);
        this.objects.push(cone);
        
        console.log('Sample geometry created');
    }
    
    /**
     * Add coordinate axes helper
     */
    addAxesHelper() {
        const axesHelper = new THREE.AxesHelper(5);
        axesHelper.name = 'AxesHelper';
        this.scene.add(axesHelper);
        
        console.log('Axes helper added');
    }
    
    /**
     * Add grid helper
     */
    addGridHelper() {
        const gridHelper = new THREE.GridHelper(50, 50, 0x888888, 0xcccccc);
        gridHelper.name = 'GridHelper';
        this.scene.add(gridHelper);
        
        console.log('Grid helper added');
    }
    
    /**
     * Load a 3D model into the scene
     * @param {ModelLoader} modelLoader - Model loader instance
     * @param {string} modelType - Type of model to load
     */
    async loadModel(modelLoader, modelType) {
        try {
            console.log(`Loading model '${modelType}' into Scene 1...`);
            
            let model;
            
            // Create different models based on type
            switch (modelType) {
                case 'cube':
                    model = this.createStyledCube();
                    break;
                case 'sphere':
                    model = this.createStyledSphere();
                    break;
                default:
                    console.warn(`Unknown model type: ${modelType}`);
                    return;
            }
            
            if (model) {
                // Position the model
                const existingObjects = this.objects.filter(obj => obj.userData.isLoadedModel);
                const xOffset = existingObjects.length * 3;
                model.position.set(xOffset, 0, 3);
                
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
     * Create a styled cube model
     * @returns {THREE.Mesh}
     */
    createStyledCube() {
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0xff4757,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });
        
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.name = 'LoadedCube';
        
        return cube;
    }
    
    /**
     * Create a styled sphere model
     * @returns {THREE.Mesh}
     */
    createStyledSphere() {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x5352ed,
            shininess: 100,
            wireframe: false
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        sphere.name = 'LoadedSphere';
        
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
    }
    
    /**
     * Animate scene objects
     * @param {number} deltaTime - Time since last frame
     */
    animateObjects(deltaTime) {
        const time = Date.now() * 0.001;
        
        // Find and animate specific objects
        const cube = this.scene.getObjectByName('Cube');
        if (cube) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        }
        
        const sphere = this.scene.getObjectByName('Sphere');
        if (sphere) {
            sphere.position.y = 1.2 + Math.sin(time * 2) * 0.3;
        }
        
        const torus = this.scene.getObjectByName('Torus');
        if (torus) {
            torus.rotation.x += 0.02;
            torus.rotation.y += 0.01;
        }
        
        const cylinder = this.scene.getObjectByName('Cylinder');
        if (cylinder) {
            cylinder.rotation.y += 0.015;
        }
        
        const cone = this.scene.getObjectByName('Cone');
        if (cone) {
            cone.rotation.z = Math.sin(time) * 0.1;
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
            
            console.log(`Model '${modelType}' removed from Scene 1`);
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
        
        console.log('All loaded models cleared from Scene 1');
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
            
            // Clear arrays
            this.objects = [];
            
            console.log('Scene 1 disposed');
            this.scene = null;
            this.isInitialized = false;
        }
    }
}
