'use client';
import React, { useEffect, useState } from 'react'
import Style from './users.module.css'
import PageHeader from '../ui/PageHeader';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IUser } from '@/models/userModel';
import { getAllUsers } from '@/services/apiUsers';
import { useRouter } from 'next/navigation';

export default function Users() {
    const router = useRouter();
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
       setLoading(true);
       try {
         const fetchedUsers = await getAllUsers();
         setUsers(fetchedUsers);
       } catch (error) {
         setError((error as Error).message);
       } finally {
         setLoading(false);
       }
    };
      
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUserDetail = (userId: string) => {
        router.push(`/users/${userId}`)
    }

  return (
    <div className={Style.usersPage}>
        <PageHeader title='Users'/>
            {users.length > 0 ? (
                <div className={Style.usersTable}>
                    <Table>
                      <TableCaption>Users</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className={Style.tableHead}>Name</TableHead>
                          <TableHead className={Style.tableHead}>Email</TableHead>
                          <TableHead className={Style.tableHead}>Orders</TableHead>
                          <TableHead className={Style.tableHead}>Manage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                            <TableRow>
                                <TableCell className={Style.tableCell}>{user.name}</TableCell>
                                <TableCell className={Style.tableCell}>{user.email}</TableCell>
                                <TableCell className={Style.tableCell}>{user.orders?.length}</TableCell>
                                <TableCell className={Style.tableCell}><button onClick={() => handleUserDetail(user._id)}>Detail</button></TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </div>
        ) : (
            <p>No user created yet.</p>
        )}
    </div>
  )
}