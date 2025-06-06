import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib';
import TasksBoard from './TasksBoard';

export default async function TasksPage() {
  const safeAuthOptions = authOptions || { providers: [] };
  const session = await getServerSession(safeAuthOptions);
  if (!session?.accessToken) redirect('/login');

  return <TasksBoard />;
}
