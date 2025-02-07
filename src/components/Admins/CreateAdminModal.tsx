'use client';
import React, { useState } from 'react'
import Style from './createadminmodal.module.css'
import { adminSignup } from '@/services/apiAdmins';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ModalArea from '../ui/ModalArea';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateAdminModal: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<RegisterForm>();
    const [showPassword, setShowPassword] = useState({ password: false, passwordConfirm: false });
    const [isLoading, setIsLoading] = useState(false);
  
    const togglePasswordVisibility = (field: 'password' | 'passwordConfirm') => {
      setShowPassword((prevState) => ({
        ...prevState,
        [field]: !prevState[field]
      }));
    };
  
    const onSubmit = async (data: RegisterForm) => {
      setIsLoading(true);
      try {
        await adminSignup(data);
        toast.success('New Admin Created');
        onSuccess();
        onClose();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <ModalArea onClose={onClose} isOpen={isOpen}>
     <div className={Style.registerFormArea}>
      <h2 className={Style.formTitle}>Create New Admin</h2>
      <form className={Style.registerForm} onSubmit={handleSubmit(onSubmit)}>

        <div className={Style.formInputGroup}>
          <label htmlFor="name">Name:</label>
          <input 
            disabled={isLoading} 
            type="text" 
            id="name"
            placeholder='Enter name...'
            {...register("name", {
              required: "Name is required."
            })}
          />
          <p className={Style.errorText}>{errors?.name?.message}</p>
        </div>

       <div className={Style.formInputGroup}>
         <label htmlFor="email">Email:</label>
         <input 
           disabled={isLoading} 
           type="email" 
           id="email"
           placeholder='Enter email...'
           {...register("email", {
             required: "Email is required.",
             pattern: {
               value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
               message: "Invalid email address."
             }
           })}
         />
         <p className={Style.errorText}>{errors?.email?.message}</p>
       </div>

       <div className={Style.formInputGroup}>
          <label htmlFor="password">Password:</label>
         <div className={Style.passInput}>
           <input 
             disabled={isLoading} 
             type={showPassword.password ? "text" : "password"} 
             id="password" 
             placeholder="********"
             className={Style.inputTypePass}
             {...register("password", {
               required: "Password is required.",
               minLength: {
                 value: 8,
                 message: "Password should be at least 8 characters long"
               }
             })}
           />
           <button
             type="button"
             onClick={() => togglePasswordVisibility('password')}
             className={Style.toggleButton}
           >
             {showPassword.password ? <FaEye /> : <FaEyeSlash />}
           </button>
         </div>
         <p className={Style.errorText}>{errors?.password?.message}</p>
       </div>

       <div className={Style.formInputGroup}>
         <label htmlFor="password-confirm">Confirm Password:</label>
         <div className={Style.passInput}>
           <input 
             disabled={isLoading} 
             className={Style.inputTypePass}
             type={showPassword.passwordConfirm ? "text" : "password"} 
             id="password-confirm" 
             placeholder="********"
             {...register("passwordConfirm", {
               required: "Please confirm your password.",
               validate: value => value === getValues().password || "Passwords must match"
             })}
           />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('passwordConfirm')}
              className={Style.toggleButton}
            >
              {showPassword.passwordConfirm ? <FaEye /> : <FaEyeSlash />}
           </button>
         </div>
         <p className={Style.errorText}>{errors?.passwordConfirm?.message}</p>
       </div>

       <button className={Style.btn} type="submit" disabled={isLoading}>Create</button>

      </form>
     </div>
    </ModalArea>
  )
}

export default CreateAdminModal;