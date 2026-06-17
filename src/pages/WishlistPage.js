import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, toggleWishlist } from '../utils/api';
import { useCart } from '../context/AppContext';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    getWishlist()
      .then(res => setWishlist(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (productId) => {
    try {
      await toggleWishlist(productId);
      setWishlist(prev => prev.filter(p => p._id !== productId));
      toast.success('Wishlist se remove ho gaya!');
    } catch { toast.error('Remove nahi hua'); }
  };

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    handleRemove(product._id);
    toast.success('Cart mein add ho gaya!');
  };

  if (loading) return <div style={styles.loading}>Loading wishlist...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>❤️ Meri Wishlist ({wishlist.length})</h1>
      {wishlist.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ fontSize: '48px' }}>🤍</p>
          <h3 style={{ color: '#64748b' }}>Wishlist khali hai</h3>
          <Link to="/products" style={styles.shopBtn}>Products Dekhein</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {wishlist.map(product => (
            <div key={product._id} style={styles.card}>
              <button onClick={() => handleRemove(product._id)} style={styles.removeBtn} title="Remove from wishlist">❤️</button>
              <Link to={`/product/${product._id}`}>
                <img src={product.images?.[0]?.url || 'https://via.placeholder.com/180x150?text=No+Image'} alt={product.name} style={styles.img} />
              </Link>
              <div style={styles.info}>
                <p style={styles.brand}>{product.brand}</p>
                <Link to={`/product/${product._id}`} style={styles.name}>{product.name}</Link>
                <p style={styles.price}>Rs. {product.price?.toLocaleString()}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button onClick={() => handleMoveToCart(product)} disabled={product.stock === 0} style={product.stock > 0 ? styles.cartBtn : styles.cartBtnDisabled}>
                    {product.stock > 0 ? '🛒 Cart Mein Dalo' : '❌ Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' },
  title: { fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: '0 0 24px' },
  loading: { textAlign: 'center', padding: '80px', color: '#64748b' },
  empty: { textAlign: 'center', padding: '60px', color: '#64748b' },
  shopBtn: { background: '#3b82f6', color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: '600', display: 'inline-block', marginTop: '12px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  card: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', position: 'relative' },
  removeBtn: { position: 'absolute', top: '10px', right: '10px', background: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', zIndex: 1 },
  img: { width: '100%', height: '170px', objectFit: 'contain', background: '#f8fafc', padding: '10px', boxSizing: 'border-box' },
  info: { padding: '14px' },
  brand: { color: '#64748b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 4px' },
  name: { color: '#1e293b', fontSize: '14px', fontWeight: '600', textDecoration: 'none', display: 'block', marginBottom: '6px' },
  price: { color: '#1d4ed8', fontSize: '16px', fontWeight: '700', margin: '0' },
  cartBtn: { flex: 1, background: '#3b82f6', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', width: '100%' },
  cartBtnDisabled: { flex: 1, background: '#e2e8f0', color: '#94a3b8', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'not-allowed', fontSize: '12px', width: '100%' }
};

export default WishlistPage;
