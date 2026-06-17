import React, { useState, useEffect } from 'react';
import { getAdminUsers, toggleBlockUser } from '../utils/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminUsers()
      .then(res => setUsers(res.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleBlock = async (id, name, isBlocked) => {
    const action = isBlocked ? 'unblock' : 'block';
    if (!window.confirm(`"${name}" ko ${action} karna chahte hain?`)) return;
    try {
      await toggleBlockUser(id);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
      toast.success(`User ${action}ed!`);
    } catch { toast.error('Action failed'); }
  };

  return (
    <div>
      <h1 style={styles.title}>Users Management</h1>
      <p style={{ color: '#64748b', marginBottom: '20px' }}>Total: {users.length} users</p>

      {loading ? <p style={{ color: '#64748b' }}>Loading...</p> : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Name', 'Email', 'Phone', 'Joined', 'Status', 'Action'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user._id} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
                      <strong>{user.name}</strong>
                    </div>
                  </td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.phone || '—'}</td>
                  <td style={styles.td}>{new Date(user.createdAt).toLocaleDateString('en-PK')}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...(user.isBlocked ? styles.blocked : styles.active) }}>
                      {user.isBlocked ? '🚫 Blocked' : '✅ Active'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => handleToggleBlock(user._id, user.name, user.isBlocked)} style={{ ...styles.actionBtn, ...(user.isBlocked ? styles.unblockBtn : styles.blockBtn) }}>
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px' },
  tableWrap: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  th: { background: '#f1f5f9', padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#475569' },
  td: { padding: '12px 16px', color: '#1e293b', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  active: { background: '#d1fae5', color: '#065f46' },
  blocked: { background: '#fee2e2', color: '#991b1b' },
  actionBtn: { border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  blockBtn: { background: '#fee2e2', color: '#dc2626' },
  unblockBtn: { background: '#d1fae5', color: '#065f46' }
};

export default AdminUsers;
