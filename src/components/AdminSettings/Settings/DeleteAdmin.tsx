'use client';

import React, { useEffect, useState } from 'react';
import Style from './deleteadmin.module.css';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useSession, signOut } from 'next-auth/react';
import { deleteSessionAccount } from '@/services/apiAdmins';

export default function DeleteAdmin() {
  const { data: session } = useSession();

  const mutation = useMutation({
    mutationFn: deleteSessionAccount,
    onError: (err: any) => toast.error(err.message),
    onSuccess: () => {
      toast.success('Account deleted successfully!');
      signOut();
    },
  });

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      mutation.mutate();
    }
  };

  if (!session?.user) {
    return <p>You must be logged in to delete your account.</p>;
  }

  return (
    <div className={Style.deleteArea}>
      <h3>Delete Account</h3>
        <p className='text-red-500'>
          Warning: Deleting your account is a permanent action and cannot be undone. All your data will be permanently removed.
        </p>
      
        <button
          type="button"
          className={Style.btn}
          onClick={handleDeleteAccount}
          disabled={mutation.status === 'pending'}
        >
          {mutation.status === 'pending' ? 'Deleting...' : 'Delete Account'}
        </button>
    </div>
  );
}