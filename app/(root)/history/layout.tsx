import { divider } from '@uiw/react-md-editor';
import React from 'react';

export const metadata = {
    title: 'User-History',
    openGraph: {
      images: ['/assets/Dark_Logo.png'],
    },
    robots: {
      follow: true,
    }
  };
  
export default function Layout({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>
}