import React, { useState } from 'react';
import { Quotation } from '../../types';
import { Badge } from '../common/Badge';
import {
  FileText,
  Building2,
  Calendar,
  Send,
  CheckCircle2,
  MessageSquare,
  ArrowLeft,
  UserCheck,
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
  const activeQuote =
    quotations.find((q) => q.id === activeQuotationId) ||
    quotations.find((q) => q.customerName === 'Acme Corp') ||
    quotations[0];

  const [portalTab, setPortalTab] = useState<'quotation' | 'messages' | 'profile'>('quotation');
  const [counterDiscountInput, setCounterDiscountInput] = useState<number>(18.5);
  const [counterMessage, setCounterMessage] = useState<string>('');
  const [preferredDeliveryDate, setPreferredDeliveryDate] = useState<string>(activeQuote?.deliveryRequestDate || '2026-09-20');
  const [isCounterFormOpen, setIsCounterFormOpen] = useState(false);
  const [isSignedConfirmed, setIsSignedConfirmed] = useState(activeQuote?.status === 'accepted' || activeQuote?.status === 'fulfilled');

  if (!activeQuote) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#9aa8ba' }}>
        <h2>No quotation selected for portal view</h2>
        <button className="btn-glass btn-glass-primary" onClick={onBackToInternal} style={{ marginTop: '16px' }}>
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
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 0' }}>
      {/* Customer Header Bar */}
      <div
        style={{
          background: 'rgba(15, 28, 48, 0.7)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '16px 24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#2f8cff', padding: '8px', borderRadius: '8px', color: '#fff' }}>
            <FileText size={20} />
          </div>
          <div>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>DealFlow360 Customer Portal</span>
            <div style={{ fontSize: '12px', color: '#9aa8ba' }}>B2B Commercial Procurement Workspace</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Customer Tabs */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(7,17,31,0.6)', padding: '2px', borderRadius: '6px' }}>
            <button
              className={`toggle-btn ${portalTab === 'quotation' ? 'active' : ''}`}
              onClick={() => setPortalTab('quotation')}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                borderRadius: '4px',
                background: portalTab === 'quotation' ? '#2f8cff' : 'transparent',
                color: portalTab === 'quotation' ? '#fff' : '#9aa8ba',
              }}
            >
              My Quotation
            </button>
            <button
              className={`toggle-btn ${portalTab === 'messages' ? 'active' : ''}`}
              onClick={() => setPortalTab('messages')}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                borderRadius: '4px',
                background: portalTab === 'messages' ? '#2f8cff' : 'transparent',
                color: portalTab === 'messages' ? '#fff' : '#9aa8ba',
              }}
            >
              Messages ({activeQuote.negotiationHistory.length})
            </button>
            <button
              className={`toggle-btn ${portalTab === 'profile' ? 'active' : ''}`}
              onClick={() => setPortalTab('profile')}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                borderRadius: '4px',
                background: portalTab === 'profile' ? '#2f8cff' : 'transparent',
                color: portalTab === 'profile' ? '#fff' : '#9aa8ba',
              }}
            >
              Profile
            </button>
          </div>

          <button className="btn-glass btn-glass-secondary btn-sm" onClick={onBackToInternal}>
            <ArrowLeft size={13} /> Switch to Sales Console
          </button>
        </div>
      </div>

      {/* Confirmation Banner */}
      {isSignedConfirmed && (
        <div
          style={{
            background: 'rgba(49, 211, 138, 0.12)',
            border: '1px solid rgba(49, 211, 138, 0.3)',
            borderRadius: '12px',
            padding: '18px 24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <CheckCircle2 size={24} style={{ color: '#31d38a' }} />
            <div>
              <strong style={{ fontSize: '15px', color: '#31d38a' }}>Quotation Accepted & Digitally Executed</strong>
              <p style={{ fontSize: '13px', color: '#9aa8ba', marginTop: '2px' }}>
                {`Confirmation Receipt #${activeQuote.code}-ACK | Delivery scheduled per contract terms.`}
              </p>
            </div>
          </div>
          <span className="badge-glass badge-glass-positive">Contract Signed</span>
        </div>
      )}

      {/* Content based on selected portal tab */}
      {portalTab === 'profile' ? (
        <div className="glass-panel">
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f5f7fa', marginBottom: '12px' }}>Account Procurement Profile</h3>
          <div style={{ fontSize: '13px', color: '#9aa8ba', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>Account Name: <strong style={{ color: '#f5f7fa' }}>{activeQuote.customerName}</strong></div>
            <div>Authorized Contact: <strong style={{ color: '#f5f7fa' }}>{activeQuote.customerContact} ({activeQuote.customerEmail})</strong></div>
            <div>Shipping Address: <strong style={{ color: '#f5f7fa' }}>100 Industrial Parkway, Suite 400, Dallas, TX 75201</strong></div>
          </div>
        </div>
      ) : (
        /* Quotation & Messages Tab */
        <div className="glass-panel">
          {/* Top Document Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Prepared For:</span>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f5f7fa', marginTop: '2px' }}>{activeQuote.customerName}</h2>
              <p style={{ fontSize: '13px', color: '#9aa8ba', marginTop: '4px' }}>
                Attn: {activeQuote.customerContact} ({activeQuote.customerEmail})
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge-glass badge-glass-neutral" style={{ fontSize: '12px' }}>Official Proposal</span>
              <div className="font-mono" style={{ fontSize: '22px', fontWeight: 800, color: '#38d9ff', marginTop: '4px' }}>
                {activeQuote.code}
              </div>
              <div style={{ fontSize: '12px', color: '#9aa8ba', marginTop: '4px' }}>
                Valid Until: <strong>{activeQuote.validUntil}</strong>
              </div>
            </div>
          </div>

          {/* Line Items Table (NO INTERNAL MARGINS / NO COGS EXPOSED) */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f5f7fa', marginBottom: '12px' }}>Proposed Commercial Products & Services</h3>

            <div className="table-glass-wrapper">
              <table className="table-glass">
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
                      <td style={{ fontWeight: 600, color: '#f5f7fa' }}>{item.productName}</td>
                      <td className="font-mono" style={{ fontSize: '12px', color: '#64748b' }}>{item.sku}</td>
                      <td className="number-cell font-mono">{item.quantity}</td>
                      <td className="number-cell font-mono">${item.unitPrice.toFixed(2)}</td>
                      <td className="number-cell font-mono" style={{ color: item.discountPct > 0 ? '#f5b544' : '#f5f7fa' }}>
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
              background: 'rgba(7, 17, 31, 0.6)',
              border: '1px solid var(--border-glass)',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '28px',
            }}
          >
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#9aa8ba' }}>
                <span>Subtotal:</span>
                <span className="font-mono" style={{ color: '#f5f7fa' }}>${activeQuote.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#f5b544' }}>
                <span>Total Discount Applied:</span>
                <span className="font-mono">-${activeQuote.discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#f5f7fa',
                  borderTop: '1px solid var(--border-glass)',
                  paddingTop: '8px',
                }}
              >
                <span>Final Contract Total:</span>
                <span className="font-mono" style={{ color: '#38d9ff' }}>
                  ${activeQuote.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Action & Negotiation Panel */}
          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f5f7fa', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} style={{ color: '#38d9ff' }} /> Negotiation & Discussion Thread
            </h3>

            {/* Messages List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {activeQuote.negotiationHistory.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    background: msg.senderRole === 'customer' ? 'rgba(47, 140, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${msg.senderRole === 'customer' ? 'rgba(47, 140, 255, 0.3)' : 'var(--border-glass)'}`,
                    padding: '14px 18px',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9aa8ba', marginBottom: '4px' }}>
                    <strong style={{ color: msg.senderRole === 'customer' ? '#38d9ff' : '#f5f7fa' }}>
                      {msg.senderName} ({msg.senderRole === 'customer' ? 'Your Procurement Team' : 'DealFlow360 Sales Representative'})
                    </strong>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#f5f7fa' }}>{msg.message}</div>
                  {msg.proposedDiscountPct !== undefined && (
                    <div style={{ marginTop: '6px', fontSize: '12px', fontWeight: 600, color: '#f5b544' }}>
                      Requested Discount Counter: {msg.proposedDiscountPct}%
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Counter Form / Actions */}
            {isCounterFormOpen ? (
              <form onSubmit={handleCounterSubmit} style={{ background: 'rgba(245, 181, 68, 0.08)', border: '1px solid rgba(245, 181, 68, 0.25)', padding: '18px', borderRadius: '8px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#f5b544', marginBottom: '12px' }}>
                  Submit Formal Counter Discount Request
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#9aa8ba' }}>Requested Target Discount %</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="0.5"
                      className="input-glass-select"
                      value={counterDiscountInput}
                      onChange={(e) => setCounterDiscountInput(Number(e.target.value))}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#9aa8ba' }}>Preferred Delivery Target Date</label>
                    <input
                      type="date"
                      className="input-glass-select"
                      value={preferredDeliveryDate}
                      onChange={(e) => setPreferredDeliveryDate(e.target.value)}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#9aa8ba' }}>Negotiation Rationale & Comments *</label>
                    <textarea
                      className="input-glass-select"
                      rows={3}
                      placeholder="Explain your procurement requirements or volume commitments..."
                      value={counterMessage}
                      onChange={(e) => setCounterMessage(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn-glass btn-glass-secondary btn-sm" onClick={() => setIsCounterFormOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-glass btn-glass-primary btn-sm">
                    <Send size={12} /> Submit Counter Proposal
                  </button>
                </div>
              </form>
            ) : (
              !isSignedConfirmed && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button className="btn-glass btn-glass-secondary" onClick={() => setIsCounterFormOpen(true)}>
                    <MessageSquare size={14} /> Request Price Adjustment / Counter-Offer
                  </button>

                  <button className="btn-glass btn-glass-success" style={{ padding: '11px 26px', fontSize: '14px' }} onClick={handleAcceptSign}>
                    <CheckCircle2 size={16} /> Accept & Digital Sign Quotation
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
