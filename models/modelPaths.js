/**
 * Model Paths Configuration
 * Defines paths and configurations for 3D models and assets
 */

class ModelPaths {
    constructor() {
        this.basePath = './assets/';
        this.modelsPaths = this.initializeModelPaths();
        this.texturePaths = this.initializeTexturePaths();
        this.fallbackModels = this.initializeFallbackModels();
    }
    
    /**
     * Initialize model file paths
     * @returns {Object}
     */
    initializeModelPaths() {
        return {
            // Sample GLTF/GLB models
            cube: {
                path: 'models/cube.glb',
                format: 'glb',
                scale: 1.0,
                description: 'Simple cube model'
            },
            sphere: {
                path: 'models/sphere.glb',
                format: 'glb',
                scale: 1.0,
                description: 'Simple sphere model'
            },
            character: {
                path: 'models/character.glb',
                format: 'glb',
                scale: 1.0,
                animated: true,
                description: 'Animated character model'
            },
            building: {
                path: 'models/building.glb',
                format: 'glb',
                scale: 2.0,
                description: 'Architectural building model'
            },
            vehicle: {
                path: 'models/vehicle.glb',
                format: 'glb',
                scale: 1.5,
                description: 'Vehicle model'
            },
            tree: {
                path: 'models/tree.glb',
                format: 'glb',
                scale: 1.0,
                description: 'Tree model for environments'
            },
            furniture: {
                path: 'models/furniture.glb',
                format: 'glb',
                scale: 1.0,
                description: 'Furniture model'
            },
            weapon: {
                path: 'models/weapon.glb',
                format: 'glb',
                scale: 1.0,
                description: 'Weapon model'
            },
            tool: {
                path: 'models/tool.glb',
                format: 'glb',
                scale: 1.0,
                description: 'Tool model'
            },
            robot: {
                path: 'models/robot.glb',
                format: 'glb',
                scale: 1.0,
                animated: true,
                description: 'Animated robot model'
            }
        };
    }
    
    /**
     * Initialize texture file paths
     * @returns {Object}
     */
    initializeTexturePaths() {
        return {
            // Material textures
            metal: {
                diffuse: 'textures/metal_diffuse.jpg',
                normal: 'textures/metal_normal.jpg',
                roughness: 'textures/metal_roughness.jpg',
                metallic: 'textures/metal_metallic.jpg'
            },
            wood: {
                diffuse: 'textures/wood_diffuse.jpg',
                normal: 'textures/wood_normal.jpg',
                roughness: 'textures/wood_roughness.jpg'
            },
            stone: {
                diffuse: 'textures/stone_diffuse.jpg',
                normal: 'textures/stone_normal.jpg',
                roughness: 'textures/stone_roughness.jpg'
            },
            fabric: {
                diffuse: 'textures/fabric_diffuse.jpg',
                normal: 'textures/fabric_normal.jpg'
            },
            concrete: {
                diffuse: 'textures/concrete_diffuse.jpg',
                normal: 'textures/concrete_normal.jpg',
                roughness: 'textures/concrete_roughness.jpg'
            },
            grass: {
                diffuse: 'textures/grass_diffuse.jpg',
                normal: 'textures/grass_normal.jpg'
            },
            water: {
                diffuse: 'textures/water_diffuse.jpg',
                normal: 'textures/water_normal.jpg'
            },
            sky: {
                diffuse: 'textures/sky_diffuse.jpg'
            },
            // Environment maps
            skybox: {
                path: 'textures/skybox/',
                format: 'jpg',
                faces: ['px', 'nx', 'py', 'ny', 'pz', 'nz']
            },
            hdri: {
                environment: 'textures/hdri/environment.hdr'
            }
        };
    }
    
    /**
     * Initialize fallback models (procedural generation)
     * @returns {Object}
     */
    initializeFallbackModels() {
        return {
            cube: {
                type: 'procedural',
                geometry: 'BoxGeometry',
                params: [1, 1, 1],
                material: {
                    type: 'MeshPhongMaterial',
                    color: 0xff6b6b
                }
            },
            sphere: {
                type: 'procedural',
                geometry: 'SphereGeometry',
                params: [1, 32, 32],
                material: {
                    type: 'MeshPhongMaterial',
                    color: 0x4ecdc4
                }
            },
            cylinder: {
                type: 'procedural',
                geometry: 'CylinderGeometry',
                params: [1, 1, 2, 32],
                material: {
                    type: 'MeshPhongMaterial',
                    color: 0xffe66d
                }
            },
            plane: {
                type: 'procedural',
                geometry: 'PlaneGeometry',
                params: [2, 2],
                material: {
                    type: 'MeshPhongMaterial',
                    color: 0x90EE90,
                    side: 'DoubleSide'
                }
            }
        };
    }
    
    /**
     * Get the full path for a model
     * @param {string} modelName - Name of the model
     * @returns {string|null}
     */
    getModelPath(modelName) {
        const modelConfig = this.modelsPaths[modelName];
        if (!modelConfig) {
            console.warn(`Model '${modelName}' not found in paths configuration`);
            return null;
        }
        
        return this.basePath + modelConfig.path;
    }
    
    /**
     * Get model configuration
     * @param {string} modelName - Name of the model
     * @returns {Object|null}
     */
    getModelConfig(modelName) {
        return this.modelsPaths[modelName] || null;
    }
    
    /**
     * Get texture path
     * @param {string} textureName - Name of the texture
     * @param {string} type - Type of texture (diffuse, normal, etc.)
     * @returns {string|null}
     */
    getTexturePath(textureName, type = 'diffuse') {
        const textureConfig = this.texturePaths[textureName];
        if (!textureConfig) {
            console.warn(`Texture '${textureName}' not found in paths configuration`);
            return null;
        }
        
        const texturePath = textureConfig[type];
        if (!texturePath) {
            console.warn(`Texture type '${type}' not found for '${textureName}'`);
            return null;
        }
        
        return this.basePath + texturePath;
    }
    
    /**
     * Get all texture paths for a material
     * @param {string} materialName - Name of the material
     * @returns {Object|null}
     */
    getMaterialTextures(materialName) {
        const textureConfig = this.texturePaths[materialName];
        if (!textureConfig) {
            return null;
        }
        
        const textures = {};
        Object.keys(textureConfig).forEach(type => {
            if (type !== 'path' && type !== 'format' && type !== 'faces') {
                textures[type] = this.basePath + textureConfig[type];
            }
        });
        
        return textures;
    }
    
    /**
     * Get fallback model configuration
     * @param {string} modelName - Name of the model
     * @returns {Object|null}
     */
    getFallbackModel(modelName) {
        return this.fallbackModels[modelName] || null;
    }
    
    /**
     * Get all available model names
     * @returns {string[]}
     */
    getAvailableModels() {
        return Object.keys(this.modelsPaths);
    }
    
    /**
     * Get all available texture names
     * @returns {string[]}
     */
    getAvailableTextures() {
        return Object.keys(this.texturePaths);
    }
    
    /**
     * Check if a model exists in configuration
     * @param {string} modelName - Name of the model
     * @returns {boolean}
     */
    hasModel(modelName) {
        return this.modelsPaths.hasOwnProperty(modelName);
    }
    
    /**
     * Check if a texture exists in configuration
     * @param {string} textureName - Name of the texture
     * @returns {boolean}
     */
    hasTexture(textureName) {
        return this.texturePaths.hasOwnProperty(textureName);
    }
    
    /**
     * Add a new model path
     * @param {string} modelName - Name of the model
     * @param {Object} config - Model configuration
     */
    addModelPath(modelName, config) {
        this.modelsPaths[modelName] = {
            path: config.path,
            format: config.format || 'glb',
            scale: config.scale || 1.0,
            animated: config.animated || false,
            description: config.description || ''
        };
        
        console.log(`Model path added: ${modelName}`);
    }
    
    /**
     * Add a new texture path
     * @param {string} textureName - Name of the texture
     * @param {Object} config - Texture configuration
     */
    addTexturePath(textureName, config) {
        this.texturePaths[textureName] = config;
        console.log(`Texture path added: ${textureName}`);
    }
    
    /**
     * Remove a model path
     * @param {string} modelName - Name of the model to remove
     */
    removeModelPath(modelName) {
        if (this.modelsPaths[modelName]) {
            delete this.modelsPaths[modelName];
            console.log(`Model path removed: ${modelName}`);
        }
    }
    
    /**
     * Remove a texture path
     * @param {string} textureName - Name of the texture to remove
     */
    removeTexturePath(textureName) {
        if (this.texturePaths[textureName]) {
            delete this.texturePaths[textureName];
            console.log(`Texture path removed: ${textureName}`);
        }
    }
    
    /**
     * Set base path for assets
     * @param {string} basePath - New base path
     */
    setBasePath(basePath) {
        this.basePath = basePath.endsWith('/') ? basePath : basePath + '/';
        console.log(`Base path set to: ${this.basePath}`);
    }
    
    /**
     * Get the current base path
     * @returns {string}
     */
    getBasePath() {
        return this.basePath;
    }
    
    /**
     * Validate model configuration
     * @param {Object} config - Model configuration to validate
     * @returns {boolean}
     */
    validateModelConfig(config) {
        if (!config || typeof config !== 'object') {
            return false;
        }
        
        // Required fields
        if (!config.path || typeof config.path !== 'string') {
            return false;
        }
        
        // Optional fields validation
        if (config.format && !['glb', 'gltf'].includes(config.format.toLowerCase())) {
            console.warn(`Unsupported model format: ${config.format}`);
        }
        
        if (config.scale && (typeof config.scale !== 'number' || config.scale <= 0)) {
            console.warn(`Invalid scale value: ${config.scale}`);
        }
        
        return true;
    }
    
    /**
     * Get model loading options based on configuration
     * @param {string} modelName - Name of the model
     * @returns {Object}
     */
    getLoadingOptions(modelName) {
        const config = this.getModelConfig(modelName);
        if (!config) {
            return {};
        }
        
        return {
            scale: config.scale || 1.0,
            animated: config.animated || false,
            cache: true,
            castShadow: true,
            receiveShadow: true
        };
    }
    
    /**
     * Generate a complete asset manifest
     * @returns {Object}
     */
    generateManifest() {
        return {
            version: '1.0.0',
            basePath: this.basePath,
            models: {
                count: Object.keys(this.modelsPaths).length,
                items: this.modelsPaths
            },
            textures: {
                count: Object.keys(this.texturePaths).length,
                items: this.texturePaths
            },
            fallbacks: {
                count: Object.keys(this.fallbackModels).length,
                items: this.fallbackModels
            },
            generated: new Date().toISOString()
        };
    }
    
    /**
     * Export configuration as JSON
     * @returns {string}
     */
    exportConfig() {
        const config = {
            basePath: this.basePath,
            models: this.modelsPaths,
            textures: this.texturePaths,
            fallbacks: this.fallbackModels
        };
        
        return JSON.stringify(config, null, 2);
    }
    
    /**
     * Import configuration from JSON
     * @param {string} jsonConfig - JSON configuration string
     */
    importConfig(jsonConfig) {
        try {
            const config = JSON.parse(jsonConfig);
            
            if (config.basePath) {
                this.setBasePath(config.basePath);
            }
            
            if (config.models) {
                this.modelsPaths = { ...config.models };
            }
            
            if (config.textures) {
                this.texturePaths = { ...config.textures };
            }
            
            if (config.fallbacks) {
                this.fallbackModels = { ...config.fallbacks };
            }
            
            console.log('Configuration imported successfully');
            
        } catch (error) {
            console.error('Failed to import configuration:', error);
            throw new Error('Invalid configuration format');
        }
    }
}

// Create a global instance
const modelPaths = new ModelPaths();
