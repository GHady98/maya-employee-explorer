'use client';
import { useRef, useState } from 'react';
import { delay, failureMessage, POSTS_URL, readPosts, type Post } from '@/lib/api';
import type { Scenario } from '@/lib/scenario';
type ExplorerState = {status:'idle'|'loading'} | {status:'success';posts:Post[]} | {status:'empty'} | {status:'error';message:string};
export default function PostExplorer() {
  const [scenario,setScenario] = useState<Scenario>('success');
  const [state,setState] = useState<ExplorerState>({status:'idle'});
  const inFlight = useRef(false);
  const loading = state.status === 'loading';
  async function loadPosts() {
    if(inFlight.current) return;
    inFlight.current = true;
    setState({status:'loading'});
    try {
      if(scenario === 'slow') await delay(2000);
      // Local simulations still pass through the exact same HTTP/JSON checks.
      const response = scenario === 'http-error'
        ? new Response(JSON.stringify({message:'Simulated service unavailable'}),{status:503,headers:{'Content-Type':'application/json'}})
        : scenario === 'empty'
          ? new Response('[]',{status:200,headers:{'Content-Type':'application/json'}})
          : await fetch(POSTS_URL,{signal:AbortSignal.timeout(12000)});
      const posts = await readPosts(response);
      setState(posts.length ? {status:'success',posts} : {status:'empty'});
    } catch(error) {
      setState({status:'error',message:failureMessage(error,'Posts')});
    } finally {
      inFlight.current = false;
    }
  }
  return <section className="explorer panel" aria-labelledby="explorer-title">
    <div className="panel-heading"><div><p className="eyebrow">ON YOUR TERMS</p><h2 id="explorer-title">Explore all posts</h2></div><span className="location-tag browser-tag"><span aria-hidden="true">↗</span> Browser</span></div>
    <p className="section-description">The full story, when you’re ready. Load this employee’s post titles and bodies on demand.</p>
    <div className="demo-toolbar"><div className="scenario-field"><label htmlFor="scenario">Demo scenario</label><select id="scenario" value={scenario} disabled={loading} onChange={event=>setScenario(event.target.value as Scenario)}><option value="success">Success · real API</option><option value="slow">Slow · 2s delay + real API</option><option value="http-error">HTTP error · simulated 503</option><option value="empty">Empty · simulated response</option></select></div><button type="button" onClick={loadPosts} disabled={loading}>{loading ? 'Loading posts…' : state.status === 'error' ? 'Retry' : state.status === 'idle' ? 'Load posts' : 'Load posts again'}<span aria-hidden="true">{loading ? '◌' : '→'}</span></button></div>
    <p className="demo-note">Learning simulations: Slow waits two seconds before the real request. HTTP error and Empty use local responses. Your selection applies to the next load or retry, only in this section.</p>
    <div className="request-status" role="status" aria-live="polite" aria-atomic="true">{state.status === 'idle' ? 'Ready when you are. No browser posts request has started.' : state.status === 'loading' ? 'Loading posts. Please wait; another request cannot start yet.' : state.status === 'success' ? `${state.posts.length} posts loaded.` : state.status === 'empty' ? 'No posts found.' : `Request failed. ${state.message}`}</div>
    <div className="explorer-result" aria-busy={loading}>
      {state.status === 'idle' && <div className="empty-illustration"><span aria-hidden="true">≡</span><h3>A little curiosity goes a long way.</h3><p>Choose a scenario, then select Load posts.</p></div>}
      {state.status === 'loading' && <div className="message loading-message"><span className="spinner" aria-hidden="true" /><p>Fetching the full post collection…</p></div>}
      {state.status === 'error' && <div className="message error-message"><strong>We couldn’t load the posts.</strong><p>{state.message}</p><p>Choose Success and select Retry to test recovery.</p></div>}
      {state.status === 'empty' && <div className="message empty-message"><strong>No posts found</strong><p>This simulated empty response succeeded, but contained no posts. Choose another scenario to continue.</p></div>}
      {state.status === 'success' && <ol className="full-posts">{state.posts.map(post=><li key={post.id}><span className="post-number">POST {String(post.id).padStart(2,'0')}</span><h3>{post.title}</h3><p>{post.body}</p></li>)}</ol>}
    </div>
  </section>;
}
