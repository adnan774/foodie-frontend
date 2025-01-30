import { Order } from './order';
import { Dish } from './dish';

export interface OrderItem {
  id: number;
  order: Order;
  dish: Dish; 
  quantity: number;
  price: number; 
}
