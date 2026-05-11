import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Typography, Chip } from "@mui/material";

type WordEntry = { word: string; hint: string };

const DEFAULT_WORDS: WordEntry[] = [
  { word: "שבת",      hint: "יום מנוחה שבועי" },
  { word: "תורה",     hint: "הספר הקדוש שלנו" },
  { word: "ירושלים",  hint: "עיר הקודש" },
  { word: "פסח",      hint: "חג החירות" },
  { word: "שלום",     hint: "ברכה יהודית" },
  { word: "מצוה",     hint: "מעשה טוב" },
  { word: "ברכה",     hint: "אומרים לפני אכילה" },
  { word: "תפילה",    hint: "פונים לאלוקים" },
  { word: "חנוכה",    hint: "חג האורות" },
  { word: "משיח",     hint: "יגאל אותנו" },
  { word: "סוכות",    hint: "חג בתשרי" },
  { word: "מנורה",    hint: "שבעה קנים" },
];

const HEBREW = "א ב ג ד ה ו ז ח ט י כ ל מ נ ס ע פ צ ק ר ש ת ך ם ן ף ץ".split(" ");
const MAX_WRONG = 6;

const pickWord = (list: WordEntry[]) => list[Math.floor(Math.random() * list.length)];

const HangmanSvg = ({ wrong }: { wrong: number }) => (
  <svg width="160" height="180" viewBox="0 0 160 180" style={{ display: "block", margin: "0 auto" }}>
    <line x1="20" y1="170" x2="140" y2="170" stroke="#555" strokeWidth="4" strokeLinecap="round" />
    <line x1="60" y1="170" x2="60"  y2="10"  stroke="#555" strokeWidth="4" strokeLinecap="round" />
    <line x1="60" y1="10"  x2="110" y2="10"  stroke="#555" strokeWidth="4" strokeLinecap="round" />
    <line x1="110" y1="10" x2="110" y2="35"  stroke="#555" strokeWidth="3" strokeLinecap="round" />
    {wrong >= 1 && <circle cx="110" cy="50" r="15" stroke="#1B6B8A" strokeWidth="3" fill="none" />}
    {wrong >= 2 && <line x1="110" y1="65"  x2="110" y2="115" stroke="#1B6B8A" strokeWidth="3" strokeLinecap="round" />}
    {wrong >= 3 && <line x1="110" y1="78"  x2="88"  y2="100" stroke="#1B6B8A" strokeWidth="3" strokeLinecap="round" />}
    {wrong >= 4 && <line x1="110" y1="78"  x2="132" y2="100" stroke="#1B6B8A" strokeWidth="3" strokeLinecap="round" />}
    {wrong >= 5 && <line x1="110" y1="115" x2="90"  y2="145" stroke="#1B6B8A" strokeWidth="3" strokeLinecap="round" />}
    {wrong >= 6 && <line x1="110" y1="115" x2="130" y2="145" stroke="#1B6B8A" strokeWidth="3" strokeLinecap="round" />}
  </svg>
);

const HangmanGame = () => {
  const [words, setWords] = useState<WordEntry[]>(DEFAULT_WORDS);
  const [entry, setEntry] = useState<WordEntry>(() => pickWord(DEFAULT_WORDS));
  const [guessed, setGuessed] = useState<Set<string>>(new Set());

  useEffect(() => {
    axios.get<{ id: string; data: WordEntry }[]>('/api/game-items/hangman')
      .then(r => {
        if (r.data.length > 0) {
          const loaded = r.data.map(item => item.data);
          setWords(loaded);
          setEntry(pickWord(loaded));
          setGuessed(new Set());
        }
      })
      .catch(() => {});
  }, []);

  const { word, hint } = entry;
  const wrongLetters = [...guessed].filter(l => !word.includes(l));
  const wrongCount = wrongLetters.length;
  const won  = [...word].every(l => guessed.has(l));
  const lost = wrongCount >= MAX_WRONG;
  const done = won || lost;

  const guess = (letter: string) => {
    if (done || guessed.has(letter)) return;
    setGuessed(prev => new Set([...prev, letter]));
  };

  const restart = (currentWords = words) => {
    setEntry(pickWord(currentWords));
    setGuessed(new Set());
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <HangmanSvg wrong={wrongCount} />

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
        רמז: <strong>{hint}</strong>
      </Typography>

      <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", mb: 3 }}>
        {[...word].map((letter, i) => (
          <Box key={i} sx={{ width: 40, height: 44, borderBottom: "3px solid", borderColor: "primary.main", display: "flex", alignItems: "flex-end", justifyContent: "center", pb: 0.5 }}>
            <Typography variant="h5" fontWeight={700} color={guessed.has(letter) ? "primary.dark" : "transparent"}>
              {letter}
            </Typography>
          </Box>
        ))}
      </Box>

      {done ? (
        <Box sx={{ mb: 3 }}>
          {won
            ? <Typography variant="h5" color="success.main" fontWeight={700}>כל הכבוד! ניצחת! 🎉</Typography>
            : <Typography variant="h5" color="error.main" fontWeight={700}>המילה הייתה: <span style={{ textDecoration: "underline" }}>{word}</span></Typography>
          }
        </Box>
      ) : (
        <Typography variant="body2" color={wrongCount >= 4 ? "error.main" : "text.secondary"} sx={{ mb: 2 }}>
          טעויות: {wrongCount} / {MAX_WRONG}
        </Typography>
      )}

      {wrongLetters.length > 0 && (
        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center", flexWrap: "wrap", mb: 2 }}>
          {wrongLetters.map(l => <Chip key={l} label={l} size="small" color="error" variant="outlined" sx={{ fontSize: "1rem" }} />)}
        </Box>
      )}

      <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", justifyContent: "center", mb: 3 }}>
        {HEBREW.map(letter => {
          const isGuessed = guessed.has(letter);
          const isWrong = isGuessed && !word.includes(letter);
          return (
            <Button key={letter} variant={isGuessed ? "contained" : "outlined"} size="small"
              onClick={() => guess(letter)} disabled={isGuessed || done}
              color={isWrong ? "error" : isGuessed ? "success" : "primary"}
              sx={{ minWidth: 36, px: 0.5, fontSize: "1rem", fontWeight: 600 }}
            >
              {letter}
            </Button>
          );
        })}
      </Box>

      <Button variant="outlined" onClick={() => restart()}>משחק חדש</Button>
    </Box>
  );
};

export default HangmanGame;
