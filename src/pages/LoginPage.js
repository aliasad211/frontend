import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginAPI } from '../utils/api';
import { useAuth } from '../context/AppContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginAPI(form);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate(data.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <Link to="/" style={styles.logo}>⚡ TechZone</Link>
        <h2 style={styles.title}>Login to your account</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required placeholder="you@example.com" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p style={styles.footer}>Account nahi hai? <Link to="/register" style={{ color: '#3b82f6' }}>Register karo</Link></p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' },
  card: { background: '#fff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  logo: { color: '#3b82f6', textDecoration: 'none', fontSize: '22px', fontWeight: '800', display: 'block', marginBottom: '20px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: '0 0 24px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  footer: { textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '14px' }
};

export default LoginPage;
