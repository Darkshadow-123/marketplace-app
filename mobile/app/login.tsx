import React, { useState, useEffect, createContext, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

const API_URL = 'https://marketplace-app-qd1q.onrender.com/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      console.log('Attempting login to:', `${API_URL}/auth/login`);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);
      
      if (!res.ok || data.error) {
        return { error: data.error || 'Login failed' };
      }
      if (data.token && data.user) {
        global.token = data.token;
        setUser(data.user);
        return data;
      }
      return { error: 'Invalid response from server' };
    } catch (e) {
      console.log('Login error:', e);
      return { error: 'Network error - check your connection' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!data.error) {
        global.token = data.token;
        setUser(data.user);
      }
      return data;
    } catch (e) {
      return { error: 'Network error' };
    }
  };

  const logout = () => {
    global.token = null;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const api = {
  products: {
    getAll: async (params = {}) => {
      try {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_URL}/products?${query}`);
        return await res.json();
      } catch (e) {
        return { error: 'Network error', products: [] };
      }
    }
  },
  favorites: {
    getAll: async () => {
      try {
        const token = global.token;
        if (!token) return [];
        const res = await fetch(`${API_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          router.replace('/login');
          return [];
        }
        return await res.json();
      } catch (e) {
        return [];
      }
    },
    add: async (productId) => {
      try {
        const token = global.token;
        if (!token) return { error: 'Not authenticated' };
        const res = await fetch(`${API_URL}/favorites/${productId}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          router.replace('/login');
          return { error: 'Not authenticated' };
        }
        return await res.json();
      } catch (e) {
        return { error: 'Network error' };
      }
    },
    remove: async (productId) => {
      try {
        const token = global.token;
        if (!token) return { error: 'Not authenticated' };
        const res = await fetch(`${API_URL}/favorites/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          router.replace('/login');
          return { error: 'Not authenticated' };
        }
        return await res.json();
      } catch (e) {
        return { error: 'Network error' };
      }
    },
    check: async (productId) => {
      try {
        const token = global.token;
        if (!token) return { isFavorite: false };
        const res = await fetch(`${API_URL}/favorites/check/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return await res.json();
      } catch (e) {
        return { isFavorite: false };
      }
    }
  }
};

export { api };

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    if (result && result.error) {
      setError(result.error);
    } else if (result && result.token) {
      router.replace('/(tabs)');
    } else {
      setError('Unknown error occurred');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>MarketHub</Text>
        <Text style={styles.subtitle}>Welcome Back</Text>
        
        <View style={styles.form}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.linkHighlight}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#667eea',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
  },
  errorText: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#666',
    fontSize: 14,
  },
  linkHighlight: {
    color: '#667eea',
    fontWeight: '600',
  },
});
