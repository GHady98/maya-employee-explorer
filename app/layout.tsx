import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Employee Explorer · Maya’s Interview',description:'Explore a sample employee and their posts, with independent server loading and browser request demos.'};
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>) {return <html lang="en"><body>{children}</body></html>;}
