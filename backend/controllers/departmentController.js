const { generateId, validateDepartment, sanitizeString } = require('../utils/validators');

/**
 * Department Controller
 * Handles all department-related operations
 */
class DepartmentController {
    constructor(blockchainManager) {
        this.blockchainManager = blockchainManager;
    }

    /**
     * Get all departments
     */
    getAllDepartments(req, res) {
        try {
            const departments = this.blockchainManager.getAllDepartments();
            res.json({
                success: true,
                data: departments,
                count: departments.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching departments',
                error: error.message
            });
        }
    }

    /**
     * Get single department
     */
    getDepartment(req, res) {
        try {
            const { id } = req.params;
            const department = this.blockchainManager.getDepartment(id);

            if (!department) {
                return res.status(404).json({
                    success: false,
                    message: 'Department not found'
                });
            }

            res.json({
                success: true,
                data: department
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching department',
                error: error.message
            });
        }
    }

    /**
     * Add new department
     */
    addDepartment(req, res) {
        try {
            const { name, head } = req.body;

            // Validate input
            const validation = validateDepartment({ name, head });
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validation.errors
                });
            }

            // Create department data
            const departmentData = {
                id: generateId(),
                name: sanitizeString(name),
                head: sanitizeString(head)
            };

            // Add to blockchain
            const block = this.blockchainManager.addDepartment(departmentData);

            res.status(201).json({
                success: true,
                message: 'Department added successfully',
                data: {
                    department: departmentData,
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
                message: 'Error adding department',
                error: error.message
            });
        }
    }

    /**
     * Update department
     */
    updateDepartment(req, res) {
        try {
            const { id } = req.params;
            const updates = {};

            // Check if department exists
            const existingDept = this.blockchainManager.getDepartment(id);
            if (!existingDept) {
                return res.status(404).json({
                    success: false,
                    message: 'Department not found'
                });
            }

            if (existingDept.status === 'deleted') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot update deleted department'
                });
            }

            // Build updates object
            if (req.body.name) updates.name = sanitizeString(req.body.name);
            if (req.body.head) updates.head = sanitizeString(req.body.head);

            if (Object.keys(updates).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No updates provided'
                });
            }

            // Update in blockchain
            const block = this.blockchainManager.updateDepartment(id, updates);

            res.json({
                success: true,
                message: 'Department updated successfully',
                data: {
                    department: this.blockchainManager.getDepartment(id),
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
                message: 'Error updating department',
                error: error.message
            });
        }
    }

    /**
     * Delete department
     */
    deleteDepartment(req, res) {
        try {
            const { id } = req.params;

            // Check if department exists
            const existingDept = this.blockchainManager.getDepartment(id);
            if (!existingDept) {
                return res.status(404).json({
                    success: false,
                    message: 'Department not found'
                });
            }

            if (existingDept.status === 'deleted') {
                return res.status(400).json({
                    success: false,
                    message: 'Department already deleted'
                });
            }

            // Delete in blockchain (append deletion block)
            const block = this.blockchainManager.deleteDepartment(id);

            res.json({
                success: true,
                message: 'Department deleted successfully',
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
                message: 'Error deleting department',
                error: error.message
            });
        }
    }
}

module.exports = DepartmentController;
