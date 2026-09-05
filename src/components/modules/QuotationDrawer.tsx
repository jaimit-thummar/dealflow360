import React, { useState } from 'react';
import { Quotation } from '../../types';
import { Badge } from '../common/Badge';
import {
  X,
  FileText,
  Send,
  Truck,
  AlertTriangle,
  MessageSquare,
  Building2,
  ExternalLink,
} from 'lucide-react';

interface QuotationDrawerProps {
  quotation: Quotation | null;
  onClose: () => void;
  onUpdateStatus: (quotationId: string, newStatus: Quotation['status']) => void;
  onOpenCustomerPortal: (quotationId: string) => void;
  onSendSalesRepMessage: (quotationId: string, message: string) => void;
}

export const QuotationDrawer: React.FC<QuotationDrawerProps> = ({
  quotation,
  onClose,
  onUpdateStatus,
  onOpenCustomerPortal,
  onSendSalesRepMessage,
}) => {
  const [repReply, setRepReply] = useState('');

  if (!quotation) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repReply.trim()) return;
    onSendSalesRepMessage(quotation.id, repReply);
    setRepReply('');
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div
        className="drawer-panel"
        style={{
          background: 'rgba(9, 23, 42, 0.95)',
          backdropFilter: 'blur(16px)',
          borderLeft: '1px solid var(--border-glass-light)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header" style={{ background: 'rgba(7, 17, 31, 0.8)', borderBottom: '1px solid var(--border-glass)' }}>
          <div className="drawer-title" style={{ color: '#f5f7fa' }}>
            <FileText size={18} style={{ color: '#38d9ff' }} />
            <span className="font-mono">{quotation.code}</span>
            <Badge status={quotation.status} />
          </div>
          <button style={{ color: '#9aa8ba' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {/* Top Quick Status & Actions */}
          <div
            style={{
              background: 'rgba(15, 28, 48, 0.7)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#9aa8ba', textTransform: 'uppercase' }}>Customer Account</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#f5f7fa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={15} style={{ color: '#38d9ff' }} />
                {quotation.customerName}
              </div>
              <div style={{ fontSize: '12px', color: '#9aa8ba', marginTop: '2px' }}>
                Contact: {quotation.customerContact} ({quotation.customerEmail})
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#9aa8ba', textTransform: 'uppercase' }}>Grand Total</div>
              <div className="font-mono" style={{ fontSize: '20px', fontWeight: 700, color: '#38d9ff' }}>
                ${quotation.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '12px', color: quotation.marginPct < 20 ? '#ff6b72' : '#31d38a', fontWeight: 600 }}>
                Margin: {quotation.marginPct}%
              </div>
            </div>
          </div>

          {/* Alert if pending approval */}
          {quotation.status === 'pending_approval' && (
            <div className="alert-glass-warning" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={18} style={{ color: '#f5b544' }} />
                <div>
                  <strong style={{ color: '#f5b544' }}>Pending Multi-Tier Approval</strong>
                  <p style={{ fontSize: '12px', color: '#9aa8ba', marginTop: '2px' }}>{quotation.approvalReason || 'Discount rate exceeds standard sales rep delegation limit.'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Line Items Table */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#f5f7fa', marginBottom: '8px' }}>Quotation Breakdown</h4>
            <div className="table-glass-wrapper">
              <table className="table-glass">
                <thead>
                  <tr>
                    <th>Item / SKU</th>
                    <th className="number-cell">Qty</th>
                    <th className="number-cell">Price</th>
                    <th className="number-cell">Disc %</th>
                    <th className="number-cell">Total</th>
                    <th className="number-cell">Margin %</th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#f5f7fa' }}>{item.productName}</div>
                        <div className="font-mono" style={{ fontSize: '11px', color: '#64748b' }}>{item.sku}</div>
                      </td>
                      <td className="number-cell font-mono">{item.quantity}</td>
                      <td className="number-cell font-mono">${item.unitPrice.toFixed(2)}</td>
                      <td className="number-cell font-mono">
                        {item.discountPct}% {item.discountPct > 15 && <span className="tag-overlimit">OVER +8pt</span>}
                      </td>
                      <td className="number-cell font-mono" style={{ fontWeight: 600 }}>
                        ${item.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td
                        className="number-cell font-mono"
                        style={{
                          fontWeight: 600,
                          color: item.marginPct < 20 ? '#ff6b72' : '#31d38a',
                        }}
                      >
                        {item.marginPct.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Negotiation & Activity Timeline */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#f5f7fa', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={15} style={{ color: '#38d9ff' }} />
              <span>Customer Negotiation & Activity Audit Trail</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {quotation.negotiationHistory.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#9aa8ba', fontStyle: 'italic', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                  No messages exchanged yet.
                </div>
              ) : (
                quotation.negotiationHistory.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      borderLeft: `3px solid ${msg.senderRole === 'customer' ? '#f5b544' : '#2f8cff'}`,
                      background: msg.senderRole === 'customer' ? 'rgba(245, 181, 68, 0.08)' : 'rgba(255,255,255,0.03)',
                      padding: '10px 12px',
                      borderRadius: '0 6px 6px 0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9aa8ba', marginBottom: '4px' }}>
                      <strong style={{ color: msg.senderRole === 'customer' ? '#f5b544' : '#38d9ff' }}>
                        {msg.senderName} ({msg.senderRole === 'customer' ? 'Customer' : 'Sales Operations Rep'})
                      </strong>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#f5f7fa' }}>{msg.message}</div>
                    {msg.proposedDiscountPct !== undefined && (
                      <div style={{ marginTop: '4px', fontSize: '12px', fontWeight: 600, color: '#f5b544' }}>
                        Proposed Discount: {msg.proposedDiscountPct}%
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="input-glass-select"
                placeholder="Send official response to customer negotiation thread..."
                value={repReply}
                onChange={(e) => setRepReply(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-glass btn-glass-primary btn-sm">
                <Send size={13} /> Send Reply
              </button>
            </form>
          </div>
        </div>

        <div className="drawer-footer" style={{ background: 'rgba(7, 17, 31, 0.8)', borderTop: '1px solid var(--border-glass)' }}>
          <button
            className="btn-glass btn-glass-secondary btn-sm"
            onClick={() => onOpenCustomerPortal(quotation.id)}
          >
            <ExternalLink size={13} /> Open Customer View
          </button>

          {quotation.status === 'draft' && (
            <button
              className="btn-glass btn-glass-primary btn-sm"
              onClick={() => onUpdateStatus(quotation.id, 'sent_to_customer')}
            >
              <Send size={13} /> Send to Customer
            </button>
          )}

          {quotation.status === 'approved' && (
            <button
              className="btn-glass btn-glass-success btn-sm"
              onClick={() => onUpdateStatus(quotation.id, 'fulfilled')}
            >
              <Truck size={13} /> Dispatch to Fulfillment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
