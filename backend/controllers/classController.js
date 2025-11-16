const { generateId, validateClass, sanitizeString } = require('../utils/validators');

/**
 * Class Controller
 * Handles all class-related operations
 */
class ClassController {
    constructor(blockchainManager) {
        this.blockchainManager = blockchainManager;
    }

    /**
     * Get all classes
     */
    getAllClasses(req, res) {
        try {
            const classes = this.blockchainManager.getAllClasses();
            res.json({
                success: true,
                data: classes,
                count: classes.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching classes',
                error: error.message
            });
        }
    }

    /**
     * Get classes by department
     */
    getClassesByDepartment(req, res) {
        try {
            const { departmentId } = req.params;
            const classes = this.blockchainManager.getClassesByDepartment(departmentId);
            
            res.json({
                success: true,
                data: classes,
                count: classes.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching classes',
                error: error.message
            });
        }
    }

    /**
     * Get single class
     */
    getClass(req, res) {
        try {
            const { departmentId, classId } = req.params;
            const classData = this.blockchainManager.getClass(departmentId, classId);

            if (!classData) {
                return res.status(404).json({
                    success: false,
                    message: 'Class not found'
                });
            }

            res.json({
                success: true,
                data: classData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching class',
                error: error.message
            });
        }
    }

    /**
     * Add new class
     */
    addClass(req, res) {
        try {
            const { name, teacher, capacity, departmentId } = req.body;

            // Validate input
            const validation = validateClass({ name, teacher, capacity, departmentId });
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validation.errors
                });
            }

            // Create class data
            const classData = {
                id: generateId(),
                name: sanitizeString(name),
                teacher: sanitizeString(teacher),
                capacity: parseInt(capacity)
            };

            // Add to blockchain
            const block = this.blockchainManager.addClass(departmentId, classData);

            res.status(201).json({
                success: true,
                message: 'Class added successfully',
                data: {
                    class: { ...classData, departmentId },
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
                message: 'Error adding class',
                error: error.message
            });
        }
    }

    /**
     * Update class
     */
    updateClass(req, res) {
        try {
            const { departmentId, classId } = req.params;
            const updates = {};

            // Check if class exists
            const existingClass = this.blockchainManager.getClass(departmentId, classId);
            if (!existingClass) {
                return res.status(404).json({
                    success: false,
                    message: 'Class not found'
                });
            }

            if (existingClass.status === 'deleted') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot update deleted class'
                });
            }

            // Build updates object
            if (req.body.name) updates.name = sanitizeString(req.body.name);
            if (req.body.teacher) updates.teacher = sanitizeString(req.body.teacher);
            if (req.body.capacity) updates.capacity = parseInt(req.body.capacity);

            if (Object.keys(updates).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No updates provided'
                });
            }

            // Update in blockchain
            const block = this.blockchainManager.updateClass(departmentId, classId, updates);

            res.json({
                success: true,
                message: 'Class updated successfully',
                data: {
                    class: this.blockchainManager.getClass(departmentId, classId),
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
                message: 'Error updating class',
                error: error.message
            });
        }
    }

    /**
     * Delete class
     */
    deleteClass(req, res) {
        try {
            const { departmentId, classId } = req.params;

            // Check if class exists
            const existingClass = this.blockchainManager.getClass(departmentId, classId);
            if (!existingClass) {
                return res.status(404).json({
                    success: false,
                    message: 'Class not found'
                });
            }

            if (existingClass.status === 'deleted') {
                return res.status(400).json({
                    success: false,
                    message: 'Class already deleted'
                });
            }

            // Delete in blockchain
            const block = this.blockchainManager.deleteClass(departmentId, classId);

            res.json({
                success: true,
                message: 'Class deleted successfully',
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
                message: 'Error deleting class',
                error: error.message
            });
        }
    }
}

module.exports = ClassController;
