import { Box, Typography, Paper, Button, Divider, CircularProgress } from '@mui/material';

interface CartItem {
  product: { id: string; name: string; price: number };
  quantity: number;
}

interface Props {
  items: CartItem[];
  totalPrice: number;
  shippingCost: number;
  isDelivery: boolean;
  loading: boolean;
  onSubmit: () => void;
}

const OrderSummary = ({ items, totalPrice, shippingCost, isDelivery, loading, onSubmit }: Props) => (
  <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 24 }}>
    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>סיכום הזמנה</Typography>

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
      {items.map(item => (
        <Box key={item.product.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" fontWeight={600}>{item.product.name}</Typography>
            <Typography variant="caption" color="text.secondary">כמות: {item.quantity}</Typography>
          </Box>
          <Typography variant="body2" fontWeight={600}>₪{item.product.price * item.quantity}</Typography>
        </Box>
      ))}
    </Box>

    <Divider sx={{ my: 2 }} />

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">סכום ביניים</Typography>
        <Typography variant="body2">₪{totalPrice}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">משלוח</Typography>
        <Typography variant="body2">{isDelivery ? `₪${shippingCost}` : 'ללא תשלום'}</Typography>
      </Box>
    </Box>

    <Divider sx={{ my: 2 }} />

    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
      <Typography variant="h6" fontWeight={700}>סה"כ לתשלום</Typography>
      <Typography variant="h6" fontWeight={700} color="primary">₪{totalPrice + shippingCost}</Typography>
    </Box>

    <Button
      fullWidth variant="contained" size="large"
      onClick={onSubmit} disabled={loading || items.length === 0}
      sx={{ gap: 1 }}
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : 'שלח הזמנה'}
    </Button>
  </Paper>
);

export default OrderSummary;
