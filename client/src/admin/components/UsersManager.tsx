import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Button, IconButton, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useAuth } from '../../auth/context/AuthContext';

interface AdminUser {
  id: string;
  username: string;
  role: 'owner' | 'admin';
  phone?: string;
  email?: string;
  createdAt: string;
}

const UsersManager = () => {
  const { username: currentUser, role: currentRole } = useAuth();
  const isOwner = currentRole === 'owner';
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);

  const [resetUser, setResetUser] = useState<AdminUser | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetting, setResetting] = useState(false);

  const [ownPwOpen, setOwnPwOpen] = useState(false);
  const [ownPwNew, setOwnPwNew] = useState('');
  const [ownPwError, setOwnPwError] = useState('');
  const [ownPwSaving, setOwnPwSaving] = useState(false);

  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editError, setEditError] = useState('');
  const [editing, setEditing] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get<AdminUser[]>('/api/auth/users');
      setUsers(data);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async () => {
    if (!newUsername.trim()) { setAddError('שם משתמש חובה'); return; }
    if (newPassword.length < 6) { setAddError('סיסמה חייבת להכיל לפחות 6 תווים'); return; }
    setAdding(true);
    try {
      await axios.post('/api/auth/users', {
        username: newUsername.trim(), password: newPassword,
        phone: newPhone.trim() || undefined, email: newEmail.trim() || undefined,
      });
      setAddOpen(false);
      setNewUsername(''); setNewPassword(''); setNewPhone(''); setNewEmail(''); setAddError('');
      fetchUsers();
    } catch (e) {
      setAddError(axios.isAxiosError(e) ? (e.response?.data?.message ?? 'שגיאה') : 'שגיאה');
    } finally { setAdding(false); }
  };

  const handleReset = async () => {
    if (!resetUser) return;
    if (resetPassword.length < 6) { setResetError('סיסמה חייבת להכיל לפחות 6 תווים'); return; }
    setResetting(true);
    try {
      await axios.post(`/api/auth/users/${resetUser.id}/reset-password`, { newPassword: resetPassword });
      setResetUser(null); setResetPassword(''); setResetError('');
    } catch (e) {
      setResetError(axios.isAxiosError(e) ? (e.response?.data?.message ?? 'שגיאה') : 'שגיאה');
    } finally { setResetting(false); }
  };

  const handleEdit = async () => {
    if (!editUser) return;
    setEditing(true);
    try {
      await axios.patch(`/api/auth/users/${editUser.id}`, {
        phone: editPhone.trim() || undefined,
        email: editEmail.trim() || undefined,
      });
      setEditUser(null); setEditPhone(''); setEditEmail(''); setEditError('');
      fetchUsers();
    } catch (e) {
      setEditError(axios.isAxiosError(e) ? (e.response?.data?.message ?? 'שגיאה') : 'שגיאה');
    } finally { setEditing(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/auth/users/${deleteId}`);
      setDeleteId(null); fetchUsers();
    } catch { /* ignore */ } finally { setDeleting(false); }
  };

  const handleOwnPassword = async () => {
    if (ownPwNew.length < 6) { setOwnPwError('סיסמה חייבת להכיל לפחות 6 תווים'); return; }
    setOwnPwSaving(true);
    try {
      await axios.post('/api/auth/change-password', { newPassword: ownPwNew });
      setOwnPwOpen(false); setOwnPwNew(''); setOwnPwError('');
    } catch (e) {
      setOwnPwError(axios.isAxiosError(e) ? (e.response?.data?.message ?? 'שגיאה') : 'שגיאה');
    } finally { setOwnPwSaving(false); }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>ניהול משתמשים</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => { setOwnPwNew(''); setOwnPwError(''); setOwnPwOpen(true); }}>
            שנה סיסמה שלי
          </Button>
          {isOwner && (
            <Button variant="contained" startIcon={<AddIcon />}
              onClick={() => { setNewUsername(''); setNewPassword(''); setNewPhone(''); setNewEmail(''); setAddError(''); setAddOpen(true); }}
              sx={{ gap: 1, '& .MuiButton-startIcon': { margin: 0 } }}>
              הוסף מנהל
            </Button>
          )}
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              <TableCell sx={{ fontWeight: 700 }}>שם משתמש</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>תפקיד</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>תאריך יצירה</TableCell>
              {isOwner && <TableCell align="center" sx={{ fontWeight: 700 }}>פעולות</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id} hover>
                <TableCell>
                  <Typography fontWeight={600} variant="body2">
                    {u.username}
                    {u.username === currentUser && <Typography component="span" variant="caption" color="text.secondary"> (אתה)</Typography>}
                  </Typography>
                  {u.phone && <Typography variant="caption" color="text.secondary" display="block">📞 {u.phone}</Typography>}
                  {u.email && <Typography variant="caption" color="text.secondary" display="block">✉️ {u.email}</Typography>}
                </TableCell>
                <TableCell>
                  {u.role === 'owner'
                    ? <Chip label="מפתח" color="primary" size="small" />
                    : <Chip label="מנהל" size="small" />}
                </TableCell>
                <TableCell>{new Date(u.createdAt).toLocaleDateString('he-IL')}</TableCell>
                {isOwner && (
                  <TableCell align="center">
                    {u.role !== 'owner' && (
                      <>
                        <Tooltip title="עריכה">
                          <IconButton onClick={() => { setEditUser(u); setEditPhone(u.phone ?? ''); setEditEmail(u.email ?? ''); setEditError(''); }}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="איפוס סיסמה">
                          <IconButton color="primary" onClick={() => { setResetUser(u); setResetPassword(''); setResetError(''); }}>
                            <LockResetIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="מחיקה">
                          <IconButton color="error" onClick={() => setDeleteId(u.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add user */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>הוספת מנהל</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '20px !important' }}>
          <TextField label="שם משתמש" fullWidth value={newUsername} onChange={e => setNewUsername(e.target.value)} />
          <TextField label="סיסמה" fullWidth type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} helperText="לפחות 6 תווים" />
          <TextField label="טלפון (אופציונלי)" fullWidth value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="052-1234567" />
          <TextField label="מייל (אופציונלי)" fullWidth value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="example@email.com" />
          {addError && <Alert severity="error">{addError}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setAddOpen(false)} disabled={adding}>ביטול</Button>
          <Button variant="contained" onClick={handleAdd} disabled={adding} sx={{ minWidth: 80 }}>
            {adding ? <CircularProgress size={20} color="inherit" /> : 'הוסף'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit user */}
      <Dialog open={!!editUser} onClose={() => setEditUser(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>עריכת מנהל — {editUser?.username}</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '20px !important' }}>
          <TextField label="טלפון (אופציונלי)" fullWidth value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="052-1234567" />
          <TextField label="מייל (אופציונלי)" fullWidth value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="example@email.com" />
          {editError && <Alert severity="error">{editError}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setEditUser(null)} disabled={editing}>ביטול</Button>
          <Button variant="contained" onClick={handleEdit} disabled={editing} sx={{ minWidth: 80 }}>
            {editing ? <CircularProgress size={20} color="inherit" /> : 'שמור'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset password */}
      <Dialog open={!!resetUser} onClose={() => setResetUser(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>איפוס סיסמה — {resetUser?.username}</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '20px !important' }}>
          <TextField label="סיסמה חדשה" fullWidth type="password" value={resetPassword} onChange={e => setResetPassword(e.target.value)} helperText="לפחות 6 תווים" />
          {resetError && <Alert severity="error">{resetError}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setResetUser(null)} disabled={resetting}>ביטול</Button>
          <Button variant="contained" onClick={handleReset} disabled={resetting} sx={{ minWidth: 80 }}>
            {resetting ? <CircularProgress size={20} color="inherit" /> : 'אפס'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change own password */}
      <Dialog open={ownPwOpen} onClose={() => setOwnPwOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>שינוי הסיסמה שלי</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '20px !important' }}>
          <TextField label="סיסמה חדשה" fullWidth type="password" value={ownPwNew} onChange={e => setOwnPwNew(e.target.value)} helperText="לפחות 6 תווים" />
          {ownPwError && <Alert severity="error">{ownPwError}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setOwnPwOpen(false)} disabled={ownPwSaving}>ביטול</Button>
          <Button variant="contained" onClick={handleOwnPassword} disabled={ownPwSaving} sx={{ minWidth: 80 }}>
            {ownPwSaving ? <CircularProgress size={20} color="inherit" /> : 'שמור'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>מחיקת מנהל</DialogTitle>
        <DialogContent><Typography>האם למחוק את המנהל לצמיתות?</Typography></DialogContent>
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

export default UsersManager;