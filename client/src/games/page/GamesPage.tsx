import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Breadcrumbs,
  Divider,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import MemoryGame from "../components/MemoryGame";
import WordArrangeGame from "../components/WordArrangeGame";
import LetterQuizGame from "../components/LetterQuizGame";
import HangmanGame from "../components/HangmanGame";
import JewishQuizGame from "../components/JewishQuizGame";

const GAMES = [
  { label: "משחק זיכרון", emoji: "🃏", desc: "התאימו מילה לאמוג המתאים" },
  { label: "מסדרים מילה", emoji: "🔤", desc: "סדרו את האותיות ליצירת המילה הנכונה" },
  { label: "איזו אות חסרה?", emoji: "❓", desc: "מלאו את האות החסרה במילה" },
  { label: "תלייה", emoji: "🪢", desc: "נחשו את המילה לפני שהאיש נתלה" },
  { label: "חידון יהודי", emoji: "🕍", desc: "ענו על שאלות בנושאי יהדות ומסורת" },
];

const GamesPage = () => {
  const [tab, setTab] = useState(0);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
      <Breadcrumbs
        separator={<NavigateBeforeIcon fontSize="small" />}
        sx={{ mb: 3, color: "text.secondary", fontSize: "0.875rem" }}
      >
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          דף הבית
        </Link>
        <Typography fontSize="0.875rem" color="text.primary">
          משחקים
        </Typography>
      </Breadcrumbs>

      <Typography
        variant="h3"
        fontWeight={800}
        color="primary.dark"
        sx={{ mb: 0.5, fontSize: { xs: "1.8rem", md: "2.4rem" } }}
      >
        משחקים
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        fontWeight={400}
        sx={{ mb: 4 }}
      >
        משחקים לימודיים מהנים ללימוד קריאה
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 1, borderBottom: 1, borderColor: "divider" }}
      >
        {GAMES.map((g, i) => (
          <Tab
            key={i}
            label={`${g.emoji} ${g.label}`}
            sx={{ fontWeight: 600 }}
          />
        ))}
      </Tabs>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, mt: 1.5 }}
      >
        {GAMES[tab].desc}
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        {tab === 0 && <MemoryGame />}
        {tab === 1 && <WordArrangeGame />}
        {tab === 2 && <LetterQuizGame />}
        {tab === 3 && <HangmanGame />}
        {tab === 4 && <JewishQuizGame />}
      </Paper>
    </Container>
  );
};

export default GamesPage;
