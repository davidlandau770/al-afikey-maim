import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MethodTeaser = () => (
  <Box sx={{ bgcolor: 'background.default', py: { xs: 5, md: 8 }, borderTop: '1px solid', borderColor: 'divider' }}>
    <Container maxWidth="md" sx={{ textAlign: 'center' }}>
      <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={2}>
        השיטה שלנו
      </Typography>
      <Typography variant="h4" fontWeight={700} sx={{ mt: 1, mb: 2, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        שיטה פונטית–פונולוגית להקניית הקריאה והכתיבה
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2, mb: 4, maxWidth: 620, mx: 'auto' }}>
        תוכנית "אוצר מילים" פותחה לאחר 15 שנות ניסיון בשטח, ומיועדת לכיתות א' ומכינה במגזר הדתי–חרדי.
        השיטה משלבת מודעות פונולוגית, תומכי זיכרון רב-תחושתיים ותכנים ערכיים עשירים להקניית
        קריאה וכתיבה מדויקות ומובנות.
      </Typography>
      <Button
        variant="outlined"
        size="large"
        component={Link}
        to="/method"
        endIcon={<ArrowBackIcon />}
        sx={{ gap: 1, '& .MuiButton-endIcon': { margin: 0 } }}
      >
        קרא עוד על השיטה
      </Button>
    </Container>
  </Box>
);

export default MethodTeaser;
