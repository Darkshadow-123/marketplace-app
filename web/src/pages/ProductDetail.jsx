import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { motion } from 'framer-motion';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchProduct();
    checkFavorite();
  }, [id]);

  const fetchProduct = async () => {
    const data = await api.products.getOne(id);
    setProduct(data);
    setLoading(false);
  };

  const checkFavorite = async () => {
    const data = await api.favorites.check(id);
    setIsFavorite(data.isFavorite);
  };

  const toggleFavorite = async () => {
    if (isFavorite) {
      await api.favorites.remove(id);
    } else {
      await api.favorites.add(id);
    }
    setIsFavorite(!isFavorite);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product || product.error) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail">
      <motion.button 
        className="back-btn"
        onClick={() => navigate(-1)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        ← Back
      </motion.button>

      <div className="detail-content">
        <motion.div 
          className="detail-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src={product.image} alt={product.title} />
        </motion.div>

        <motion.div 
          className="detail-info"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="detail-category">{product.category}</span>
          <h1>{product.title}</h1>
          <div className="detail-price">${product.price.toFixed(2)}</div>
          <p className="detail-description">{product.description}</p>
          
          <motion.button
            className={`add-favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={toggleFavorite}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isFavorite ? '♥ Remove from Favorites' : '♡ Add to Favorites'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
