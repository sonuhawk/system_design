/**
 * Model Loader
 * Handles loading of 3D models using GLTFLoader and other loaders
 */

class ModelLoader {
    constructor() {
        this.gltfLoader = null;
        this.textureLoader = null;
        this.loadingManager = null;
        this.loadedModels = new Map();
        this.isInitialized = false;
    }
    
    /**
     * Initialize the model loader
     */
    init() {
        try {
            console.log('Initializing Model Loader...');
            
            // Create loading manager
            this.loadingManager = new THREE.LoadingManager();
            this.setupLoadingManager();
            
            // Create GLTF loader
            this.gltfLoader = new THREE.GLTFLoader(this.loadingManager);
            
            // Create texture loader
            this.textureLoader = new THREE.TextureLoader(this.loadingManager);
            
            console.log('Model Loader initialized successfully');
            this.isInitialized = true;
            
        } catch (error) {
            console.error('Failed to initialize Model Loader:', error);
            throw new Error('Model Loader initialization failed');
        }
    }
    
    /**
     * Setup loading manager event handlers
     */
    setupLoadingManager() {
        if (!this.loadingManager) return;
        
        this.loadingManager.onLoad = () => {
            console.log('All resources loaded successfully');
        };
        
        this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal * 100).toFixed(1);
            console.log(`Loading progress: ${progress}% (${itemsLoaded}/${itemsTotal}) - ${url}`);
        };
        
        this.loadingManager.onError = (url) => {
            console.error(`Failed to load resource: ${url}`);
        };
    }
    
    /**
     * Load a GLTF/GLB model
     * @param {string} url - URL or path to the model file
     * @param {Object} options - Loading options
     * @returns {Promise<THREE.Group>}
     */
    async loadGLTF(url, options = {}) {
        if (!this.gltfLoader) {
            throw new Error('Model Loader not initialized');
        }
        
        return new Promise((resolve, reject) => {
            console.log(`Loading GLTF model: ${url}`);
            
            this.gltfLoader.load(
                url,
                (gltf) => {
                    console.log(`GLTF model loaded successfully: ${url}`);
                    
                    // Process the loaded model
                    const model = this.processGLTFModel(gltf, options);
                    
                    // Cache the model if specified
                    if (options.cache !== false) {
                        this.loadedModels.set(url, model);
                    }
                    
                    resolve(model);
                },
                (progress) => {
                    if (options.onProgress) {
                        options.onProgress(progress);
                    }
                },
                (error) => {
                    console.error(`Failed to load GLTF model: ${url}`, error);
                    reject(new Error(`Failed to load model: ${error.message}`));
                }
            );
        });
    }
    
    /**
     * Process a loaded GLTF model
     * @param {Object} gltf - Loaded GLTF object
     * @param {Object} options - Processing options
     * @returns {THREE.Group}
     */
    processGLTFModel(gltf, options = {}) {
        const model = gltf.scene;
        
        // Set default scale
        const scale = options.scale || 1;
        model.scale.setScalar(scale);
        
        // Set default position
        if (options.position) {
            model.position.copy(options.position);
        }
        
        // Set default rotation
        if (options.rotation) {
            model.rotation.copy(options.rotation);
        }
        
        // Enable shadows
        if (options.castShadow !== false) {
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }
        
        // Setup animations if present
        if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(model);
            
            gltf.animations.forEach((clip) => {
                const action = mixer.clipAction(clip);
                if (options.autoPlay !== false) {
                    action.play();
                }
            });
            
            model.userData.mixer = mixer;
            model.userData.animations = gltf.animations;
        }
        
        // Add metadata
        model.userData.isLoadedModel = true;
        model.userData.source = 'gltf';
        model.userData.originalGLTF = gltf;
        
        console.log('GLTF model processed successfully');
        return model;
    }
    
    /**
     * Load a texture
     * @param {string} url - URL or path to the texture file
     * @param {Object} options - Loading options
     * @returns {Promise<THREE.Texture>}
     */
    async loadTexture(url, options = {}) {
        if (!this.textureLoader) {
            throw new Error('Model Loader not initialized');
        }
        
        return new Promise((resolve, reject) => {
            console.log(`Loading texture: ${url}`);
            
            this.textureLoader.load(
                url,
                (texture) => {
                    console.log(`Texture loaded successfully: ${url}`);
                    
                    // Apply texture settings
                    this.configureTexture(texture, options);
                    
                    resolve(texture);
                },
                (progress) => {
                    if (options.onProgress) {
                        options.onProgress(progress);
                    }
                },
                (error) => {
                    console.error(`Failed to load texture: ${url}`, error);
                    reject(new Error(`Failed to load texture: ${error.message}`));
                }
            );
        });
    }
    
    /**
     * Configure texture settings
     * @param {THREE.Texture} texture - Texture to configure
     * @param {Object} options - Configuration options
     */
    configureTexture(texture, options = {}) {
        // Set wrapping
        texture.wrapS = options.wrapS || THREE.RepeatWrapping;
        texture.wrapT = options.wrapT || THREE.RepeatWrapping;
        
        // Set filtering
        texture.magFilter = options.magFilter || THREE.LinearFilter;
        texture.minFilter = options.minFilter || THREE.LinearMipmapLinearFilter;
        
        // Set repeat
        if (options.repeat) {
            texture.repeat.copy(options.repeat);
        }
        
        // Set offset
        if (options.offset) {
            texture.offset.copy(options.offset);
        }
        
        // Generate mipmaps if needed
        if (options.generateMipmaps !== false) {
            texture.generateMipmaps = true;
        }
        
        console.log('Texture configured');
    }
    
    /**
     * Create a procedural model
     * @param {string} type - Type of model to create
     * @param {Object} options - Creation options
     * @returns {THREE.Mesh|THREE.Group}
     */
    createProceduralModel(type, options = {}) {
        console.log(`Creating procedural model: ${type}`);
        
        let geometry, material, model;
        
        switch (type.toLowerCase()) {
            case 'cube':
            case 'box':
                geometry = new THREE.BoxGeometry(
                    options.width || 1,
                    options.height || 1,
                    options.depth || 1
                );
                break;
                
            case 'sphere':
                geometry = new THREE.SphereGeometry(
                    options.radius || 1,
                    options.widthSegments || 32,
                    options.heightSegments || 32
                );
                break;
                
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(
                    options.radiusTop || 1,
                    options.radiusBottom || 1,
                    options.height || 1,
                    options.radialSegments || 32
                );
                break;
                
            case 'plane':
                geometry = new THREE.PlaneGeometry(
                    options.width || 1,
                    options.height || 1
                );
                break;
                
            case 'cone':
                geometry = new THREE.ConeGeometry(
                    options.radius || 1,
                    options.height || 1,
                    options.radialSegments || 32
                );
                break;
                
            case 'torus':
                geometry = new THREE.TorusGeometry(
                    options.radius || 1,
                    options.tube || 0.4,
                    options.radialSegments || 16,
                    options.tubularSegments || 100
                );
                break;
                
            default:
                console.warn(`Unknown procedural model type: ${type}`);
                return null;
        }
        
        // Create material
        material = this.createMaterial(options.material || {});
        
        // Create mesh
        model = new THREE.Mesh(geometry, material);
        
        // Apply transformations
        if (options.position) {
            model.position.copy(options.position);
        }
        
        if (options.rotation) {
            model.rotation.copy(options.rotation);
        }
        
        if (options.scale) {
            if (typeof options.scale === 'number') {
                model.scale.setScalar(options.scale);
            } else {
                model.scale.copy(options.scale);
            }
        }
        
        // Enable shadows
        model.castShadow = options.castShadow !== false;
        model.receiveShadow = options.receiveShadow !== false;
        
        // Add metadata
        model.userData.isLoadedModel = true;
        model.userData.source = 'procedural';
        model.userData.type = type;
        
        model.name = options.name || `Procedural${type.charAt(0).toUpperCase() + type.slice(1)}`;
        
        console.log(`Procedural model '${type}' created successfully`);
        return model;
    }
    
    /**
     * Create a material based on options
     * @param {Object} options - Material options
     * @returns {THREE.Material}
     */
    createMaterial(options = {}) {
        const materialType = options.type || 'MeshPhongMaterial';
        let material;
        
        const commonOptions = {
            color: options.color || 0xffffff,
            transparent: options.transparent || false,
            opacity: options.opacity || 1.0,
            side: options.side || THREE.FrontSide
        };
        
        switch (materialType) {
            case 'MeshBasicMaterial':
                material = new THREE.MeshBasicMaterial(commonOptions);
                break;
                
            case 'MeshLambertMaterial':
                material = new THREE.MeshLambertMaterial(commonOptions);
                break;
                
            case 'MeshPhongMaterial':
                material = new THREE.MeshPhongMaterial({
                    ...commonOptions,
                    shininess: options.shininess || 30,
                    specular: options.specular || 0x111111
                });
                break;
                
            case 'MeshStandardMaterial':
                material = new THREE.MeshStandardMaterial({
                    ...commonOptions,
                    metalness: options.metalness || 0.0,
                    roughness: options.roughness || 1.0
                });
                break;
                
            default:
                material = new THREE.MeshPhongMaterial(commonOptions);
                break;
        }
        
        // Apply texture if provided
        if (options.map) {
            material.map = options.map;
        }
        
        return material;
    }
    
    /**
     * Get a cached model
     * @param {string} url - URL of the cached model
     * @returns {THREE.Group|null}
     */
    getCachedModel(url) {
        return this.loadedModels.get(url) || null;
    }
    
    /**
     * Check if a model is cached
     * @param {string} url - URL to check
     * @returns {boolean}
     */
    isModelCached(url) {
        return this.loadedModels.has(url);
    }
    
    /**
     * Clear cached models
     * @param {string} url - Specific URL to clear (optional)
     */
    clearCache(url = null) {
        if (url) {
            this.loadedModels.delete(url);
            console.log(`Cached model cleared: ${url}`);
        } else {
            this.loadedModels.clear();
            console.log('All cached models cleared');
        }
    }
    
    /**
     * Clone a model
     * @param {THREE.Object3D} model - Model to clone
     * @param {Object} options - Cloning options
     * @returns {THREE.Object3D}
     */
    cloneModel(model, options = {}) {
        const clone = model.clone();
        
        // Deep clone materials if specified
        if (options.cloneMaterials !== false) {
            clone.traverse((child) => {
                if (child.isMesh && child.material) {
                    if (Array.isArray(child.material)) {
                        child.material = child.material.map(mat => mat.clone());
                    } else {
                        child.material = child.material.clone();
                    }
                }
            });
        }
        
        // Apply new transformations
        if (options.position) {
            clone.position.copy(options.position);
        }
        
        if (options.rotation) {
            clone.rotation.copy(options.rotation);
        }
        
        if (options.scale) {
            if (typeof options.scale === 'number') {
                clone.scale.setScalar(options.scale);
            } else {
                clone.scale.copy(options.scale);
            }
        }
        
        console.log('Model cloned successfully');
        return clone;
    }
    
    /**
     * Get loading statistics
     * @returns {Object}
     */
    getStats() {
        return {
            cachedModels: this.loadedModels.size,
            isInitialized: this.isInitialized,
            hasGLTFLoader: !!this.gltfLoader,
            hasTextureLoader: !!this.textureLoader
        };
    }
    
    /**
     * Dispose of all resources
     */
    dispose() {
        console.log('Disposing Model Loader...');
        
        // Clear cached models
        this.clearCache();
        
        // Reset loaders
        this.gltfLoader = null;
        this.textureLoader = null;
        this.loadingManager = null;
        this.isInitialized = false;
        
        console.log('Model Loader disposed');
    }
}
