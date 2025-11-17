'use client'

import Link from 'next/link';

interface LinkButtonProps {
  href?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  classLink?: string;
  isActive?: boolean;
  classNameText?: string;
  [key: string]: any;
}

export const LinkButton = ({ href = '/', children, onClick, classLink, isActive, classNameText, props }: LinkButtonProps) => {
  return (
    <Link 
      href={href} 
      className={`btn-header-link rounded ${isActive ? 'link-active' : ''} ${classLink}`}
      onClick={onClick}
      {...props}
    >
      <div className={`whitespace-nowrap ${classNameText}`}>{children}</div>
    </Link>
  )
}