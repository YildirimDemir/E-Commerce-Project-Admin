import { IUser } from "@/models/userModel";
import { signIn, signOut } from "next-auth/react";

export const getAllUsers = async (): Promise<IUser[]> => {
    try {
      const response = await fetch("/api/users", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
  
      const users: IUser[] = await response.json();
  
      if (!users) {
        throw new Error('No users found.');
      }
  
      return users;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred.');
    }
};

export const getUserById = async (userId: string): Promise<IUser> => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user');
      }
  
      const user: IUser = await response.json();
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred.');
    }
};