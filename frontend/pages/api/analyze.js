// pages/api/analyze.js
import { analyzeRepositoryLogic } from '../../lib/analyzer.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'Repository URL is required' });
    }

    try {
      const data = await analyzeRepositoryLogic(url);
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
