'use client';
import React, { useEffect, useState } from 'react';
import Style from './home.module.css';
import { FaUser } from 'react-icons/fa';
import { FiShoppingCart, FiPackage } from "react-icons/fi";
import NewOrders from './NewOrders';

export default function Home() {
  const [stats, setStats] = useState<{
    productsCount: number;
    usersCount: number;
    ordersCount: number;
    totalIncome: number; 
    adminsCount: number;
  }>({ productsCount: 0, usersCount: 0, ordersCount: 0, totalIncome: 0, adminsCount: 0 });
  
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred'); 
      }
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className={Style.homePage}>
      <div className={Style.statsSection}>
        <h2>Summary</h2>
      <div className={Style.statsContainer}>
        <div className={Style.statBoxes}>
        <div className={Style.statBox}>
          <FaUser className={Style.boxIcon}/>
          <h3>{stats.adminsCount}</h3>
          <p>Admins</p>
        </div>
        <div className={Style.statBox}>
          <FaUser className={Style.boxIcon}/>
          <h3>{stats.usersCount}</h3>
          <p>Users</p>
        </div>
        <div className={Style.statBox}>
          <FiPackage className={Style.boxIcon}/>  
          <h3>{stats.productsCount}</h3>
          <p>Products</p>
        </div>
        <div className={Style.statBox}>
          <FiShoppingCart className={Style.boxIcon}/>  
          <h3>{stats.ordersCount}</h3>
          <p>Orders</p>
        </div>
        </div>
        <div className={Style.priceBox}> 
          <h3>${stats.totalIncome.toFixed(2)}</h3>
          <p>Total Income</p>
          {/* I will add chart for income*/}
        </div>
      </div>
        {error && <p className={Style.error}>{error}</p>}
      </div>
      <div className={Style.newOrdersArea}>
        <h2>New Orders</h2>
        <div className={Style.newOrders}>
            <NewOrders />
        </div>
      </div>
    </div>
  );
}