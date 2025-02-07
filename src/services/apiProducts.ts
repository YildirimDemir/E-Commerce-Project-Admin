import { IProduct } from "@/models/productModel";

export const getAllProducts = async (filters?: Record<string, string | string[]>): Promise<IProduct[]> => {
  try {
    let query = '';
    if (filters) {
      query = Object.entries(filters)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}=${value.join(',')}`;
          } else {
            return `${key}=${value}`;
          }
        })
        .join('&');
    }

    const response = await fetch(`/api/products${query ? '?' + query : ''}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch products.");
    }

    const products: IProduct[] = await response.json();
    return products;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred.");
  }
};


export const createProduct = async (newProduct: {
  name: string;
  productCode: string;
  category: string;
  mainImage: string;
  images: string[];
  price: number;
  sizes: string[];
  color: string;
  brand: string;
  stock: number;
  inStock: boolean;
  gender: string;
}): Promise<IProduct> => {
  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create product.");
    }

    const product: IProduct = await response.json();
    return product;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred.");
  }
};

export const getProductById= async (productId: string): Promise<IProduct> => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch product.");
      }
  
      const product: IProduct = await response.json();
      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred.");
    }
};
  
export const updateProductById = async (
    productId: string,
    updates: Partial<{
      name: string;
      productCode: string;
      category: string;
      price: number;
      sizes: number[];
      color: string;
      brand: string;
      mainImage: string;
      images: string[];
      inStock: boolean;
      stockCount: number;
    }>
  ): Promise<IProduct> => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product.");
      }
  
      const updatedProduct: IProduct = await response.json();
      return updatedProduct;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred.");
    }
};
  
export const deleteProductById = async (productId: string): Promise<{ message: string }> => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product.");
      }
  
      const result: { message: string } = await response.json();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred.");
    }
};

export const searchProducts = async (query: string): Promise<IProduct[]> => {
  try {
    const response = await fetch(`/api/products/search?query=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to search products.");
    }

    const products: IProduct[] = await response.json();
    return products;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred.");
  }
};