import { Link } from 'react-router-dom';
import { Box, Container, Typography, Breadcrumbs, Divider } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 1.5 }}>{title}</Typography>
    {children}
  </Box>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2, mb: 1 }}>{children}</Typography>
);

const PrivacyPage = () => (
  <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
    <Breadcrumbs separator={<NavigateBeforeIcon fontSize="small" />} sx={{ mb: 3, color: 'text.secondary', fontSize: '0.875rem' }}>
      <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>דף הבית</Link>
      <Typography fontSize="0.875rem" color="text.primary">מדיניות פרטיות</Typography>
    </Breadcrumbs>
    <Typography variant="h3" fontWeight={800} color="primary.dark" sx={{ mb: 0.5, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>מדיניות פרטיות</Typography>
    <Typography variant="body2" color="text.disabled" sx={{ mb: 4 }}>עודכן לאחרונה: ח"י אלול ה'תשפ"ה</Typography>
    <Divider sx={{ mb: 4 }} />
    <P>ברוכים הבאים לאתר <strong>afikey-books.co.il</strong> (על אפיקי מים). פרטיותכם חשובה לנו. במסמך זה נסביר בקצרה אילו נתונים נאספים, כיצד הם נשמרים ומהן זכויותיכם.</P>
    <Divider sx={{ my: 3 }} />
    <Section title="איסוף מידע אישי">
      <P>איננו אוספים מידע אישי באופן אוטומטי.</P>
      <P>במידה שאתם פונים אלינו באמצעות טפסים באתר או באמצעי קשר אחרים, המידע שתמסרו ישמש אך ורק לצורך מתן מענה לפנייתכם.</P>
    </Section>
    <Section title="עוגיות (Cookies) וכלים אנליטיים">
      <P>האתר עשוי להשתמש בעוגיות טכניות הנדרשות לפעולתו התקינה בלבד.</P>
      <P>אין באתר שימוש בעוגיות לצורך איסוף מידע אישי או זיהוי אישי.</P>
    </Section>
    <Section title="שימוש במידע">
      <P>כל מידע שתבחרו למסור לנו נשמר לצורך טיפול בפנייה בלבד.</P>
      <P>המידע לא מועבר לצדדים שלישיים, לא נשמר למטרות מסחריות ולא משמש לכל שימוש אחר.</P>
    </Section>
    <Section title="שמירת מידע והגנה עליו">
      <P>המידע נשמר בצורה מאובטחת.</P>
      <P>בכל עת תוכלו לפנות אלינו בבקשה לעיין במידע שסיפקתם או למחוק אותו.</P>
    </Section>
    <Section title="צדדים שלישיים">
      <P>איננו משתפים מידע עם צדדים שלישיים, אלא אם נדרש על פי חוק או בהסכמתכם המפורשת.</P>
      <P>האתר אינו עושה שימוש בפרסומות חיצוניות או בשירותי פרסום דומים.</P>
    </Section>
    <Section title="זכויות המשתמשים">
      <P>בכל עת עומדת לכם הזכות:</P>
      <Box component="ul" sx={{ m: 0, pr: 3, color: 'text.secondary' }}>
        {['לעיין במידע שנמסר לנו','לבקש לתקן או למחוק מידע','לפנות אלינו בשאלות בנושא פרטיות'].map(item => (
          <Typography key={item} component="li" variant="body1" sx={{ lineHeight: 2 }}>{item}</Typography>
        ))}
      </Box>
    </Section>
    <Section title="עדכונים במדיניות">
      <P>אנו עשויים לעדכן את מדיניות הפרטיות מעת לעת. בכל עדכון יתעדכן גם התאריך בראש מסמך זה.</P>
    </Section>
    <Divider sx={{ my: 3 }} />
    <Section title="פרטי קשר">
      <P>לשאלות או בקשות בנושא פרטיות ניתן לפנות אלינו:</P>
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2.4 }}>
        📧 z0527681172@gmail.com<br />
        📞 052-7681172<br />
        או באמצעות{' '}
        <Link to="/#contact" style={{ color: 'inherit' }}>טופס יצירת הקשר</Link>{' '}
        באתר.
      </Typography>
    </Section>
  </Container>
);

export default PrivacyPage;
