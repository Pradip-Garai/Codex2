const axios = require('axios');
require('dotenv').config();

// List of available API keys from environment variables
const API_KEYS = [
   
    process.env.RAPIDAPI_KEY_3,
    process.env.RAPIDAPI_KEY_4,
    process.env.RAPIDAPI_KEY_5,
    process.env.RAPIDAPI_KEY_6, 
    process.env.RAPIDAPI_KEY_7,
    process.env.RAPIDAPI_KEY_1,
    process.env.RAPIDAPI_KEY_2,
    process.env.RAPIDAPI_KEY_8,
    process.env.RAPIDAPI_KEY_9,
    process.env.RAPIDAPI_KEY_10,
    process.env.RAPIDAPI_KEY_11,
    process.env.RAPIDAPI_KEY_12,
].filter(key => key); // Remove any undefined keys

let currentKeyIndex = 0;
let rateLimitExceededKeys = new Set();

const getLanguageById = (lang) => {
    const language = {
        'c': 50,
        'cpp': 54,
        'java': 62,
        'javascript': 63,
        'python': 71
    };
    return language[lang.toLowerCase()];
};


// Get the next available API key
const getNextApiKey = () => {
    // If all keys are exhausted, throw an error
    if (rateLimitExceededKeys.size >= API_KEYS.length) {
        throw new Error('All API keys have exceeded their rate limits');
    }

    // Find the next key that hasn't exceeded rate limit
    let attempts = 0;
    while (attempts < API_KEYS.length) {
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        attempts++;
        
        if (!rateLimitExceededKeys.has(currentKeyIndex)) {
            return API_KEYS[currentKeyIndex];
        }
    }

    throw new Error('No available API keys');
};

// Make a request with automatic key rotation
const makeRequest = async (options) => {
    let lastError = null;
    let attempts = 0;
    const maxAttempts = API_KEYS.length;

    while (attempts < maxAttempts) {
        try {
            const currentKey = process.env.RAPIDAPI_KEY_4 ||  API_KEYS[currentKeyIndex];
            options.headers = {
                ...options.headers,
                'x-rapidapi-key': currentKey,
                'x-rapidapi-host': process.env.RAPIDAPI_HOST
            };

            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            lastError = error;
            
            // Check if rate limit exceeded (429 status code)
            if (error.response && error.response.status === 429) {
                console.log(`Rate limit exceeded for key ${currentKeyIndex + 1}, rotating to next key`);
                rateLimitExceededKeys.add(currentKeyIndex);
                currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
                attempts++;
                
                // Wait a bit before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
            }
            
            // For other errors, rethrow immediately
            throw error;
        }
    }
    
    throw lastError || new Error('Failed to make request after multiple attempts');
};

// Batch submission to Judge0
const submitBatch = async (submissions) => {
    if (!submissions || submissions.length === 0) {
        throw new Error('At least one submission is required');
    }

    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'false'
        },
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            submissions
        }
    };

    try {
        return await makeRequest(options);
    } catch (error) {
        console.error('Judge0 Batch Submission Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to submit to Judge0');
    }
};

// Token submission to check results
const submitToken = async (resultTokens) => {
    if (!resultTokens || resultTokens.length === 0) {
        throw new Error('At least one token is required');
    }

    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultTokens.join(','),
            base64_encoded: 'false',
            fields: '*'
        }
    };

    const fetchResults = async () => {
        try {
            const results = await makeRequest(options);
            return results.submissions || [];
        } catch (error) {
            console.error('Judge0 Token Submission Error:', error.response?.data || error.message);
            throw new Error('Failed to fetch submission results');
        }
    };

    while (true) {
        const results = await fetchResults();
        
        // Check if all submissions have completed (status_id > 2)
        const allCompleted = results.every(r => r.status && r.status.id > 2);
        if (allCompleted) {
            return results;
        }

        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
};

module.exports = { getLanguageById, submitBatch, submitToken };