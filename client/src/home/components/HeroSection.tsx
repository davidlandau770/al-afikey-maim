import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import heroImg from '../../assets/design/תמונת-רקע.jpg';

const HeroSection = () => (
  <Box
    sx={{
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    {/* Full background photo — shown in its entirety */}
    <Box
      component="img"
      src={heroImg}
      alt=""
      aria-hidden="true"
      sx={{
        width: '100%',
        display: 'block',
      }}
    />

    {/* Layered overlay: bottom fade + extra brightening on the right (boy's side) */}
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        background: [
          'linear-gradient(to left,  rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0) 100%)',
          'linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.45) 60%, rgba(255,255,255,0.90) 100%)',
        ].join(', '),
        pointerEvents: 'none',
      }}
    />

    {/* Text centred over the image */}
    <Container
      maxWidth="md"
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: { xs: 2, md: 4 },
      }}
    >
      <Typography
        variant="h1"
        sx={{ fontSize: { xs: '2.6rem', md: '4.2rem' }, color: 'primary.dark', mb: 2, letterSpacing: 1, lineHeight: 1.2 }}
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
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 5, maxWidth: 500, mx: 'auto', fontStyle: 'italic' }}
      >
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
  </Box>
);

export default HeroSection;
