/**
 * Main application entry point
 * Initializes the Three.js application and manages the main game loop
 */

class ThreeJSApp {
    constructor() {
        this.isInitialized = false;
        this.isRunning = false;
        this.lastTime = 0;
        this.frameCount = 0;
        this.fpsUpdateTime = 0;
        
        // Core components
        this.renderer = null;
        this.camera = null;
        this.lights = null;
        this.controls = null;
        this.sceneManager = null;
        this.modelLoader = null;
        
        // UI elements
        this.loadingScreen = null;
        this.mainContainer = null;
        this.canvasContainer = null;
        this.fpsCounter = null;
        this.sceneInfo = null;
        this.modelCount = null;
        this.errorModal = null;
        this.errorMessage = null;
        
        // Bind methods
        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onSceneChange = this.onSceneChange.bind(this);
        this.onModelLoad = this.onModelLoad.bind(this);
        this.onResetCamera = this.onResetCamera.bind(this);
        this.showError = this.showError.bind(this);
        this.hideError = this.hideError.bind(this);
    }
    
    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('Initializing Three.js Application...');
            
            // Get UI elements
            this.getUIElements();
            
            // Initialize core components
            await this.initializeCore();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start the application
            this.start();
            
            console.log('Three.js Application initialized successfully');
            this.isInitialized = true;
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to initialize 3D application: ' + error.message);
        }
    }
    
    /**
     * Get references to UI elements
     */
    getUIElements() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.mainContainer = document.getElementById('main-container');
        this.canvasContainer = document.getElementById('canvas-container');
        this.fpsCounter = document.getElementById('fps-counter');
        this.sceneInfo = document.getElementById('scene-info');
        this.modelCount = document.getElementById('model-count');
        this.errorModal = document.getElementById('error-modal');
        this.errorMessage = document.getElementById('error-message');
        
        if (!this.loadingScreen || !this.mainContainer || !this.canvasContainer) {
            throw new Error('Required UI elements not found');
        }
    }
    
    /**
     * Initialize core Three.js components
     */
    async initializeCore() {
        // Initialize renderer
        this.renderer = new RendererManager();
        await this.renderer.init(this.canvasContainer);
        
        // Initialize camera
        this.camera = new CameraManager();
        this.camera.init();
        
        // Initialize lights
        this.lights = new LightsManager();
        this.lights.init();
        
        // Initialize controls
        this.controls = new OrbitControlsManager();
        this.controls.init(this.camera.getCamera(), this.renderer.getRenderer().domElement);
        
        // Initialize model loader
        this.modelLoader = new ModelLoader();
        
        // Initialize scene manager
        this.sceneManager = new SceneManager();
        await this.sceneManager.init(this.camera, this.lights, this.modelLoader);
        
        console.log('Core components initialized');
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', this.onWindowResize);
        
        // Scene change buttons
        const sceneButtons = document.querySelectorAll('.scene-btn');
        sceneButtons.forEach(button => {
            button.addEventListener('click', this.onSceneChange);
        });
        
        // Model loading
        const loadModelBtn = document.getElementById('load-model-btn');
        if (loadModelBtn) {
            loadModelBtn.addEventListener('click', this.onModelLoad);
        }
        
        // Reset camera
        const resetCameraBtn = document.getElementById('reset-camera-btn');
        if (resetCameraBtn) {
            resetCameraBtn.addEventListener('click', this.onResetCamera);
        }
        
        // Error modal close
        const closeErrorBtn = document.getElementById('close-error-btn');
        if (closeErrorBtn) {
            closeErrorBtn.addEventListener('click', this.hideError);
        }
        
        // Click outside modal to close
        if (this.errorModal) {
            this.errorModal.addEventListener('click', (event) => {
                if (event.target === this.errorModal) {
                    this.hideError();
                }
            });
        }
        
        console.log('Event listeners setup complete');
    }
    
    /**
     * Start the application
     */
    start() {
        // Hide loading screen
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
        }
        
        // Show main container
        if (this.mainContainer) {
            this.mainContainer.classList.remove('hidden');
        }
        
        // Start render loop
        this.isRunning = true;
        this.animate();
        
        console.log('Application started');
    }
    
    /**
     * Main animation loop
     */
    animate(currentTime = 0) {
        if (!this.isRunning) return;
        
        requestAnimationFrame(this.animate);
        
        // Calculate delta time
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Update FPS counter
        this.updateFPS(currentTime);
        
        // Update controls
        if (this.controls) {
            this.controls.update();
        }
        
        // Update scene manager
        if (this.sceneManager) {
            this.sceneManager.update(deltaTime);
        }
        
        // Render current scene
        if (this.renderer && this.sceneManager && this.camera) {
            const currentScene = this.sceneManager.getCurrentScene();
            if (currentScene) {
                this.renderer.render(currentScene, this.camera.getCamera());
            }
        }
    }
    
    /**
     * Update FPS counter
     */
    updateFPS(currentTime) {
        this.frameCount++;
        
        if (currentTime - this.fpsUpdateTime >= 1000) {
            const fps = Math.round((this.frameCount * 1000) / (currentTime - this.fpsUpdateTime));
            
            if (this.fpsCounter) {
                this.fpsCounter.textContent = `FPS: ${fps}`;
            }
            
            this.frameCount = 0;
            this.fpsUpdateTime = currentTime;
        }
    }
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        const width = this.canvasContainer.clientWidth;
        const height = this.canvasContainer.clientHeight;
        
        this.camera.updateAspectRatio(width / height);
        this.renderer.setSize(width, height);
        
        console.log(`Window resized: ${width}x${height}`);
    }
    
    /**
     * Handle scene change
     */
    async onSceneChange(event) {
        try {
            const sceneName = event.target.dataset.scene;
            
            if (!sceneName || !this.sceneManager) return;
            
            console.log(`Switching to scene: ${sceneName}`);
            
            // Update active button
            document.querySelectorAll('.scene-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Switch scene
            await this.sceneManager.switchScene(sceneName);
            
            // Update UI
            if (this.sceneInfo) {
                this.sceneInfo.textContent = `Scene: ${sceneName}`;
            }
            
            this.updateModelCount();
            
        } catch (error) {
            console.error('Failed to switch scene:', error);
            this.showError('Failed to switch scene: ' + error.message);
        }
    }
    
    /**
     * Handle model loading
     */
    async onModelLoad() {
        try {
            const modelSelector = document.getElementById('model-selector');
            const modelType = modelSelector?.value;
            
            if (!modelType || !this.sceneManager) return;
            
            console.log(`Loading model: ${modelType}`);
            
            // Load model into current scene
            await this.sceneManager.loadModelIntoCurrentScene(modelType);
            
            // Update UI
            this.updateModelCount();
            
            // Reset selector
            if (modelSelector) {
                modelSelector.value = '';
            }
            
        } catch (error) {
            console.error('Failed to load model:', error);
            this.showError('Failed to load model: ' + error.message);
        }
    }
    
    /**
     * Handle camera reset
     */
    onResetCamera() {
        if (this.controls) {
            this.controls.reset();
            console.log('Camera reset');
        }
    }
    
    /**
     * Update model count display
     */
    updateModelCount() {
        if (!this.sceneManager || !this.modelCount) return;
        
        const count = this.sceneManager.getCurrentSceneModelCount();
        this.modelCount.textContent = `Models: ${count}`;
    }
    
    /**
     * Show error modal
     */
    showError(message) {
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
        }
        
        if (this.errorModal) {
            this.errorModal.classList.remove('hidden');
        }
    }
    
    /**
     * Hide error modal
     */
    hideError() {
        if (this.errorModal) {
            this.errorModal.classList.add('hidden');
        }
    }
    
    /**
     * Stop the application
     */
    stop() {
        this.isRunning = false;
        console.log('Application stopped');
    }
    
    /**
     * Cleanup resources
     */
    destroy() {
        this.stop();
        
        // Remove event listeners
        window.removeEventListener('resize', this.onWindowResize);
        
        // Cleanup Three.js objects
        if (this.sceneManager) {
            this.sceneManager.dispose();
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        console.log('Application destroyed');
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ThreeJSApp();
    app.init().catch(error => {
        console.error('Failed to start application:', error);
    });
    
    // Global app reference for debugging
    window.threeApp = app;
});
