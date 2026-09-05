import React from 'react';
import { SubscriptionRecord } from '../../types';
import { Badge } from '../common/Badge';
import { Repeat, DollarSign, Calendar, ArrowUpRight, Plus, Clock, CheckCircle2, PauseCircle } from 'lucide-react';

interface SubscriptionsViewProps {
  subscriptions: SubscriptionRecord[];
  onGenerateExpansionQuote: (sub: SubscriptionRecord) => void;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({
  subscriptions,
  onGenerateExpansionQuote,
}) => {
  const activeSubs = subscriptions.filter((s) => s.status === 'active' || s.status === 'pending_renewal');
  const totalMrr = activeSubs.reduce((acc, s) => acc + s.mrr, 0);
  const totalArr = totalMrr * 12;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Subscriptions & Recurring Revenue</h1>
          <p className="page-subheading">
            Contract lifecycle, MRR/ARR tracking, auto-renewals, and expansion proposal generation.
          </p>
        </div>

        <div style={{ fontSize: '13px', fontWeight: 600, color: '#31d38a', backgroundColor: 'rgba(49,211,138,0.12)', padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(49,211,138,0.3)' }}>
          Active ARR: <strong className="font-mono">${totalArr.toLocaleString('en-US')}</strong>
        </div>
      </div>

      {/* Top Status Indicators (Active, Paused, Cancelled) */}
      <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '20px' }}>
        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Active Contracts</span>
            <CheckCircle2 size={16} style={{ color: '#31d38a' }} />
          </div>
          <div className="kpi-main-val" style={{ color: '#31d38a' }}>
            {subscriptions.filter((s) => s.status === 'active').length} Active
          </div>
          <div className="kpi-sub-label">Recurring SaaS accounts</div>
        </div>

        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Pending Renewals</span>
            <Calendar size={16} style={{ color: '#f5b544' }} />
          </div>
          <div className="kpi-main-val" style={{ color: '#f5b544' }}>
            {subscriptions.filter((s) => s.status === 'pending_renewal').length} Pending
          </div>
          <div className="kpi-sub-label">Renewal due in &lt; 30 days</div>
        </div>

        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Paused / Cancelled</span>
            <PauseCircle size={16} style={{ color: '#9aa8ba' }} />
          </div>
          <div className="kpi-main-val" style={{ color: '#9aa8ba' }}>
            0 Paused
          </div>
          <div className="kpi-sub-label">Zero churn detected</div>
        </div>
      </div>

      {/* Visual Breakdown Panel: One-Time vs Recurring Lines */}
      <div className="glass-panel" style={{ padding: '18px 24px', marginBottom: '24px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#f5f7fa', marginBottom: '12px' }}>
          Revenue Architecture Breakdown
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#9aa8ba', fontWeight: 700 }}>
              One-Time Professional Lines
            </div>
            <div className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: '#38d9ff', marginTop: '4px' }}>
              $6,750.00
            </div>
            <div style={{ fontSize: '12px', color: '#9aa8ba', marginTop: '2px' }}>
              Onsite Setup Service & Deployment
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#9aa8ba', fontWeight: 700 }}>
              Recurring SaaS Subscription Lines
            </div>
            <div className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: '#31d38a', marginTop: '4px' }}>
              ${totalMrr.toLocaleString('en-US', { minimumFractionDigits: 2 })} / mo
            </div>
            <div style={{ fontSize: '12px', color: '#9aa8ba', marginTop: '2px' }}>
              Care Plan SLA & Premium Support contracts
            </div>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="table-glass-wrapper">
        <table className="table-glass">
          <thead>
            <tr>
              <th>Subscription Code</th>
              <th>Customer Account</th>
              <th>Service Plan</th>
              <th className="number-cell">Contracted Seats</th>
              <th className="number-cell">Monthly MRR</th>
              <th className="number-cell">Annualized ARR</th>
              <th>Billing Cadence</th>
              <th>Renewal Timeline</th>
              <th>Status</th>
              <th className="number-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr key={s.id}>
                <td className="font-mono" style={{ fontWeight: 700, color: '#2f8cff' }}>
                  {s.code}
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#f5f7fa' }}>{s.customerName}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{s.planName}</div>
                </td>
                <td className="number-cell font-mono">{s.seats} seats</td>
                <td className="number-cell font-mono" style={{ fontWeight: 700 }}>
                  ${s.mrr.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="number-cell font-mono" style={{ color: '#31d38a', fontWeight: 700 }}>
                  ${s.arr.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td>
                  <span className="badge-glass badge-glass-neutral">{s.billingCycle}</span>
                </td>
                <td style={{ fontSize: '12px', color: '#9aa8ba' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} style={{ color: '#38d9ff' }} />
                    <span>{s.renewalDate}</span>
                  </div>
                </td>
                <td>
                  <Badge status={s.status} />
                </td>
                <td className="number-cell">
                  <button
                    className="btn-glass btn-glass-secondary btn-sm"
                    onClick={() => onGenerateExpansionQuote(s)}
                  >
                    <Plus size={12} /> Expansion Quote
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
