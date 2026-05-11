export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'לימוד' | 'חגים' | 'ילדים' | string;
  featured: boolean;
  pages?: number;
  image?: string;
  images?: string[];
  soldOut?: boolean;
  stock?: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'חוברת לימוד – ספר בראשית',
    description: 'מסע בפרשיות ספר בראשית עם שאלות עמוקות, דיון ופעילויות ייחודיות לכל הגיל',
    price: 45,
    category: 'לימוד',
    featured: true,
    pages: 64,
  },
  {
    id: '2',
    name: 'חוברת לימוד – ספר שמות',
    description: 'גאולה ומסירות נפש – חוברת לימוד מעשירה לספר שמות עם תוכן עמוק ומחשבות',
    price: 45,
    category: 'לימוד',
    featured: false,
    pages: 64,
  },
  {
    id: '3',
    name: 'הגדה של פסח',
    description: 'הגדה של פסח מיוחדת עם ביאורים, סיפורים מרתקים ופעילויות לכל בני הבית',
    price: 55,
    category: 'חגים',
    featured: true,
    pages: 80,
  },
  {
    id: '4',
    name: 'חוברת חגי תשרי',
    description: 'ראש השנה, יום כיפור, סוכות ושמחת תורה – עיון ולימוד לכל בני המשפחה',
    price: 40,
    category: 'חגים',
    featured: true,
    pages: 56,
  },
  {
    id: '5',
    name: 'חוברת שבועות',
    description: 'קבלת התורה וחג השבועות – חוברת לימוד ועיון מעמיק',
    price: 35,
    category: 'חגים',
    featured: false,
    pages: 48,
  },
  {
    id: '6',
    name: 'חוברת פורים ומגילת אסתר',
    description: 'ניסים נסתרים – עיון מעמיק במגילת אסתר ואמונה בהשגחה האלוקית',
    price: 38,
    category: 'חגים',
    featured: false,
    pages: 52,
  },
  {
    id: '7',
    name: 'חוברת ילדים – חגי ישראל',
    description: 'חוברת צבעונית ומהנה לילדים על חגי ישראל, פעילויות ואיורים מקסימים',
    price: 30,
    category: 'ילדים',
    featured: true,
    pages: 40,
  },
  {
    id: '8',
    name: 'חוברת לימוד – ספר במדבר',
    description: 'הליכה במדבר בעקבות האמונה – לימוד ועיון בספר במדבר',
    price: 45,
    category: 'לימוד',
    featured: false,
    pages: 64,
  },
];