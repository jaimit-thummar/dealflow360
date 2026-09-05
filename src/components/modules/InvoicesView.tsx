import React, { useState } from 'react';
import { InvoiceRecord } from '../../types';
import { Badge } from '../common/Badge';
import { InvoiceModal } from './InvoiceModal';
import { Receipt, CheckCircle2, AlertCircle, Send, FileText } from 'lucide-react';

interface InvoicesViewProps {
  invoices: InvoiceRecord[];
  onMarkPaid: (invoiceId: string) => void;
  onSendReminder: (invoiceId: string) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  onMarkPaid,
  onSendReminder,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  const totalInvoiced = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.amountPaid, 0);
  const totalOutstanding = totalInvoiced - totalCollected;

  const unpaidCount = invoices.filter((i) => i.status !== 'paid').length;
  const paidCount = invoices.filter((i) => i.status === 'paid').length;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Invoices & Accounts Receivable</h1>
          <p className="page-subheading">
            Billing management, payment collections tracking, Net 30/60 terms, and ledger reconciliation.
          </p>
        </div>

        <div style={{ fontSize: '13px', fontWeight: 600, color: '#ff6b72', backgroundColor: 'rgba(255,107,114,0.12)', padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(255,107,114,0.3)' }}>
          Outstanding Balance: <strong className="font-mono">${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>

      {/* Top Indicators: Unpaid vs Paid */}
      <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Unpaid Accounts</span>
            <AlertCircle size={16} style={{ color: '#f5b544' }} />
          </div>
          <div className="kpi-main-val" style={{ color: '#f5b544' }}>
            {unpaidCount} Unpaid
          </div>
          <div className="kpi-sub-label">Collection follow-ups required</div>
        </div>

        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Collected Payments</span>
            <CheckCircle2 size={16} style={{ color: '#31d38a' }} />
          </div>
          <div className="kpi-main-val" style={{ color: '#31d38a' }}>
            {paidCount} Paid
          </div>
          <div className="kpi-sub-label font-mono">${totalCollected.toLocaleString('en-US')} reconciled</div>
        </div>

        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Total Invoiced Revenue</span>
            <Receipt size={16} style={{ color: '#38d9ff' }} />
          </div>
          <div className="kpi-main-val font-mono">
            ${totalInvoiced.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </div>
          <div className="kpi-sub-label">Commercial ledger total</div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="table-glass-wrapper">
        <table className="table-glass">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Ref Quote</th>
              <th>Customer Account</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Terms</th>
              <th className="number-cell">Total Amount</th>
              <th className="number-cell">Amount Paid</th>
              <th>Status</th>
              <th className="number-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="clickable" onClick={() => setSelectedInvoice(inv)}>
                <td className="font-mono" style={{ fontWeight: 700, color: '#2f8cff' }}>
                  {inv.invoiceNumber}
                </td>
                <td className="font-mono" style={{ fontSize: '12px', color: '#9aa8ba' }}>
                  {inv.quotationCode}
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#f5f7fa' }}>{inv.customerName}</div>
                </td>
                <td style={{ fontSize: '12px' }}>{inv.issueDate}</td>
                <td style={{ fontSize: '12px', color: inv.status === 'overdue' ? '#ff6b72' : '#9aa8ba' }}>
                  {inv.dueDate}
                </td>
                <td>
                  <span className="badge-glass badge-glass-neutral">{inv.paymentTerms}</span>
                </td>
                <td className="number-cell font-mono" style={{ fontWeight: 700 }}>
                  ${inv.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="number-cell font-mono" style={{ color: '#31d38a' }}>
                  ${inv.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td>
                  <Badge status={inv.status} />
                </td>
                <td className="number-cell" onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button
                      className="btn-glass btn-glass-secondary btn-sm"
                      onClick={() => setSelectedInvoice(inv)}
                    >
                      <FileText size={12} /> View PDF
                    </button>
                    {inv.status !== 'paid' && (
                      <button
                        className="btn-glass btn-glass-primary btn-sm"
                        onClick={() => onSendReminder(inv.id)}
                      >
                        <Send size={12} /> Reminder
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice Detail / Printable Modal */}
      <InvoiceModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onMarkPaid={(id) => {
          onMarkPaid(id);
          if (selectedInvoice && selectedInvoice.id === id) {
            setSelectedInvoice({ ...selectedInvoice, status: 'paid', amountPaid: selectedInvoice.totalAmount });
          }
        }}
      />
    </div>
  );
};
