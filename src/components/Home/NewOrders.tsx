'use client';
import { IOrder } from '@/models/orderModel'
import React, { useEffect, useState } from 'react'
import Style from './neworders.module.css'
import Loader from '../ui/Loader';
import { getOrders } from '@/services/apiOrders';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';

export default function NewOrders() {
    const router = useRouter();
    const [newOrders, setNewOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNewOrders = async () => {
            setLoading(true);
            try {
                const newOrdersData = await getOrders(5, "-createdAt");
                setNewOrders(newOrdersData);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchNewOrders();
    }, []);

    const orderDetailRouter = (orderId: string) => {
        router.push(`/orders/${orderId}`)
    }

    if (loading) return <Loader />;
    if (error) return <p>Error: {error}</p>;

  return (
    <div className={Style.newOrdersArea}>
      {newOrders.length > 0 ? (
        <div className={Style.orders}>
            <Table>
              <TableCaption>Last 5 New Orders</TableCaption>
              <TableHeader>
                <TableRow>
                 <TableHead className={Style.tableHead}>Created</TableHead>
                 <TableHead className={Style.tableHead}>Order Number</TableHead>
                 <TableHead className={Style.tableHead}>Products</TableHead>
                 <TableHead className={Style.tableHead}>Delivery</TableHead>
                 <TableHead className={Style.tableHead}>Status</TableHead>
                 <TableHead className={Style.tableHead}>Detail</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
              {newOrders.map((order) => (
                <TableRow>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell onClick={() => orderDetailRouter(order._id)} style={{cursor: 'pointer'}}>Click</TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
        </div>
      ) : (
        <p>No orders created yet.</p>
      )}
  </div>
  )
}