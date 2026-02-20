import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchFavorites();
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await api.products.getAll({ search, page, limit: 9 });
    setProducts(data.products || []);
    setPagination(data.pagination);
    setLoading(false);
  };

  const fetchFavorites = async () => {
    const data = await api.favorites.getAll();
    setFavorites(data.map(f => f._id));
  };

  const handleSearch = (e) => {
    e.preventDefault();
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

  return (
    <div className="products-page">
      <motion.div 
        className="search-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <motion.button 
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
        </form>
      </motion.div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <>
          <AnimatePresence>
            <motion.div 
              className="products-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isFavorite={favorites.includes(product._id)}
                  onToggleFavorite={() => toggleFavorite(product._id)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {pagination && pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>Page {pagination.page} of {pagination.pages}</span>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
