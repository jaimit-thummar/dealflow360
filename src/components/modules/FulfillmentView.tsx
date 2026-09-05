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
  Box,
  Layers,
  ArrowRight,
  DollarSign,
  AlertCircle,
  Info,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

interface InventoryItem {
  id: string;
  warehouse: string;
  product: string;
  inStock: number;
  reserved: number;
  available: number;
}

interface PendingFulfillmentOrder {
  id: string;
  quoteCode: string;
  customerName: string;
  fulfillmentType: 'Split Pending' | 'Backorder' | 'Single Dispatch';
  assignedHubs: string;
  recommendedSplit: {
    warehouse: string;
    units: number;
    shipments: number;
    cost: number;
  }[];
  totalUnits: number;
  estimatedShipmentCount: number;
  estimatedShippingCost: number;
  operationalNote: string;
}

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

  // Exact sample stock data from prompt
  const inventoryList: InventoryItem[] = [
    {
      id: 'inv-1',
      warehouse: 'Main Warehouse',
      product: 'Laptop Pro 14',
      inStock: 40,
      reserved: 18,
      available: 22,
    },
    {
      id: 'inv-2',
      warehouse: 'East Depot',
      product: 'Laptop Pro 14',
      inStock: 10,
      reserved: 6,
      available: 4,
    },
    {
      id: 'inv-3',
      warehouse: 'Main Warehouse',
      product: 'Docking Station',
      inStock: 65,
      reserved: 12,
      available: 53,
    },
    {
      id: 'inv-4',
      warehouse: 'East Depot',
      product: 'Docking Station',
      inStock: 25,
      reserved: 8,
      available: 17,
    },
  ];

  // Sample pending orders from prompt
  const pendingOrders: PendingFulfillmentOrder[] = [
    {
      id: 'p-1',
      quoteCode: 'Q-1042',
      customerName: 'Acme Corp',
      fulfillmentType: 'Split Pending',
      assignedHubs: 'Main + East Depot',
      totalUnits: 24,
      estimatedShipmentCount: 2,
      estimatedShippingCost: 71,
      recommendedSplit: [
        { warehouse: 'Main Warehouse', units: 18, shipments: 1, cost: 42 },
        { warehouse: 'East Depot', units: 6, shipments: 1, cost: 29 },
      ],
      operationalNote: 'Consolidate remaining backorder when East Depot restocks.',
    },
    {
      id: 'p-2',
      quoteCode: 'Q-1030',
      customerName: 'Zenith Co',
      fulfillmentType: 'Backorder',
      assignedHubs: 'East Depot',
      totalUnits: 15,
      estimatedShipmentCount: 1,
      estimatedShippingCost: 38,
      recommendedSplit: [
        { warehouse: 'East Depot', units: 10, shipments: 1, cost: 38 },
      ],
      operationalNote: 'East Depot inventory low (4 units remaining). Restock shipment ETA: Oct 12.',
    },
    {
      id: 'p-3',
      quoteCode: 'Q-1028',
      customerName: 'Beta Industries',
      fulfillmentType: 'Single Dispatch',
      assignedHubs: 'Main Warehouse',
      totalUnits: 32,
      estimatedShipmentCount: 1,
      estimatedShippingCost: 55,
      recommendedSplit: [
        { warehouse: 'Main Warehouse', units: 32, shipments: 1, cost: 55 },
      ],
      operationalNote: 'Full order allocated from Main Warehouse. Ready for freight pickup.',
    },
  ];

  const [selectedPendingOrder, setSelectedPendingOrder] = useState<PendingFulfillmentOrder>(pendingOrders[0]);
  const [splitActionState, setSplitActionState] = useState<'idle' | 'accepted' | 'overridden'>('idle');

  const filteredFulfillments = fulfillments.filter((f) => {
    if (selectedHub === 'all') return true;
    if (selectedHub === 'Main Warehouse' && f.warehouseHub.includes('Dallas')) return true;
    if (selectedHub === 'East Depot' && f.warehouseHub.includes('Chicago')) return true;
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
    <div style={{ paddingBottom: '32px' }}>
      {/* Page Header */}
      <div className="page-header-row" style={{ marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#38d9ff', fontWeight: 700, letterSpacing: '0.05em' }}>
              Logistics & Fulfillment
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <span style={{ fontSize: '12px', color: '#9aa8ba' }}>Multi-Hub Inventory Split Engine</span>
          </div>
          <h1 className="page-title" style={{ fontSize: '22px', fontWeight: 800, color: '#f5f7fa', margin: 0 }}>
            Fulfillment Operations
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            className="input-glass-select"
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">All Warehouses</option>
            <option value="Main Warehouse">Main Warehouse</option>
            <option value="East Depot">East Depot</option>
          </select>
        </div>
      </div>

      {/* FULFILLMENT LIST: Warehouse Inventory Stock Matrix */}
      <div className="glass-panel" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Warehouse size={16} style={{ color: '#38d9ff' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>
              Warehouse Stock Availability
            </h3>
          </div>
          <span style={{ fontSize: '11px', color: '#9aa8ba' }}>
            Real-time multi-hub allocation
          </span>
        </div>

        <div className="table-glass-wrapper">
          <table className="table-glass">
            <thead>
              <tr>
                <th>Warehouse</th>
                <th>Product</th>
                <th className="number-cell">In Stock</th>
                <th className="number-cell">Reserved</th>
                <th className="number-cell">Available</th>
              </tr>
            </thead>
            <tbody>
              {inventoryList.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <strong style={{ color: '#f5f7fa', fontWeight: 600 }}>{inv.warehouse}</strong>
                  </td>
                  <td>
                    <span style={{ color: '#cbd5e1' }}>{inv.product}</span>
                  </td>
                  <td className="number-cell font-mono" style={{ color: '#f5f7fa', fontWeight: 600 }}>
                    {inv.inStock}
                  </td>
                  <td className="number-cell font-mono" style={{ color: '#f5b544' }}>
                    {inv.reserved}
                  </td>
                  <td className="number-cell font-mono" style={{ color: '#31d38a', fontWeight: 700 }}>
                    {inv.available}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Layout: Orders Awaiting Fulfillment (Left) + Fulfillment Detail Inspector (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '20px', marginBottom: '24px' }}>
        
        {/* Left Panel: Orders Awaiting Fulfillment */}
        <div className="glass-panel" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box size={16} style={{ color: '#f5b544' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>
                Orders Awaiting Fulfillment
              </h3>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#f5b544',
                background: 'rgba(245, 181, 68, 0.15)',
                padding: '2px 8px',
                borderRadius: '10px',
              }}
            >
              {pendingOrders.length} Pending
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pendingOrders.map((order) => {
              const isSelected = selectedPendingOrder.id === order.id;

              return (
                <div
                  key={order.id}
                  className="clickable"
                  onClick={() => {
                    setSelectedPendingOrder(order);
                    setSplitActionState('idle');
                  }}
                  style={{
                    padding: '14px',
                    background: isSelected ? 'rgba(47, 140, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    border: `1px solid ${isSelected ? '#2f8cff' : 'rgba(255, 255, 255, 0.06)'}`,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="font-mono" style={{ fontSize: '14px', fontWeight: 800, color: '#2f8cff' }}>
                      {order.quoteCode}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '4px',
                        background: order.fulfillmentType === 'Split Pending' ? 'rgba(245, 181, 68, 0.15)' : order.fulfillmentType === 'Backorder' ? 'rgba(255, 107, 114, 0.15)' : 'rgba(49, 211, 138, 0.15)',
                        color: order.fulfillmentType === 'Split Pending' ? '#f5b544' : order.fulfillmentType === 'Backorder' ? '#ff6b72' : '#31d38a',
                      }}
                    >
                      {order.fulfillmentType}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '13px', color: '#f5f7fa' }}>{order.customerName}</strong>
                    <span style={{ fontSize: '12px', color: '#9aa8ba' }}>{order.assignedHubs}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: FULFILLMENT DETAIL Inspector */}
        <div className="glass-panel" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Inspector Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#38d9ff' }}>
                    {selectedPendingOrder.quoteCode}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                  <strong style={{ fontSize: '15px', color: '#f5f7fa' }}>{selectedPendingOrder.customerName}</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#9aa8ba', marginTop: '2px' }}>
                  Fulfillment Recommendation & Split Engine Analysis
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(56, 217, 255, 0.1)',
                  color: '#38d9ff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Split size={13} /> Recommended Split
              </div>
            </div>

            {/* Recommended Warehouses Breakdown Cards */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#9aa8ba', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Warehouse Split Allocations
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedPendingOrder.recommendedSplit.map((split, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(7, 17, 31, 0.6)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '14px', color: '#f5f7fa', display: 'block', marginBottom: '2px' }}>
                        {split.warehouse}
                      </strong>
                      <div style={{ fontSize: '12px', color: '#9aa8ba', display: 'flex', gap: '12px' }}>
                        <span>
                          Allocation: <strong style={{ color: '#38d9ff' }}>{split.units} units</strong>
                        </span>
                        <span>•</span>
                        <span>{split.shipments} shipment</span>
                      </div>
                    </div>

                    <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#31d38a' }}>
                      ${split.cost}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics Display: Estimated Shipment Count & Estimated Shipping Cost */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '20px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#9aa8ba', display: 'block', marginBottom: '2px' }}>
                  Estimated shipment count
                </span>
                <strong style={{ fontSize: '16px', color: '#f5f7fa', fontWeight: 700 }}>
                  {selectedPendingOrder.estimatedShipmentCount} {selectedPendingOrder.estimatedShipmentCount === 1 ? 'shipment' : 'shipments'}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#9aa8ba', display: 'block', marginBottom: '2px' }}>
                  Estimated shipping cost
                </span>
                <strong className="font-mono" style={{ fontSize: '16px', color: '#31d38a', fontWeight: 700 }}>
                  ${selectedPendingOrder.estimatedShippingCost}
                </strong>
              </div>
            </div>

            {/* Subtle Operational Note */}
            <div
              style={{
                padding: '10px 12px',
                background: 'rgba(56, 217, 255, 0.06)',
                borderRadius: '6px',
                borderLeft: '3px solid #38d9ff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              <Info size={15} style={{ color: '#38d9ff', flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic' }}>
                "{selectedPendingOrder.operationalNote}"
              </span>
            </div>
          </div>

          {/* Action Buttons: Accept Suggested Split & Manual Override */}
          <div>
            {splitActionState === 'accepted' ? (
              <div
                style={{
                  padding: '10px',
                  background: 'rgba(49, 211, 138, 0.15)',
                  color: '#31d38a',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle2 size={16} /> Suggested split accepted and picking tickets generated!
              </div>
            ) : splitActionState === 'overridden' ? (
              <div
                style={{
                  padding: '10px',
                  background: 'rgba(245, 181, 68, 0.15)',
                  color: '#f5b544',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <SlidersHorizontal size={16} /> Manual override active. Custom warehouse routing mode enabled.
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn-glass btn-glass-primary"
                  onClick={() => setSplitActionState('accepted')}
                  style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
                >
                  <Split size={15} /> Accept Suggested Split
                </button>

                <button
                  className="btn-glass btn-glass-secondary"
                  onClick={() => setSplitActionState('overridden')}
                  style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <SlidersHorizontal size={15} /> Manual Override
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Freight & Dispatch Ledger Table */}
      <div className="glass-panel" style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f5f7fa', margin: 0 }}>
              Active Warehouse Dispatch Ledger
            </h3>
            <span style={{ fontSize: '12px', color: '#9aa8ba' }}>
              Real-time carrier tracking & delivery status
            </span>
          </div>

          <span style={{ fontSize: '12px', color: '#9aa8ba' }}>
            Showing {filteredFulfillments.length} Records
          </span>
        </div>

        {filteredFulfillments.length === 0 ? (
          <EmptyState
            title="No fulfillment orders found"
            description="There are currently no active orders assigned to the selected warehouse filter."
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
                  <th>Carrier / Freight</th>
                  <th>Tracking Number</th>
                  <th>Dispatch Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
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
                      <div style={{ fontSize: '11px', color: '#9aa8ba' }}>{f.notes || 'Standard Freight'}</div>
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
                    <td style={{ textAlign: 'right' }}>
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
      </div>

      {/* Freight Dispatch Modal */}
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

