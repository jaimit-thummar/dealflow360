import React from 'react';
import { InvoiceRecord } from '../../types';
import { Badge } from '../common/Badge';
import { X, Printer, Download, CheckCircle2, Building2 } from 'lucide-react';

interface InvoiceModalProps {
  invoice: InvoiceRecord | null;
  onClose: () => void;
  onMarkPaid: (invoiceId: string) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  invoice,
  onClose,
  onMarkPaid,
}) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ width: '700px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 className="card-title" style={{ margin: 0 }}>Tax Invoice Document</h3>
            <Badge status={invoice.status} />
          </div>
          <button className="btn btn-ghost" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ backgroundColor: '#ffffff', padding: '32px' }}>
          {/* Invoice Document Layout */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '2px solid #0f172a', paddingBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>DealFlow360 Operations Inc.</h2>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                100 Enterprise Way, Suite 500<br />
                Austin, TX 78701 USA<br />
                EIN: 84-9920192 | billing@dealflow360.com
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#2563eb' }}>{invoice.invoiceNumber}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Ref Quote: <strong className="font-mono">{invoice.quotationCode}</strong>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Payment Terms: <strong>{invoice.paymentTerms}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '6px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Billed To:</span>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{invoice.customerName}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Accounts Payable Department</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#475569' }}>
              <div>Issue Date: <strong>{invoice.issueDate}</strong></div>
              <div style={{ marginTop: '2px' }}>Due Date: <strong style={{ color: invoice.status === 'overdue' ? '#dc2626' : '#0f172a' }}>{invoice.dueDate}</strong></div>
            </div>
          </div>

          {/* Line items summary */}
          <div className="table-container" style={{ marginBottom: '24px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="number-cell">Qty</th>
                  <th className="number-cell">Rate</th>
                  <th className="number-cell">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Enterprise Hardware & Software Solutions ({invoice.quotationCode})</td>
                  <td className="number-cell font-mono">1</td>
                  <td className="number-cell font-mono">${invoice.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td className="number-cell font-mono" style={{ fontWeight: 700 }}>${invoice.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '6px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Total Invoice Amount: <strong className="font-mono" style={{ fontSize: '14px', color: '#0f172a' }}>${invoice.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Amount Paid: <strong className="font-mono" style={{ fontSize: '14px', color: '#166534' }}>${invoice.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#2563eb', marginTop: '6px' }}>
                Balance Due: ${ (invoice.totalAmount - invoice.amountPaid).toLocaleString('en-US', { minimumFractionDigits: 2 }) }
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={14} /> Print PDF
          </button>
          {invoice.status !== 'paid' && (
            <button
              className="btn btn-success"
              onClick={() => {
                onMarkPaid(invoice.id);
                onClose();
              }}
            >
              <CheckCircle2 size={15} /> Record Full Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
