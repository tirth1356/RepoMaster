import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export async function analyzeRepository(url) {
  try {
    const response = await apiClient.post('/api/analyze', { url });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Analysis failed');
    }
    throw new Error(error.message || 'Failed to connect to analysis service');
  }
}

export async function healthCheck() {
  try {
    const response = await apiClient.get('/api/health');
    return response.data;
  } catch (error) {
    return null;
  }
}
