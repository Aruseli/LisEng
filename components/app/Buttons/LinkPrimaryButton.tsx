'use client'

import Link from 'next/link';

interface LinkPrimaryButtonProps {
  href: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  classText?: string;
  classLink?: string;
  [key: string]: any;
}

export const LinkPrimaryButton = ({ href, children, onClick, classText, classLink, props }: LinkPrimaryButtonProps) => {
  return (
    <Link 
      href={href} 
      className={`rounded ${classLink || 'btn-primary-link'}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </Link>
  )
}