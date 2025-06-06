import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import TasksPageClient from './TasksPages';

export default async function TasksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) redirect('/login');

  return <TasksPageClient />;
}
