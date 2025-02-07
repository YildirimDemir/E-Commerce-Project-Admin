import { IAddress, IOrder } from "@/models/orderModel";

export const getOrders = async (search?: string, page?: number, limit?: number, sort?: string): Promise<IOrder[]> => {
    try {
      let url = '/api/orders';
      const queryParams = new URLSearchParams();
  
      if (search) queryParams.append('search', search);
      if (page) queryParams.append('page', page.toString());
      if (limit !== undefined) queryParams.append('limit', limit.toString());
      if (sort) queryParams.append('sort', sort);
  
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
  
      const orders: IOrder[] = await response.json();
      return orders;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred.');
    }
  };
  

export const getFilteredOrders = async (query: string): Promise<IOrder[]> => {
    try {
        const response = await fetch(`/api/orders/search?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch filtered orders');
        }

        const orders: IOrder[] = await response.json();
        return orders;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unknown error occurred.');
    }
};
export const getOrder = async (orderId: string): Promise<IOrder> => {
    try {
        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch order');
        }

        const order: IOrder = await response.json();
        return order;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unknown error occurred.');
    }
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<IOrder> => {
    try {
        const response = await fetch(`/api/orders/${orderId}/update-status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error('Failed to update order status');
        }

        const updatedOrder: IOrder = await response.json();
        return updatedOrder;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unknown error occurred.');
    }
};