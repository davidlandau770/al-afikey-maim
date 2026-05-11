import { Link } from 'react-router-dom';
import { Card, CardContent, CardActions, Button, Typography, Box, Chip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import type { Product } from '../data/products';
import { CATEGORY_GRADIENTS } from '../data/categoryGradients';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const isOutOfStock = (p: typeof import('../data/products').products[0]) =>
  p.soldOut || (p.stock != null && p.stock <= 0);

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const gradient = CATEGORY_GRADIENTS[product.category] ?? CATEGORY_GRADIENTS['לימוד'];
  const outOfStock = isOutOfStock(product);

  return (
    <Card
      component={Link}
      to={`/product/${product.id}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
      }}
    >
      <Box
        sx={{
          height: 200,
          background: product.image ? 'transparent' : gradient,
          backgroundImage: product.image ? `url(${product.image})` : undefined,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          p: 2,
        }}
      >
        <Chip
          label={product.category}
          size="small"
          sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'rgba(255,255,255,0.92)', fontWeight: 600, fontSize: '0.7rem' }}
        />
        {outOfStock && (
          <Chip
            label="אזל מהמלאי"
            size="small"
            sx={{ position: 'absolute', top: 10, left: 10, bgcolor: 'rgba(0,0,0,0.7)', color: 'white', fontWeight: 700, fontSize: '0.7rem' }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {product.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          {product.originalPrice && (
            <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.disabled', display: 'block', lineHeight: 1.2 }}>
              ₪{product.originalPrice}
            </Typography>
          )}
          <Typography variant="h5" color="primary" fontWeight={700}>
            ₪{product.price}
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<ShoppingCartIcon />}
          onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
          disabled={outOfStock}
          sx={{ gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}
        >
          {outOfStock ? 'אזל' : 'הוסף'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
