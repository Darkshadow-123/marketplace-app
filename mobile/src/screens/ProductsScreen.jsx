import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { api } from '../services/api';

const ProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchFavorites();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await api.products.getAll({ search, page, limit: 10 });
    setProducts(data.products || []);
    setLoading(false);
  };

  const fetchFavorites = async () => {
    const data = await api.favorites.getAll();
    setFavorites(data.map(f => f._id));
  };

  const handleSearch = () => {
    setPage(1);
    fetchProducts();
  };

  const toggleFavorite = async (productId) => {
    const isFav = favorites.includes(productId);
    if (isFav) {
      await api.favorites.remove(productId);
      setFavorites(favorites.filter(f => f !== productId));
    } else {
      await api.favorites.add(productId);
      setFavorites([...favorites, productId]);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item._id)}
      >
        <Text style={[styles.favoriteIcon, favorites.includes(item._id) && styles.favoriteActive]}>
          {favorites.includes(item._id) ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity 
          style={styles.favoritesHeaderButton}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Text style={styles.favoritesHeaderText}>Favorites</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#667eea" style={styles.loader} />
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  favoritesHeaderButton: {
    padding: 8,
  },
  favoritesHeaderText: {
    color: 'white',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  list: {
    padding: 16,
    paddingTop: 0,
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
  favoriteButton: {
    padding: 16,
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#ccc',
  },
  favoriteActive: {
    color: '#e74c3c',
  },
  loader: {
    marginTop: 40,
  },
});

export default ProductsScreen;
