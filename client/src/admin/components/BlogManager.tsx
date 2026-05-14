import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, TextField, Typography, IconButton, Card, CardContent,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider, Tooltip, Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
}

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];
const DEFAULT_SIZE = '16px';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() { return { types: ['textStyle'] }; },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (el: HTMLElement) => el.style.fontSize || null,
          renderHTML: (attrs: Record<string, string>) =>
            attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
        },
      },
    }];
  },
  addCommands() {
    return {
      setFontSize: (size: string) => ({ chain }: { chain: () => { setMark: (mark: string, attrs: Record<string, string>) => { run: () => boolean } } }) =>
        chain().setMark('textStyle', { fontSize: size }).run(),
      unsetFontSize: () => ({ chain }: { chain: () => { setMark: (mark: string, attrs: Record<string, string | null>) => { removeEmptyTextStyle: () => { run: () => boolean } } } }) =>
        chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

const emptyForm = { title: '', content: '', image: '' };

const TiptapEditor = ({ content, onChange }: { content: string; onChange: (html: string) => void }) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, FontSize, TextAlign.configure({ types: ['heading', 'paragraph'] })],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const btn = (active: boolean) => ({
    bgcolor: active ? 'action.selected' : 'transparent',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 1,
    p: 0.5,
  });

  const currentSize = (editor.getAttributes('textStyle') as { fontSize?: string }).fontSize || DEFAULT_SIZE;
  const sizeIdx = FONT_SIZES.indexOf(currentSize);

  const changeSize = (delta: number) => {
    const nextIdx = Math.max(0, Math.min(FONT_SIZES.length - 1, (sizeIdx === -1 ? 2 : sizeIdx) + delta));
    editor.chain().focus().setFontSize(FONT_SIZES[nextIdx]).run();
  };

  return (
    <Box>
      <Box sx={{
        display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1, p: 1,
        border: '1px solid', borderColor: 'divider', borderRadius: 1,
        borderBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
      }}>
        <Tooltip title="הדגשה">
          <IconButton size="small" sx={btn(editor.isActive('bold'))}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}>
            <FormatBoldIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="הטייה">
          <IconButton size="small" sx={btn(editor.isActive('italic'))}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}>
            <FormatItalicIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="קו תחתי">
          <IconButton size="small" sx={btn(editor.isActive('underline'))}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}>
            <FormatUnderlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="הקטן טקסט">
          <span>
            <IconButton size="small" sx={btn(false)} disabled={sizeIdx === 0}
              onMouseDown={e => { e.preventDefault(); changeSize(-1); }}>
              <Typography variant="caption" fontWeight={700} lineHeight={1} sx={{ fontSize: '0.65rem' }}>A-</Typography>
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={`גודל נוכחי: ${currentSize}`}>
          <Box sx={{ display: 'flex', alignItems: 'center', px: 0.5 }}>
            <Typography variant="caption" color="text.secondary" lineHeight={1}>{currentSize}</Typography>
          </Box>
        </Tooltip>
        <Tooltip title="הגדל טקסט">
          <span>
            <IconButton size="small" sx={btn(false)} disabled={sizeIdx === FONT_SIZES.length - 1}
              onMouseDown={e => { e.preventDefault(); changeSize(1); }}>
              <Typography variant="caption" fontWeight={700} lineHeight={1}>A+</Typography>
            </IconButton>
          </span>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="כותרת 2">
          <Box component="span">
            <IconButton size="small" sx={btn(editor.isActive('heading', { level: 2 }))}
              onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}>
              <Typography variant="caption" fontWeight={700} lineHeight={1}>H2</Typography>
            </IconButton>
          </Box>
        </Tooltip>
        <Tooltip title="כותרת 3">
          <Box component="span">
            <IconButton size="small" sx={btn(editor.isActive('heading', { level: 3 }))}
              onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}>
              <Typography variant="caption" fontWeight={700} lineHeight={1}>H3</Typography>
            </IconButton>
          </Box>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="רשימת נקודות">
          <IconButton size="small" sx={btn(editor.isActive('bulletList'))}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}>
            <FormatListBulletedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="רשימה ממוספרת">
          <IconButton size="small" sx={btn(editor.isActive('orderedList'))}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}>
            <FormatListNumberedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="יישור לימין">
          <IconButton size="small" sx={btn(editor.isActive({ textAlign: 'right' }))}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().setTextAlign('right').run(); }}>
            <FormatAlignRightIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="יישור למרכז">
          <IconButton size="small" sx={btn(editor.isActive({ textAlign: 'center' }))}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().setTextAlign('center').run(); }}>
            <FormatAlignCenterIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="יישור לשמאל">
          <IconButton size="small" sx={btn(editor.isActive({ textAlign: 'left' }))}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().setTextAlign('left').run(); }}>
            <FormatAlignLeftIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{
        border: '1px solid', borderColor: 'divider', borderRadius: 1,
        borderTopLeftRadius: 0, borderTopRightRadius: 0,
        minHeight: 200, p: 1.5,
        '& .tiptap': { outline: 'none', minHeight: 180 },
        '& .tiptap p': { margin: '0 0 8px' },
        '& .tiptap h2': { fontSize: '1.3rem', fontWeight: 700, margin: '16px 0 8px' },
        '& .tiptap h3': { fontSize: '1.1rem', fontWeight: 700, margin: '12px 0 6px' },
        '& .tiptap ul, & .tiptap ol': { paddingRight: '1.5rem', margin: '0 0 8px' },
        '& .tiptap u': { textDecoration: 'underline' },
      }}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const load = () => {
    axios.get<BlogPost[]>('/api/blog')
      .then(({ data }) => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;
    axios.get<BlogPost[]>('/api/blog')
      .then(({ data }) => { if (active) setPosts(data); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const openNew = () => { setForm(emptyForm); setImageFile(null); setEditingId(null); setDialogOpen(true); };
  const openEdit = (p: BlogPost) => {
    setForm({ title: p.title, content: p.content, image: p.image ?? '' });
    setImageFile(null); setEditingId(p.id); setDialogOpen(true);
  };

  const hasContent = (html: string) => html.replace(/<[^>]+>/g, '').trim().length > 0;

  const handleSave = async () => {
    setSaveError('');
    if (!form.title.trim()) { setSaveError('חובה להזין כותרת'); return; }
    if (!hasContent(form.content)) { setSaveError('חובה להזין תוכן לכתבה'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('content', form.content);
      if (imageFile) fd.append('image', imageFile);
      else if (form.image) fd.append('existingImage', form.image);
      if (editingId) await axios.put(`/api/blog/${editingId}`, fd);
      else await axios.post('/api/blog', fd);
      setDialogOpen(false);
      load();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
      setSaveError(msg || 'שגיאה בשמירה, נסה שוב');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('למחוק את הכתבה?')) return;
    await axios.delete(`/api/blog/${id}`);
    load();
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}
          sx={{ gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}>
          כתבה חדשה
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && posts.length === 0 && (
        <Typography color="text.secondary" textAlign="center" sx={{ py: 6 }}>אין כתבות עדיין</Typography>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {posts.map(p => (
          <Card key={p.id} variant="outlined">
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {p.image && (
                <Box component="img" src={p.image} alt={p.title}
                  sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 1, flexShrink: 0 }} />
              )}
              <Box sx={{ flexGrow: 1 }}>
                <Typography fontWeight={700}>{p.title}</Typography>
                <Typography variant="caption" color="text.secondary">{formatDate(p.createdAt)}</Typography>
              </Box>
              <IconButton onClick={() => openEdit(p)}><EditIcon /></IconButton>
              <IconButton color="error" onClick={() => handleDelete(p.id)}><DeleteIcon /></IconButton>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'עריכת כתבה' : 'כתבה חדשה'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '20px !important' }}>
          <TextField
            label="כותרת" fullWidth required
            value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>תמונה ראשית</Typography>
            {(imageFile || form.image) && (
              <Box component="img"
                src={imageFile ? URL.createObjectURL(imageFile) : form.image}
                alt="תצוגה מקדימה"
                sx={{ maxWidth: '100%', maxHeight: 160, objectFit: 'contain', display: 'block', borderRadius: 1, mb: 1 }}
              />
            )}
            <Button variant="outlined" component="label" size="small">
              {imageFile || form.image ? 'החלף תמונה' : 'העלה תמונה'}
              <input type="file" accept="image/*" hidden onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
            </Button>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>תוכן הכתבה</Typography>
            <TiptapEditor
              key={editingId ?? 'new'}
              content={form.content}
              onChange={html => setForm(f => ({ ...f, content: html }))}
            />
          </Box>
        </DialogContent>
        {saveError && <Alert severity="error" sx={{ mx: 3, mb: 1 }}>{saveError}</Alert>}
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>ביטול</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'שומר...' : 'שמור'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogManager;