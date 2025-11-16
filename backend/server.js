const express = require('express');
const cors = require('cors');
const path = require('path');
const BlockchainManager = require('./blockchain/BlockchainManager');
const Storage = require('./models/Storage');

// Controllers
const DepartmentController = require('./controllers/departmentController');
const ClassController = require('./controllers/classController');
const StudentController = require('./controllers/studentController');
const AttendanceController = require('./controllers/attendanceController');
const BlockchainController = require('./controllers/blockchainController');

// Routes
const createDepartmentRoutes = require('./routes/departmentRoutes');
const createClassRoutes = require('./routes/classRoutes');
const createStudentRoutes = require('./routes/studentRoutes');
const createAttendanceRoutes = require('./routes/attendanceRoutes');
const createBlockchainRoutes = require('./routes/blockchainRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - CORS allows all origins for Netlify frontend
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        message: 'BAMS Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Serve static files from frontend (only in development)
if (process.env.NODE_ENV !== 'production') {
    app.use(express.static(path.join(__dirname, '../frontend')));
}

// Initialize blockchain manager and storage
const blockchainManager = new BlockchainManager();
const storage = new Storage();

// Load existing blockchain data
const existingData = storage.load();
if (existingData) {
    console.log('Loading existing blockchain data...');
    blockchainManager.importFromJSON(existingData);
}

// Initialize controllers
const departmentController = new DepartmentController(blockchainManager);
const classController = new ClassController(blockchainManager);
const studentController = new StudentController(blockchainManager);
const attendanceController = new AttendanceController(blockchainManager);
const blockchainController = new BlockchainController(blockchainManager);

// Setup routes
app.use('/api/departments', createDepartmentRoutes(departmentController));
app.use('/api/classes', createClassRoutes(classController));
app.use('/api/students', createStudentRoutes(studentController));
app.use('/api/attendance', createAttendanceRoutes(attendanceController));
app.use('/api/blockchain', createBlockchainRoutes(blockchainController));

// Root API endpoint
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Blockchain-Based Attendance Management System API',
        version: '1.0.0',
        endpoints: {
            departments: '/api/departments',
            classes: '/api/classes',
            students: '/api/students',
            attendance: '/api/attendance',
            blockchain: '/api/blockchain'
        }
    });
});

// Serve frontend pages (only in development)
if (process.env.NODE_ENV !== 'production') {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    });

    app.get('/departments', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/departments.html'));
    });

    app.get('/classes', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/classes.html'));
    });

    app.get('/students', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/students.html'));
    });

    app.get('/attendance', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/attendance.html'));
    });

    app.get('/blockchain', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/blockchain.html'));
    });

    app.get('/validation', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/validation.html'));
    });
}

// Auto-save blockchain data every 30 seconds
setInterval(() => {
    const data = blockchainManager.exportToJSON();
    storage.save(data);
}, 30000);

// Save on process termination
process.on('SIGINT', () => {
    console.log('\nSaving blockchain data before exit...');
    const data = blockchainManager.exportToJSON();
    storage.save(data);
    console.log('Data saved. Exiting...');
    process.exit(0);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(60));
    console.log('🔗 BLOCKCHAIN-BASED ATTENDANCE MANAGEMENT SYSTEM');
    console.log('='.repeat(60));
    console.log(`Server running on port: ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API endpoint: /api`);
    console.log(`Health check: /health`);
    console.log('='.repeat(60));
    console.log('System Stats:');
    const stats = blockchainManager.getSystemStats();
    console.log(`  Departments: ${stats.departments}`);
    console.log(`  Classes: ${stats.classes}`);
    console.log(`  Students: ${stats.students}`);
    console.log(`  Total Blocks: ${stats.totalBlocks}`);
    console.log(`  Chain Valid: ${stats.isValid ? '✓' : '✗'}`);
    console.log('='.repeat(60));
});

module.exports = app;
