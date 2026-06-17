import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto logout on 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- Auth ---
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// --- Products ---
export const getProducts = (params) => API.get('/products', { params });
export const getProductById = (id) => API.get(`/products/${id}`);
export const getFeaturedProducts = () => API.get('/products/featured');
export const getProductMeta = () => API.get('/products/meta');
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// --- Orders ---
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/myorders');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const getAllOrders = (params) => API.get('/orders', { params });
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { orderStatus: status });

// --- Cart / Wishlist ---
export const toggleWishlist = (productId) => API.post(`/cart/wishlist/${productId}`);
export const getWishlist = () => API.get('/cart/wishlist');

// --- Reviews ---
export const createReview = (productId, data) => API.post(`/reviews/${productId}`, data);
export const getProductReviews = (productId) => API.get(`/reviews/${productId}`);

// --- Admin ---
export const getDashboardStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const toggleBlockUser = (id) => API.put(`/admin/users/${id}/block`);
export const getLowStock = () => API.get('/admin/low-stock');
