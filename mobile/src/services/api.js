const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = global.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  auth: {
    login: async (data) => {
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      } catch (e) {
        return { error: 'Network error' };
      }
    },
    register: async (data) => {
      try {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      } catch (e) {
        return { error: 'Network error' };
      }
    }
  },
  products: {
    getAll: async (params = {}) => {
      try {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_URL}/products?${query}`);
        return await res.json();
      } catch (e) {
        return { error: 'Network error', products: [] };
      }
    },
    getOne: async (id) => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        return await res.json();
      } catch (e) {
        return { error: 'Network error' };
      }
    }
  },
  favorites: {
    getAll: async () => {
      try {
        const res = await fetch(`${API_URL}/favorites`, {
          headers: { ...getAuthHeader() }
        });
        return await res.json();
      } catch (e) {
        return [];
      }
    },
    add: async (productId) => {
      try {
        const res = await fetch(`${API_URL}/favorites/${productId}`, {
          method: 'POST',
          headers: { ...getAuthHeader() }
        });
        return await res.json();
      } catch (e) {
        return { error: 'Network error' };
      }
    },
    remove: async (productId) => {
      try {
        const res = await fetch(`${API_URL}/favorites/${productId}`, {
          method: 'DELETE',
          headers: { ...getAuthHeader() }
        });
        return await res.json();
      } catch (e) {
        return { error: 'Network error' };
      }
    },
    check: async (productId) => {
      try {
        const res = await fetch(`${API_URL}/favorites/check/${productId}`, {
          headers: { ...getAuthHeader() }
        });
        return await res.json();
      } catch (e) {
        return { isFavorite: false };
      }
    }
  }
};
