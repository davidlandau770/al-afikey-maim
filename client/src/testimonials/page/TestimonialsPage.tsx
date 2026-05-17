import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Container, Typography, Breadcrumbs, Grid, Divider,
  Dialog, IconButton, Card, CardContent, useMediaQuery, useTheme,
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

const desktopNavBtn = {
  position: 'absolute' as const,
  top: '50%',
  transform: 'translateY(-50%)',
  bgcolor: 'rgba(0,0,0,0.45)',
  color: 'white',
  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
};

interface Testimonial { id: string; quote: string; name: string; role: string; }

const TestimonialsPage = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [quotes, setQuotes]     = useState<Testimonial[]>([]);
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    let active = true;
    axios.get<Testimonial[]>('/api/testimonials')
      .then(({ data }) => { if (active) setQuotes(data); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

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
      <Grid container spacing={{ xs: 1.5, md: 2 }} sx={{ mb: 6 }}>
        {images.map((src, i) => (
          <Grid item xs={6} sm={6} md={4} lg={3} key={i}>
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
        fullScreen={isMobile}
        disableScrollLock
        PaperProps={{
          sx: isMobile
            ? { bgcolor: '#111', display: 'flex', flexDirection: 'column' }
            : { bgcolor: 'transparent', boxShadow: 'none', overflow: 'visible', m: 3 },
        }}
      >
        {isMobile ? (
          /* Mobile: full-screen black background */
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Close */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
              <IconButton onClick={() => setLightbox(null)} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Image */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 1 }}>
              {lightbox !== null && (
                <Box
                  component="img"
                  src={images[lightbox]}
                  alt={`המלצה ${lightbox + 1}`}
                  sx={{ maxHeight: '78vh', maxWidth: '100%', borderRadius: 1, display: 'block' }}
                />
              )}
            </Box>

            {/* Bottom navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'rgba(0,0,0,0.6)' }}>
              <IconButton onClick={prev} sx={{ color: 'white' }}>
                <ArrowForwardIosIcon />
              </IconButton>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                {lightbox !== null ? `${lightbox + 1} / ${images.length}` : ''}
              </Typography>
              <IconButton onClick={next} sx={{ color: 'white' }}>
                <ArrowBackIosNewIcon />
              </IconButton>
            </Box>
          </Box>
        ) : (
          /* Desktop: floating image with outside buttons */
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
              sx={{ ...desktopNavBtn, position: 'absolute', top: -16, right: -16, transform: 'none' }}>
              <CloseIcon />
            </IconButton>
            <IconButton onClick={prev} sx={{ ...desktopNavBtn, right: -52 }}>
              <ArrowForwardIosIcon />
            </IconButton>
            <IconButton onClick={next} sx={{ ...desktopNavBtn, left: -52 }}>
              <ArrowBackIosNewIcon />
            </IconButton>
          </Box>
        )}
      </Dialog>

      {/* Written testimonials */}
      {quotes.length > 0 && (
        <>
          <Divider sx={{ mb: 5 }} />
          <Typography variant="h5" fontWeight={700} color="primary.dark" sx={{ mb: 3 }}>
            המלצות בכתב
          </Typography>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {quotes.map(t => (
              <Grid item xs={12} md={6} key={t.id}>
                <Card variant="outlined" sx={{ height: '100%', borderRadius: 3, borderColor: 'primary.light' }}>
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: '3rem', color: 'primary.main', lineHeight: 1, mb: 1, opacity: 0.3 }}>
                      "
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.85, flexGrow: 1, fontStyle: 'italic', mb: 2.5, textAlign: 'justify' }}>
                      {t.quote}
                    </Typography>
                    <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                      <Typography fontWeight={700} color="primary.dark">{t.name}</Typography>
                      {t.role && (
                        <Typography variant="body2" color="text.secondary">{t.role}</Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Divider sx={{ mb: 5 }} />

      {/* Video section */}
      <Typography variant="h5" fontWeight={700} color="primary.dark" sx={{ mb: 3 }}>
        המלצות וידאו
      </Typography>
      <Grid container spacing={{ xs: 3, md: 4 }}>
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
