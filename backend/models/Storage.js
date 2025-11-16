const fs = require('fs');
const path = require('path');

/**
 * Storage Manager - Handles file-based persistence
 * Saves and loads blockchain data to/from JSON files
 */
class Storage {
    constructor() {
        this.dataDir = path.join(__dirname, '..', 'data');
        this.blockchainFile = path.join(this.dataDir, 'blockchain.json');
        
        // Ensure data directory exists
        this.ensureDataDirectory();
    }

    /**
     * Create data directory if it doesn't exist
     */
    ensureDataDirectory() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
            console.log('Data directory created:', this.dataDir);
        }
    }

    /**
     * Save blockchain data to file
     * @param {object} data - Blockchain data
     */
    save(data) {
        try {
            const jsonData = JSON.stringify(data, null, 2);
            fs.writeFileSync(this.blockchainFile, jsonData, 'utf8');
            console.log('Blockchain data saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving blockchain data:', error);
            return false;
        }
    }

    /**
     * Load blockchain data from file
     * @returns {object|null}
     */
    load() {
        try {
            if (fs.existsSync(this.blockchainFile)) {
                const jsonData = fs.readFileSync(this.blockchainFile, 'utf8');
                const data = JSON.parse(jsonData);
                console.log('Blockchain data loaded successfully');
                return data;
            } else {
                console.log('No existing blockchain data found');
                return null;
            }
        } catch (error) {
            console.error('Error loading blockchain data:', error);
            return null;
        }
    }

    /**
     * Check if blockchain data exists
     * @returns {boolean}
     */
    exists() {
        return fs.existsSync(this.blockchainFile);
    }

    /**
     * Delete blockchain data (reset system)
     * @returns {boolean}
     */
    reset() {
        try {
            if (fs.existsSync(this.blockchainFile)) {
                fs.unlinkSync(this.blockchainFile);
                console.log('Blockchain data reset successfully');
            }
            return true;
        } catch (error) {
            console.error('Error resetting blockchain data:', error);
            return false;
        }
    }

    /**
     * Get file statistics
     * @returns {object}
     */
    getStats() {
        try {
            if (fs.existsSync(this.blockchainFile)) {
                const stats = fs.statSync(this.blockchainFile);
                return {
                    exists: true,
                    size: stats.size,
                    sizeKB: (stats.size / 1024).toFixed(2),
                    modified: stats.mtime
                };
            } else {
                return {
                    exists: false,
                    size: 0,
                    sizeKB: '0',
                    modified: null
                };
            }
        } catch (error) {
            console.error('Error getting file stats:', error);
            return {
                exists: false,
                size: 0,
                sizeKB: '0',
                modified: null,
                error: error.message
            };
        }
    }
}

module.exports = Storage;
