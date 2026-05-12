import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Container, Typography, Breadcrumbs, Divider,
  Box, Card, CardActionArea, CardContent, Button,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MemoryGame from "../components/MemoryGame";
import WordArrangeGame from "../components/WordArrangeGame";
import LetterQuizGame from "../components/LetterQuizGame";
import HangmanGame from "../components/HangmanGame";
import JewishQuizGame from "../components/JewishQuizGame";

const GAMES = [
  { label: "משחק זיכרון",    emoji: "🃏", desc: "התאימו מילה לאמוג'י המתאים" },
  { label: "מסדרים מילה",    emoji: "🔤", desc: "סדרו את האותיות ליצירת המילה הנכונה" },
  { label: "איזו אות חסרה?", emoji: "❓", desc: "מלאו את האות החסרה במילה" },
  { label: "תלייה",          emoji: "🪢", desc: "נחשו את המילה לפני שהאיש נתלה" },
  { label: "חידון יהודי",    emoji: "🕍", desc: "ענו על שאלות בנושאי יהדות ומסורת" },
];

const PANELS = [MemoryGame, WordArrangeGame, LetterQuizGame, HangmanGame, JewishQuizGame];

const GamesPage = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const GameComponent = selected !== null ? PANELS[selected] : null;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
      <Breadcrumbs
        separator={<NavigateBeforeIcon fontSize="small" />}
        sx={{ mb: 3, color: "text.secondary", fontSize: "0.875rem" }}
      >
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>דף הבית</Link>
        <Typography fontSize="0.875rem" color="text.primary">משחקים</Typography>
      </Breadcrumbs>

      <Typography variant="h3" fontWeight={800} color="primary.dark"
        sx={{ mb: 0.5, fontSize: { xs: "1.8rem", md: "2.4rem" } }}>
        משחקים
      </Typography>
      <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ mb: 4 }}>
        משחקים לימודיים מהנים ללימוד קריאה
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {selected === null ? (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
          {GAMES.map((g, i) => (
            <Card key={i} variant="outlined" sx={{ borderRadius: 3, transition: "box-shadow .2s", "&:hover": { boxShadow: 3 } }}>
              <CardActionArea onClick={() => setSelected(i)} sx={{ p: 0 }}>
                <CardContent sx={{ textAlign: "center", py: 3 }}>
                  <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>{g.emoji}</Typography>
                  <Typography fontWeight={700} sx={{ mb: 0.5 }}>{g.label}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4, display: "block" }}>
                    {g.desc}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => setSelected(null)} variant="outlined" size="small">
              חזרה למשחקים
            </Button>
            <Typography fontWeight={700} color="primary.dark">
              {GAMES[selected].emoji} {GAMES[selected].label}
            </Typography>
          </Box>
          <Box sx={{ p: { xs: 2, md: 3 }, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            {GameComponent && <GameComponent />}
          </Box>
        </>
      )}
    </Container>
  );
};

export default GamesPage;