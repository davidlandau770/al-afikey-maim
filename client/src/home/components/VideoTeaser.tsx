import { useState } from 'react';
import { Box, Container, Typography, Dialog, IconButton, Grid } from '@mui/material';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import CloseIcon from '@mui/icons-material/Close';

const videos = [
  { title: 'פרופ׳ מרים גיליס', id: '9XrpSC68qwE' },
  { title: 'הרב פילו – ת"ת קול רינה', id: 'zKdPtOIxPDQ' },
];

const VideoTeaser = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <Box sx={{ bgcolor: 'grey.50', py: { xs: 5, md: 7 } }}>
      <Container maxWidth="md">
        <Typography variant="h5" fontWeight={700} color="primary.dark" textAlign="center" sx={{ mb: 1 }}>
          מה אומרים עלינו
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
          המלצות וידאו מאנשי חינוך ורוח
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {videos.map(v => (
            <Grid item xs={12} sm={6} key={v.id}>
              <Box
                onClick={() => setActiveId(v.id)}
                sx={{
                  position: 'relative',
                  borderRadius: 3,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: 3,
                  '&:hover .play-icon': { transform: 'scale(1.15)' },
                  '&:hover img': { filter: 'brightness(0.75)' },
                }}
              >
                <Box
                  component="img"
                  src={`https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`}
                  alt={v.title}
                  sx={{ width: '100%', display: 'block', transition: 'filter 0.25s' }}
                />
                <Box sx={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.25)',
                }}>
                  <PlayCircleFilledIcon
                    className="play-icon"
                    sx={{ fontSize: 64, color: 'white', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))', transition: 'transform 0.2s' }}
                  />
                  <Typography
                    variant="subtitle2" fontWeight={700}
                    sx={{ color: 'white', mt: 1.5, textShadow: '0 1px 4px rgba(0,0,0,0.7)', px: 2, textAlign: 'center' }}
                  >
                    {v.title}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog
        open={!!activeId}
        onClose={() => setActiveId(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { bgcolor: 'black', m: { xs: 1, sm: 3 } } }}
      >
        <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
          {activeId && (
            <Box
              component="iframe"
              src={`https://www.youtube.com/embed/${activeId}?autoplay=1`}
              title="המלצה"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            />
          )}
          <IconButton
            onClick={() => setActiveId(null)}
            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Dialog>
    </Box>
  );
};

export default VideoTeaser;
