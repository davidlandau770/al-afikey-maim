import { useState } from 'react';
import axios from 'axios';
import { Box, Container, Typography, Button, Alert, Snackbar, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../auth/context/AuthContext';
import { useProducts } from '../../context/ProductsContext';
import type { Product } from '../../data/products';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import BannerManager from '../components/BannerManager';
import GamesManager from '../components/GamesManager';
import UsersManager from '../components/UsersManager';
import BlogManager from '../components/BlogManager';

const AdminPage = () => {
  const { logout } = useAuth();
  const { products, refetch } = useProducts();
  const [tab, setTab] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({
    open: false, msg: '', severity: 'success',
  });

  const showSnack = (msg: string, severity: 'success' | 'error' = 'success') =>
    setSnackbar({ open: true, msg, severity });

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/products/${deleteId}`);
      showSnack('המוצר נמחק');
      setDeleteId(null);
      refetch();
    } catch {
      showSnack('שגיאה במחיקת המוצר', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>ניהול</Typography>
        <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={logout}
          sx={{ gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}>
          יציאה
        </Button>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="מוצרים" />
        <Tab label="באנרים" />
        <Tab label="משחקים" />
        <Tab label="בלוג" />
        <Tab label="משתמשים" />
      </Tabs>

      {tab === 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button
              variant="contained" startIcon={<AddIcon />}
              onClick={() => { setEditingProduct(null); setFormOpen(true); }}
              sx={{ gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}
            >
              הוסף מוצר
            </Button>
          </Box>
          <ProductTable products={products} onEdit={p => { setEditingProduct(p); setFormOpen(true); }} onDelete={setDeleteId} />
          <ProductForm
            key={`${editingProduct?.id ?? 'new'}-${String(formOpen)}`}
            open={formOpen} editingProduct={editingProduct} products={products}
            onClose={() => setFormOpen(false)}
            onSaved={msg => { showSnack(msg); refetch(); }}
            onError={msg => showSnack(msg, 'error')}
          />
          <DeleteConfirmDialog open={!!deleteId} deleting={deleting} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
        </>
      )}

      {tab === 1 && <BannerManager />}
      {tab === 2 && <GamesManager />}
      {tab === 3 && <BlogManager />}
      {tab === 4 && <UsersManager />}

      <Snackbar
        open={snackbar.open} autoHideDuration={3500}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPage;
