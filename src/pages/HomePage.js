import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '../utils/api';
import { useCart } from '../context/AppContext';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { name: 'Mobiles', icon: '📱' }, { name: 'Laptops', icon: '💻' },
  { name: 'TVs', icon: '📺' }, { name: 'Audio', icon: '🎧' },
  { name: 'Gaming', icon: '🎮' }, { name: 'Cameras', icon: '📷' },
  { name: 'Tablets', icon: '📟' }, { name: 'Wearables', icon: '⌚' },
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getFeaturedProducts()
      .then(res => setFeatured(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Pakistan's Best Electronics Store</h1>
          <p style={styles.heroSub}>Latest gadgets, best prices, fast delivery</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => navigate('/products')} style={styles.heroBtn}>Shop Now →</button>
            <button onClick={() => navigate('/products?category=Mobiles')} style={styles.heroBtn2}>View Mobiles</button>
          </div>
        </div>
      </div>

      <div style={styles.container}>
        {/* Categories */}
        <section style={{ margin: '40px 0' }}>
          <h2 style={styles.sectionTitle}>Shop by Category</h2>
          <div style={styles.catGrid}>
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.name}`} style={styles.catCard}>
                <span style={{ fontSize: '32px' }}>{cat.icon}</span>
                <span style={styles.catName}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section style={{ margin: '40px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={styles.sectionTitle}>Featured Products</h2>
            <Link to="/products" style={{ color: '#3b82f6', textDecoration: 'none' }}>View All →</Link>
          </div>
          {loading ? (
            <p style={{ color: '#94a3b8' }}>Loading...</p>
          ) : (
            <div style={styles.productGrid}>
              {featured.map(product => (
                <div key={product._id} style={styles.productCard}>
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.images[0]?.url || 'https://via.placeholder.com/200x180?text=No+Image'}
                      alt={product.name}
                      style={styles.productImg}
                    />
                  </Link>
                  <div style={styles.productInfo}>
                    <p style={styles.brand}>{product.brand}</p>
                    <Link to={`/product/${product._id}`} style={styles.productName}>{product.name}</Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '6px 0' }}>
                      <span style={styles.price}>Rs. {product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span style={styles.originalPrice}>Rs. {product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#fbbf24', fontSize: '13px' }}>⭐ {product.ratings || '0'}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        style={product.stock > 0 ? styles.addBtn : styles.addBtnDisabled}
                      >
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Banner */}
        <div style={styles.banner}>
          <h3 style={{ margin: 0, fontSize: '24px' }}>🚚 Free Shipping on orders above Rs. 5,000</h3>
          <p style={{ margin: '8px 0 0', opacity: 0.8 }}>Fast delivery all over Pakistan</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  hero: { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '80px 20px', textAlign: 'center' },
  heroContent: { maxWidth: '600px', margin: '0 auto' },
  heroTitle: { color: '#f1f5f9', fontSize: '40px', fontWeight: '800', margin: '0 0 16px' },
  heroSub: { color: '#94a3b8', fontSize: '18px', margin: '0 0 28px' },
  heroBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: '600' },
  heroBtn2: { background: 'transparent', color: '#60a5fa', border: '2px solid #3b82f6', padding: '14px 32px', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: '600' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
  sectionTitle: { color: '#1e293b', fontSize: '24px', fontWeight: '700', margin: 0 },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '12px', marginTop: '16px' },
  catCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '20px 10px', background: '#fff', borderRadius: '12px', textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s', border: '1px solid #e2e8f0' },
  catName: { color: '#334155', fontSize: '12px', fontWeight: '600', textAlign: 'center' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  productCard: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', transition: 'transform 0.2s' },
  productImg: { width: '100%', height: '180px', objectFit: 'contain', background: '#f8fafc', padding: '10px' },
  productInfo: { padding: '14px' },
  brand: { color: '#64748b', fontSize: '12px', margin: '0 0 4px', textTransform: 'uppercase' },
  productName: { color: '#1e293b', fontSize: '14px', fontWeight: '600', textDecoration: 'none', display: 'block', marginBottom: '4px' },
  price: { color: '#1d4ed8', fontSize: '16px', fontWeight: '700' },
  originalPrice: { color: '#94a3b8', fontSize: '12px', textDecoration: 'line-through' },
  addBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  addBtnDisabled: { background: '#e2e8f0', color: '#94a3b8', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'not-allowed', fontSize: '13px' },
  banner: { background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', color: '#fff', padding: '32px', borderRadius: '16px', textAlign: 'center', margin: '40px 0' }
};

export default HomePage;
