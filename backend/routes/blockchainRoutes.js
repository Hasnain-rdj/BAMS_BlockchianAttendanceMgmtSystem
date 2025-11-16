const express = require('express');
const router = express.Router();

/**
 * Create routes for Blockchain operations
 */
function createBlockchainRoutes(blockchainController) {
    // Validate all chains
    router.get('/validate', (req, res) => blockchainController.validateChains(req, res));

    // Get system stats
    router.get('/stats', (req, res) => blockchainController.getSystemStats(req, res));

    // Get department blockchain
    router.get('/department', (req, res) => 
        blockchainController.getDepartmentBlockchain(req, res));

    // Get class blockchain
    router.get('/class/:departmentId', (req, res) => 
        blockchainController.getClassBlockchain(req, res));

    // Export blockchain
    router.get('/export', (req, res) => blockchainController.exportBlockchain(req, res));

    return router;
}

module.exports = createBlockchainRoutes;
