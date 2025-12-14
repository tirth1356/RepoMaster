import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // relative path to Next.js API routes
  timeout: 30000,
});

// Call analyze API
export async function analyzeRepository(url) {
  try {
    const response = await apiClient.post('/analyze', { url });
    return response.data; // response.data is already { success: true, data }
  } catch (error) {
    if (error.response) throw new Error(error.response.data.error || 'Analysis failed');
    throw new Error(error.message || 'Failed to connect to analysis service');
  }
}

// Call health check API
export async function healthCheck() {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch {
    return null;
  }
}
