import React from 'react';
import { BarChart3, TrendingUp, Clock } from 'lucide-react';

export const ReportsView: React.FC = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Sales Operations Analytics & Reports</h1>
          <p className="page-subheading">
            Discount elasticity, approval velocity bottlenecks, fulfillment SLAs, and margin contribution analysis.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Discount vs Win Rate Correlation */}
        <div className="glass-panel" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f5f7fa', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: '#38d9ff' }} /> Discount vs. Win-Rate Correlation
          </h3>
          <p style={{ fontSize: '13px', color: '#9aa8ba', marginBottom: '20px' }}>
            Historical win rate plotted against representative discount percentages.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#9aa8ba' }}>0.0% - 5.0% Discount</span>
                <strong className="font-mono" style={{ color: '#31d38a' }}>72.4% Win Rate (High Margin)</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '72.4%', height: '100%', background: '#31d38a' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#9aa8ba' }}>5.1% - 15.0% Discount (Rep Limit)</span>
                <strong className="font-mono" style={{ color: '#2f8cff' }}>84.1% Win Rate (Optimal Zone)</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '84.1%', height: '100%', background: '#2f8cff' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#9aa8ba' }}>15.1% - 25.0% Discount (Router)</span>
                <strong className="font-mono" style={{ color: '#f5b544' }}>61.0% Win Rate (Margin Erosion)</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '61.0%', height: '100%', background: '#f5b544' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Approval Bottleneck SLA */}
        <div className="glass-panel" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f5f7fa', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} style={{ color: '#f5b544' }} /> Approval SLA Bottleneck Analysis
          </h3>
          <p style={{ fontSize: '13px', color: '#9aa8ba', marginBottom: '20px' }}>
            Average resolution turnaround hours by approval governance tier.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#f5f7fa' }}>Tier 1: Manager Review</strong>
                <div style={{ fontSize: '11px', color: '#9aa8ba' }}>SLA Target: &lt; 12 Hours</div>
              </div>
              <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#31d38a' }}>
                4.2 hrs avg
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#f5f7fa' }}>Tier 2: VP Sales Approval</strong>
                <div style={{ fontSize: '11px', color: '#9aa8ba' }}>SLA Target: &lt; 24 Hours</div>
              </div>
              <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#f5b544' }}>
                18.5 hrs avg
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#f5f7fa' }}>Tier 3: Finance Controller Hold</strong>
                <div style={{ fontSize: '11px', color: '#9aa8ba' }}>Credit & Payment Terms SLA</div>
              </div>
              <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#2f8cff' }}>
                11.0 hrs avg
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
