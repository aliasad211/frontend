import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../utils/api';

const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];
const STATUS_COLOR = {
  Pending: '#f59e0b', Processing: '#3b82f6', Shipped: '#8b5cf6',
  Delivered: '#10b981', Cancelled: '#ef4444'
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then(res => setOrder(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!order) return <div style={styles.loading}>Order nahi mila</div>;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Link to="/my-orders" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}>← Mere Orders</Link>
        <span style={{ color: '#94a3b8' }}>·</span>
        <span style={{ color: '#64748b', fontSize: '14px' }}>Order #{order._id.slice(-10).toUpperCase()}</span>
      </div>

      <div style={styles.layout}>
        <div style={{ flex: 1 }}>
          {/* Status Timeline */}
          {order.orderStatus !== 'Cancelled' && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Order Status</h3>
              <div style={styles.timeline}>
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} style={styles.timelineItem}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ ...styles.dot, ...(i <= currentStep ? { background: STATUS_COLOR[order.orderStatus] } : {}) }}>
                        {i < currentStep ? '✓' : i + 1}
                      </div>
                      {i < STATUS_STEPS.length - 1 && <div style={{ ...styles.line, ...(i < currentStep ? { background: STATUS_COLOR[order.orderStatus] } : {}) }} />}
                    </div>
                    <span style={{ ...styles.stepLabel, ...(i === currentStep ? { color: STATUS_COLOR[order.orderStatus], fontWeight: '700' } : {}) }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Order Items ({order.orderItems.length})</h3>
            {order.orderItems.map((item, i) => (
              <div key={i} style={styles.itemRow}>
                <img src={item.image || 'https://via.placeholder.com/64'} alt={item.name} style={styles.itemImg} />
                <div style={{ flex: 1 }}>
                  <p style={styles.itemName}>{item.name}</p>
                  <p style={styles.itemMeta}>Quantity: {item.quantity}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={styles.itemPrice}>Rs. {item.price?.toLocaleString()}</p>
                  <p style={{ ...styles.itemMeta, margin: 0 }}>Subtotal: Rs. {(item.price * item.quantity)?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📍 Shipping Address</h3>
            <p style={styles.addressText}>{order.shippingAddress?.street}</p>
            <p style={styles.addressText}>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
            <p style={styles.addressText}>📱 {order.shippingAddress?.phone}</p>
          </div>
        </div>

        {/* Price Summary */}
        <div style={styles.sidebar}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Price Breakdown</h3>
            <div style={styles.priceRow}><span>Items Price</span><span>Rs. {order.itemsPrice?.toLocaleString()}</span></div>
            <div style={styles.priceRow}><span>Shipping</span><span>{order.shippingPrice === 0 ? <span style={{ color: '#10b981' }}>FREE</span> : `Rs. ${order.shippingPrice}`}</span></div>
            <div style={styles.priceRow}><span>Tax</span><span>Rs. {order.taxPrice?.toLocaleString()}</span></div>
            <div style={{ ...styles.priceRow, fontWeight: '700', fontSize: '17px', borderTop: '2px solid #e2e8f0', paddingTop: '12px', marginTop: '8px' }}>
              <span>Total</span>
              <span style={{ color: '#1d4ed8' }}>Rs. {order.totalPrice?.toLocaleString()}</span>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Payment Info</h3>
            <div style={styles.priceRow}>
              <span>Method</span>
              <span>{order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online'}</span>
            </div>
            <div style={styles.priceRow}>
              <span>Status</span>
              <span style={{ color: order.paymentStatus === 'Paid' ? '#10b981' : '#f59e0b', fontWeight: '600' }}>
                {order.paymentStatus}
              </span>
            </div>
            <div style={styles.priceRow}>
              <span>Order Date</span>
              <span>{new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
            {order.deliveredAt && (
              <div style={styles.priceRow}>
                <span>Delivered</span>
                <span style={{ color: '#10b981' }}>{new Date(order.deliveredAt).toLocaleDateString('en-PK')}</span>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{ ...styles.bigStatus, background: STATUS_COLOR[order.orderStatus] + '20', color: STATUS_COLOR[order.orderStatus] }}>
              {order.orderStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' },
  loading: { textAlign: 'center', padding: '80px', color: '#64748b' },
  layout: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  card: { background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px' },
  sidebar: { width: '260px', flexShrink: 0 },
  timeline: { display: 'flex', gap: '0' },
  timelineItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '8px' },
  dot: { width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px' },
  line: { width: '2px', height: '24px', background: '#e2e8f0' },
  stepLabel: { fontSize: '12px', color: '#94a3b8', textAlign: 'center' },
  itemRow: { display: 'flex', gap: '14px', alignItems: 'center', paddingBottom: '14px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9' },
  itemImg: { width: '64px', height: '64px', objectFit: 'contain', background: '#f8fafc', borderRadius: '10px' },
  itemName: { margin: 0, fontWeight: '600', color: '#1e293b', fontSize: '14px' },
  itemMeta: { margin: '4px 0 0', color: '#64748b', fontSize: '13px' },
  itemPrice: { margin: 0, fontWeight: '700', color: '#1e293b', fontSize: '15px' },
  addressText: { margin: '0 0 4px', color: '#475569', fontSize: '14px' },
  priceRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#475569' },
  bigStatus: { padding: '10px 24px', borderRadius: '20px', fontSize: '15px', fontWeight: '700', display: 'inline-block' }
};

export default OrderDetailPage;
