/**
 * Blockchain Controller
 * Handles blockchain validation and system operations
 */
class BlockchainController {
    constructor(blockchainManager) {
        this.blockchainManager = blockchainManager;
    }

    /**
     * Validate all blockchains
     */
    validateChains(req, res) {
        try {
            const validation = this.blockchainManager.validateAllChains();

            res.json({
                success: true,
                data: validation
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error validating chains',
                error: error.message
            });
        }
    }

    /**
     * Get system statistics
     */
    getSystemStats(req, res) {
        try {
            const stats = this.blockchainManager.getSystemStats();

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching system stats',
                error: error.message
            });
        }
    }

    /**
     * Get department blockchain
     */
    getDepartmentBlockchain(req, res) {
        try {
            const blocks = this.blockchainManager.departmentChain.getAllBlocks();

            res.json({
                success: true,
                data: blocks,
                count: blocks.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching department blockchain',
                error: error.message
            });
        }
    }

    /**
     * Get class blockchain for a department
     */
    getClassBlockchain(req, res) {
        try {
            const { departmentId } = req.params;
            const classChain = this.blockchainManager.classChains.get(departmentId);

            if (!classChain) {
                return res.status(404).json({
                    success: false,
                    message: 'Class chain not found for this department'
                });
            }

            const blocks = classChain.getAllBlocks();

            res.json({
                success: true,
                data: blocks,
                count: blocks.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching class blockchain',
                error: error.message
            });
        }
    }

    /**
     * Export blockchain data
     */
    exportBlockchain(req, res) {
        try {
            const data = this.blockchainManager.exportToJSON();

            res.json({
                success: true,
                data: data,
                message: 'Blockchain exported successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error exporting blockchain',
                error: error.message
            });
        }
    }
}

module.exports = BlockchainController;
