import React, { useState } from 'react';
import { InvoiceRecord } from '../../types';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { InvoiceModal } from './InvoiceModal';
import { Receipt, DollarSign, Send, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

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

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Invoices & Accounts Receivable</h1>
          <p className="page-subtitle">
            Billing management, payment collections tracking, Net 30/60 terms, and ledger reconciliation.
          </p>
        </div>

        <div className="header-actions">
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626', backgroundColor: '#fee2e2', padding: '6px 14px', borderRadius: '4px', border: '1px solid #fecaca' }}>
            Outstanding Balance: <strong className="font-mono">${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
          </div>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="kpi-grid" style={{ marginBottom: '24px' }}>
        <div className="kpi-card">
          <div className="kpi-title">
            <span>Total Invoiced Revenue</span>
            <Receipt size={16} style={{ color: '#2563eb' }} />
          </div>
          <div className="kpi-value font-mono">
            ${totalInvoiced.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </div>
          <div className="kpi-subtext positive">
            <span>Commercial ledger total</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">
            <span>Collected Revenue</span>
            <CheckCircle2 size={16} style={{ color: '#166534' }} />
          </div>
          <div className="kpi-value font-mono" style={{ color: '#166534' }}>
            ${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </div>
          <div className="kpi-subtext positive">
            <span>Reconciled cash payments</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">
            <span>Overdue Payments</span>
            <AlertCircle size={16} style={{ color: '#dc2626' }} />
          </div>
          <div className="kpi-value font-mono" style={{ color: '#dc2626' }}>
            {invoices.filter((i) => i.status === 'overdue').length}
          </div>
          <div className="kpi-subtext warning">
            <span>Delta LLC payment past Net 30</span>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="table-container">
        <table className="data-table">
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
                <td className="font-mono" style={{ fontWeight: 700, color: '#2563eb' }}>
                  {inv.invoiceNumber}
                </td>
                <td className="font-mono" style={{ fontSize: '12px', color: '#64748b' }}>
                  {inv.quotationCode}
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{inv.customerName}</div>
                </td>
                <td style={{ fontSize: '12px' }}>{inv.issueDate}</td>
                <td style={{ fontSize: '12px', color: inv.status === 'overdue' ? '#dc2626' : '#475569' }}>
                  {inv.dueDate}
                </td>
                <td>
                  <span className="badge badge-neutral">{inv.paymentTerms}</span>
                </td>
                <td className="number-cell font-mono" style={{ fontWeight: 700 }}>
                  ${inv.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="number-cell font-mono" style={{ color: '#166534' }}>
                  ${inv.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td>
                  <Badge status={inv.status} />
                </td>
                <td className="number-cell" onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedInvoice(inv)}
                    >
                      <FileText size={12} /> View PDF
                    </button>
                    {inv.status !== 'paid' && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => onSendReminder(inv.id)}
                        title="Send Payment Reminder Email"
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
