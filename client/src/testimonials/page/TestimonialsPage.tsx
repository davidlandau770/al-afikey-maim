import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Container, Typography, Breadcrumbs, Grid, Divider,
  Dialog, IconButton,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import img1 from '../../assets/recommendations/ar_ilan-scaled.jpg';
import img2 from '../../assets/recommendations/av_pealim-scaled.jpg';
import img3 from '../../assets/recommendations/beni-yosef-scaled.jpg';
import img4 from '../../assets/recommendations/ber_miriam-scaled.jpg';
import img5 from '../../assets/recommendations/daniel_sivan-scaled.jpg';
import img6 from '../../assets/recommendations/or_lezion-scaled.jpg';
import img7 from '../../assets/recommendations/rina_shwarz-scaled.jpg';
import img8 from '../../assets/recommendations/yosef_politi-scaled.jpg';

const images = [img1, img2, img3, img4, img5, img6, img7, img8];

const videos = [
  { title: 'המלצה מאת פרופ׳ מרים גיליס', id: '9XrpSC68qwE' },
  { title: 'המלצה מאת הרב פילו – ת"ת קול רינה', id: 'zKdPtOIxPDQ' },
];

const navBtn = {
  position: 'absolute' as const,
  top: '50%',
  transform: 'translateY(-50%)',
  bgcolor: 'rgba(0,0,0,0.45)',
  color: 'white',
  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
};

const TestimonialsPage = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setLightbox(i => (i! - 1 + images.length) % images.length);
  const next = () => setLightbox(i => (i! + 1) % images.length);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
      <Breadcrumbs separator={<NavigateBeforeIcon fontSize="small" />} sx={{ mb: 3, color: 'text.secondary', fontSize: '0.875rem' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>דף הבית</Link>
        <Typography fontSize="0.875rem" color="text.primary">המלצות</Typography>
      </Breadcrumbs>

      <Typography variant="h3" fontWeight={800} color="primary.dark" sx={{ mb: 0.5, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
        המלצות
      </Typography>
      <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ mb: 4 }}>
        מה אומרים עלינו
      </Typography>
      <Divider sx={{ mb: 5 }} />

      {/* Image grid */}
      <Grid container spacing={2} sx={{ mb: 6 }}>
        {images.map((src, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <Box
              component="img"
              src={src}
              alt={`המלצה ${i + 1}`}
              onClick={() => setLightbox(i)}
              sx={{
                width: '100%',
                borderRadius: 2,
                display: 'block',
                boxShadow: 2,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Lightbox */}
      <Dialog
        open={lightbox !== null}
        onClose={() => setLightbox(null)}
        maxWidth="lg"
        PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none', overflow: 'visible' } }}
      >
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {lightbox !== null && (
            <Box
              component="img"
              src={images[lightbox]}
              alt={`המלצה ${lightbox + 1}`}
              sx={{ maxHeight: '85vh', maxWidth: '90vw', borderRadius: 2, display: 'block' }}
            />
          )}

          <IconButton onClick={() => setLightbox(null)}
            sx={{ ...navBtn, position: 'absolute', top: -16, right: -16, transform: 'none' }}>
            <CloseIcon />
          </IconButton>

          <IconButton onClick={prev} sx={{ ...navBtn, right: -52 }}>
            <ArrowForwardIosIcon />
          </IconButton>
          <IconButton onClick={next} sx={{ ...navBtn, left: -52 }}>
            <ArrowBackIosNewIcon />
          </IconButton>
        </Box>
      </Dialog>

      <Divider sx={{ mb: 5 }} />

      {/* Video section */}
      <Typography variant="h5" fontWeight={700} color="primary.dark" sx={{ mb: 3 }}>
        המלצות וידאו
      </Typography>
      <Grid container spacing={4}>
        {videos.map((v) => (
          <Grid item xs={12} md={6} key={v.id}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>{v.title}</Typography>
            <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
              <Box
                component="iframe"
                src={`https://www.youtube.com/embed/${v.id}`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TestimonialsPage;
