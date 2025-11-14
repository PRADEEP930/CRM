import { Request, Response } from 'express';
import prisma from '../utils/database';
import { LeadCreateInput, LeadUpdateInput, LeadResponse, LeadStatus } from '../types/lead';

export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const leadData: LeadCreateInput = req.body;
    const userId = req.user?.id;

    const lead = await prisma.lead.create({
      data: {
        ...leadData,
        assignedToId: leadData.assignedToId || userId
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    const response: LeadResponse = {
      success: true,
      message: 'Lead created successfully',
      lead
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { company: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // If user is not admin, only show their assigned leads
    if (req.user?.role !== 'ADMIN') {
      where.assignedToId = req.user?.id;
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          activities: {
            take: 5,
            orderBy: { createdAt: 'desc' }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.lead.count({ where })
    ]);

    const response: LeadResponse = {
      success: true,
      message: 'Leads fetched successfully',
      leads,
      count: total
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        activities: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
      return;
    }

    // Check if user has permission to view this lead
    if (req.user?.role !== 'ADMIN' && lead.assignedToId !== req.user?.id) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your assigned leads.'
      });
      return;
    }

    const response: LeadResponse = {
      success: true,
      message: 'Lead fetched successfully',
      lead
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const leadData: LeadUpdateInput = req.body;

    // Check if lead exists and user has permission
    const existingLead = await prisma.lead.findUnique({ where: { id } });
    
    if (!existingLead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
      return;
    }

    if (req.user?.role !== 'ADMIN' && existingLead.assignedToId !== req.user?.id) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your assigned leads.'
      });
      return;
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: leadData,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    const response: LeadResponse = {
      success: true,
      message: 'Lead updated successfully',
      lead
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if lead exists and user has permission
    const existingLead = await prisma.lead.findUnique({ where: { id } });
    
    if (!existingLead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
      return;
    }

    if (req.user?.role !== 'ADMIN' && existingLead.assignedToId !== req.user?.id) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your assigned leads.'
      });
      return;
    }

    await prisma.lead.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
