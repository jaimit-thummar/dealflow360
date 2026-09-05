import React, { useState } from 'react';
import { InvoiceRecord } from '../../types';
import { Badge } from '../common/Badge';
import { InvoiceModal } from './InvoiceModal';
import {
  Receipt,
  CheckCircle2,
  AlertCircle,
  Send,
  FileText,
  Truck,
  Info,
  ChevronRight,
  Download,
  CreditCard,
} from 'lucide-react';

interface InvoicesViewProps {
  invoices?: InvoiceRecord[];
  onMarkPaid?: (invoiceId: string) => void;
  onSendReminder?: (invoiceId: string) => void;
}

interface FinancialInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  status: 'unpaid' | 'paid' | 'overdue';
  dueDate: string;
  quotationCode: string;
  deliveredQty: number;
  totalQty: number;
  warehouseSplitNote: string;
}

const SAMPLE_INVOICES: FinancialInvoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-0811',
    customerName: 'Acme Corp',
    amount: 28800.0,
    status: 'unpaid',
    dueDate: 'Sep 25',
    quotationCode: 'Q-1042',
    deliveredQty: 18,
    totalQty: 24,
    warehouseSplitNote: 'Partial invoicing tied to 18 units delivered via Main Warehouse + East Depot split.',
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-0812',
    customerName: 'Beta Industries',
    amount: 105110.0,
    status: 'unpaid',
    dueDate: 'Oct 02',
    quotationCode: 'Q-1039',
    deliveredQty: 45,
    totalQty: 45,
    warehouseSplitNote: 'Full shipment quantity delivered from Chicago Hub (HUB-02).',
  },
  {
    id: 'inv-103',
    invoiceNumber: 'INV-2026-0809',
    customerName: 'Nova Retail',
    amount: 14200.0,
    status: 'unpaid',
    dueDate: 'Sep 18',
    quotationCode: 'Q-1035',
    deliveredQty: 12,
    totalQty: 15,
    warehouseSplitNote: 'Partial invoicing for 12 delivered units; 3 units on backorder pending restock.',
  },
  {
    id: 'inv-104',
    invoiceNumber: 'INV-2026-0805',
    customerName: 'Orion Ltd',
    amount: 9750.0,
    status: 'unpaid',
    dueDate: 'Sep 12',
    quotationCode: 'Q-1030',
    deliveredQty: 10,
    totalQty: 10,
    warehouseSplitNote: 'Standard order release invoiced post-delivery confirmation.',
  },
  {
    id: 'inv-105',
    invoiceNumber: 'INV-2026-0740',
    customerName: 'Zenith Co',
    amount: 41000.0,
    status: 'paid',
    dueDate: 'Aug 30',
    quotationCode: 'Q-1028',
    deliveredQty: 30,
    totalQty: 30,
    warehouseSplitNote: 'Reconciled payment logged via wire transfer (Ref #WT-9921).',
  },
  {
    id: 'inv-106',
    invoiceNumber: 'INV-2026-0738',
    customerName: 'Apex Tech',
    amount: 18500.0,
    status: 'paid',
    dueDate: 'Aug 20',
    quotationCode: 'Q-1022',
    deliveredQty: 15,
    totalQty: 15,
    warehouseSplitNote: 'Fully paid commercial invoice ledger.',
  },
];

export const InvoicesView: React.FC<InvoicesViewProps> = () => {
  const [invoiceList, setInvoiceList] = useState<FinancialInvoice[]>(SAMPLE_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<FinancialInvoice | null>(SAMPLE_INVOICES[0]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const unpaidCount = 4; // Prompts spec: 4 Unpaid
  const paidCount = 21;  // Prompts spec: 21 Paid

  const handleRecordPayment = (id: string) => {
    setInvoiceList((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'paid' } : inv))
    );
    if (selectedInvoice && selectedInvoice.id === id) {
      setSelectedInvoice({ ...selectedInvoice, status: 'paid' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Invoices & Financial Ledger</h1>
          <p className="page-subheading">
            Accounts receivable, quantity-based partial invoicing, and commercial payment reconciliation.
          </p>
        </div>

        <div
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#f5b544',
            backgroundColor: 'rgba(245,181,68,0.08)',
            padding: '6px 14px',
            borderRadius: '6px',
            border: '1px solid rgba(245,181,68,0.2)',
          }}
        >
          Unpaid Invoices: <strong className="font-mono">{unpaidCount} Accounts</strong>
        </div>
      </div>

      {/* TOP SUMMARY (4 Unpaid, 21 Paid) */}
      <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Unpaid Invoices</span>
            <AlertCircle size={16} style={{ color: '#f5b544' }} />
          </div>
          <div className="kpi-main-val" style={{ color: '#f5b544' }}>
            {unpaidCount} Unpaid
          </div>
          <div className="kpi-sub-label">Collection receivables awaiting reconciliation</div>
        </div>

        <div className="kpi-glass-card">
          <div className="kpi-head">
            <span className="kpi-label">Paid Invoices</span>
            <CheckCircle2 size={16} style={{ color: '#31d38a' }} />
          </div>
          <div className="kpi-main-val" style={{ color: '#31d38a' }}>
            {paidCount} Paid
          </div>
          <div className="kpi-sub-label">Commercial accounts fully settled</div>
        </div>
      </div>

      {/* OPERATIONAL POLICY NOTICE */}
      <div
        style={{
          background: 'rgba(47, 140, 255, 0.08)',
          border: '1px solid rgba(47, 140, 255, 0.2)',
          borderRadius: '6px',
          padding: '12px 18px',
          fontSize: '13px',
          color: '#2f8cff',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Info size={18} style={{ color: '#38d9ff', flexShrink: 0 }} />
        <span>
          <strong>Fulfillment Invoicing Policy:</strong> Partial invoicing is strictly tied to delivered quantities from warehouse fulfillment shipments.
        </span>
      </div>

      {/* INVOICES TABLE */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>
            Invoices List
          </h3>
          <span style={{ fontSize: '12px', color: '#9aa8ba' }}>
            Select invoice row to inspect detail & ledger timeline
          </span>
        </div>

        <div className="table-glass-wrapper">
          <table className="table-glass">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th className="number-cell">Amount</th>
                <th>Status</th>
                <th>Due Date</th>
                <th className="number-cell">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoiceList.map((inv) => {
                const isSelected = selectedInvoice?.id === inv.id;
                return (
                  <tr
                    key={inv.id}
                    className={`clickable ${isSelected ? 'row-selected' : ''}`}
                    onClick={() => setSelectedInvoice(inv)}
                    style={{
                      background: isSelected ? 'rgba(47, 140, 255, 0.12)' : undefined,
                    }}
                  >
                    <td className="font-mono" style={{ fontWeight: 700, color: '#38d9ff' }}>
                      {inv.invoiceNumber}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#f5f7fa' }}>{inv.customerName}</div>
                      <div style={{ fontSize: '11px', color: '#9aa8ba' }}>Ref: {inv.quotationCode}</div>
                    </td>
                    <td className="number-cell font-mono" style={{ fontWeight: 700, color: '#f5f7fa' }}>
                      ${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      {inv.status === 'unpaid' && (
                        <span className="badge-glass badge-glass-warning">Unpaid</span>
                      )}
                      {inv.status === 'paid' && (
                        <span className="badge-glass badge-glass-success">Paid</span>
                      )}
                      {inv.status === 'overdue' && (
                        <span className="badge-glass badge-glass-danger">Overdue</span>
                      )}
                    </td>
                    <td className="font-mono" style={{ fontSize: '12px', color: inv.status === 'unpaid' ? '#f5b544' : '#9aa8ba' }}>
                      {inv.dueDate}
                    </td>
                    <td className="number-cell">
                      <button
                        className="btn-glass btn-glass-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInvoice(inv);
                          setIsModalOpen(true);
                        }}
                      >
                        <FileText size={12} /> Inspect Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVOICE DETAIL INSPECTOR */}
      {selectedInvoice && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: '#38d9ff' }}>
                  {selectedInvoice.invoiceNumber}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>
                  {selectedInvoice.customerName}
                </h3>
              </div>
              <div style={{ fontSize: '12px', color: '#9aa8ba', marginTop: '2px' }}>
                Ref Quote: <strong className="font-mono" style={{ color: '#2f8cff' }}>{selectedInvoice.quotationCode}</strong> | Due Date: <strong className="font-mono">{selectedInvoice.dueDate}</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#9aa8ba', fontWeight: 700 }}>
                Total Invoiced Amount
              </div>
              <div className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: '#31d38a' }}>
                ${selectedInvoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* HORIZONTAL INVOICE TIMELINE STEPPER */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#9aa8ba', fontWeight: 700, marginBottom: '12px' }}>
              Invoice Lifecycle Progression Timeline
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.02)',
                padding: '16px 24px',
                borderRadius: '8px',
                border: '1px solid var(--border-glass)',
              }}
            >
              {/* Step 1: Order Confirmed */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#31d38a', color: '#091526', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f5f7fa' }}>Order Confirmed</div>
                  <div style={{ fontSize: '11px', color: '#9aa8ba' }}>Commercial sign-off</div>
                </div>
              </div>

              <div style={{ flex: 1, height: '2px', background: '#31d38a', margin: '0 16px' }} />

              {/* Step 2: Shipped */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#31d38a', color: '#091526', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f5f7fa' }}>Shipped</div>
                  <div style={{ fontSize: '11px', color: '#38d9ff' }}>{selectedInvoice.deliveredQty} of {selectedInvoice.totalQty} units</div>
                </div>
              </div>

              <div style={{ flex: 1, height: '2px', background: '#31d38a', margin: '0 16px' }} />

              {/* Step 3: Invoiced */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#31d38a', color: '#091526', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f5f7fa' }}>Invoiced</div>
                  <div style={{ fontSize: '11px', color: '#9aa8ba' }}>Ledger generated</div>
                </div>
              </div>

              <div style={{ flex: 1, height: '2px', background: selectedInvoice.status === 'paid' ? '#31d38a' : 'rgba(255,255,255,0.1)', margin: '0 16px' }} />

              {/* Step 4: Paid */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: selectedInvoice.status === 'paid' ? '#31d38a' : 'rgba(255,255,255,0.1)', color: selectedInvoice.status === 'paid' ? '#091526' : '#9aa8ba', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>
                  {selectedInvoice.status === 'paid' ? '✓' : '4'}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: selectedInvoice.status === 'paid' ? '#31d38a' : '#9aa8ba' }}>Paid</div>
                  <div style={{ fontSize: '11px', color: '#9aa8ba' }}>
                    {selectedInvoice.status === 'paid' ? 'Settled' : 'Awaiting payment'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PARTIAL INVOICING COMMUNICATION BOX */}
          <div
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '8px',
              border: '1px solid var(--border-glass)',
              padding: '16px',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#9aa8ba', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={16} style={{ color: '#38d9ff' }} />
              <strong style={{ color: '#f5f7fa' }}>Delivered Quantity Linkage:</strong>
              <span>{selectedInvoice.warehouseSplitNote}</span>
            </div>
          </div>

          {/* ACTIONS: RECORD PAYMENT & DOWNLOAD SUMMARY */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <button
              className="btn-glass btn-glass-secondary"
              onClick={() => {
                alert(`Downloading PDF Summary for invoice ${selectedInvoice.invoiceNumber}...`);
              }}
            >
              <Download size={14} /> Download Summary
            </button>
            <button
              className="btn-glass btn-glass-success"
              onClick={() => handleRecordPayment(selectedInvoice.id)}
              disabled={selectedInvoice.status === 'paid'}
            >
              <CreditCard size={14} /> Record Payment
            </button>
          </div>
        </div>
      )}

      {/* FULL INVOICE PRINT MODAL */}
      <InvoiceModal
        invoice={
          selectedInvoice
            ? {
                id: selectedInvoice.id,
                invoiceNumber: selectedInvoice.invoiceNumber,
                quotationCode: selectedInvoice.quotationCode,
                customerName: selectedInvoice.customerName,
                issueDate: '2026-09-01',
                dueDate: selectedInvoice.dueDate,
                totalAmount: selectedInvoice.amount,
                amountPaid: selectedInvoice.status === 'paid' ? selectedInvoice.amount : 0,
                status: selectedInvoice.status === 'paid' ? 'paid' : 'sent',
                paymentTerms: 'Net 30',
              }
            : null
        }
        onClose={() => setIsModalOpen(false)}
        onMarkPaid={(id) => handleRecordPayment(selectedInvoice?.id || id)}
      />
    </div>
  );
};

