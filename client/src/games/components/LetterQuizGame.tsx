import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Button, LinearProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

type Question = { display: string; answer: string; options: string[]; hint: string };

const DEFAULT_QUESTIONS: Question[] = [
  { display: "שב_",   answer: "ת", options: ["ת","ס","כ","פ"], hint: "יום המנוחה" },
  { display: "ת_רה",  answer: "ו", options: ["א","ו","ב","מ"], hint: "ספר הקודש" },
  { display: "_פר",   answer: "ס", options: ["ס","ד","פ","כ"], hint: "קוראים ממנו" },
  { display: "מ_יח",  answer: "ש", options: ["ל","א","כ","ש"], hint: "יגאל אותנו" },
  { display: "ת_ילה", answer: "פ", options: ["פ","ו","י","ה"], hint: "הודאה ובקשה מהשם" },
  { display: "בר_ה",  answer: "כ", options: ["י","ו","כ","ה"], hint: "אומרים לפני כל מאכל" },
  { display: "מצ_ה",  answer: "ו", options: ["ו","א","י","ה"], hint: "מעשה טוב" },
  { display: "א_ר",   answer: "ו", options: ["ו","א","י","ה"], hint: "מאיר בחושך" },
];

const LetterQuizGame = () => {
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    axios.get<{ id: string; data: Question }[]>('/api/game-items/letter_quiz')
      .then(r => {
        if (r.data.length > 0) {
          setQuestions(r.data.map(item => item.data));
          setIndex(0); setSelected(null); setScore(0); setDone(false);
        }
      })
      .catch(() => {});
  }, []);

  const q = questions[index];
  const isCorrect = selected === q.answer;
  const parts = q.display.split("_");

  const choose = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= questions.length) { setDone(true); }
    else { setIndex((i) => i + 1); setSelected(null); }
  };

  const reset = () => { setIndex(0); setSelected(null); setScore(0); setDone(false); };

  if (done) {
    return (
      <Box sx={{ textAlign: "center", py: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>סיימת! 🎊</Typography>
        <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ mb: 1 }}>{score}/{questions.length}</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {score === questions.length ? "מושלם! צדקת בכל השאלות!" : score >= Math.ceil(questions.length * 0.87) ? "כל הכבוד! עשית עבודה טובה!" : "המשיכו לתרגל!"}
        </Typography>
        <Button variant="contained" onClick={reset}>שחק שוב</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">שאלה {index + 1} מתוך {questions.length}</Typography>
        <Typography variant="body2">ניקוד: <strong>{score}</strong></Typography>
      </Box>
      <LinearProgress variant="determinate" value={(index / questions.length) * 100} sx={{ mb: 3, borderRadius: 1, height: 6 }} />

      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{q.hint}</Typography>
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
          <Typography component="span" sx={{ fontSize: { xs: "2.5rem", md: "3rem" }, fontWeight: 800, color: "primary.dark" }}>
            {parts[0]}
          </Typography>
          <Box component="span" sx={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: { xs: 46, md: 56 }, height: { xs: 46, md: 56 }, borderRadius: 1.5, border: "3px solid", mx: 0.5,
            borderColor: selected ? (isCorrect ? "success.main" : "error.main") : "primary.main",
            bgcolor: selected ? (isCorrect ? "success.light" : "error.light") : "primary.light",
            fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: 800,
            color: selected ? (isCorrect ? "success.dark" : "error.dark") : "primary.dark",
          }}>
            {selected ?? "_"}
          </Box>
          <Typography component="span" sx={{ fontSize: { xs: "2.5rem", md: "3rem" }, fontWeight: 800, color: "primary.dark" }}>
            {parts[1]}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1.5, maxWidth: 360, mx: "auto", mb: 3 }}>
        {q.options.map((opt) => {
          const isAnswer = !!selected && opt === q.answer;
          const isWrong  = !!selected && opt === selected && !isCorrect;
          return (
            <Button key={opt} variant={isAnswer || isWrong ? "contained" : "outlined"}
              onClick={() => choose(opt)} color={isAnswer ? "success" : isWrong ? "error" : "primary"}
              sx={{ fontSize: "1.5rem", fontWeight: 700, height: 64, borderRadius: 2, pointerEvents: selected ? "none" : "auto" }}
            >
              {opt}
            </Button>
          );
        })}
      </Box>

      {selected && (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
            color={isCorrect ? "success.main" : "error.main"}>
            {isCorrect ? <><CheckCircleIcon /> נכון מאד!</> : <><CancelIcon /> לא נכון. האות החסרה היא "{q.answer}"</>}
          </Typography>
          <Button variant="contained" onClick={next}>{index + 1 < questions.length ? "שאלה הבאה" : "סיום"}</Button>
        </Box>
      )}
    </Box>
  );
};

export default LetterQuizGame;
