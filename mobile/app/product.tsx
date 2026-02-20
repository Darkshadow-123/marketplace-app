import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { api } from './login';

export default function ProductDetailScreen() {
  const params = useLocalSearchParams();
  const product = params.product ? JSON.parse(params.product) : null;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (product) {
      checkFavorite();
    }
  }, [product]);

  const checkFavorite = async () => {
    const data = await api.favorites.check(product._id);
    setIsFavorite(data.isFavorite);
  };

  const toggleFavorite = async () => {
    if (isFavorite) {
      await api.favorites.remove(product._id);
    } else {
      await api.favorites.add(product._id);
    }
    setIsFavorite(!isFavorite);
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <TouchableOpacity 
          style={[styles.favoriteButton, isFavorite && styles.favoriteActive]}
          onPress={toggleFavorite}
        >
          <Text style={[styles.favoriteButtonText, isFavorite && styles.favoriteButtonTextActive]}>
            {isFavorite ? '♥ Remove from Favorites' : '♡ Add to Favorites'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    padding: 16,
  },
  backText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  category: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2ecc71',
    marginTop: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginTop: 16,
  },
  favoriteButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  favoriteActive: {
    backgroundColor: '#e74c3c',
  },
  favoriteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteButtonTextActive: {
    color: 'white',
  },
});
