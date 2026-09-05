import React from 'react';
import { Product } from '../../types';
import { Sparkles } from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
}

export const ProductsView: React.FC<ProductsViewProps> = ({ products }) => {
  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Product Catalog & Margin Guardrails</h1>
          <p className="page-subheading">
            Base list pricing, Cost of Goods Sold (COGS), margin floor guardrails, and cross-sell rules.
          </p>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="table-glass-wrapper">
        <table className="table-glass">
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
                  <td className="font-mono" style={{ fontWeight: 700, color: '#2f8cff' }}>
                    {p.sku}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f5f7fa' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: '#9aa8ba' }}>{p.description}</div>
                  </td>
                  <td className="number-cell font-mono" style={{ fontWeight: 700 }}>
                    ${p.listPrice.toFixed(2)}
                  </td>
                  <td className="number-cell font-mono" style={{ color: '#9aa8ba' }}>
                    ${p.cogs.toFixed(2)}
                  </td>
                  <td className="number-cell font-mono" style={{ fontWeight: 600, color: '#31d38a' }}>
                    {baseMargin.toFixed(1)}%
                  </td>
                  <td className="number-cell font-mono" style={{ color: '#f5b544', fontWeight: 600 }}>
                    {p.minMarginPct.toFixed(1)}%
                  </td>
                  <td className="number-cell font-mono">
                    {p.inStock === 999 ? 'Unlimited (Service)' : `${p.inStock} units`}
                  </td>
                  <td style={{ fontSize: '12px', color: '#9aa8ba' }}>
                    {upsellNames ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38d9ff' }}>
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
