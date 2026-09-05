import React from 'react';
import { Quotation, ApprovalRecord, FulfillmentRecord, SubscriptionRecord, DealHealthScore, ModuleType } from '../../types';
import { Badge } from '../common/Badge';
import {
  DollarSign,
  CheckSquare,
  TrendingDown,
  Repeat,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  Activity,
  Plus,
  Warehouse,
  BarChart2,
  Building2,
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
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;

  return (
    <div>
      {/* Top Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Good Morning, Rahul 👋</h1>
          <p className="page-subheading">Here's what's happening with your pipeline today.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-glass btn-glass-secondary" onClick={() => setActiveModule('reports')}>
            View Analytics Report
          </button>
          <button className="btn-glass btn-glass-primary" onClick={onOpenCreateModal}>
            <Plus size={15} /> Create Quotation
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="kpi-row">
        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Total Pipeline Value</span>
            <div className="kpi-icon-box">
              <DollarSign size={16} style={{ color: '#38d9ff' }} />
            </div>
          </div>
          <div className="kpi-main-val">$283,767</div>
          <div className="kpi-sub-label" style={{ color: '#31d38a' }}>
            <ArrowUpRight size={13} /> +14.2% from last month
          </div>
        </div>

        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Pending Approvals</span>
            <div className="kpi-icon-box">
              <CheckSquare size={16} style={{ color: '#f5b544' }} />
            </div>
          </div>
          <div className="kpi-main-val" style={{ color: '#f5b544' }}>
            4
          </div>
          <div className="kpi-sub-label" style={{ color: '#f5b544' }}>
            Needs your attention
          </div>
        </div>

        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Avg Discount Rate</span>
            <div className="kpi-icon-box">
              <TrendingDown size={16} style={{ color: '#9aa8ba' }} />
            </div>
          </div>
          <div className="kpi-main-val">7.9%</div>
          <div className="kpi-sub-label">Rep delegation limit: 10.0%</div>
        </div>

        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Monthly Recurring (MRR)</span>
            <div className="kpi-icon-box">
              <Repeat size={16} style={{ color: '#8b5cf6' }} />
            </div>
          </div>
          <div className="kpi-main-val">$6,300</div>
          <div className="kpi-sub-label" style={{ color: '#38d9ff' }}>
            ARR: $75,600
          </div>
        </div>
      </div>

      {/* Full-width Glass Approval Warning Alert */}
      {pendingApprovalsCount > 0 && (
        <div className="alert-glass-warning">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(245, 181, 68, 0.2)', padding: '8px', borderRadius: '8px', color: '#f5b544' }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '14px', color: '#f5b544' }}>
                1 quotation awaiting discount approval
              </strong>
              <p style={{ fontSize: '13px', color: '#9aa8ba', marginTop: '2px' }}>
                High-discount requests require Manager or VP Sales sign-off based on your approval matrix.
              </p>
            </div>
          </div>

          <button
            className="btn-glass btn-glass-secondary btn-sm"
            onClick={() => setActiveModule('approvals')}
          >
            Review Queue <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* Main Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Left Panel: Recent Quotation Proposals */}
        <div className="glass-panel" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f5f7fa' }}>Recent Quotation Proposals</h3>
            <button
              className="btn-glass btn-glass-secondary btn-sm"
              onClick={() => setActiveModule('quotations')}
            >
              View All Quotations ({quotations.length}) <ChevronRight size={13} />
            </button>
          </div>

          <div className="table-glass-wrapper">
            <table className="table-glass">
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
                {quotations.map((q) => (
                  <tr key={q.id} className="clickable" onClick={() => onSelectQuotation(q)}>
                    <td className="font-mono" style={{ fontWeight: 700, color: '#2f8cff' }}>{q.code}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#f5f7fa' }}>{q.customerName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Rep: {q.salesRep}</div>
                    </td>
                    <td className="number-cell font-mono" style={{ fontWeight: 700 }}>
                      ${q.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td
                      className="number-cell font-mono"
                      style={{ color: q.marginPct < 20 ? '#ff6b72' : '#31d38a', fontWeight: 600 }}
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

        {/* Right Panel: Deal Risk Diagnostic */}
        <div className="glass-panel" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f5f7fa', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} style={{ color: '#38d9ff' }} /> Deal Risk Diagnostic
              </h3>
              <button
                className="btn-glass btn-glass-secondary btn-sm"
                onClick={() => setActiveModule('deal-health')}
              >
                Full Diagnostic
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {dealHealthScores.map((score) => (
                <div
                  key={score.id}
                  className="glass-card"
                  style={{
                    borderLeft: `3px solid ${
                      score.riskLevel === 'High Risk'
                        ? '#ff6b72'
                        : score.riskLevel === 'Moderate Risk'
                        ? '#f5b544'
                        : '#31d38a'
                    }`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '13px', color: '#f5f7fa' }}>{score.quotationCode} ({score.customerName})</strong>
                      <div style={{ fontSize: '11px', color: '#9aa8ba', marginTop: '2px' }}>
                        Risk Level: <span style={{ fontWeight: 600, color: score.riskLevel === 'High Risk' ? '#ff6b72' : '#31d38a' }}>{score.riskLevel}</span>
                      </div>
                    </div>

                    <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: score.overallScore < 70 ? '#ff6b72' : '#31d38a' }}>
                      {score.overallScore}/100
                    </div>
                  </div>

                  {/* Micro Progress Bar */}
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${score.overallScore}%`,
                        background: score.overallScore < 70 ? '#ff6b72' : '#31d38a',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: 3 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {/* Panel 1: Pipeline by Stage */}
        <div className="glass-panel" style={{ marginBottom: 0 }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#f5f7fa', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BarChart2 size={16} style={{ color: '#2f8cff' }} /> Pipeline by Stage
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#9aa8ba' }}>Draft</span>
                <span className="font-mono" style={{ color: '#f5f7fa' }}>$19,700 (15%)</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '15%', height: '100%', background: '#9aa8ba' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#f5b544' }}>Pending Approval</span>
                <span className="font-mono" style={{ color: '#f5f7fa' }}>$55,786 (32%)</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '32%', height: '100%', background: '#f5b544' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#38d9ff' }}>Negotiation (Counter)</span>
                <span className="font-mono" style={{ color: '#f5f7fa' }}>$23,170 (18%)</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '18%', height: '100%', background: '#38d9ff' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#31d38a' }}>Confirmed & Approved</span>
                <span className="font-mono" style={{ color: '#f5f7fa' }}>$105,110 (35%)</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '35%', height: '100%', background: '#31d38a' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Top Customers */}
        <div className="glass-panel" style={{ marginBottom: 0 }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#f5f7fa', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={16} style={{ color: '#8b5cf6' }} /> Top Revenue Accounts
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#f5f7fa' }}>Beta Industries</strong>
                <div style={{ fontSize: '11px', color: '#9aa8ba' }}>Strategic Account</div>
              </div>
              <span className="font-mono" style={{ fontWeight: 700, color: '#31d38a' }}>$105,110</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#f5f7fa' }}>Acme Corp</strong>
                <div style={{ fontSize: '11px', color: '#9aa8ba' }}>Enterprise Tier</div>
              </div>
              <span className="font-mono" style={{ fontWeight: 700, color: '#2f8cff' }}>$55,786</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#f5f7fa' }}>Zenith Co</strong>
                <div style={{ fontSize: '11px', color: '#9aa8ba' }}>Mid-Market Tier</div>
              </div>
              <span className="font-mono" style={{ fontWeight: 700, color: '#f5b544' }}>$23,170</span>
            </div>
          </div>
        </div>

        {/* Panel 3: Warehouse Utilization */}
        <div className="glass-panel" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#f5f7fa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Warehouse size={16} style={{ color: '#31d38a' }} /> Warehouse Utilization
              </h4>
              <button className="btn-glass btn-glass-secondary btn-sm" onClick={() => setActiveModule('fulfillment')}>
                Fulfillment Board
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                <span>Dallas Hub (HUB-01)</span>
                <strong className="font-mono" style={{ color: '#31d38a' }}>84% Capacity (420 Stock)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                <span>Chicago Hub (HUB-02)</span>
                <strong className="font-mono" style={{ color: '#2f8cff' }}>1 Order Dispatched</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                <span>Frankfurt Hub (HUB-03)</span>
                <strong className="font-mono" style={{ color: '#9aa8ba' }}>Standby</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
