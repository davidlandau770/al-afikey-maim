export interface Banner {
  id: string;
  title: string;
  text?: string;
  bannerLink?: string;
  link?: string;
  linkText?: string;
  bgColor: string;
  bgImage?: string;
  imageHeight?: number;
  position: number;
  active: boolean;
}
