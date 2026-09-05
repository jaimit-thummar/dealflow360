import React, { useState } from 'react';
import { Customer, Product, Quotation, QuotationItem, WarehouseHub } from '../../types';
import { X, Plus, Trash2, AlertTriangle, Sparkles, Check } from 'lucide-react';

interface QuotationCreateModalProps {
  customers: Customer[];
  products: Product[];
  onClose: () => void;
  onSave: (newQuotation: Quotation) => void;
}

export const QuotationCreateModal: React.FC<QuotationCreateModalProps> = ({
  customers,
  products,
  onClose,
  onSave,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [salesRep, setSalesRep] = useState<string>('Sarah Jenkins');
  const [warehouseHub, setWarehouseHub] = useState<WarehouseHub>('Dallas (HUB-01)');
  const [validUntil, setValidUntil] = useState<string>('2026-10-15');

  // Line items state
  const [items, setItems] = useState<QuotationItem[]>([
    {
      id: 'item-init-1',
      productId: products[0]?.id || 'prod-1',
      productName: products[0]?.name || 'Laptop Pro 14',
      sku: products[0]?.sku || 'HW-LTP-14',
      quantity: 10,
      unitPrice: products[0]?.listPrice || 1850.0,
      cogs: products[0]?.cogs || 1250.0,
      discountPct: 5.0,
      lineTotal: 17575.0,
      marginPct: 28.9,
    },
  ]);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const handleItemChange = (
    index: number,
    field: keyof QuotationItem,
    value: number | string
  ) => {
    const updated = [...items];
    const item = { ...updated[index] };

    if (field === 'productId') {
      const prod = products.find((p) => p.id === value);
      if (prod) {
        item.productId = prod.id;
        item.productName = prod.name;
        item.sku = prod.sku;
        item.unitPrice = prod.listPrice;
        item.cogs = prod.cogs;
        item.discountPct = prod.defaultDiscountPct;
      }
    } else if (field === 'quantity') {
      item.quantity = Math.max(1, Number(value));
    } else if (field === 'discountPct') {
      item.discountPct = Math.min(100, Math.max(0, Number(value)));
    } else if (field === 'unitPrice') {
      item.unitPrice = Math.max(0, Number(value));
    }

    // Calculations
    const grossPrice = item.unitPrice * item.quantity;
    const discountVal = (grossPrice * item.discountPct) / 100;
    item.lineTotal = grossPrice - discountVal;
    const itemTotalCogs = item.cogs * item.quantity;
    item.marginPct = item.lineTotal > 0 ? ((item.lineTotal - itemTotalCogs) / item.lineTotal) * 100 : 0;

    updated[index] = item;
    setItems(updated);
  };

  const handleAddItem = (productOverride?: Product) => {
    const targetProd = productOverride || products[0];
    const gross = targetProd.listPrice * 1;
    const disc = (gross * targetProd.defaultDiscountPct) / 100;
    const lineTotal = gross - disc;
    const marginPct = ((lineTotal - targetProd.cogs) / lineTotal) * 100;

    const newItem: QuotationItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId: targetProd.id,
      productName: targetProd.name,
      sku: targetProd.sku,
      quantity: 1,
      unitPrice: targetProd.listPrice,
      cogs: targetProd.cogs,
      discountPct: targetProd.defaultDiscountPct,
      lineTotal,
      marginPct,
      isUpsellRecommendation: !!productOverride,
    };

    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Grand totals
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const grandTotal = items.reduce((acc, item) => acc + item.lineTotal, 0);
  const discountAmount = subtotal - grandTotal;
  const avgDiscountPct = subtotal > 0 ? (discountAmount / subtotal) * 100 : 0;
  const totalCogs = items.reduce((acc, item) => acc + item.cogs * item.quantity, 0);
  const totalMarginPct = grandTotal > 0 ? ((grandTotal - totalCogs) / grandTotal) * 100 : 0;

  // Guardrail rule
  const requiresApproval = avgDiscountPct > 15 || items.some((i) => i.discountPct > 15);
  const approvalReason = requiresApproval
    ? `Average quotation discount (${avgDiscountPct.toFixed(1)}%) exceeds 15.0% rep delegation limit.`
    : undefined;

  const currentProductIds = items.map((i) => i.productId);
  const recommendedProducts = products.filter(
    (p) =>
      !currentProductIds.includes(p.id) &&
      items.some((i) => {
        const prod = products.find((pr) => pr.id === i.productId);
        return prod?.upsellIds.includes(p.id) || prod?.crossSellIds.includes(p.id);
      })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = `QT-2026-${Math.floor(8500 + Math.random() * 900)}`;

    const newQuotation: Quotation = {
      id: `q-${Date.now()}`,
      code: newCode,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerContact: selectedCustomer.contactName,
      customerEmail: selectedCustomer.contactEmail,
      items,
      subtotal,
      discountAmount,
      grandTotal,
      totalCogs,
      marginPct: Number(totalMarginPct.toFixed(1)),
      status: requiresApproval ? 'pending_approval' : 'approved',
      requiresApproval,
      approvalReason,
      createdDate: new Date().toISOString().split('T')[0],
      validUntil,
      salesRep,
      warehouseHub,
      negotiationHistory: [
        {
          id: `msg-${Date.now()}`,
          quotationId: `q-${Date.now()}`,
          senderRole: 'sales_rep',
          senderName: salesRep,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          message: `Quotation created and ${requiresApproval ? 'submitted for Manager Approval' : 'approved'}.`,
        },
      ],
    };

    onSave(newQuotation);
  };

  return (
    <div className="search-modal-backdrop">
      <div className="search-modal-box" style={{ width: '920px' }}>
        <div className="search-modal-input-wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>Create New Quotation</h2>
            <span className="badge-glass badge-glass-neutral">Draft Generator</span>
          </div>
          <button onClick={onClose} style={{ color: '#9aa8ba' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '20px', maxHeight: '75vh', overflowY: 'auto' }}>
            {/* Top Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#9aa8ba' }}>Target Customer Account *</label>
                <select
                  className="input-glass-select"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code}) - Tier: {c.tier}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#9aa8ba' }}>Assigned Sales Representative</label>
                <input
                  type="text"
                  className="input-glass-select"
                  value={salesRep}
                  onChange={(e) => setSalesRep(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#9aa8ba' }}>Warehouse Dispatch Hub *</label>
                <select
                  className="input-glass-select"
                  value={warehouseHub}
                  onChange={(e) => setWarehouseHub(e.target.value as WarehouseHub)}
                >
                  <option value="Dallas (HUB-01)">Dallas (HUB-01)</option>
                  <option value="Chicago (HUB-02)">Chicago (HUB-02)</option>
                  <option value="Frankfurt (HUB-03)">Frankfurt (HUB-03)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#9aa8ba' }}>Expiration Date</label>
                <input
                  type="date"
                  className="input-glass-select"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>
            </div>

            {/* Guardrail Banner */}
            {requiresApproval && (
              <div className="alert-glass-warning" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertTriangle size={18} style={{ color: '#f5b544' }} />
                  <div>
                    <strong style={{ color: '#f5b544' }}>Approval Router Triggered</strong>
                    <p style={{ fontSize: '12px', color: '#9aa8ba', marginTop: '2px' }}>{approvalReason}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Line Items Table */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#f5f7fa' }}>Quotation Line Items</span>
                <button type="button" className="btn-glass btn-glass-secondary btn-sm" onClick={() => handleAddItem()}>
                  <Plus size={14} /> Add Line Item
                </button>
              </div>

              <div className="table-glass-wrapper">
                <table className="table-glass">
                  <thead>
                    <tr>
                      <th style={{ width: '32%' }}>Product / SKU</th>
                      <th style={{ width: '12%' }} className="number-cell">List Price</th>
                      <th style={{ width: '12%' }}>Qty</th>
                      <th style={{ width: '14%' }}>Discount %</th>
                      <th style={{ width: '15%' }} className="number-cell">Line Total</th>
                      <th style={{ width: '10%' }} className="number-cell">Margin %</th>
                      <th style={{ width: '5%' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={item.id}>
                        <td>
                          <select
                            className="input-glass-select"
                            style={{ padding: '4px 8px', fontSize: '12px', width: '100%' }}
                            value={item.productId}
                            onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                          >
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.sku})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="number-cell font-mono">${item.unitPrice.toFixed(2)}</td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            className="input-glass-select"
                            style={{ padding: '4px 6px', fontSize: '12px', width: '64px' }}
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              className="input-glass-select"
                              style={{
                                padding: '4px 6px',
                                fontSize: '12px',
                                width: '70px',
                                borderColor: item.discountPct > 15 ? '#f5b544' : 'var(--border-glass-light)',
                              }}
                              value={item.discountPct}
                              onChange={(e) => handleItemChange(idx, 'discountPct', e.target.value)}
                            />
                            {item.discountPct > 15 && <span className="tag-overlimit">OVER +8pt</span>}
                          </div>
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
                        <td>
                          <button
                            type="button"
                            style={{ color: '#9aa8ba' }}
                            onClick={() => handleRemoveItem(idx)}
                            disabled={items.length <= 1}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Smart Upsell Recommendations */}
            {recommendedProducts.length > 0 && (
              <div
                style={{
                  background: 'rgba(56, 217, 255, 0.08)',
                  border: '1px solid rgba(56, 217, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: '#38d9ff' }}>
                  <Sparkles size={14} />
                  <span>Recommended for this deal</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {recommendedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      style={{
                        background: 'rgba(15, 28, 48, 0.8)',
                        border: '1px solid var(--border-glass-light)',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '12px',
                      }}
                    >
                      <div>
                        <strong style={{ color: '#f5f7fa' }}>{prod.name}</strong> (${prod.listPrice.toFixed(2)})
                      </div>
                      <button
                        type="button"
                        className="btn-glass btn-glass-secondary btn-sm"
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        onClick={() => handleAddItem(prod)}
                      >
                        <Plus size={12} /> Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Summary Box */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                background: 'rgba(7, 17, 31, 0.7)',
                border: '1px solid var(--border-glass)',
                padding: '14px 20px',
                borderRadius: '8px',
                gap: '32px',
              }}
            >
              <div style={{ textTransform: 'uppercase', fontSize: '11px', color: '#9aa8ba' }}>
                Subtotal: <strong className="font-mono" style={{ color: '#f5f7fa', fontSize: '13px' }}>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div style={{ textTransform: 'uppercase', fontSize: '11px', color: '#9aa8ba' }}>
                Discount ({avgDiscountPct.toFixed(1)}%): <strong className="font-mono" style={{ color: discountAmount > 0 ? '#f5b544' : '#f5f7fa', fontSize: '13px' }}>-${discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div style={{ textTransform: 'uppercase', fontSize: '11px', color: '#9aa8ba' }}>
                Overall Margin: <strong className="font-mono" style={{ color: totalMarginPct < 20 ? '#ff6b72' : '#31d38a', fontSize: '13px' }}>{totalMarginPct.toFixed(1)}%</strong>
              </div>
              <div style={{ textTransform: 'uppercase', fontSize: '11px', color: '#f5f7fa', fontWeight: 700 }}>
                Grand Total: <strong className="font-mono" style={{ color: '#38d9ff', fontSize: '16px' }}>${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
              </div>
            </div>
          </div>

          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn-glass btn-glass-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-glass btn-glass-primary">
              <Check size={15} />
              {requiresApproval ? 'Submit for Approval' : 'Create Approved Quote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
