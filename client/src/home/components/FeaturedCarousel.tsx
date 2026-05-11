import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ProductCard from '../../components/ProductCard';
import type { Product } from '../../data/products';

interface Props {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const VISIBLE = 4;

const FeaturedCarousel = ({ products, onAddToCart }: Props) => {
  const showCarousel = products.length > VISIBLE;
  const [startIdx, setStartIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [dir, setDir] = useState<'right' | 'left'>('right');

  const carouselPrev = () => { setDir('right'); setStartIdx(i => (i - 1 + products.length) % products.length); setAnimKey(k => k + 1); };
  const carouselNext = () => { setDir('left'); setStartIdx(i => (i + 1) % products.length); setAnimKey(k => k + 1); };

  const visibleProducts = showCarousel
    ? Array.from({ length: VISIBLE }, (_, i) => products[(startIdx + i) % products.length])
    : products;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" sx={{ mb: 1.5, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
          ספרים נבחרים
        </Typography>
        <Typography variant="body1" color="text.secondary">
          מבחר הספרים הפופולריים שלנו
        </Typography>
      </Box>

      <Box sx={{ position: 'relative' }}>
        {showCarousel && (
          <IconButton
            onClick={carouselPrev}
            sx={{
              position: 'absolute', right: { xs: -12, md: -28 }, top: '50%', transform: 'translateY(-50%)',
              zIndex: 1, bgcolor: 'white', boxShadow: 3,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}

        <Box
          key={animKey}
          sx={{
            '@keyframes slideFromRight': {
              from: { opacity: 0, transform: 'translateX(60px)' },
              to: { opacity: 1, transform: 'translateX(0)' },
            },
            '@keyframes slideFromLeft': {
              from: { opacity: 0, transform: 'translateX(-60px)' },
              to: { opacity: 1, transform: 'translateX(0)' },
            },
            animation: `${dir === 'right' ? 'slideFromRight' : 'slideFromLeft'} 0.5s ease`,
          }}
        >
          <Grid container spacing={3}>
            {visibleProducts.map((product, i) => (
              <Grid item xs={12} sm={6} md={3} key={`${product.id}-${(startIdx + i) % products.length}`}>
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {showCarousel && (
          <IconButton
            onClick={carouselNext}
            sx={{
              position: 'absolute', left: { xs: -12, md: -28 }, top: '50%', transform: 'translateY(-50%)',
              zIndex: 1, bgcolor: 'white', boxShadow: 3,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {showCarousel && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
          {products.map((_, i) => (
            <Box
              key={i}
              onClick={() => setStartIdx(i)}
              sx={{
                width: 8, height: 8, borderRadius: '50%', cursor: 'pointer',
                bgcolor: i === startIdx ? 'primary.main' : 'grey.300',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </Box>
      )}

      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Button
          variant="outlined"
          size="large"
          component={Link}
          to="/products"
          endIcon={<ArrowBackIcon />}
          sx={{ gap: 1, '& .MuiButton-endIcon': { margin: 0 } }}
        >
          לחנות
        </Button>
      </Box>
    </Container>
  );
};

export default FeaturedCarousel;
