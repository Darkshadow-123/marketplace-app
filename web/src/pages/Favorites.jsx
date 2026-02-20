import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { motion } from 'framer-motion';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const data = await api.favorites.getAll();
    setFavorites(data);
    setLoading(false);
  };

  const removeFavorite = async (productId) => {
    await api.favorites.remove(productId);
    setFavorites(favorites.filter(f => f._id !== productId));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="favorites-page">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        My Favorites
      </motion.h1>

      {favorites.length === 0 ? (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>No favorites yet</p>
          <Link to="/" className="browse-link">Browse Products</Link>
        </motion.div>
      ) : (
        <motion.div 
          className="favorites-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {favorites.map((product) => (
            <motion.div 
              key={product._id}
              className="favorite-card"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Link to={`/product/${product._id}`}>
                <img src={product.image} alt={product.title} />
              </Link>
              <div className="favorite-info">
                <h3>{product.title}</h3>
                <span className="price">${product.price.toFixed(2)}</span>
              </div>
              <motion.button
                className="remove-btn"
                onClick={() => removeFavorite(product._id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Remove
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Favorites;
