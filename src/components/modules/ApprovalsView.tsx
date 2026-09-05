import React, { useState } from 'react';
import { ApprovalRecord, ApprovalStatus } from '../../types';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  CheckSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  UserCheck,
  FileText,
  Lock,
} from 'lucide-react';

interface ApprovalsViewProps {
  approvals: ApprovalRecord[];
  onApprove: (approvalId: string, rationale: string) => void;
  onReject: (approvalId: string, rationale: string) => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  approvals,
  onApprove,
  onReject,
}) => {
  const [activeTab, setActiveTab] = useState<ApprovalStatus | 'all'>('pending');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRecord | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [rationaleInput, setRationaleInput] = useState('');

  const filteredApprovals = approvals.filter((a) => {
    if (activeTab === 'all') return true;
    return a.status === activeTab;
  });

  const handleOpenActionModal = (approval: ApprovalRecord, type: 'approve' | 'reject') => {
    setSelectedApproval(approval);
    setActionType(type);
    setRationaleInput(
      type === 'approve'
        ? 'Approved within commercial delegation threshold based on strategic customer account tier.'
        : 'Rejected due to insufficient margin contribution.'
    );
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApproval || !actionType) return;

    if (actionType === 'approve') {
      onApprove(selectedApproval.id, rationaleInput);
    } else {
      onReject(selectedApproval.id, rationaleInput);
    }

    setSelectedApproval(null);
    setActionType(null);
    setRationaleInput('');
  };

  return (
    <div>
      {/* Top Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Automated Approval Router</h1>
          <p className="page-subtitle">
            Governance controls, multi-tier discount delegation limits, and margin protection audit logs.
          </p>
        </div>

        <div className="header-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#166534', backgroundColor: '#dcfce7', padding: '6px 12px', borderRadius: '4px', border: '1px solid #bbf7d0', fontWeight: 600 }}>
            <ShieldCheck size={16} /> Automated Guardrails Active
          </div>
        </div>
      </div>

      {/* Policy Rules Overview Card */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}
      >
        <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '16px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
            Tier 1: Manager Threshold
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
            Discount &gt; 10.0% or Margin &lt; 25.0%
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Route to Sales Operations Director</div>
        </div>

        <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '16px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
            Tier 2: Executive Threshold
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#92400e', marginTop: '2px' }}>
            Discount &gt; 20.0% or Margin &lt; 18.0%
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Route to VP of Enterprise Sales</div>
        </div>

        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
            Tier 3: Controller Hold
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#991b1b', marginTop: '2px' }}>
            Credit Limit Overrun or Net 60 Terms
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Route to Finance Controller</div>
        </div>
      </div>

      {/* Tabs Toolbar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '16px', gap: '8px' }}>
        <button
          className={`btn btn-ghost ${activeTab === 'pending' ? 'btn-primary' : ''}`}
          style={{ borderRadius: '4px 4px 0 0', borderBottom: activeTab === 'pending' ? '2px solid #2563eb' : 'none' }}
          onClick={() => setActiveTab('pending')}
        >
          Pending Review ({approvals.filter((a) => a.status === 'pending').length})
        </button>

        <button
          className={`btn btn-ghost ${activeTab === 'approved' ? 'btn-primary' : ''}`}
          style={{ borderRadius: '4px 4px 0 0', borderBottom: activeTab === 'approved' ? '2px solid #2563eb' : 'none' }}
          onClick={() => setActiveTab('approved')}
        >
          Approved Audit Trail ({approvals.filter((a) => a.status === 'approved').length})
        </button>

        <button
          className={`btn btn-ghost ${activeTab === 'all' ? 'btn-primary' : ''}`}
          style={{ borderRadius: '4px 4px 0 0', borderBottom: activeTab === 'all' ? '2px solid #2563eb' : 'none' }}
          onClick={() => setActiveTab('all')}
        >
          All Requests ({approvals.length})
        </button>
      </div>

      {/* Approvals Table */}
      {filteredApprovals.length === 0 ? (
        <EmptyState
          title="No approval requests in queue"
          description="All quotation proposals comply with standard representative delegation rules."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Quote Code</th>
                <th>Customer Account</th>
                <th>Requested By</th>
                <th className="number-cell">Discount %</th>
                <th className="number-cell">Margin %</th>
                <th className="number-cell">Grand Total</th>
                <th>Trigger Rationale</th>
                <th>Governance Tier</th>
                <th>Status</th>
                <th className="number-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApprovals.map((a) => (
                <tr key={a.id}>
                  <td className="font-mono" style={{ fontWeight: 700, color: '#2563eb' }}>
                    {a.quotationCode}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{a.customerName}</div>
                  </td>
                  <td>{a.salesRep}</td>
                  <td className="number-cell font-mono" style={{ fontWeight: 700, color: a.requestedDiscountPct > 15 ? '#b45309' : '#0f172a' }}>
                    {a.requestedDiscountPct.toFixed(1)}%
                  </td>
                  <td
                    className="number-cell font-mono"
                    style={{
                      fontWeight: 600,
                      color: a.marginPct < 20 ? '#dc2626' : '#166534',
                    }}
                  >
                    {a.marginPct.toFixed(1)}%
                  </td>
                  <td className="number-cell font-mono" style={{ fontWeight: 700 }}>
                    ${a.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ fontSize: '12px', color: '#475569', maxWidth: '240px' }}>
                    {a.triggerReason}
                  </td>
                  <td>
                    <span className="badge badge-neutral">{a.tier}</span>
                  </td>
                  <td>
                    <Badge status={a.status} />
                  </td>
                  <td className="number-cell">
                    {a.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleOpenActionModal(a, 'approve')}
                        >
                          <CheckCircle size={13} /> Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleOpenActionModal(a, 'reject')}
                        >
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        By {a.reviewedBy || 'System Controller'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rationale Modal */}
      {selectedApproval && actionType && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: '540px' }}>
            <div className="modal-header">
              <h3 className="card-title" style={{ margin: 0 }}>
                {actionType === 'approve' ? 'Approve Quotation' : 'Reject Quotation'} ({selectedApproval.quotationCode})
              </h3>
            </div>

            <form onSubmit={handleConfirmAction}>
              <div className="modal-body">
                <div style={{ marginBottom: '16px', fontSize: '13px', color: '#475569' }}>
                  Customer Account: <strong>{selectedApproval.customerName}</strong> | Requested Discount:{' '}
                  <strong className="font-mono">{selectedApproval.requestedDiscountPct}%</strong>
                </div>

                <div className="form-group">
                  <label className="form-label">Audit Rationale & Operational Notes *</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={rationaleInput}
                    onChange={(e) => setRationaleInput(e.target.value)}
                    placeholder="Provide detailed justification for compliance audit trail..."
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedApproval(null);
                    setActionType(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn ${actionType === 'approve' ? 'btn-success' : 'btn-danger'}`}
                >
                  {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
