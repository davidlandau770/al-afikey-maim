import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Box, Container, Typography, Breadcrumbs, Card, CardContent,
  CardActionArea, Chip, Divider, CircularProgress,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArticleIcon from "@mui/icons-material/Article";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<BlogPost[]>("/api/blog").then(r => setPosts(r.data)).finally(() => setLoading(false));
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" });

  const excerpt = (html: string) =>
    html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160) + "...";

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
      <Breadcrumbs
        separator={<NavigateBeforeIcon fontSize="small" />}
        sx={{ mb: 3, color: "text.secondary", fontSize: "0.875rem" }}
      >
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>דף הבית</Link>
        <Typography fontSize="0.875rem" color="text.primary">בלוג</Typography>
      </Breadcrumbs>

      <Typography variant="h3" fontWeight={800} color="primary.dark"
        sx={{ mb: 0.5, fontSize: { xs: "1.8rem", md: "2.4rem" } }}>
        בלוג
      </Typography>
      <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ mb: 4 }}>
        מאמרים וטיפים לפיתוח קריאה וכתיבה
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {loading && <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>}

      {!loading && posts.length === 0 && (
        <Typography color="text.secondary" textAlign="center" sx={{ py: 8 }}>אין כתבות עדיין</Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {posts.map(post => (
          <Card key={post.id} variant="outlined" sx={{ borderRadius: 2 }}>
            <CardActionArea component={Link} to={`/blog/${post.id}`}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {post.image && (
                    <Box component="img" src={post.image} alt={post.title}
                      sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: 1, flexShrink: 0 }} />
                  )}
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <ArticleIcon fontSize="small" color="primary" />
                      <Chip label={formatDate(post.createdAt)} size="small" variant="outlined" sx={{ fontSize: "0.75rem" }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 0.5 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {excerpt(post.content)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default BlogPage;