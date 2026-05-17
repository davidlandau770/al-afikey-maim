import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, LinearProgress } from '@mui/material';

interface Question {
  word: string;
  pair: 'b' | 'k' | 'p';
  hasDagesh: boolean;
}

interface DbItem {
  id: string;
  data: { word: string; pair: 'b' | 'k' | 'p'; hasDagesh: boolean };
}

const ALL_QUESTIONS: Question[] = [
  { word: 'בּית',   pair: 'b', hasDagesh: true  },
  { word: 'בּוקר',  pair: 'b', hasDagesh: true  },
  { word: 'בּנה',   pair: 'b', hasDagesh: true  },
  { word: 'בּגד',   pair: 'b', hasDagesh: true  },
  { word: 'אָב',    pair: 'b', hasDagesh: false },
  { word: 'טוֹב',   pair: 'b', hasDagesh: false },
  { word: 'כָּתַב', pair: 'b', hasDagesh: false },
  { word: 'חָבֵר',  pair: 'b', hasDagesh: false },
  { word: 'כּלב',   pair: 'k', hasDagesh: true  },
  { word: 'כּוס',   pair: 'k', hasDagesh: true  },
  { word: 'כּובע',  pair: 'k', hasDagesh: true  },
  { word: 'כּיסא',  pair: 'k', hasDagesh: true  },
  { word: 'מֶלֶךְ', pair: 'k', hasDagesh: false },
  { word: 'חָכָם',  pair: 'k', hasDagesh: false },
  { word: 'יָכוֹל', pair: 'k', hasDagesh: false },
  { word: 'בָּכָה', pair: 'k', hasDagesh: false },
  { word: 'פּרח',   pair: 'p', hasDagesh: true  },
  { word: 'פּיל',   pair: 'p', hasDagesh: true  },
  { word: 'פּה',    pair: 'p', hasDagesh: true  },
  { word: 'פּרי',   pair: 'p', hasDagesh: true  },
  { word: 'סֵפֶר',  pair: 'p', hasDagesh: false },
  { word: 'כַּף',   pair: 'p', hasDagesh: false },
  { word: 'אַף',    pair: 'p', hasDagesh: false },
  { word: 'יָפֶה',  pair: 'p', hasDagesh: false },
];

const PAIRS = {
  b: { dagesh: 'בּ', plain: 'ב' },
  k: { dagesh: 'כּ', plain: 'כ' },
  p: { dagesh: 'פּ', plain: 'פ' },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions(pool: Question[]): Question[] {
  const result: Question[] = [];
  for (const pair of ['b', 'k', 'p'] as const) {
    const withDagesh    = pool.filter(q => q.pair === pair && q.hasDagesh);
    const withoutDagesh = pool.filter(q => q.pair === pair && !q.hasDagesh);
    result.push(...shuffle(withDagesh).slice(0, 2), ...shuffle(withoutDagesh).slice(0, 2));
  }
  return shuffle(result);
}

const CONFETTI_COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6BFF', '#FFB347', '#A78BFA', '#34D399'];

const Confetti = () => {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random() * 1.8,
    duration: 1.8 + Math.random() * 1.5,
    size: 6 + Math.random() * 9,
    isCircle: Math.random() > 0.5,
  }));
  return (
    <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {pieces.map(p => (
        <Box key={p.id} sx={{
          position: 'absolute', top: -20, left: `${p.left}%`,
          width: p.size, height: p.size, bgcolor: p.color,
          borderRadius: p.isCircle ? '50%' : 2,
          animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
          '@keyframes confettiFall': {
            '0%': { top: '-2%', opacity: 1 },
            '100%': { top: '110%', opacity: 0 },
          },
        }} />
      ))}
    </Box>
  );
};

type Feedback = 'correct' | 'wrong' | null;

const DageshGame = () => {
  const [pool,      setPool]      = useState<Question[]>(ALL_QUESTIONS);
  const [questions, setQuestions] = useState<Question[]>(() => pickQuestions(ALL_QUESTIONS));
  const [current,   setCurrent]   = useState(0);
  const [score,     setScore]     = useState(0);
  const [feedback,  setFeedback]  = useState<Feedback>(null);
  const [chosen,    setChosen]    = useState<boolean | null>(null);
  const [answers,   setAnswers]   = useState<boolean[]>([]);
  const [done,      setDone]      = useState(false);
  const [confetti,  setConfetti]  = useState(false);

  useEffect(() => {
    axios.get<DbItem[]>('/api/game-items/dagesh')
      .then(({ data }) => {
        if (data.length > 0) {
          const qs = data.map(item => item.data);
          setPool(qs);
          setQuestions(pickQuestions(qs));
        }
      })
      .catch(() => {});
  }, []);

  const total = questions.length;
  const q     = questions[current];
  const pair  = q ? PAIRS[q.pair] : PAIRS.b;

  const handleAnswer = (selectedDagesh: boolean) => {
    if (feedback !== null || !q) return;
    const isCorrect  = selectedDagesh === q.hasDagesh;
    const finalScore = isCorrect ? score + 1 : score;
    setChosen(selectedDagesh);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setAnswers(prev => [...prev, isCorrect]);
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      setFeedback(null);
      setChosen(null);
      if (current + 1 >= total) {
        setDone(true);
        if (finalScore >= Math.ceil(total * 0.75)) {
          setConfetti(true);
          setTimeout(() => setConfetti(false), 3800);
        }
      } else {
        setCurrent(c => c + 1);
      }
    }, 900);
  };

  const restart = () => {
    setQuestions(pickQuestions(pool));
    setCurrent(0); setScore(0); setFeedback(null);
    setChosen(null); setAnswers([]); setDone(false); setConfetti(false);
  };

  if (done) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        {confetti && <Confetti />}
        <Typography sx={{ fontSize: '3rem', mb: 1 }}>
          {score === total ? '🌟' : score >= Math.ceil(total * 0.75) ? '🎉' : score >= Math.ceil(total * 0.58) ? '👍' : '💪'}
        </Typography>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
          {score} / {total} נכון
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {score === total ? 'מושלם לחלוטין!' : score >= Math.ceil(total * 0.75) ? 'כל הכבוד!' : score >= Math.ceil(total * 0.58) ? 'טוב מאוד, עוד קצת!' : 'תנסה שוב, אתה יכול!'}
        </Typography>
        <Button variant="contained" size="large" onClick={restart}>שחק שוב</Button>
      </Box>
    );
  }

  if (!q) return null;

  const btnSx = (isDagesh: boolean) => {
    const isChosen  = chosen === isDagesh;
    const isCorrect = isDagesh === q.hasDagesh;
    const showGreen = feedback !== null && (isChosen && feedback === 'correct' || (feedback === 'wrong' && isCorrect));
    const showRed   = feedback === 'wrong' && isChosen;
    return {
      flex: 1,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: { xs: 100, sm: 130 },
      borderRadius: 3, border: '2.5px solid',
      borderColor: showGreen ? 'success.main' : showRed ? 'error.main' : 'grey.300',
      bgcolor: showGreen ? '#F0FDF4' : showRed ? '#FEF2F2' : 'white',
      cursor: feedback !== null ? 'default' : 'pointer',
      transition: 'border-color .2s, background-color .2s, transform .1s',
      transform: isChosen && feedback === 'correct' ? 'scale(1.04)' : 'scale(1)',
      animation: showRed ? 'btnShake .5s ease' : 'none',
      '@keyframes btnShake': {
        '0%,100%': { transform: 'translateX(0)' },
        '25%': { transform: 'translateX(-7px)' },
        '75%': { transform: 'translateX(7px)' },
      },
      userSelect: 'none',
      '&:hover': feedback !== null ? {} : { boxShadow: 3, transform: 'scale(1.02)' },
    };
  };

  return (
    <Box>
      {/* Progress bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <LinearProgress
          variant="determinate"
          value={(current / total) * 100}
          sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': { borderRadius: 4 } }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 42, textAlign: 'left', fontWeight: 600 }}>
          {current + 1} / {total}
        </Typography>
      </Box>

      {/* Word display */}
      <Box sx={{
        border: '2px solid', borderColor: 'primary.light', borderRadius: 3,
        p: { xs: 3, sm: 5 }, mb: 2.5, textAlign: 'center',
        bgcolor: '#F8F7FF',
        boxShadow: '0 2px 12px 0 rgba(99,102,241,.08)',
      }}>
        <Typography sx={{
          fontSize: { xs: '3.2rem', sm: '4.5rem' },
          fontFamily: '"Frank Ruhl Libre", "David Libre", serif',
          fontWeight: 700, lineHeight: 1.5,
          color: 'primary.dark',
          letterSpacing: 3,
        }}>
          {q.word}
        </Typography>
      </Box>

      <Typography variant="body1" fontWeight={600} textAlign="center" color="text.secondary" sx={{ mb: 2 }}>
        מה האות שמופיעה במילה?
      </Typography>

      {/* Answer buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {[true, false].map(isDagesh => (
          <Box key={String(isDagesh)} onClick={() => handleAnswer(isDagesh)} sx={btnSx(isDagesh)}>
            <Typography sx={{
              fontSize: { xs: '3rem', sm: '4rem' },
              fontFamily: '"Frank Ruhl Libre", "David Libre", serif',
              fontWeight: 700,
              color: 'primary.dark',
              lineHeight: 1,
            }}>
              {isDagesh ? pair.dagesh : pair.plain}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Progress dots */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.5, gap: 0.75 }}>
        {Array.from({ length: total }, (_, i) => (
          <Box key={i} sx={{
            width: i === current ? 10 : 8,
            height: i === current ? 10 : 8,
            borderRadius: '50%',
            transition: 'all .2s',
            bgcolor: i < answers.length
              ? (answers[i] ? 'success.main' : 'error.light')
              : i === current ? 'primary.main' : 'grey.300',
          }} />
        ))}
      </Box>
    </Box>
  );
};

export default DageshGame;
