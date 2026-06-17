import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProductById } from '../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Mobiles', 'Laptops', 'Tablets', 'TVs', 'Audio', 'Cameras', 'Gaming', 'Accessories', 'Smart Home', 'Wearables'];

const AdminAddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', description: '', price: '', originalPrice: '', category: 'Mobiles',
    brand: '', stock: '', featured: false,
    images: [{ url: '', public_id: '' }],
    specifications: [{ key: '', value: '' }]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getProductById(id).then(res => {
        const p = res.data;
        setForm({
          name: p.name, description: p.description, price: p.price,
          originalPrice: p.originalPrice || '', category: p.category,
          brand: p.brand, stock: p.stock, featured: p.featured,
          images: p.images.length > 0 ? p.images : [{ url: '', public_id: '' }],
          specifications: p.specifications.length > 0 ? p.specifications : [{ key: '', value: '' }]
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSpecChange = (i, field, value) => {
    setForm(prev => {
      const specs = [...prev.specifications];
      specs[i][field] = value;
      return { ...prev, specifications: specs };
    });
  };

  const handleImageChange = (i, field, value) => {
    setForm(prev => {
      const imgs = [...prev.images];
      imgs[i][field] = value;
      return { ...prev, images: imgs };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form, specifications: form.specifications.filter(s => s.key && s.value), images: form.images.filter(img => img.url) };
      if (isEdit) await updateProduct(id, data);
      else await createProduct(data);
      toast.success(`Product ${isEdit ? 'updated' : 'created'}!`);
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      <form onSubmit={handleSubmit}>
        <div style={styles.grid}>
          {/* Basic Info */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Basic Information</h3>
            <div style={styles.field}><label style={styles.label}>Product Name *</label>
              <input style={styles.input} name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Samsung Galaxy S24" /></div>
            <div style={styles.field}><label style={styles.label}>Description *</label>
              <textarea style={{ ...styles.input, height: '100px', resize: 'vertical' }} name="description" value={form.description} onChange={handleChange} required /></div>
            <div style={styles.row}>
              <div style={styles.field}><label style={styles.label}>Category *</label>
                <select style={styles.input} name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select></div>
              <div style={styles.field}><label style={styles.label}>Brand *</label>
                <input style={styles.input} name="brand" value={form.brand} onChange={handleChange} required placeholder="Samsung" /></div>
            </div>
            <div style={styles.row}>
              <div style={styles.field}><label style={styles.label}>Price (Rs.) *</label>
                <input style={styles.input} type="number" name="price" value={form.price} onChange={handleChange} required /></div>
              <div style={styles.field}><label style={styles.label}>Original Price (Rs.)</label>
                <input style={styles.input} type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} /></div>
              <div style={styles.field}><label style={styles.label}>Stock *</label>
                <input style={styles.input} type="number" name="stock" value={form.stock} onChange={handleChange} required /></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
              <input type="checkbox" name="featured" id="featured" checked={form.featured} onChange={handleChange} />
              <label htmlFor="featured" style={styles.label}>Mark as Featured Product</label>
            </div>
          </div>

          {/* Images */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Product Images (URLs)</h3>
            {form.images.map((img, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input style={{ ...styles.input, flex: 1 }} placeholder="Image URL" value={img.url} onChange={(e) => handleImageChange(i, 'url', e.target.value)} />
                {i > 0 && <button type="button" onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }))} style={styles.removeBtn}>✕</button>}
              </div>
            ))}
            <button type="button" onClick={() => setForm(p => ({ ...p, images: [...p.images, { url: '', public_id: '' }] }))} style={styles.addMoreBtn}>+ Add Image</button>

            {/* Specifications */}
            <h3 style={{ ...styles.cardTitle, marginTop: '24px' }}>Specifications</h3>
            {form.specifications.map((spec, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input style={{ ...styles.input, flex: 1 }} placeholder="Key (e.g. RAM)" value={spec.key} onChange={(e) => handleSpecChange(i, 'key', e.target.value)} />
                <input style={{ ...styles.input, flex: 1 }} placeholder="Value (e.g. 8GB)" value={spec.value} onChange={(e) => handleSpecChange(i, 'value', e.target.value)} />
                {i > 0 && <button type="button" onClick={() => setForm(p => ({ ...p, specifications: p.specifications.filter((_, j) => j !== i) }))} style={styles.removeBtn}>✕</button>}
              </div>
            ))}
            <button type="button" onClick={() => setForm(p => ({ ...p, specifications: [...p.specifications, { key: '', value: '' }] }))} style={styles.addMoreBtn}>+ Add Spec</button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} style={styles.cancelBtn}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 24px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  card: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px' },
  field: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' },
  input: { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#1e293b', outline: 'none', boxSizing: 'border-box' },
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' },
  removeBtn: { background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' },
  addMoreBtn: { background: '#f1f5f9', color: '#475569', border: '1px dashed #cbd5e1', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', marginTop: '4px' },
  submitBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' },
  cancelBtn: { background: '#f1f5f9', color: '#475569', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' }
};

export default AdminAddProduct;
