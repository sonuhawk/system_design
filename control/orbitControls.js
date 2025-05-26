/**
 * Orbit Controls Manager
 * Handles Three.js OrbitControls setup and configuration
 */

class OrbitControlsManager {
    constructor() {
        this.controls = null;
        this.camera = null;
        this.domElement = null;
        this.isEnabled = true;
        
        // Default settings
        this.defaultSettings = {
            enableDamping: true,
            dampingFactor: 0.05,
            enableZoom: true,
            enableRotate: true,
            enablePan: true,
            autoRotate: false,
            autoRotateSpeed: 2.0,
            minDistance: 1,
            maxDistance: 100,
            minPolarAngle: 0,
            maxPolarAngle: Math.PI,
            minAzimuthAngle: -Infinity,
            maxAzimuthAngle: Infinity
        };
    }
    
    /**
     * Initialize orbit controls
     * @param {THREE.Camera} camera - Camera to control
     * @param {HTMLElement} domElement - DOM element for event listeners
     * @param {Object} options - Control options
     */
    init(camera, domElement, options = {}) {
        try {
            if (!camera) {
                throw new Error('Camera is required for orbit controls');
            }
            
            if (!domElement) {
                throw new Error('DOM element is required for orbit controls');
            }
            
            this.camera = camera;
            this.domElement = domElement;
            
            // Create orbit controls
            this.controls = new THREE.OrbitControls(camera, domElement);
            
            // Apply settings
            this.applySettings({ ...this.defaultSettings, ...options });
            
            // Setup event listeners
            this.setupEventListeners();
            
            console.log('Orbit controls initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize orbit controls:', error);
            throw new Error('Orbit controls initialization failed');
        }
    }
    
    /**
     * Apply control settings
     * @param {Object} settings - Settings to apply
     */
    applySettings(settings) {
        if (!this.controls) return;
        
        // Damping
        this.controls.enableDamping = settings.enableDamping;
        this.controls.dampingFactor = settings.dampingFactor;
        
        // Enable/disable features
        this.controls.enableZoom = settings.enableZoom;
        this.controls.enableRotate = settings.enableRotate;
        this.controls.enablePan = settings.enablePan;
        
        // Auto rotate
        this.controls.autoRotate = settings.autoRotate;
        this.controls.autoRotateSpeed = settings.autoRotateSpeed;
        
        // Distance limits
        this.controls.minDistance = settings.minDistance;
        this.controls.maxDistance = settings.maxDistance;
        
        // Angle limits
        this.controls.minPolarAngle = settings.minPolarAngle;
        this.controls.maxPolarAngle = settings.maxPolarAngle;
        this.controls.minAzimuthAngle = settings.minAzimuthAngle;
        this.controls.maxAzimuthAngle = settings.maxAzimuthAngle;
        
        console.log('Orbit controls settings applied');
    }
    
    /**
     * Setup event listeners for controls
     */
    setupEventListeners() {
        if (!this.controls) return;
        
        // Control change events
        this.controls.addEventListener('change', () => {
            // Called when controls change the camera
            // Useful for triggering renders in non-animated scenes
        });
        
        this.controls.addEventListener('start', () => {
            console.log('Orbit controls interaction started');
        });
        
        this.controls.addEventListener('end', () => {
            console.log('Orbit controls interaction ended');
        });
        
        console.log('Orbit controls event listeners setup');
    }
    
    /**
     * Update controls (call this in animation loop)
     */
    update() {
        if (this.controls && this.isEnabled) {
            this.controls.update();
        }
    }
    
    /**
     * Enable/disable controls
     * @param {boolean} enabled - Whether controls should be enabled
     */
    setEnabled(enabled) {
        if (this.controls) {
            this.controls.enabled = enabled;
            this.isEnabled = enabled;
            console.log(`Orbit controls ${enabled ? 'enabled' : 'disabled'}`);
        }
    }
    
    /**
     * Get current enabled state
     * @returns {boolean}
     */
    isControlsEnabled() {
        return this.isEnabled && this.controls && this.controls.enabled;
    }
    
    /**
     * Reset controls to default position
     */
    reset() {
        if (!this.controls) return;
        
        this.controls.reset();
        console.log('Orbit controls reset');
    }
    
    /**
     * Set target position (point to orbit around)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} z - Z coordinate
     */
    setTarget(x, y, z) {
        if (!this.controls) return;
        
        this.controls.target.set(x, y, z);
        this.controls.update();
        
        console.log(`Orbit controls target set to: (${x}, ${y}, ${z})`);
    }
    
    /**
     * Get current target position
     * @returns {Object|null}
     */
    getTarget() {
        if (!this.controls) return null;
        
        return {
            x: this.controls.target.x,
            y: this.controls.target.y,
            z: this.controls.target.z
        };
    }
    
    /**
     * Enable/disable auto rotation
     * @param {boolean} enabled - Whether auto rotation should be enabled
     * @param {number} speed - Rotation speed (optional)
     */
    setAutoRotate(enabled, speed = null) {
        if (!this.controls) return;
        
        this.controls.autoRotate = enabled;
        
        if (speed !== null) {
            this.controls.autoRotateSpeed = speed;
        }
        
        console.log(`Auto rotate ${enabled ? 'enabled' : 'disabled'}${speed ? ` (speed: ${speed})` : ''}`);
    }
    
    /**
     * Set zoom limits
     * @param {number} minDistance - Minimum zoom distance
     * @param {number} maxDistance - Maximum zoom distance
     */
    setZoomLimits(minDistance, maxDistance) {
        if (!this.controls) return;
        
        this.controls.minDistance = minDistance;
        this.controls.maxDistance = maxDistance;
        
        console.log(`Zoom limits set: min=${minDistance}, max=${maxDistance}`);
    }
    
    /**
     * Set rotation limits
     * @param {number} minPolarAngle - Minimum polar angle (vertical)
     * @param {number} maxPolarAngle - Maximum polar angle (vertical)
     * @param {number} minAzimuthAngle - Minimum azimuth angle (horizontal)
     * @param {number} maxAzimuthAngle - Maximum azimuth angle (horizontal)
     */
    setRotationLimits(minPolarAngle, maxPolarAngle, minAzimuthAngle = -Infinity, maxAzimuthAngle = Infinity) {
        if (!this.controls) return;
        
        this.controls.minPolarAngle = minPolarAngle;
        this.controls.maxPolarAngle = maxPolarAngle;
        this.controls.minAzimuthAngle = minAzimuthAngle;
        this.controls.maxAzimuthAngle = maxAzimuthAngle;
        
        console.log('Rotation limits set:', {
            minPolarAngle,
            maxPolarAngle,
            minAzimuthAngle,
            maxAzimuthAngle
        });
    }
    
    /**
     * Get control settings presets
     * @param {string} presetName - Name of the preset
     * @returns {Object|null}
     */
    getPreset(presetName) {
        const presets = {
            default: {
                enableDamping: true,
                dampingFactor: 0.05,
                enableZoom: true,
                enableRotate: true,
                enablePan: true,
                autoRotate: false
            },
            locked: {
                enableDamping: false,
                enableZoom: false,
                enableRotate: false,
                enablePan: false,
                autoRotate: false
            },
            viewOnly: {
                enableDamping: true,
                dampingFactor: 0.1,
                enableZoom: true,
                enableRotate: true,
                enablePan: false,
                autoRotate: false
            },
            showcase: {
                enableDamping: true,
                dampingFactor: 0.02,
                enableZoom: true,
                enableRotate: true,
                enablePan: true,
                autoRotate: true,
                autoRotateSpeed: 1.0
            },
            limited: {
                enableDamping: true,
                dampingFactor: 0.05,
                enableZoom: true,
                enableRotate: true,
                enablePan: false,
                minDistance: 5,
                maxDistance: 20,
                minPolarAngle: Math.PI / 6,
                maxPolarAngle: Math.PI / 2
            }
        };
        
        return presets[presetName] || null;
    }
    
    /**
     * Apply a control preset
     * @param {string} presetName - Name of the preset to apply
     */
    applyPreset(presetName) {
        const preset = this.getPreset(presetName);
        
        if (!preset) {
            console.warn(`Orbit controls preset '${presetName}' not found`);
            return;
        }
        
        this.applySettings(preset);
        console.log(`Orbit controls preset '${presetName}' applied`);
    }
    
    /**
     * Get current control information
     * @returns {Object|null}
     */
    getInfo() {
        if (!this.controls) return null;
        
        return {
            enabled: this.controls.enabled,
            target: this.getTarget(),
            enableDamping: this.controls.enableDamping,
            dampingFactor: this.controls.dampingFactor,
            enableZoom: this.controls.enableZoom,
            enableRotate: this.controls.enableRotate,
            enablePan: this.controls.enablePan,
            autoRotate: this.controls.autoRotate,
            autoRotateSpeed: this.controls.autoRotateSpeed,
            minDistance: this.controls.minDistance,
            maxDistance: this.controls.maxDistance
        };
    }
    
    /**
     * Save current camera position and target
     * @returns {Object}
     */
    saveState() {
        if (!this.controls || !this.camera) return null;
        
        return {
            cameraPosition: {
                x: this.camera.position.x,
                y: this.camera.position.y,
                z: this.camera.position.z
            },
            target: this.getTarget(),
            zoom: this.camera.zoom || 1
        };
    }
    
    /**
     * Restore camera position and target
     * @param {Object} state - Saved state object
     * @param {boolean} animate - Whether to animate the transition
     */
    restoreState(state, animate = false) {
        if (!this.controls || !this.camera || !state) return;
        
        if (animate) {
            // Animate to saved state (simplified version)
            const duration = 1000;
            const startTime = Date.now();
            const startPos = { ...this.camera.position };
            const targetPos = state.cameraPosition;
            
            const animateRestore = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                
                this.camera.position.x = startPos.x + (targetPos.x - startPos.x) * eased;
                this.camera.position.y = startPos.y + (targetPos.y - startPos.y) * eased;
                this.camera.position.z = startPos.z + (targetPos.z - startPos.z) * eased;
                
                if (state.target) {
                    this.setTarget(state.target.x, state.target.y, state.target.z);
                }
                
                this.controls.update();
                
                if (progress < 1) {
                    requestAnimationFrame(animateRestore);
                }
            };
            
            animateRestore();
        } else {
            this.camera.position.set(
                state.cameraPosition.x,
                state.cameraPosition.y,
                state.cameraPosition.z
            );
            
            if (state.target) {
                this.setTarget(state.target.x, state.target.y, state.target.z);
            }
            
            if (state.zoom && this.camera.zoom !== undefined) {
                this.camera.zoom = state.zoom;
                this.camera.updateProjectionMatrix();
            }
            
            this.controls.update();
        }
        
        console.log('Orbit controls state restored');
    }
    
    /**
     * Dispose of controls
     */
    dispose() {
        if (this.controls) {
            this.controls.dispose();
            console.log('Orbit controls disposed');
            this.controls = null;
        }
    }
}
