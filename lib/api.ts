export const EMPLOYEE_ID = 1;
export const API_ROOT = 'https://jsonplaceholder.typicode.com';
export const PROFILE_URL = `${API_ROOT}/users/${EMPLOYEE_ID}`;
export const POSTS_URL = `${API_ROOT}/posts?userId=${EMPLOYEE_ID}`;
export type Post = { id: number; userId: number; title: string; body: string };
export type Employee = { id: number; name: string; email: string; company: { name: string } };
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
export async function readJson(response: Response): Promise<unknown> {
  if (!response.ok) throw new ApiError('The data service could not complete this request.', response.status);
  return response.json();
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
export async function readEmployee(response: Response): Promise<Employee> {
  const value = await readJson(response);
  if (!isRecord(value) || typeof value.id !== 'number' || typeof value.name !== 'string' || typeof value.email !== 'string' || !isRecord(value.company) || typeof value.company.name !== 'string') throw new Error('Unexpected employee data.');
  return value as Employee;
}
export async function readPosts(response: Response): Promise<Post[]> {
  const value = await readJson(response);
  if (!Array.isArray(value) || !value.every(post => isRecord(post) && typeof post.id === 'number' && typeof post.userId === 'number' && typeof post.title === 'string' && typeof post.body === 'string')) throw new Error('Unexpected post data.');
  return value as Post[];
}
export function failureMessage(error: unknown, section: string): string {
  if (error instanceof ApiError) return `${section} is unavailable (HTTP ${error.status}). Please try again.`;
  if (error instanceof TypeError || (error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name))) return `${section} could not connect to the data service. Check your connection and try again.`;
  return `${section} could not be read. Please try again.`;
}
export const delay = (milliseconds: number) => new Promise<void>(resolve => setTimeout(resolve, milliseconds));
