import { Link } from 'react-router-dom';
import { Box, Container, Typography, Breadcrumbs, Divider } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const P = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2, mb: 1.5 }}>{children}</Typography>
);

const AboutPage = () => (
  <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
    <Breadcrumbs separator={<NavigateBeforeIcon fontSize="small" />} sx={{ mb: 3, color: 'text.secondary', fontSize: '0.875rem' }}>
      <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>דף הבית</Link>
      <Typography fontSize="0.875rem" color="text.primary">אודות</Typography>
    </Breadcrumbs>

    <Typography variant="h3" fontWeight={800} color="primary.dark" sx={{ mb: 0.5, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>אודות</Typography>
    <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ mb: 4 }}>זהבה אוזן – מפתחת התוכנית</Typography>
    <Divider sx={{ mb: 4 }} />

    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight={700} color="primary.dark" sx={{ mb: 1.5 }}>מי אני</Typography>
      <P>שמי זהבה אוזן, אמא למשפחה ברוכת ילדים ומורה בעלת ניסיון של למעלה מ-15 שנה בהוראת הקריאה והכתיבה לכיתות א' ומכינה במגזר הדתי–חרדי.</P>
      <P>לאורך שנות עבודתי בשטח פיתחתי שיטת לימוד ייחודית המשלבת גישה פונטית–פונולוגית עם תכנים ערכיים עשירים, המותאמים לעולמו הרוחני של התלמיד היהודי. התוכנית נולדה מתוך הצורך האמיתי שנתקלתי בו בכיתה: ילדים שמתקשים לקרוא, לא בגלל חוסר יכולת, אלא בגלל שיטת הוראה שאינה מתאימה להם.</P>
    </Box>

    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight={700} color="primary.dark" sx={{ mb: 1.5 }}>היסטוריית התוכנית</Typography>
      <P>התוכנית החלה את דרכה בשמות "אפיקי קריאה", "אפיקי צלילים" ו"עם אותיות מאירות", ועבדה במשך כ-15 שנה במוסדות חינוך שונים ברחבי הארץ. היא זכתה להמלצות חמות מצד מפקחים בכירים במשרד החינוך ומחנכים ומחנכות שראו בשטח את פירות השיטה.</P>
      <P>לאחר שנות ניסיון וחשיבה, שודרגה התוכנית ויצאה במהדורה חדשה ומשופרת תחת השם "אוצר מילים", ממוקדת יותר במגזר הדתי–חרדי, מלאה בתוכן רוחני עשיר ומוגשת בעיצוב מודרני ונגיש לכל גיל.</P>
      <P>מורים ומחנכים שעבדו עם התוכנית מדווחים על שיפור ניכר בהישגי התלמידים, סגירת כיתות סיוע בקריאה ועלייה בהנאת הילדים מהלמידה – ומשם נולד הביטחון לצאת לדרך חדשה עם "על אפיקי מים".</P>
    </Box>

    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight={700} color="primary.dark" sx={{ mb: 1.5 }}>החזון</Typography>
      <P>חזוני הוא שכל ילד יוכל ללמוד לקרוא ולכתוב מתוך שמחה, ביטחון ואהבת תורה. ספרי "על אפיקי מים" נועדו לגשר בין הצורך הפדגוגי לבין הזהות הרוחנית, ולאפשר לכל ילד – גם מתקשה, גם מתקדם – לממש את הפוטנציאל שלו.</P>
      <P>"וְהָיָה כְּעֵץ שָׁתוּל עַל פַּלְגֵי מָיִם" – כמו עץ שיונק ממים חיים, כך גם הלמידה צריכה להיות שורשית, חיה ופורחת.</P>
    </Box>
  </Container>
);

export default AboutPage;
