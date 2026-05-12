import { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import axios from "axios";
import { Box, Container, Typography, Breadcrumbs, Divider, CircularProgress } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
}

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    axios.get<BlogPost>(`/api/blog/${id}`)
      .then(r => setPost(r.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}><CircularProgress /></Box>;
  if (notFound || !post) return <Navigate to="/blog" replace />;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
      <Breadcrumbs
        separator={<NavigateBeforeIcon fontSize="small" />}
        sx={{ mb: 3, color: "text.secondary", fontSize: "0.875rem" }}
      >
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>דף הבית</Link>
        <Link to="/blog" style={{ color: "inherit", textDecoration: "none" }}>בלוג</Link>
        <Typography fontSize="0.875rem" color="text.primary">{post.title}</Typography>
      </Breadcrumbs>

      <Typography variant="h3" fontWeight={800} color="primary.dark"
        sx={{ mb: 1, fontSize: { xs: "1.6rem", md: "2.2rem" }, lineHeight: 1.4 }}>
        {post.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {formatDate(post.createdAt)}
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {post.image && (
        <Box component="img" src={post.image} alt={post.title}
          sx={{ width: "100%", maxHeight: 400, objectFit: "cover", borderRadius: 2, mb: 4 }} />
      )}

      <Box
        dangerouslySetInnerHTML={{ __html: post.content }}
        sx={{
          '& p': { lineHeight: 2, mb: 1.5, color: 'text.secondary' },
          '& h2': { fontSize: '1.4rem', fontWeight: 700, color: 'primary.dark', mt: 4, mb: 1.5 },
          '& h3': { fontSize: '1.15rem', fontWeight: 700, color: 'text.primary', mt: 3, mb: 1 },
          '& ul, & ol': { pr: 3, mb: 1.5, color: 'text.secondary' },
          '& li': { lineHeight: 2, mb: 0.5 },
          '& strong': { fontWeight: 700, color: 'text.primary' },
          '& em': { fontStyle: 'italic' },
        }}
      />
    </Container>
  );
};

export default BlogPostPage;