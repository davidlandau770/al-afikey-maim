import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Product } from '../../data/products';
import { CATEGORY_GRADIENTS } from '../../data/categoryGradients';

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductTable = ({ products, onEdit, onDelete }: Props) => (
  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
    <Table>
      <TableHead>
        <TableRow sx={{ bgcolor: 'background.default' }}>
          <TableCell align="center">תמונה</TableCell>
          <TableCell align="center">שם המוצר</TableCell>
          <TableCell align="center">קטגוריה</TableCell>
          <TableCell align="center">מחיר</TableCell>
          <TableCell align="center">מומלץ</TableCell>
          <TableCell align="center">פעולות</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map(p => (
          <TableRow key={p.id} hover>
            <TableCell align="center">
              <Box
                sx={{
                  width: 56, height: 56, borderRadius: 1.5, flexShrink: 0, mx: 'auto',
                  background: p.image ? 'none' : (CATEGORY_GRADIENTS[p.category] ?? CATEGORY_GRADIENTS['לימוד']),
                  backgroundImage: p.image ? `url(${p.image})` : undefined,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }}
              />
            </TableCell>
            <TableCell align="center">
              <Typography fontWeight={600}>{p.name}</Typography>
              {p.originalPrice && <Typography variant="caption" color="text.secondary">מחיר מקורי: ₪{p.originalPrice}</Typography>}
            </TableCell>
            <TableCell align="center"><Chip label={p.category} size="small" /></TableCell>
            <TableCell align="center"><Typography fontWeight={600} color="primary">₪{p.price}</Typography></TableCell>
            <TableCell align="center">{p.featured ? <Chip label="כן" color="success" size="small" /> : <Chip label="לא" size="small" />}</TableCell>
            <TableCell align="center">
              <Tooltip title="עריכה"><IconButton color="primary" onClick={() => onEdit(p)}><EditIcon /></IconButton></Tooltip>
              <Tooltip title="מחיקה"><IconButton color="error" onClick={() => onDelete(p.id)}><DeleteIcon /></IconButton></Tooltip>
            </TableCell>
          </TableRow>
        ))}
        {products.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>אין מוצרים עדיין</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default ProductTable;