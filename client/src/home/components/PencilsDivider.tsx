import { Box } from '@mui/material';
import pencilsImg from '../../assets/design/רקע אפרונות.png';

const PencilsDivider = () => (
  <Box sx={{ lineHeight: 0, overflow: 'hidden', mt: -0.5 }}>
    <Box
      component="img"
      src={pencilsImg}
      alt=""
      aria-hidden="true"
      sx={{
        width: '100%',
        display: 'block',
        maxHeight: { xs: 64, md: 80 },
        objectFit: 'cover',
        objectPosition: 'top center',
      }}
    />
  </Box>
);

export default PencilsDivider;
