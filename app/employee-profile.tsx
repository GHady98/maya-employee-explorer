import { connection } from 'next/server';
import { failureMessage, PROFILE_URL, readEmployee } from '@/lib/api';
export default async function EmployeeProfile() {
  await connection();
  try {
    const employee = await readEmployee(await fetch(PROFILE_URL, { cache:'no-store', signal:AbortSignal.timeout(12000) }));
    const initials = employee.name.split(' ').map(part => part[0]).slice(0,2).join('');
    return <div data-testid="profile-data"><div className="profile-person"><div className="avatar" aria-hidden="true">{initials}</div><div><span className="micro-label">EMPLOYEE 01</span><h3>{employee.name}</h3><p>Sample employee profile</p></div></div><dl className="profile-details"><div><dt>Email address</dt><dd><a href={`mailto:${employee.email}`}>{employee.email}</a></dd></div><div><dt>Company</dt><dd>{employee.company.name}</dd></div><div><dt>Source</dt><dd>JSONPlaceholder / users / 1</dd></div></dl></div>;
  } catch (error) {
    return <div className="message error-message" role="alert"><strong>Profile could not load</strong><p>{failureMessage(error, 'Employee profile')} Reload the page to retry this section.</p></div>;
  }
}
