import React, { useState } from 'react';
import { FulfillmentRecord, FulfillmentStatus } from '../../types';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  Truck,
  Warehouse,
  CheckCircle2,
  Edit2,
  X,
  Split,
} from 'lucide-react';

interface FulfillmentViewProps {
  fulfillments: FulfillmentRecord[];
  onUpdateFulfillment: (recordId: string, status: FulfillmentStatus, carrier?: string, tracking?: string) => void;
}

export const FulfillmentView: React.FC<FulfillmentViewProps> = ({
  fulfillments,
  onUpdateFulfillment,
}) => {
  const [selectedHub, setSelectedHub] = useState<string>('all');
  const [editingRecord, setEditingRecord] = useState<FulfillmentRecord | null>(null);
  const [carrierInput, setCarrierInput] = useState('');
  const [trackingInput, setTrackingInput] = useState('');
  const [statusInput, setStatusInput] = useState<FulfillmentStatus>('dispatched');

  const filteredFulfillments = fulfillments.filter((f) => {
    if (selectedHub === 'all') return true;
    return f.warehouseHub === selectedHub;
  });

  const handleOpenDispatchModal = (record: FulfillmentRecord) => {
    setEditingRecord(record);
    setCarrierInput(record.carrier || 'FedEx Freight Direct');
    setTrackingInput(record.trackingNumber || `FX-${Math.floor(10000000 + Math.random() * 90000000)}-US`);
    setStatusInput(record.status);
  };

  const handleSaveDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    onUpdateFulfillment(editingRecord.id, statusInput, carrierInput, trackingInput);
    setEditingRecord(null);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Warehouse Fulfillment Operations</h1>
          <p className="page-subheading">
            Stock reservation, multi-hub picking, logistics carrier sync, and shipment dispatch tracking.
          </p>
        </div>

        <select
          className="input-glass-select"
          value={selectedHub}
          onChange={(e) => setSelectedHub(e.target.value)}
        >
          <option value="all">All Warehouse Hubs</option>
          <option value="Dallas (HUB-01)">Dallas Hub (HUB-01)</option>
          <option value="Chicago (HUB-02)">Chicago Hub (HUB-02)</option>
          <option value="Frankfurt (HUB-03)">Frankfurt Hub (HUB-03)</option>
        </select>
      </div>

      {/* Stock Availability Matrix */}
      <div className="glass-panel" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f5f7fa', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Warehouse size={16} style={{ color: '#38d9ff' }} /> Regional Stock & Inventory Allocation Matrix
        </h3>

        <div className="table-glass-wrapper">
          <table className="table-glass">
            <thead>
              <tr>
                <th>Warehouse Hub</th>
                <th>Core Product SKUs</th>
                <th className="number-cell">In Stock</th>
                <th className="number-cell">Reserved (Picks)</th>
                <th className="number-cell">Available Stock</th>
                <th>Suggested Order Split Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong style={{ color: '#f5f7fa' }}>Dallas Hub (HUB-01)</strong>
                </td>
                <td>Laptop Pro 14 (HW-LTP-14)</td>
                <td className="number-cell font-mono">420</td>
                <td className="number-cell font-mono" style={{ color: '#f5b544' }}>90</td>
                <td className="number-cell font-mono" style={{ color: '#31d38a', fontWeight: 700 }}>330 units</td>
                <td>
                  <button className="btn-glass btn-glass-secondary btn-sm">
                    <Split size={12} /> Accept Suggested Split
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <strong style={{ color: '#f5f7fa' }}>Chicago Hub (HUB-02)</strong>
                </td>
                <td>Docking Station (HW-DCK-STN)</td>
                <td className="number-cell font-mono">185</td>
                <td className="number-cell font-mono" style={{ color: '#f5b544' }}>30</td>
                <td className="number-cell font-mono" style={{ color: '#31d38a', fontWeight: 700 }}>155 units</td>
                <td>
                  <button className="btn-glass btn-glass-secondary btn-sm">
                    Manual Override
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Fulfillment Orders Table */}
      {filteredFulfillments.length === 0 ? (
        <EmptyState
          title="No fulfillment orders found"
          description="There are currently no orders assigned to the selected warehouse hub."
        />
      ) : (
        <div className="table-glass-wrapper">
          <table className="table-glass">
            <thead>
              <tr>
                <th>Quote Code</th>
                <th>Customer Account</th>
                <th>Assigned Warehouse</th>
                <th className="number-cell">Items Qty</th>
                <th>Carrier / Logistics</th>
                <th>Tracking Number</th>
                <th>Dispatch Date</th>
                <th>Status</th>
                <th className="number-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFulfillments.map((f) => (
                <tr key={f.id}>
                  <td className="font-mono" style={{ fontWeight: 700, color: '#2f8cff' }}>
                    {f.quotationCode}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f5f7fa' }}>{f.customerName}</div>
                    <div style={{ fontSize: '11px', color: '#9aa8ba' }}>{f.notes || 'Standard Delivery'}</div>
                  </td>
                  <td>
                    <span className="badge-glass badge-glass-neutral">{f.warehouseHub}</span>
                  </td>
                  <td className="number-cell font-mono">{f.itemsCount} units</td>
                  <td>{f.carrier || 'Unassigned'}</td>
                  <td className="font-mono" style={{ fontSize: '12px', color: f.trackingNumber ? '#38d9ff' : '#64748b' }}>
                    {f.trackingNumber || 'Pending Pick'}
                  </td>
                  <td style={{ fontSize: '12px', color: '#9aa8ba' }}>{f.dispatchDate || 'Pending'}</td>
                  <td>
                    <Badge status={f.status} />
                  </td>
                  <td className="number-cell">
                    <button
                      className="btn-glass btn-glass-secondary btn-sm"
                      onClick={() => handleOpenDispatchModal(f)}
                    >
                      <Edit2 size={13} /> Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dispatch Modal */}
      {editingRecord && (
        <div className="search-modal-backdrop">
          <div className="search-modal-box" style={{ width: '520px' }}>
            <div className="search-modal-input-wrap">
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>
                Update Fulfillment Dispatch ({editingRecord.quotationCode})
              </h3>
              <button onClick={() => setEditingRecord(null)} style={{ color: '#9aa8ba' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDispatch}>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#9aa8ba' }}>Order Fulfillment Stage *</label>
                  <select
                    className="input-glass-select"
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as FulfillmentStatus)}
                  >
                    <option value="pending_pick">Pending Warehouse Pick</option>
                    <option value="packing">Packing & Palletizing</option>
                    <option value="dispatched">Dispatched / Shipped</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered & Signed</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#9aa8ba' }}>Freight Carrier</label>
                  <input
                    type="text"
                    className="input-glass-select"
                    value={carrierInput}
                    onChange={(e) => setCarrierInput(e.target.value)}
                    placeholder="e.g. FedEx Freight Direct, UPS Enterprise"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#9aa8ba' }}>Tracking Number</label>
                  <input
                    type="text"
                    className="input-glass-select font-mono"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="e.g. FX-88492019-US"
                  />
                </div>
              </div>

              <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-glass btn-glass-secondary" onClick={() => setEditingRecord(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-glass btn-glass-primary">
                  Save Dispatch Info
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
