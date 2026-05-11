import { Box, Container, Typography, Button } from '@mui/material';
import { useBanners } from '../../context/BannersContext';

interface Props {
  position: number;
}

const BannerSlot = ({ position }: Props) => {
  const { banners } = useBanners();
  const active = banners.filter(b => b.active && b.position === position);
  if (active.length === 0) return null;

  return (
    <>
      {active.map(banner => {
        const hasColor   = !!banner.bgColor;
        const hasImage   = !!banner.bgImage;
        const isExternal = (url: string) => url.startsWith('http');

        const content = (
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, width: '100%', textAlign: 'center' }}>
            {banner.title && (
              <Typography variant="h6" fontWeight={700}
                sx={{ color: hasColor || hasImage ? 'white' : 'text.primary', mb: banner.text ? 1 : 0 }}>
                {banner.title}
              </Typography>
            )}
            {banner.text && (
              <Typography variant="body1"
                sx={{ color: hasColor || hasImage ? 'rgba(255,255,255,0.9)' : 'text.secondary', mb: banner.link ? 2 : 0 }}>
                {banner.text}
              </Typography>
            )}
            {banner.link && banner.linkText && (
              <Button
                variant="outlined"
                href={banner.link}
                target={isExternal(banner.link) ? '_blank' : undefined}
                rel={isExternal(banner.link) ? 'noopener noreferrer' : undefined}
                onClick={e => e.stopPropagation()}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.7)',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                {banner.linkText}
              </Button>
            )}
          </Container>
        );

        // Image banner — natural aspect ratio
        const inner = hasImage ? (
          <Box sx={{ position: 'relative', width: '100%', ...(banner.bannerLink && { cursor: 'pointer' }) }}>
            <Box component="img" src={banner.bgImage} alt={banner.title || ''}
              sx={{ width: '100%', display: 'block' }} />
            {hasColor && (
              <Box sx={{ position: 'absolute', inset: 0, bgcolor: banner.bgColor, opacity: 0.55 }} />
            )}
            <Box sx={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {content}
            </Box>
          </Box>
        ) : (
          // Color-only banner
          <Box sx={{
            position: 'relative',
            display: 'flex', alignItems: 'center',
            py: { xs: 2.5, md: 3.5 },
            ...(hasColor && { bgcolor: banner.bgColor }),
            ...(banner.bannerLink && { cursor: 'pointer' }),
          }}>
            {content}
          </Box>
        );

        return banner.bannerLink ? (
          <Box
            key={banner.id}
            component="a"
            href={banner.bannerLink}
            target={isExternal(banner.bannerLink) ? '_blank' : undefined}
            rel={isExternal(banner.bannerLink) ? 'noopener noreferrer' : undefined}
            sx={{ display: 'block', textDecoration: 'none' }}
          >
            {inner}
          </Box>
        ) : (
          <Box key={banner.id}>{inner}</Box>
        );
      })}
    </>
  );
};

export default BannerSlot;
