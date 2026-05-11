import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const HeroSection = () => (
  <Box
    sx={{
      background: 'linear-gradient(150deg, #E3F2F8 0%, #EEF7F4 45%, #F7F4EF 100%)',
      py: { xs: 8, md: 12 },
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center',
    }}
  >
    <Box sx={{ position: 'absolute', top: -80, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'rgba(27,107,138,0.09)', pointerEvents: 'none' }} />
    <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(200,144,58,0.09)', pointerEvents: 'none' }} />

    <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
      <Typography
        variant="h1"
        sx={{ fontSize: { xs: '2.6rem', md: '4.2rem' }, color: 'primary.dark', mb: 2, letterSpacing: 1 }}
      >
        על אפיקי מים
      </Typography>
      <Typography
        variant="h5"
        color="text.secondary"
        sx={{ mb: 1.5, fontWeight: 400, fontSize: { xs: '1.1rem', md: '1.4rem' } }}
      >
        ספרים מעוצבים לכל הגילאים
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: 500, mx: 'auto', fontStyle: 'italic' }}>
        "וְהָיָה כְּעֵץ שָׁתוּל עַל פַּלְגֵי מָיִם" – תהלים א, ג
      </Typography>
      <Button
        variant="contained"
        size="large"
        component={Link}
        to="/products"
        endIcon={<ArrowBackIcon />}
        sx={{ px: 5, py: 1.5, fontSize: '1.1rem', gap: 1, '& .MuiButton-endIcon': { margin: 0 } }}
      >
        לחנות
      </Button>
    </Container>

    <Box sx={{ position: 'absolute', bottom: -1, left: 0, right: 0 }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 60 }}>
        <path d="M0,20 C360,55 1080,0 1440,30 L1440,60 L0,60 Z" fill="#F7F4EF" />
      </svg>
    </Box>
  </Box>
);

export default HeroSection;
