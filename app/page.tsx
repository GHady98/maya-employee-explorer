import { Suspense } from 'react';
import EmployeeProfile from './employee-profile';
import RecentPosts from './recent-posts';
import PostExplorer from './post-explorer';
export default function Home() {
  return <><a href="#main" className="skip-link">Skip to dashboard</a><header className="site-header"><div className="brand"><span className="brand-icon" aria-hidden="true">e<span>·</span></span><span>Employee<span className="brand-light">Explorer</span></span></div><span className="assignment-label">TECHTALKS <span>/</span> ASSIGNMENT 03</span></header>
    <main id="main" className="page-shell"><section className="intro"><div><p className="eyebrow">A CLOSER LOOK AT THE PEOPLE BEHIND THE POSTS</p><h1>People, in focus<span>.</span></h1><p>One employee. A few stories. Explore the profile, preview recent posts,<br className="desktop-break" /> and choose when to discover more.</p></div><span className="interview-badge"><span aria-hidden="true">✦</span> Maya’s interview challenge</span></section>
      <div className="overview-grid"><section className="panel profile-panel" aria-labelledby="profile-title"><div className="panel-heading"><h2 id="profile-title">Employee profile</h2><span className="location-tag">Server</span></div><Suspense fallback={<div className="message" role="status">Loading employee profile…</div>}><EmployeeProfile /></Suspense></section>
      <section className="panel preview-panel" aria-labelledby="preview-title"><div className="panel-heading"><div><h2 id="preview-title">Recent posts</h2><p className="panel-subtitle">A preview of the latest three titles</p></div><span className="location-tag">Server</span></div><Suspense fallback={<div className="preview-loading" role="status" data-testid="preview-loading"><span className="spinner" aria-hidden="true" /><strong>Loading recent posts…</strong><p>The rest of your dashboard is ready to explore.</p><div className="skeleton" aria-hidden="true" /><div className="skeleton short" aria-hidden="true" /></div>}><RecentPosts /></Suspense><p className="simulation-label"><span aria-hidden="true">◷</span> Intentional learning simulation: 2-second server delay on each fresh request.</p></section></div>
      <PostExplorer />
      <footer><p>Sample users and posts from JSONPlaceholder. “Employees” are fictional interview data.</p><span>YEHIA MEETS MAYA / 03</span></footer>
    </main></>;
}
