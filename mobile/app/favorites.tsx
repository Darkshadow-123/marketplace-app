import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { api } from './login';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const fetchFavorites = async () => {
    setLoading(true);
    const data = await api.favorites.getAll();
    setFavorites(data);
    setLoading(false);
  };

  const removeFavorite = async (productId) => {
    await api.favorites.remove(productId);
    setFavorites(favorites.filter(f => f._id !== productId));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => router.push({ pathname: '/product', params: { product: JSON.stringify(item) } })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeFavorite(item._id)}
      >
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <View style={{ width: 50 }} />
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No favorites yet</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)')}>
            <Text style={styles.browseLink}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#667eea',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    width: 50,
  },
  list: {
    padding: 16,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  productCategory: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2ecc71',
    marginTop: 8,
  },
  removeButton: {
    padding: 16,
    justifyContent: 'center',
  },
  removeText: {
    fontSize: 20,
    color: '#e74c3c',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  browseLink: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
});
