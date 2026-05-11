import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from '@mui/material';

const SHIPPING_COST = 40;

export interface CheckoutFormData {
  name: string;
  phone: string;
  email: string;
  shipping: 'delivery' | 'pickup';
  city: string;
  street: string;
  zip: string;
  notes: string;
}

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormData, string>>;

interface Props {
  form: CheckoutFormData;
  errors: CheckoutFormErrors;
  update: (field: keyof CheckoutFormData, value: string) => void;
  serverError: string;
  isDelivery: boolean;
}

const CustomerForm = ({ form, errors, update, serverError, isDelivery }: Props) => (
  <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
    <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>פרטי הלקוח</Typography>

    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth label="שם מלא" required
          value={form.name} onChange={e => update('name', e.target.value)}
          error={!!errors.name} helperText={errors.name}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth label="טלפון" required
          value={form.phone} onChange={e => update('phone', e.target.value)}
          error={!!errors.phone} helperText={errors.phone}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth label="אימייל" required
          value={form.email} onChange={e => update('email', e.target.value)}
          error={!!errors.email} helperText={errors.email}
        />
      </Grid>
    </Grid>

    <Divider sx={{ my: 3 }} />

    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>אפשרות משלוח</Typography>
    <RadioGroup value={form.shipping} onChange={e => update('shipping', e.target.value)}>
      <FormControlLabel
        value="delivery" control={<Radio />}
        label={
          <Box>
            <Typography fontWeight={600}>משלוח לכל הארץ</Typography>
            <Typography variant="caption" color="text.secondary">עלות: ₪{SHIPPING_COST}</Typography>
          </Box>
        }
      />
      <FormControlLabel
        value="pickup" control={<Radio />}
        label={
          <Box>
            <Typography fontWeight={600}>איסוף עצמי</Typography>
            <Typography variant="caption" color="text.secondary">ללא תשלום נוסף</Typography>
          </Box>
        }
      />
    </RadioGroup>

    {isDelivery && (
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth label="עיר" required
            value={form.city} onChange={e => update('city', e.target.value)}
            error={!!errors.city} helperText={errors.city}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth label="רחוב ומספר בית" required
            value={form.street} onChange={e => update('street', e.target.value)}
            error={!!errors.street} helperText={errors.street}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth label="מיקוד"
            value={form.zip} onChange={e => update('zip', e.target.value)}
            inputProps={{ maxLength: 7 }}
          />
        </Grid>
      </Grid>
    )}

    <Divider sx={{ my: 3 }} />

    <TextField
      fullWidth multiline rows={3}
      label="הערות להזמנה (אופציונלי)"
      value={form.notes} onChange={e => update('notes', e.target.value)}
    />

    {serverError && <Alert severity="error" sx={{ mt: 2 }}>{serverError}</Alert>}
  </Paper>
);

export default CustomerForm;
