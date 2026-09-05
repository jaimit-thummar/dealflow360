import React, { useState } from 'react';
import { Quotation, ViewMode } from '../../types';
import { Badge } from '../common/Badge';
import {
  X,
  FileText,
  Send,
  CheckCircle,
  Truck,
  DollarSign,
  AlertTriangle,
  MessageSquare,
  Building2,
  Calendar,
  ExternalLink,
  ShieldCheck,
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
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">
            <FileText size={18} style={{ color: '#2563eb' }} />
            <span>{quotation.code}</span>
            <Badge status={quotation.status} />
          </div>
          <button className="btn btn-ghost" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {/* Top Quick Status & Actions */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Customer Account</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={15} style={{ color: '#475569' }} />
                {quotation.customerName}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Contact: {quotation.customerContact} ({quotation.customerEmail})
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Grand Total</div>
              <div className="font-mono" style={{ fontSize: '20px', fontWeight: 700, color: '#2563eb' }}>
                ${quotation.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '12px', color: quotation.marginPct < 20 ? '#dc2626' : '#166534', fontWeight: 600 }}>
                Margin: {quotation.marginPct}%
              </div>
            </div>
          </div>

          {/* Alert if pending approval */}
          {quotation.status === 'pending_approval' && (
            <div className="alert-banner warning" style={{ marginBottom: '20px' }}>
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Pending Multi-Tier Approval</strong>
                <p style={{ marginTop: '2px' }}>{quotation.approvalReason || 'Discount rate exceeds standard sales rep delegation limit.'}</p>
              </div>
            </div>
          )}

          {/* Operational Metadata Grid */}
          <div className="form-grid" style={{ marginBottom: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px' }}>
            <div>
              <span className="form-label">Sales Representative:</span>
              <div style={{ fontWeight: 600, marginTop: '2px' }}>{quotation.salesRep}</div>
            </div>
            <div>
              <span className="form-label">Fulfillment Warehouse:</span>
              <div style={{ fontWeight: 600, marginTop: '2px' }}>{quotation.warehouseHub}</div>
            </div>
            <div>
              <span className="form-label">Created Date:</span>
              <div style={{ fontWeight: 500, marginTop: '2px' }}>{quotation.createdDate}</div>
            </div>
            <div>
              <span className="form-label">Valid Until:</span>
              <div style={{ fontWeight: 500, marginTop: '2px' }}>{quotation.validUntil}</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div style={{ marginBottom: '24px' }}>
            <h4 className="card-title" style={{ fontSize: '13px', marginBottom: '8px' }}>Quotation Breakdown</h4>
            <div className="table-container">
              <table className="data-table">
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
                        <div style={{ fontWeight: 600 }}>{item.productName}</div>
                        <div className="font-mono" style={{ fontSize: '11px', color: '#64748b' }}>{item.sku}</div>
                      </td>
                      <td className="number-cell font-mono">{item.quantity}</td>
                      <td className="number-cell font-mono">${item.unitPrice.toFixed(2)}</td>
                      <td className="number-cell font-mono">{item.discountPct}%</td>
                      <td className="number-cell font-mono" style={{ fontWeight: 600 }}>
                        ${item.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td
                        className="number-cell font-mono"
                        style={{
                          fontWeight: 600,
                          color: item.marginPct < 20 ? '#dc2626' : '#166534',
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
            <h4 className="card-title" style={{ fontSize: '13px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={15} style={{ color: '#2563eb' }} />
              <span>Customer Negotiation & Activity Audit Trail</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {quotation.negotiationHistory.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', padding: '12px', background: '#f8fafc', borderRadius: '4px' }}>
                  No messages exchanged yet.
                </div>
              ) : (
                quotation.negotiationHistory.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      borderLeft: `3px solid ${msg.senderRole === 'customer' ? '#f59e0b' : '#2563eb'}`,
                      backgroundColor: msg.senderRole === 'customer' ? '#fffbeb' : '#f8fafc',
                      padding: '10px 12px',
                      borderRadius: '0 4px 4px 0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                      <strong style={{ color: msg.senderRole === 'customer' ? '#b45309' : '#1e40af' }}>
                        {msg.senderName} ({msg.senderRole === 'customer' ? 'Customer' : 'Sales Operations Rep'})
                      </strong>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#0f172a' }}>{msg.message}</div>
                    {msg.proposedDiscountPct !== undefined && (
                      <div style={{ marginTop: '4px', fontSize: '12px', fontWeight: 600, color: '#92400e' }}>
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
                className="form-input"
                placeholder="Send official response to customer negotiation thread..."
                value={repReply}
                onChange={(e) => setRepReply(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                <Send size={13} /> Send Reply
              </button>
            </form>
          </div>
        </div>

        <div className="drawer-footer">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onOpenCustomerPortal(quotation.id)}
          >
            <ExternalLink size={13} /> Open Customer View
          </button>

          {quotation.status === 'draft' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onUpdateStatus(quotation.id, 'sent_to_customer')}
            >
              <Send size={13} /> Send to Customer
            </button>
          )}

          {quotation.status === 'approved' && (
            <button
              className="btn btn-success btn-sm"
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
