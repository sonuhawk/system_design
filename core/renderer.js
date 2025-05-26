/**
 * Renderer Manager
 * Handles Three.js WebGL renderer setup and configuration
 */

class RendererManager {
    constructor() {
        this.renderer = null;
        this.container = null;
    }
    
    /**
     * Initialize the renderer
     * @param {HTMLElement} container - Container element for the renderer
     */
    async init(container) {
        try {
            this.container = container;
            
            // Create WebGL renderer
            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: false,
                powerPreference: "high-performance"
            });
            
            // Configure renderer
            this.configureRenderer();
            
            // Set initial size
            this.setSize(container.clientWidth, container.clientHeight);
            
            // Append to container
            container.appendChild(this.renderer.domElement);
            
            console.log('Renderer initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize renderer:', error);
            throw new Error('WebGL not supported or renderer initialization failed');
        }
    }
    
    /**
     * Configure renderer settings
     */
    configureRenderer() {
        if (!this.renderer) return;
        
        // Enable shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Set clear color (dark background)
        this.renderer.setClearColor(0x1a1a1a, 1.0);
        
        // Enable gamma correction
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        // Enable tone mapping
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        // Set pixel ratio
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        console.log('Renderer configured');
    }
    
    /**
     * Set renderer size
     * @param {number} width - Width in pixels
     * @param {number} height - Height in pixels
     */
    setSize(width, height) {
        if (!this.renderer) return;
        
        this.renderer.setSize(width, height);
        console.log(`Renderer size set to: ${width}x${height}`);
    }
    
    /**
     * Render a scene with a camera
     * @param {THREE.Scene} scene - Scene to render
     * @param {THREE.Camera} camera - Camera to render from
     */
    render(scene, camera) {
        if (!this.renderer || !scene || !camera) return;
        
        this.renderer.render(scene, camera);
    }
    
    /**
     * Get the renderer instance
     * @returns {THREE.WebGLRenderer|null}
     */
    getRenderer() {
        return this.renderer;
    }
    
    /**
     * Get renderer info for debugging
     * @returns {Object}
     */
    getInfo() {
        if (!this.renderer) return null;
        
        return {
            memory: this.renderer.info.memory,
            render: this.renderer.info.render,
            capabilities: this.renderer.capabilities
        };
    }
    
    /**
     * Enable/disable debug mode
     * @param {boolean} enabled - Whether to enable debug mode
     */
    setDebugMode(enabled) {
        if (!this.renderer) return;
        
        if (enabled) {
            // Add debug helpers
            this.renderer.debug.checkShaderErrors = true;
            console.log('Renderer debug mode enabled');
        } else {
            this.renderer.debug.checkShaderErrors = false;
            console.log('Renderer debug mode disabled');
        }
    }
    
    /**
     * Take a screenshot of the current render
     * @param {string} filename - Filename for the download
     */
    takeScreenshot(filename = 'screenshot.png') {
        if (!this.renderer) return;
        
        try {
            const link = document.createElement('a');
            link.download = filename;
            link.href = this.renderer.domElement.toDataURL('image/png');
            link.click();
            
            console.log('Screenshot taken:', filename);
        } catch (error) {
            console.error('Failed to take screenshot:', error);
        }
    }
    
    /**
     * Dispose of renderer resources
     */
    dispose() {
        if (this.renderer) {
            // Dispose of all textures, geometries, and materials
            this.renderer.dispose();
            
            // Remove from DOM
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
            
            console.log('Renderer disposed');
            this.renderer = null;
        }
    }
    
    /**
     * Get current canvas element
     * @returns {HTMLCanvasElement|null}
     */
    getCanvas() {
        return this.renderer ? this.renderer.domElement : null;
    }
    
    /**
     * Set clear color
     * @param {number} color - Hex color value
     * @param {number} alpha - Alpha value (0-1)
     */
    setClearColor(color, alpha = 1.0) {
        if (this.renderer) {
            this.renderer.setClearColor(color, alpha);
        }
    }
    
    /**
     * Update renderer settings for performance
     * @param {Object} settings - Performance settings
     */
    updatePerformanceSettings(settings = {}) {
        if (!this.renderer) return;
        
        // Apply shadow settings
        if (settings.shadows !== undefined) {
            this.renderer.shadowMap.enabled = settings.shadows;
        }
        
        // Apply pixel ratio settings
        if (settings.pixelRatio !== undefined) {
            this.renderer.setPixelRatio(Math.min(settings.pixelRatio, 2));
        }
        
        // Apply tone mapping settings
        if (settings.toneMapping !== undefined) {
            this.renderer.toneMapping = settings.toneMapping;
        }
        
        console.log('Renderer performance settings updated:', settings);
    }
}
