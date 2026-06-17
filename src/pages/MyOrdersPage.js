import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../utils/api';

const STATUS_COLOR = {
  Pending: { bg: '#fef3c7', text: '#92400e' },
  Processing: { bg: '#dbeafe', text: '#1e40af' },
  Shipped: { bg: '#ede9fe', text: '#5b21b6' },
  Delivered: { bg: '#d1fae5', text: '#065f46' },
  Cancelled: { bg: '#fee2e2', text: '#991b1b' }
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.loading}>Loading orders...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Mere Orders</h1>
      {orders.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ fontSize: '48px' }}>📦</p>
          <h3>Koi order nahi hai abhi</h3>
          <Link to="/products" style={styles.shopBtn}>Shopping Start Karo</Link>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order._id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <p style={styles.orderId}>Order #{order._id.slice(-10).toUpperCase()}</p>
                  <p style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ ...styles.statusBadge, background: STATUS_COLOR[order.orderStatus]?.bg, color: STATUS_COLOR[order.orderStatus]?.text }}>
                    {order.orderStatus}
                  </span>
                  <p style={styles.totalAmt}>Rs. {order.totalPrice?.toLocaleString()}</p>
                </div>
              </div>

              <div style={styles.items}>
                {order.orderItems.slice(0, 3).map((item, i) => (
                  <div key={i} style={styles.itemRow}>
                    <img src={item.image || 'https://via.placeholder.com/48'} alt={item.name} style={styles.itemImg} />
                    <div>
                      <p style={styles.itemName}>{item.name}</p>
                      <p style={styles.itemMeta}>Qty: {item.quantity} × Rs. {item.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {order.orderItems.length > 3 && (
                  <p style={{ color: '#64748b', fontSize: '13px', margin: '8px 0 0' }}>+{order.orderItems.length - 3} more items</p>
                )}
              </div>

              <div style={styles.orderFooter}>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  {order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online Payment'}
                  {' · '}
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </div>
                <Link to={`/order/${order._id}`} style={styles.detailsBtn}>Details Dekhein →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '30px 20px' },
  title: { fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: '0 0 24px' },
  loading: { textAlign: 'center', padding: '80px', color: '#64748b' },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#64748b' },
  shopBtn: { background: '#3b82f6', color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: '600', display: 'inline-block', marginTop: '12px' },
  orderCard: { background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' },
  orderId: { fontWeight: '700', color: '#1e293b', margin: 0, fontSize: '15px' },
  orderDate: { color: '#64748b', fontSize: '13px', margin: '4px 0 0' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'inline-block' },
  totalAmt: { fontWeight: '700', color: '#1e293b', fontSize: '16px', margin: '6px 0 0' },
  items: { marginBottom: '16px' },
  itemRow: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' },
  itemImg: { width: '48px', height: '48px', objectFit: 'contain', background: '#f8fafc', borderRadius: '8px' },
  itemName: { margin: 0, fontWeight: '600', color: '#1e293b', fontSize: '14px' },
  itemMeta: { margin: '2px 0 0', color: '#64748b', fontSize: '12px' },
  orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #f1f5f9' },
  detailsBtn: { color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }
};

export default MyOrdersPage;
