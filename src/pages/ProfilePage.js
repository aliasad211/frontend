import React, { useState } from 'react';
import { useAuth } from '../context/AppContext';
import { updateProfile } from '../utils/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Passwords match nahi karte!'); return;
    }
    setLoading(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.password) payload.password = form.password;
      const { data } = await updateProfile(payload);
      login({ ...user, ...data });
      toast.success('Profile update ho gaya!');
      setEditing(false);
      setForm(p => ({ ...p, password: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Mera Profile</h1>
      <div style={styles.layout}>
        {/* Profile Card */}
        <div style={styles.profileCard}>
          <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
          <h2 style={styles.name}>{user?.name}</h2>
          <p style={styles.email}>{user?.email}</p>
          {user?.role === 'admin' && <span style={styles.adminBadge}>⚡ Admin</span>}
          <p style={styles.joined}>Member since {new Date().getFullYear()}</p>
        </div>

        {/* Edit Form */}
        <div style={styles.formCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={styles.cardTitle}>Account Information</h2>
            {!editing && <button onClick={() => setEditing(true)} style={styles.editBtn}>✏️ Edit</button>}
          </div>

          {!editing ? (
            <div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>Full Name</span><span style={styles.infoVal}>{user?.name}</span></div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>Email</span><span style={styles.infoVal}>{user?.email}</span></div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>Phone</span><span style={styles.infoVal}>{user?.phone || '—'}</span></div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>Password</span><span style={styles.infoVal}>••••••••</span></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input style={styles.input} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email (change nahi ho sakta)</label>
                <input style={{ ...styles.input, background: '#f1f5f9', color: '#94a3b8' }} value={user?.email} disabled />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Phone</label>
                <input style={styles.input} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="03001234567" type="tel" />
              </div>
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '16px' }}>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px' }}>Password change karna chahte hain? (optional)</p>
                <div style={styles.field}>
                  <label style={styles.label}>New Password</label>
                  <input style={styles.input} type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Confirm Password</label>
                  <input style={styles.input} type="password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="••••••••" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={loading} style={styles.saveBtn}>{loading ? 'Saving...' : 'Save Changes'}</button>
                <button type="button" onClick={() => setEditing(false)} style={styles.cancelBtn}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '30px 20px' },
  title: { fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: '0 0 24px' },
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  profileCard: { width: '220px', background: '#fff', borderRadius: '16px', padding: '32px 20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flexShrink: 0 },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', fontSize: '32px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  name: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px' },
  email: { color: '#64748b', fontSize: '13px', margin: '0 0 10px', wordBreak: 'break-all' },
  adminBadge: { background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'inline-block', marginBottom: '10px' },
  joined: { color: '#94a3b8', fontSize: '12px', margin: 0 },
  formCard: { flex: 1, background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 },
  editBtn: { background: '#eff6ff', color: '#3b82f6', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f1f5f9' },
  infoLabel: { color: '#64748b', fontSize: '14px' },
  infoVal: { color: '#1e293b', fontWeight: '600', fontSize: '14px' },
  field: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  saveBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  cancelBtn: { background: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }
};

export default ProfilePage;
