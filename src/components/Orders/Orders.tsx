'use client';
import React, { useEffect, useState } from 'react';
import Style from './orders.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { IOrder } from '@/models/orderModel';
import { getOrders } from '@/services/apiOrders';
import PageLoader from '../ui/PageLoader';
import PageHeader from '../ui/PageHeader';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FaSearch } from 'react-icons/fa';

const ITEMS_PER_PAGE = 10;

export default function Orders() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [totalOrders, setTotalOrders] = useState<number>(0);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersData = await getOrders();
        setOrders(ordersData);
        setFilteredOrders(ordersData); 
        setTotalOrders(ordersData.length); 
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) =>
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.status.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [search, orders]);

  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

  const orderDetailRouter = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (page: number) => {
    router.push(`/orders?page=${page}`);
  };

  if (loading) return <PageLoader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={Style.ordersPage}>
      <PageHeader title="Orders" />
      <div className={Style.searchBar}>
        <div className={Style.icon}>
          <FaSearch />
        </div>
        <input
          type="text"
          placeholder="Search by order number or status..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <div className={Style.ordersArea}>
        {paginatedOrders.length > 0 ? (
          <div className={Style.ordersTable}>
            <Table>
              <TableCaption>All Orders</TableCaption>
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
                {paginatedOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className={Style.tableCell}>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className={Style.tableCell}>{order.orderNumber}</TableCell>
                    <TableCell className={Style.tableCell}>{order.items.length}</TableCell>
                    <TableCell className={Style.tableCell}>
                      {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className={`${Style.tableCell} ${Style[order.status.toLowerCase()]}`}>{order.status}</TableCell>
                    <TableCell className={Style.tableCell} onClick={() => orderDetailRouter(order._id)} style={{ cursor: 'pointer' }}>
                      Click
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className={Style.pagination}>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`${Style.pageButton} ${currentPage === index + 1 ? Style.active : ""}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p>No matching orders found.</p>
        )}
      </div>
    </div>
  );
}
