export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface OrderBody {
  customer: {
    name: string;
    phone: string;
    email: string;
    zip?: string;
  };
  shipping: {
    type: string;
    cost: number;
    address: string;
    city?: string;
    street?: string;
  };
  items: OrderItem[];
  total: number;
  notes?: string;
}