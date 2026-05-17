import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import bannerImg from '../../assets/design/banner_sale_books.jpg';

const TeachersBanner = () => (
  <Box
    component={Link}
    to="/products"
    sx={{ display: 'block', textDecoration: 'none' }}
  >
    <Box
      component="img"
      src={bannerImg}
      alt="רכישה מרוכזת למורים – לחצו לפרטים"
      sx={{ width: '100%', display: 'block' }}
    />
  </Box>
);

export default TeachersBanner;
