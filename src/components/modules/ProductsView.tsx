import React from 'react';
import { Product } from '../../types';
import { Package, ShieldAlert, Sparkles } from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
}

export const ProductsView: React.FC<ProductsViewProps> = ({ products }) => {
  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Product Catalog & Margin Rules</h1>
          <p className="page-subtitle">
            Base list pricing, Cost of Goods Sold (COGS), margin floor guardrails, and cross-sell rules.
          </p>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU Code</th>
              <th>Product Name & Category</th>
              <th className="number-cell">List Price</th>
              <th className="number-cell">COGS (Cost)</th>
              <th className="number-cell">Base Margin %</th>
              <th className="number-cell">Min Margin Floor</th>
              <th className="number-cell">Available Stock</th>
              <th>Upsell / Cross-Sell Rules</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const baseMargin = ((p.listPrice - p.cogs) / p.listPrice) * 100;
              const upsellNames = p.upsellIds
                .map((id) => products.find((pr) => pr.id === id)?.name)
                .filter(Boolean)
                .join(', ');

              return (
                <tr key={p.id}>
                  <td className="font-mono" style={{ fontWeight: 700, color: '#2563eb' }}>
                    {p.sku}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{p.description}</div>
                  </td>
                  <td className="number-cell font-mono" style={{ fontWeight: 700 }}>
                    ${p.listPrice.toFixed(2)}
                  </td>
                  <td className="number-cell font-mono" style={{ color: '#64748b' }}>
                    ${p.cogs.toFixed(2)}
                  </td>
                  <td className="number-cell font-mono" style={{ fontWeight: 600, color: '#166534' }}>
                    {baseMargin.toFixed(1)}%
                  </td>
                  <td className="number-cell font-mono" style={{ color: '#92400e', fontWeight: 600 }}>
                    {p.minMarginPct.toFixed(1)}%
                  </td>
                  <td className="number-cell font-mono">
                    {p.inStock === 999 ? 'Unlimited (Service)' : `${p.inStock} units`}
                  </td>
                  <td style={{ fontSize: '12px', color: '#475569' }}>
                    {upsellNames ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1e40af' }}>
                        <Sparkles size={12} /> {upsellNames}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
