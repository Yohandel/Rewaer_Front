export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  physicalState: string;
  categoryId: number;
  categoryName: string;
  stock: number;
  owner: string;
  ownerId: number;
  imagenUrl: string;
  estado:string
};