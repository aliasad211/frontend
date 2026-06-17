import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById } from '../utils/api';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrderById(id).then(res => setOrder(res.data)).catch(console.error);
  }, [id]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>🎉</div>
        <h1 style={styles.title}>Order Place Ho Gaya!</h1>
        <p style={styles.subtitle}>Shukriya! Aapka order successfully place ho gaya hai.</p>

        {order && (
          <div style={styles.orderInfo}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Order ID:</span>
              <span style={styles.infoVal}>#{order._id.slice(-10).toUpperCase()}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Total Amount:</span>
              <span style={{ ...styles.infoVal, color: '#10b981', fontWeight: '700' }}>Rs. {order.totalPrice?.toLocaleString()}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Payment:</span>
              <span style={styles.infoVal}>{order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online'}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Status:</span>
              <span style={{ ...styles.infoVal, color: '#f59e0b', fontWeight: '600' }}>{order.orderStatus}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Delivery:</span>
              <span style={styles.infoVal}>{order.shippingAddress?.city}, {order.shippingAddress?.state}</span>
            </div>
          </div>
        )}

        <div style={styles.timeline}>
          {['Order Placed ✅', 'Processing ⚙️', 'Shipped 🚚', 'Delivered 📦'].map((step, i) => (
            <div key={i} style={styles.timelineStep}>
              <div style={{ ...styles.dot, ...(i === 0 ? styles.activeDot : {}) }} />
              <span style={{ fontSize: '13px', color: i === 0 ? '#10b981' : '#94a3b8' }}>{step}</span>
            </div>
          ))}
        </div>

        <div style={styles.actions}>
          <Link to={`/order/${id}`} style={styles.primaryBtn}>Order Details Dekhein</Link>
          <Link to="/products" style={styles.secondaryBtn}>Shopping Continue Karo</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#f1f5f9' },
  card: { background: '#fff', borderRadius: '20px', padding: '48px 40px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' },
  icon: { fontSize: '64px', marginBottom: '16px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px' },
  subtitle: { color: '#64748b', fontSize: '15px', margin: '0 0 24px' },
  orderInfo: { background: '#f8fafc', borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'left' },
  infoRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' },
  infoLabel: { color: '#64748b' },
  infoVal: { color: '#1e293b' },
  timeline: { display: 'flex', justifyContent: 'space-between', background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '24px' },
  timelineStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  dot: { width: '12px', height: '12px', borderRadius: '50%', background: '#e2e8f0' },
  activeDot: { background: '#10b981' },
  actions: { display: 'flex', flexDirection: 'column', gap: '10px' },
  primaryBtn: { background: '#3b82f6', color: '#fff', textDecoration: 'none', padding: '13px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', display: 'block' },
  secondaryBtn: { background: '#f1f5f9', color: '#475569', textDecoration: 'none', padding: '13px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', display: 'block' }
};

export default OrderSuccessPage;
