import { useState } from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FAQ_ITEMS } from '../data/faq.data';

const FaqSection = () => {
  const [expanded, setExpanded] = useState<number | false>(false);

  return (
  <Box sx={{ py: { xs: 5, md: 8 }, borderTop: '1px solid', borderColor: 'divider' }}>
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={2}>
          שאלות נפוצות
        </Typography>
        <Typography variant="h4" fontWeight={700} sx={{ mt: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
          שאלות ותשובות
        </Typography>
      </Box>
      {FAQ_ITEMS.map((item, i) => (
        <Accordion
          key={i}
          expanded={expanded === i}
          onChange={(_, isExpanded) => setExpanded(isExpanded ? i : false)}
          disableGutters
          elevation={0}
          sx={{ border: '1px solid', borderColor: 'divider', mb: 1, borderRadius: '8px !important', '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontWeight: 600 }}>
            <Typography fontWeight={600}>{item.q}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9 }}>
              {item.a}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  </Box>
  );
};

export default FaqSection;
