import { RatingDto } from './rating.dto';

export class ProductDto {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  reviews: RatingDto[];
  createdAt: Date;
  updatedAt: Date;
}
