import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';

const DEFAULT_PAIRS = [
  { pairId: 0, word: 'שבת',  emoji: '🕯️' },
  { pairId: 1, word: 'תורה', emoji: '📖' },
  { pairId: 2, word: 'ספר',  emoji: '📚' },
  { pairId: 3, word: 'אמא',  emoji: '👩' },
  { pairId: 4, word: 'מים',  emoji: '💧' },
  { pairId: 5, word: 'שלום', emoji: '🕊️' },
  { pairId: 6, word: 'בית',  emoji: '🏠' },
  { pairId: 7, word: 'אור',  emoji: '☀️' },
];

type Pair = { pairId: number; word: string; emoji: string };
type Card = { id: number; pairId: number; content: string; isEmoji: boolean };

function buildCards(pairs: Pair[]): Card[] {
  const cards: Card[] = [];
  pairs.forEach(p => {
    cards.push({ id: p.pairId * 2,     pairId: p.pairId, content: p.word,  isEmoji: false });
    cards.push({ id: p.pairId * 2 + 1, pairId: p.pairId, content: p.emoji, isEmoji: true  });
  });
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

const MemoryGame = () => {
  const [pairs, setPairs] = useState<Pair[]>(DEFAULT_PAIRS);
  const [cards,   setCards]   = useState<Card[]>(() => buildCards(DEFAULT_PAIRS));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves,   setMoves]   = useState(0);
  const [locked,  setLocked]  = useState(false);
  const [won,     setWon]     = useState(false);

  useEffect(() => {
    axios.get<{ id: string; data: { word: string; emoji: string } }[]>('/api/game-items/memory')
      .then(r => {
        if (r.data.length > 0) {
          const loaded = r.data.map((item, i) => ({ pairId: i, word: item.data.word, emoji: item.data.emoji }));
          setPairs(loaded);
          setCards(buildCards(loaded));
          setFlipped([]); setMatched(new Set()); setMoves(0); setLocked(false); setWon(false);
        }
      })
      .catch(() => {});
  }, []);

  const reset = (currentPairs = pairs) => {
    setCards(buildCards(currentPairs));
    setFlipped([]); setMatched(new Set()); setMoves(0); setLocked(false); setWon(false);
  };

  const handleFlip = (card: Card) => {
    if (locked || won || flipped.includes(card.id) || matched.has(card.pairId)) return;
    if (flipped.length === 2) return;

    const next = [...flipped, card.id];
    setFlipped(next);

    if (next.length === 2) {
      setMoves(m => m + 1);
      const a = cards.find(c => c.id === next[0])!;
      const b = cards.find(c => c.id === next[1])!;
      if (a.pairId === b.pairId) {
        setMatched(prev => {
          const m = new Set([...prev, a.pairId]);
          if (m.size === pairs.length) setWon(true);
          return m;
        });
        setFlipped([]);
      } else {
        setLocked(true);
        setTimeout(() => { setFlipped([]); setLocked(false); }, 900);
      }
    }
  };

  const isVisible = (card: Card) => flipped.includes(card.id) || matched.has(card.pairId);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography>מהלכים: <strong>{moves}</strong></Typography>
        <Button variant="outlined" size="small" onClick={() => reset()}>משחק חדש</Button>
      </Box>

      {won && (
        <Box sx={{ textAlign: 'center', mb: 2.5, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={700} color="success.dark">
            כל הכבוד! סיימת ב-{moves} מהלכים 🎉
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: { xs: 1, md: 1.5 } }}>
        {cards.map(card => (
          <Box
            key={card.id}
            onClick={() => handleFlip(card)}
            sx={{
              height: { xs: 72, md: 90 },
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: matched.has(card.pairId) || won ? 'default' : 'pointer',
              bgcolor: matched.has(card.pairId) ? 'success.light' : isVisible(card) ? '#EBF4FA' : 'primary.dark',
              border: '2px solid',
              borderColor: matched.has(card.pairId) ? 'success.main' : isVisible(card) ? 'primary.main' : 'primary.dark',
              fontSize: isVisible(card) && card.isEmoji ? '2rem' : '1.1rem',
              fontWeight: 700,
              color: matched.has(card.pairId) ? 'success.dark' : isVisible(card) ? 'primary.dark' : 'white',
              transition: 'all 0.15s ease',
              userSelect: 'none',
              '&:hover': !matched.has(card.pairId) && !isVisible(card) && !won ? { bgcolor: 'primary.main', transform: 'scale(1.04)' } : {},
            }}
          >
            {isVisible(card) ? card.content : '?'}
          </Box>
        ))}
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
        מצאו {pairs.length} זוגות של מילה ואמוג'י מתאים
      </Typography>
    </Box>
  );
};

export default MemoryGame;
