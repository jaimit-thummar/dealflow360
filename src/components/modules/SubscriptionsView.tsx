import React, { useState } from 'react';
import { SubscriptionRecord } from '../../types';
import { Badge } from '../common/Badge';
import {
  CheckCircle2,
  PauseCircle,
  XCircle,
  Repeat,
  Calendar,
  DollarSign,
  Package,
  Layers,
  Settings2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SubscriptionsViewProps {
  subscriptions: SubscriptionRecord[];
  onGenerateExpansionQuote?: (sub: SubscriptionRecord) => void;
}

interface DetailSubscription {
  id: string;
  code: string;
  customerName: string;
  planName: string;
  cycle: 'Monthly' | 'Quarterly' | 'Annual';
  nextBill: string;
  amount: number;
  status: 'active' | 'paused' | 'cancelled';
  oneTimeLines: { name: string; category: string; qty: number; total: number }[];
  recurringLines: { name: string; category: string; amount: number; cycle: string }[];
}

const SAMPLE_SUBSCRIPTIONS: DetailSubscription[] = [
  {
    id: 'sub-101',
    code: 'SUB-ACME-01',
    customerName: 'Acme Corp',
    planName: 'Care Plan 2yr',
    cycle: 'Monthly',
    nextBill: 'Sep 15',
    amount: 4500.0,
    status: 'active',
    oneTimeLines: [
      { name: 'Laptop Pro 14', category: 'Hardware', qty: 2, total: 2400.0 },
      { name: 'Onsite Setup', category: 'Services', qty: 1, total: 450.0 },
    ],
    recurringLines: [
      { name: 'Care Plan 2yr', category: 'SaaS Subscription', amount: 3650.0, cycle: 'Monthly' },
      { name: 'Support SLA', category: 'Support', amount: 850.0, cycle: 'Monthly' },
    ],
  },
  {
    id: 'sub-102',
    code: 'SUB-BETA-02',
    customerName: 'Beta Industries',
    planName: 'Support SLA',
    cycle: 'Quarterly',
    nextBill: 'Nov 1',
    amount: 12500.0,
    status: 'active',
    oneTimeLines: [
      { name: 'Server Rack Assembly', category: 'Hardware', qty: 1, total: 8200.0 },
      { name: 'Network Calibration', category: 'Services', qty: 1, total: 1800.0 },
    ],
    recurringLines: [
      { name: 'Support SLA', category: 'Enterprise Support', amount: 9500.0, cycle: 'Quarterly' },
      { name: 'Cloud Backup Extension', category: 'SaaS', amount: 3000.0, cycle: 'Quarterly' },
    ],
  },
  {
    id: 'sub-103',
    code: 'SUB-DELTA-03',
    customerName: 'Delta LLC',
    planName: 'Care Plan 1yr',
    cycle: 'Monthly',
    nextBill: '—',
    amount: 1800.0,
    status: 'paused',
    oneTimeLines: [
      { name: 'Docking Station Bundle', category: 'Hardware', qty: 5, total: 1250.0 },
    ],
    recurringLines: [
      { name: 'Care Plan 1yr', category: 'SaaS Subscription', amount: 1800.0, cycle: 'Monthly' },
    ],
  },
  {
    id: 'sub-104',
    code: 'SUB-NOVA-04',
    customerName: 'Nova Retail',
    planName: 'Standard Care SLA',
    cycle: 'Monthly',
    nextBill: 'Oct 01',
    amount: 2200.0,
    status: 'active',
    oneTimeLines: [
      { name: 'POS Scanner Hardware', category: 'Hardware', qty: 4, total: 1600.0 },
    ],
    recurringLines: [
      { name: 'Standard Care SLA', category: 'Support', amount: 2200.0, cycle: 'Monthly' },
    ],
  },
  {
    id: 'sub-105',
    code: 'SUB-ORION-05',
    customerName: 'Orion Ltd',
    planName: 'Care Plan 1yr',
    cycle: 'Quarterly',
    nextBill: '—',
    amount: 3400.0,
    status: 'cancelled',
    oneTimeLines: [
      { name: 'Legacy Terminal Unit', category: 'Hardware', qty: 2, total: 1100.0 },
    ],
    recurringLines: [
      { name: 'Care Plan 1yr', category: 'SaaS Subscription', amount: 3400.0, cycle: 'Quarterly' },
    ],
  },
];

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = () => {
  const [selectedSubId, setSelectedSubId] = useState<string>('sub-101');
  const [subscriptionList, setSubscriptionList] = useState<DetailSubscription[]>(SAMPLE_SUBSCRIPTIONS);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const selectedSub = subscriptionList.find((s) => s.id === selectedSubId) || subscriptionList[0];

  const activeCount = 18;
  const pausedCount = 2;
  const cancelledCount = 3;

  const handleModify = () => {
    setActionNotice(`Subscription ${selectedSub.code} modified: Schedule & Line amounts recalculated.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleCancel = () => {
    setSubscriptionList((prev) =>
      prev.map((s) => (s.id === selectedSub.id ? { ...s, status: 'cancelled', nextBill: '—' } : s))
    );
    setActionNotice(`Subscription ${selectedSub.code} has been cancelled.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Subscriptions & Recurring Billing</h1>
          <p className="page-subheading">
            Commercial contract management, recurring revenue lines, and automated billing schedule.
          </p>
        </div>

        <div
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#38d9ff',
            backgroundColor: 'rgba(56,217,255,0.08)',
            padding: '6px 14px',
            borderRadius: '6px',
            border: '1px solid rgba(56,217,255,0.2)',
          }}
        >
          Active Subscriptions: <strong className="font-mono">18 Contracts</strong>
        </div>
      </div>

      {actionNotice && (
        <div
          style={{
            background: 'rgba(49,211,138,0.12)',
            border: '1px solid rgba(49,211,138,0.3)',
            borderRadius: '6px',
            padding: '10px 16px',
            fontSize: '13px',
            color: '#31d38a',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Sparkles size={16} />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* TOP SUMMARY (18 Active, 2 Paused, 3 Cancelled) */}
      <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Active Subscriptions</span>
            <CheckCircle2 size={16} style={{ color: '#31d38a' }} />
          </div>
          <div className="kpi-main-val" style={{ color: '#31d38a' }}>
            {activeCount} Active
          </div>
          <div className="kpi-sub-label">Recurring MRR accounts in good standing</div>
        </div>

        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Paused Contracts</span>
            <PauseCircle size={16} style={{ color: '#f5b544' }} />
          </div>
          <div className="kpi-main-val" style={{ color: '#f5b544' }}>
            {pausedCount} Paused
          </div>
          <div className="kpi-sub-label">Temporarily suspended billing cycles</div>
        </div>

        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Cancelled Contracts</span>
            <XCircle size={16} style={{ color: '#ff6b72' }} />
          </div>
          <div className="kpi-main-val" style={{ color: '#ff6b72' }}>
            {cancelledCount} Cancelled
          </div>
          <div className="kpi-sub-label">Terminated or non-renewed accounts</div>
        </div>
      </div>

      {/* SUBSCRIPTIONS TABLE */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>
            Subscriptions Queue
          </h3>
          <span style={{ fontSize: '12px', color: '#9aa8ba' }}>
            Click row to inspect contract line detail
          </span>
        </div>

        <div className="table-glass-wrapper">
          <table className="table-glass">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Plan</th>
                <th>Cycle</th>
                <th>Next Bill</th>
                <th>Status</th>
                <th className="number-cell">Action</th>
              </tr>
            </thead>
            <tbody>
              {subscriptionList.map((sub) => {
                const isSelected = sub.id === selectedSub.id;
                return (
                  <tr
                    key={sub.id}
                    className={`clickable ${isSelected ? 'row-selected' : ''}`}
                    onClick={() => setSelectedSubId(sub.id)}
                    style={{
                      background: isSelected ? 'rgba(47, 140, 255, 0.12)' : undefined,
                    }}
                  >
                    <td>
                      <div style={{ fontWeight: 700, color: '#f5f7fa' }}>{sub.customerName}</div>
                      <div className="font-mono" style={{ fontSize: '11px', color: '#9aa8ba' }}>
                        {sub.code}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#2f8cff' }}>{sub.planName}</div>
                    </td>
                    <td>
                      <span className="badge-glass badge-glass-neutral">{sub.cycle}</span>
                    </td>
                    <td className="font-mono" style={{ color: sub.nextBill === '—' ? '#9aa8ba' : '#38d9ff' }}>
                      {sub.nextBill}
                    </td>
                    <td>
                      {sub.status === 'active' && (
                        <span className="badge-glass badge-glass-success">Active</span>
                      )}
                      {sub.status === 'paused' && (
                        <span className="badge-glass badge-glass-warning">Paused</span>
                      )}
                      {sub.status === 'cancelled' && (
                        <span className="badge-glass badge-glass-danger">Cancelled</span>
                      )}
                    </td>
                    <td className="number-cell">
                      <button
                        className="btn-glass btn-glass-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubId(sub.id);
                        }}
                      >
                        Inspect <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUBSCRIPTION DETAIL INSPECTOR */}
      {selectedSub && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          {/* Header Summary for Detail */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f5f7fa', margin: 0 }}>
                  {selectedSub.customerName}
                </h3>
                <span className="font-mono" style={{ fontSize: '13px', color: '#38d9ff' }}>
                  ({selectedSub.code})
                </span>
                {selectedSub.status === 'active' && (
                  <span className="badge-glass badge-glass-success">Active</span>
                )}
                {selectedSub.status === 'paused' && (
                  <span className="badge-glass badge-glass-warning">Paused</span>
                )}
                {selectedSub.status === 'cancelled' && (
                  <span className="badge-glass badge-glass-danger">Cancelled</span>
                )}
              </div>
              <div style={{ fontSize: '13px', color: '#9aa8ba', marginTop: '2px' }}>
                Plan: <strong style={{ color: '#f5f7fa' }}>{selectedSub.planName}</strong>
              </div>
            </div>

            {/* Key Stats Bar: Cycle, Next Bill Date, Amount */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ textAlign: 'right', padding: '6px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '11px', color: '#9aa8ba', textTransform: 'uppercase', fontWeight: 700 }}>Billing Cycle</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f5f7fa' }}>{selectedSub.cycle}</div>
              </div>

              <div style={{ textAlign: 'right', padding: '6px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '11px', color: '#9aa8ba', textTransform: 'uppercase', fontWeight: 700 }}>Next Bill Date</div>
                <div className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#38d9ff' }}>{selectedSub.nextBill}</div>
              </div>

              <div style={{ textAlign: 'right', padding: '6px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '11px', color: '#9aa8ba', textTransform: 'uppercase', fontWeight: 700 }}>Contract Amount</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#31d38a' }}>
                  ${selectedSub.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {selectedSub.cycle === 'Monthly' ? '/ mo' : '/ qtr'}
                </div>
              </div>
            </div>
          </div>

          {/* SEPARATED LINES: ONE-TIME LINES VS RECURRING LINES */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            {/* ONE-TIME LINES */}
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-glass)', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Package size={16} style={{ color: '#38d9ff' }} />
                <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>
                  One-Time Lines
                </h4>
              </div>

              <div className="table-glass-wrapper">
                <table className="table-glass" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>Line Item</th>
                      <th>Category</th>
                      <th className="number-cell">Qty</th>
                      <th className="number-cell">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSub.oneTimeLines.map((line, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600, color: '#f5f7fa' }}>{line.name}</td>
                        <td><span className="badge-glass badge-glass-neutral">{line.category}</span></td>
                        <td className="number-cell font-mono">{line.qty}</td>
                        <td className="number-cell font-mono" style={{ fontWeight: 700 }}>
                          ${line.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RECURRING LINES */}
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-glass)', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Repeat size={16} style={{ color: '#31d38a' }} />
                <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>
                  Recurring Lines
                </h4>
              </div>

              <div className="table-glass-wrapper">
                <table className="table-glass" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>Line Item</th>
                      <th>Category</th>
                      <th>Cycle</th>
                      <th className="number-cell">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSub.recurringLines.map((line, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600, color: '#f5f7fa' }}>{line.name}</td>
                        <td><span className="badge-glass badge-glass-neutral">{line.category}</span></td>
                        <td style={{ fontSize: '11px', color: '#9aa8ba' }}>{line.cycle}</td>
                        <td className="number-cell font-mono" style={{ fontWeight: 700, color: '#31d38a' }}>
                          ${line.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ACTIONS: MODIFY SUBSCRIPTION & CANCEL SUBSCRIPTION */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <button className="btn-glass btn-glass-secondary" onClick={handleModify}>
              <Settings2 size={14} /> Modify Subscription
            </button>
            <button
              className="btn-glass btn-glass-danger"
              onClick={handleCancel}
              disabled={selectedSub.status === 'cancelled'}
            >
              <AlertTriangle size={14} /> Cancel Subscription
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

