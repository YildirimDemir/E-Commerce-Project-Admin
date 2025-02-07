'use client';
import React, { useEffect, useState } from 'react'
import Style from './admnins.module.css'
import PageHeader from '../ui/PageHeader';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IAdmin } from '@/models/adminModel';
import PageLoader from '../ui/PageLoader';
import { deleteAdmin, getAllAdmins } from '@/services/apiAdmins';
import { useRouter } from 'next/navigation';
import CreateAdminModal from './CreateAdminModal';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function Admins() {
    const { data: session, status } = useSession();
    const user = session?.user;
    const [admins, setAdmins] = useState<IAdmin[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const fetchedAdmins = await getAllAdmins();
        setAdmins(fetchedAdmins);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchAdmins();
    }, []);

    const handleDeleteAdmin = async (adminId: string) => {
      if (adminId === user?.id) {
        toast.error('You cannot delete your own account. Please go to the profile page to delete your account.');
        return;
      }
    
      try {
        await deleteAdmin(adminId);
        fetchAdmins();
        toast.success('Admin deleted successfully');
      } catch (error) {
        toast.error((error as Error).message || 'Failed to delete admin');
      }
    };
    
    const handleOpenModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    if (loading) return <PageLoader />;
    if (error) return <p>Error: {error}</p>;

  return (
    <div className={Style.adminsPage}>
        <CreateAdminModal isOpen={isModalOpen} onClose={handleOpenModal} onSuccess={fetchAdmins} />
        <PageHeader title='Admins'/>
        <button className={Style.createAdminBtn} onClick={handleOpenModal}>Create Admin</button>
            {admins.length > 0 ? (
                <div className={Style.adminsTable}>
                    <Table>
                      <TableCaption>Admins</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className={Style.tableHead}>Name</TableHead>
                          <TableHead className={Style.tableHead}>Email</TableHead>
                          <TableHead className={Style.tableHead}>Manage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {admins.map((admin) => (
                            <TableRow>
                                <TableCell className={Style.tableCell}>{admin.name}</TableCell>
                                <TableCell className={Style.tableCell}>{admin.email}</TableCell>
                                <TableCell className={Style.tableCell}><button onClick={() => handleDeleteAdmin(admin._id)}>Delete</button></TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </div>
            ) : (
                <p>No admin created yet.</p>
            )}
    </div>
  )
}