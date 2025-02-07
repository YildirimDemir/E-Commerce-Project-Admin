import React from 'react';
import Style from './pageheader.module.css';

interface PageHeaderProps {
  title: string; 
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className={Style.pageHeader}>
      <h2>{title}</h2>
    </div>
  );
}