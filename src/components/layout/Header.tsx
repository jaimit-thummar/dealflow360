import React from 'react';
import { ModuleType, ViewMode } from '../../types';
import {
  Layers,
  LayoutDashboard,
  FileText,
  CheckSquare,
  Truck,
  Repeat,
  Receipt,
  Activity,
  BarChart3,
  Package,
  UserCheck,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface HeaderProps {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  pendingApprovalsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  setActiveModule,
  viewMode,
  setViewMode,
  pendingApprovalsCount,
}) => {
  const navItems: { id: ModuleType; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { id: 'quotations', label: 'Quotations', icon: <FileText size={15} /> },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: <CheckSquare size={15} />,
      count: pendingApprovalsCount,
    },
    { id: 'fulfillment', label: 'Fulfillment', icon: <Truck size={15} /> },
    { id: 'subscriptions', label: 'Subscriptions', icon: <Repeat size={15} /> },
    { id: 'invoices', label: 'Invoices', icon: <Receipt size={15} /> },
    { id: 'deal-health', label: 'Deal Health', icon: <Activity size={15} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={15} /> },
    { id: 'products', label: 'Products', icon: <Package size={15} /> },
  ];

  return (
    <header className="top-header">
      <div className="brand-section">
        <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); setActiveModule('dashboard'); }}>
          <div className="brand-icon-box">
            <Layers size={18} />
          </div>
          <span>DealFlow360</span>
        </a>

        <div className="org-selector">
          <ShieldCheck size={13} style={{ color: '#38bdf8' }} />
          <span>Acme Global Ops</span>
          <ChevronDown size={12} style={{ opacity: 0.7 }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: '#4ade80', backgroundColor: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', padding: '2px 8px', borderRadius: '4px' }}>
          <span style={{ width: '6px', height: '6px', backgroundColor: '#4ade80', borderRadius: '50%' }} />
          <span>Supabase Connected</span>
        </div>
      </div>

      <nav className="nav-modules">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-link ${activeModule === item.id && viewMode === 'internal' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('internal');
              setActiveModule(item.id);
            }}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.count !== undefined && item.count > 0 && (
              <span
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '9999px',
                }}
              >
                {item.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="nav-right">
        {/* Dual View Switcher */}
        <div className="view-mode-toggle">
          <button
            className={`toggle-btn ${viewMode === 'internal' ? 'active' : ''}`}
            onClick={() => setViewMode('internal')}
          >
            Sales Ops Console
          </button>
          <button
            className={`toggle-btn ${viewMode === 'customer' ? 'active' : ''}`}
            onClick={() => setViewMode('customer')}
          >
            <ExternalLink size={12} />
            Customer Portal (Acme)
          </button>
        </div>

        <div className="user-profile">
          <div className="avatar">SJ</div>
          <div className="user-meta">
            <span className="user-name">Sarah Jenkins</span>
            <span className="user-role">Sales Ops Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
};
