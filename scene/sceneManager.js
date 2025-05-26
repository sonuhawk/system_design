/**
 * Scene Manager
 * Manages multiple scenes and transitions between them
 */

class SceneManager {
    constructor() {
        this.scenes = {};
        this.currentSceneName = null;
        this.isInitialized = false;
        this.cameraManager = null;
        this.lightsManager = null;
        this.modelLoader = null;
    }
    
    /**
     * Initialize the scene manager
     * @param {CameraManager} cameraManager - Camera manager instance
     * @param {LightsManager} lightsManager - Lights manager instance
     * @param {ModelLoader} modelLoader - Model loader instance
     */
    async init(cameraManager, lightsManager, modelLoader) {
        try {
            console.log('Initializing Scene Manager...');
            
            this.cameraManager = cameraManager;
            this.lightsManager = lightsManager;
            this.modelLoader = modelLoader;
            
            // Initialize all scenes
            await this.initializeScenes();
            
            // Set default scene
            await this.switchScene('scene1');
            
            console.log('Scene Manager initialized successfully');
            this.isInitialized = true;
            
        } catch (error) {
            console.error('Failed to initialize Scene Manager:', error);
            throw error;
        }
    }
    
    /**
     * Initialize all available scenes
     */
    async initializeScenes() {
        try {
            // Initialize Scene 1
            console.log('Initializing Scene 1...');
            this.scenes.scene1 = new Scene1();
            await this.scenes.scene1.init(
                this.cameraManager,
                this.lightsManager,
                this.modelLoader
            );
            
            // Initialize Scene 2
            console.log('Initializing Scene 2...');
            this.scenes.scene2 = new Scene2();
            await this.scenes.scene2.init(
                this.cameraManager,
                this.lightsManager,
                this.modelLoader
            );
            
            console.log('All scenes initialized');
            
        } catch (error) {
            console.error('Failed to initialize scenes:', error);
            throw error;
        }
    }
    
    /**
     * Switch to a different scene
     * @param {string} sceneName - Name of the scene to switch to
     */
    async switchScene(sceneName) {
        try {
            if (!this.scenes[sceneName]) {
                throw new Error(`Scene '${sceneName}' not found`);
            }
            
            if (this.currentSceneName === sceneName) {
                console.log(`Already in scene '${sceneName}'`);
                return;
            }
            
            console.log(`Switching to scene '${sceneName}'...`);
            
            // Perform transition
            await this.performSceneTransition(sceneName);
            
            this.currentSceneName = sceneName;
            
            console.log(`Successfully switched to scene '${sceneName}'`);
            
        } catch (error) {
            console.error(`Failed to switch to scene '${sceneName}':`, error);
            throw error;
        }
    }
    
    /**
     * Perform scene transition with optional effects
     * @param {string} newSceneName - Name of the new scene
     */
    async performSceneTransition(newSceneName) {
        // For now, we'll do an instant transition
        // In the future, we could add fade effects, camera movements, etc.
        
        const currentScene = this.getCurrentScene();
        const newScene = this.scenes[newSceneName].getScene();
        
        if (!newScene) {
            throw new Error(`Scene '${newSceneName}' not properly initialized`);
        }
        
        // Optional: Apply specific camera settings for different scenes
        this.applyCameraSettings(newSceneName);
        
        // Optional: Apply specific lighting settings
        this.applyLightingSettings(newSceneName);
        
        console.log(`Scene transition to '${newSceneName}' completed`);
    }
    
    /**
     * Apply camera settings for specific scenes
     * @param {string} sceneName - Name of the scene
     */
    applyCameraSettings(sceneName) {
        if (!this.cameraManager) return;
        
        switch (sceneName) {
            case 'scene1':
                // Default camera position for scene 1
                this.cameraManager.setPosition(0, 5, 10);
                this.cameraManager.setTarget(0, 0, 0);
                break;
                
            case 'scene2':
                // Different camera position for scene 2
                this.cameraManager.setPosition(5, 8, 15);
                this.cameraManager.setTarget(0, 2, 0);
                break;
                
            default:
                console.log(`No specific camera settings for scene '${sceneName}'`);
        }
    }
    
    /**
     * Apply lighting settings for specific scenes
     * @param {string} sceneName - Name of the scene
     */
    applyLightingSettings(sceneName) {
        if (!this.lightsManager) return;
        
        switch (sceneName) {
            case 'scene1':
                // Daylight preset for scene 1
                this.lightsManager.applyPreset('daylight');
                break;
                
            case 'scene2':
                // Night preset for scene 2
                this.lightsManager.applyPreset('night');
                break;
                
            default:
                console.log(`No specific lighting settings for scene '${sceneName}'`);
        }
    }
    
    /**
     * Get the current active scene
     * @returns {THREE.Scene|null}
     */
    getCurrentScene() {
        if (!this.currentSceneName || !this.scenes[this.currentSceneName]) {
            return null;
        }
        
        return this.scenes[this.currentSceneName].getScene();
    }
    
    /**
     * Get the current scene name
     * @returns {string|null}
     */
    getCurrentSceneName() {
        return this.currentSceneName;
    }
    
    /**
     * Get model count for current scene
     * @returns {number}
     */
    getCurrentSceneModelCount() {
        if (!this.currentSceneName || !this.scenes[this.currentSceneName]) {
            return 0;
        }
        
        return this.scenes[this.currentSceneName].getModelCount();
    }
    
    /**
     * Load a model into the current scene
     * @param {string} modelType - Type of model to load
     */
    async loadModelIntoCurrentScene(modelType) {
        try {
            if (!this.currentSceneName || !this.scenes[this.currentSceneName]) {
                throw new Error('No active scene to load model into');
            }
            
            console.log(`Loading model '${modelType}' into current scene '${this.currentSceneName}'...`);
            
            await this.scenes[this.currentSceneName].loadModel(this.modelLoader, modelType);
            
            console.log(`Model '${modelType}' loaded successfully into '${this.currentSceneName}'`);
            
        } catch (error) {
            console.error(`Failed to load model '${modelType}' into current scene:`, error);
            throw error;
        }
    }
    
    /**
     * Remove a model from the current scene
     * @param {string} modelType - Type of model to remove
     */
    removeModelFromCurrentScene(modelType) {
        if (!this.currentSceneName || !this.scenes[this.currentSceneName]) {
            console.warn('No active scene to remove model from');
            return;
        }
        
        this.scenes[this.currentSceneName].removeModel(modelType);
    }
    
    /**
     * Clear all models from the current scene
     */
    clearCurrentSceneModels() {
        if (!this.currentSceneName || !this.scenes[this.currentSceneName]) {
            console.warn('No active scene to clear models from');
            return;
        }
        
        this.scenes[this.currentSceneName].clearModels();
    }
    
    /**
     * Update the current scene (called every frame)
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
        if (!this.isInitialized || !this.currentSceneName) return;
        
        const currentScene = this.scenes[this.currentSceneName];
        if (currentScene && typeof currentScene.update === 'function') {
            currentScene.update(deltaTime);
        }
    }
    
    /**
     * Get all available scene names
     * @returns {string[]}
     */
    getAvailableScenes() {
        return Object.keys(this.scenes);
    }
    
    /**
     * Check if a scene exists
     * @param {string} sceneName - Name of the scene to check
     * @returns {boolean}
     */
    hasScene(sceneName) {
        return this.scenes.hasOwnProperty(sceneName);
    }
    
    /**
     * Get scene information
     * @param {string} sceneName - Name of the scene (optional, defaults to current)
     * @returns {Object|null}
     */
    getSceneInfo(sceneName = null) {
        const targetSceneName = sceneName || this.currentSceneName;
        
        if (!targetSceneName || !this.scenes[targetSceneName]) {
            return null;
        }
        
        const scene = this.scenes[targetSceneName];
        
        return {
            name: targetSceneName,
            isActive: targetSceneName === this.currentSceneName,
            modelCount: scene.getModelCount ? scene.getModelCount() : 0,
            isInitialized: scene.isInitialized || false
        };
    }
    
    /**
     * Get information about all scenes
     * @returns {Object}
     */
    getAllScenesInfo() {
        const info = {};
        
        Object.keys(this.scenes).forEach(sceneName => {
            info[sceneName] = this.getSceneInfo(sceneName);
        });
        
        return info;
    }
    
    /**
     * Add a new scene dynamically
     * @param {string} sceneName - Name of the new scene
     * @param {Object} sceneClass - Scene class instance
     */
    async addScene(sceneName, sceneClass) {
        try {
            if (this.scenes[sceneName]) {
                console.warn(`Scene '${sceneName}' already exists, replacing...`);
                await this.removeScene(sceneName);
            }
            
            console.log(`Adding scene '${sceneName}'...`);
            
            this.scenes[sceneName] = sceneClass;
            
            // Initialize the scene if managers are available
            if (this.cameraManager && this.lightsManager && this.modelLoader) {
                await sceneClass.init(this.cameraManager, this.lightsManager, this.modelLoader);
            }
            
            console.log(`Scene '${sceneName}' added successfully`);
            
        } catch (error) {
            console.error(`Failed to add scene '${sceneName}':`, error);
            throw error;
        }
    }
    
    /**
     * Remove a scene
     * @param {string} sceneName - Name of the scene to remove
     */
    async removeScene(sceneName) {
        if (!this.scenes[sceneName]) {
            console.warn(`Scene '${sceneName}' not found`);
            return;
        }
        
        // Can't remove the current active scene
        if (this.currentSceneName === sceneName) {
            throw new Error(`Cannot remove active scene '${sceneName}'`);
        }
        
        console.log(`Removing scene '${sceneName}'...`);
        
        // Dispose of scene resources
        const scene = this.scenes[sceneName];
        if (scene && typeof scene.dispose === 'function') {
            scene.dispose();
        }
        
        delete this.scenes[sceneName];
        
        console.log(`Scene '${sceneName}' removed successfully`);
    }
    
    /**
     * Preload a scene for faster switching
     * @param {string} sceneName - Name of the scene to preload
     */
    async preloadScene(sceneName) {
        if (!this.scenes[sceneName]) {
            console.warn(`Scene '${sceneName}' not found for preloading`);
            return;
        }
        
        const scene = this.scenes[sceneName];
        
        // If scene has a preload method, call it
        if (typeof scene.preload === 'function') {
            console.log(`Preloading scene '${sceneName}'...`);
            await scene.preload();
            console.log(`Scene '${sceneName}' preloaded`);
        }
    }
    
    /**
     * Dispose of all scenes and cleanup
     */
    dispose() {
        console.log('Disposing Scene Manager...');
        
        // Dispose of all scenes
        Object.keys(this.scenes).forEach(sceneName => {
            const scene = this.scenes[sceneName];
            if (scene && typeof scene.dispose === 'function') {
                scene.dispose();
            }
        });
        
        // Clear references
        this.scenes = {};
        this.currentSceneName = null;
        this.cameraManager = null;
        this.lightsManager = null;
        this.modelLoader = null;
        this.isInitialized = false;
        
        console.log('Scene Manager disposed');
    }
}
