import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper, IconButton, Divider, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useCart } from '../../context/CartContext';
import { CATEGORY_GRADIENTS } from '../../data/categoryGradients';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <ShoppingCartOutlinedIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>הסל שלך ריק</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          הוסף חוברות לסל כדי להמשיך לתשלום
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/products')}>לחנות</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
      <Typography variant="h3" fontWeight={700} sx={{ mb: 4, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
        סל הקניות שלך
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {items.map(item => (
            <Paper
              key={item.product.id}
              elevation={0}
              sx={{ p: 2.5, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', gap: 2.5, alignItems: 'center' }}
            >
              <Box
                sx={{
                  width: 80, height: 80, minWidth: 80,
                  background: CATEGORY_GRADIENTS[item.product.category] ?? CATEGORY_GRADIENTS['לימוד'],
                  borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Typography variant="caption" sx={{ color: 'white', textAlign: 'center', fontSize: '0.65rem', fontWeight: 700, px: 0.5, lineHeight: 1.3 }}>
                  {item.product.name.slice(0, 22)}
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>{item.product.name}</Typography>
                <Typography variant="body2" color="text.secondary">₪{item.product.price} ליחידה</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', border: '1.5px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                <IconButton size="small" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ px: 2, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</Typography>
                <IconButton size="small" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              <Typography variant="subtitle1" fontWeight={700} color="primary" sx={{ minWidth: 65, textAlign: 'center' }}>
                ₪{item.product.price * item.quantity}
              </Typography>

              <IconButton onClick={() => removeFromCart(item.product.id)} color="error" size="small">
                <DeleteOutlineIcon />
              </IconButton>
            </Paper>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, position: 'sticky', top: 80 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>סיכום הזמנה</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography color="text.secondary">סכום ביניים</Typography>
              <Typography fontWeight={600}>₪{totalPrice}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">משלוח</Typography>
              <Typography variant="body2" color="text.secondary">ייקבע בהמשך</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={700}>סה"כ (ללא משלוח)</Typography>
              <Typography variant="h6" fontWeight={700} color="primary">₪{totalPrice}</Typography>
            </Box>
            <Button variant="contained" fullWidth size="large" onClick={() => navigate('/checkout')} sx={{ mb: 1.5, py: 1.5 }}>
              המשך לתשלום
            </Button>
            <Button variant="text" fullWidth onClick={() => navigate('/products')}>המשך בקנייה</Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
