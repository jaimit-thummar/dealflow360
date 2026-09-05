import React, { useState } from 'react';
import { ApprovalRecord, ApprovalStatus } from '../../types';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
  ChevronRight,
  User,
  Clock,
  Send,
  SlidersHorizontal,
} from 'lucide-react';

interface ApprovalDetailRecord {
  id: string;
  quotationCode: string;
  customerName: string;
  blendedRisk: 'HIGH' | 'MEDIUM' | 'LOW';
  customerTier: 'Gold' | 'Enterprise' | 'Platinum' | 'Standard';
  stage: 'Sales Manager' | 'Finance' | 'Auto-Approved' | 'VP Sales';
  assignedTo: string;
  flaggedLines: {
    line: string;
    category: string;
    discountGiven: number;
    limitAllowed: number;
    overByText: string;
    isOver: boolean;
  }[];
  progressionSteps: {
    label: string;
    status: 'completed' | 'active' | 'pending';
  }[];
  auditHistory: {
    user: string;
    action: string;
    date: string;
    note: string;
  }[];
}

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
  // Sample approval detail records from prompt specifications
  const approvalItems: ApprovalDetailRecord[] = [
    {
      id: 'app-1042',
      quotationCode: 'Q-1042',
      customerName: 'Acme Corp',
      blendedRisk: 'HIGH',
      customerTier: 'Gold',
      stage: 'Sales Manager',
      assignedTo: 'M. Shah',
      flaggedLines: [
        {
          line: 'Laptop (Hardware)',
          category: 'Hardware',
          discountGiven: 12,
          limitAllowed: 15,
          overByText: '0 pt — OK',
          isOver: false,
        },
        {
          line: 'Setup Service (Services)',
          category: 'Services',
          discountGiven: 18,
          limitAllowed: 10,
          overByText: '8 pt OVER',
          isOver: true,
        },
      ],
      progressionSteps: [
        { label: 'Submitted', status: 'completed' },
        { label: 'Sales Manager', status: 'active' },
        { label: 'Finance', status: 'pending' },
        { label: 'Confirmed', status: 'pending' },
      ],
      auditHistory: [
        { user: 'J. Rao', action: 'Submitted', date: 'Aug 20', note: 'Initial 12% discount' },
        { user: 'M. Shah', action: 'Returned', date: 'Aug 21', note: 'Requested justification' },
        { user: 'J. Rao', action: 'Resubmitted', date: 'Aug 22', note: 'Added manager note' },
      ],
    },
    {
      id: 'app-1039',
      quotationCode: 'Q-1039',
      customerName: 'Beta Industries',
      blendedRisk: 'MEDIUM',
      customerTier: 'Enterprise',
      stage: 'Finance',
      assignedTo: 'R. Iyer',
      flaggedLines: [
        {
          line: 'Docking Station (Hardware)',
          category: 'Hardware',
          discountGiven: 14,
          limitAllowed: 15,
          overByText: '0 pt — OK',
          isOver: false,
        },
        {
          line: 'Care Plan 2yr (Support)',
          category: 'Support',
          discountGiven: 16,
          limitAllowed: 15,
          overByText: '1 pt OVER',
          isOver: true,
        },
      ],
      progressionSteps: [
        { label: 'Submitted', status: 'completed' },
        { label: 'Sales Manager', status: 'completed' },
        { label: 'Finance', status: 'active' },
        { label: 'Confirmed', status: 'pending' },
      ],
      auditHistory: [
        { user: 'D. Chen', action: 'Submitted', date: 'Aug 19', note: 'Strategic account renewal' },
        { user: 'R. Iyer', action: 'Under Review', date: 'Aug 20', note: 'Checking credit terms' },
      ],
    },
    {
      id: 'app-1035',
      quotationCode: 'Q-1035',
      customerName: 'Nova Retail',
      blendedRisk: 'LOW',
      customerTier: 'Standard',
      stage: 'Auto-Approved',
      assignedTo: 'System',
      flaggedLines: [
        {
          line: 'Laptop Pro 14 (Hardware)',
          category: 'Hardware',
          discountGiven: 5,
          limitAllowed: 15,
          overByText: '0 pt — OK',
          isOver: false,
        },
      ],
      progressionSteps: [
        { label: 'Submitted', status: 'completed' },
        { label: 'Sales Manager', status: 'completed' },
        { label: 'Finance', status: 'completed' },
        { label: 'Confirmed', status: 'completed' },
      ],
      auditHistory: [
        { user: 'S. Jenkins', action: 'Submitted', date: 'Aug 18', note: 'Standard list pricing' },
        { user: 'System', action: 'Auto-Approved', date: 'Aug 18', note: 'Passed all margin guardrails' },
      ],
    },
  ];

  const [selectedItem, setSelectedItem] = useState<ApprovalDetailRecord>(approvalItems[0]);
  const [actionFeedback, setActionFeedback] = useState<{ id: string; message: string; type: 'approve' | 'return' | 'reject' } | null>(null);

  const handleAction = (type: 'approve' | 'return' | 'reject') => {
    let msg = '';
    if (type === 'approve') msg = `Quotation ${selectedItem.quotationCode} approved and released to next stage.`;
    if (type === 'return') msg = `Quotation ${selectedItem.quotationCode} returned to sales representative for revision.`;
    if (type === 'reject') msg = `Quotation ${selectedItem.quotationCode} rejected due to margin policy violation.`;

    setActionFeedback({ id: selectedItem.id, message: msg, type });
  };

  return (
    <div style={{ paddingBottom: '32px' }}>
      {/* Top Page Header */}
      <div className="page-header-row" style={{ marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#38d9ff', fontWeight: 700, letterSpacing: '0.05em' }}>
              Governance & Compliance
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <span style={{ fontSize: '12px', color: '#9aa8ba' }}>Multi-Tier Discount Routing Engine</span>
          </div>
          <h1 className="page-title" style={{ fontSize: '22px', fontWeight: 800, color: '#f5f7fa', margin: 0 }}>
            Approval Router
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#31d38a', backgroundColor: 'rgba(49,211,138,0.12)', padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(49,211,138,0.3)', fontWeight: 600 }}>
          <ShieldCheck size={16} /> Commercial Delegation Active
        </div>
      </div>

      {/* TOP SUMMARY (3 Pending, 1 Returned, 12 Approved) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="kpi-glass-card" style={{ borderLeft: '3px solid #f5b544' }}>
          <div className="kpi-head" style={{ marginBottom: '6px' }}>
            <span className="kpi-label" style={{ fontSize: '13px', color: '#9aa8ba', fontWeight: 600 }}>Pending Review</span>
            <CheckSquare size={16} style={{ color: '#f5b544' }} />
          </div>
          <div className="kpi-main-val font-mono" style={{ fontSize: '24px', fontWeight: 800, color: '#f5b544' }}>
            3 Pending
          </div>
          <div style={{ fontSize: '12px', color: '#9aa8ba', marginTop: '4px' }}>
            Requires manager sign-off action
          </div>
        </div>

        <div className="kpi-glass-card" style={{ borderLeft: '3px solid #38d9ff' }}>
          <div className="kpi-head" style={{ marginBottom: '6px' }}>
            <span className="kpi-label" style={{ fontSize: '13px', color: '#9aa8ba', fontWeight: 600 }}>Returned for Revision</span>
            <RotateCcw size={16} style={{ color: '#38d9ff' }} />
          </div>
          <div className="kpi-main-val font-mono" style={{ fontSize: '24px', fontWeight: 800, color: '#38d9ff' }}>
            1 Returned
          </div>
          <div style={{ fontSize: '12px', color: '#9aa8ba', marginTop: '4px' }}>
            Awaiting sales rep justification
          </div>
        </div>

        <div className="kpi-glass-card" style={{ borderLeft: '3px solid #31d38a' }}>
          <div className="kpi-head" style={{ marginBottom: '6px' }}>
            <span className="kpi-label" style={{ fontSize: '13px', color: '#9aa8ba', fontWeight: 600 }}>Approved YTD</span>
            <CheckCircle2 size={16} style={{ color: '#31d38a' }} />
          </div>
          <div className="kpi-main-val font-mono" style={{ fontSize: '24px', fontWeight: 800, color: '#31d38a' }}>
            12 Approved
          </div>
          <div style={{ fontSize: '12px', color: '#9aa8ba', marginTop: '4px' }}>
            Audit compliance log reconciled
          </div>
        </div>
      </div>

      {/* APPROVAL LIST TABLE */}
      <div className="glass-panel" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquare size={16} style={{ color: '#38d9ff' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>
              Governance Approval Queue
            </h3>
          </div>
          <span style={{ fontSize: '12px', color: '#9aa8ba' }}>
            Select a row to inspect flagged discount details
          </span>
        </div>

        <div className="table-glass-wrapper">
          <table className="table-glass">
            <thead>
              <tr>
                <th>Quotation</th>
                <th>Customer</th>
                <th>Blended Risk</th>
                <th>Stage</th>
                <th>Assigned To</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {approvalItems.map((item) => {
                const isSelected = selectedItem.id === item.id;

                return (
                  <tr
                    key={item.id}
                    className="clickable"
                    onClick={() => setSelectedItem(item)}
                    style={{
                      background: isSelected ? 'rgba(47, 140, 255, 0.12)' : undefined,
                    }}
                  >
                    <td className="font-mono" style={{ fontWeight: 700, color: '#2f8cff' }}>
                      {item.quotationCode}
                    </td>
                    <td>
                      <strong style={{ color: '#f5f7fa', fontWeight: 600 }}>{item.customerName}</strong>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: item.blendedRisk === 'HIGH' ? 'rgba(255, 107, 114, 0.15)' : item.blendedRisk === 'MEDIUM' ? 'rgba(245, 181, 68, 0.15)' : 'rgba(49, 211, 138, 0.15)',
                          color: item.blendedRisk === 'HIGH' ? '#ff6b72' : item.blendedRisk === 'MEDIUM' ? '#f5b544' : '#31d38a',
                        }}
                      >
                        {item.blendedRisk}
                      </span>
                    </td>
                    <td>
                      <span className="badge-glass badge-glass-neutral">{item.stage}</span>
                    </td>
                    <td style={{ fontSize: '13px', color: '#cbd5e1' }}>
                      {item.assignedTo}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-glass btn-glass-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                        style={{ fontSize: '11px', padding: '2px 8px' }}
                      >
                        Inspect <ChevronRight size={11} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPROVAL DETAIL INSPECTOR PANEL */}
      <div className="glass-panel" style={{ marginBottom: 0 }}>
        {/* Detail Header Context (Blended Risk: HIGH, Customer Tier: Gold) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: '#38d9ff' }}>
                {selectedItem.quotationCode}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
              <strong style={{ fontSize: '16px', color: '#f5f7fa' }}>{selectedItem.customerName}</strong>
            </div>
            <div style={{ fontSize: '12px', color: '#9aa8ba', marginTop: '2px' }}>
              Approval Inspector & Risk Analysis
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '6px',
                background: selectedItem.blendedRisk === 'HIGH' ? 'rgba(255, 107, 114, 0.15)' : 'rgba(245, 181, 68, 0.15)',
                color: selectedItem.blendedRisk === 'HIGH' ? '#ff6b72' : '#f5b544',
                border: `1px solid ${selectedItem.blendedRisk === 'HIGH' ? 'rgba(255, 107, 114, 0.3)' : 'rgba(245, 181, 68, 0.3)'}`,
              }}
            >
              Blended Risk: {selectedItem.blendedRisk}
            </div>

            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#f5f7fa',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              Customer Tier: {selectedItem.customerTier}
            </div>
          </div>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && actionFeedback.id === selectedItem.id && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: actionFeedback.type === 'approve' ? 'rgba(49, 211, 138, 0.15)' : actionFeedback.type === 'return' ? 'rgba(56, 217, 255, 0.15)' : 'rgba(255, 107, 114, 0.15)',
              color: actionFeedback.type === 'approve' ? '#31d38a' : actionFeedback.type === 'return' ? '#38d9ff' : '#ff6b72',
              border: `1px solid ${actionFeedback.type === 'approve' ? 'rgba(49, 211, 138, 0.3)' : actionFeedback.type === 'return' ? 'rgba(56, 217, 255, 0.3)' : 'rgba(255, 107, 114, 0.3)'}`,
            }}
          >
            <CheckCircle2 size={16} /> {actionFeedback.message}
          </div>
        )}

        {/* SECTION: "Why This Quote Was Flagged" */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <AlertTriangle size={16} style={{ color: '#f5b544' }} />
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>
              Why This Quote Was Flagged
            </h4>
          </div>

          <div className="table-glass-wrapper">
            <table className="table-glass">
              <thead>
                <tr>
                  <th>Line</th>
                  <th className="number-cell">Discount Given</th>
                  <th className="number-cell">Limit Allowed</th>
                  <th style={{ textAlign: 'center' }}>Over By</th>
                </tr>
              </thead>
              <tbody>
                {selectedItem.flaggedLines.map((line, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong style={{ color: '#f5f7fa', fontWeight: 600 }}>{line.line}</strong>
                    </td>
                    <td className="number-cell font-mono" style={{ color: line.isOver ? '#f5b544' : '#f5f7fa', fontWeight: 600 }}>
                      {line.discountGiven}%
                    </td>
                    <td className="number-cell font-mono" style={{ color: '#9aa8ba' }}>
                      {line.limitAllowed}%
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {line.isOver ? (
                        <span
                          style={{
                            background: 'rgba(245, 181, 68, 0.2)',
                            color: '#f5b544',
                            border: '1px solid rgba(245, 181, 68, 0.4)',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {line.overByText}
                        </span>
                      ) : (
                        <span
                          style={{
                            background: 'rgba(49, 211, 138, 0.15)',
                            color: '#31d38a',
                            border: '1px solid rgba(49, 211, 138, 0.3)',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {line.overByText}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* HORIZONTAL APPROVAL PROGRESSION STEPPER */}
        <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(7, 17, 31, 0.5)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#9aa8ba', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '12px' }}>
            Horizontal Approval Progression
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {selectedItem.progressionSteps.map((step, idx) => {
              const isDone = step.status === 'completed';
              const isActive = step.status === 'active';

              return (
                <React.Fragment key={idx}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: isDone ? '#31d38a' : isActive ? '#f5b544' : 'rgba(255,255,255,0.1)',
                        color: isDone || isActive ? '#07111f' : '#9aa8ba',
                      }}
                    >
                      {isDone ? <CheckCircle2 size={15} /> : idx + 1}
                    </div>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: isActive || isDone ? 700 : 500,
                        color: isDone ? '#31d38a' : isActive ? '#f5b544' : '#9aa8ba',
                      }}
                    >
                      {step.label}
                    </span>
                  </div>

                  {idx < selectedItem.progressionSteps.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: '2px',
                        margin: '0 12px',
                        background: isDone ? '#31d38a' : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* AUDIT HISTORY TABLE */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Clock size={16} style={{ color: '#38d9ff' }} />
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>
              Audit History & Compliance Logs
            </h4>
          </div>

          <div className="table-glass-wrapper">
            <table className="table-glass">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Date</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {selectedItem.auditHistory.map((log, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong style={{ color: '#f5f7fa', fontWeight: 600 }}>{log.user}</strong>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: log.action === 'Submitted' || log.action === 'Resubmitted' ? 'rgba(56, 217, 255, 0.15)' : log.action === 'Returned' ? 'rgba(245, 181, 68, 0.15)' : 'rgba(49, 211, 138, 0.15)',
                          color: log.action === 'Submitted' || log.action === 'Resubmitted' ? '#38d9ff' : log.action === 'Returned' ? '#f5b544' : '#31d38a',
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="font-mono" style={{ fontSize: '12px', color: '#9aa8ba' }}>
                      {log.date}
                    </td>
                    <td style={{ fontSize: '12px', color: '#cbd5e1' }}>
                      {log.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ACTION BUTTONS (Approve, Return for Revision, Reject) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            className="btn-glass btn-glass-secondary"
            onClick={() => handleAction('return')}
            style={{ fontWeight: 600 }}
          >
            <RotateCcw size={14} /> Return for Revision
          </button>

          <button
            className="btn-glass btn-glass-danger"
            onClick={() => handleAction('reject')}
            style={{ fontWeight: 600 }}
          >
            <XCircle size={14} /> Reject
          </button>

          <button
            className="btn-glass btn-glass-success"
            onClick={() => handleAction('approve')}
            style={{ fontWeight: 600 }}
          >
            <CheckCircle2 size={14} /> Approve
          </button>
        </div>
      </div>
    </div>
  );
};

