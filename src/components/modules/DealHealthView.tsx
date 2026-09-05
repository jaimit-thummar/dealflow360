import React from 'react';
import { DealHealthScore } from '../../types';
import { Activity, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

interface DealHealthViewProps {
  dealHealthScores: DealHealthScore[];
}

export const DealHealthView: React.FC<DealHealthViewProps> = ({ dealHealthScores }) => {
  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Deal Health & Risk Diagnostics</h1>
          <p className="page-subtitle">
            Algorithmic deal risk scoring across margin contribution, decision-maker engagement, and approval velocity.
          </p>
        </div>
      </div>

      {/* Grid of Diagnostic Deal Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {dealHealthScores.map((score) => (
          <div
            key={score.id}
            className="card"
            style={{
              marginBottom: 0,
              borderLeft: `4px solid ${
                score.riskLevel === 'High Risk'
                  ? '#dc2626'
                  : score.riskLevel === 'Moderate Risk'
                  ? '#f59e0b'
                  : '#166534'
              }`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                  {score.quotationCode} - {score.customerName}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  Deal Volume: <strong className="font-mono" style={{ color: '#0f172a' }}>${score.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b' }}>Health Index</div>
                  <div className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: score.overallScore < 70 ? '#dc2626' : '#166534' }}>
                    {score.overallScore}/100
                  </div>
                </div>

                <span
                  className="badge"
                  style={{
                    backgroundColor:
                      score.riskLevel === 'High Risk'
                        ? '#fee2e2'
                        : score.riskLevel === 'Moderate Risk'
                        ? '#fef3c7'
                        : '#dcfce7',
                    color:
                      score.riskLevel === 'High Risk'
                        ? '#991b1b'
                        : score.riskLevel === 'Moderate Risk'
                        ? '#92400e'
                        : '#166534',
                  }}
                >
                  {score.riskLevel}
                </span>
              </div>
            </div>

            {/* Score Breakdown Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                backgroundColor: '#f8fafc',
                padding: '12px 16px',
                borderRadius: '6px',
                marginBottom: '16px',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Margin Health</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{score.marginScore}%</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Approval Velocity</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{score.velocityScore}%</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Buyer Engagement</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{score.engagementScore}%</div>
              </div>
            </div>

            {/* Risk Factors & Recommended Sales Plays */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#991b1b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={14} /> Identified Risk Factors
                </h4>
                <ul style={{ paddingLeft: '16px', fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {score.riskFactors.length === 0 ? (
                    <li style={{ color: '#166534', listStyleType: 'none' }}>No critical risk factors identified.</li>
                  ) : (
                    score.riskFactors.map((factor, idx) => <li key={idx}>{factor}</li>)
                  )}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#1e40af', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowRight size={14} /> Recommended Operational Playbook
                </h4>
                <ul style={{ paddingLeft: '16px', fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
