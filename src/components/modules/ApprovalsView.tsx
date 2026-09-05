import React, { useState } from 'react';
import { ApprovalRecord, ApprovalStatus } from '../../types';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  CheckSquare,
  CheckCircle,
  XCircle,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
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
      {/* Top Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Automated Approval Router</h1>
          <p className="page-subheading">
            Governance controls, multi-tier discount delegation limits, and margin protection audit logs.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#31d38a', backgroundColor: 'rgba(49,211,138,0.12)', padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(49,211,138,0.3)', fontWeight: 600 }}>
          <ShieldCheck size={16} /> Automated Guardrails Active
        </div>
      </div>

      {/* Summary KPI Counter Cards */}
      <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '20px' }}>
        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Pending Review</span>
            <CheckSquare size={16} style={{ color: '#f5b544' }} />
          </div>
          <div className="kpi-main-val" style={{ color: '#f5b544' }}>
            3 Pending
          </div>
          <div className="kpi-sub-label">Requires manager action</div>
        </div>

        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Returned for Revision</span>
            <RotateCcw size={16} style={{ color: '#38d9ff' }} />
          </div>
          <div className="kpi-main-val" style={{ color: '#38d9ff' }}>
            1 Returned
          </div>
          <div className="kpi-sub-label">Awaiting sales rep resubmission</div>
        </div>

        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Approved YTD</span>
            <CheckCircle size={16} style={{ color: '#31d38a' }} />
          </div>
          <div className="kpi-main-val" style={{ color: '#31d38a' }}>
            12 Approved
          </div>
          <div className="kpi-sub-label">Audit logs reconciled</div>
        </div>
      </div>

      {/* Visual Approval Progression Stepper */}
      <div className="glass-panel" style={{ padding: '16px 24px', marginBottom: '20px' }}>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>
          Visual Governance Progression Flow
        </div>

        <div className="stepper-row">
          <div className="stepper-step completed">
            <CheckCircle size={16} />
            <span>1. Submitted</span>
          </div>
          <div className="stepper-line completed" />
          <div className="stepper-step active">
            <CheckSquare size={16} />
            <span>2. Sales Manager</span>
          </div>
          <div className="stepper-line" />
          <div className="stepper-step">
            <span>3. Finance Controller</span>
          </div>
          <div className="stepper-line" />
          <div className="stepper-step">
            <span>4. Confirmed</span>
          </div>
        </div>
      </div>

      {/* Approvals Table */}
      {filteredApprovals.length === 0 ? (
        <EmptyState
          title="No approval requests in queue"
          description="All quotation proposals comply with standard representative delegation rules."
        />
      ) : (
        <div className="table-glass-wrapper">
          <table className="table-glass">
            <thead>
              <tr>
                <th>Quote Code</th>
                <th>Customer Account</th>
                <th>Requested By</th>
                <th className="number-cell">Discount %</th>
                <th className="number-cell">Margin %</th>
                <th className="number-cell">Grand Total</th>
                <th>Risk Profile</th>
                <th>Governance Tier</th>
                <th>Status</th>
                <th className="number-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApprovals.map((a) => (
                <tr key={a.id}>
                  <td className="font-mono" style={{ fontWeight: 700, color: '#2f8cff' }}>
                    {a.quotationCode}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f5f7fa' }}>{a.customerName}</div>
                  </td>
                  <td>{a.salesRep}</td>
                  <td className="number-cell font-mono" style={{ fontWeight: 700, color: a.requestedDiscountPct > 15 ? '#f5b544' : '#f5f7fa' }}>
                    {a.requestedDiscountPct.toFixed(1)}%
                  </td>
                  <td
                    className="number-cell font-mono"
                    style={{
                      fontWeight: 600,
                      color: a.marginPct < 20 ? '#ff6b72' : '#31d38a',
                    }}
                  >
                    {a.marginPct.toFixed(1)}%
                  </td>
                  <td className="number-cell font-mono" style={{ fontWeight: 700 }}>
                    ${a.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <span className="badge-glass badge-glass-warning">
                      Blended Risk: HIGH
                    </span>
                  </td>
                  <td>
                    <span className="badge-glass badge-glass-neutral">{a.tier}</span>
                  </td>
                  <td>
                    <Badge status={a.status} />
                  </td>
                  <td className="number-cell">
                    {a.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          className="btn-glass btn-glass-success btn-sm"
                          onClick={() => handleOpenActionModal(a, 'approve')}
                        >
                          <CheckCircle size={13} /> Approve
                        </button>
                        <button
                          className="btn-glass btn-glass-danger btn-sm"
                          onClick={() => handleOpenActionModal(a, 'reject')}
                        >
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#9aa8ba' }}>
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
        <div className="search-modal-backdrop">
          <div className="search-modal-box" style={{ width: '540px' }}>
            <div className="search-modal-input-wrap">
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>
                {actionType === 'approve' ? 'Approve Quotation' : 'Reject Quotation'} ({selectedApproval.quotationCode})
              </h3>
            </div>

            <form onSubmit={handleConfirmAction}>
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '16px', fontSize: '13px', color: '#9aa8ba' }}>
                  Customer Account: <strong style={{ color: '#f5f7fa' }}>{selectedApproval.customerName}</strong> | Requested Discount:{' '}
                  <strong className="font-mono" style={{ color: '#f5b544' }}>{selectedApproval.requestedDiscountPct}%</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#9aa8ba' }}>Audit Rationale & Operational Notes *</label>
                  <textarea
                    className="input-glass-select"
                    rows={4}
                    value={rationaleInput}
                    onChange={(e) => setRationaleInput(e.target.value)}
                    placeholder="Provide detailed justification for compliance audit trail..."
                    required
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-glass btn-glass-secondary"
                  onClick={() => {
                    setSelectedApproval(null);
                    setActionType(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn-glass ${actionType === 'approve' ? 'btn-glass-success' : 'btn-glass-danger'}`}
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
