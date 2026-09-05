import React from 'react';
import { DealHealthScore } from '../../types';
import { Activity, AlertTriangle, ArrowRight, Clock, AlertCircle, ShieldAlert } from 'lucide-react';

interface DealHealthViewProps {
  dealHealthScores: DealHealthScore[];
}

export const DealHealthView: React.FC<DealHealthViewProps> = ({ dealHealthScores }) => {
  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Deal Health Intelligence Center</h1>
          <p className="page-subheading">
            Real-time signals for stalled deals, delivery promises at risk, and unusual discount patterns.
          </p>
        </div>
      </div>

      {/* Top Intelligence Center Indicators */}
      <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Stalled Deals</span>
            <Clock size={16} style={{ color: '#f5b544' }} />
          </div>
          <div className="kpi-main-val" style={{ color: '#f5b544' }}>
            5 Stalled
          </div>
          <div className="kpi-sub-label">Idle for 7+ days without buyer activity</div>
        </div>

        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Discount Anomalies</span>
            <AlertTriangle size={16} style={{ color: '#ff6b72' }} />
          </div>
          <div className="kpi-main-val" style={{ color: '#ff6b72' }}>
            2 Anomalies
          </div>
          <div className="kpi-sub-label">Discount significantly above rep average</div>
        </div>

        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Delivery Slippage</span>
            <ShieldAlert size={16} style={{ color: '#38d9ff' }} />
          </div>
          <div className="kpi-main-val" style={{ color: '#38d9ff' }}>
            3 Promises at Risk
          </div>
          <div className="kpi-sub-label">Fulfillment lead time constraint</div>
        </div>
      </div>

      {/* Flagged Deals Alert Table */}
      <div className="glass-panel" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f5f7fa', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} style={{ color: '#ff6b72' }} /> High-Priority Flagged Deal Signals
        </h3>

        <div className="table-glass-wrapper">
          <table className="table-glass">
            <thead>
              <tr>
                <th>Deal Account</th>
                <th>Identified Issue Signal</th>
                <th>Flagged Date</th>
                <th>Diagnostic Action Playbook</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong style={{ color: '#2f8cff' }}>Zenith Co (QT-2026-8501)</strong>
                </td>
                <td style={{ color: '#f5b544' }}>Idle 9 days following counter-offer submission</td>
                <td style={{ color: '#9aa8ba', fontSize: '12px' }}>Aug 24, 2026</td>
                <td>
                  <span className="badge-glass badge-glass-positive">Nudge Sent to Executive</span>
                </td>
              </tr>
              <tr>
                <td>
                  <strong style={{ color: '#2f8cff' }}>Delta LLC (QT-2026-8510)</strong>
                </td>
                <td style={{ color: '#ff6b72' }}>Discount 22.0% vs rep historical average 8.0%</td>
                <td style={{ color: '#9aa8ba', fontSize: '12px' }}>Aug 25, 2026</td>
                <td>
                  <span className="badge-glass badge-glass-danger">Escalated to Sales VP</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid of Diagnostic Scorecards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {dealHealthScores.map((score) => (
          <div
            key={score.id}
            className="glass-panel"
            style={{
              marginBottom: 0,
              borderLeft: `4px solid ${
                score.riskLevel === 'High Risk'
                  ? '#ff6b72'
                  : score.riskLevel === 'Moderate Risk'
                  ? '#f5b544'
                  : '#31d38a'
              }`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#f5f7fa' }}>
                  {score.quotationCode} - {score.customerName}
                </div>
                <div style={{ fontSize: '13px', color: '#9aa8ba', marginTop: '2px' }}>
                  Deal Volume: <strong className="font-mono" style={{ color: '#38d9ff' }}>${score.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b' }}>Health Index</div>
                  <div className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: score.overallScore < 70 ? '#ff6b72' : '#31d38a' }}>
                    {score.overallScore}/100
                  </div>
                </div>

                <span
                  className="badge-glass"
                  style={{
                    backgroundColor:
                      score.riskLevel === 'High Risk'
                        ? 'rgba(255, 107, 114, 0.15)'
                        : score.riskLevel === 'Moderate Risk'
                        ? 'rgba(245, 181, 68, 0.15)'
                        : 'rgba(49, 211, 138, 0.15)',
                    color:
                      score.riskLevel === 'High Risk'
                        ? '#ff6b72'
                        : score.riskLevel === 'Moderate Risk'
                        ? '#f5b544'
                        : '#31d38a',
                  }}
                >
                  {score.riskLevel}
                </span>
              </div>
            </div>

            {/* Risk Factors & Playbook */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#ff6b72', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={14} /> Risk Vectors
                </h4>
                <ul style={{ paddingLeft: '16px', fontSize: '13px', color: '#9aa8ba', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {score.riskFactors.length === 0 ? (
                    <li style={{ color: '#31d38a', listStyleType: 'none' }}>No critical risk factors identified.</li>
                  ) : (
                    score.riskFactors.map((factor, idx) => <li key={idx}>{factor}</li>)
                  )}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#38d9ff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowRight size={14} /> Recommended Playbook Actions
                </h4>
                <ul style={{ paddingLeft: '16px', fontSize: '13px', color: '#9aa8ba', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {score.recommendedActions.map((action, idx) => (
                    <li key={idx}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
