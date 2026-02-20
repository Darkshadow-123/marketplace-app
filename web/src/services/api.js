const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  auth: {
    register: async (data) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    login: async (data) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    me: async () => {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { ...getAuthHeader() }
      });
      return res.json();
    }
  },
  products: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_URL}/products?${query}`);
      return res.json();
    },
    getOne: async (id) => {
      const res = await fetch(`${API_URL}/products/${id}`);
      return res.json();
    },
    create: async (data) => {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    update: async (id, data) => {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    delete: async (id) => {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
      });
      return res.json();
    }
  },
  favorites: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/favorites`, {
        headers: { ...getAuthHeader() }
      });
      return res.json();
    },
    add: async (productId) => {
      const res = await fetch(`${API_URL}/favorites/${productId}`, {
        method: 'POST',
        headers: { ...getAuthHeader() }
      });
      return res.json();
    },
    remove: async (productId) => {
      const res = await fetch(`${API_URL}/favorites/${productId}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
      });
      return res.json();
    },
    check: async (productId) => {
      const res = await fetch(`${API_URL}/favorites/check/${productId}`, {
        headers: { ...getAuthHeader() }
      });
      return res.json();
    }
  }
};
