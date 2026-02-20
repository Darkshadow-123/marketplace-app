import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ProductCard.css';

const ProductCard = ({ product, isFavorite, onToggleFavorite }) => {
  return (
    <motion.div 
      className="product-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)' }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-image-container">
          <img src={product.image} alt={product.title} className="product-image" />
          <motion.button
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite();
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          >
            {isFavorite ? '♥' : '♡'}
          </motion.button>
        </div>
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-title">{product.title}</h3>
          <p className="product-description">{product.description}</p>
          <div className="product-price">${product.price.toFixed(2)}</div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
