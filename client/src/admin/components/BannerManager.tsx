import { useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Button, IconButton, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Tooltip, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControlLabel, Checkbox, MenuItem, Alert, CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useBanners } from '../../context/BannersContext';
import type { Banner } from '../../context/BannersContext';

const POSITION_LABELS: Record<number, string> = {
  0: 'אחרי התפריט',
  1: 'אחרי הכותרת ראשית',
  2: 'אחרי השיטה שלנו',
  3: 'אחרי החנות',
  4: 'אחרי השו"ת',
};

const PRESET_COLORS = [
  { label: 'ללא צבע', value: '' },
  { label: 'כחול', value: '#1B6B8A' },
  { label: 'כהה', value: '#2C3E50' },
  { label: 'ירוק', value: '#2E8B57' },
  { label: 'כתום', value: '#C8903A' },
  { label: 'אדום', value: '#C0392B' },
  { label: 'סגול', value: '#6C3483' },
];

const emptyForm = {
  title: '', text: '', bannerLink: '', link: '', linkText: '',
  bgColor: '#1B6B8A', bgImage: '',
  position: 0, active: true,
};
type BannerForm = typeof emptyForm;

const BannerManager = () => {
  const { banners, refetch } = useBanners();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setError(''); setOpen(true); };
  const openEdit = (b: Banner) => {
    setEditingId(b.id);
    setForm({
      title: b.title, text: b.text ?? '',
      bannerLink: b.bannerLink ?? '', link: b.link ?? '', linkText: b.linkText ?? '',
      bgColor: b.bgColor, bgImage: b.bgImage ?? '',
      position: b.position, active: b.active,
    });
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        text: form.text || undefined,
        bannerLink: form.bannerLink || undefined,
        link: form.link || undefined,
        linkText: form.linkText || undefined,
        bgImage: form.bgImage || undefined,
      };
      if (editingId) {
        await axios.put(`/api/banners/${editingId}`, payload);
      } else {
        await axios.post('/api/banners', payload);
      }
      refetch();
      setOpen(false);
    } catch {
      setError('שגיאה בשמירה');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/banners/${deleteId}`);
      refetch();
      setDeleteId(null);
    } catch { /* ignore */ } finally {
      setDeleting(false);
    }
  };

  const hasColor = !!form.bgColor;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>באנרים בדף הבית</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} sx={{ gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}>
          הוסף באנר
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              <TableCell>צבע</TableCell>
              <TableCell>כותרת</TableCell>
              <TableCell>מיקום</TableCell>
              <TableCell>סטטוס</TableCell>
              <TableCell align="center">פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banners.map(b => (
              <TableRow key={b.id} hover>
                <TableCell>
                  <Box sx={{
                    width: 32, height: 32, borderRadius: 1, border: '1px solid', borderColor: 'divider',
                    bgcolor: b.bgColor || 'transparent',
                    backgroundImage: b.bgImage ? `url(${b.bgImage})` : undefined,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                  }} />
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>{b.title}</Typography>
                  {b.text && <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 220 }}>{b.text}</Typography>}
                </TableCell>
                <TableCell><Chip label={POSITION_LABELS[b.position] ?? `מיקום ${b.position}`} size="small" /></TableCell>
                <TableCell>{b.active ? <Chip label="פעיל" color="success" size="small" /> : <Chip label="מושבת" size="small" />}</TableCell>
                <TableCell align="center">
                  <Tooltip title="עריכה"><IconButton color="primary" onClick={() => openEdit(b)}><EditIcon /></IconButton></Tooltip>
                  <Tooltip title="מחיקה"><IconButton color="error" onClick={() => setDeleteId(b.id)}><DeleteIcon /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {banners.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>אין באנרים עדיין</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{editingId ? 'עריכת באנר' : 'הוספת באנר'}</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 3 }}>

          {/* Preview */}
          {form.bgImage ? (
            <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
              <Box component="img" src={form.bgImage} alt="תצוגה מקדימה"
                sx={{ width: '100%', display: 'block' }} />
              {hasColor && (
                <Box sx={{ position: 'absolute', inset: 0, bgcolor: form.bgColor, opacity: 0.55 }} />
              )}
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', px: 2 }}>
                {form.title && <Typography fontWeight={700} sx={{ color: 'white' }}>{form.title}</Typography>}
              </Box>
            </Box>
          ) : (
            <Box sx={{
              borderRadius: 2, textAlign: 'center', py: 2.5, px: 3,
              ...(hasColor ? { bgcolor: form.bgColor } : { border: '1px dashed', borderColor: 'divider' }),
            }}>
              {(form.title || !form.text) && (
                <Typography fontWeight={700} sx={{ color: hasColor ? 'white' : 'text.primary' }}>
                  {form.title || 'כותרת הבאנר'}
                </Typography>
              )}
              {form.text && (
                <Typography variant="body2" sx={{ color: hasColor ? 'rgba(255,255,255,0.85)' : 'text.secondary', mt: 0.5 }}>
                  {form.text}
                </Typography>
              )}
            </Box>
          )}

          <TextField label="כותרת (אופציונלי)" fullWidth value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <TextField label="טקסט נוסף (אופציונלי)" fullWidth multiline rows={2} value={form.text}
            onChange={e => setForm(f => ({ ...f, text: e.target.value }))} />

          <TextField label="קישור על הבאנר עצמו (אופציונלי)" fullWidth value={form.bannerLink}
            onChange={e => setForm(f => ({ ...f, bannerLink: e.target.value }))}
            placeholder="https://..."
            helperText="לחיצה על הבאנר כולו תפתח את הקישור" />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="קישור כפתור (אופציונלי)" fullWidth value={form.link}
              onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." />
            <TextField label="טקסט כפתור" sx={{ width: 160 }} value={form.linkText}
              onChange={e => setForm(f => ({ ...f, linkText: e.target.value }))} placeholder="לפרטים" />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField select label="מיקום" sx={{ flex: 1 }} value={form.position}
              onChange={e => setForm(f => ({ ...f, position: Number(e.target.value) }))}>
              {Object.entries(POSITION_LABELS).map(([val, label]) => (
                <MenuItem key={val} value={Number(val)}>{label}</MenuItem>
              ))}
            </TextField>
            <TextField select label="צבע רקע" sx={{ flex: 1 }} value={form.bgColor}
              onChange={e => setForm(f => ({ ...f, bgColor: e.target.value }))}>
              {PRESET_COLORS.map(c => (
                <MenuItem key={c.value || 'none'} value={c.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {c.value
                      ? <Box sx={{ width: 18, height: 18, borderRadius: 0.5, bgcolor: c.value }} />
                      : <Box sx={{ width: 18, height: 18, borderRadius: 0.5, border: '1px dashed', borderColor: 'text.disabled' }} />
                    }
                    {c.label}
                  </Box>
                </MenuItem>
              ))}
              {form.bgColor && !PRESET_COLORS.some(c => c.value === form.bgColor) && (
                <MenuItem value={form.bgColor} disabled>מותאם אישית: {form.bgColor}</MenuItem>
              )}
            </TextField>
          </Box>

          <TextField label="צבע מותאם אישית (Hex)" placeholder="#1B6B8A" value={form.bgColor}
            onChange={e => setForm(f => ({ ...f, bgColor: e.target.value }))}
            helperText={hasColor ? 'שנה ישירות את ה-Hex, או בחר "ללא צבע" למעלה לתמונה נקייה' : 'אין שכבת צבע – התמונה תוצג ללא כהייה'}
            fullWidth disabled={!hasColor && !form.bgImage}
          />

          <TextField label="תמונת רקע – URL (אופציונלי)" fullWidth value={form.bgImage}
            onChange={e => setForm(f => ({ ...f, bgImage: e.target.value }))}
            placeholder="https://example.com/image.jpg"
            helperText="כאשר נבחר 'ללא צבע', התמונה מוצגת ללא כהייה"
          />

          <FormControlLabel
            control={<Checkbox checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} color="primary" />}
            label="באנר פעיל (מוצג בדף הבית)"
          />
          {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setOpen(false)} disabled={saving}>ביטול</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ minWidth: 100 }}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'שמור'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>מחיקת באנר</DialogTitle>
        <DialogContent><Typography>האם למחוק את הבאנר לצמיתות?</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteId(null)} disabled={deleting}>ביטול</Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting} sx={{ minWidth: 80 }}>
            {deleting ? <CircularProgress size={20} color="inherit" /> : 'מחק'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BannerManager;
