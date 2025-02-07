import { IAdmin } from "@/models/adminModel";
import { signIn, signOut } from "next-auth/react";

export const getAllAdmins = async (): Promise<IAdmin[]> => {
    try {
      const response = await fetch("/api/admins", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }
  
      const admins: IAdmin[] = await response.json();
  
      if (!admins) {
        throw new Error('No admins found.');
      }
  
      return admins;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred.');
    }
};

export const getAdminById = async (adminId: string): Promise<IAdmin> => {
    try {
      const response = await fetch(`/api/admins/${adminId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch admin');
      }
  
      const admin: IAdmin = await response.json();
      return admin;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred.');
    }
};
  

export async function adminLogin(data: { email: string, password: string }) {
    const { email, password } = data;

    const result = await signIn("credentials", {
        redirect: false,
        email,
        password
    });

    if (result?.error) throw new Error("Email or password wrong...");
}


export async function adminLogout() {
    await signOut();
}

export async function adminSignup(newAdmin: { name: string, email: string, password: string, passwordConfirm: string }) {
    try {

        const res = await fetch("/api/admins", {
            method: "POST",
            body: JSON.stringify({
                name: newAdmin.name,
                email: newAdmin.email,
                password: newAdmin.password,
                passwordConfirm: newAdmin.passwordConfirm,
            }),
            headers: {
                "Content-type": "application/json",
            }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to create a admin");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const updateAdminSettings = async (adminId: string, name: string, email: string): Promise<IAdmin> => {
    try {
      const response = await fetch(`/api/admins/${adminId}/admin-settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update admin settings');
      }
  
      const updatedAdmin: IAdmin = await response.json();
      return updatedAdmin;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred.');
    }
  };

export const updatePassword = async ( adminId: string, passwordCurrent: string, newPassword: string, passwordConfirm: string ): Promise<string> => {
    try {
      const response = await fetch(`/api/admins/${adminId}/update-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passwordCurrent, newPassword, passwordConfirm }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }
  
      const data = await response.json();
      return data.message;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred.');
    }
};
  
export const deleteAdmin = async (adminId: string): Promise<IAdmin> => {
    try {
      const response = await fetch(`/api/admins/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete admin');
      }
  
      const admin: IAdmin = await response.json();
      return admin;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred.');
    }
};
  

export const deleteSessionAccount = async (): Promise<{ message: string }> => {
    try {
        const res = await fetch(`/api/auth/delete-account`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Failed to delete account');
        }

        return data;
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
};