// ComponentFactory.js - Factory for creating 3D system components
export class ComponentFactory {
    constructor() {
        this.componentCount = 0;
    }

    // Create a server component
    createServer(name = 'Server', position = { x: 0, y: 0, z: 0 }) {
        const group = new THREE.Group();
        group.name = name;
        group.userData = { type: 'server', id: ++this.componentCount };

        // Main server body
        const serverGeometry = new THREE.BoxGeometry(2, 3, 1);
        const serverMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4a90e2,
            shininess: 30
        });
        const serverMesh = new THREE.Mesh(serverGeometry, serverMaterial);
        serverMesh.castShadow = true;
        serverMesh.receiveShadow = true;
        group.add(serverMesh);

        // Server front panel
        const panelGeometry = new THREE.PlaneGeometry(1.8, 2.8);
        const panelMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2c3e50,
            side: THREE.DoubleSide
        });
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.z = 0.51;
        group.add(panel);

        // LED indicators
        for (let i = 0; i < 4; i++) {
            const ledGeometry = new THREE.SphereGeometry(0.05, 8, 8);
            const ledMaterial = new THREE.MeshPhongMaterial({ 
                color: Math.random() > 0.5 ? 0x00ff00 : 0xff0000,
                emissive: Math.random() > 0.5 ? 0x002200 : 0x220000
            });
            const led = new THREE.Mesh(ledGeometry, ledMaterial);
            led.position.set(-0.7 + (i * 0.3), 1, 0.52);
            group.add(led);
        }

        // Add text label
        this.addTextLabel(group, name, { x: 0, y: -2, z: 0 });

        group.position.set(position.x, position.y, position.z);
        return group;
    }

    // Create a database component
    createDatabase(name = 'Database', position = { x: 0, y: 0, z: 0 }) {
        const group = new THREE.Group();
        group.name = name;
        group.userData = { type: 'database', id: ++this.componentCount };

        // Database cylinder (main body)
        const dbGeometry = new THREE.CylinderGeometry(1, 1, 2, 16);
        const dbMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xe74c3c,
            shininess: 30
        });
        const dbMesh = new THREE.Mesh(dbGeometry, dbMaterial);
        dbMesh.castShadow = true;
        dbMesh.receiveShadow = true;
        group.add(dbMesh);

        // Database disk layers
        for (let i = 0; i < 3; i++) {
            const diskGeometry = new THREE.CylinderGeometry(1.1, 1.1, 0.1, 16);
            const diskMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xc0392b
            });
            const disk = new THREE.Mesh(diskGeometry, diskMaterial);
            disk.position.y = -0.7 + (i * 0.7);
            group.add(disk);
        }

        // Add text label
        this.addTextLabel(group, name, { x: 0, y: -2, z: 0 });

        group.position.set(position.x, position.y, position.z);
        return group;
    }

    // Create a load balancer component
    createLoadBalancer(name = 'Load Balancer', position = { x: 0, y: 0, z: 0 }) {
        const group = new THREE.Group();
        group.name = name;
        group.userData = { type: 'loadbalancer', id: ++this.componentCount };

        // Main body (hexagon shape)
        const lbGeometry = new THREE.CylinderGeometry(1.5, 1.5, 1, 6);
        const lbMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xf39c12,
            shininess: 30
        });
        const lbMesh = new THREE.Mesh(lbGeometry, lbMaterial);
        lbMesh.castShadow = true;
        lbMesh.receiveShadow = true;
        group.add(lbMesh);

        // Connection ports
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const portGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const portMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x27ae60,
                emissive: 0x002200
            });
            const port = new THREE.Mesh(portGeometry, portMaterial);
            port.position.set(
                Math.cos(angle) * 1.6,
                0,
                Math.sin(angle) * 1.6
            );
            group.add(port);
        }

        // Add text label
        this.addTextLabel(group, name, { x: 0, y: -2, z: 0 });

        group.position.set(position.x, position.y, position.z);
        return group;
    }

    // Create a cache component
    createCache(name = 'Cache', position = { x: 0, y: 0, z: 0 }) {
        const group = new THREE.Group();
        group.name = name;
        group.userData = { type: 'cache', id: ++this.componentCount };

        // Main cache body (diamond shape)
        const cacheGeometry = new THREE.OctahedronGeometry(1.2);
        const cacheMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x9b59b6,
            shininess: 50,
            transparent: true,
            opacity: 0.8
        });
        const cacheMesh = new THREE.Mesh(cacheGeometry, cacheMaterial);
        cacheMesh.castShadow = true;
        cacheMesh.receiveShadow = true;
        group.add(cacheMesh);

        // Cache memory indicators
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const memGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
            const memMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xe91e63,
                emissive: 0x220011
            });
            const mem = new THREE.Mesh(memGeometry, memMaterial);
            mem.position.set(
                Math.cos(angle) * 0.8,
                Math.sin(angle) * 0.8,
                0
            );
            group.add(mem);
        }

        // Add text label
        this.addTextLabel(group, name, { x: 0, y: -2, z: 0 });

        group.position.set(position.x, position.y, position.z);
        return group;
    }

    // Create a message queue component
    createQueue(name = 'Message Queue', position = { x: 0, y: 0, z: 0 }) {
        const group = new THREE.Group();
        group.name = name;
        group.userData = { type: 'queue', id: ++this.componentCount };

        // Main queue body
        const queueGeometry = new THREE.BoxGeometry(3, 0.8, 0.8);
        const queueMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1abc9c,
            shininess: 30
        });
        const queueMesh = new THREE.Mesh(queueGeometry, queueMaterial);
        queueMesh.castShadow = true;
        queueMesh.receiveShadow = true;
        group.add(queueMesh);

        // Message segments
        for (let i = 0; i < 5; i++) {
            const segGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.6);
            const segMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x16a085
            });
            const segment = new THREE.Mesh(segGeometry, segMaterial);
            segment.position.x = -1.2 + (i * 0.6);
            group.add(segment);
        }

        // Add text label
        this.addTextLabel(group, name, { x: 0, y: -2, z: 0 });

        group.position.set(position.x, position.y, position.z);
        return group;
    }

    // Create a CDN component
    createCDN(name = 'CDN', position = { x: 0, y: 0, z: 0 }) {
        const group = new THREE.Group();
        group.name = name;
        group.userData = { type: 'cdn', id: ++this.componentCount };

        // Main CDN hub
        const cdnGeometry = new THREE.SphereGeometry(1, 12, 12);
        const cdnMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff6b35,
            shininess: 30
        });
        const cdnMesh = new THREE.Mesh(cdnGeometry, cdnMaterial);
        cdnMesh.castShadow = true;
        cdnMesh.receiveShadow = true;
        group.add(cdnMesh);

        // Edge nodes
        for (let i = 0; i < 8; i++) {
            const angle1 = (i / 8) * Math.PI * 2;
            const angle2 = (i / 4) * Math.PI;
            
            const edgeGeometry = new THREE.SphereGeometry(0.2, 8, 8);
            const edgeMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xd35400
            });
            const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
            edge.position.set(
                Math.cos(angle1) * Math.sin(angle2) * 2,
                Math.cos(angle2) * 1.5,
                Math.sin(angle1) * Math.sin(angle2) * 2
            );
            group.add(edge);

            // Connection lines
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                edge.position
            ]);
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            group.add(line);
        }

        // Add text label
        this.addTextLabel(group, name, { x: 0, y: -2.5, z: 0 });

        group.position.set(position.x, position.y, position.z);
        return group;
    }

    // Helper method to add text labels (simplified version)
    addTextLabel(group, text, position) {
        // Create a simple text plane for now
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.textAlign = 'center';
        context.fillText(text, canvas.width / 2, canvas.height / 2 + 7);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true,
            side: THREE.DoubleSide
        });
        const geometry = new THREE.PlaneGeometry(2, 0.5);
        const textMesh = new THREE.Mesh(geometry, material);
        
        textMesh.position.set(position.x, position.y, position.z);
        textMesh.userData = { isLabel: true };
        group.add(textMesh);
    }

    // Create connection between two components
    createConnection(component1, component2, color = 0x00ff00) {
        const pos1 = component1.position;
        const pos2 = component2.position;
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(pos1.x, pos1.y, pos1.z),
            new THREE.Vector3(pos2.x, pos2.y, pos2.z)
        ]);
        
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: color,
            linewidth: 3,
            transparent: true,
            opacity: 0.7
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.userData = { 
            type: 'connection',
            from: component1.userData.id,
            to: component2.userData.id
        };
        
        return line;
    }

    // Get available component types
    getAvailableTypes() {
        return ['server', 'database', 'loadbalancer', 'cache', 'queue', 'cdn'];
    }
}