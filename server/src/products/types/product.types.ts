export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  featured: boolean;
  pages?: number;
  image?: string;
  images?: string[];
  soldOut?: boolean;
  stock?: number;
}
