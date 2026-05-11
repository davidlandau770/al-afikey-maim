import { Box, Tooltip } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const WA_URL =
  "https://api.whatsapp.com/send?phone=972523190491&text=%D7%A4%D7%A0%D7%99%D7%94%20%D7%9E%D7%90%D7%AA%D7%A8%20%D7%94%D7%90%D7%99%D7%A0%D7%98%D7%A8%D7%A0%D7%98%20";

const WhatsAppFab = () => (
  <Tooltip title="שלח הודעה בוואטסאפ" placement="right">
    <Box
      component="a"
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="פנייה בוואטסאפ"
      sx={{
        position: "fixed",
        bottom: 28,
        left: 28,
        zIndex: 1300,
        width: 56,
        height: 56,
        borderRadius: "50%",
        bgcolor: "#25D366",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(0,0,0,0.22)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "scale(1.1)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
        },
      }}
    >
      <WhatsAppIcon sx={{ fontSize: 30 }} />
    </Box>
  </Tooltip>
);

export default WhatsAppFab;
