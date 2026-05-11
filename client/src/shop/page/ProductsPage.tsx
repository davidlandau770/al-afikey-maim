import { useState } from 'react';
import { Box, Container, Typography, Grid, Snackbar, Alert } from '@mui/material';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductsContext';
import ProductCard from '../../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';

const ProductsPage = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('הכל');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [addedName, setAddedName] = useState('');

  const categories = ['הכל', ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = selectedCategory === 'הכל' ? products : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product: (typeof products)[0]) => {
    addToCart(product);
    setAddedName(product.name);
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 1.5, fontSize: { xs: '2rem', md: '2.8rem' } }}>
          חנות
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {products.length} ספרים – בחרו את שלכם
        </Typography>
        <CategoryFilter categories={categories} selected={selectedCategory} onChange={setSelectedCategory} />
      </Box>

      <Grid container spacing={3}>
        {filtered.map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} onAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)}>
          "{addedName}" נוסף לסל
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductsPage;
