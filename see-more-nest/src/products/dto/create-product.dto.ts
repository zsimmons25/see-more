  export class CreateProductDto {
    name: string;
    brand: string;
    price: number;
    image?: string;
    category: string;
    isNew?: boolean;
    hasFreeShipping?: boolean;
  }