export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "modaut-phonologit",
    title: "גלי את הסוד איך לעזור לילד שלך להצליח ברכישת הקריאה",
    excerpt: "כיצד מודעות פונולוגית מסייעת לילדים לרכוש קריאה בקלות, ואיך ניתן לפתח אותה בחיי היומיום תוך כדי משחק.",
    date: "12 במאי 2026",
  },
];