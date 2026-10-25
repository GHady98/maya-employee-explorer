import { Suspense } from 'react';
import EmployeeProfile from './employee-profile';
import RecentPosts from './recent-posts';
export default function Home() {return <main><h1>Employee Explorer</h1><Suspense fallback={<p>Loading employee profile…</p>}><EmployeeProfile /></Suspense><h2>Recent posts</h2><Suspense fallback={<p>Loading recent posts… Intentional two-second demo delay.</p>}><RecentPosts /></Suspense></main>;}
