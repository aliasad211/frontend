import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useCart } from '../context/AppContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery.trim()}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          ⚡ TechZone
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>🔍</button>
        </form>

        {/* Nav Links */}
        <div style={styles.links}>
          <Link to="/products" style={styles.link}>Products</Link>

          {user ? (
            <>
              {isAdmin && <Link to="/admin" style={{ ...styles.link, color: '#f59e0b' }}>Admin</Link>}
              <Link to="/wishlist" style={styles.link}>❤️ Wishlist</Link>
              <Link to="/my-orders" style={styles.link}>Orders</Link>
              <Link to="/profile" style={styles.link}>👤 {user.name.split(' ')[0]}</Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>Register</Link>
            </>
          )}

          {/* Cart */}
          <Link to="/cart" style={styles.cartBtn}>
            🛒 Cart
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: { background: '#1e293b', padding: '0 20px', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.3)' },
  container: { maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '20px', height: '64px' },
  logo: { color: '#60a5fa', textDecoration: 'none', fontSize: '22px', fontWeight: '800', whiteSpace: 'nowrap' },
  searchForm: { display: 'flex', flex: 1, maxWidth: '400px' },
  searchInput: { flex: 1, padding: '8px 12px', border: 'none', borderRadius: '8px 0 0 8px', background: '#334155', color: '#fff', fontSize: '14px', outline: 'none' },
  searchBtn: { padding: '8px 14px', background: '#3b82f6', border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer', fontSize: '14px' },
  links: { display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' },
  link: { color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', whiteSpace: 'nowrap' },
  logoutBtn: { background: 'none', border: '1px solid #475569', color: '#cbd5e1', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  registerBtn: { background: '#3b82f6', color: '#fff', textDecoration: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '13px' },
  cartBtn: { position: 'relative', color: '#60a5fa', textDecoration: 'none', fontSize: '14px', whiteSpace: 'nowrap' },
  badge: { position: 'absolute', top: '-8px', right: '-10px', background: '#ef4444', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

export default Navbar;
