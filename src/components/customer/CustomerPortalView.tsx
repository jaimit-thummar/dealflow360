import React, { useState } from 'react';
import { Quotation } from '../../types';
import { Badge } from '../common/Badge';
import {
  FileText,
  Building2,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  ArrowLeft,
  Clock,
} from 'lucide-react';

interface CustomerPortalViewProps {
  quotations: Quotation[];
  activeQuotationId?: string;
  onCustomerSubmitCounter: (quotationId: string, counterDiscountPct: number, message: string, deliveryDate?: string) => void;
  onCustomerAcceptQuote: (quotationId: string) => void;
  onBackToInternal: () => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  quotations,
  activeQuotationId,
  onCustomerSubmitCounter,
  onCustomerAcceptQuote,
  onBackToInternal,
}) => {
  // Find target quotation or pick default
  const activeQuote =
    quotations.find((q) => q.id === activeQuotationId) ||
    quotations.find((q) => q.customerName === 'Acme Corp') ||
    quotations[0];

  const [counterDiscountInput, setCounterDiscountInput] = useState<number>(18.5);
  const [counterMessage, setCounterMessage] = useState<string>('');
  const [preferredDeliveryDate, setPreferredDeliveryDate] = useState<string>(activeQuote?.deliveryRequestDate || '2026-09-20');
  const [isCounterFormOpen, setIsCounterFormOpen] = useState(false);
  const [isSignedConfirmed, setIsSignedConfirmed] = useState(activeQuote?.status === 'accepted' || activeQuote?.status === 'fulfilled');

  if (!activeQuote) {
    return (
      <div className="customer-portal-frame" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>No quotation selected for portal view</h2>
        <button className="btn btn-primary" onClick={onBackToInternal} style={{ marginTop: '16px' }}>
          Return to Sales Ops Console
        </button>
      </div>
    );
  }

  const handleCounterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterMessage.trim()) return;
    onCustomerSubmitCounter(activeQuote.id, counterDiscountInput, counterMessage, preferredDeliveryDate);
    setIsCounterFormOpen(false);
    setCounterMessage('');
  };

  const handleAcceptSign = () => {
    onCustomerAcceptQuote(activeQuote.id);
    setIsSignedConfirmed(true);
  };

  return (
    <div className="customer-portal-frame">
      {/* Customer Header Bar */}
      <header className="portal-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#2563eb', padding: '6px', borderRadius: '4px', color: '#fff' }}>
            <FileText size={18} />
          </div>
          <div>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>DealFlow360 Customer Portal</span>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Secure B2B Procurement Workspace</div>
          </div>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={onBackToInternal} style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
          <ArrowLeft size={13} /> Switch to Sales Console
        </button>
      </header>

      {/* Main Container */}
      <div className="portal-container">
        {/* Signed / Accepted Banner */}
        {isSignedConfirmed && (
          <div
            style={{
              backgroundColor: '#dcfce7',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '16px 24px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={24} style={{ color: '#166534' }} />
              <div>
                <strong style={{ fontSize: '15px', color: '#166534' }}>Quotation Accepted & Digitally Executed</strong>
                <p style={{ fontSize: '13px', color: '#14532d', marginTop: '2px' }}>
                  {`Confirmation Receipt #${activeQuote.code}-ACK | Delivery scheduled per contract terms.`}
                </p>
              </div>
            </div>
            <span className="badge badge-success">Contract Signed</span>
          </div>
        )}

        {/* Commercial Quotation Paper Document */}
        <div className="portal-paper">
          {/* Top Document Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Prepared For:</span>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{activeQuote.customerName}</h2>
              <p style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                Attn: {activeQuote.customerContact} ({activeQuote.customerEmail})
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-neutral" style={{ fontSize: '12px' }}>Quotation Proposal</span>
              <div className="font-mono" style={{ fontSize: '22px', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>
                {activeQuote.code}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Valid Until: <strong>{activeQuote.validUntil}</strong>
              </div>
            </div>
          </div>

          {/* Line Items Table (NO INTERNAL MARGINS / NO COGS / NO INTERNAL ROLES) */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Proposed Commercial Products & Services</h3>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>SKU Code</th>
                    <th className="number-cell">Quantity</th>
                    <th className="number-cell">Unit List Price</th>
                    <th className="number-cell">Applied Discount</th>
                    <th className="number-cell">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {activeQuote.items.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600 }}>{item.productName}</td>
                      <td className="font-mono" style={{ fontSize: '12px', color: '#64748b' }}>{item.sku}</td>
                      <td className="number-cell font-mono">{item.quantity}</td>
                      <td className="number-cell font-mono">${item.unitPrice.toFixed(2)}</td>
                      <td className="number-cell font-mono" style={{ color: item.discountPct > 0 ? '#b45309' : '#0f172a' }}>
                        {item.discountPct > 0 ? `${item.discountPct}%` : 'Standard'}
                      </td>
                      <td className="number-cell font-mono" style={{ fontWeight: 700 }}>
                        ${item.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Totals Summary */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '20px',
              borderRadius: '6px',
              marginBottom: '28px',
            }}
          >
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                <span>Subtotal:</span>
                <span className="font-mono">${activeQuote.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#b45309' }}>
                <span>Total Discount Applied:</span>
                <span className="font-mono">-${activeQuote.discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#0f172a',
                  borderTop: '2px solid #e2e8f0',
                  paddingTop: '8px',
                }}
              >
                <span>Final Contract Total:</span>
                <span className="font-mono" style={{ color: '#2563eb' }}>
                  ${activeQuote.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Action & Negotiation Panel */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} style={{ color: '#2563eb' }} /> Negotiation & Discussion Thread
            </h3>

            {/* Negotiation History Messages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {activeQuote.negotiationHistory.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    backgroundColor: msg.senderRole === 'customer' ? '#eff6ff' : '#f8fafc',
                    border: `1px solid ${msg.senderRole === 'customer' ? '#bfdbfe' : '#e2e8f0'}`,
                    padding: '12px 16px',
                    borderRadius: '6px',
                    marginLeft: msg.senderRole === 'customer' ? '0' : '20px',
                    marginRight: msg.senderRole === 'customer' ? '20px' : '0',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                    <strong style={{ color: msg.senderRole === 'customer' ? '#1d4ed8' : '#0f172a' }}>
                      {msg.senderName} ({msg.senderRole === 'customer' ? 'Your Team' : 'DealFlow360 Account Representative'})
                    </strong>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#0f172a' }}>{msg.message}</div>
                  {msg.proposedDiscountPct !== undefined && (
                    <div style={{ marginTop: '6px', fontSize: '12px', fontWeight: 600, color: '#b45309' }}>
                      Requested Discount Counter: {msg.proposedDiscountPct}%
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Counter Offer Drawer / Form */}
            {isCounterFormOpen ? (
              <form onSubmit={handleCounterSubmit} style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '16px', borderRadius: '6px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#92400e', marginBottom: '12px' }}>
                  Submit Formal Counter Discount Request
                </h4>

                <div className="form-grid" style={{ marginBottom: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Requested Target Discount %</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="0.5"
                      className="form-input"
                      value={counterDiscountInput}
                      onChange={(e) => setCounterDiscountInput(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Delivery Target Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={preferredDeliveryDate}
                      onChange={(e) => setPreferredDeliveryDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Negotiation Rationale & Comments *</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      placeholder="Explain your procurement requirements or volume commitments..."
                      value={counterMessage}
                      onChange={(e) => setCounterMessage(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsCounterFormOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    <Send size={12} /> Submit Counter Proposal
                  </button>
                </div>
              </form>
            ) : (
              !isSignedConfirmed && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button className="btn btn-secondary" onClick={() => setIsCounterFormOpen(true)}>
                    <MessageSquare size={14} /> Request Price Adjustment / Counter-Offer
                  </button>

                  <button className="btn btn-success" style={{ padding: '10px 24px', fontSize: '14px' }} onClick={handleAcceptSign}>
                    <CheckCircle2 size={16} /> Accept & Digital Sign Quotation
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
