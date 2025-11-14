import React, { useState, useEffect } from 'react';
import './LeadManagement.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: string;
  source?: string;
  notes?: string;
  createdAt: string;
}

interface LeadManagementProps {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  onLogout: () => void;
}


const LeadManagement: React.FC<LeadManagementProps> = ({ user, onLogout }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'NEW',
    source: '',
    notes: ''
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        headers: {
        'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Creating lead with:', newLead); // Debug log
      
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newLead)
      });
      
      console.log('Response status:', response.status); // Debug log
      
      const data = await response.json();
      console.log('Response data:', data); // Debug log
      
      if (data.success) {
        setLeads([data.lead, ...leads]);
        setNewLead({
          name: '',
          email: '',
          phone: '',
          company: '',
          status: 'NEW',
          source: '',
          notes: ''
        });
        setShowAddForm(false);
        alert('✅ Lead created successfully!');
      } else {
        alert(`❌ Failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('❌ Error creating lead. Check console for details.');
    }
  };

  const getStatusClass = (status: string) => {
    const statusClasses: { [key: string]: string } = {
      'NEW': 'status-new',
      'CONTACTED': 'status-contacted',
      'QUALIFIED': 'status-qualified',
      'PROPOSAL': 'status-proposal',
      'NEGOTIATION': 'status-negotiation',
      'WON': 'status-won',
      'LOST': 'status-lost'
    };
    return statusClasses[status] || 'status-new';
  };

  if (loading) {
    return (
      <div className="lead-management">
        <div className="lead-card">
          <p>Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lead-management">
      {/* Header */}
      <div className="lead-header">
        <div>
          <h1 className="dashboard-title">
            CRM Dashboard
        </h1>
          <p className="text-muted">
            Welcome back, {user.name} ({user.role})
          </p>
        </div>
        <div className="flex gap-10">
          <button 
            className="lead-button"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : '+ Add Lead'}
          </button>
          <button 
            className="lead-button danger"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Add Lead Form */}
      {showAddForm && (
        <div className="lead-card">
          <h3 className="mt-0 mb-20">Add New Lead</h3>
          <form onSubmit={handleAddLead}>
            <div className="grid-2-col">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  className="form-input"
                  value={newLead.name}
                  onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  placeholder="Enter lead's full name"
                  required
                  aria-label="Lead name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-input"
                  value={newLead.email}
                  onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  placeholder="Enter email address"
                  required
                  aria-label="Lead email"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  className="form-input"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                  placeholder="Enter phone number"
                  aria-label="Lead phone number"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Company</label>
                <input
                  className="form-input"
                  value={newLead.company}
                  onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                  placeholder="Enter company name"
                  aria-label="Lead company"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={newLead.status}
                  onChange={(e) => setNewLead({...newLead, status: e.target.value})}
                  aria-label="Lead status"
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="PROPOSAL">Proposal</option>
                  <option value="NEGOTIATION">Negotiation</option>
                  <option value="WON">Won</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Source</label>
                <input
                  className="form-input"
                  value={newLead.source}
                  onChange={(e) => setNewLead({...newLead, source: e.target.value})}
                  placeholder="Website, Referral, etc."
                  aria-label="Lead source"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                value={newLead.notes}
                onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                placeholder="Add any additional notes about this lead"
                aria-label="Lead notes"
                rows={4}
              />
            </div>
            <button type="submit" className="lead-button">
              Create Lead
            </button>
          </form>
        </div>
      )}

      {/* Leads List */}
      <div className="lead-card">
        <h3 className="mt-0 mb-20">
          Leads ({leads.length})
        </h3>
        
        {leads.length === 0 ? (
          <p className="text-muted text-center no-leads-message">
            No leads found. Create your first lead above!
          </p>
        ) : (
          <table className="lead-table">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Email</th>
                <th className="table-header">Company</th>
                <th className="table-header">Status</th>
                <th className="table-header">Source</th>
                <th className="table-header">Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="table-cell">
                    <strong>{lead.name}</strong>
                    {lead.phone && <div className="phone-text">{lead.phone}</div>}
                  </td>
                  <td className="table-cell">{lead.email}</td>
                  <td className="table-cell">{lead.company || '-'}</td>
                  <td className="table-cell">
                    <span className={`status-badge ${getStatusClass(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="table-cell">{lead.source || '-'}</td>
                  <td className="table-cell">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Stats Card */}
      <div className="stats-grid">
        <div className="lead-card">
          <h4 className="text-muted mb-8">Total Leads</h4>
          <p className="stats-number total-leads">
            {leads.length}
          </p>
        </div>
        <div className="lead-card">
          <h4 className="text-muted mb-8">New Leads</h4>
          <p className="stats-number new-leads">
            {leads.filter(lead => lead.status === 'NEW').length}
          </p>
        </div>
        <div className="lead-card">
          <h4 className="text-muted mb-8">Won Leads</h4>
          <p className="stats-number won-leads">
            {leads.filter(lead => lead.status === 'WON').length}
          </p>
        </div>
      </div>
    </div>
  );
};

// MAKE SURE THIS DEFAULT EXPORT IS AT THE END
export default LeadManagement;