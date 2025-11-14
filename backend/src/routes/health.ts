import { Router } from 'express';
import { testDatabaseConnection } from '../utils/database';

const router = Router();

// GET /api/health
router.get('/', async (req, res) => {
  try {
    const dbStatus = await testDatabaseConnection();
    
    res.status(200).json({
      success: true,
      message: 'CRM API is healthy!',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: dbStatus ? 'connected' : 'disconnected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: (error as Error).message
    });
  }
});

export default router;