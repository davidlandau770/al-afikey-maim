import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

interface DbItem {
  id: string;
  data: { letter: string; nikud: 'kamatz' | 'patach'; imageUrl: string; word: string };
}

interface Card {
  id: string;
  pairId: string;
  type: 'letter' | 'image';
  letter: string;
  nikud: 'kamatz' | 'patach';
  imageUrl: string;
  word: string;
}

const PATACH = 'ַ';
const KAMATZ = 'ָ';

const img = (fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="${fill}" rx="10"/></svg>`)}`;

const DEFAULT_ITEMS: DbItem[] = [
  { id: 'd1', data: { letter: 'א',  nikud: 'patach', imageUrl: img('#FCA5A5'), word: 'אגס'  } },
  { id: 'd2', data: { letter: 'בּ', nikud: 'patach', imageUrl: img('#FCD34D'), word: 'בלון' } },
  { id: 'd3', data: { letter: 'כּ', nikud: 'patach', imageUrl: img('#86EFAC'), word: 'כדור' } },
  { id: 'd4', data: { letter: 'ד',  nikud: 'kamatz', imageUrl: img('#93C5FD'), word: 'דג'   } },
  { id: 'd5', data: { letter: 'שׁ', nikud: 'kamatz', imageUrl: img('#C4B5FD'), word: 'שעון' } },
  { id: 'd6', data: { letter: 'ג',  nikud: 'kamatz', imageUrl: img('#6EE7B7'), word: 'גמל'  } },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCards(items: DbItem[]): Card[] {
  const cards: Card[] = [];
  items.forEach(item => {
    cards.push({ id: `l-${item.id}`, pairId: item.id, type: 'letter', ...item.data });
    cards.push({ id: `i-${item.id}`, pairId: item.id, type: 'image',  ...item.data });
  });
  return shuffle(cards);
}

const COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6BFF', '#FFB347', '#A78BFA', '#34D399'];

const Confetti = () => {
  const pieces = Array.from({ length: 64 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: COLORS[i % COLORS.length],
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
            '0%':   { top: '-2%', opacity: 1 },
            '100%': { top: '110%', opacity: 0 },
          },
        }} />
      ))}
    </Box>
  );
};

const NikudMatchGame = () => {
  const [cards, setCards]       = useState<Card[]>([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [matched, setMatched]   = useState<Set<string>>(new Set());
  const [shaking, setShaking]   = useState<Set<string>>(new Set());
  const [locked, setLocked]     = useState(false);
  const [done, setDone]         = useState(false);
  const [confetti, setConfetti] = useState(false);

  const load = () => {
    setLoading(true); setDone(false); setMatched(new Set());
    setSelected([]); setShaking(new Set()); setLocked(false); setConfetti(false);
    axios.get<DbItem[]>('/api/game-items/nikud_match')
      .then(({ data }) => {
        const source = data.length > 0 ? data : DEFAULT_ITEMS;
        setCards(buildCards(shuffle(source).slice(0, 6)));
      })
      .catch(() => {
        setCards(buildCards(shuffle(DEFAULT_ITEMS).slice(0, 6)));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleClick = (card: Card) => {
    if (locked || matched.has(card.id) || selected.includes(card.id)) return;

    if (selected.length === 0) { setSelected([card.id]); return; }

    const firstCard = cards.find(c => c.id === selected[0])!;
    setSelected([selected[0], card.id]);

    if (firstCard.pairId === card.pairId) {
      const newMatched = new Set([...matched, firstCard.id, card.id]);
      setMatched(newMatched);
      setSelected([]);
      if (newMatched.size === cards.length) {
        setDone(true); setConfetti(true);
        setTimeout(() => setConfetti(false), 3800);
      }
    } else {
      setLocked(true);
      setShaking(new Set([firstCard.id, card.id]));
      setTimeout(() => {
        setSelected([]); setShaking(new Set()); setLocked(false);
      }, 700);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>;

  return (
    <Box>
      {confetti && <Confetti />}

      {done ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" fontWeight={800} color="success.main" sx={{ mb: 2 }}>
            🎉 כל הכבוד! התאמת את כל הזוגות!
          </Typography>
          <Button variant="contained" size="large" onClick={load}>שחק שוב</Button>
        </Box>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
            לחץ על קלף עם אות, ואז על התמונה המתאימה לה
          </Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: { xs: 1, sm: 1.5 },
          }}>
            {cards.map(card => {
              const isSelected = selected.includes(card.id);
              const isMatched  = matched.has(card.id);
              const isShaking  = shaking.has(card.id);
              const nikudChar  = card.nikud === 'patach' ? PATACH : KAMATZ;

              return (
                <Box
                  key={card.id}
                  onClick={() => handleClick(card)}
                  sx={{
                    borderRadius: 2, cursor: isMatched ? 'default' : 'pointer',
                    border: '2px solid',
                    borderColor: isMatched ? 'success.main' : isSelected ? 'primary.main' : 'divider',
                    bgcolor: isMatched ? '#F0FDF4' : isSelected ? '#EEF2FF' : card.type === 'letter' ? '#F5F3FF' : 'background.paper',
                    transition: 'border-color .2s, background-color .2s, transform .15s',
                    transform: isSelected && !isMatched ? 'scale(1.05)' : 'scale(1)',
                    animation: isShaking ? 'cardShake .65s ease' : 'none',
                    '@keyframes cardShake': {
                      '0%,100%': { transform: 'translateX(0)' },
                      '20%': { transform: 'translateX(-7px)' },
                      '40%': { transform: 'translateX(7px)' },
                      '60%': { transform: 'translateX(-7px)' },
                      '80%': { transform: 'translateX(4px)' },
                    },
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    minHeight: { xs: 90, sm: 120 },
                    p: { xs: 0.5, sm: 1 },
                    userSelect: 'none',
                    opacity: isMatched ? 0.55 : 1,
                  }}
                >
                  {card.type === 'letter' ? (
                    <Typography sx={{
                      fontSize: { xs: '2.4rem', sm: '3.2rem' },
                      lineHeight: 1.4,
                      fontFamily: '"Frank Ruhl Libre", "David Libre", serif',
                      color: isMatched ? 'success.dark' : 'primary.dark',
                      letterSpacing: 2,
                    }}>
                      {card.letter + nikudChar}
                    </Typography>
                  ) : (
                    <>
                      <Box component="img" src={card.imageUrl} alt={card.word} sx={{
                        width: '100%', maxHeight: { xs: 56, sm: 76 },
                        objectFit: 'contain', borderRadius: 1, mb: 0.5,
                      }} />
                      <Typography variant="caption" fontWeight={600} color="text.secondary" textAlign="center">
                        {card.word}
                      </Typography>
                    </>
                  )}
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
};

export default NikudMatchGame;