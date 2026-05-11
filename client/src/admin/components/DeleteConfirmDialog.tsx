import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from '@mui/material';

interface Props {
  open: boolean;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog = ({ open, deleting, onClose, onConfirm }: Props) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle fontWeight={700}>מחיקה</DialogTitle>
    <DialogContent>
      <Typography>האם למחוק לצמיתות? פעולה זו אינה הפיכה.</Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
      <Button onClick={onClose} disabled={deleting}>ביטול</Button>
      <Button variant="contained" color="error" onClick={onConfirm} disabled={deleting} sx={{ minWidth: 80 }}>
        {deleting ? <CircularProgress size={20} color="inherit" /> : 'מחק'}
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmDialog;
