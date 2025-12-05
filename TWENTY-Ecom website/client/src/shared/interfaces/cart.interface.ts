export interface CartInterface {
  _id?: string;
  product: {
    id: number;
    sku: string;
    name: string;
    list_price: number;
    sale_price: number;
    image_url: string;
  };
  quantity: number;
  currentPrice: number;
}
