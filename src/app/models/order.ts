import { User } from './user';

export interface Order {
  id: number;
  orderDate: string | Date; 
  user: User; 
}
