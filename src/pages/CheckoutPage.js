import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../utils/api';
import { useCart } from '../context/AppContext';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=Address, 2=Review

  const [address, setAddress] = useState({
    street: '', city: '', state: '', zipCode: '', phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const shipping = cartTotal > 5000 ? 0 : 200;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + shipping + tax;

  const handleAddressChange = (e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          image: item.images?.[0]?.url || '',
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: address,
        paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total
      };
      const { data } = await createOrder(orderData);
      clearCart();
      toast.success('Order place ho gaya! 🎉');
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order place nahi hua');
    } finally { setLoading(false); }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>

      {/* Progress Steps */}
      <div style={styles.steps}>
        {['Shipping Address', 'Review & Place Order'].map((label, i) => (
          <React.Fragment key={i}>
            <div style={styles.step}>
              <div style={{ ...styles.stepCircle, ...(step > i ? styles.doneCircle : step === i + 1 ? styles.activeCircle : {}) }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ ...styles.stepLabel, ...(step === i + 1 ? { color: '#3b82f6', fontWeight: '600' } : {}) }}>{label}</span>
            </div>
            {i < 1 && <div style={{ ...styles.stepLine, ...(step > 1 ? { background: '#3b82f6' } : {}) }} />}
          </React.Fragment>
        ))}
      </div>

      <div style={styles.layout}>
        {/* Left: Form or Review */}
        <div style={{ flex: 1 }}>
          {step === 1 ? (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>📍 Shipping Address</h2>
              <form onSubmit={handleAddressSubmit}>
                <div style={styles.field}>
                  <label style={styles.label}>Street Address *</label>
                  <input style={styles.input} name="street" value={address.street} onChange={handleAddressChange} required placeholder="House/Flat no, Street, Area" />
                </div>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>City *</label>
                    <input style={styles.input} name="city" value={address.city} onChange={handleAddressChange} required placeholder="Islamabad" />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Province *</label>
                    <select style={styles.input} name="state" value={address.state} onChange={handleAddressChange} required>
                      <option value="">Select Province</option>
                      {['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad', 'AJK', 'GB'].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>Zip Code</label>
                    <input style={styles.input} name="zipCode" value={address.zipCode} onChange={handleAddressChange} placeholder="44000" />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Phone Number *</label>
                    <input style={styles.input} name="phone" value={address.phone} onChange={handleAddressChange} required placeholder="03001234567" type="tel" />
                  </div>
                </div>

                <h3 style={{ ...styles.cardTitle, marginTop: '24px' }}>💳 Payment Method</h3>
                <div style={styles.paymentOptions}>
                  {[
                    { value: 'COD', label: '💵 Cash on Delivery', desc: 'Delivery pe cash dein' },
                    { value: 'Online', label: '💳 Online Payment', desc: 'Card/EasyPaisa/JazzCash' }
                  ].map(opt => (
                    <div key={opt.value} onClick={() => setPaymentMethod(opt.value)} style={{ ...styles.payOption, ...(paymentMethod === opt.value ? styles.activePayOption : {}) }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <input type="radio" checked={paymentMethod === opt.value} readOnly style={{ marginTop: '2px' }} />
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>{opt.label}</div>
                          <div style={{ color: '#64748b', fontSize: '12px' }}>{opt.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button type="submit" style={styles.nextBtn}>Continue to Review →</button>
              </form>
            </div>
          ) : (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>📦 Order Review</h2>

              {/* Address Summary */}
              <div style={styles.reviewSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={styles.reviewLabel}>Delivery Address</h4>
                  <button onClick={() => setStep(1)} style={styles.editBtn}>Edit</button>
                </div>
                <p style={styles.reviewText}>{address.street}, {address.city}, {address.state} {address.zipCode}</p>
                <p style={styles.reviewText}>📱 {address.phone}</p>
              </div>

              {/* Payment */}
              <div style={styles.reviewSection}>
                <h4 style={styles.reviewLabel}>Payment Method</h4>
                <p style={styles.reviewText}>{paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online Payment'}</p>
              </div>

              {/* Items */}
              <div style={styles.reviewSection}>
                <h4 style={styles.reviewLabel}>Items ({cartItems.length})</h4>
                {cartItems.map(item => (
                  <div key={item._id} style={styles.reviewItem}>
                    <img src={item.images?.[0]?.url || 'https://via.placeholder.com/50'} alt={item.name} style={styles.reviewItemImg} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{item.name}</p>
                      <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '13px' }}>Qty: {item.quantity} × Rs. {item.price.toLocaleString()}</p>
                    </div>
                    <span style={{ fontWeight: '700', color: '#1e293b' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <button onClick={handlePlaceOrder} disabled={loading} style={styles.orderBtn}>
                {loading ? 'Order Place Ho Raha Hai...' : '🎉 Order Place Karo'}
              </button>
            </div>
          )}
        </div>

        {/* Right: Price Summary */}
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Price Summary</h3>
          <div style={styles.summaryRow}><span>Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span><span>Rs. {cartTotal.toLocaleString()}</span></div>
          <div style={styles.summaryRow}><span>Delivery</span><span style={{ color: shipping === 0 ? '#10b981' : '#1e293b' }}>{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span></div>
          <div style={styles.summaryRow}><span>Tax (5%)</span><span>Rs. {tax}</span></div>
          <div style={{ ...styles.summaryRow, fontWeight: '700', fontSize: '18px', borderTop: '2px solid #e2e8f0', paddingTop: '12px', marginTop: '12px' }}>
            <span>Total Amount</span>
            <span style={{ color: '#1d4ed8' }}>Rs. {total.toLocaleString()}</span>
          </div>
          {shipping === 0 && <p style={{ color: '#10b981', fontSize: '12px', textAlign: 'center', marginTop: '8px' }}>🎉 Aapko free delivery mil rahi hai!</p>}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 24px' },
  steps: { display: 'flex', alignItems: 'center', marginBottom: '32px' },
  step: { display: 'flex', alignItems: 'center', gap: '8px' },
  stepCircle: { width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', flexShrink: 0 },
  activeCircle: { background: '#3b82f6', color: '#fff' },
  doneCircle: { background: '#10b981', color: '#fff' },
  stepLabel: { fontSize: '14px', color: '#94a3b8', whiteSpace: 'nowrap' },
  stepLine: { flex: 1, height: '2px', background: '#e2e8f0', margin: '0 12px' },
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  card: { background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 20px' },
  field: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  paymentOptions: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' },
  payOption: { padding: '14px', border: '2px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer' },
  activePayOption: { border: '2px solid #3b82f6', background: '#eff6ff' },
  nextBtn: { width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' },
  orderBtn: { width: '100%', background: '#10b981', color: '#fff', border: 'none', padding: '16px', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' },
  reviewSection: { background: '#f8fafc', borderRadius: '10px', padding: '16px', marginBottom: '14px' },
  reviewLabel: { fontSize: '13px', fontWeight: '700', color: '#64748b', margin: '0 0 6px', textTransform: 'uppercase' },
  reviewText: { color: '#1e293b', fontSize: '14px', margin: '0 0 4px' },
  editBtn: { background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  reviewItem: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' },
  reviewItemImg: { width: '48px', height: '48px', objectFit: 'contain', background: '#fff', borderRadius: '8px' },
  summary: { width: '280px', background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flexShrink: 0, position: 'sticky', top: '80px' },
  summaryTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#475569' }
};

export default CheckoutPage;
