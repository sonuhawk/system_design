/**
 * Camera Manager
 * Handles Three.js camera setup and management
 */

class CameraManager {
    constructor() {
        this.camera = null;
        this.defaultPosition = { x: 0, y: 5, z: 10 };
        this.defaultTarget = { x: 0, y: 0, z: 0 };
        this.defaultFov = 75;
        this.defaultNear = 0.1;
        this.defaultFar = 1000;
    }
    
    /**
     * Initialize the camera
     * @param {Object} options - Camera initialization options
     */
    init(options = {}) {
        try {
            // Set up camera parameters
            const fov = options.fov || this.defaultFov;
            const aspect = options.aspect || (window.innerWidth / window.innerHeight);
            const near = options.near || this.defaultNear;
            const far = options.far || this.defaultFar;
            
            // Create perspective camera
            this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            
            // Set initial position
            const position = options.position || this.defaultPosition;
            this.camera.position.set(position.x, position.y, position.z);
            
            // Set initial target
            const target = options.target || this.defaultTarget;
            this.camera.lookAt(target.x, target.y, target.z);
            
            console.log('Camera initialized successfully');
            console.log(`Position: (${position.x}, ${position.y}, ${position.z})`);
            console.log(`Target: (${target.x}, ${target.y}, ${target.z})`);
            
        } catch (error) {
            console.error('Failed to initialize camera:', error);
            throw new Error('Camera initialization failed');
        }
    }
    
    /**
     * Get the camera instance
     * @returns {THREE.PerspectiveCamera|null}
     */
    getCamera() {
        return this.camera;
    }
    
    /**
     * Update camera aspect ratio
     * @param {number} aspect - New aspect ratio
     */
    updateAspectRatio(aspect) {
        if (!this.camera) return;
        
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        
        console.log(`Camera aspect ratio updated: ${aspect}`);
    }
    
    /**
     * Set camera position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate  
     * @param {number} z - Z coordinate
     */
    setPosition(x, y, z) {
        if (!this.camera) return;
        
        this.camera.position.set(x, y, z);
        console.log(`Camera position set to: (${x}, ${y}, ${z})`);
    }
    
    /**
     * Set camera target (look at point)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} z - Z coordinate
     */
    setTarget(x, y, z) {
        if (!this.camera) return;
        
        this.camera.lookAt(x, y, z);
        console.log(`Camera target set to: (${x}, ${y}, ${z})`);
    }
    
    /**
     * Reset camera to default position and target
     */
    reset() {
        if (!this.camera) return;
        
        this.setPosition(
            this.defaultPosition.x,
            this.defaultPosition.y,
            this.defaultPosition.z
        );
        
        this.setTarget(
            this.defaultTarget.x,
            this.defaultTarget.y,
            this.defaultTarget.z
        );
        
        console.log('Camera reset to default position');
    }
    
    /**
     * Set field of view
     * @param {number} fov - Field of view in degrees
     */
    setFov(fov) {
        if (!this.camera) return;
        
        this.camera.fov = fov;
        this.camera.updateProjectionMatrix();
        
        console.log(`Camera FOV set to: ${fov}°`);
    }
    
    /**
     * Set near and far clipping planes
     * @param {number} near - Near clipping plane
     * @param {number} far - Far clipping plane
     */
    setClippingPlanes(near, far) {
        if (!this.camera) return;
        
        this.camera.near = near;
        this.camera.far = far;
        this.camera.updateProjectionMatrix();
        
        console.log(`Camera clipping planes set: near=${near}, far=${far}`);
    }
    
    /**
     * Get camera information
     * @returns {Object|null}
     */
    getInfo() {
        if (!this.camera) return null;
        
        return {
            position: {
                x: this.camera.position.x,
                y: this.camera.position.y,
                z: this.camera.position.z
            },
            rotation: {
                x: this.camera.rotation.x,
                y: this.camera.rotation.y,
                z: this.camera.rotation.z
            },
            fov: this.camera.fov,
            aspect: this.camera.aspect,
            near: this.camera.near,
            far: this.camera.far
        };
    }
    
    /**
     * Move camera smoothly to new position
     * @param {Object} targetPosition - Target position {x, y, z}
     * @param {Object} targetLookAt - Target look at point {x, y, z}
     * @param {number} duration - Animation duration in milliseconds
     */
    animateTo(targetPosition, targetLookAt, duration = 1000) {
        if (!this.camera) return Promise.reject(new Error('Camera not initialized'));
        
        return new Promise((resolve) => {
            const startPosition = {
                x: this.camera.position.x,
                y: this.camera.position.y,
                z: this.camera.position.z
            };
            
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Smooth easing function
                const eased = 1 - Math.pow(1 - progress, 3);
                
                // Interpolate position
                this.camera.position.x = startPosition.x + (targetPosition.x - startPosition.x) * eased;
                this.camera.position.y = startPosition.y + (targetPosition.y - startPosition.y) * eased;
                this.camera.position.z = startPosition.z + (targetPosition.z - startPosition.z) * eased;
                
                // Update look at if provided
                if (targetLookAt) {
                    this.camera.lookAt(targetLookAt.x, targetLookAt.y, targetLookAt.z);
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }
    
    /**
     * Create a camera preset configuration
     * @param {string} presetName - Name of the preset
     * @returns {Object|null}
     */
    getPreset(presetName) {
        const presets = {
            default: {
                position: this.defaultPosition,
                target: this.defaultTarget,
                fov: this.defaultFov
            },
            overhead: {
                position: { x: 0, y: 20, z: 0 },
                target: { x: 0, y: 0, z: 0 },
                fov: 60
            },
            closeup: {
                position: { x: 0, y: 2, z: 5 },
                target: { x: 0, y: 0, z: 0 },
                fov: 45
            },
            wide: {
                position: { x: 0, y: 10, z: 20 },
                target: { x: 0, y: 0, z: 0 },
                fov: 90
            }
        };
        
        return presets[presetName] || null;
    }
    
    /**
     * Apply a camera preset
     * @param {string} presetName - Name of the preset to apply
     * @param {boolean} animate - Whether to animate the transition
     */
    applyPreset(presetName, animate = false) {
        const preset = this.getPreset(presetName);
        
        if (!preset) {
            console.warn(`Camera preset '${presetName}' not found`);
            return;
        }
        
        if (animate) {
            this.animateTo(preset.position, preset.target).then(() => {
                this.setFov(preset.fov);
                console.log(`Camera preset '${presetName}' applied with animation`);
            });
        } else {
            this.setPosition(preset.position.x, preset.position.y, preset.position.z);
            this.setTarget(preset.target.x, preset.target.y, preset.target.z);
            this.setFov(preset.fov);
            console.log(`Camera preset '${presetName}' applied instantly`);
        }
    }
    
    /**
     * Dispose of camera resources
     */
    dispose() {
        if (this.camera) {
            console.log('Camera disposed');
            this.camera = null;
        }
    }
}
