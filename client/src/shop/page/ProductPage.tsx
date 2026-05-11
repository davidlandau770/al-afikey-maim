import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Chip, Grid,
  Divider, Snackbar, Alert, IconButton, Dialog,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductsContext';
import { CATEGORY_GRADIENTS } from '../../data/categoryGradients';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [zoomedImg, setZoomedImg] = useState<string | null>(null);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const imgRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (lightbox) {
      setTimeout(() => {
        imgRefs.current[activeImg]?.scrollIntoView({ behavior: 'instant', block: 'center' });
      }, 50);
    }
  }, [lightbox]);

  const openZoom = (img: string) => { setZoomedImg(img); setIsZoomedIn(false); };
  const closeZoom = () => { setZoomedImg(null); setIsZoomedIn(false); };

  const { products } = useProducts();
  const product = products.find(p => p.id === id);
  const outOfStock = product ? (product.soldOut || (product.stock != null && product.stock <= 0)) : false;
  const maxQty = product?.stock ?? Infinity;

  if (!product) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>המוצר לא נמצא</Typography>
        <Button variant="contained" onClick={() => navigate('/products')}>חזור לחנות</Button>
      </Container>
    );
  }

  const allImages = [
    ...(product.image ? [product.image] : []),
    ...(product.images ?? []),
  ];
  const currentImage = allImages[activeImg] ?? null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
      <Button startIcon={<ArrowForwardIcon />} onClick={() => navigate('/products')} sx={{ mb: 3, gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}>
        חזרה לחנות
      </Button>

      <Grid container spacing={5}>
        <Grid item xs={12} md={5} sx={{ order: { xs: 1, md: 2 } }}>
          {/* Main image */}
          <Box
            onClick={() => currentImage && setLightbox(true)}
            sx={{
              aspectRatio: '1 / 1',
              background: currentImage ? 'transparent' : (CATEGORY_GRADIENTS[product.category] ?? CATEGORY_GRADIENTS['לימוד']),
              backgroundImage: currentImage ? `url(${currentImage})` : undefined,
              backgroundSize: '82%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              cursor: currentImage ? 'zoom-in' : 'default',
              borderRadius: 3,
              border: '1.5px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              p: { xs: 6, md: 8 },
            }}
          >
            {!currentImage && (
              <Box sx={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)', borderRadius: 3 }} />
            )}
            {!currentImage && (
              <Typography
                variant="h4"
                sx={{ color: 'white', textAlign: 'center', fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.35)', zIndex: 1 }}
              >
                {product.name}
              </Typography>
            )}
            {allImages.length > 1 && (
              <>
                <IconButton
                  size="small"
                  onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + allImages.length) % allImages.length); }}
                  sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: 'white' } }}
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % allImages.length); }}
                  sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: 'white' } }}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5, flexWrap: 'wrap' }}>
              {allImages.map((img, i) => (
                <Box
                  key={i}
                  onClick={() => setActiveImg(i)}
                  sx={{
                    width: 52, height: 52, borderRadius: 1.5, flexShrink: 0, cursor: 'pointer',
                    backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center',
                    outline: '2.5px solid',
                    outlineColor: activeImg === i ? 'primary.main' : '#d0d0d0',
                    outlineOffset: '2px',
                    transition: 'outline-color 0.15s',
                    '&:hover': { outlineColor: 'primary.light' },
                  }}
                />
              ))}
            </Box>
          )}

          <Dialog
            open={lightbox}
            onClose={() => setLightbox(false)}
            fullScreen
            slotProps={{
              paper: {
                sx: { bgcolor: 'rgba(0,0,0,0.55)', boxShadow: 'none' },
              },
            }}
          >
            <IconButton
              onClick={() => setLightbox(false)}
              sx={{
                position: 'fixed', top: 16, left: 16, zIndex: 10,
                bgcolor: 'rgba(255,255,255,0.15)', color: 'white',
                backdropFilter: 'blur(4px)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box sx={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, py: 7, px: 2 }}>
              {allImages.map((img, i) => (
                <Box
                  key={i}
                  ref={(el: HTMLElement | null) => { imgRefs.current[i] = el; }}
                  component="img"
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  onClick={() => openZoom(img)}
                  sx={{ maxWidth: '92vw', maxHeight: '92vh', objectFit: 'contain', borderRadius: 1, display: 'block', cursor: 'zoom-in' }}
                />
              ))}
            </Box>
          </Dialog>

          {/* Single image zoom dialog */}
          <Dialog
            open={!!zoomedImg}
            onClose={closeZoom}
            maxWidth={false}
            slotProps={{
              backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.65)' } },
              paper: {
                sx: {
                  bgcolor: 'transparent', boxShadow: 'none', m: 1,
                  overflow: isZoomedIn ? 'auto' : 'visible',
                  maxWidth: isZoomedIn ? '95vw' : undefined,
                  maxHeight: isZoomedIn ? '95vh' : undefined,
                },
              },
            }}
          >
            <Box
              component="img"
              src={zoomedImg ?? ''}
              onClick={() => setIsZoomedIn(z => !z)}
              sx={{
                display: 'block',
                maxWidth: isZoomedIn ? 'none' : '88vw',
                maxHeight: isZoomedIn ? 'none' : '88vh',
                objectFit: 'contain',
                cursor: isZoomedIn ? 'zoom-out' : 'zoom-in',
                borderRadius: 1,
              }}
            />
          </Dialog>
        </Grid>

        <Grid item xs={12} md={7} sx={{ order: { xs: 2, md: 1 } }}>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 1, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
            {product.name}
          </Typography>
          <Chip label={product.category} color="primary" variant="outlined" sx={{ mb: 2 }} />
          {product.pages && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {product.pages} עמודים
            </Typography>
          )}
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, mb: 3 }}>
            {product.description}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 3 }}>
            {product.originalPrice && (
              <Typography variant="h5" sx={{ textDecoration: 'line-through', color: 'text.disabled', lineHeight: 1.2 }}>
                ₪{product.originalPrice}
              </Typography>
            )}
            <Typography variant="h3" color="primary" fontWeight={700}>
              ₪{product.price}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography fontWeight={600}>כמות:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', border: '1.5px solid', borderColor: 'divider', borderRadius: 2 }}>
              <IconButton size="small" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={outOfStock}>
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ px: 2.5, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>
                {quantity}
              </Typography>
              <IconButton size="small" onClick={() => setQuantity(q => Math.min(q + 1, maxQty))} disabled={outOfStock || quantity >= maxQty}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={outOfStock}
              sx={{ flex: 1, minWidth: 180, gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}
            >
              {outOfStock ? 'אזל מהמלאי' : 'הוסף לסל'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => { handleAddToCart(); navigate('/cart'); }}
              disabled={outOfStock}
              sx={{ flex: 1, minWidth: 180 }}
            >
              לסל ולתשלום
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)}>
          {quantity > 1 ? `${quantity} עותקים` : 'הספר'} נוסף לסל!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductPage;
