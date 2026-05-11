import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Button, Chip, LinearProgress } from "@mui/material";

const DEFAULT_WORDS = [
  { word: "שבת", hint: "יום המנוחה הקדוש" },
  { word: "תורה", hint: "ספר הקודש שלנו" },
  { word: "ספר", hint: "קוראים ממנו" },
  { word: "משיח", hint: "יגאל אותנו בקרוב" },
  { word: "תפילה", hint: "הודאה ובקשה מהשם" },
  { word: "ברכה", hint: "אומרים לפני כל מאכל" },
  { word: "מצוה", hint: "מעשה טוב" },
  { word: "אור", hint: "מאיר בחושך" },
];

type WordEntry = { word: string; hint: string };
type PoolLetter = { id: number; char: string; used: boolean };

function scramble(word: string): PoolLetter[] {
  const letters = word.split("").map((char, id) => ({ id, char, used: false }));
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  if (letters.map((l) => l.char).join("") === word && letters.length > 1) {
    [letters[0], letters[1]] = [letters[1], letters[0]];
  }
  return letters;
}

const WordArrangeGame = () => {
  const [words, setWords] = useState<WordEntry[]>(DEFAULT_WORDS);
  const [index, setIndex] = useState(0);
  const [pool, setPool] = useState<PoolLetter[]>(() => scramble(DEFAULT_WORDS[0].word));
  const [answer, setAnswer] = useState<{ id: number; char: string }[]>([]);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    axios.get<{ id: string; data: WordEntry }[]>('/api/game-items/word_arrange')
      .then(r => {
        if (r.data.length > 0) {
          const loaded = r.data.map(item => item.data);
          setWords(loaded);
          setIndex(0);
          setPool(scramble(loaded[0].word));
          setAnswer([]); setStatus("idle"); setScore(0); setDone(false);
        }
      })
      .catch(() => {});
  }, []);

  const current = words[index];

  const selectLetter = (letterId: number) => {
    if (status !== "idle") return;
    const letter = pool.find((l) => l.id === letterId);
    if (!letter || letter.used) return;
    setPool((prev) => prev.map((l) => (l.id === letterId ? { ...l, used: true } : l)));
    setAnswer((prev) => [...prev, { id: letterId, char: letter.char }]);
  };

  const removeLetter = (letterId: number) => {
    if (status !== "idle") return;
    setAnswer((prev) => prev.filter((l) => l.id !== letterId));
    setPool((prev) => prev.map((l) => (l.id === letterId ? { ...l, used: false } : l)));
  };

  const check = () => {
    const formed = answer.map((l) => l.char).join("");
    if (formed === current.word) { setStatus("correct"); setScore((s) => s + 1); }
    else { setStatus("wrong"); }
  };

  const next = () => {
    if (index + 1 >= words.length) { setDone(true); }
    else {
      const nextIdx = index + 1;
      setIndex(nextIdx); setPool(scramble(words[nextIdx].word));
      setAnswer([]); setStatus("idle");
    }
  };

  const reset = (currentWords = words) => {
    setIndex(0); setPool(scramble(currentWords[0].word));
    setAnswer([]); setStatus("idle"); setScore(0); setDone(false);
  };

  if (done) {
    return (
      <Box sx={{ textAlign: "center", py: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>סיימת! 🎊</Typography>
        <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ mb: 1 }}>{score}/{words.length}</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {score === words.length ? "מושלם! ענית נכון על כל המילים!" : `ענית נכון על ${score} מילים`}
        </Typography>
        <Button variant="contained" onClick={() => reset()}>שחק שוב</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">מילה {index + 1} מתוך {words.length}</Typography>
        <Typography variant="body2">ניקוד: <strong>{score}</strong></Typography>
      </Box>
      <LinearProgress variant="determinate" value={(index / words.length) * 100} sx={{ mb: 3, borderRadius: 1, height: 6 }} />

      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 0.5 }}>{current.hint}</Typography>
        <Typography variant="body2" color="text.disabled">לחצו על האותיות לפי הסדר הנכון</Typography>
      </Box>

      <Box sx={{
        minHeight: 60, mb: 2.5, p: 1.5, borderRadius: 2, border: "2px dashed",
        borderColor: status === "correct" ? "success.main" : status === "wrong" ? "error.main" : "divider",
        bgcolor: status === "correct" ? "success.light" : status === "wrong" ? "error.light" : "background.default",
        display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", alignItems: "center",
      }}>
        {answer.length === 0 ? (
          <Typography variant="body2" color="text.disabled">לחצו על אותיות לבניית המילה</Typography>
        ) : (
          answer.map((l) => (
            <Chip key={l.id} label={l.char} onClick={() => removeLetter(l.id)}
              color={status === "correct" ? "success" : status === "wrong" ? "error" : "primary"}
              sx={{ fontSize: "1.2rem", fontWeight: 700, minWidth: 44 }}
            />
          ))
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", mb: 3 }}>
        {pool.map((l) => (
          <Chip key={l.id} label={l.char} onClick={() => selectLetter(l.id)}
            variant={l.used ? "outlined" : "filled"}
            sx={{ fontSize: "1.2rem", fontWeight: 700, minWidth: 44, opacity: l.used ? 0.3 : 1, cursor: l.used ? "default" : "pointer" }}
          />
        ))}
      </Box>

      {status === "idle" ? (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Button variant="contained" onClick={check} disabled={answer.length !== current.word.length}>בדוק</Button>
          <Button variant="outlined" onClick={() => { setPool(scramble(current.word)); setAnswer([]); }}>ערבב מחדש</Button>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }} color={status === "correct" ? "success.main" : "error.main"}>
            {status === "correct" ? `נכון! המילה היא "${current.word}" ✓` : `לא נכון. המילה הנכונה היא "${current.word}"`}
          </Typography>
          <Button variant="contained" onClick={next}>{index + 1 < words.length ? "המשך" : "סיום"}</Button>
        </Box>
      )}
    </Box>
  );
};

export default WordArrangeGame;
