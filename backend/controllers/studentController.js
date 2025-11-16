const { generateId, validateStudent, sanitizeString } = require('../utils/validators');

/**
 * Student Controller
 * Handles all student-related operations
 */
class StudentController {
    constructor(blockchainManager) {
        this.blockchainManager = blockchainManager;
    }

    /**
     * Get all students
     */
    getAllStudents(req, res) {
        try {
            const students = this.blockchainManager.getAllStudents();
            res.json({
                success: true,
                data: students,
                count: students.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching students',
                error: error.message
            });
        }
    }

    /**
     * Get students by class
     */
    getStudentsByClass(req, res) {
        try {
            const { classId } = req.params;
            const students = this.blockchainManager.getStudentsByClass(classId);
            
            res.json({
                success: true,
                data: students,
                count: students.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching students',
                error: error.message
            });
        }
    }

    /**
     * Get students by department
     */
    getStudentsByDepartment(req, res) {
        try {
            const { departmentId } = req.params;
            const students = this.blockchainManager.getStudentsByDepartment(departmentId);
            
            res.json({
                success: true,
                data: students,
                count: students.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching students',
                error: error.message
            });
        }
    }

    /**
     * Get single student
     */
    getStudent(req, res) {
        try {
            const { id } = req.params;
            const student = this.blockchainManager.getStudent(id);

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            res.json({
                success: true,
                data: student
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching student',
                error: error.message
            });
        }
    }

    /**
     * Search students
     */
    searchStudents(req, res) {
        try {
            const { query } = req.query;

            if (!query || query.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }

            const students = this.blockchainManager.searchStudents(query);
            
            res.json({
                success: true,
                data: students,
                count: students.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error searching students',
                error: error.message
            });
        }
    }

    /**
     * Add new student
     */
    addStudent(req, res) {
        try {
            const { name, rollNumber, email, classId, departmentId } = req.body;

            // Validate input
            const validation = validateStudent({ name, rollNumber, email, classId, departmentId });
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validation.errors
                });
            }

            // Create student data
            const studentData = {
                id: generateId(),
                name: sanitizeString(name),
                rollNumber: sanitizeString(rollNumber),
                email: sanitizeString(email)
            };

            // Add to blockchain
            const block = this.blockchainManager.addStudent(departmentId, classId, studentData);

            res.status(201).json({
                success: true,
                message: 'Student added successfully',
                data: {
                    student: { ...studentData, classId, departmentId },
                    block: {
                        index: block.index,
                        hash: block.hash,
                        timestamp: block.timestamp
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error adding student',
                error: error.message
            });
        }
    }

    /**
     * Update student
     */
    updateStudent(req, res) {
        try {
            const { id } = req.params;
            const updates = {};

            // Check if student exists
            const existingStudent = this.blockchainManager.getStudent(id);
            if (!existingStudent) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            if (existingStudent.status === 'deleted') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot update deleted student'
                });
            }

            // Build updates object
            if (req.body.name) updates.name = sanitizeString(req.body.name);
            if (req.body.rollNumber) updates.rollNumber = sanitizeString(req.body.rollNumber);
            if (req.body.email) updates.email = sanitizeString(req.body.email);

            if (Object.keys(updates).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No updates provided'
                });
            }

            // Update in blockchain
            const block = this.blockchainManager.updateStudent(id, updates);

            res.json({
                success: true,
                message: 'Student updated successfully',
                data: {
                    student: this.blockchainManager.getStudent(id),
                    block: {
                        index: block.index,
                        hash: block.hash,
                        timestamp: block.timestamp
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating student',
                error: error.message
            });
        }
    }

    /**
     * Delete student
     */
    deleteStudent(req, res) {
        try {
            const { id } = req.params;

            // Check if student exists
            const existingStudent = this.blockchainManager.getStudent(id);
            if (!existingStudent) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            if (existingStudent.status === 'deleted') {
                return res.status(400).json({
                    success: false,
                    message: 'Student already deleted'
                });
            }

            // Delete in blockchain
            const block = this.blockchainManager.deleteStudent(id);

            res.json({
                success: true,
                message: 'Student deleted successfully',
                data: {
                    block: {
                        index: block.index,
                        hash: block.hash,
                        timestamp: block.timestamp
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting student',
                error: error.message
            });
        }
    }

    /**
     * Get student blockchain (for visualization)
     */
    getStudentBlockchain(req, res) {
        try {
            const { id } = req.params;
            const blockchain = this.blockchainManager.getStudentBlockchain(id);

            if (!blockchain) {
                return res.status(404).json({
                    success: false,
                    message: 'Student blockchain not found'
                });
            }

            res.json({
                success: true,
                data: blockchain,
                count: blockchain.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching student blockchain',
                error: error.message
            });
        }
    }
}

module.exports = StudentController;
