import { Link } from 'react-router-dom';
import { Box, Container, Typography, Breadcrumbs, Divider } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const P = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2, mb: 1.5, textAlign: 'justify' }}>{children}</Typography>
);

const AccessibilityPage = () => (
  <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
    <Breadcrumbs separator={<NavigateBeforeIcon fontSize="small" />} sx={{ mb: 3, color: 'text.secondary', fontSize: '0.875rem' }}>
      <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>דף הבית</Link>
      <Typography fontSize="0.875rem" color="text.primary">הצהרת נגישות</Typography>
    </Breadcrumbs>
    <Typography variant="h3" fontWeight={800} color="primary.dark" sx={{ mb: 0.5, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>הצהרת נגישות</Typography>
    <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ mb: 4 }}>אתר "על אפיקי מים" – afikey-books.co.il</Typography>
    <Divider sx={{ mb: 4 }} />
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight={700} color="primary.dark" sx={{ mb: 1.5 }}>מחויבותנו לנגישות</Typography>
      <P>אנו ב"על אפיקי מים" מאמינים שכל אדם זכאי לגישה שווה למידע ולשירותים באינטרנט. אנו עושים מאמצים לוודא שהאתר שלנו נגיש לכלל המשתמשים, לרבות אנשים עם מוגבלויות, בהתאם לתקן הישראלי ת"י 5568 וההנחיות הבינלאומיות WCAG 2.1 ברמה AA.</P>
    </Box>
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight={700} color="primary.dark" sx={{ mb: 1.5 }}>פעולות נגישות שבוצעו באתר</Typography>
      {['האתר מותאם לקריאה בכיוון מימין לשמאל (RTL) בשפה העברית.','ניתן לנווט באתר באמצעות מקלדת בלבד.','קיימת תאימות לקוראי מסך (Screen Readers).','הטקסטים באתר כתובים בשפה ברורה ופשוטה.','תמונות מכילות טקסט חלופי (alt text) לתיאור תוכנן.','יחס הניגודיות בין טקסט לרקע עומד בדרישות המינימליות.','האתר מותאם לגדלי מסך שונים (רספונסיבי).','ניתן להגדיל טקסט עד 200% ללא איבוד תוכן או פונקציונליות.'].map((item, i) => (
        <Typography key={i} variant="body1" color="text.secondary" sx={{ lineHeight: 2, display: 'flex', gap: 1 }}>•&nbsp;{item}</Typography>
      ))}
    </Box>
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight={700} color="primary.dark" sx={{ mb: 1.5 }}>מגבלות ידועות</Typography>
      <P>אנו עובדים ברציפות לשפר את נגישות האתר. ייתכן שחלק מהתכנים הישנים טרם הותאמו במלואם. אם נתקלתם בבעיית נגישות, נשמח לדעת על כך.</P>
    </Box>
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight={700} color="primary.dark" sx={{ mb: 1.5 }}>צור קשר בנושא נגישות</Typography>
      <P>אם נתקלתם בקושי בשימוש באתר, או אם יש לכם הצעות לשיפור הנגישות, אנא פנו אלינו:</P>
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2 }}>אתר: afikey-books.co.il</Typography>
      <Typography variant="body2" color="text.disabled" sx={{ mt: 3 }}>הצהרת נגישות זו עודכנה לאחרונה בתאריך: מאי 2025</Typography>
    </Box>
  </Container>
);

export default AccessibilityPage;
