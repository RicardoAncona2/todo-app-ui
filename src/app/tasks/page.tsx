import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib';
import TasksBoard from './TasksBoard';

export default async function TasksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) redirect('/login');

  return <TasksBoard />;
}
