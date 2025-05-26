// DiagramTemplates.js - Predefined system architecture diagram templates
export class DiagramTemplates {
    constructor(componentFactory) {
        this.componentFactory = componentFactory;
    }

    // Create a microservices architecture diagram
    createMicroservicesArchitecture() {
        const components = [];
        const connections = [];

        // API Gateway
        const apiGateway = this.componentFactory.createLoadBalancer('API Gateway', { x: 0, y: 2, z: 0 });
        components.push(apiGateway);

        // Microservices
        const userService = this.componentFactory.createServer('User Service', { x: -6, y: 0, z: -4 });
        const orderService = this.componentFactory.createServer('Order Service', { x: 0, y: 0, z: -4 });
        const paymentService = this.componentFactory.createServer('Payment Service', { x: 6, y: 0, z: -4 });
        const inventoryService = this.componentFactory.createServer('Inventory Service', { x: -3, y: 0, z: -8 });
        
        components.push(userService, orderService, paymentService, inventoryService);

        // Databases
        const userDB = this.componentFactory.createDatabase('User DB', { x: -6, y: 0, z: -8 });
        const orderDB = this.componentFactory.createDatabase('Order DB', { x: 0, y: 0, z: -8 });
        const paymentDB = this.componentFactory.createDatabase('Payment DB', { x: 6, y: 0, z: -8 });
        
        components.push(userDB, orderDB, paymentDB);

        // Cache and Queue
        const redisCache = this.componentFactory.createCache('Redis Cache', { x: 3, y: 2, z: -2 });
        const messageQueue = this.componentFactory.createQueue('Message Queue', { x: -3, y: 2, z: -2 });
        
        components.push(redisCache, messageQueue);

        // Create connections
        connections.push(
            this.componentFactory.createConnection(apiGateway, userService, 0x00ff00),
            this.componentFactory.createConnection(apiGateway, orderService, 0x00ff00),
            this.componentFactory.createConnection(apiGateway, paymentService, 0x00ff00),
            this.componentFactory.createConnection(userService, userDB, 0xff0000),
            this.componentFactory.createConnection(orderService, orderDB, 0xff0000),
            this.componentFactory.createConnection(paymentService, paymentDB, 0xff0000),
            this.componentFactory.createConnection(orderService, inventoryService, 0x0000ff),
            this.componentFactory.createConnection(inventoryService, orderDB, 0xff0000),
            this.componentFactory.createConnection(messageQueue, orderService, 0xffff00),
            this.componentFactory.createConnection(messageQueue, paymentService, 0xffff00),
            this.componentFactory.createConnection(redisCache, userService, 0xff00ff),
            this.componentFactory.createConnection(redisCache, orderService, 0xff00ff)
        );

        return { components, connections, name: 'Microservices Architecture' };
    }

    // Create a cloud architecture diagram
    createCloudArchitecture() {
        const components = [];
        const connections = [];

        // CDN
        const cdn = this.componentFactory.createCDN('CloudFront CDN', { x: 0, y: 4, z: 4 });
        components.push(cdn);

        // Load Balancer
        const loadBalancer = this.componentFactory.createLoadBalancer('ALB', { x: 0, y: 2, z: 0 });
        components.push(loadBalancer);

        // Web Servers (Auto Scaling Group)
        const webServer1 = this.componentFactory.createServer('Web Server 1', { x: -4, y: 0, z: -2 });
        const webServer2 = this.componentFactory.createServer('Web Server 2', { x: 0, y: 0, z: -2 });
        const webServer3 = this.componentFactory.createServer('Web Server 3', { x: 4, y: 0, z: -2 });
        
        components.push(webServer1, webServer2, webServer3);

        // Database cluster
        const primaryDB = this.componentFactory.createDatabase('Primary DB', { x: -2, y: 0, z: -6 });
        const replicaDB = this.componentFactory.createDatabase('Replica DB', { x: 2, y: 0, z: -6 });
        
        components.push(primaryDB, replicaDB);

        // Cache cluster
        const cache1 = this.componentFactory.createCache('ElastiCache 1', { x: -6, y: 0, z: -4 });
        const cache2 = this.componentFactory.createCache('ElastiCache 2', { x: 6, y: 0, z: -4 });
        
        components.push(cache1, cache2);

        // Message Queue
        const sqs = this.componentFactory.createQueue('SQS Queue', { x: 0, y: 0, z: -8 });
        components.push(sqs);

        // Create connections
        connections.push(
            this.componentFactory.createConnection(cdn, loadBalancer, 0x00ff00),
            this.componentFactory.createConnection(loadBalancer, webServer1, 0x0000ff),
            this.componentFactory.createConnection(loadBalancer, webServer2, 0x0000ff),
            this.componentFactory.createConnection(loadBalancer, webServer3, 0x0000ff),
            this.componentFactory.createConnection(webServer1, primaryDB, 0xff0000),
            this.componentFactory.createConnection(webServer2, primaryDB, 0xff0000),
            this.componentFactory.createConnection(webServer3, primaryDB, 0xff0000),
            this.componentFactory.createConnection(primaryDB, replicaDB, 0xffaa00),
            this.componentFactory.createConnection(webServer1, cache1, 0xff00ff),
            this.componentFactory.createConnection(webServer2, cache1, 0xff00ff),
            this.componentFactory.createConnection(webServer3, cache2, 0xff00ff),
            this.componentFactory.createConnection(webServer2, sqs, 0xffff00)
        );

        return { components, connections, name: 'Cloud Architecture' };
    }

    // Create a database design diagram
    createDatabaseDesign() {
        const components = [];
        const connections = [];

        // Main Application Database
        const mainDB = this.componentFactory.createDatabase('Main Database', { x: 0, y: 0, z: 0 });
        components.push(mainDB);

        // Read Replicas
        const readReplica1 = this.componentFactory.createDatabase('Read Replica 1', { x: -4, y: 0, z: -4 });
        const readReplica2 = this.componentFactory.createDatabase('Read Replica 2', { x: 4, y: 0, z: -4 });
        
        components.push(readReplica1, readReplica2);

        // Data Warehouse
        const dataWarehouse = this.componentFactory.createDatabase('Data Warehouse', { x: 0, y: 0, z: -8 });
        components.push(dataWarehouse);

        // Cache Layers
        const l1Cache = this.componentFactory.createCache('L1 Cache', { x: -2, y: 2, z: 2 });
        const l2Cache = this.componentFactory.createCache('L2 Cache', { x: 2, y: 2, z: 2 });
        
        components.push(l1Cache, l2Cache);

        // Application Servers
        const appServer1 = this.componentFactory.createServer('App Server 1', { x: -4, y: 2, z: 4 });
        const appServer2 = this.componentFactory.createServer('App Server 2', { x: 4, y: 2, z: 4 });
        
        components.push(appServer1, appServer2);

        // ETL Process
        const etlQueue = this.componentFactory.createQueue('ETL Queue', { x: -6, y: 0, z: -2 });
        components.push(etlQueue);

        // Create connections
        connections.push(
            this.componentFactory.createConnection(appServer1, l1Cache, 0x00ff00),
            this.componentFactory.createConnection(appServer2, l2Cache, 0x00ff00),
            this.componentFactory.createConnection(l1Cache, mainDB, 0xff0000),
            this.componentFactory.createConnection(l2Cache, mainDB, 0xff0000),
            this.componentFactory.createConnection(mainDB, readReplica1, 0x0000ff),
            this.componentFactory.createConnection(mainDB, readReplica2, 0x0000ff),
            this.componentFactory.createConnection(appServer1, readReplica1, 0x00ffff),
            this.componentFactory.createConnection(appServer2, readReplica2, 0x00ffff),
            this.componentFactory.createConnection(etlQueue, mainDB, 0xffff00),
            this.componentFactory.createConnection(etlQueue, dataWarehouse, 0xff00ff),
            this.componentFactory.createConnection(mainDB, dataWarehouse, 0xffaa00)
        );

        return { components, connections, name: 'Database Design' };
    }

    // Get all available templates
    getAvailableTemplates() {
        return [
            { key: 'microservices', name: 'Microservices Architecture', description: 'Modern microservices with API gateway' },
            { key: 'cloud', name: 'Cloud Architecture', description: 'AWS/Cloud-native architecture' },
            { key: 'database', name: 'Database Design', description: 'Database architecture with caching and replication' }
        ];
    }

    // Create a template by key
    createTemplate(templateKey) {
        switch (templateKey) {
            case 'microservices':
                return this.createMicroservicesArchitecture();
            case 'cloud':
                return this.createCloudArchitecture();
            case 'database':
                return this.createDatabaseDesign();
            default:
                console.warn(`Unknown template: ${templateKey}`);
                return null;
        }
    }
}