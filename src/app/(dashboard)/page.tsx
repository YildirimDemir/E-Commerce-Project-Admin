import Home from '@/components/Home/Home';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function page() {
  return (
    <Home />
  )
}