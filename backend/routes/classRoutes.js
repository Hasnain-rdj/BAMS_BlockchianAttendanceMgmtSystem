const express = require('express');
const router = express.Router();

/**
 * Create routes for Class operations
 */
function createClassRoutes(classController) {
    // Get all classes
    router.get('/', (req, res) => classController.getAllClasses(req, res));

    // Get classes by department
    router.get('/department/:departmentId', (req, res) => 
        classController.getClassesByDepartment(req, res));

    // Get single class
    router.get('/:departmentId/:classId', (req, res) => 
        classController.getClass(req, res));

    // Add class
    router.post('/', (req, res) => classController.addClass(req, res));

    // Update class
    router.put('/:departmentId/:classId', (req, res) => 
        classController.updateClass(req, res));

    // Delete class
    router.delete('/:departmentId/:classId', (req, res) => 
        classController.deleteClass(req, res));

    return router;
}

module.exports = createClassRoutes;
