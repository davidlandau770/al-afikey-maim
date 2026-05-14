import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, TextField, Typography, IconButton, Card, CardContent,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  createdAt: string;
}

const emptyForm = { quote: '', name: '', role: '' };

const TestimonialsManager = () => {
  const [items, setItems]         = useState<Testimonial[]>([]);
  const [loading, setLoading]     = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting]   = useState(false);

  const load = () => {
    axios.get<Testimonial[]>('/api/testimonials')
      .then(({ data }) => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;
    axios.get<Testimonial[]>('/api/testimonials')
      .then(({ data }) => { if (active) setItems(data); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const openNew = () => { setForm(emptyForm); setEditingId(null); setSaveError(''); setDialogOpen(true); };
  const openEdit = (t: Testimonial) => {
    setForm({ quote: t.quote, name: t.name, role: t.role });
    setEditingId(t.id); setSaveError(''); setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaveError('');
    if (!form.quote.trim()) { setSaveError('חובה להזין ציטוט'); return; }
    if (!form.name.trim())  { setSaveError('חובה להזין שם'); return; }
    setSaving(true);
    try {
      if (editingId) await axios.put(`/api/testimonials/${editingId}`, form);
      else           await axios.post('/api/testimonials', form);
      setDialogOpen(false);
      load();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
      setSaveError(msg || 'שגיאה בשמירה');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/testimonials/${deleteTarget}`);
      setDeleteTarget(null);
      load();
    } catch { /* ignore */ }
    finally { setDeleting(false); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}
          sx={{ gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}>
          הוסף המלצה
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && items.length === 0 && (
        <Typography color="text.secondary" textAlign="center" sx={{ py: 6 }}>אין המלצות עדיין</Typography>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(t => (
          <Card key={t.id} variant="outlined">
            <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary" sx={{
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 0.5,
                  fontStyle: 'italic',
                }}>
                  {t.quote}
                </Typography>
                <Typography fontWeight={700} variant="body2">{t.name}</Typography>
                {t.role && <Typography variant="caption" color="text.secondary">{t.role}</Typography>}
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                <Tooltip title="ערוך">
                  <IconButton size="small" onClick={() => openEdit(t)}><EditIcon fontSize="small" /></IconButton>
                </Tooltip>
                <Tooltip title="מחק">
                  <IconButton size="small" color="error" onClick={() => setDeleteTarget(t.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'עריכת המלצה' : 'המלצה חדשה'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '20px !important' }}>
          <TextField
            label="ציטוט" fullWidth required multiline minRows={4}
            value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))}
            placeholder=". . .הטקסט של ההמלצה. . ."
          />
          <TextField
            label="שם" fullWidth required
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="פרופ' ישראל ישראלי"
          />
          <TextField
            label="תפקיד / מוסד" fullWidth
            value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            placeholder="המחלקה לחינוך אוניברסיטת ..."
          />
        </DialogContent>
        {saveError && <Alert severity="error" sx={{ mx: 3, mb: 1 }}>{saveError}</Alert>}
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>ביטול</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'שומר...' : 'שמור'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>מחיקת המלצה</DialogTitle>
        <DialogContent>
          <Typography>האם למחוק את ההמלצה לצמיתות?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>ביטול</Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting} sx={{ minWidth: 80 }}>
            {deleting ? <CircularProgress size={18} color="inherit" /> : 'מחק'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestimonialsManager;
