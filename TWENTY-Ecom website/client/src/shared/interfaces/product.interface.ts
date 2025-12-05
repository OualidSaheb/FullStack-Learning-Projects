export interface ProductInterface {
  id: number;
  sku: string;
  name: string;
  description: string;
  list_price: number;
  sale_price: number;
  category: string;
  average_product_rating: number;
  image_url: string;
  brand: string;
  num_reviews: number;
}

export interface FilterInterface{
  name:string
}