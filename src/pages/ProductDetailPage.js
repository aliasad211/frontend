import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProductReviews, createReview, toggleWishlist } from '../utils/api';
import { useCart, useAuth } from '../context/AppContext';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');

  useEffect(() => {
    setLoading(true);
    Promise.all([getProductById(id), getProductReviews(id)])
      .then(([prodRes, revRes]) => {
        setProduct(prodRes.data);
        setReviews(revRes.data);
      })
      .catch(() => toast.error('Product load nahi hua'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} cart mein add ho gaya!`);
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Pehle login karein!'); return; }
    try {
      const { data } = await toggleWishlist(id);
      setInWishlist(data.added);
      toast.success(data.added ? 'Wishlist mein add hua!' : 'Wishlist se remove hua!');
    } catch { toast.error('Failed'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Review dene ke liye login karein!'); return; }
    setSubmittingReview(true);
    try {
      const { data } = await createReview(id, reviewForm);
      setReviews(prev => [{ ...data, user: { name: user.name } }, ...prev]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submit ho gaya!');
      // Refresh product ratings
      const { data: updatedProd } = await getProductById(id);
      setProduct(updatedProd);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review submit nahi hua');
    } finally { setSubmittingReview(false); }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!product) return <div style={styles.loading}>Product nahi mila</div>;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div style={styles.container}>
      {/* Breadcrumb */}
      <nav style={styles.breadcrumb}>
        <Link to="/" style={styles.bcLink}>Home</Link> &gt;
        <Link to="/products" style={styles.bcLink}>Products</Link> &gt;
        <Link to={`/products?category=${product.category}`} style={styles.bcLink}>{product.category}</Link> &gt;
        <span style={{ color: '#1e293b' }}>{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div style={styles.mainGrid}>
        {/* Images */}
        <div style={styles.imageSection}>
          <div style={styles.mainImgWrap}>
            <img
              src={product.images[selectedImg]?.url || 'https://via.placeholder.com/400x350?text=No+Image'}
              alt={product.name}
              style={styles.mainImg}
            />
            {discount > 0 && <span style={styles.discountBadge}>-{discount}%</span>}
          </div>
          {product.images.length > 1 && (
            <div style={styles.thumbnails}>
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={`view-${i}`}
                  onClick={() => setSelectedImg(i)}
                  style={{ ...styles.thumb, ...(selectedImg === i ? styles.activeThumb : {}) }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={styles.infoSection}>
          <p style={styles.brand}>{product.brand}</p>
          <h1 style={styles.productName}>{product.name}</h1>

          <div style={styles.ratingRow}>
            <span style={styles.stars}>{'★'.repeat(Math.round(product.ratings))}{'☆'.repeat(5 - Math.round(product.ratings))}</span>
            <span style={styles.ratingText}>{product.ratings} ({product.numReviews} reviews)</span>
          </div>

          <div style={styles.priceRow}>
            <span style={styles.price}>Rs. {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span style={styles.originalPrice}>Rs. {product.originalPrice.toLocaleString()}</span>
                <span style={styles.saveBadge}>Save Rs. {(product.originalPrice - product.price).toLocaleString()}</span>
              </>
            )}
          </div>

          <p style={styles.description}>{product.description}</p>

          {/* Stock */}
          <div style={styles.stockRow}>
            {product.stock > 0 ? (
              <span style={styles.inStock}>✅ In Stock ({product.stock} available)</span>
            ) : (
              <span style={styles.outStock}>❌ Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div style={styles.actions}>
              <div style={styles.qtyRow}>
                <label style={styles.qtyLabel}>Quantity:</label>
                <div style={styles.qtyControls}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={styles.qtyBtn}>−</button>
                  <span style={styles.qtyNum}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={styles.qtyBtn}>+</button>
                </div>
              </div>
              <div style={styles.btnRow}>
                <button onClick={handleAddToCart} style={styles.addCartBtn}>🛒 Cart Mein Add Karo</button>
                <button onClick={handleWishlist} style={{ ...styles.wishlistBtn, color: inWishlist ? '#ef4444' : '#64748b' }}>
                  {inWishlist ? '❤️' : '🤍'} Wishlist
                </button>
              </div>
            </div>
          )}

          <div style={styles.features}>
            <div style={styles.feature}><span>🚚</span><span>Rs. 5,000+ pe FREE Delivery</span></div>
            <div style={styles.feature}><span>🔄</span><span>7 din return policy</span></div>
            <div style={styles.feature}><span>🛡️</span><span>Official warranty</span></div>
            <div style={styles.feature}><span>💳</span><span>Cash on delivery available</span></div>
          </div>
        </div>
      </div>

      {/* Tabs: Specs + Reviews */}
      <div style={styles.tabsSection}>
        <div style={styles.tabs}>
          {['specs', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : {}) }}>
              {tab === 'specs' ? `📋 Specifications` : `💬 Reviews (${reviews.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'specs' && (
          <div style={styles.tabContent}>
            {product.specifications.length > 0 ? (
              <table style={styles.specsTable}>
                <tbody>
                  {product.specifications.map((spec, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                      <td style={styles.specKey}>{spec.key}</td>
                      <td style={styles.specVal}>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p style={{ color: '#94a3b8' }}>Specifications available nahi hain</p>}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={styles.tabContent}>
            {/* Write Review */}
            {user && (
              <div style={styles.reviewForm}>
                <h3 style={styles.reviewFormTitle}>Apna Review Likho</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div style={styles.field}>
                    <label style={styles.label}>Rating</label>
                    <select value={reviewForm.rating} onChange={e => setReviewForm(p => ({ ...p, rating: Number(e.target.value) }))} style={styles.select}>
                      {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{'★'.repeat(r)} {r} Star{r > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Title</label>
                    <input style={styles.input} value={reviewForm.title} onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))} required placeholder="Short title..." />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Review</label>
                    <textarea style={{ ...styles.input, height: '90px', resize: 'vertical' }} value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} required placeholder="Apna experience share karo..." />
                  </div>
                  <button type="submit" disabled={submittingReview} style={styles.submitBtn}>
                    {submittingReview ? 'Submitting...' : 'Review Submit Karo'}
                  </button>
                </form>
              </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p style={{ color: '#94a3b8', padding: '20px 0' }}>Abhi koi review nahi hai. Pehle review do!</p>
            ) : reviews.map((rev, i) => (
              <div key={i} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <div style={styles.reviewAvatar}>{rev.user?.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <strong style={{ color: '#1e293b' }}>{rev.user?.name}</strong>
                    <div style={{ color: '#fbbf24', fontSize: '14px' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '12px' }}>
                    {new Date(rev.createdAt).toLocaleDateString('en-PK')}
                  </span>
                </div>
                <h4 style={{ color: '#1e293b', margin: '8px 0 4px', fontSize: '15px' }}>{rev.title}</h4>
                <p style={{ color: '#475569', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '24px 20px' },
  loading: { textAlign: 'center', padding: '80px', color: '#64748b', fontSize: '18px' },
  breadcrumb: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px', fontSize: '13px', color: '#94a3b8', flexWrap: 'wrap' },
  bcLink: { color: '#3b82f6', textDecoration: 'none' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' },
  imageSection: {},
  mainImgWrap: { position: 'relative', background: '#f8fafc', borderRadius: '16px', overflow: 'hidden', marginBottom: '12px' },
  mainImg: { width: '100%', height: '360px', objectFit: 'contain', padding: '20px', boxSizing: 'border-box' },
  discountBadge: { position: 'absolute', top: '16px', left: '16px', background: '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' },
  thumbnails: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  thumb: { width: '72px', height: '72px', objectFit: 'contain', background: '#f8fafc', borderRadius: '8px', cursor: 'pointer', padding: '6px', border: '2px solid transparent', boxSizing: 'border-box' },
  activeThumb: { border: '2px solid #3b82f6' },
  infoSection: {},
  brand: { color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 6px' },
  productName: { fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 12px', lineHeight: '1.3' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' },
  stars: { color: '#fbbf24', fontSize: '18px' },
  ratingText: { color: '#64748b', fontSize: '13px' },
  priceRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' },
  price: { fontSize: '28px', fontWeight: '800', color: '#1d4ed8' },
  originalPrice: { fontSize: '16px', color: '#94a3b8', textDecoration: 'line-through' },
  saveBadge: { background: '#d1fae5', color: '#065f46', padding: '3px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  description: { color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 16px' },
  stockRow: { marginBottom: '16px' },
  inStock: { color: '#10b981', fontSize: '14px', fontWeight: '600' },
  outStock: { color: '#ef4444', fontSize: '14px', fontWeight: '600' },
  actions: { marginBottom: '20px' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' },
  qtyLabel: { color: '#475569', fontWeight: '600', fontSize: '14px' },
  qtyControls: { display: 'flex', alignItems: 'center', gap: '8px' },
  qtyBtn: { width: '36px', height: '36px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', cursor: 'pointer', fontSize: '18px', fontWeight: '700', color: '#1e293b' },
  qtyNum: { minWidth: '36px', textAlign: 'center', fontWeight: '700', fontSize: '16px' },
  btnRow: { display: 'flex', gap: '12px' },
  addCartBtn: { flex: 1, background: '#3b82f6', color: '#fff', border: 'none', padding: '14px 20px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
  wishlistBtn: { background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px 18px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' },
  features: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f8fafc', borderRadius: '12px', padding: '16px' },
  feature: { display: 'flex', gap: '8px', fontSize: '13px', color: '#475569' },
  tabsSection: { background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  tabs: { display: 'flex', borderBottom: '1px solid #e2e8f0' },
  tab: { padding: '16px 24px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '15px', color: '#64748b', fontWeight: '600', borderBottom: '3px solid transparent' },
  activeTab: { color: '#3b82f6', borderBottom: '3px solid #3b82f6' },
  tabContent: { padding: '24px' },
  specsTable: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  specKey: { padding: '12px 16px', color: '#64748b', fontWeight: '600', width: '200px', borderBottom: '1px solid #e2e8f0' },
  specVal: { padding: '12px 16px', color: '#1e293b', borderBottom: '1px solid #e2e8f0' },
  reviewForm: { background: '#f8fafc', borderRadius: '12px', padding: '20px', marginBottom: '24px' },
  reviewFormTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px' },
  field: { marginBottom: '12px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '4px' },
  select: { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', width: '100%' },
  input: { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  submitBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  reviewCard: { background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '12px' },
  reviewHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
  reviewAvatar: { width: '36px', height: '36px', borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }
};

export default ProductDetailPage;
