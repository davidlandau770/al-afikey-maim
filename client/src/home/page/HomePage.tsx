import { useState } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductsContext';
import HeroSection from '../components/HeroSection';
import MethodTeaser from '../components/MethodTeaser';
import FeaturedCarousel from '../components/FeaturedCarousel';
import FaqSection from '../components/FaqSection';
import TaglineBanner from '../components/TaglineBanner';
import BannerSlot from '../components/BannerSlot';
import VideoTeaser from '../components/VideoTeaser';

const HomePage = () => {
  const { products } = useProducts();
  const featuredProducts = products.filter(p => p.featured);
  const { addToCart } = useCart();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [addedName, setAddedName] = useState('');

  const handleAddToCart = (product: (typeof products)[0]) => {
    addToCart(product);
    setAddedName(product.name);
    setSnackbarOpen(true);
  };

  return (
    <Box>
      <BannerSlot position={0} />
      <HeroSection />
      <BannerSlot position={1} />
      <MethodTeaser />
      <BannerSlot position={2} />
      <FeaturedCarousel products={featuredProducts} onAddToCart={handleAddToCart} />
      <BannerSlot position={3} />
      <FaqSection />
      <BannerSlot position={4} />
      <VideoTeaser />
      <TaglineBanner />
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)}>
          "{addedName}" נוסף לסל
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;
