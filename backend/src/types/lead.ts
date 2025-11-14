// Use string literals instead of Prisma enums for now
export type LeadStatus = 
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'PROPOSAL'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST';

export type ActivityType = 
  | 'CALL'
  | 'MEETING'
  | 'EMAIL'
  | 'NOTE'
  | 'TASK';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  status: LeadStatus;
  source?: string | null;
  notes?: string | null;
  assignedToId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Include relations that might be returned
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  } | null;
  activities?: Activity[];
}

export interface LeadCreateInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status?: LeadStatus;
  source?: string;
  notes?: string;
  assignedToId?: string;
}

export interface LeadUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: LeadStatus;
  source?: string;
  notes?: string;
  assignedToId?: string;
}

export interface LeadResponse {
  success: boolean;
  message: string;
  lead?: Lead;
  leads?: Lead[];
  count?: number;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  completed: boolean;
  leadId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ActivityCreateInput {
  type: ActivityType;
  title: string;
  description?: string;
  dueDate?: Date;
  leadId: string;
}