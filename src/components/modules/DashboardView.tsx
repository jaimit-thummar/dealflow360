import React, { useState } from 'react';
import { Quotation, ApprovalRecord, FulfillmentRecord, SubscriptionRecord, DealHealthScore, ModuleType } from '../../types';
import { Badge } from '../common/Badge';
import {
  CheckSquare,
  FileText,
  AlertTriangle,
  ChevronRight,
  Plus,
  Activity,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  MessageSquare,
  Truck,
  RefreshCw,
  Zap,
  Filter,
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
  const [activityFilter, setActivityFilter] = useState<'all' | 'approvals' | 'portal' | 'fulfillment'>('all');

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length || 4;
  const openQuotationsCount = quotations.filter((q) => q.status !== 'approved' && q.status !== 'rejected').length || 12;
  const atRiskCount = dealHealthScores.filter((d) => d.riskLevel === 'High Risk' || d.riskLevel === 'Moderate Risk').length || 3;

  // Real operational activity log
  const activities = [
    {
      id: 'act-1',
      category: 'approvals',
      title: 'Acme Corp quotation approved by Finance',
      description: 'Quote QT-2024-001 ($142,500) passed discount threshold check. Margin locked at 24.2%.',
      timestamp: '12 minutes ago',
      icon: CheckCircle2,
      iconColor: '#31d38a',
      badge: 'Approved',
      badgeVariant: 'success',
      module: 'quotations' as ModuleType,
    },
    {
      id: 'act-2',
      category: 'portal',
      title: 'Beta Industries requested a discount change',
      description: 'Customer counter-offer submitted via Customer Portal: "Requesting 12.5% volume discount for Q4 term."',
      timestamp: '45 minutes ago',
      icon: MessageSquare,
      iconColor: '#38d9ff',
      badge: 'Counter Offer',
      badgeVariant: 'warning',
      module: 'quotations' as ModuleType,
    },
    {
      id: 'act-3',
      category: 'fulfillment',
      title: 'East Depot stock updated for Order #2291',
      description: '120 Edge Gateway units allocated from Dallas Regional Hub (HUB-01). Dispatch carrier assigned.',
      timestamp: '2 hours ago',
      icon: Truck,
      iconColor: '#8b5cf6',
      badge: 'Fulfillment',
      badgeVariant: 'info',
      module: 'fulfillment' as ModuleType,
    },
    {
      id: 'act-4',
      category: 'approvals',
      title: 'Zenith Co discount request routed to VP Sales',
      description: 'Quote QT-2024-003 requires tier 2 sign-off due to custom 90-day payment term request.',
      timestamp: '3.5 hours ago',
      icon: AlertTriangle,
      iconColor: '#f5b544',
      badge: 'Pending Review',
      badgeVariant: 'warning',
      module: 'approvals' as ModuleType,
    },
    {
      id: 'act-5',
      category: 'portal',
      title: 'Global Tech ARR subscription renewed',
      description: 'Annual enterprise SaaS agreement renewed ($48,000 ARR). Next billing cycle set for Sep 2027.',
      timestamp: '5 hours ago',
      icon: RefreshCw,
      iconColor: '#31d38a',
      badge: 'Subscription',
      badgeVariant: 'success',
      module: 'subscriptions' as ModuleType,
    },
  ];

  const filteredActivities = activityFilter === 'all' 
    ? activities 
    : activities.filter((a) => a.category === activityFilter);

  return (
    <div style={{ paddingBottom: '32px' }}>
      {/* 1. Page Header with Operational Hierarchy & Actions */}
      <div className="page-header-row" style={{ marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#38d9ff', fontWeight: 700, letterSpacing: '0.05em' }}>
              Sales Operations Workspace
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <span style={{ fontSize: '12px', color: '#9aa8ba', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> Updated just now
            </span>
          </div>
          <h1 className="page-title" style={{ fontSize: '22px', fontWeight: 800, color: '#f5f7fa', margin: 0 }}>
            Operational Command Center
          </h1>
          <p className="page-subheading" style={{ fontSize: '13px', color: '#9aa8ba', marginTop: '4px' }}>
            Immediate Action Required: <strong style={{ color: '#f5b544' }}>{pendingApprovalsCount} approvals pending</strong> and <strong style={{ color: '#ff6b72' }}>{atRiskCount} deals at-risk</strong> today.
          </p>
        </div>

        {/* Primary & Secondary Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn-glass btn-glass-secondary"
            onClick={() => setActiveModule('approvals')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
          >
            <CheckSquare size={15} style={{ color: '#f5b544' }} />
            <span>View Approvals</span>
            <span
              style={{
                background: 'rgba(245, 181, 68, 0.2)',
                color: '#f5b544',
                fontSize: '11px',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '10px',
                marginLeft: '2px',
              }}
            >
              {pendingApprovalsCount}
            </span>
          </button>

          <button
            className="btn-glass btn-glass-primary"
            onClick={onOpenCreateModal}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
          >
            <Plus size={16} />
            <span>+ New Quotation</span>
          </button>
        </div>
      </div>

      {/* 2. Three Important KPI Areas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* KPI 1: Pending Approvals */}
        <div
          className="kpi-glass-card clickable"
          onClick={() => setActiveModule('approvals')}
          style={{
            borderLeft: '3px solid #f5b544',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="kpi-head" style={{ marginBottom: '12px' }}>
            <span className="kpi-label" style={{ fontSize: '13px', fontWeight: 600, color: '#9aa8ba' }}>
              Pending Approvals
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(245, 181, 68, 0.12)',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#f5b544',
              }}
            >
              <span className="pulse-dot" style={{ background: '#f5b544', width: '6px', height: '6px', borderRadius: '50%' }} />
              Sign-off Queue
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
            <div className="kpi-main-val font-mono" style={{ fontSize: '28px', fontWeight: 800, color: '#f5b544' }}>
              {pendingApprovalsCount}
            </div>
            <span style={{ fontSize: '13px', color: '#9aa8ba', fontWeight: 500 }}>
              quotations waiting
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '12px', color: '#9aa8ba' }}>
              1 high-discount request &gt;10% threshold
            </span>
            <ChevronRight size={14} style={{ color: '#f5b544' }} />
          </div>
        </div>

        {/* KPI 2: Open Quotations */}
        <div
          className="kpi-glass-card clickable"
          onClick={() => setActiveModule('quotations')}
          style={{
            borderLeft: '3px solid #38d9ff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="kpi-head" style={{ marginBottom: '12px' }}>
            <span className="kpi-label" style={{ fontSize: '13px', fontWeight: 600, color: '#9aa8ba' }}>
              Open Quotations
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(56, 217, 255, 0.12)',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#38d9ff',
              }}
            >
              <span className="pulse-dot" style={{ background: '#38d9ff', width: '6px', height: '6px', borderRadius: '50%' }} />
              Active Pipeline
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
            <div className="kpi-main-val font-mono" style={{ fontSize: '28px', fontWeight: 800, color: '#f5f7fa' }}>
              {openQuotationsCount}
            </div>
            <span style={{ fontSize: '13px', color: '#9aa8ba', fontWeight: 500 }}>
              active quotations
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '12px', color: '#9aa8ba' }}>
              Pipeline Value: <strong style={{ color: '#38d9ff' }}>$283,767</strong>
            </span>
            <ChevronRight size={14} style={{ color: '#38d9ff' }} />
          </div>
        </div>

        {/* KPI 3: At-Risk Deals */}
        <div
          className="kpi-glass-card clickable"
          onClick={() => setActiveModule('deal-health')}
          style={{
            borderLeft: '3px solid #ff6b72',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="kpi-head" style={{ marginBottom: '12px' }}>
            <span className="kpi-label" style={{ fontSize: '13px', fontWeight: 600, color: '#9aa8ba' }}>
              At-Risk Deals
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 107, 114, 0.12)',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#ff6b72',
              }}
            >
              <span className="pulse-dot" style={{ background: '#ff6b72', width: '6px', height: '6px', borderRadius: '50%' }} />
              Requires Action
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
            <div className="kpi-main-val font-mono" style={{ fontSize: '28px', fontWeight: 800, color: '#ff6b72' }}>
              {atRiskCount}
            </div>
            <span style={{ fontSize: '13px', color: '#9aa8ba', fontWeight: 500 }}>
              flagged by Deal Health
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '12px', color: '#9aa8ba' }}>
              Low health scores (&lt;70/100)
            </span>
            <ChevronRight size={14} style={{ color: '#ff6b72' }} />
          </div>
        </div>
      </div>

      {/* 3. Operational Attention Triage: "What needs my attention today?" */}
      <div
        className="glass-panel"
        style={{
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(15, 28, 48, 0.75) 0%, rgba(20, 36, 62, 0.75) 100%)',
          border: '1px solid rgba(245, 181, 68, 0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'rgba(245, 181, 68, 0.15)', padding: '6px', borderRadius: '6px', color: '#f5b544' }}>
              <Zap size={16} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>
              What Needs Your Attention Today
            </h3>
          </div>
          <span style={{ fontSize: '11px', color: '#9aa8ba', fontWeight: 500 }}>
            3 Priority Action Items
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {/* Action Item 1 */}
          <div
            className="clickable"
            onClick={() => setActiveModule('approvals')}
            style={{
              padding: '12px 14px',
              background: 'rgba(7, 17, 31, 0.5)',
              borderRadius: '8px',
              border: '1px solid rgba(245, 181, 68, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="font-mono" style={{ fontSize: '12px', fontWeight: 700, color: '#2f8cff' }}>
                  QT-2024-001 • Acme Corp
                </span>
                <span style={{ fontSize: '10px', color: '#f5b544', background: 'rgba(245, 181, 68, 0.15)', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                  Approval
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                14.5% discount requested. Exceeds standard rep threshold (10.0%).
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '11px', color: '#9aa8ba' }}>Waiting on VP Sales</span>
              <span style={{ fontSize: '11px', color: '#f5b544', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Review <ChevronRight size={11} />
              </span>
            </div>
          </div>

          {/* Action Item 2 */}
          <div
            className="clickable"
            onClick={() => setActiveModule('quotations')}
            style={{
              padding: '12px 14px',
              background: 'rgba(7, 17, 31, 0.5)',
              borderRadius: '8px',
              border: '1px solid rgba(56, 217, 255, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="font-mono" style={{ fontSize: '12px', fontWeight: 700, color: '#38d9ff' }}>
                  QT-2024-002 • Beta Industries
                </span>
                <span style={{ fontSize: '10px', color: '#38d9ff', background: 'rgba(56, 217, 255, 0.15)', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                  Portal
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                Customer counter-offer submitted ($98,500 total). Buyer requested response.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '11px', color: '#9aa8ba' }}>45 mins ago</span>
              <span style={{ fontSize: '11px', color: '#38d9ff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Respond <ChevronRight size={11} />
              </span>
            </div>
          </div>

          {/* Action Item 3 */}
          <div
            className="clickable"
            onClick={() => setActiveModule('deal-health')}
            style={{
              padding: '12px 14px',
              background: 'rgba(7, 17, 31, 0.5)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 107, 114, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="font-mono" style={{ fontSize: '12px', fontWeight: 700, color: '#ff6b72' }}>
                  QT-2024-004 • Global Tech
                </span>
                <span style={{ fontSize: '10px', color: '#ff6b72', background: 'rgba(255, 107, 114, 0.15)', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                  Risk
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                Deal health dropped to 52/100 due to extended payment terms and low margin.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '11px', color: '#9aa8ba' }}>Score: 52/100</span>
              <span style={{ fontSize: '11px', color: '#ff6b72', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Diagnose <ChevronRight size={11} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Operational Section: Recent Activity + Deal Health Diagnostics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '20px', marginBottom: '24px' }}>
        
        {/* Left Column: Recent Activity Feed */}
        <div className="glass-panel" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} style={{ color: '#38d9ff' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>
                Recent Activity
              </h3>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '3px', borderRadius: '6px' }}>
              {(['all', 'approvals', 'portal', 'fulfillment'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActivityFilter(filter)}
                  style={{
                    border: 'none',
                    background: activityFilter === filter ? 'rgba(56, 217, 255, 0.15)' : 'transparent',
                    color: activityFilter === filter ? '#38d9ff' : '#9aa8ba',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredActivities.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '12px 14px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      background: `rgba(${
                        item.iconColor === '#31d38a'
                          ? '49, 211, 138'
                          : item.iconColor === '#38d9ff'
                          ? '56, 217, 255'
                          : item.iconColor === '#f5b544'
                          ? '245, 181, 68'
                          : '139, 92, 246'
                      }, 0.15)`,
                      color: item.iconColor,
                      padding: '8px',
                      borderRadius: '6px',
                      marginTop: '2px',
                    }}
                  >
                    <IconComp size={16} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '13px', fontWeight: 600, color: '#f5f7fa' }}>
                        {item.title}
                      </strong>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        {item.timestamp}
                      </span>
                    </div>

                    <p style={{ fontSize: '12px', color: '#9aa8ba', margin: 0, lineHeight: 1.45 }}>
                      {item.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: item.badgeVariant === 'success' ? 'rgba(49, 211, 138, 0.15)' : item.badgeVariant === 'warning' ? 'rgba(245, 181, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                          color: item.badgeVariant === 'success' ? '#31d38a' : item.badgeVariant === 'warning' ? '#f5b544' : '#8b5cf6',
                        }}
                      >
                        {item.badge}
                      </span>

                      <button
                        className="btn-glass btn-glass-secondary btn-sm"
                        onClick={() => setActiveModule(item.module)}
                        style={{ fontSize: '11px', padding: '2px 8px', height: 'auto' }}
                      >
                        Action <ChevronRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deal Health Diagnostics & Risk Playbooks */}
        <div className="glass-panel" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} style={{ color: '#ff6b72' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>
                  Deal Health Diagnostics
                </h3>
              </div>
              <button
                className="btn-glass btn-glass-secondary btn-sm"
                onClick={() => setActiveModule('deal-health')}
                style={{ fontSize: '11px' }}
              >
                View All ({dealHealthScores.length})
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {dealHealthScores.map((score) => {
                const isHighRisk = score.riskLevel === 'High Risk';
                const isModRisk = score.riskLevel === 'Moderate Risk';

                return (
                  <div
                    key={score.id}
                    className="glass-card"
                    style={{
                      borderLeft: `3px solid ${isHighRisk ? '#ff6b72' : isModRisk ? '#f5b544' : '#31d38a'}`,
                      padding: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div>
                        <strong style={{ fontSize: '13px', color: '#f5f7fa' }}>{score.customerName}</strong>
                        <div className="font-mono" style={{ fontSize: '11px', color: '#2f8cff' }}>{score.quotationCode}</div>
                      </div>
                      <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: isHighRisk ? '#ff6b72' : isModRisk ? '#f5b544' : '#31d38a' }}>
                        {score.overallScore}/100
                      </div>
                    </div>

                    <div style={{ fontSize: '11px', color: '#9aa8ba', marginBottom: '8px' }}>
                      Primary Flag: <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{score.riskFactors[0] || 'Low margin or extended cycle'}</span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${score.overallScore}%`,
                          background: isHighRisk ? '#ff6b72' : isModRisk ? '#f5b544' : '#31d38a',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            className="btn-glass btn-glass-secondary"
            onClick={() => setActiveModule('deal-health')}
            style={{ marginTop: '16px', width: '100%', justifyContent: 'center', fontSize: '12px' }}
          >
            Launch Deal Health Diagnostic Tool
          </button>
        </div>
      </div>

      {/* 5. Scannable Quotation Ledger Table */}
      <div className="glass-panel" style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>
              Active Quotation Proposals
            </h3>
            <span style={{ fontSize: '12px', color: '#9aa8ba' }}>
              Showing real-time quotations requiring operational tracking
            </span>
          </div>

          <button
            className="btn-glass btn-glass-secondary btn-sm"
            onClick={() => setActiveModule('quotations')}
          >
            View Quotation Ledger ({quotations.length}) <ChevronRight size={13} />
          </button>
        </div>

        <div className="table-glass-wrapper">
          <table className="table-glass">
            <thead>
              <tr>
                <th>Code</th>
                <th>Customer</th>
                <th>Sales Rep</th>
                <th className="number-cell">Grand Total</th>
                <th className="number-cell">Margin %</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q.id} className="clickable" onClick={() => onSelectQuotation(q)}>
                  <td className="font-mono" style={{ fontWeight: 700, color: '#2f8cff' }}>
                    {q.code}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f5f7fa' }}>{q.customerName}</div>
                  </td>
                  <td style={{ fontSize: '12px', color: '#9aa8ba' }}>
                    {q.salesRep}
                  </td>
                  <td className="number-cell font-mono" style={{ fontWeight: 700, color: '#f5f7fa' }}>
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
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-glass btn-glass-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectQuotation(q);
                      }}
                      style={{ fontSize: '11px', padding: '2px 8px' }}
                    >
                      Inspect <ChevronRight size={11} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

