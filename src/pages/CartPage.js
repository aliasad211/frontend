import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, useAuth } from '../context/AppContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) { toast.error('Pehle login karein!'); navigate('/login'); return; }
    navigate('/checkout');
  };

  if (cartItems.length === 0) return (
    <div style={styles.empty}>
      <h2>🛒 Cart khali hai!</h2>
      <Link to="/products" style={styles.shopBtn}>Shopping Start Karo →</Link>
    </div>
  );

  const shipping = cartTotal > 5000 ? 0 : 200;
  const tax = Math.round(cartTotal * 0.05);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shopping Cart ({cartItems.length} items)</h1>
      <div style={styles.layout}>
        {/* Items */}
        <div style={{ flex: 1 }}>
          {cartItems.map(item => (
            <div key={item._id} style={styles.item}>
              <img src={item.images?.[0]?.url || 'https://via.placeholder.com/80'} alt={item.name} style={styles.img} />
              <div style={{ flex: 1 }}>
                <Link to={`/product/${item._id}`} style={styles.itemName}>{item.name}</Link>
                <p style={styles.brand}>{item.brand}</p>
                <p style={styles.price}>Rs. {item.price.toLocaleString()}</p>
              </div>
              <div style={styles.qtyControls}>
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={styles.qtyBtn}>−</button>
                <span style={styles.qty}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={styles.qtyBtn} disabled={item.quantity >= item.stock}>+</button>
              </div>
              <div style={{ textAlign: 'right', minWidth: '100px' }}>
                <p style={styles.subTotal}>Rs. {(item.price * item.quantity).toLocaleString()}</p>
                <button onClick={() => removeFromCart(item._id)} style={styles.removeBtn}>🗑️ Remove</button>
              </div>
            </div>
          ))}
          <button onClick={() => { clearCart(); toast.success('Cart clear ho gaya!'); }} style={styles.clearBtn}>Cart Clear Karo</button>
        </div>

        {/* Summary */}
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          <div style={styles.row}><span>Items Total:</span><span>Rs. {cartTotal.toLocaleString()}</span></div>
          <div style={styles.row}><span>Shipping:</span><span>{shipping === 0 ? <span style={{ color: '#10b981' }}>FREE</span> : `Rs. ${shipping}`}</span></div>
          <div style={styles.row}><span>Tax (5%):</span><span>Rs. {tax}</span></div>
          <div style={{ ...styles.row, fontWeight: '700', fontSize: '18px', borderTop: '2px solid #e2e8f0', paddingTop: '12px', marginTop: '12px' }}>
            <span>Total:</span><span style={{ color: '#1d4ed8' }}>Rs. {(cartTotal + shipping + tax).toLocaleString()}</span>
          </div>
          {cartTotal < 5000 && <p style={styles.freeShip}>Rs. {(5000 - cartTotal).toLocaleString()} aur kharido — Free shipping milega!</p>}
          <button onClick={handleCheckout} style={styles.checkoutBtn}>Checkout →</button>
          <Link to="/products" style={styles.continueBtn}>← Shopping Continue Karo</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' },
  title: { fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: '0 0 24px' },
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  item: { background: '#fff', borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', alignItems: 'center' },
  img: { width: '80px', height: '80px', objectFit: 'contain', background: '#f8fafc', borderRadius: '8px' },
  itemName: { color: '#1e293b', textDecoration: 'none', fontWeight: '600', fontSize: '15px' },
  brand: { color: '#94a3b8', fontSize: '12px', margin: '2px 0' },
  price: { color: '#3b82f6', fontWeight: '700', margin: '4px 0' },
  qtyControls: { display: 'flex', alignItems: 'center', gap: '8px' },
  qtyBtn: { width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#f8fafc', cursor: 'pointer', fontSize: '16px', fontWeight: '700' },
  qty: { minWidth: '30px', textAlign: 'center', fontWeight: '600' },
  subTotal: { fontWeight: '700', color: '#1e293b', margin: '0 0 6px' },
  removeBtn: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' },
  clearBtn: { background: 'none', border: '1px solid #e2e8f0', color: '#94a3b8', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', marginTop: '8px' },
  summary: { width: '300px', background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flexShrink: 0 },
  summaryTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px' },
  row: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#475569' },
  freeShip: { color: '#f59e0b', fontSize: '12px', margin: '8px 0', textAlign: 'center' },
  checkoutBtn: { width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' },
  continueBtn: { display: 'block', textAlign: 'center', color: '#64748b', textDecoration: 'none', fontSize: '13px', marginTop: '12px' },
  empty: { textAlign: 'center', padding: '80px 20px' },
  shopBtn: { background: '#3b82f6', color: '#fff', textDecoration: 'none', padding: '14px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', display: 'inline-block', marginTop: '16px' }
};

export default CartPage;
