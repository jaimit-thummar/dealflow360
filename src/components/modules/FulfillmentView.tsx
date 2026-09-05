import React, { useState } from 'react';
import { FulfillmentRecord, FulfillmentStatus, WarehouseHub } from '../../types';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  Truck,
  Package,
  Warehouse,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Edit2,
  X,
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
      {/* Top Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Warehouse Fulfillment Operations</h1>
          <p className="page-subtitle">
            Stock reservation, multi-hub picking, logistics carrier sync, and shipment dispatch tracking.
          </p>
        </div>

        <div className="header-actions">
          <select
            className="select-control"
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
          >
            <option value="all">All Warehouse Hubs</option>
            <option value="Dallas (HUB-01)">Dallas Hub (HUB-01)</option>
            <option value="Chicago (HUB-02)">Chicago Hub (HUB-02)</option>
            <option value="Frankfurt (HUB-03)">Frankfurt Hub (HUB-03)</option>
          </select>
        </div>
      </div>

      {/* Warehouse Hub Status Cards */}
      <div className="kpi-grid" style={{ marginBottom: '24px' }}>
        <div className="kpi-card">
          <div className="kpi-title">
            <span>Dallas Hub (HUB-01)</span>
            <Warehouse size={16} style={{ color: '#2563eb' }} />
          </div>
          <div className="kpi-value" style={{ fontSize: '18px', marginTop: '4px' }}>
            Primary Logistics Hub
          </div>
          <div className="kpi-subtext positive">
            <span>420 Workstations in Stock</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">
            <span>Chicago Hub (HUB-02)</span>
            <Warehouse size={16} style={{ color: '#166534' }} />
          </div>
          <div className="kpi-value" style={{ fontSize: '18px', marginTop: '4px' }}>
            Midwest Distribution
          </div>
          <div className="kpi-subtext positive">
            <span>Active Picking Line</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">
            <span>Frankfurt Hub (HUB-03)</span>
            <Warehouse size={16} style={{ color: '#64748b' }} />
          </div>
          <div className="kpi-value" style={{ fontSize: '18px', marginTop: '4px' }}>
            EU Enterprise Gateway
          </div>
          <div className="kpi-subtext">
            <span>Standby Capacity</span>
          </div>
        </div>
      </div>

      {/* Fulfillment Orders Table */}
      {filteredFulfillments.length === 0 ? (
        <EmptyState
          title="No fulfillment orders found"
          description="There are currently no orders assigned to the selected warehouse hub."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
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
                  <td className="font-mono" style={{ fontWeight: 700, color: '#2563eb' }}>
                    {f.quotationCode}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{f.customerName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{f.notes || 'Standard Delivery'}</div>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{f.warehouseHub}</span>
                  </td>
                  <td className="number-cell font-mono">{f.itemsCount} units</td>
                  <td>{f.carrier || 'Unassigned'}</td>
                  <td className="font-mono" style={{ fontSize: '12px', color: f.trackingNumber ? '#0f172a' : '#94a3b8' }}>
                    {f.trackingNumber || 'Pending Pick'}
                  </td>
                  <td style={{ fontSize: '12px', color: '#64748b' }}>{f.dispatchDate || 'Pending'}</td>
                  <td>
                    <Badge status={f.status} />
                  </td>
                  <td className="number-cell">
                    <button
                      className="btn btn-secondary btn-sm"
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

      {/* Dispatch Update Modal */}
      {editingRecord && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: '520px' }}>
            <div className="modal-header">
              <h3 className="card-title" style={{ margin: 0 }}>
                Update Fulfillment Dispatch ({editingRecord.quotationCode})
              </h3>
              <button className="btn btn-ghost" onClick={() => setEditingRecord(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDispatch}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Order Fulfillment Stage *</label>
                  <select
                    className="form-select"
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

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Freight Carrier</label>
                  <input
                    type="text"
                    className="form-input"
                    value={carrierInput}
                    onChange={(e) => setCarrierInput(e.target.value)}
                    placeholder="e.g. FedEx Freight Direct, UPS Enterprise"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tracking Number</label>
                  <input
                    type="text"
                    className="form-input font-mono"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="e.g. FX-88492019-US"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingRecord(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
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
