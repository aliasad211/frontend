import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={styles.footer}>
    <div style={styles.container}>
      <div style={styles.grid}>
        <div>
          <h3 style={styles.brand}>⚡ TechZone</h3>
          <p style={styles.desc}>Pakistan ka best electronics online store. Latest gadgets at best prices.</p>
        </div>
        <div>
          <h4 style={styles.heading}>Categories</h4>
          {['Mobiles', 'Laptops', 'TVs', 'Audio', 'Gaming'].map(c => (
            <Link key={c} to={`/products?category=${c}`} style={styles.link}>{c}</Link>
          ))}
        </div>
        <div>
          <h4 style={styles.heading}>Quick Links</h4>
          <Link to="/products" style={styles.link}>All Products</Link>
          <Link to="/my-orders" style={styles.link}>My Orders</Link>
          <Link to="/wishlist" style={styles.link}>Wishlist</Link>
          <Link to="/profile" style={styles.link}>My Profile</Link>
        </div>
        <div>
          <h4 style={styles.heading}>Contact</h4>
          <p style={styles.contactText}>📧 support@techzone.pk</p>
          <p style={styles.contactText}>📱 +92-300-1234567</p>
          <p style={styles.contactText}>📍 Islamabad, Pakistan</p>
        </div>
      </div>
      <div style={styles.bottom}>
        <p style={{ margin: 0, color: '#64748b' }}>© 2024 TechZone. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const styles = {
  footer: { background: '#0f172a', marginTop: '60px' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px 20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '32px' },
  brand: { color: '#60a5fa', fontSize: '20px', fontWeight: '800', margin: '0 0 10px' },
  desc: { color: '#64748b', fontSize: '14px', lineHeight: '1.6' },
  heading: { color: '#cbd5e1', fontSize: '15px', fontWeight: '700', margin: '0 0 12px' },
  link: { display: 'block', color: '#64748b', textDecoration: 'none', fontSize: '14px', marginBottom: '6px' },
  contactText: { color: '#64748b', fontSize: '14px', margin: '0 0 6px' },
  bottom: { borderTop: '1px solid #1e293b', paddingTop: '20px', textAlign: 'center' }
};

export default Footer;
