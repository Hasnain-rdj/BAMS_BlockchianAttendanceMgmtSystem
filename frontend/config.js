// API Configuration
// This will be replaced with your actual backend URL after deploying to Render
const API_CONFIG = {
    // For local development
    LOCAL: 'http://localhost:3000/api',
    
    // For production (update this after deploying backend to Render)
    PRODUCTION: 'https://bams-backend.onrender.com/api',
    
    // Auto-detect environment
    get BASE_URL() {
        return window.location.hostname === 'localhost' 
            ? this.LOCAL 
            : this.PRODUCTION;
    }
};

// Export for use in other files
window.API_CONFIG = API_CONFIG;
