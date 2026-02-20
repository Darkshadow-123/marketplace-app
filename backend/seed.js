require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  {
    title: 'Wireless Bluetooth Headphones',
    price: 79.99,
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and crystal-clear sound quality.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: 'Electronics'
  },
  {
    title: 'Smart Fitness Watch',
    price: 149.99,
    description: 'Track your health metrics, receive notifications, and monitor your workouts with this sleek smart watch.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    category: 'Electronics'
  },
  {
    title: 'Vintage Leather Backpack',
    price: 89.99,
    description: 'Handcrafted genuine leather backpack with multiple compartments. Perfect for work or travel.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    category: 'Fashion'
  },
  {
    title: 'Organic Green Tea Set',
    price: 34.99,
    description: 'Premium organic green tea collection from Japan. Includes 5 different varieties in elegant packaging.',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400',
    category: 'Food & Beverages'
  },
  {
    title: 'Minimalist Desk Lamp',
    price: 59.99,
    description: 'Modern LED desk lamp with adjustable brightness and color temperature. USB charging port included.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    category: 'Home & Living'
  },
  {
    title: 'Professional Camera Strap',
    price: 45.99,
    description: 'Handmade camera strap with premium leather and metal hardware. Fits all DSLR cameras.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    category: 'Photography'
  },
  {
    title: 'Running Shoes Pro',
    price: 129.99,
    description: 'Lightweight running shoes with advanced cushioning technology. Designed for marathon runners.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    category: 'Sports'
  },
  {
    title: 'Artisan Coffee Beans',
    price: 24.99,
    description: 'Single-origin Arabica coffee beans from Ethiopia. Medium roast with fruity undertones.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    category: 'Food & Beverages'
  },
  {
    title: 'Yoga Mat Premium',
    price: 39.99,
    description: 'Extra thick eco-friendly yoga mat with non-slip surface. Includes carrying strap.',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    category: 'Sports'
  },
  {
    title: 'Wireless Charging Pad',
    price: 29.99,
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. LED indicator included.',
    image: 'https://images.unsplash.com/photo-1591290619762-c588e3b59910?w=400',
    category: 'Electronics'
  }
];

const users = [
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123'
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'password123'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marketplace');
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
    }
    console.log(`Created ${users.length} users`);

    await Product.insertMany(products);
    console.log(`Created ${products.length} products`);

    console.log('\n--- Test Credentials ---');
    console.log('User 1: john@example.com / password123');
    console.log('User 2: jane@example.com / password123');
    console.log('\nSeed completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
