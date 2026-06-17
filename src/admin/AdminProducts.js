import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../utils/api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getProducts({ page, pageSize: 15 });
      setProducts(data.products);
      setPages(data.pages);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`"${name}" ko delete karna chahte hain?`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted!');
      fetchProducts();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={styles.title}>Products</h1>
        <Link to="/admin/products/add" style={styles.addBtn}>+ Add Product</Link>
      </div>

      {loading ? <p style={{ color: '#64748b' }}>Loading...</p> : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Image', 'Name', 'Category', 'Brand', 'Price', 'Stock', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p._id} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                  <td style={styles.td}>
                    <img src={p.images[0]?.url || 'https://via.placeholder.com/50'} alt={p.name} style={styles.prodImg} />
                  </td>
                  <td style={styles.td}><strong>{p.name}</strong></td>
                  <td style={styles.td}>{p.category}</td>
                  <td style={styles.td}>{p.brand}</td>
                  <td style={{ ...styles.td, color: '#10b981', fontWeight: '700' }}>Rs. {p.price?.toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={{ color: p.stock <= 5 ? '#ef4444' : p.stock <= 15 ? '#f59e0b' : '#10b981', fontWeight: '600' }}>
                      {p.stock}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/admin/products/edit/${p._id}`} style={styles.editBtn}>Edit</Link>
                      <button onClick={() => handleDelete(p._id, p.name)} style={styles.deleteBtn}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div style={styles.pagination}>
          {[...Array(pages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} style={{ ...styles.pageBtn, ...(page === i + 1 ? styles.activePage : {}) }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: 0 },
  addBtn: { background: '#3b82f6', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' },
  tableWrap: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  th: { background: '#f1f5f9', padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#475569' },
  td: { padding: '10px 16px', color: '#1e293b', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
  prodImg: { width: '50px', height: '50px', objectFit: 'contain', borderRadius: '6px', background: '#f1f5f9' },
  editBtn: { background: '#dbeafe', color: '#1d4ed8', padding: '5px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '12px', fontWeight: '600' },
  deleteBtn: { background: '#fee2e2', color: '#dc2626', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
  pagination: { display: 'flex', gap: '8px', marginTop: '20px', justifyContent: 'center' },
  pageBtn: { width: '36px', height: '36px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '14px' },
  activePage: { background: '#3b82f6', color: '#fff', border: '1px solid #3b82f6' }
};

export default AdminProducts;
