import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid } from '@mui/material';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import CustomerForm from '../components/CustomerForm';
import OrderSummary from '../components/OrderSummary';
import type { CheckoutFormData, CheckoutFormErrors } from '../components/CustomerForm';

const SHIPPING_COST = 40;

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [form, setForm] = useState<CheckoutFormData>({
    name: '', phone: '', email: '', shipping: 'delivery', city: '', street: '', zip: '', notes: '',
  });
  const [errors, setErrors] = useState<CheckoutFormErrors>({});

  const isDelivery = form.shipping === 'delivery';
  const shippingCost = isDelivery ? SHIPPING_COST : 0;

  if (items.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>הסל ריק</Typography>
        <Button variant="contained" onClick={() => navigate('/products')}>לחנות</Button>
      </Container>
    );
  }

  const validate = (): boolean => {
    const errs: CheckoutFormErrors = {};
    if (!form.name.trim()) errs.name = 'שדה חובה';
    if (!form.phone.trim()) errs.phone = 'שדה חובה';
    if (!/^[0-9+\- ]{7,}$/.test(form.phone)) errs.phone = 'מספר טלפון לא תקין';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'כתובת דוא"ל לא תקינה';
    if (isDelivery) {
      if (!form.city.trim()) errs.city = 'שדה חובה';
      if (!form.street.trim()) errs.street = 'שדה חובה';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const update = (field: keyof CheckoutFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      const { data } = await axios.post(
        '/api/orders',
        {
          customer: {
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim().toLowerCase(),
            zip: form.zip.trim(),
          },
          shipping: {
            type: isDelivery ? 'משלוח' : 'איסוף עצמי',
            cost: shippingCost,
            address: isDelivery ? `${form.street.trim()}, ${form.city.trim()}` : '',
            city: isDelivery ? form.city.trim() : '',
            street: isDelivery ? form.street.trim() : '',
          },
          items: items.map(item => ({ name: item.product.name, price: item.product.price, quantity: item.quantity })),
          total: totalPrice + shippingCost,
          notes: (form.notes || '').trim(),
        },
        { timeout: 10000 },
      );
      clearCart();
      window.location.href = data.paymentUrl;
    } catch (err) {
      setServerError(
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? 'אירעה שגיאה בשליחת ההזמנה. אנא נסה שנית.')
          : 'אירעה שגיאה בשליחת ההזמנה. אנא נסה שנית.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
      <Typography variant="h3" fontWeight={700} sx={{ mb: 4 }}>השלמת הזמנה</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <CustomerForm form={form} errors={errors} update={update} serverError={serverError} isDelivery={isDelivery} />
        </Grid>
        <Grid item xs={12} md={5}>
          <OrderSummary
            items={items} totalPrice={totalPrice} shippingCost={shippingCost}
            isDelivery={isDelivery} loading={loading} onSubmit={handleSubmit}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
