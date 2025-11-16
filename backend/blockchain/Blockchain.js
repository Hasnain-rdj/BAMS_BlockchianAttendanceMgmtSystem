const Block = require('./Block');

/**
 * Base Blockchain Class
 * Manages chain operations, mining, and validation
 */
class Blockchain {
    constructor(chainType = 'generic', parentHash = null) {
        this.chain = [];
        this.difficulty = 4; // PoW difficulty (4 leading zeros)
        this.chainType = chainType;
        this.parentHash = parentHash; // For child chains
        
        // Create genesis block
        this.createGenesisBlock();
    }

    /**
     * Create the first block in the chain
     */
    createGenesisBlock() {
        const genesisData = {
            type: 'genesis',
            chainType: this.chainType,
            message: `Genesis block for ${this.chainType} chain`,
            createdAt: new Date().toISOString()
        };
        
        const genesisBlock = new Block(0, Date.now(), genesisData, this.parentHash || '0');
        genesisBlock.mineBlock(this.difficulty);
        this.chain.push(genesisBlock);
    }

    /**
     * Get the latest block in the chain
     * @returns {Block}
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Add a new block to the chain
     * @param {object} transactions - Block data
     * @returns {Block} - The newly added block
     */
    addBlock(transactions) {
        const latestBlock = this.getLatestBlock();
        const newBlock = new Block(
            this.chain.length,
            Date.now(),
            transactions,
            latestBlock.hash
        );
        
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        
        return newBlock;
    }

    /**
     * Validate the entire blockchain
     * @returns {boolean}
     */
    isChainValid() {
        // Check genesis block
        if (this.chain.length === 0) {
            return false;
        }

        // Validate each block
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Check if current block hash is valid
            if (!currentBlock.isValid()) {
                console.log(`Block ${i} has invalid hash`);
                return false;
            }

            // Check if current block has valid PoW
            if (!currentBlock.hasValidProofOfWork(this.difficulty)) {
                console.log(`Block ${i} has invalid proof of work`);
                return false;
            }

            // Check if prev_hash matches
            if (currentBlock.prev_hash !== previousBlock.hash) {
                console.log(`Block ${i} has invalid prev_hash`);
                return false;
            }
        }

        return true;
    }

    /**
     * Get all blocks in the chain
     * @returns {Array<Block>}
     */
    getAllBlocks() {
        return this.chain;
    }

    /**
     * Get block by index
     * @param {number} index
     * @returns {Block|null}
     */
    getBlockByIndex(index) {
        return this.chain[index] || null;
    }

    /**
     * Get chain statistics
     * @returns {object}
     */
    getStats() {
        return {
            chainType: this.chainType,
            length: this.chain.length,
            latestHash: this.getLatestBlock().hash,
            isValid: this.isChainValid(),
            difficulty: this.difficulty
        };
    }

    /**
     * Export chain to JSON
     * @returns {object}
     */
    toJSON() {
        return {
            chainType: this.chainType,
            parentHash: this.parentHash,
            difficulty: this.difficulty,
            chain: this.chain
        };
    }

    /**
     * Load chain from JSON
     * @param {object} data
     */
    fromJSON(data) {
        this.chainType = data.chainType;
        this.parentHash = data.parentHash;
        this.difficulty = data.difficulty;
        this.chain = data.chain.map(blockData => {
            const block = new Block(
                blockData.index,
                blockData.timestamp,
                blockData.transactions,
                blockData.prev_hash
            );
            block.nonce = blockData.nonce;
            block.hash = blockData.hash;
            return block;
        });
    }
}

module.exports = Blockchain;
