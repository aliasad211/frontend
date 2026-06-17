// ProductsPage.js - Full product listing with filters
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts, getProductMeta } from '../utils/api';
import { useCart } from '../context/AppContext';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ categories: [], brands: [] });
  const [pages, setPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    getProductMeta().then(res => setMeta(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page };
    if (keyword) params.keyword = keyword;
    if (category) params.category = category;
    if (brand) params.brand = brand;
    if (sort) params.sort = sort;

    getProducts(params)
      .then(res => { setProducts(res.data.products); setPages(res.data.pages); })
      .catch(() => toast.error('Products load nahi huay'))
      .finally(() => setLoading(false));
  }, [keyword, category, brand, sort, page]);

  const updateFilter = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div style={styles.page}>
      {/* Filters Sidebar */}
      <aside style={styles.sidebar}>
        <h3 style={styles.filterTitle}>Filters</h3>
        <div style={styles.filterSection}>
          <h4 style={styles.filterLabel}>Category</h4>
          <button onClick={() => updateFilter('category', '')} style={!category ? styles.activeFilter : styles.filterItem}>All</button>
          {meta.categories.map(c => (
            <button key={c} onClick={() => updateFilter('category', c)} style={c === category ? styles.activeFilter : styles.filterItem}>{c}</button>
          ))}
        </div>
        <div style={styles.filterSection}>
          <h4 style={styles.filterLabel}>Brand</h4>
          <button onClick={() => updateFilter('brand', '')} style={!brand ? styles.activeFilter : styles.filterItem}>All</button>
          {meta.brands.map(b => (
            <button key={b} onClick={() => updateFilter('brand', b)} style={b === brand ? styles.activeFilter : styles.filterItem}>{b}</button>
          ))}
        </div>
      </aside>

      {/* Products */}
      <main style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <p style={{ color: '#64748b', margin: 0 }}>
            {keyword && <span>"{keyword}" results</span>}
            {category && <span> · {category}</span>}
          </p>
          <select value={sort} onChange={e => updateFilter('sort', e.target.value)} style={styles.sortSelect}>
            <option value="">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Best Rated</option>
          </select>
        </div>

        {loading ? <p style={{ color: '#64748b' }}>Loading products...</p> : products.length === 0 ? (
          <div style={styles.noResults}><h3>Koi product nahi mila 😔</h3><p>Filters change karke dekho</p></div>
        ) : (
          <div style={styles.grid}>
            {products.map(product => (
              <div key={product._id} style={styles.card}>
                <Link to={`/product/${product._id}`}>
                  <img src={product.images[0]?.url || 'https://via.placeholder.com/200x160?text=No+Image'} alt={product.name} style={styles.img} />
                </Link>
                <div style={styles.info}>
                  <p style={styles.brand}>{product.brand}</p>
                  <Link to={`/product/${product._id}`} style={styles.name}>{product.name}</Link>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', margin: '6px 0' }}>
                    <span style={styles.price}>Rs. {product.price.toLocaleString()}</span>
                    {product.originalPrice && <span style={styles.original}>Rs. {product.originalPrice.toLocaleString()}</span>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#fbbf24', fontSize: '13px' }}>⭐ {product.ratings || '0'} ({product.numReviews})</span>
                    <button onClick={() => { addToCart(product); toast.success('Added!'); }} disabled={product.stock === 0} style={product.stock > 0 ? styles.addBtn : styles.disabledBtn}>
                      {product.stock > 0 ? 'Add' : 'Out'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '32px' }}>
            {[...Array(pages)].map((_, i) => (
              <button key={i} onClick={() => updateFilter('page', String(i + 1))} style={{ width: '36px', height: '36px', border: '1px solid #e2e8f0', borderRadius: '8px', background: page === i + 1 ? '#3b82f6' : '#fff', color: page === i + 1 ? '#fff' : '#475569', cursor: 'pointer', fontSize: '14px' }}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  page: { maxWidth: '1200px', margin: '0 auto', padding: '30px 20px', display: 'flex', gap: '24px' },
  sidebar: { width: '220px', flexShrink: 0 },
  filterTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px' },
  filterSection: { marginBottom: '24px' },
  filterLabel: { fontSize: '13px', fontWeight: '700', color: '#475569', margin: '0 0 8px', textTransform: 'uppercase' },
  filterItem: { display: 'block', width: '100%', textAlign: 'left', padding: '7px 10px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', fontSize: '14px', borderRadius: '6px' },
  activeFilter: { display: 'block', width: '100%', textAlign: 'left', padding: '7px 10px', border: 'none', background: '#dbeafe', cursor: 'pointer', color: '#1d4ed8', fontSize: '14px', borderRadius: '6px', fontWeight: '600' },
  sortSelect: { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#475569' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },
  card: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' },
  img: { width: '100%', height: '160px', objectFit: 'contain', background: '#f8fafc', padding: '10px', boxSizing: 'border-box' },
  info: { padding: '12px' },
  brand: { color: '#64748b', fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase', fontWeight: '600' },
  name: { color: '#1e293b', fontSize: '13px', fontWeight: '600', textDecoration: 'none', display: 'block' },
  price: { color: '#1d4ed8', fontSize: '15px', fontWeight: '700' },
  original: { color: '#94a3b8', fontSize: '11px', textDecoration: 'line-through' },
  addBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
  disabledBtn: { background: '#e2e8f0', color: '#94a3b8', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'not-allowed', fontSize: '12px' },
  noResults: { textAlign: 'center', padding: '60px', color: '#64748b' }
};

export default ProductsPage;
