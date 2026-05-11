import { useState, useRef } from 'react';
import axios from 'axios';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Autocomplete, FormControlLabel, Checkbox,
  Button, CircularProgress, Typography, IconButton, Tooltip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Product } from '../../data/products';

const emptyForm = {
  name: '', description: '', price: '', originalPrice: '',
  category: '', pages: '', featured: false, soldOut: false, stock: '',
};

type FormState = typeof emptyForm;

interface Props {
  open: boolean;
  editingProduct: Product | null;
  products: Product[];
  onClose: () => void;
  onSaved: (msg: string) => void;
  onError: (msg: string) => void;
}

interface ImageEntry {
  file?: File;
  preview: string;
  existing?: string;
}

const ProductForm = ({ open, editingProduct, products, onClose, onSaved, onError }: Props) => {
  const [form, setForm] = useState<FormState>(() => editingProduct ? {
    name: editingProduct.name,
    description: editingProduct.description,
    price: String(editingProduct.price),
    originalPrice: editingProduct.originalPrice ? String(editingProduct.originalPrice) : '',
    category: editingProduct.category,
    pages: editingProduct.pages ? String(editingProduct.pages) : '',
    featured: editingProduct.featured,
    soldOut: editingProduct.soldOut ?? false,
    stock: editingProduct.stock != null ? String(editingProduct.stock) : '',
  } : emptyForm);
  const [mainImage, setMainImage] = useState<ImageEntry | null>(() =>
    editingProduct?.image ? { preview: editingProduct.image, existing: editingProduct.image } : null
  );
  const [extraImages, setExtraImages] = useState<ImageEntry[]>(() =>
    (editingProduct?.images ?? []).map(img => ({ preview: img, existing: img }))
  );
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const mainFileRef = useRef<HTMLInputElement>(null);
  const extraFileRef = useRef<HTMLInputElement>(null);

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMainImage({ file, preview: URL.createObjectURL(file) });
    e.target.value = '';
  };

  const handleExtraFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const entries: ImageEntry[] = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setExtraImages(prev => [...prev, ...entries]);
    e.target.value = '';
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) errs.name = 'שדה חובה';
    if (!form.description.trim()) errs.description = 'שדה חובה';
    if (!form.price || isNaN(Number(form.price))) errs.price = 'מחיר לא תקין';
    if (!form.category.trim()) errs.category = 'שדה חובה';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('description', form.description.trim());
      fd.append('price', form.price);
      if (form.originalPrice) fd.append('originalPrice', form.originalPrice);
      fd.append('category', form.category);
      if (form.pages) fd.append('pages', form.pages);
      fd.append('featured', String(form.featured));
      fd.append('soldOut', String(form.soldOut));
      if (form.stock) fd.append('stock', form.stock);

      if (mainImage?.file) {
        fd.append('image', mainImage.file);
      } else if (mainImage?.existing) {
        fd.append('existingImage', mainImage.existing);
      }

      extraImages.forEach(entry => {
        if (entry.file) {
          fd.append('images', entry.file);
        } else if (entry.existing) {
          fd.append('existingImages', entry.existing);
        }
      });

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct.id}`, fd);
        onSaved('המוצר עודכן בהצלחה');
      } else {
        await axios.post('/api/products', fd);
        onSaved('המוצר נוסף בהצלחה');
      }
      onClose();
    } catch {
      onError('שגיאה בשמירת המוצר');
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = Array.from(new Set(products.map(p => p.category)));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={700}>{editingProduct ? 'עריכת מוצר' : 'הוספת מוצר חדש'}</DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 3 }}>
        <input ref={mainFileRef} type="file" hidden accept="image/*" onChange={handleMainFileChange} />
        <input ref={extraFileRef} type="file" hidden accept="image/*" multiple onChange={handleExtraFilesChange} />

        {/* Main image */}
        {mainImage ? (
          <Box sx={{ flexShrink: 0 }}>
            <Box component="img" src={mainImage.preview} alt="תצוגה מקדימה"
              sx={{ width: '100%', display: 'block', borderRadius: 2, border: '2px solid', borderColor: 'primary.light', objectFit: 'contain', maxHeight: 200 }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button size="small" variant="outlined" startIcon={<CloudUploadIcon />}
                onClick={() => mainFileRef.current?.click()}
                sx={{ gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}
              >
                החלף תמונה ראשית
              </Button>
              <Button size="small" color="error" onClick={() => setMainImage(null)}>הסר</Button>
            </Box>
          </Box>
        ) : (
          <Box
            onClick={() => mainFileRef.current?.click()}
            sx={{
              flexShrink: 0, minHeight: '140px', borderRadius: 2,
              border: '2px dashed', borderColor: 'grey.400', bgcolor: 'grey.50',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'border-color 0.2s, background 0.2s',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'grey.100' },
            }}
          >
            <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 2 }}>
              <CloudUploadIcon sx={{ fontSize: 40, color: 'grey.400', mb: 0.5 }} />
              <Typography variant="body2" fontWeight={600}>לחץ להעלאת תמונה ראשית</Typography>
              <Typography variant="caption" color="text.disabled">PNG, JPG, WEBP</Typography>
            </Box>
          </Box>
        )}

        {/* Extra images */}
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1, color: 'text.secondary' }}>
            תמונות נוספות (גלריה)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
            {extraImages.map((entry, i) => (
              <Box key={i} sx={{ position: 'relative', width: 72, height: 72 }}>
                <Box
                  component="img" src={entry.preview} alt={`תמונה ${i + 1}`}
                  sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 1.5, border: '1.5px solid', borderColor: 'divider' }}
                />
                <Tooltip title="הסר">
                  <IconButton
                    size="small" color="error"
                    onClick={() => setExtraImages(prev => prev.filter((_, j) => j !== i))}
                    sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', p: 0.25, '&:hover': { bgcolor: 'error.lighter' } }}
                  >
                    <DeleteIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
            <Box
              onClick={() => extraFileRef.current?.click()}
              sx={{
                width: 72, height: 72, borderRadius: 1.5, border: '2px dashed', borderColor: 'grey.400',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'grey.100' },
              }}
            >
              <CloudUploadIcon sx={{ color: 'grey.500', fontSize: 28 }} />
            </Box>
          </Box>
        </Box>

        <TextField label="שם המוצר" required fullWidth value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          error={!!formErrors.name} helperText={formErrors.name}
        />
        <TextField label="תיאור" required fullWidth multiline rows={3} value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          error={!!formErrors.description} helperText={formErrors.description}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField label="מחיר (₪)" required type="number" sx={{ flex: 1 }} value={form.price}
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            error={!!formErrors.price} helperText={formErrors.price} inputProps={{ min: 0 }}
          />
          <TextField label="מחיר לפני הנחה (₪)" type="number" sx={{ flex: 1 }} value={form.originalPrice}
            onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))}
            inputProps={{ min: 0 }} helperText="אופציונלי – יוצג עם פס"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Autocomplete freeSolo sx={{ flex: 1 }} options={categoryOptions} inputValue={form.category}
            onInputChange={(_, value) => setForm(f => ({ ...f, category: value }))}
            renderInput={params => (
              <TextField {...params} label="קטגוריה" required
                error={!!formErrors.category} helperText={formErrors.category ?? 'בחר קיימת או הקלד חדשה'}
              />
            )}
          />
          <TextField label="מספר עמודים" type="number" sx={{ flex: 1 }} value={form.pages}
            onChange={e => setForm(f => ({ ...f, pages: e.target.value }))} inputProps={{ min: 1 }}
          />
        </Box>
        <FormControlLabel
          control={<Checkbox checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} color="primary" />}
          label="מוצר מומלץ (יוצג בדף הבית)"
        />
        <FormControlLabel
          control={<Checkbox checked={form.soldOut} onChange={e => setForm(f => ({ ...f, soldOut: e.target.checked }))} color="error" />}
          label="אזל מהמלאי"
        />
        <TextField label="מלאי (עותקים)" type="number" fullWidth value={form.stock}
          onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
          inputProps={{ min: 0 }} helperText="ריק = ללא הגבלה"
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={saving}>ביטול</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ minWidth: 100 }}>
          {saving ? <CircularProgress size={20} color="inherit" /> : 'שמור'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;
