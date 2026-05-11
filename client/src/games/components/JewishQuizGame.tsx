import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Typography, LinearProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

type Question = { q: string; options: string[]; answer: number };

const DEFAULT_QUESTIONS: Question[] = [
  { q: "כמה ימים נמשך חנוכה?",                options: ["שישה","שבעה","שמונה","תשעה"],          answer: 2 },
  { q: "מה מדליקים בחנוכה?",                  options: ["נרות שבת","חנוכייה","מנורה בבית הכנסת","אבוקה"], answer: 1 },
  { q: "מה שמו של הנהר שמשה נמצא בו?",        options: ["ירדן","יאור","כינרת","פישון"],           answer: 1 },
  { q: "כמה שבטים היו לעם ישראל?",             options: ["עשרה","אחד עשר","שנים עשר","שלושה עשר"], answer: 2 },
  { q: "באיזה יום נברא אדם הראשון?",           options: ["ראשון","רביעי","שישי","שביעי"],           answer: 2 },
  { q: "מה אוכלים בפסח במקום לחם?",            options: ["עוגה","מצה","פיתה","לפת"],                answer: 1 },
  { q: "כמה ספרים יש בתורה?",                  options: ["שלושה","ארבעה","חמישה","שישה"],           answer: 2 },
  { q: "מי קיבל את התורה על הר סיני?",         options: ["אברהם","יצחק","יעקב","משה"],              answer: 3 },
  { q: "כמה נרות יש בחנוכייה?",               options: ["שבעה","שמונה","תשעה","עשרה"],             answer: 2 },
  { q: "מה עושים בשבת?",                       options: ["הולכים לעבודה","עושים מלאכה","נחים ומתפללים","קונים בחנות"], answer: 2 },
  { q: "כמה ימים היה יונה בבטן הדג?",         options: ["יום אחד","שלושה ימים","שבעה ימים","ארבעים יום"], answer: 1 },
  { q: "מהו הפרי המסמל את ראש השנה?",         options: ["ענב","תפוח","רימון","תמר"],               answer: 1 },
];

const pickRandom = (list: Question[], count = 8) =>
  [...list].sort(() => Math.random() - 0.5).slice(0, Math.min(count, list.length));

const JewishQuizGame = () => {
  const [allQuestions, setAllQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [questions, setQuestions] = useState<Question[]>(() => pickRandom(DEFAULT_QUESTIONS));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    axios.get<{ id: string; data: Question }[]>('/api/game-items/jewish_quiz')
      .then(r => {
        if (r.data.length > 0) {
          const loaded = r.data.map(item => item.data);
          setAllQuestions(loaded);
          setQuestions(pickRandom(loaded));
          setIndex(0); setSelected(null); setScore(0); setFinished(false);
        }
      })
      .catch(() => {});
  }, []);

  const current = questions[index];
  const answered = selected !== null;

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
    if (i === current.answer) setScore(s => s + 1);
  };

  const next = () => {
    if (index + 1 >= questions.length) { setFinished(true); }
    else { setIndex(i => i + 1); setSelected(null); }
  };

  const restart = (src = allQuestions) => {
    setQuestions(pickRandom(src));
    setIndex(0); setSelected(null); setScore(0); setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Box sx={{ textAlign: "center", py: 3 }}>
        <Typography variant="h4" fontWeight={800} color="primary.dark" sx={{ mb: 1 }}>
          {score >= Math.ceil(questions.length * 0.87) ? "🏆" : score >= Math.ceil(questions.length * 0.62) ? "👍" : "💪"}
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>{score} / {questions.length} נכון</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {pct >= 87 ? "מדהים! אתה מומחה!" : pct >= 62 ? "יפה מאוד! כמעט מושלם" : "כדאי ללמוד עוד קצת 😊"}
        </Typography>
        <LinearProgress variant="determinate" value={pct} sx={{ height: 12, borderRadius: 6, mb: 3 }} />
        <Button variant="contained" onClick={() => restart()}>שחק שוב</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>שאלה {index + 1} / {questions.length}</Typography>
        <Typography variant="body2" color="primary.main" fontWeight={700}>ניקוד: {score}</Typography>
      </Box>
      <LinearProgress variant="determinate" value={(index / questions.length) * 100} sx={{ mb: 3, borderRadius: 4 }} />

      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, lineHeight: 1.6 }}>{current.q}</Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
        {current.options.map((opt, i) => {
          const isCorrect = i === current.answer;
          const isSelected = i === selected;
          let color: "inherit" | "success" | "error" = "inherit";
          if (answered && isCorrect) color = "success";
          if (answered && isSelected && !isCorrect) color = "error";
          return (
            <Button key={i} variant={answered && (isCorrect || isSelected) ? "contained" : "outlined"}
              color={color} onClick={() => handleSelect(i)}
              disabled={answered && !isSelected && !isCorrect}
              startIcon={answered && isCorrect ? <CheckCircleIcon /> : answered && isSelected ? <CancelIcon /> : undefined}
              sx={{ justifyContent: "flex-start", textAlign: "right", py: 1.2, fontWeight: 600, fontSize: "1rem", gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}
            >
              {opt}
            </Button>
          );
        })}
      </Box>

      {answered && (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color={selected === current.answer ? "success.main" : "error.main"} fontWeight={700} sx={{ mb: 2 }}>
            {selected === current.answer ? "✅ נכון מאוד!" : `❌ לא נכון. התשובה הנכונה: ${current.options[current.answer]}`}
          </Typography>
          <Button variant="contained" onClick={next}>
            {index + 1 < questions.length ? "שאלה הבאה" : "סיום"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default JewishQuizGame;
