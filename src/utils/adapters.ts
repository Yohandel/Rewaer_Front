import { ProductResponse } from '../interfaces/IProduct';
import { Article, Product, CartItem, CartItemApi } from '../Types';

export const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80";

export function adaptArticleToProduct(a: Article): ProductResponse {
    return {
        id: a.id,
        name: a.name,
        categoryName: a.categoryName,
        physicalState: a.physicalState,
        price: a.price,
        stock: a.stock,
        Owner: a.owner,
        image: PLACEHOLDER_IMAGE,
        description: a.description,
        categoryId: a.categoryId,
        OwnerId: a.ownerId,
    };
}

export function adaptCartItem(item: CartItemApi, knownProducts: ProductResponse[]): CartItem {
    const product =
        knownProducts.find(p => p.id === item.articleId) ??
        {
            id: item.articleId,
            name: item.name,
            categoryName: "",
            physicalState: "",
            price: item.price,
            originalPrice: null,
            offer: false,
            stock: item.quantity,
            Owner: "",
            image: PLACEHOLDER_IMAGE,
            description: "",
            categoryId: 0,
            OwnerId: 0,

        };

    return { product, qty: item.quantity, cartDetailId: item.cartDetailId };
}