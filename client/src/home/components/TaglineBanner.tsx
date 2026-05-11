import { Box, Container, Typography } from '@mui/material';

const TaglineBanner = () => (
  <Box sx={{ bgcolor: 'primary.main', py: { xs: 5, md: 7 }, textAlign: 'center' }}>
    <Container maxWidth="md">
      <Typography
        variant="h4"
        sx={{ color: 'white', mb: 2, fontWeight: 600, fontSize: { xs: '1.4rem', md: '2rem' } }}
      >
        לימוד תורה מתוך שמחה
      </Typography>
      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: 600, mx: 'auto', lineHeight: 1.9 }}>
        ספרי "על אפיקי מים" מיועדים לעורר אהבת תורה, לעמיק את הלמידה ולהנות בני כל הגילאים.
        כל ספר מעוצב בקפידה ומלא בתכנים איכותיים.
      </Typography>
    </Container>
  </Box>
);

export default TaglineBanner;
