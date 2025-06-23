import { divider } from '@uiw/react-md-editor';
import React from 'react';

export const metadata = {
    title: 'About',
    openGraph: {
      images: ['/assets/Dark_Logo.png'],
    },
  };
  
export default function Layout({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>
}