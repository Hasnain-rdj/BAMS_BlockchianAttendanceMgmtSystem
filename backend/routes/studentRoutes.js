const express = require('express');
const router = express.Router();

/**
 * Create routes for Student operations
 */
function createStudentRoutes(studentController) {
    // Get all students
    router.get('/', (req, res) => studentController.getAllStudents(req, res));

    // Search students
    router.get('/search', (req, res) => studentController.searchStudents(req, res));

    // Get students by class
    router.get('/class/:classId', (req, res) => 
        studentController.getStudentsByClass(req, res));

    // Get students by department
    router.get('/department/:departmentId', (req, res) => 
        studentController.getStudentsByDepartment(req, res));

    // Get single student
    router.get('/:id', (req, res) => studentController.getStudent(req, res));

    // Get student blockchain
    router.get('/:id/blockchain', (req, res) => 
        studentController.getStudentBlockchain(req, res));

    // Add student
    router.post('/', (req, res) => studentController.addStudent(req, res));

    // Update student
    router.put('/:id', (req, res) => studentController.updateStudent(req, res));

    // Delete student
    router.delete('/:id', (req, res) => studentController.deleteStudent(req, res));

    return router;
}

module.exports = createStudentRoutes;
