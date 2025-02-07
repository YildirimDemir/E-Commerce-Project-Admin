'use client';

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Style from './updateadmin.module.css';
import { updateAdminSettings } from '@/services/apiAdmins';

export default function UpdateAdmin() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [initialValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !user.id) return;
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await updateAdminSettings(user.id, name, email);
      setSuccessMessage('User info updated successfully!');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = name === initialValues.name && email === initialValues.email;

  return (
    <div className={Style.updateUserInfoArea}>
      <h3>User Info</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className={Style.inputBox}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter new name here..."
          />
        </div>
        <div className={Style.inputBox}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter new email here..."
          />
        </div>
        <button
          type="button"
          className={`${Style.btn} ${isButtonDisabled ? '' : Style.changed}`}
          onClick={handleSubmit}
          disabled={isLoading || isButtonDisabled}
        >
          {isLoading ? 'Updating...' : 'Confirm'}
        </button>
        {error && <p className={Style.errorMessage}>{error}</p>}
        {successMessage && <p className={Style.successMessage}>{successMessage}</p>}
      </form>
    </div>
  );
}
