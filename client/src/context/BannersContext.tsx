/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface Banner {
  id: string;
  title: string;
  text?: string;
  bannerLink?: string;
  link?: string;
  linkText?: string;
  bgColor: string;
  bgImage?: string;
  position: number;
  active: boolean;
}

interface BannersContextValue {
  banners: Banner[];
  refetch: () => void;
}

const BannersContext = createContext<BannersContextValue>({ banners: [], refetch: () => {} });

export const BannersProvider = ({ children }: { children: React.ReactNode }) => {
  const [banners, setBanners] = useState<Banner[]>([]);

  const fetchBanners = () => {
    axios.get<Banner[]>('/api/banners').then(r => setBanners(r.data)).catch(() => {});
  };

  useEffect(() => { fetchBanners(); }, []);

  return (
    <BannersContext.Provider value={{ banners, refetch: fetchBanners }}>
      {children}
    </BannersContext.Provider>
  );
};

export const useBanners = () => useContext(BannersContext);
