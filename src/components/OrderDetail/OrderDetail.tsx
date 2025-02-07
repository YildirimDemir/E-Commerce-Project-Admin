'use client';
import React, { useEffect, useState } from 'react';
import Style from './orderdetail.module.css';
import { useParams, useRouter } from 'next/navigation';
import { IOrder } from '@/models/orderModel';
import { getOrder, updateOrderStatus } from '@/services/apiOrders';
import { getProductById } from '@/services/apiProducts';
import toast from 'react-hot-toast';
import PageLoader from '../ui/PageLoader';
import Image from 'next/image';
import { FaRegCopy } from 'react-icons/fa';
import PageHeader from '../ui/PageHeader';

export default function OrderDetail() {
    const router = useRouter();
    const { orderId } = useParams() as { orderId: string };
    const [order, setOrder] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [status, setStatus] = useState<string>('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const fetchedOrder = await getOrder(orderId);
                setOrder(fetchedOrder);
                setStatus(fetchedOrder.status);
                const productPromises = fetchedOrder.items.map(async (item) => {
                    const product = await getProductById(item.product._id.toString());
                    return { ...item, product };
                });
                const updatedItems = await Promise.all(productPromises);
                setProducts(updatedItems);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success(`Copied: ${text}`);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };

    const handleProductPage = (productId: string) => {
        router.push(`/products/${productId}`);
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            setStatus(newStatus);

            const updatedOrder = await updateOrderStatus(orderId, newStatus);
    
            if (updatedOrder) {
                setOrder((prevOrder) => {
                    if (prevOrder) {
                        return {
                            ...prevOrder,
                            status: updatedOrder.status,
                            deliveryDate: updatedOrder.deliveryDate || prevOrder.deliveryDate,
                        } as IOrder;
                    }
                    return prevOrder;
                });
            }
    
            toast.success('Order status updated successfully!');
        } catch (err) {
            toast.error('Failed to update order status');
        }
    };

    if (loading) return <PageLoader />;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={Style.orderDetailPage}>
            <PageHeader title='Order Detail' />
            <div className={Style.orderDetailsArea}>
                <div className={Style.orderDetailHeader}>
                    <h1 onClick={() => handleCopy(order?.orderNumber || '')}>Order Number: <FaRegCopy /> {order?.orderNumber}</h1>
                    <h2>Total Price: ${order?.totalPrice}</h2>
                </div>
                <div className={Style.orderItemsArea}>
                    <h3>Ordered Products</h3>
                    <div className={Style.orderItems}>
                        {products.map((item) => (
                            <div key={`${item.product._id}-${item.quantity}`} className={Style.cartItem} onClick={() => handleProductPage(item.product._id)}>
                                <div className={Style.cartItemInfoSection}>
                                    <div className={Style.cartItemImage}>
                                        <Image src={item.product.mainImage} alt={item.product.name} width={100} height={100} />
                                    </div>
                                    <div>
                                        <div className={Style.cartItemName}>
                                            <p>{item.product.name}</p>
                                        </div>
                                        <div className={Style.cartItemDetails}>
                                            <p>Price: ${item.product.price}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Total: ${item.product.price * item.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={Style.statusInfo}>
                    <p>Status:</p>
                    <select value={status} onChange={(e) => handleStatusChange(e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </div>
                <div className={Style.adressInfo}>
                    <h2>Address</h2>
                    {order?.address && (
                        <div>
                            <p>Receiver: {order.address.fullName}</p>
                            <p>{order.address.addressLine}</p>
                            {order.address.apartment && <p>Apartment: {order.address.apartment}</p>}
                            <p>{order.address.city}, {order.address.state} {order.address.zipPostalCode}</p>
                            <p>{order.address.country}</p>
                        </div>
                    )}
                </div>
                <div className={Style.dateInfo}>
                    <p>Created At: {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                    <p>Delivery Date: {order?.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}</p>
                </div>
            </div>
        </div>
    );
}