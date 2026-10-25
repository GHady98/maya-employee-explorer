import { connection } from 'next/server';
import { delay, failureMessage, POSTS_URL, readPosts } from '@/lib/api';
export default async function RecentPosts() {
  await connection();
  // Intentional learning simulation: request-time delay, retained in production.
  await delay(2000);
  try {
    const posts = await readPosts(await fetch(POSTS_URL, {cache:'no-store',signal:AbortSignal.timeout(12000)}));
    return posts.length ? <ol className="preview-list" data-testid="preview-data">{posts.slice(0,3).map((post,index)=><li key={post.id}><span aria-hidden="true">0{index+1}</span><h3>{post.title}</h3></li>)}</ol> : <p className="message">No recent posts found.</p>;
  } catch(error) {
    return <div className="message error-message" role="alert"><strong>Preview could not load</strong><p>{failureMessage(error,'Recent posts')} Reload the page to retry this section.</p></div>;
  }
}
