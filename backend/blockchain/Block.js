const crypto = require('crypto');

/**
 * Block Class - Represents a single block in the blockchain
 * Contains index, timestamp, transactions, prev_hash, nonce, and hash
 */
class Block {
    constructor(index, timestamp, transactions, prev_hash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions; // Can be department, class, student, or attendance data
        this.prev_hash = prev_hash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    /**
     * Calculate SHA-256 hash of the block
     * @returns {string} - Hash string
     */
    calculateHash() {
        const data = this.index + 
                     this.timestamp + 
                     JSON.stringify(this.transactions) + 
                     this.prev_hash + 
                     this.nonce;
        
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    /**
     * Mine block using Proof of Work (PoW)
     * Increment nonce until hash starts with "0000"
     * @param {number} difficulty - Number of leading zeros (default 4)
     */
    mineBlock(difficulty = 4) {
        const target = '0'.repeat(difficulty);
        
        console.log(`Mining block ${this.index}...`);
        const startTime = Date.now();
        
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        
        const endTime = Date.now();
        console.log(`Block ${this.index} mined: ${this.hash} (took ${endTime - startTime}ms, nonce: ${this.nonce})`);
    }

    /**
     * Validate the block's hash
     * @returns {boolean}
     */
    isValid() {
        // Recalculate hash and compare
        const calculatedHash = this.calculateHash();
        return calculatedHash === this.hash;
    }

    /**
     * Check if block meets PoW difficulty requirement
     * @param {number} difficulty
     * @returns {boolean}
     */
    hasValidProofOfWork(difficulty = 4) {
        const target = '0'.repeat(difficulty);
        return this.hash.substring(0, difficulty) === target;
    }
}

module.exports = Block;
