import React from 'react';
import { BarChart3, TrendingUp, Clock, ShieldCheck, DollarSign } from 'lucide-react';

export const ReportsView: React.FC = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Sales Operations Analytics & Reports</h1>
          <p className="page-subtitle">
            Discount elasticity, approval velocity bottlenecks, fulfillment SLAs, and margin contribution analysis.
          </p>
        </div>
      </div>

      {/* Grid of Report Summary Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Discount vs Win Rate Correlation */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={16} style={{ color: '#2563eb' }} /> Discount vs. Win-Rate Correlation
            </span>
          </div>

          <div style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
            Historical win rate plotted against representative discount percentages.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>0.0% - 5.0% Discount</span>
                <strong className="font-mono">72.4% Win Rate (High Margin)</strong>
              </div>
              <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '72.4%', height: '100%', backgroundColor: '#166534' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>5.1% - 15.0% Discount (Rep Delegation Limit)</span>
                <strong className="font-mono">84.1% Win Rate (Optimal Zone)</strong>
              </div>
              <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '84.1%', height: '100%', backgroundColor: '#2563eb' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>15.1% - 25.0% Discount (Approval Router)</span>
                <strong className="font-mono">61.0% Win Rate (Margin Erosion)</strong>
              </div>
              <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '61.0%', height: '100%', backgroundColor: '#f59e0b' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Approval Bottleneck Throughput */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} style={{ color: '#f59e0b' }} /> Approval SLA Bottleneck Analysis
            </span>
          </div>

          <div style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
            Average resolution turnaround hours by approval tier.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#0f172a' }}>Tier 1: Manager Review</strong>
                <div style={{ fontSize: '11px', color: '#64748b' }}>SLA Target: &lt; 12 Hours</div>
              </div>
              <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#166534' }}>
                4.2 hrs avg
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#0f172a' }}>Tier 2: VP Sales Approval</strong>
                <div style={{ fontSize: '11px', color: '#64748b' }}>SLA Target: &lt; 24 Hours</div>
              </div>
              <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#b45309' }}>
                18.5 hrs avg
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#0f172a' }}>Tier 3: Finance Controller Hold</strong>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Credit & Payment Terms SLA</div>
              </div>
              <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#2563eb' }}>
                11.0 hrs avg
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
