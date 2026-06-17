import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerAPI } from '../utils/api';
import { useAuth } from '../context/AppContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords match nahi karte!'); return; }
    setLoading(true);
    try {
      const { data } = await registerAPI({ name: form.name, email: form.email, password: form.password });
      login(data);
      toast.success('Account ban gaya! Welcome!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <Link to="/" style={styles.logo}>⚡ TechZone</Link>
        <h2 style={styles.title}>Create your account</h2>
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Ali Hassan' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'ali@example.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
            { label: 'Confirm Password', key: 'confirm', type: 'password', placeholder: '••••••••' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input style={styles.input} type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} required placeholder={placeholder} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={styles.btn}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p style={styles.footer}>Already account hai? <Link to="/login" style={{ color: '#3b82f6' }}>Login karo</Link></p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' },
  card: { background: '#fff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  logo: { color: '#3b82f6', textDecoration: 'none', fontSize: '22px', fontWeight: '800', display: 'block', marginBottom: '20px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: '0 0 24px' },
  field: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  footer: { textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '14px' }
};

export default RegisterPage;
