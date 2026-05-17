import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Tabs, Tab, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton, Alert,
  CircularProgress, MenuItem, Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface GameItem {
  id: string;
  data: Record<string, unknown>;
}

const TABS = [
  { type: 'memory',       label: '🃏 זיכרון' },
  { type: 'word_arrange', label: '🔤 מסדרים מילה' },
  { type: 'letter_quiz',  label: '❓ אות חסרה' },
  { type: 'hangman',      label: '🪢 תלייה' },
  { type: 'jewish_quiz',  label: '🕍 חידון יהודי' },
  { type: 'nikud_match',  label: 'אָ קמץ ופתח' },
  { type: 'dagesh',       label: 'בּ עם דגש או בלי?' },
];

/* ── shared item table ── */
const ItemsTable = ({
  items, columns, onDelete,
}: {
  items: GameItem[];
  columns: { key: string; label: string }[];
  onDelete: (id: string) => void;
}) => (
  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 2 }}>
    <Table size="small">
      <TableHead>
        <TableRow sx={{ bgcolor: 'background.default' }}>
          {columns.map(c => <TableCell key={c.key} sx={{ fontWeight: 700 }}>{c.label}</TableCell>)}
          <TableCell align="center" sx={{ fontWeight: 700 }}>מחיקה</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.id} hover>
            {columns.map(c => (
              <TableCell key={c.key} sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {Array.isArray(item.data[c.key])
                  ? (item.data[c.key] as string[]).join(', ')
                  : String(item.data[c.key] ?? '')}
              </TableCell>
            ))}
            <TableCell align="center">
              <Tooltip title="מחק"><IconButton size="small" color="error" onClick={() => onDelete(item.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
            </TableCell>
          </TableRow>
        ))}
        {items.length === 0 && (
          <TableRow><TableCell colSpan={columns.length + 1} sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>אין פריטים – מוצגים ברירות המחדל מהקוד</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

/* ── per-game-type panels ── */

const MemoryPanel = ({ items, onAdd, onDelete }: { items: GameItem[]; onAdd: (d: Record<string, unknown>) => Promise<void>; onDelete: (id: string) => void }) => {
  const [word, setWord] = useState('');
  const [emoji, setEmoji] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!word.trim() || !emoji.trim()) { setErr('כל השדות חובה'); return; }
    setSaving(true);
    try { await onAdd({ word: word.trim(), emoji: emoji.trim() }); setWord(''); setEmoji(''); setErr(''); }
    catch { setErr('שגיאה בשמירה'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <ItemsTable items={items} columns={[{ key: 'word', label: 'מילה' }, { key: 'emoji', label: 'אמוג\'י' }]} onDelete={onDelete} />
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <TextField label="מילה" size="small" value={word} onChange={e => setWord(e.target.value)} sx={{ flex: 1, minWidth: 140 }} />
        <TextField label="אמוג'י" size="small" value={emoji} onChange={e => setEmoji(e.target.value)} sx={{ width: 120 }} placeholder="🕯️" />
        <Button variant="contained" startIcon={<AddIcon />} onClick={save} disabled={saving} sx={{ gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}>
          {saving ? <CircularProgress size={18} color="inherit" /> : 'הוסף'}
        </Button>
      </Box>
      {err && <Alert severity="error" sx={{ mt: 1 }}>{err}</Alert>}
    </>
  );
};

const WordArrangePanel = ({ items, onAdd, onDelete }: { items: GameItem[]; onAdd: (d: Record<string, unknown>) => Promise<void>; onDelete: (id: string) => void }) => {
  const [word, setWord] = useState('');
  const [hint, setHint] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!word.trim() || !hint.trim()) { setErr('כל השדות חובה'); return; }
    setSaving(true);
    try { await onAdd({ word: word.trim(), hint: hint.trim() }); setWord(''); setHint(''); setErr(''); }
    catch { setErr('שגיאה בשמירה'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <ItemsTable items={items} columns={[{ key: 'word', label: 'מילה' }, { key: 'hint', label: 'רמז' }]} onDelete={onDelete} />
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <TextField label="מילה" size="small" value={word} onChange={e => setWord(e.target.value)} sx={{ flex: 1, minWidth: 140 }} />
        <TextField label="רמז" size="small" value={hint} onChange={e => setHint(e.target.value)} sx={{ flex: 2, minWidth: 180 }} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={save} disabled={saving} sx={{ gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}>
          {saving ? <CircularProgress size={18} color="inherit" /> : 'הוסף'}
        </Button>
      </Box>
      {err && <Alert severity="error" sx={{ mt: 1 }}>{err}</Alert>}
    </>
  );
};

const HangmanPanel = ({ items, onAdd, onDelete }: { items: GameItem[]; onAdd: (d: Record<string, unknown>) => Promise<void>; onDelete: (id: string) => void }) => {
  const [word, setWord] = useState('');
  const [hint, setHint] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!word.trim() || !hint.trim()) { setErr('כל השדות חובה'); return; }
    if (!/^[א-ת"']+$/.test(word.trim())) { setErr('המילה חייבת להכיל אותיות עבריות בלבד'); return; }
    setSaving(true);
    try { await onAdd({ word: word.trim(), hint: hint.trim() }); setWord(''); setHint(''); setErr(''); }
    catch { setErr('שגיאה בשמירה'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <ItemsTable items={items} columns={[{ key: 'word', label: 'מילה' }, { key: 'hint', label: 'רמז' }]} onDelete={onDelete} />
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <TextField label="מילה (עברית)" size="small" value={word} onChange={e => setWord(e.target.value)} sx={{ flex: 1, minWidth: 140 }} />
        <TextField label="רמז" size="small" value={hint} onChange={e => setHint(e.target.value)} sx={{ flex: 2, minWidth: 180 }} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={save} disabled={saving} sx={{ gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}>
          {saving ? <CircularProgress size={18} color="inherit" /> : 'הוסף'}
        </Button>
      </Box>
      {err && <Alert severity="error" sx={{ mt: 1 }}>{err}</Alert>}
    </>
  );
};

const LetterQuizPanel = ({ items, onAdd, onDelete }: { items: GameItem[]; onAdd: (d: Record<string, unknown>) => Promise<void>; onDelete: (id: string) => void }) => {
  const [display, setDisplay] = useState('');
  const [answer, setAnswer] = useState('');
  const [hint, setHint] = useState('');
  const [opts, setOpts] = useState(['', '', '', '']);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!display.includes('_')) { setErr('התצוגה חייבת להכיל _ לסימון המקום החסר'); return; }
    if (!answer.trim()) { setErr('נדרשת אות נכונה'); return; }
    if (opts.some(o => !o.trim())) { setErr('נדרשות 4 אפשרויות'); return; }
    if (!opts.map(o => o.trim()).includes(answer.trim())) { setErr('האות הנכונה חייבת להיות אחת מ-4 האפשרויות'); return; }
    setSaving(true);
    try {
      await onAdd({ display: display.trim(), answer: answer.trim(), hint: hint.trim(), options: opts.map(o => o.trim()) });
      setDisplay(''); setAnswer(''); setHint(''); setOpts(['', '', '', '']); setErr('');
    }
    catch { setErr('שגיאה בשמירה'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        כתבו את המילה עם _ במקום האות החסרה, לדוגמה: שב_
      </Typography>
      <ItemsTable items={items} columns={[{ key: 'display', label: 'תצוגה' }, { key: 'answer', label: 'אות נכונה' }, { key: 'hint', label: 'רמז' }, { key: 'options', label: 'אפשרויות' }]} onDelete={onDelete} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField label="מילה עם _ (תצוגה)" size="small" value={display} onChange={e => setDisplay(e.target.value)} sx={{ flex: 1, minWidth: 140 }} placeholder="שב_" />
          <TextField label="אות נכונה" size="small" value={answer} onChange={e => setAnswer(e.target.value)} sx={{ width: 100 }} placeholder="ת" />
          <TextField label="רמז" size="small" value={hint} onChange={e => setHint(e.target.value)} sx={{ flex: 2, minWidth: 160 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          {opts.map((o, i) => (
            <TextField key={i} label={`אפשרות ${i + 1}`} size="small" value={o}
              onChange={e => setOpts(prev => prev.map((x, j) => j === i ? e.target.value : x))}
              sx={{ width: 90 }} slotProps={{ htmlInput: { maxLength: 2 } }}
            />
          ))}
          <Button variant="contained" startIcon={<AddIcon />} onClick={save} disabled={saving} sx={{ gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}>
            {saving ? <CircularProgress size={18} color="inherit" /> : 'הוסף'}
          </Button>
        </Box>
        {err && <Alert severity="error">{err}</Alert>}
      </Box>
    </>
  );
};

const JewishQuizPanel = ({ items, onAdd, onDelete }: { items: GameItem[]; onAdd: (d: Record<string, unknown>) => Promise<void>; onDelete: (id: string) => void }) => {
  const [q, setQ] = useState('');
  const [opts, setOpts] = useState(['', '', '', '']);
  const [answerIdx, setAnswerIdx] = useState(0);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!q.trim()) { setErr('נדרשת שאלה'); return; }
    if (opts.some(o => !o.trim())) { setErr('נדרשות 4 אפשרויות'); return; }
    setSaving(true);
    try {
      await onAdd({ q: q.trim(), options: opts.map(o => o.trim()), answer: answerIdx });
      setQ(''); setOpts(['', '', '', '']); setAnswerIdx(0); setErr('');
    }
    catch { setErr('שגיאה בשמירה'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <ItemsTable items={items}
        columns={[{ key: 'q', label: 'שאלה' }, { key: 'options', label: 'אפשרויות' }, { key: 'answer', label: 'תשובה נכונה (0-3)' }]}
        onDelete={onDelete}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <TextField label="שאלה" size="small" fullWidth value={q} onChange={e => setQ(e.target.value)} />
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {opts.map((o, i) => (
            <TextField key={i} label={`אפשרות ${i + 1}`} size="small" value={o}
              onChange={e => setOpts(prev => prev.map((x, j) => j === i ? e.target.value : x))}
              sx={{ flex: 1, minWidth: 120 }}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField select label="תשובה נכונה" size="small" value={answerIdx} onChange={e => setAnswerIdx(Number(e.target.value))} sx={{ minWidth: 160 }}>
            {[0, 1, 2, 3].map(i => <MenuItem key={i} value={i}>אפשרות {i + 1}</MenuItem>)}
          </TextField>
          <Button variant="contained" startIcon={<AddIcon />} onClick={save} disabled={saving} sx={{ gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}>
            {saving ? <CircularProgress size={18} color="inherit" /> : 'הוסף'}
          </Button>
        </Box>
        {err && <Alert severity="error">{err}</Alert>}
      </Box>
    </>
  );
};

const NikudMatchPanel = ({ items, onDelete, onRefresh }: {
  items: GameItem[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
}) => {
  const PATACH = 'ַ';
  const KAMATZ = 'ָ';
  const [letter, setLetter]   = useState('');
  const [nikud, setNikud]     = useState<'patach' | 'kamatz'>('patach');
  const [word, setWord]       = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [err, setErr]         = useState('');
  const [saving, setSaving]   = useState(false);

  const save = async () => {
    if (!letter.trim() || !word.trim() || !imageFile) { setErr('כל השדות חובה כולל תמונה'); return; }
    setSaving(true);
    const fd = new FormData();
    fd.append('letter', letter.trim());
    fd.append('nikud', nikud);
    fd.append('word', word.trim());
    fd.append('image', imageFile);
    try {
      await axios.post('/api/game-items/nikud_match', fd);
      setLetter(''); setWord(''); setImageFile(null); setErr('');
      onRefresh();
    } catch (e: unknown) {
      const msg = axios.isAxiosError(e) ? (e.response?.data as { message?: string })?.message : undefined;
      setErr(msg || 'שגיאה בשמירה');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        המשחק מציג עד 6 זוגות אקראיים – קלף אות עם ניקוד וקלף תמונה מתאים. הילד לוחץ להתאמה.
      </Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              <TableCell sx={{ fontWeight: 700 }}>אות + ניקוד</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>מילה</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>תמונה</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>מחיקה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => {
              const d = item.data as { letter: string; nikud: string; imageUrl: string; word: string };
              const mark = d.nikud === 'patach' ? PATACH : KAMATZ;
              return (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontSize: '1.3rem', fontFamily: 'serif' }}>{d.letter + mark}</TableCell>
                  <TableCell>{d.word}</TableCell>
                  <TableCell>
                    <Box component="img" src={d.imageUrl} alt={d.word}
                      sx={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 1 }} />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="מחק">
                      <IconButton size="small" color="error" onClick={() => onDelete(item.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>אין פריטים עדיין</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <TextField label="אות" size="small" value={letter}
          onChange={e => setLetter(e.target.value)} sx={{ width: 80 }}
          slotProps={{ htmlInput: { maxLength: 2 } }} placeholder="א" />
        <TextField select label="ניקוד" size="small" value={nikud}
          onChange={e => setNikud(e.target.value as 'patach' | 'kamatz')} sx={{ width: 130 }}>
          <MenuItem value="patach">פתח ({`א${PATACH}`})</MenuItem>
          <MenuItem value="kamatz">קמץ ({`א${KAMATZ}`})</MenuItem>
        </TextField>
        <TextField label="מילה" size="small" value={word}
          onChange={e => setWord(e.target.value)} sx={{ flex: 1, minWidth: 120 }} />
        <Button variant="outlined" component="label" size="medium" sx={{ whiteSpace: 'nowrap', minWidth: 100 }}>
          {imageFile ? imageFile.name.slice(0, 10) + (imageFile.name.length > 10 ? '…' : '') : 'העלה תמונה'}
          <input type="file" accept="image/*" hidden
            onChange={e => { setImageFile(e.target.files?.[0] ?? null); e.target.value = ''; }} />
        </Button>
        <Button variant="contained" startIcon={<AddIcon />} onClick={save} disabled={saving}
          sx={{ gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}>
          {saving ? <CircularProgress size={18} color="inherit" /> : 'הוסף'}
        </Button>
      </Box>
      {err && <Alert severity="error" sx={{ mt: 1 }}>{err}</Alert>}
    </>
  );
};

const DAGESH_PAIRS = [
  { value: 'b', label: 'בּ / ב' },
  { value: 'k', label: 'כּ / כ' },
  { value: 'p', label: 'פּ / פ' },
] as const;

const DageshPanel = ({ items, onAdd, onDelete }: { items: GameItem[]; onAdd: (d: Record<string, unknown>) => Promise<void>; onDelete: (id: string) => void }) => {
  const [word,      setWord]      = useState('');
  const [pair,      setPair]      = useState<'b' | 'k' | 'p'>('b');
  const [hasDagesh, setHasDagesh] = useState(true);
  const [err,       setErr]       = useState('');
  const [saving,    setSaving]    = useState(false);

  const save = async () => {
    if (!word.trim()) { setErr('נדרשת מילה'); return; }
    setSaving(true);
    try {
      await onAdd({ word: word.trim(), pair, hasDagesh });
      setWord(''); setErr('');
    } catch { setErr('שגיאה בשמירה'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        מילים שמורות בבסיס הנתונים מחליפות את ברירות המחדל. ריק = ברירת מחדל מהקוד.
      </Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              <TableCell sx={{ fontWeight: 700 }}>מילה</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>זוג אותיות</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>דגש</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>מחיקה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => {
              const d = item.data as { word: string; pair: 'b' | 'k' | 'p'; hasDagesh: boolean };
              const pairInfo = DAGESH_PAIRS.find(p => p.value === d.pair);
              return (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontSize: '1.2rem', fontFamily: 'serif' }}>{d.word}</TableCell>
                  <TableCell sx={{ fontFamily: 'serif' }}>{pairInfo?.label ?? d.pair}</TableCell>
                  <TableCell>{d.hasDagesh ? 'עם דגש' : 'בלי דגש'}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="מחק">
                      <IconButton size="small" color="error" onClick={() => onDelete(item.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                  אין פריטים – מוצגות ברירות המחדל מהקוד
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <TextField
          label="מילה (עם ניקוד)"
          size="small"
          value={word}
          onChange={e => setWord(e.target.value)}
          placeholder="בּית"
          sx={{ flex: 1, minWidth: 140 }}
        />
        <TextField
          select
          label="זוג אותיות"
          size="small"
          value={pair}
          onChange={e => setPair(e.target.value as 'b' | 'k' | 'p')}
          sx={{ width: 140 }}
        >
          {DAGESH_PAIRS.map(p => (
            <MenuItem key={p.value} value={p.value} sx={{ fontFamily: 'serif', fontSize: '1.1rem' }}>
              {p.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="דגש"
          size="small"
          value={String(hasDagesh)}
          onChange={e => setHasDagesh(e.target.value === 'true')}
          sx={{ width: 120 }}
        >
          <MenuItem value="true">עם דגש</MenuItem>
          <MenuItem value="false">בלי דגש</MenuItem>
        </TextField>
        <Button variant="contained" startIcon={<AddIcon />} onClick={save} disabled={saving}
          sx={{ gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}>
          {saving ? <CircularProgress size={18} color="inherit" /> : 'הוסף'}
        </Button>
      </Box>
      {err && <Alert severity="error" sx={{ mt: 1 }}>{err}</Alert>}
    </>
  );
};

/* ── delete confirm dialog ── */
const DeleteDialog = ({ open, onClose, onConfirm, loading }: { open: boolean; onClose: () => void; onConfirm: () => void; loading: boolean }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle fontWeight={700}>מחיקת פריט</DialogTitle>
    <DialogContent><Typography>האם למחוק את הפריט לצמיתות?</Typography></DialogContent>
    <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
      <Button onClick={onClose} disabled={loading}>ביטול</Button>
      <Button variant="contained" color="error" onClick={onConfirm} disabled={loading} sx={{ minWidth: 80 }}>
        {loading ? <CircularProgress size={18} color="inherit" /> : 'מחק'}
      </Button>
    </DialogActions>
  </Dialog>
);

/* ── main component ── */
const GamesManager = () => {
  const [tab, setTab] = useState<number | false>(false);
  const [itemsByType, setItemsByType] = useState<Record<string, GameItem[]>>({});
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const gameType = tab !== false ? TABS[tab].type : null;

  const load = (type: string) => {
    axios.get<GameItem[]>(`/api/game-items/${type}`)
      .then(({ data }) => setItemsByType(prev => ({ ...prev, [type]: data })))
      .catch(() => {});
  };

  useEffect(() => {
    if (!gameType) return;
    let active = true;
    axios.get<GameItem[]>(`/api/game-items/${gameType}`)
      .then(({ data }) => { if (active) setItemsByType(prev => ({ ...prev, [gameType]: data })); })
      .catch(() => {});
    return () => { active = false; };
  }, [gameType]);

  const handleAdd = async (data: Record<string, unknown>) => {
    if (!gameType) return;
    await axios.post(`/api/game-items/${gameType}`, data);
    load(gameType);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/game-items/${deleteTarget}`);
      if (gameType) load(gameType);
      setDeleteTarget(null);
    } catch { /* ignore */ }
    finally { setDeleting(false); }
  };

  const items = gameType ? (itemsByType[gameType] ?? []) : [];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>תוכן משחקים</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        פריטים שמורים בבסיס הנתונים מחליפים את ברירות המחדל בקוד. ריק = המשחק ישתמש בברירת המחדל.
      </Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        {TABS.map((t, i) => <Tab key={i} label={t.label} sx={{ fontWeight: 600 }} />)}
      </Tabs>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        {tab === false && (
          <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>בחר משחק מהרשימה למעלה</Typography>
        )}
        {tab === 0 && <MemoryPanel      items={items} onAdd={handleAdd} onDelete={setDeleteTarget} />}
        {tab === 1 && <WordArrangePanel items={items} onAdd={handleAdd} onDelete={setDeleteTarget} />}
        {tab === 2 && <LetterQuizPanel  items={items} onAdd={handleAdd} onDelete={setDeleteTarget} />}
        {tab === 3 && <HangmanPanel     items={items} onAdd={handleAdd} onDelete={setDeleteTarget} />}
        {tab === 4 && <JewishQuizPanel  items={items} onAdd={handleAdd} onDelete={setDeleteTarget} />}
        {tab === 5 && gameType && <NikudMatchPanel items={items} onDelete={setDeleteTarget} onRefresh={() => load(gameType)} />}
        {tab === 6 && <DageshPanel items={items} onAdd={handleAdd} onDelete={setDeleteTarget} />}
      </Paper>

      <DeleteDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />
    </Box>
  );
};

export default GamesManager;
