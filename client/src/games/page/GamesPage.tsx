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
import NikudMatchGame from "../components/NikudMatchGame";

type GameDef = { label: string; emoji: string; desc: string; component: React.ComponentType };

const DIRECT_GAMES: GameDef[] = [
  { label: "משחק זיכרון",    emoji: "🃏", desc: "התאימו מילה לאמוג'י המתאים",          component: MemoryGame },
  { label: "מסדרים מילה",    emoji: "🔤", desc: "סדרו את האותיות ליצירת המילה הנכונה",  component: WordArrangeGame },
  { label: "איזו אות חסרה?", emoji: "❓", desc: "מלאו את האות החסרה במילה",             component: LetterQuizGame },
  { label: "תלייה",          emoji: "🪢", desc: "נחשו את המילה לפני שהאיש נתלה",       component: HangmanGame },
  { label: "חידון יהודי",    emoji: "🕍", desc: "ענו על שאלות בנושאי יהדות ומסורת",    component: JewishQuizGame },
];

const NIKUD_GAMES: GameDef[] = [
  { label: "צליל פותח", emoji: "אָ", desc: "התאימו אות עם ניקוד לתמונה המתאימה", component: NikudMatchGame },
];

type Screen =
  | { id: "main" }
  | { id: "nikud-category" }
  | { id: "game"; label: string; emoji: string; Component: React.ComponentType; backTo: "main" | "nikud-category" };

const GameCard = ({ label, emoji, desc, onClick }: { label: string; emoji: string; desc: string; onClick: () => void }) => (
  <Card variant="outlined" sx={{ borderRadius: 3, transition: "box-shadow .2s", "&:hover": { boxShadow: 3 } }}>
    <CardActionArea onClick={onClick} sx={{ p: 0 }}>
      <CardContent sx={{ textAlign: "center", py: 3 }}>
        <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>{emoji}</Typography>
        <Typography fontWeight={700} sx={{ mb: 0.5 }}>{label}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4, display: "block" }}>
          {desc}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

const GamesPage = () => {
  const [screen, setScreen] = useState<Screen>({ id: "main" });

  const goMain = () => setScreen({ id: "main" });
  const goNikud = () => setScreen({ id: "nikud-category" });

  const openGame = (g: GameDef, backTo: "main" | "nikud-category") =>
    setScreen({ id: "game", label: g.label, emoji: g.emoji, Component: g.component, backTo });

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
      <Breadcrumbs
        separator={<NavigateBeforeIcon fontSize="small" />}
        sx={{ mb: 3, color: "text.secondary", fontSize: "0.875rem" }}
      >
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>דף הבית</Link>
        {screen.id === "main" ? (
          <Typography fontSize="0.875rem" color="text.primary">משחקים</Typography>
        ) : (
          <Typography
            fontSize="0.875rem" color="inherit" sx={{ cursor: "pointer" }}
            onClick={goMain}
          >
            משחקים
          </Typography>
        )}
        {screen.id === "nikud-category" && (
          <Typography fontSize="0.875rem" color="text.primary">קמץ ופתח</Typography>
        )}
        {screen.id === "game" && screen.backTo === "nikud-category" && (
          <Typography
            fontSize="0.875rem" color="inherit" sx={{ cursor: "pointer" }}
            onClick={goNikud}
          >
            קמץ ופתח
          </Typography>
        )}
        {screen.id === "game" && (
          <Typography fontSize="0.875rem" color="text.primary">{screen.label}</Typography>
        )}
      </Breadcrumbs>

      <Typography variant="h3" fontWeight={800} color="primary.dark"
        sx={{ mb: 0.5, fontSize: { xs: "1.8rem", md: "2.4rem" } }}>
        משחקים
      </Typography>
      <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ mb: 4 }}>
        משחקים לימודיים מהנים ללימוד קריאה
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {screen.id === "main" && (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
          {DIRECT_GAMES.map((g, i) => (
            <GameCard key={i} label={g.label} emoji={g.emoji} desc={g.desc}
              onClick={() => openGame(g, "main")} />
          ))}
          <GameCard label="קמץ ופתח" emoji="אָ" desc="משחקים ללימוד ניקוד קמץ ופתח" onClick={goNikud} />
        </Box>
      )}

      {screen.id === "nikud-category" && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={goMain} variant="outlined" size="small"
              sx={{ gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}>
              חזרה למשחקים
            </Button>
            <Typography fontWeight={700} color="primary.dark">אָ קמץ ופתח</Typography>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
            {NIKUD_GAMES.map((g, i) => (
              <GameCard key={i} label={g.label} emoji={g.emoji} desc={g.desc}
                onClick={() => openGame(g, "nikud-category")} />
            ))}
          </Box>
        </>
      )}

      {screen.id === "game" && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Button startIcon={<ArrowBackIcon />}
              onClick={() => screen.backTo === "nikud-category" ? goNikud() : goMain()}
              variant="outlined" size="small"
              sx={{ gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}>
              {screen.backTo === "nikud-category" ? "חזרה לקמץ ופתח" : "חזרה למשחקים"}
            </Button>
            <Typography fontWeight={700} color="primary.dark">
              {screen.label}
            </Typography>
          </Box>
          <Box sx={{ p: { xs: 2, md: 3 }, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <screen.Component />
          </Box>
        </>
      )}
    </Container>
  );
};

export default GamesPage;