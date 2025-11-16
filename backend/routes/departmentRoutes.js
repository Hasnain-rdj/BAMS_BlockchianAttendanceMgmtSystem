const express = require('express');
const router = express.Router();

/**
 * Create routes for Department operations
 */
function createDepartmentRoutes(departmentController) {
    // Get all departments
    router.get('/', (req, res) => departmentController.getAllDepartments(req, res));

    // Get single department
    router.get('/:id', (req, res) => departmentController.getDepartment(req, res));

    // Add department
    router.post('/', (req, res) => departmentController.addDepartment(req, res));

    // Update department
    router.put('/:id', (req, res) => departmentController.updateDepartment(req, res));

    // Delete department
    router.delete('/:id', (req, res) => departmentController.deleteDepartment(req, res));

    return router;
}

module.exports = createDepartmentRoutes;
