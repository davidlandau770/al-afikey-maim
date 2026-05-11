import { useState } from 'react';
import { Box, Container, Typography, Divider, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const darkField = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.55)' },
    '&.Mui-focused fieldset': { borderColor: '#4A9BB5' },
    '&.Mui-error fieldset': { borderColor: '#ff6b6b !important' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.55)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#4A9BB5' },
  '& .MuiInputLabel-root.Mui-error': { color: '#ff6b6b' },
  '& .MuiFormHelperText-root.Mui-error': { color: '#ff9999' },
};

type FormErrors = { name: string; email: string; phone: string; message: string };
const emptyErrors: FormErrors = { name: '', email: '', phone: '', message: '' };

function validateForm(form: { name: string; email: string; phone: string; message: string }): FormErrors {
  const e = { ...emptyErrors };

  if (form.name.trim() && form.name.trim().length < 2)
    e.name = 'שם חייב להכיל לפחות 2 תווים';

  if (!form.email.trim())
    e.email = 'אימייל הוא שדה חובה';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    e.email = 'כתובת אימייל לא תקינה';

  if (form.phone.trim()) {
    const cleaned = form.phone.replace(/[\s\-()]/g, '');
    if (!/^0[0-9]{8,9}$/.test(cleaned))
      e.phone = 'מספר טלפון לא תקין (לדוגמה: 052-1234567)';
  }

  if (form.message.trim().length < 2)
    e.message = 'הודעה חייבת להכיל לפחות 2 תווים';

  return e;
}

const Footer = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>(emptyErrors);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const clearError = (field: keyof FormErrors) =>
    setErrors(prev => ({ ...prev, [field]: '' }));

  const handleSubmit = async () => {
    const e = validateForm(form);
    if (Object.values(e).some(v => v !== '')) { setErrors(e); return; }
    setLoading(true);
    setSubmitError('');
    try {
      await axios.post('/api/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', message: '' });
      setErrors(emptyErrors);
    } catch {
      setSubmitError('אירעה שגיאה. אנא נסו שנית.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="footer" sx={{ bgcolor: '#2C3E50', color: 'white', pt: 5, pb: 3, mt: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 5, mb: 4, alignItems: 'flex-start' }}>

          {/* Contact details */}
          <Box sx={{ minWidth: 190 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#4A9BB5', mb: 1.5 }}>
              על אפיקי מים
            </Typography>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'rgba(255,255,255,0.85)', mb: 1 }}>
              צרו קשר
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography
                component="a"
                href="tel:0527681172"
                variant="body2"
                sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}
              >
                📞 052-7681172
              </Typography>
              <Typography
                component="a"
                href="mailto:z0527681172@gmail.com"
                variant="body2"
                sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}
              >
                ✉️ z0527681172@gmail.com
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                📍 מושב תפרח, ת.ד. 44, ישראל
              </Typography>
            </Box>
          </Box>

          {/* Nav — centered in remaining space */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
              ניווט מהיר
            </Typography>
            {[
              { label: 'דף הבית', path: '/' },
              { label: 'חנות', path: '/products' },
              { label: 'על השיטה', path: '/method' },
              { label: 'אודות', path: '/about' },
              { label: 'סל קניות', path: '/cart' },
            ].map(link => (
              <Typography
                key={link.path}
                component={Link}
                to={link.path}
                variant="body2"
                display="block"
                sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5, '&:hover': { color: 'white' }, cursor: 'pointer' }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>

          {/* Contact form */}
          <Box sx={{ width: { xs: '100%', md: 420 } }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              שלחו לנו הודעה
            </Typography>
            {success ? (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                ההודעה נשלחה! נחזור אליכם בהקדם.
              </Alert>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    fullWidth size="small" label="שם (אופציונלי)"
                    value={form.name}
                    error={!!errors.name}
                    helperText={errors.name}
                    onChange={e => { setForm(p => ({ ...p, name: e.target.value })); clearError('name'); }}
                    sx={darkField}
                  />
                  <TextField
                    fullWidth size="small" label="אימייל *"
                    value={form.email}
                    error={!!errors.email}
                    helperText={errors.email}
                    onChange={e => { setForm(p => ({ ...p, email: e.target.value })); clearError('email'); }}
                    sx={darkField}
                  />
                </Box>
                <TextField
                  fullWidth size="small" label="טלפון (אופציונלי)"
                  value={form.phone}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  onChange={e => { setForm(p => ({ ...p, phone: e.target.value })); clearError('phone'); }}
                  sx={darkField}
                />
                <TextField
                  fullWidth size="small" multiline rows={3} label="הודעה *"
                  value={form.message}
                  error={!!errors.message}
                  helperText={errors.message}
                  onChange={e => { setForm(p => ({ ...p, message: e.target.value })); clearError('message'); }}
                  sx={darkField}
                />
                {submitError && <Alert severity="error" sx={{ py: 0 }}>{submitError}</Alert>}
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{ alignSelf: 'flex-start', bgcolor: '#4A9BB5', '&:hover': { bgcolor: '#3a8aa3' }, gap: 1 }}
                >
                  {loading ? <CircularProgress size={18} color="inherit" /> : 'שליחה'}
                </Button>
              </Box>
            )}
          </Box>

        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', mb: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              © {new Date().getFullYear()} על אפיקי מים – כל הזכויות שמורות
            </Typography>
            <Typography
              component={Link}
              to="/accessibility"
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: 'rgba(255,255,255,0.8)' } }}
            >
              הצהרת נגישות
            </Typography>
            <Typography
              component={Link}
              to="/privacy"
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: 'rgba(255,255,255,0.8)' } }}
            >
              מדיניות פרטיות
            </Typography>
          </Box>
          <Typography
            component="a"
            href="https://pituach.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
            sx={{ color: 'rgba(255,255,255,0.35)', '&:hover': { color: 'rgba(255,255,255,0.65)' }, textDecoration: 'none' }}
          >
            נבנה ע"י פיתוח 770
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
