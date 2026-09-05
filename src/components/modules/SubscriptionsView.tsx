import React, { useState } from 'react';
import { SubscriptionRecord } from '../../types';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { Repeat, DollarSign, Calendar, ArrowUpRight, Plus, Check } from 'lucide-react';

interface SubscriptionsViewProps {
  subscriptions: SubscriptionRecord[];
  onGenerateExpansionQuote: (sub: SubscriptionRecord) => void;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({
  subscriptions,
  onGenerateExpansionQuote,
}) => {
  const totalMrr = subscriptions
    .filter((s) => s.status === 'active' || s.status === 'pending_renewal')
    .reduce((acc, s) => acc + s.mrr, 0);

  const totalArr = totalMrr * 12;

  return (
    <div>
      {/* Top Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Subscriptions & Recurring Contracts</h1>
          <p className="page-subtitle">
            Contract lifecycle, MRR/ARR tracking, auto-renewals, and expansion proposal generation.
          </p>
        </div>

        <div className="header-actions">
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#166534', backgroundColor: '#dcfce7', padding: '6px 14px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
            Active ARR: <strong className="font-mono">${totalArr.toLocaleString('en-US')}</strong>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: '24px' }}>
        <div className="kpi-card">
          <div className="kpi-title">
            <span>Total Active MRR</span>
            <Repeat size={16} style={{ color: '#2563eb' }} />
          </div>
          <div className="kpi-value font-mono">
            ${totalMrr.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </div>
          <div className="kpi-subtext positive">
            <ArrowUpRight size={12} />
            <span>+8.4% MoM expansion</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">
            <span>Annual Run Rate (ARR)</span>
            <DollarSign size={16} style={{ color: '#166534' }} />
          </div>
          <div className="kpi-value font-mono">
            ${totalArr.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </div>
          <div className="kpi-subtext">
            <span>Contracted annualized revenue</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">
            <span>Pending Renewals (30 Days)</span>
            <Calendar size={16} style={{ color: '#f59e0b' }} />
          </div>
          <div className="kpi-value font-mono" style={{ color: '#b45309' }}>
            {subscriptions.filter((s) => s.status === 'pending_renewal').length}
          </div>
          <div className="kpi-subtext warning">
            <span>Beta Industries renewal due</span>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Subscription Code</th>
              <th>Customer Account</th>
              <th>Service Plan</th>
              <th className="number-cell">Contracted Seats</th>
              <th className="number-cell">Monthly MRR</th>
              <th className="number-cell">Annualized ARR</th>
              <th>Billing Cadence</th>
              <th>Renewal Date</th>
              <th>Status</th>
              <th className="number-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr key={s.id}>
                <td className="font-mono" style={{ fontWeight: 700, color: '#2563eb' }}>
                  {s.code}
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{s.customerName}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{s.planName}</div>
                </td>
                <td className="number-cell font-mono">{s.seats} seats</td>
                <td className="number-cell font-mono" style={{ fontWeight: 700 }}>
                  ${s.mrr.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="number-cell font-mono" style={{ color: '#166534', fontWeight: 700 }}>
                  ${s.arr.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td>
                  <span className="badge badge-neutral">{s.billingCycle}</span>
                </td>
                <td style={{ fontSize: '12px', color: '#64748b' }}>{s.renewalDate}</td>
                <td>
                  <Badge status={s.status} />
                </td>
                <td className="number-cell">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onGenerateExpansionQuote(s)}
                  >
                    <Plus size={12} /> Create Expansion Quote
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
