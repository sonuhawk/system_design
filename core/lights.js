/**
 * Lights Manager
 * Handles Three.js lighting setup and management
 */

class LightsManager {
    constructor() {
        this.lights = {};
        this.lightHelpers = {};
        this.showHelpers = false;
    }
    
    /**
     * Initialize the lighting system
     */
    init() {
        try {
            // Create ambient light
            this.createAmbientLight();
            
            // Create directional light (sun)
            this.createDirectionalLight();
            
            // Create point lights
            this.createPointLights();
            
            // Create hemisphere light
            this.createHemisphereLight();
            
            console.log('Lights initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize lights:', error);
            throw new Error('Lighting system initialization failed');
        }
    }
    
    /**
     * Create ambient light for overall scene illumination
     */
    createAmbientLight() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        ambientLight.name = 'AmbientLight';
        
        this.lights.ambient = ambientLight;
        console.log('Ambient light created');
    }
    
    /**
     * Create directional light (simulates sun)
     */
    createDirectionalLight() {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        
        // Position the light
        directionalLight.position.set(10, 20, 10);
        directionalLight.target.position.set(0, 0, 0);
        directionalLight.name = 'DirectionalLight';
        
        // Configure shadows
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        directionalLight.shadow.bias = -0.0001;
        
        this.lights.directional = directionalLight;
        
        // Create helper
        this.lightHelpers.directional = new THREE.DirectionalLightHelper(directionalLight, 2);
        this.lightHelpers.directional.visible = this.showHelpers;
        
        console.log('Directional light created');
    }
    
    /**
     * Create point lights for accent lighting
     */
    createPointLights() {
        // Key light (main point light)
        const keyLight = new THREE.PointLight(0xffffff, 0.8, 50);
        keyLight.position.set(5, 10, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 50;
        keyLight.name = 'KeyLight';
        
        this.lights.keyLight = keyLight;
        
        // Fill light (softer point light)
        const fillLight = new THREE.PointLight(0x8888ff, 0.4, 30);
        fillLight.position.set(-5, 5, -5);
        fillLight.name = 'FillLight';
        
        this.lights.fillLight = fillLight;
        
        // Create helpers
        this.lightHelpers.keyLight = new THREE.PointLightHelper(keyLight, 0.5);
        this.lightHelpers.keyLight.visible = this.showHelpers;
        
        this.lightHelpers.fillLight = new THREE.PointLightHelper(fillLight, 0.5);
        this.lightHelpers.fillLight.visible = this.showHelpers;
        
        console.log('Point lights created');
    }
    
    /**
     * Create hemisphere light for natural sky/ground lighting
     */
    createHemisphereLight() {
        const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x8b4513, 0.2);
        hemisphereLight.name = 'HemisphereLight';
        
        this.lights.hemisphere = hemisphereLight;
        
        // Create helper
        this.lightHelpers.hemisphere = new THREE.HemisphereLightHelper(hemisphereLight, 2);
        this.lightHelpers.hemisphere.visible = this.showHelpers;
        
        console.log('Hemisphere light created');
    }
    
    /**
     * Add all lights to a scene
     * @param {THREE.Scene} scene - Scene to add lights to
     */
    addToScene(scene) {
        if (!scene) {
            console.error('Scene is required to add lights');
            return;
        }
        
        // Add all lights
        Object.values(this.lights).forEach(light => {
            scene.add(light);
            
            // Add target for directional light
            if (light.target) {
                scene.add(light.target);
            }
        });
        
        // Add helpers if enabled
        if (this.showHelpers) {
            Object.values(this.lightHelpers).forEach(helper => {
                scene.add(helper);
            });
        }
        
        console.log('Lights added to scene');
    }
    
    /**
     * Remove all lights from a scene
     * @param {THREE.Scene} scene - Scene to remove lights from
     */
    removeFromScene(scene) {
        if (!scene) return;
        
        // Remove all lights
        Object.values(this.lights).forEach(light => {
            scene.remove(light);
            
            // Remove target for directional light
            if (light.target) {
                scene.remove(light.target);
            }
        });
        
        // Remove helpers
        Object.values(this.lightHelpers).forEach(helper => {
            scene.remove(helper);
        });
        
        console.log('Lights removed from scene');
    }
    
    /**
     * Get a specific light by name
     * @param {string} name - Name of the light
     * @returns {THREE.Light|null}
     */
    getLight(name) {
        return this.lights[name] || null;
    }
    
    /**
     * Get all lights
     * @returns {Object}
     */
    getAllLights() {
        return { ...this.lights };
    }
    
    /**
     * Update light properties
     * @param {string} name - Name of the light
     * @param {Object} properties - Properties to update
     */
    updateLight(name, properties) {
        const light = this.lights[name];
        if (!light) {
            console.warn(`Light '${name}' not found`);
            return;
        }
        
        // Update intensity
        if (properties.intensity !== undefined) {
            light.intensity = properties.intensity;
        }
        
        // Update color
        if (properties.color !== undefined) {
            light.color.setHex(properties.color);
        }
        
        // Update position
        if (properties.position) {
            light.position.set(
                properties.position.x || light.position.x,
                properties.position.y || light.position.y,
                properties.position.z || light.position.z
            );
        }
        
        // Update shadows
        if (properties.castShadow !== undefined) {
            light.castShadow = properties.castShadow;
        }
        
        console.log(`Light '${name}' updated:`, properties);
    }
    
    /**
     * Toggle light helpers visibility
     * @param {boolean} visible - Whether helpers should be visible
     * @param {THREE.Scene} scene - Scene containing the helpers
     */
    toggleHelpers(visible, scene = null) {
        this.showHelpers = visible;
        
        Object.values(this.lightHelpers).forEach(helper => {
            helper.visible = visible;
            
            if (scene) {
                if (visible && !scene.children.includes(helper)) {
                    scene.add(helper);
                } else if (!visible && scene.children.includes(helper)) {
                    scene.remove(helper);
                }
            }
        });
        
        console.log(`Light helpers ${visible ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Create lighting preset configurations
     * @param {string} presetName - Name of the preset
     * @returns {Object|null}
     */
    getPreset(presetName) {
        const presets = {
            daylight: {
                ambient: { intensity: 0.3, color: 0x404040 },
                directional: { intensity: 1.0, color: 0xffffff },
                hemisphere: { intensity: 0.2 }
            },
            sunset: {
                ambient: { intensity: 0.4, color: 0x402020 },
                directional: { intensity: 0.6, color: 0xff8844 },
                hemisphere: { intensity: 0.3 }
            },
            night: {
                ambient: { intensity: 0.1, color: 0x202040 },
                directional: { intensity: 0.2, color: 0x4444ff },
                hemisphere: { intensity: 0.1 }
            },
            studio: {
                ambient: { intensity: 0.4, color: 0x404040 },
                keyLight: { intensity: 1.0, color: 0xffffff },
                fillLight: { intensity: 0.6, color: 0x8888ff }
            }
        };
        
        return presets[presetName] || null;
    }
    
    /**
     * Apply a lighting preset
     * @param {string} presetName - Name of the preset to apply
     */
    applyPreset(presetName) {
        const preset = this.getPreset(presetName);
        
        if (!preset) {
            console.warn(`Lighting preset '${presetName}' not found`);
            return;
        }
        
        Object.entries(preset).forEach(([lightName, properties]) => {
            this.updateLight(lightName, properties);
        });
        
        console.log(`Lighting preset '${presetName}' applied`);
    }
    
    /**
     * Animate light properties
     * @param {string} lightName - Name of the light
     * @param {Object} targetProperties - Target properties
     * @param {number} duration - Animation duration in milliseconds
     */
    animateLight(lightName, targetProperties, duration = 1000) {
        const light = this.lights[lightName];
        if (!light) {
            console.warn(`Light '${lightName}' not found`);
            return Promise.reject(new Error('Light not found'));
        }
        
        return new Promise((resolve) => {
            const startTime = Date.now();
            const startIntensity = light.intensity;
            const targetIntensity = targetProperties.intensity || startIntensity;
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Smooth easing
                const eased = 1 - Math.pow(1 - progress, 3);
                
                // Interpolate intensity
                light.intensity = startIntensity + (targetIntensity - startIntensity) * eased;
                
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
     * Dispose of lighting resources
     */
    dispose() {
        // Dispose lights
        Object.values(this.lights).forEach(light => {
            if (light.dispose) {
                light.dispose();
            }
        });
        
        // Dispose helpers
        Object.values(this.lightHelpers).forEach(helper => {
            if (helper.dispose) {
                helper.dispose();
            }
        });
        
        this.lights = {};
        this.lightHelpers = {};
        
        console.log('Lights disposed');
    }
}
