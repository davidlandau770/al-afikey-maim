import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Typography, IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
}

const INTERVAL = 6000;

const TestimonialsCarousel = () => {
  const [items, setItems]       = useState<Testimonial[]>([]);
  const [current, setCurrent]   = useState(0);
  const [fading, setFading]     = useState(false);

  useEffect(() => {
    axios.get<Testimonial[]>('/api/testimonials').then(({ data }) => setItems(data)).catch(() => {});
  }, []);

  const go = useCallback((next: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(next);
      setFading(false);
    }, 300);
  }, []);

  const prev = () => go((current - 1 + items.length) % items.length);
  const next = () => go((current + 1) % items.length);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => go((current + 1) % items.length), INTERVAL);
    return () => clearInterval(t);
  }, [current, items.length, go]);

  if (items.length === 0) return null;

  const item = items[current];

  return (
    <Box sx={{ bgcolor: 'white', py: { xs: 6, md: 8 }, position: 'relative', overflow: 'hidden' }}>
      {/* decorative background quote mark */}
      <Typography sx={{
        position: 'absolute', top: { xs: 8, md: 16 }, right: { xs: 16, md: 40 },
        fontSize: { xs: '8rem', md: '12rem' }, lineHeight: 1,
        color: 'primary.main', opacity: 0.05, fontFamily: 'Georgia, serif',
        userSelect: 'none', pointerEvents: 'none',
      }}>
        "
      </Typography>

      <Container maxWidth="md">
        <Box sx={{
          transition: 'opacity .3s ease',
          opacity: fading ? 0 : 1,
          minHeight: { xs: 180, md: 160 },
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <Typography variant="h6" fontWeight={400} textAlign="center" color="text.primary"
            sx={{
              lineHeight: 1.9, mb: 3, maxWidth: 720,
              fontSize: { xs: '1rem', md: '1.15rem' },
              fontStyle: 'italic',
            }}>
            {item.quote.length > 280 ? item.quote.slice(0, 280).trimEnd() + ' . . .' : item.quote}
          </Typography>

          <Box sx={{ textAlign: 'center' }}>
            <Typography fontWeight={700} color="primary.dark">{item.name}</Typography>
            {item.role && (
              <Typography variant="body2" color="text.secondary">{item.role}</Typography>
            )}
          </Box>
        </Box>

        {/* Navigation */}
        {items.length > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 4 }}>
            <IconButton onClick={prev} size="small" sx={{ color: 'primary.main' }}>
              <NavigateBeforeIcon />
            </IconButton>

            {items.map((_, i) => (
              <Box key={i} onClick={() => go(i)} sx={{
                width: i === current ? 20 : 8, height: 8,
                borderRadius: 4, cursor: 'pointer',
                bgcolor: i === current ? 'primary.main' : 'primary.light',
                opacity: i === current ? 1 : 0.4,
                transition: 'all .3s',
              }} />
            ))}

            <IconButton onClick={next} size="small" sx={{ color: 'primary.main' }}>
              <NavigateNextIcon />
            </IconButton>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography
            component={Link}
            to="/testimonials"
            variant="body2"
            color="primary"
            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            לכל ההמלצות ←
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TestimonialsCarousel;
