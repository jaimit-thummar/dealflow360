import React from 'react';
import { Quotation, ApprovalRecord, FulfillmentRecord, SubscriptionRecord, DealHealthScore, ModuleType } from '../../types';
import { Badge } from '../common/Badge';
import {
  DollarSign,
  CheckSquare,
  TrendingDown,
  Truck,
  Repeat,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  Activity,
  Plus,
} from 'lucide-react';

interface DashboardViewProps {
  quotations: Quotation[];
  approvals: ApprovalRecord[];
  fulfillments: FulfillmentRecord[];
  subscriptions: SubscriptionRecord[];
  dealHealthScores: DealHealthScore[];
  setActiveModule: (module: ModuleType) => void;
  onSelectQuotation: (quotation: Quotation) => void;
  onOpenCreateModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  quotations,
  approvals,
  fulfillments,
  subscriptions,
  dealHealthScores,
  setActiveModule,
  onSelectQuotation,
  onOpenCreateModal,
}) => {
  // Calculated Metrics
  const totalPipeline = quotations.reduce((acc, q) => acc + q.grandTotal, 0);
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;
  const avgDiscount =
    quotations.length > 0
      ? quotations.reduce((acc, q) => acc + (q.discountAmount / (q.subtotal || 1)) * 100, 0) / quotations.length
      : 0;

  const totalMrr = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((acc, s) => acc + s.mrr, 0);

  const activeDispatchCount = fulfillments.filter((f) => f.status === 'dispatched' || f.status === 'in_transit').length;

  return (
    <div>
      {/* Dashboard Top Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Sales Operations Command Center</h1>
          <p className="page-subtitle">
            Real-time pipeline monitoring, discount control guardrails, and fulfillment operations.
          </p>
        </div>

        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setActiveModule('reports')}>
            View Analytics Report
          </button>
          <button className="btn btn-primary" onClick={onOpenCreateModal}>
            <Plus size={15} /> Create Quotation
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title">
            <span>Total Active Pipeline</span>
            <DollarSign size={16} style={{ color: '#2563eb' }} />
          </div>
          <div className="kpi-value">
            ${totalPipeline.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="kpi-subtext positive">
            <ArrowUpRight size={12} />
            <span>+14.2% vs previous month</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">
            <span>Pending Approvals</span>
            <CheckSquare size={16} style={{ color: pendingApprovalsCount > 0 ? '#f59e0b' : '#64748b' }} />
          </div>
          <div className="kpi-value" style={{ color: pendingApprovalsCount > 0 ? '#b45309' : '#0f172a' }}>
            {pendingApprovalsCount}
          </div>
          <div className="kpi-subtext warning">
            <span>{pendingApprovalsCount > 0 ? 'Requires controller action' : 'All clear'}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">
            <span>Avg Discount Rate</span>
            <TrendingDown size={16} style={{ color: '#64748b' }} />
          </div>
          <div className="kpi-value">{avgDiscount.toFixed(1)}%</div>
          <div className="kpi-subtext">
            <span>Rep delegation limit: 10.0%</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">
            <span>Monthly Recurring (MRR)</span>
            <Repeat size={16} style={{ color: '#166534' }} />
          </div>
          <div className="kpi-value">
            ${totalMrr.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </div>
          <div className="kpi-subtext positive">
            <span>ARR: ${(totalMrr * 12).toLocaleString('en-US')}</span>
          </div>
        </div>
      </div>

      {/* Operational Alerts Bar */}
      {pendingApprovalsCount > 0 && (
        <div className="alert-banner warning" style={{ cursor: 'pointer' }} onClick={() => setActiveModule('approvals')}>
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <strong>{pendingApprovalsCount} Quotation(s) Awaiting Discount Approval</strong>
            <p style={{ marginTop: '2px' }}>
              High-discount requests exceed standard representative limits and require Manager or VP Sales sign-off.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ backgroundColor: '#ffffff' }}>
            Review Queue <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* Two Column Layout: Recent Quotations & Deal Risk Diagnostic */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Left: Recent Active Quotations Table */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title">Recent Quotation Proposals</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setActiveModule('quotations')}>
              View All Quotations ({quotations.length}) <ChevronRight size={13} />
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Customer</th>
                  <th className="number-cell">Grand Total</th>
                  <th className="number-cell">Margin</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {quotations.slice(0, 5).map((q) => (
                  <tr key={q.id} className="clickable" onClick={() => onSelectQuotation(q)}>
                    <td className="font-mono" style={{ fontWeight: 700, color: '#2563eb' }}>{q.code}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{q.customerName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Rep: {q.salesRep}</div>
                    </td>
                    <td className="number-cell font-mono" style={{ fontWeight: 700 }}>
                      ${q.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td
                      className="number-cell font-mono"
                      style={{ color: q.marginPct < 20 ? '#dc2626' : '#166534', fontWeight: 600 }}
                    >
                      {q.marginPct.toFixed(1)}%
                    </td>
                    <td>
                      <Badge status={q.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Deal Health Overview & Warehouse Hub Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Deal Risk Matrix */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={16} style={{ color: '#2563eb' }} /> Deal Risk Diagnostic
              </span>
              <button className="btn btn-ghost btn-sm" onClick={() => setActiveModule('deal-health')}>
                Full Diagnostic
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {dealHealthScores.map((score) => (
                <div
                  key={score.id}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <strong style={{ color: '#0f172a' }}>{score.quotationCode} ({score.customerName})</strong>
                    <span
                      style={{
                        fontWeight: 700,
                        color: score.overallScore < 70 ? '#dc2626' : '#166534',
                        fontFamily: 'monospace',
                      }}
                    >
                      {score.overallScore}/100
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    Risk Level: <span style={{ fontWeight: 600, color: score.riskLevel === 'High Risk' ? '#991b1b' : '#166534' }}>{score.riskLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warehouse Operations Dispatch */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={16} style={{ color: '#166534' }} /> Warehouse Dispatch Hubs
              </span>
              <button className="btn btn-ghost btn-sm" onClick={() => setActiveModule('fulfillment')}>
                Fulfillment Board
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#f1f5f9', borderRadius: '4px' }}>
                <span>Dallas Hub (HUB-01)</span>
                <strong className="font-mono" style={{ color: '#166534' }}>Operational (420 units)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#f1f5f9', borderRadius: '4px' }}>
                <span>Chicago Hub (HUB-02)</span>
                <strong className="font-mono" style={{ color: '#2563eb' }}>1 Order Dispatched</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#f1f5f9', borderRadius: '4px' }}>
                <span>Frankfurt Hub (HUB-03)</span>
                <strong className="font-mono" style={{ color: '#64748b' }}>Standby</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
