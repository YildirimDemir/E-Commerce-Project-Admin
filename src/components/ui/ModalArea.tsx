import React, { ReactNode } from 'react';
import Style from './modalarea.module.css';
import { FaTimes } from 'react-icons/fa';

interface ModalAreaProps {
  children: ReactNode; 
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalArea({ children, isOpen, onClose }: ModalAreaProps) {
  return (
    <div className={`${Style.modalArea} ${isOpen ? '' : Style.closed}`}>
      <button className={Style.closeModalBtn} onClick={onClose}><FaTimes /></button>
      {children}
    </div>
  );
}
