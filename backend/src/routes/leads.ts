import { Router } from 'express';
import prisma from '../utils/database';

const router = Router();

// SIMPLE authentication check
router.use((req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token' });
  }
  // Simple token check - in production use proper JWT verification
  next();
});

// GET /api/leads
router.get('/', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' }
    });
    
    return res.json({  // Use return to prevent double response
      success: true,
      message: 'Leads fetched successfully',
      leads,
      count: leads.length
    });
  } catch (error) {
    console.error('GET leads error:', error);
    return res.status(500).json({  // Use return
      success: false,
      message: 'Error fetching leads'
    });
  }
});

// POST /api/leads
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, status, source, notes } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({  // Use return
        success: false,
        message: 'Name and email are required'
      });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        status: status || 'NEW',
        source: source || null,
        notes: notes || null
      }
    });
    
    console.log('✅ Lead created with ID:', lead.id);
    
    return res.json({  // Use return to prevent double response
      success: true,
      message: 'Lead created successfully',
      lead
    });
  } catch (error) {
    console.error('❌ POST leads error:', error);
    return res.status(500).json({  // Use return
      success: false,
      message: 'Error creating lead: ' + (error as Error).message
    });
  }
});

export default router;