import React, { useState } from 'react';
import { Customer, Product, Quotation } from '../../types';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { QuotationCreateModal } from './QuotationCreateModal';
import { QuotationDrawer } from './QuotationDrawer';
import {
  Search,
  Plus,
  Filter,
  Download,
  FileText,
  Building2,
  Calendar,
  DollarSign,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface QuotationsViewProps {
  quotations: Quotation[];
  customers: Customer[];
  products: Product[];
  onCreateQuotation: (newQuotation: Quotation) => void;
  onUpdateStatus: (quotationId: string, newStatus: Quotation['status']) => void;
  onOpenCustomerPortal: (quotationId: string) => void;
  onSendSalesRepMessage: (quotationId: string, message: string) => void;
}

export const QuotationsView: React.FC<QuotationsViewProps> = ({
  quotations,
  customers,
  products,
  onCreateQuotation,
  onUpdateStatus,
  onOpenCustomerPortal,
  onSendSalesRepMessage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerFilter, setCustomerFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filtering
  const filteredQuotations = quotations.filter((q) => {
    const matchesSearch =
      q.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.salesRep.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    const matchesCustomer = customerFilter === 'all' || q.customerId === customerFilter;

    return matchesSearch && matchesStatus && matchesCustomer;
  });

  const handleSaveModal = (newQuotation: Quotation) => {
    onCreateQuotation(newQuotation);
    setIsCreateModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['Quotation Code', 'Customer', 'Sales Rep', 'Grand Total', 'Margin %', 'Status', 'Created Date'];
    const rows = filteredQuotations.map((q) => [
      q.code,
      `"${q.customerName}"`,
      `"${q.salesRep}"`,
      q.grandTotal.toFixed(2),
      `${q.marginPct}%`,
      q.status,
      q.createdDate,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dealflow360_quotations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Top Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Quotations & Commercial Proposals</h1>
          <p className="page-subtitle">
            Manage quotation lifecycles, margin guardrails, and customer negotiation proposals.
          </p>
        </div>

        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={14} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={15} /> Create Quotation
          </button>
        </div>
      </div>

      {/* Filter and Controls Toolbar */}
      <div className="filter-bar">
        <div className="search-input-group">
          <Search size={15} style={{ color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search quote code, customer, sales rep..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
            <Filter size={13} />
            <span>Status:</span>
          </div>
          <select
            className="select-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses ({quotations.length})</option>
            <option value="draft">Draft</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="customer_countered">Customer Countered</option>
            <option value="fulfilled">Fulfilled</option>
          </select>

          <select
            className="select-control"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
          >
            <option value="all">All Customers</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Dense Data Table */}
      {isLoading ? (
        <LoadingSkeleton rows={6} columns={7} />
      ) : filteredQuotations.length === 0 ? (
        <EmptyState
          isFilter={searchTerm !== '' || statusFilter !== 'all' || customerFilter !== 'all'}
          title="No quotations found"
          description="Try broadening your search criteria or create a new quotation proposal."
          actionText="Create Quotation"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Quote Code</th>
                <th>Customer Account</th>
                <th>Assigned Rep</th>
                <th className="number-cell">Line Items</th>
                <th className="number-cell">Grand Total</th>
                <th className="number-cell">Margin %</th>
                <th>Status</th>
                <th>Valid Until</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotations.map((q) => (
                <tr
                  key={q.id}
                  className="clickable"
                  onClick={() => setSelectedQuotation(q)}
                >
                  <td className="font-mono" style={{ fontWeight: 700, color: '#2563eb' }}>
                    {q.code}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{q.customerName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{q.customerContact}</div>
                  </td>
                  <td>{q.salesRep}</td>
                  <td className="number-cell font-mono">{q.items.length} items</td>
                  <td className="number-cell font-mono" style={{ fontWeight: 700 }}>
                    ${q.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td
                    className="number-cell font-mono"
                    style={{
                      fontWeight: 600,
                      color: q.marginPct < 20 ? '#dc2626' : '#166534',
                    }}
                  >
                    {q.marginPct.toFixed(1)}%
                  </td>
                  <td>
                    <Badge status={q.status} />
                  </td>
                  <td style={{ fontSize: '12px', color: '#64748b' }}>{q.validUntil}</td>
                  <td>
                    <ChevronRight size={16} style={{ color: '#94a3b8' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Creation Modal */}
      {isCreateModalOpen && (
        <QuotationCreateModal
          customers={customers}
          products={products}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveModal}
        />
      )}

      {/* Slide-over Inspection Drawer */}
      <QuotationDrawer
        quotation={selectedQuotation}
        onClose={() => setSelectedQuotation(null)}
        onUpdateStatus={(id, status) => {
          onUpdateStatus(id, status);
          if (selectedQuotation && selectedQuotation.id === id) {
            setSelectedQuotation({ ...selectedQuotation, status });
          }
        }}
        onOpenCustomerPortal={(id) => {
          setSelectedQuotation(null);
          onOpenCustomerPortal(id);
        }}
        onSendSalesRepMessage={(id, msg) => {
          onSendSalesRepMessage(id, msg);
          if (selectedQuotation && selectedQuotation.id === id) {
            const updatedHistory = [
              ...selectedQuotation.negotiationHistory,
              {
                id: `msg-${Date.now()}`,
                quotationId: id,
                senderRole: 'sales_rep' as const,
                senderName: selectedQuotation.salesRep,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                message: msg,
              },
            ];
            setSelectedQuotation({ ...selectedQuotation, negotiationHistory: updatedHistory });
          }
        }}
      />
    </div>
  );
};
