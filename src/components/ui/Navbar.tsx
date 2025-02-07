'use client';
import React from 'react'
import Style from './navbar.module.css'
import Image from 'next/image';
import Logo from '../../../public/images/nora-logo.png';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import { adminLogout } from '@/services/apiAdmins';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await adminLogout();
            router.push("/login");
        } catch (error) {
            console.error(error);
        }
    };
  return (
    <div className={Style.navbar}>
        <div className={Style.logo}>
            <Image src={Logo} alt='' className={Style.logoImg} onClick={() => router.push('/')} />
        </div>
        <div className={Style.navMenu}>
            <Link href='/products' className={Style.navLink}>Products</Link>
            <Link href='/orders' className={Style.navLink}>Orders</Link>
            <Link href='/users' className={Style.navLink}>Users</Link>
            <Link href='/admins' className={Style.navLink}>Admins</Link>
        </div>
        <div className={Style.userMenu}>
            <Link href='/account' className={Style.navLinkIcon}><FaUser /></Link>
            <button onClick={handleLogout} className={Style.logoutBtn}><FaSignOutAlt /></button>
        </div>
    </div>
  )
}