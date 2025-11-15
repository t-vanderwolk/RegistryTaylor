import express from 'express';

import { requireAuth } from '../middleware/auth.js';
import { fetchRegistryData } from '../services/registryService.js';

const router = express.Router();

router.get('/', requireAuth, async (_req, res) => {
  try {
    const data = await fetchRegistryData();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to load registry.',
    });
  }
});

export default router;
