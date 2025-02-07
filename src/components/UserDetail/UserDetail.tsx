'use client';
import React, { useEffect, useState } from 'react';
import Style from './userdetail.module.css';
import { useParams, useRouter } from 'next/navigation';
import { IUser } from '@/models/userModel';
import { getUserById } from '@/services/apiUsers';
import { IOrder } from '@/models/orderModel';
import { getOrders } from '@/services/apiOrders'; // Yeni fonksiyon
import PageLoader from '../ui/PageLoader';
import PageHeader from '../ui/PageHeader';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function UserDetail() {
    const router = useRouter();
    const { userId } = useParams() as { userId: string };
    const [user, setUser] = useState<IUser | null>(null);
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const fetchedUser = await getUserById(userId);
                setUser(fetchedUser);

                const fetchedOrders = await getOrders(userId);
                setOrders(fetchedOrders);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId]);

    const handleOrderDetail = (orderId: string) => {
        router.push(`/orders/${orderId}`)
    }

    if (loading) return <PageLoader />;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={Style.userDetailPage}>
            <PageHeader title="User Detail" />
            <div className={Style.userInfo}>
                <p><span>Name:</span> {user?.name}</p>
                <p><span>Email:</span> {user?.email}</p>
                <p><span>Orders:</span> {orders.length}</p>
            </div>
            <div className={Style.usersOrders}>
                <h3>User's Orders</h3>
                {orders.length > 0 ? (
                    <div className={Style.usersTable}>
                    <Table>
                        <TableCaption>Orders</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className={Style.tableHead}>Created</TableHead>
                                <TableHead className={Style.tableHead}>Order Number</TableHead>
                                <TableHead className={Style.tableHead}>Products</TableHead>
                                <TableHead className={Style.tableHead}>Delivery</TableHead>
                                <TableHead className={Style.tableHead}>Status</TableHead>
                                <TableHead className={Style.tableHead}>Order Summary</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell className={Style.tableCell}>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className={Style.tableCell}>{order.orderNumber}</TableCell>
                                    <TableCell className={Style.tableCell}>{order.items.length}</TableCell>
                                    <TableCell className={Style.tableCell}>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell className={Style.tableCell}>{order.status}</TableCell>
                                    <TableCell className={Style.tableCell}><button onClick={() => handleOrderDetail(order._id)}>See Detail</button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </div>
                ) : (
                    <p>No orders found for this user.</p>
                )}
            </div>
        </div>
    );
}
